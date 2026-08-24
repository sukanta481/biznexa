"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Send, User, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message";
import { COMPANY } from "@/lib/constants";
import { getChatbotGreeting, type ChatbotLink, type ChatbotReply } from "@/lib/chatbot";
import { cn } from "@/lib/utils";

type ChatEntry = {
  id: string;
  role: "user" | "assistant";
  text: string;
  suggestions: string[];
  links: ChatbotLink[];
};

const ASSISTANT_AVATAR = "/images/logo.png";

const EMPTY_LEAD = { name: "", email: "", message: "" };

let entryCounter = 0;
function nextId() {
  entryCounter += 1;
  return `msg-${entryCounter}`;
}

function toEntry(role: ChatEntry["role"], reply: Partial<ChatbotReply> & { text: string }): ChatEntry {
  return {
    id: nextId(),
    role,
    text: reply.text,
    suggestions: reply.suggestions ?? [],
    links: reply.links ?? [],
  };
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [lead, setLead] = useState(EMPTY_LEAD);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Seed the greeting the first time the panel is opened, not on page load.
  useEffect(() => {
    if (open && entries.length === 0) {
      setEntries([toEntry("assistant", getChatbotGreeting())]);
    }
  }, [open, entries.length]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, pending, leadFormOpen]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || pending) return;

    setEntries((current) => [...current, toEntry("user", { text })]);
    setInput("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "The assistant is unavailable right now.");
      }

      const reply: ChatbotReply = result.reply;
      setEntries((current) => [...current, toEntry("assistant", reply)]);
      if (reply.action === "lead-form") {
        setLeadFormOpen(true);
      }
    } catch (error) {
      setEntries((current) => [
        ...current,
        toEntry("assistant", {
          text:
            error instanceof Error
              ? `${error.message} You can still reach us on WhatsApp or at ${COMPANY.email}.`
              : "Something went wrong. Please try again.",
          links: [{ label: "Chat on WhatsApp", href: COMPANY.whatsapp }],
        }),
      ]);
    } finally {
      setPending(false);
    }
  };

  const submitLead = async (event: React.FormEvent) => {
    event.preventDefault();
    setLeadSubmitting(true);
    setLeadError("");
    const firstName = lead.name.trim().split(" ")[0];

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, source: "chatbot" }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to send your details right now.");
      }

      setLead(EMPTY_LEAD);
      setLeadFormOpen(false);
      setEntries((current) => [
        ...current,
        toEntry("assistant", {
          text: `Thanks ${firstName}! Your details are with the team — they usually reply within one working day. Need it faster? WhatsApp is quickest.`,
          suggestions: ["What services do you offer?", "View pricing"],
          links: [{ label: "Chat on WhatsApp", href: COMPANY.whatsapp }],
        }),
      ]);
    } catch (error) {
      setLeadError(
        error instanceof Error ? error.message : "Unable to send your details right now.",
      );
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          setHasOpened(true);
        }}
        aria-expanded={open}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        className="relative bg-primary text-on-primary p-3.5 rounded-full shadow-[0_0_25px_rgba(0,255,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
      >
        {!hasOpened && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping"
          />
        )}
        <Bot className="relative w-6 h-6 md:w-7 md:h-7" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${COMPANY.name} chat assistant`}
          className={cn(
            "fixed z-[70] bottom-6 right-6 md:bottom-12 md:right-8",
            "flex w-[calc(100vw-3rem)] sm:w-[23rem] flex-col overflow-hidden",
            "h-[min(75vh,34rem)] max-h-[calc(100vh-3rem)]",
            "rounded-xl border border-outline-variant/30 bg-surface-container/95 backdrop-blur-xl",
            "shadow-[0_0_40px_rgba(0,255,102,0.12)]",
          )}
        >
          <header className="flex items-center gap-3 border-b border-outline-variant/20 bg-surface-container-high/60 px-4 py-3">
            <Avatar className="size-9 ring-1 ring-primary/30">
              <AvatarFallback className="bg-primary/15 text-primary">
                <Bot className="size-4" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-headline text-sm font-bold text-on-surface">Nexa</p>
              <p className="flex items-center gap-1.5 text-[0.6875rem] text-on-surface-variant">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                {COMPANY.name} assistant
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-white/5 hover:text-on-surface"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>

          <div ref={scrollRef} className="sidebar-scroll flex-1 overflow-y-auto px-4 py-1">
            {entries.map((entry) => (
              <div key={entry.id}>
                <Message from={entry.role} className="py-2">
                  <MessageContent className="whitespace-pre-line group-[.is-assistant]:bg-surface-container-highest group-[.is-assistant]:text-on-surface">
                    {entry.text}
                  </MessageContent>
                  {entry.role === "assistant" ? (
                    <MessageAvatar src={ASSISTANT_AVATAR} name="Nexa" className="ring-primary/30" />
                  ) : (
                    <Avatar className="size-8 ring-1 ring-border">
                      <AvatarFallback className="bg-surface-container-highest text-on-surface-variant">
                        <User className="size-4" aria-hidden="true" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </Message>

                {(entry.links.length > 0 || entry.suggestions.length > 0) && (
                  <div className="mb-3 ml-10 flex flex-wrap gap-2">
                    {entry.links.map((link) =>
                      link.href.startsWith("http") ? (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/20"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/20"
                        >
                          {link.label}
                        </Link>
                      ),
                    )}
                    {entry.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void send(suggestion)}
                        disabled={pending}
                        className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs text-on-surface-variant transition-colors hover:border-primary/40 hover:text-on-surface disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {pending && (
              <Message from="assistant" className="py-2">
                <MessageContent className="group-[.is-assistant]:bg-surface-container-highest">
                  <span className="flex items-center gap-1" aria-label="Nexa is typing">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="size-1.5 rounded-full bg-on-surface-variant motion-safe:animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </span>
                </MessageContent>
                <MessageAvatar src={ASSISTANT_AVATAR} name="Nexa" className="ring-primary/30" />
              </Message>
            )}

            {leadFormOpen && (
              <form
                onSubmit={submitLead}
                className="mb-4 space-y-3 rounded-xl border border-outline-variant/30 bg-surface-container-high/60 p-4"
              >
                <p className="font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">
                  Your details
                </p>
                <input
                  required
                  minLength={2}
                  value={lead.name}
                  onChange={(event) => setLead({ ...lead, name: event.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-sm border-none bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none transition-all focus:ring-1 focus:ring-primary/30"
                />
                <input
                  required
                  type="email"
                  value={lead.email}
                  onChange={(event) => setLead({ ...lead, email: event.target.value })}
                  placeholder="Email address"
                  className="w-full rounded-sm border-none bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none transition-all focus:ring-1 focus:ring-primary/30"
                />
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  value={lead.message}
                  onChange={(event) => setLead({ ...lead, message: event.target.value })}
                  placeholder="What are you building?"
                  className="w-full resize-none rounded-sm border-none bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none transition-all focus:ring-1 focus:ring-primary/30"
                />
                {leadError && <p className="text-xs text-error">{leadError}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {leadSubmitting && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
                    {leadSubmitting ? "Sending" : "Send to the team"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadFormOpen(false)}
                    className="rounded-lg border border-outline-variant/40 px-3 py-2 text-xs text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-outline-variant/20 bg-surface-container-high/40 px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about services, pricing…"
              aria-label="Message"
              maxLength={1000}
              className="min-w-0 flex-1 rounded-sm border-none bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:ring-1 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label="Send message"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
