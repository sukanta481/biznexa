'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useReducedMotionSafe } from '@/components/ui/Animations';

// ── Types ────────────────────────────────────────────────────────────────────

interface ConversationListItem {
  id: number;
  waId: string;
  profileName: string | null;
  aiEnabled: boolean;
  unreadCount: number;
  lastMessageAt: string | null;
  windowOpen: boolean;
  preview: string | null;
}

interface ConversationDetail {
  id: number;
  waId: string;
  profileName: string | null;
  aiEnabled: boolean;
  windowOpen: boolean;
  lastInboundAt: string | null;
}

interface ChatMessage {
  id: number;
  conversation_id: number;
  direction: 'in' | 'out';
  type: string;
  text_body: string | null;
  media_path: string | null;
  media_mime: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  error_text: string | null;
  sent_by: number | null;
  created_at: string;
}

const POLL_INTERVAL_MS = 5_000;
const CLOSED_WINDOW_MESSAGE =
  'The 24-hour reply window has closed. WhatsApp only allows an approved template message now.';

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function displayName(c: ConversationListItem | ConversationDetail): string {
  return c.profileName?.trim() || c.waId;
}

/** Inline image when the media is an image; download link for everything else. */
function renderMedia(m: ChatMessage): React.ReactNode {
  const path = m.media_path;
  if (!path) return null;
  const mime = m.media_mime ?? '';
  const isImage = mime.startsWith('image/') || /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(path);
  const label = mime || 'Download media';
  if (isImage) {
    return (
      <a href={path} target="_blank" rel="noopener noreferrer" className="block mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin tool, intentionally <img> */}
        <img
          src={path}
          alt={m.text_body ?? 'WhatsApp media'}
          className="rounded-lg max-w-full max-h-64 object-cover border border-white/10"
        />
      </a>
    );
  }
  return (
    <a
      href={path}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 mb-2 text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
    >
      <span className="material-symbols-outlined text-[18px]">attachment</span>
      {label}
    </a>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ChatClient() {
  const reduceMotion = useReducedMotionSafe();
  const transitionClass = reduceMotion ? '' : 'transition-colors duration-200';

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [active, setActive] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [togglingAi, setTogglingAi] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const cursorRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  // ── Load conversation list ─────────────────────────────────────────────────
  const loadList = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chat/conversations', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load conversations.');
      const json = (await res.json()) as { conversations: ConversationListItem[] };
      setConversations(json.conversations ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations.');
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // ── Select a conversation ──────────────────────────────────────────────────
  const openConversation = useCallback(async (id: number) => {
    setActiveId(id);
    setMobileShowThread(true);
    setLoadingThread(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/chat/conversations/${id}/messages`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load thread.');
      const json = (await res.json()) as {
        conversation: ConversationDetail;
        messages: ChatMessage[];
      };
      setActive(json.conversation);
      setMessages(json.messages ?? []);
      // Local optimistic unread clear so the sidebar updates before the next poll.
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)));
      // Advance cursor past anything already seen so the poll doesn't re-inject these.
      const maxId = json.messages?.length ? Math.max(...json.messages.map((m) => m.id)) : 0;
      if (maxId > cursorRef.current) cursorRef.current = maxId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load thread.');
    } finally {
      setLoadingThread(false);
    }
  }, []);

  // ── Auto-scroll thread to bottom on new messages ───────────────────────────
  useEffect(() => {
    const node = endOfMessagesRef.current;
    if (node) node.scrollIntoView({ block: 'end' });
  }, [messages]);

  // ── Long-poll for updates (pauses when document.hidden) ────────────────────
  const poll = useCallback(async () => {
    if (typeof document !== 'undefined' && document.hidden) return;
    try {
      const since = cursorRef.current;
      const res = await fetch(`/api/admin/chat/updates?since=${since}`, { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as {
        messages: ChatMessage[];
        cursor: number;
      };
      const newMessages = json.messages ?? [];
      if (newMessages.length > 0) {
        if (activeId !== null) {
          setMessages((prev) => {
            const mine = newMessages
              .filter((m) => m.conversation_id === activeId)
              .map((m) => ({ ...m, status: m.status ?? 'sent' }) as ChatMessage);
            if (mine.length === 0) return prev;
            const seen = new Set(prev.map((m) => m.id));
            const fresh = mine.filter((m) => !seen.has(m.id));
            return fresh.length ? [...prev, ...fresh] : prev;
          });
        }
        // Refresh the list so previews / unread counts update, then bump the cursor.
        await loadList();
      }
      if (typeof json.cursor === 'number' && json.cursor > cursorRef.current) {
        cursorRef.current = json.cursor;
      }
    } catch {
      // silent — next tick retries
    }
  }, [activeId, loadList]);

  useEffect(() => {
    function schedule() {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      pollTimerRef.current = setTimeout(() => {
        poll().finally(() => schedule());
      }, POLL_INTERVAL_MS);
    }
    schedule();

    function onVisibility() {
      if (!document.hidden) {
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
        poll().finally(() => schedule());
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [poll]);

  // ── Send a reply ───────────────────────────────────────────────────────────
  const sendReply = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (activeId === null || !active) return;
      const text = draft.trim();
      if (!text) return;
      if (!active.windowOpen) return;
      setSending(true);
      setError('');
      try {
        const res = await fetch(`/api/admin/chat/conversations/${activeId}/messages`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const json = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          waMessageId?: string;
          error?: string;
        };
        if (!res.ok) {
          setError(json.error ?? `Failed to send (HTTP ${res.status}).`);
          return;
        }
        setDraft('');
        // Re-open the thread to pick up the freshly-stored outbound row + the
        // aiEnabled=false state change.
        await openConversation(activeId);
        await loadList();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send.');
      } finally {
        setSending(false);
      }
    },
    [active, activeId, draft, openConversation, loadList],
  );

  // ── AI toggle ───────────────────────────────────────────────────────────────
  const toggleAi = useCallback(
    async (enabled: boolean) => {
      if (activeId === null) return;
      setTogglingAi(true);
      try {
        const res = await fetch(`/api/admin/chat/conversations/${activeId}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ aiEnabled: enabled }),
        });
        if (!res.ok) {
          const json = (await res.json().catch(() => ({}))) as { error?: string };
          setError(json.error ?? 'Failed to update AI setting.');
          return;
        }
        setActive((prev) => (prev ? { ...prev, aiEnabled: enabled } : prev));
        setConversations((prev) => prev.map((c) => (c.id === activeId ? { ...c, aiEnabled: enabled } : c)));
      } finally {
        setTogglingAi(false);
      }
    },
    [activeId],
  );

  // ── Derived ────────────────────────────────────────────────────────────────
  const sortedConversations = useMemo(() => {
    // Server already sorts by last_message_at; keep stability for re-renders.
    return [...conversations];
  }, [conversations]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header — matches the leads page vocabulary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-headline font-bold tracking-tight text-on-surface cyber-glow-cyan uppercase">
            WhatsApp Inbox
          </h2>
          <p className="text-slate-400 text-sm font-body">
            Live WhatsApp Business conversations. The AI steps aside the moment you reply.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Two-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 lg:gap-6 min-h-[60vh]">
        {/* ─── Conversation list pane ─── */}
        <aside
          className={`bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl overflow-hidden flex flex-col ${
            mobileShowThread && activeId !== null ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-cyan-400">_forum</span>
            <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-400">
              Conversations
            </span>
          </div>
          <div className="flex-1 overflow-y-auto sidebar-scroll">
            {loadingList ? (
              <div className="p-6 text-sm text-slate-400">Loading conversations…</div>
            ) : sortedConversations.length === 0 ? (
              <div className="p-6 text-sm text-slate-400">No conversations yet.</div>
            ) : (
              <ul className="divide-y divide-white/5">
                {sortedConversations.map((c) => {
                  const isActive = c.id === activeId;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => openConversation(c.id)}
                        className={`w-full text-left px-4 py-3 ${transitionClass} ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/[0.12] to-blue-500/[0.06] text-on-surface'
                            : 'text-slate-300 hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold truncate">{displayName(c)}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {c.unreadCount > 0 && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/20">
                                {c.unreadCount}
                              </span>
                            )}
                            {c.aiEnabled ? (
                              <span
                                title="AI is handling this contact"
                                className="material-symbols-outlined text-[14px] text-cyan-400"
                              >
                                smart_toy
                              </span>
                            ) : (
                              <span
                                title="AI paused — a human is handling this"
                                className="material-symbols-outlined text-[14px] text-slate-500"
                              >
                                pause
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {c.preview ?? (c.windowOpen ? 'Start a reply' : 'Window closed')}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* ─── Thread pane ─── */}
        <section
          className={`bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl overflow-hidden flex flex-col ${
            mobileShowThread && activeId !== null ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {activeId === null ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl text-slate-700 mb-2 block">chat</span>
              <p className="text-sm">Select a conversation to view the thread.</p>
            </div>
          ) : loadingThread || !active ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-500">
              <div className="w-9 h-9 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin mb-3" />
              <p className="text-sm">Loading thread…</p>
            </div>
          ) : (
            <>
              {/* Thread header: back button (mobile), contact, AI toggle */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileShowThread(false);
                    setActiveId(null);
                    setActive(null);
                    setMessages([]);
                  }}
                  className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white"
                  aria-label="Back to conversations"
                >
                  <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-on-surface truncate">{displayName(active)}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{active.waId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAi(!active.aiEnabled)}
                  disabled={togglingAi}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg ${transitionClass} ${
                    active.aiEnabled
                      ? 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/20 hover:bg-cyan-500/20'
                      : 'bg-white/[0.03] text-slate-400 ring-1 ring-white/10 hover:bg-white/[0.06]'
                  } disabled:opacity-50`}
                  title={
                    active.aiEnabled
                      ? 'AI is answering this contact automatically. Click to pause it.'
                      : 'AI is paused. Click to let it answer this contact automatically.'
                  }
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {active.aiEnabled ? 'smart_toy' : 'pause'}
                  </span>
                  <span className="hidden sm:inline">
                    {active.aiEnabled ? 'AI ON' : 'AI OFF'}
                  </span>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 sidebar-scroll">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl text-slate-700 mb-2 block">
                      forum
                    </span>
                    <p className="text-sm">No messages yet.</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const inbound = m.direction === 'in';
                    const failed = m.status === 'failed';
                    const senderLabel =
                      !inbound && m.sent_by === null
                        ? 'AI Assistant'
                        : !inbound && m.sent_by !== null
                          ? 'You'
                          : '';
                    return (
                      <div
                        key={m.id}
                        className={`flex ${inbound ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${transitionClass} ${
                            failed
                              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-200'
                              : inbound
                                ? 'bg-white/[0.04] border border-white/5 text-slate-200'
                                : 'bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-cyan-500/20 text-on-surface'
                          }`}
                        >
                          {senderLabel && (
                            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80 mb-1">
                              {senderLabel}
                            </p>
                          )}
                          {m.media_path && renderMedia(m)}
                          {m.text_body && (
                            <p className="text-sm whitespace-pre-wrap break-words">{m.text_body}</p>
                          )}
                          {failed && m.error_text && (
                            <p className="text-[11px] text-rose-300 mt-1.5 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">error</span>
                              {m.error_text}
                            </p>
                          )}
                          <p
                            className={`text-[10px] mt-1 ${
                              failed ? 'text-rose-400/70' : 'text-slate-500'
                            }`}
                          >
                            {formatTime(m.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={endOfMessagesRef} />
              </div>

              {/* Composer */}
              {active.windowOpen ? (
                <form
                  onSubmit={sendReply}
                  className="px-4 py-3 border-t border-white/5 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a reply…"
                    className="flex-1 bg-white/5 border border-white/5 rounded-lg py-2.5 px-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              ) : (
                <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2 text-amber-300 text-xs">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <p>{CLOSED_WINDOW_MESSAGE}</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
