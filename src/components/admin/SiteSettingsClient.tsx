'use client';

import {
  useState,
  useTransition,
  type ChangeEvent,
  type ComponentType,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type SVGProps,
  type TextareaHTMLAttributes,
} from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Globe, Mail, Phone, Rocket, ShieldCheck, Users } from 'lucide-react';

import {
  EMAIL_DEPARTMENT_OPTIONS,
  PHONE_LABEL_OPTIONS,
  type SiteEmailEntry,
  type SitePhoneEntry,
  type SiteSettings,
  type SiteSettingKey,
} from '@/lib/site-settings-types';

interface SiteSettingsClientProps {
  initialSettings: SiteSettings;
  csrfToken: string;
}

type AlertState =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

function FacebookMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.39H7.08V12h3.04V9.36c0-3 1.8-4.66 4.54-4.66 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.46h-2.79v8.39A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

function TwitterMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.42L6.43 22H3.33l7.24-8.28L.8 2h6.4l4.43 5.84L18.9 2Zm-1.1 18h1.73L6.26 3.9H4.4L17.8 20Z" />
    </svg>
  );
}

function LinkedinMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5ZM8 19H5V9h3v10ZM6.5 7.73a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5ZM19 19h-3v-5.4c0-3.23-4-2.99-4 0V19H9V9h3v1.6c1.4-2.58 7-2.77 7 2.37V19Z" />
    </svg>
  );
}

function InstagramMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.5 1.8h-8.5A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95ZM12 7.35A4.65 4.65 0 1 1 7.35 12 4.65 4.65 0 0 1 12 7.35Zm0 1.8A2.85 2.85 0 1 0 14.85 12 2.85 2.85 0 0 0 12 9.15Zm4.9-2.9a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
    </svg>
  );
}

function SectionCard({
  title,
  description,
  icon,
  children,
  className = '',
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`col-span-12 lg:col-span-6 rounded-2xl border border-white/8 bg-[#0f172a]/65 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl ${className}`}>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
          {icon}
        </div>
        <div>
          <h2 className="font-headline text-lg font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <label className="block font-headline text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">{children}</label>
      {hint ? <p className="text-xs leading-relaxed text-slate-500">{hint}</p> : null}
    </div>
  );
}

function TextInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15 ${className}`}
    />
  );
}

function TextArea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15 ${className}`}
    />
  );
}

function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15 ${className}`}
    >
      {children}
    </select>
  );
}

const SOCIAL_FIELDS = [
  { key: 'facebook_url', label: 'Facebook URL', Icon: FacebookMark },
  { key: 'twitter_url', label: 'Twitter URL', Icon: TwitterMark },
  { key: 'linkedin_url', label: 'LinkedIn URL', Icon: LinkedinMark },
  { key: 'instagram_url', label: 'Instagram URL', Icon: InstagramMark },
] as const satisfies Array<{ key: SiteSettingKey; label: string; Icon: ComponentType<{ className?: string }> }>;

export default function SiteSettingsClient({ initialSettings, csrfToken: initialCsrfToken }: SiteSettingsClientProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<SiteSettingKey, string>>(initialSettings.flat);
  const [phoneRows, setPhoneRows] = useState<SitePhoneEntry[]>(
    initialSettings.contactPhones.length > 0 ? initialSettings.contactPhones : [{ label: 'Sales', number: '' }],
  );
  const [emailRows, setEmailRows] = useState<SiteEmailEntry[]>(
    initialSettings.contactEmails.length > 0 ? initialSettings.contactEmails : [{ department: 'Sales', email: '' }],
  );
  const [csrfToken, setCsrfToken] = useState(initialCsrfToken);
  const [alert, setAlert] = useState<AlertState>(null);
  const [isPending, startTransition] = useTransition();

  function updateSetting(key: SiteSettingKey, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function updatePhoneRow(index: number, field: keyof SitePhoneEntry, value: string) {
    setPhoneRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  }

  function updateEmailRow(index: number, field: keyof SiteEmailEntry, value: string) {
    setEmailRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  }

  function addPhone() {
    setPhoneRows((current) => [...current, { label: 'Sales', number: '' }]);
  }

  function addEmail() {
    setEmailRows((current) => [...current, { department: 'Sales', email: '' }]);
  }

  function removePhone(index: number) {
    setPhoneRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  function removeEmail(index: number) {
    setEmailRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  function handlePhoneInput(index: number, field: keyof SitePhoneEntry) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      updatePhoneRow(index, field, event.target.value);
    };
  }

  function handleEmailInput(index: number, field: keyof SiteEmailEntry) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      updateEmailRow(index, field, event.target.value);
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAlert(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/settings/site', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.error || 'Failed to save site settings.');
        }

        if (typeof result.csrfToken === 'string') {
          setCsrfToken(result.csrfToken);
        }

        setAlert({ type: 'success', message: result.message || 'Settings updated successfully!' });
        router.refresh();
      } catch (error) {
        setAlert({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to save site settings.',
        });
      }
    });
  }

  return (
    <form method="POST" onSubmit={handleSubmit} className="mx-auto max-w-[1440px] space-y-8">
      <input type="hidden" name="update_settings" value="1" />
      <input type="hidden" name="csrf_token" value={csrfToken} />

      <header className="space-y-3">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-white md:text-5xl">Site Settings</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">Configure your website settings</p>
      </header>

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
        <SectionCard
          title="General Settings"
          description="Primary brand and contact information used across the public website."
          icon={<Building2 className="h-5 w-5" />}
        >
          <div className="space-y-2">
            <FieldLabel>Site Name</FieldLabel>
            <TextInput name="settings[site_name]" value={settings.site_name} onChange={(event) => updateSetting('site_name', event.target.value)} />
          </div>

          <div className="space-y-2">
            <FieldLabel hint="Shown in header bar and used as default contact">Primary Email</FieldLabel>
            <TextInput type="email" name="settings[site_email]" value={settings.site_email} onChange={(event) => updateSetting('site_email', event.target.value)} />
          </div>

          <div className="space-y-2">
            <FieldLabel hint="Shown in header bar, WhatsApp, and side contact">Primary Phone</FieldLabel>
            <TextInput name="settings[site_phone]" value={settings.site_phone} onChange={(event) => updateSetting('site_phone', event.target.value)} />
          </div>

          <div className="space-y-2">
            <FieldLabel>Business Address</FieldLabel>
            <TextArea rows={3} name="settings[site_address]" value={settings.site_address} onChange={(event) => updateSetting('site_address', event.target.value)} />
          </div>
        </SectionCard>

        <SectionCard
          title="Phone Numbers"
          description="Add multiple phone numbers with labels for different public contact touchpoints."
          icon={<Phone className="h-5 w-5" />}
        >
          <div id="phoneList" className="space-y-3">
            {phoneRows.map((row, index) => (
              <div key={`phone-${index}`} className="phone-row flex flex-col gap-3 rounded-2xl border border-white/8 bg-slate-950/40 p-4 md:flex-row md:items-center">
                <Select name="phone_label[]" value={row.label} onChange={handlePhoneInput(index, 'label')} className="w-full md:w-[140px]">
                  {PHONE_LABEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <TextInput name="phone_number[]" value={row.number} onChange={handlePhoneInput(index, 'number')} placeholder="+91 XXXXX XXXXX" className="flex-1" />
                <button
                  type="button"
                  onClick={() => removePhone(index)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-rose-400/30 bg-rose-500/5 text-lg text-rose-300 transition hover:bg-rose-500/10"
                  aria-label="Remove phone"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPhone}
            className="inline-flex items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-headline font-bold uppercase tracking-[0.2em] text-cyan-200 transition hover:bg-cyan-400/15"
          >
            Add Phone
          </button>
        </SectionCard>

        <SectionCard
          title="Department Emails"
          description="Manage department-specific inboxes shown on the site and contact experiences."
          icon={<Mail className="h-5 w-5" />}
        >
          <div id="emailList" className="space-y-3">
            {emailRows.map((row, index) => (
              <div key={`email-${index}`} className="email-row flex flex-col gap-3 rounded-2xl border border-white/8 bg-slate-950/40 p-4 md:flex-row md:items-center">
                <Select name="email_department[]" value={row.department} onChange={handleEmailInput(index, 'department')} className="w-full md:w-[140px]">
                  {EMAIL_DEPARTMENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <TextInput type="email" name="email_address[]" value={row.email} onChange={handleEmailInput(index, 'email')} placeholder="dept@biznexa.tech" className="flex-1" />
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-rose-400/30 bg-rose-500/5 text-lg text-rose-300 transition hover:bg-rose-500/10"
                  aria-label="Remove email"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addEmail}
            className="inline-flex items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-headline font-bold uppercase tracking-[0.2em] text-cyan-200 transition hover:bg-cyan-400/15"
          >
            Add Email
          </button>
        </SectionCard>

        <SectionCard
          title="Social Media"
          description="Public social profile links. Empty fields stay hidden on the website automatically."
          icon={<Globe className="h-5 w-5" />}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {SOCIAL_FIELDS.map(({ key, label, Icon }) => (
              <div key={key} className="space-y-2">
                <FieldLabel>
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </span>
                </FieldLabel>
                <TextInput type="url" name={`settings[${key}]`} value={settings[key]} onChange={(event) => updateSetting(key, event.target.value)} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Homepage Statistics"
          description="Numeric counters shown on the public homepage hero/stat section."
          icon={<Users className="h-5 w-5" />}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Years of Experience</FieldLabel>
              <TextInput type="number" name="settings[stat_years]" value={settings.stat_years} onChange={(event) => updateSetting('stat_years', event.target.value)} />
            </div>
            <div className="space-y-2">
              <FieldLabel>Projects Completed</FieldLabel>
              <TextInput type="number" name="settings[stat_projects]" value={settings.stat_projects} onChange={(event) => updateSetting('stat_projects', event.target.value)} />
            </div>
            <div className="space-y-2">
              <FieldLabel>Happy Clients</FieldLabel>
              <TextInput type="number" name="settings[stat_clients]" value={settings.stat_clients} onChange={(event) => updateSetting('stat_clients', event.target.value)} />
            </div>
            <div className="space-y-2">
              <FieldLabel>Countries Served</FieldLabel>
              <TextInput type="number" name="settings[stat_countries]" value={settings.stat_countries} onChange={(event) => updateSetting('stat_countries', event.target.value)} />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Hero Section"
          description="Homepage banner copy and imagery that shape the first impression of the website."
          icon={<Rocket className="h-5 w-5" />}
        >
          <div className="space-y-2">
            <FieldLabel>Hero Title</FieldLabel>
            <TextInput name="settings[hero_title]" value={settings.hero_title} onChange={(event) => updateSetting('hero_title', event.target.value)} />
          </div>
          <div className="space-y-2">
            <FieldLabel>Hero Subtitle</FieldLabel>
            <TextInput name="settings[hero_subtitle]" value={settings.hero_subtitle} onChange={(event) => updateSetting('hero_subtitle', event.target.value)} />
          </div>
          <div className="space-y-2">
            <FieldLabel>Hero Image URL</FieldLabel>
            <TextInput type="url" name="settings[hero_image]" value={settings.hero_image} onChange={(event) => updateSetting('hero_image', event.target.value)} />
          </div>
        </SectionCard>

        <SectionCard
          title="Save Summary"
          description="Everything on this page is submitted together in one request and published as a single settings update."
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4">
              <p className="text-[10px] font-headline font-bold uppercase tracking-[0.24em] text-slate-500">Primary Contact</p>
              <p className="mt-3 text-sm text-white">{settings.site_email || 'Not set yet'}</p>
              <p className="mt-1 text-sm text-slate-400">{settings.site_phone || 'No phone added yet'}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4">
              <p className="text-[10px] font-headline font-bold uppercase tracking-[0.24em] text-slate-500">Dynamic Lists</p>
              <p className="mt-3 text-sm text-white">{phoneRows.filter((row) => row.number.trim()).length} phone entries</p>
              <p className="mt-1 text-sm text-slate-400">{emailRows.filter((row) => row.email.trim()).length} department emails</p>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-300/20 bg-amber-400/8 p-4 text-sm leading-relaxed text-amber-100/90">
            Save Settings updates general details, contact JSON lists, social links, homepage counters, and hero content in one go.
          </div>
        </SectionCard>
      </div>

      <div className="flex justify-end pb-8">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-8 py-4 text-sm font-headline font-bold uppercase tracking-[0.22em] text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Saving Settings...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
