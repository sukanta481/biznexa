'use client';

import {
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  ChevronDown,
  Database,
  Eye,
  EyeOff,
  HardDrive,
  KeyRound,
  Loader2,
  Mail,
  MessageCircle,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { useReducedMotionSafe } from '@/components/ui/Animations';

type Provider = 'whatsapp' | 'smtp' | 's3';

type FieldSource = 'database' | 'env' | 'unset';

interface FieldMeta {
  set: boolean;
  preview?: string;
  value?: string;
  source: FieldSource;
}

interface ProviderView {
  provider: Provider;
  fields: Record<string, FieldMeta>;
  lastVerifiedAt: string | null;
  verifyError: string | null;
  updatedAt: string | null;
}

interface IntegrationsResponse {
  ok: boolean;
  encryptionConfigured: boolean;
  providers: ProviderView[];
}

const PROVIDER_TITLES: Record<Provider, { title: string; description: string; Icon: React.ComponentType<{ className?: string }> }> = {
  whatsapp: {
    title: 'WhatsApp Cloud API',
    description: 'Outbound chat, ingest secret for n8n, and the verified phone number ID.',
    Icon: MessageCircle,
  },
  smtp: {
    title: 'Email (SMTP)',
    description: 'Transactional email for the contact form. Authenticated relay credentials.',
    Icon: Mail,
  },
  s3: {
    title: 'File storage (S3)',
    description: 'Durable media storage for uploads and WhatsApp media. Required in production.',
    Icon: HardDrive,
  },
};

const PROVIDER_FIELDS: Record<Provider, { key: string; label: string; hint?: string; secret?: boolean }[]> = {
  whatsapp: [
    { key: 'token', label: 'Access token', hint: 'Permanent Meta system-user token.', secret: true },
    { key: 'phoneNumberId', label: 'Phone number ID', hint: 'Found in Meta Business > WhatsApp > API Setup.' },
    { key: 'ingestSecret', label: 'Ingest secret', hint: 'Shared with the n8n "x-ingest-secret" header.', secret: true },
  ],
  smtp: [
    { key: 'host', label: 'Host', hint: 'e.g. smtp.zoho.com' },
    { key: 'port', label: 'Port', hint: '465 for implicit TLS, 587 for STARTTLS.' },
    { key: 'user', label: 'Username' },
    { key: 'pass', label: 'Password', secret: true },
    { key: 'secure', label: 'Implicit TLS', hint: '"true" forces port 465 semantics; otherwise auto.' },
    { key: 'fromEmail', label: 'From address', hint: 'Verified sender; falls back to SMTP user.' },
    { key: 'notificationEmail', label: 'Notification recipient', hint: 'Where new-lead emails arrive.' },
  ],
  s3: [
    { key: 'bucket', label: 'Bucket' },
    { key: 'region', label: 'Region', hint: 'e.g. ap-south-1' },
    { key: 'accessKeyId', label: 'Access key ID' },
    { key: 'secretAccessKey', label: 'Secret access key', secret: true },
    { key: 'endpoint', label: 'Endpoint', hint: 'Optional. Leave blank for AWS; set for R2/MinIO/etc.' },
    { key: 'forcePathStyle', label: 'Force path-style addressing', hint: '"true" for non-AWS providers.' },
    { key: 'publicBase', label: 'Public base URL', hint: 'Optional CDN/base that prefixes public URLs.' },
  ],
};

const SECRET_FIELDS: Record<Provider, string[]> = {
  whatsapp: ['token', 'ingestSecret'],
  smtp: ['pass'],
  s3: ['secretAccessKey'],
};

interface IntegrationsClientProps {
  initial: IntegrationsResponse;
}

type AlertState =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

type TestState =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'ok'; detail: string }
  | { status: 'error'; detail: string };

function sourceBadge(source: FieldSource) {
  if (source === 'database') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
        <Database className="h-3 w-3" /> database
      </span>
    );
  }
  if (source === 'env') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
        env
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
      not set
    </span>
  );
}

function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <label className="block font-headline text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
        {children}
      </label>
      {hint ? <p className="text-xs leading-relaxed text-slate-500">{hint}</p> : null}
    </div>
  );
}

function TextInput({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15 ${className}`}
    />
  );
}

function SectionCard({
  title,
  description,
  Icon,
  open,
  onToggle,
  children,
  footer,
}: {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  footer: ReactNode;
}) {
  const reduceMotion = useReducedMotionSafe();
  return (
    <section className="col-span-12 lg:col-span-6 rounded-2xl border border-white/8 bg-[#0f172a]/65 shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-6 text-left"
        aria-expanded={open}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-headline text-lg font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''} ${
            reduceMotion ? '' : 'duration-200'
          }`}
        />
      </button>
      {open ? (
        <div className="space-y-5 px-6 pb-6">
          {children}
          <div className="border-t border-white/8 pt-5">{footer}</div>
        </div>
      ) : null}
    </section>
  );
}

function generateHexSecret(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

export default function IntegrationsClient({ initial }: IntegrationsClientProps) {
  const [providers, setProviders] = useState<ProviderView[]>(initial.providers);
  const [encryptionConfigured] = useState<boolean>(initial.encryptionConfigured);
  const [alert, setAlert] = useState<AlertState>(null);
  const [, startTransition] = useTransition();
  const [openCards, setOpenCards] = useState<Record<Provider, boolean>>({
    whatsapp: true,
    smtp: false,
    s3: false,
  });
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({
    whatsapp: {},
    smtp: {},
    s3: {},
  });
  const [pending, setPending] = useState<Record<Provider, boolean>>({ whatsapp: false, smtp: false, s3: false });
  const [tests, setTests] = useState<Record<Provider, TestState>>({
    whatsapp: { status: 'idle' },
    smtp: { status: 'idle' },
    s3: { status: 'idle' },
  });
  const [ingestGeneratedNotice, setIngestGeneratedNotice] = useState<string | null>(null);

  function toggleCard(provider: Provider) {
    setOpenCards((current) => ({ ...current, [provider]: !current[provider] }));
  }

  function updateDraft(provider: Provider, key: string, value: string) {
    setDrafts((current) => ({ ...current, [provider]: { ...current[provider], [key]: value } }));
  }

  function toggleReveal(provider: Provider, key: string) {
    const id = `${provider}:${key}`;
    setRevealed((current) => ({ ...current, [id]: !current[id] }));
  }

  function generateIngestSecret() {
    const secret = generateHexSecret();
    updateDraft('whatsapp', 'ingestSecret', secret);
    setIngestGeneratedNotice(
      'Copy this now — you will not see it again. Paste it into the n8n "x-ingest-secret" header.',
    );
  }

  async function handleSave(provider: Provider) {
    if (!encryptionConfigured) return;
    setAlert(null);
    const updates: Record<string, string> = {};
    for (const def of PROVIDER_FIELDS[provider]) {
      const draft = drafts[provider][def.key];
      // Empty string is how the UI submits "user did not retype this secret" —
      // the resolver skips empty secret fields, leaving the stored value unchanged.
      if (draft && draft.length > 0) updates[def.key] = draft;
    }

    setPending((current) => ({ ...current, [provider]: true }));
    try {
      const response = await fetch('/api/admin/settings/integrations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ provider, fields: updates }),
      });
      const result = (await response.json()) as IntegrationsResponse | { ok: false; error: string };
      if (!response.ok || !('providers' in result)) {
        throw new Error('error' in result ? result.error : 'Failed to save credentials.');
      }
      setProviders(result.providers);
      setDrafts((current) => ({ ...current, [provider]: {} }));
      setIngestGeneratedNotice(null);
      setAlert({ type: 'success', message: `${PROVIDER_TITLES[provider].title} credentials saved.` });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save credentials.',
      });
    } finally {
      setPending((current) => ({ ...current, [provider]: false }));
    }
  }

  async function handleTest(provider: Provider) {
    setTests((current) => ({ ...current, [provider]: { status: 'running' } }));
    setAlert(null);
    try {
      const response = await fetch('/api/admin/settings/integrations/test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      const result = (await response.json()) as { ok: boolean; detail?: string; error?: string };
      if (response.ok && result.ok && result.detail) {
        setTests((current) => ({ ...current, [provider]: { status: 'ok', detail: result.detail ?? '' } }));
      } else {
        setTests((current) => ({
          ...current,
          [provider]: { status: 'error', detail: result.error ?? result.detail ?? 'Test failed.' },
        }));
      }
    } catch (error) {
      setTests((current) => ({
        ...current,
        [provider]: { status: 'error', detail: error instanceof Error ? error.message : 'Test failed.' },
      }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(() => {
      void Promise.all((['whatsapp', 'smtp', 's3'] as Provider[]).map((provider) => handleSave(provider)));
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[1440px] space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-white md:text-5xl">
          Integrations
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
          Encrypted credentials for WhatsApp, SMTP, and S3. Stored once, refreshed without a redeploy.
        </p>
      </header>

      {!encryptionConfigured ? (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
          <div>
            <p className="font-headline font-bold">CREDENTIALS_KEY is not set.</p>
            <p className="mt-1 leading-relaxed">
              Credentials cannot be saved until it is configured. Generate one with{' '}
              <code className="rounded bg-slate-950/70 px-1 py-0.5 text-[12px]">{`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`}</code>{' '}
              and set it in the environment.
            </p>
          </div>
        </div>
      ) : null}

      {alert ? (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm ${
            alert.type === 'success'
              ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
              : 'border-rose-400/30 bg-rose-500/10 text-rose-200'
          }`}
        >
          {alert.message}
        </div>
      ) : null}

      <div className="grid grid-cols-12 gap-6">
        {providers.map((view) => {
          const meta = PROVIDER_TITLES[view.provider];
          const isOpen = openCards[view.provider];
          const test = tests[view.provider];

          return (
            <SectionCard
              key={view.provider}
              title={meta.title}
              description={meta.description}
              Icon={meta.Icon}
              open={isOpen}
              onToggle={() => toggleCard(view.provider)}
              footer={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs leading-relaxed text-slate-500">
                    {view.lastVerifiedAt ? (
                      <span>
                        Last verified {new Date(view.lastVerifiedAt).toLocaleString()}.
                      </span>
                    ) : (
                      <span>Not verified yet.</span>
                    )}
                    {view.verifyError ? (
                      <span className="block text-rose-300">{view.verifyError}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleTest(view.provider)}
                      disabled={test.status === 'running'}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-headline font-bold uppercase tracking-[0.2em] text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {test.status === 'running' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Test connection
                    </button>
                    <button
                      type="submit"
                      disabled={!encryptionConfigured || pending[view.provider]}
                      onClick={() => handleSave(view.provider)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-6 py-2 text-sm font-headline font-bold uppercase tracking-[0.22em] text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pending[view.provider] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save
                    </button>
                  </div>
                </div>
              }
            >
              {PROVIDER_FIELDS[view.provider].map((def) => {
                const field = view.fields[def.key];
                const isSecret = SECRET_FIELDS[view.provider].includes(def.key);
                const draft = drafts[view.provider][def.key] ?? '';
                const showReveal = revealed[`${view.provider}:${def.key}`] === true;
                const mask = field?.preview ?? '';

                const inputType = isSecret ? (showReveal ? 'text' : 'password') : 'text';

                return (
                  <div key={def.key} className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <FieldLabel hint={def.hint}>{def.label}</FieldLabel>
                      {sourceBadge(field?.source ?? 'unset')}
                    </div>
                    <div className="flex gap-2">
                      <TextInput
                        type={inputType}
                        name={`${view.provider}.${def.key}`}
                        value={draft}
                        placeholder={
                          isSecret
                            ? mask || 'No value stored'
                            : (field?.value && field.value.length > 0
                              ? field.value
                              : 'Not set')
                        }
                        autoComplete="off"
                        spellCheck={false}
                        onChange={(event) => updateDraft(view.provider, def.key, event.target.value)}
                        className={isSecret ? 'font-mono' : ''}
                      />
                      {isSecret ? (
                        <button
                          type="button"
                          onClick={() => toggleReveal(view.provider, def.key)}
                          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-200 transition hover:bg-cyan-400/15"
                          aria-label={showReveal ? 'Hide secret' : 'Reveal secret'}
                        >
                          {showReveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      ) : null}
                    </div>
                    {view.provider === 'whatsapp' && def.key === 'ingestSecret' ? (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={generateIngestSecret}
                          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-headline font-bold uppercase tracking-[0.2em] text-cyan-200 transition hover:bg-cyan-400/15"
                        >
                          <Sparkles className="h-4 w-4" /> Generate
                        </button>
                        {ingestGeneratedNotice ? (
                          <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-200">
                            <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                            <span>{ingestGeneratedNotice}</span>
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {test.status === 'ok' || test.status === 'error' ? (
                <div
                  className={`rounded-xl border px-4 py-3 text-xs leading-relaxed ${
                    test.status === 'ok'
                      ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-400/25 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  {test.detail}
                </div>
              ) : null}
            </SectionCard>
          );
        })}
      </div>
    </form>
  );
}
