'use client';

import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { useRouter } from "next/navigation";

import type { AboutContent } from "@/lib/about";

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="font-headline text-lg font-bold uppercase tracking-wider">{children}</h3>;
}

function Label({ children }: { children: ReactNode }) {
  return <label className="block text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">{children}</label>;
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 ${props.className ?? ""}`} />;
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 ${props.className ?? ""}`} />;
}

function ImageField({ label, value, onChange, onUpload, isUploading }: { label: string; value: string; onChange: (value: string) => void; onUpload: (file: File) => Promise<void>; isUploading: boolean; }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>{label} URL</Label>
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://... or /uploads/..." />
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
        <label className="inline-flex w-fit cursor-pointer rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-primary transition hover:bg-primary/15">
          {isUploading ? 'Uploading...' : 'Upload File'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              await onUpload(file);
              event.currentTarget.value = '';
            }}
          />
        </label>
        {value ? <img src={value} alt={label} className="h-40 w-full rounded-lg object-cover border border-white/10" /> : <div className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-xs text-slate-500">No image selected yet.</div>}
      </div>
    </div>
  );
}

export default function AboutContentClient({ initialContent }: { initialContent: AboutContent }) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function updateSection<K extends keyof AboutContent>(section: K, value: AboutContent[K]) {
    setContent((current) => ({ ...current, [section]: value }));
  }

  async function uploadImage(fieldKey: string, file: File) {
    setUploadingField(fieldKey);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Upload failed.');
      return result.url as string;
    } catch (uploadError) {
      const uploadMessage = uploadError instanceof Error ? uploadError.message : 'Upload failed.';
      setError(uploadMessage);
      throw uploadError;
    } finally {
      setUploadingField('');
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/content/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to save About page content.');

      setMessage('About page content synced successfully.');
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save About page content.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <nav className="flex items-center gap-2 mb-2 text-[10px] font-headline uppercase tracking-[0.2em] text-slate-500">
            <span>Content Manage</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-[#00f2ff]">About Us</span>
          </nav>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight text-white">Manage About Us Content</h2>
        </div>
        <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
          <button onClick={() => router.refresh()} className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-lg bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/[0.08] text-sm font-headline font-bold uppercase tracking-widest hover:border-[#00f2ff]/30 transition-all flex items-center justify-center gap-2 text-slate-300">Reload Data</button>
          <button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#00f2ff] to-[#00dee0] text-slate-950 text-sm font-headline font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70">{isSaving ? 'Saving...' : 'Publish Changes'}</button>
        </div>
      </div>

      {(message || error) ? <div className={`mb-8 rounded-xl border px-4 py-3 text-sm ${error ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>{error || message}</div> : null}

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8 bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 hover:border-[#00f2ff]/30 transition-all p-6 sm:p-8 rounded-xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6"><span className="material-symbols-outlined text-[#00f2ff]">view_quilt</span><SectionTitle>Hero Section</SectionTitle></div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Badge Text</Label><Input value={content.hero.badgeText} onChange={(event) => updateSection('hero', { ...content.hero, badgeText: event.target.value })} /></div>
              <div><Label>Headline Lead</Label><Input value={content.hero.headlineLead} onChange={(event) => updateSection('hero', { ...content.hero, headlineLead: event.target.value })} /></div>
              <div><Label>Headline Accent</Label><Input value={content.hero.headlineAccent} onChange={(event) => updateSection('hero', { ...content.hero, headlineAccent: event.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Textarea rows={4} value={content.hero.description} onChange={(event) => updateSection('hero', { ...content.hero, description: event.target.value })} /></div>
            <ImageField
              label="Desktop Hero Image"
              value={content.hero.desktopImage}
              isUploading={uploadingField === 'about-hero-image'}
              onChange={(value) => updateSection('hero', { ...content.hero, desktopImage: value })}
              onUpload={async (file) => {
                const url = await uploadImage('about-hero-image', file);
                updateSection('hero', { ...content.hero, desktopImage: url });
              }}
            />
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 hover:border-[#00f2ff]/30 transition-all p-6 sm:p-8 rounded-xl flex flex-col justify-between border-l-2 border-l-[#00f2ff]/20">
          <div>
            <div className="flex items-center gap-2 mb-6"><span className="material-symbols-outlined text-[#10b981]">format_quote</span><SectionTitle>Leadership Quote</SectionTitle></div>
            <Label>Quote</Label>
            <Textarea value={content.leadership.quote} onChange={(event) => updateSection('leadership', { ...content.leadership, quote: event.target.value })} rows={6} className="text-lg font-headline font-medium italic text-white leading-snug" />
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.08] text-[10px] font-headline text-slate-600 uppercase tracking-wider italic">Displayed in the leadership block on About.</div>
        </section>

        <section className="col-span-12 lg:col-span-5 bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 hover:border-[#00f2ff]/30 transition-all p-6 sm:p-8 rounded-xl">
          <div className="flex items-center gap-2 mb-8"><span className="material-symbols-outlined text-[#6366f1]">person_pin</span><SectionTitle>Founder Profile</SectionTitle></div>
          <div className="flex flex-col gap-6">
            <ImageField
              label="Founder Portrait"
              value={content.leadership.portraitImage}
              isUploading={uploadingField === 'about-founder-image'}
              onChange={(value) => updateSection('leadership', { ...content.leadership, portraitImage: value })}
              onUpload={async (file) => {
                const url = await uploadImage('about-founder-image', file);
                updateSection('leadership', { ...content.leadership, portraitImage: url });
              }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input value={content.leadership.name} onChange={(event) => updateSection('leadership', { ...content.leadership, name: event.target.value })} /></div>
              <div><Label>Professional Title</Label><Input value={content.leadership.title} onChange={(event) => updateSection('leadership', { ...content.leadership, title: event.target.value })} /></div>
              <div><Label>Executive Badge</Label><Input value={content.leadership.executiveBadge} onChange={(event) => updateSection('leadership', { ...content.leadership, executiveBadge: event.target.value })} /></div>
              <div><Label>Headline Lead</Label><Input value={content.leadership.headlineLead} onChange={(event) => updateSection('leadership', { ...content.leadership, headlineLead: event.target.value })} /></div>
              <div><Label>Headline Accent</Label><Input value={content.leadership.headlineAccent} onChange={(event) => updateSection('leadership', { ...content.leadership, headlineAccent: event.target.value })} /></div>
              <div><Label>Button Label</Label><Input value={content.leadership.bioButtonLabel} onChange={(event) => updateSection('leadership', { ...content.leadership, bioButtonLabel: event.target.value })} /></div>
            </div>
            <div><Label>Bio</Label><Textarea value={content.leadership.bio} onChange={(event) => updateSection('leadership', { ...content.leadership, bio: event.target.value })} rows={8} className="leading-relaxed" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.leadership.metrics.slice(0,2).map((metric, index) => (
                <div key={index} className="rounded-lg bg-slate-950/50 p-4 border border-white/10">
                  <Label>Metric Value</Label>
                  <Input value={metric.value} onChange={(event) => updateSection('leadership', { ...content.leadership, metrics: content.leadership.metrics.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item) })} className="mb-3" />
                  <Label>Metric Label</Label>
                  <Input value={metric.label} onChange={(event) => updateSection('leadership', { ...content.leadership, metrics: content.leadership.metrics.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) })} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-7 bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 hover:border-[#00f2ff]/30 transition-all p-6 sm:p-8 rounded-xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00f2ff]">architecture</span><SectionTitle>Strategic Pillars</SectionTitle></div>
          </div>
          <div className="mb-4"><Label>Section Heading</Label><Input value={content.pillars.heading} onChange={(event) => updateSection('pillars', { ...content.pillars, heading: event.target.value })} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.pillars.items.map((pillar, index) => (
              <div key={index} className="p-4 rounded-lg bg-[#0f172a]/60 backdrop-blur-[16px] border border-white/[0.08] group hover:border-[#00f2ff]/30 transition-all space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Eyebrow</Label><Input value={pillar.eyebrow ?? ''} onChange={(event) => updateSection('pillars', { ...content.pillars, items: content.pillars.items.map((item, itemIndex) => itemIndex === index ? { ...item, eyebrow: event.target.value || null } : item) })} /></div>
                  <div><Label>Icon</Label><Input value={pillar.icon} onChange={(event) => updateSection('pillars', { ...content.pillars, items: content.pillars.items.map((item, itemIndex) => itemIndex === index ? { ...item, icon: event.target.value } : item) })} /></div>
                </div>
                <div><Label>Title</Label><Input value={pillar.title} onChange={(event) => updateSection('pillars', { ...content.pillars, items: content.pillars.items.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} /></div>
                <div><Label>Description</Label><Textarea rows={3} value={pillar.description} onChange={(event) => updateSection('pillars', { ...content.pillars, items: content.pillars.items.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} /></div>
                <div><Label>Footer Label</Label><Input value={pillar.footerLabel ?? ''} onChange={(event) => updateSection('pillars', { ...content.pillars, items: content.pillars.items.map((item, itemIndex) => itemIndex === index ? { ...item, footerLabel: event.target.value || null } : item) })} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 hover:border-[#00f2ff]/30 transition-all p-6 sm:p-8 rounded-xl">
          <div className="flex items-center gap-2 mb-6"><span className="material-symbols-outlined text-[#10b981]">ads_click</span><SectionTitle>CTA Section</SectionTitle></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><Label>CTA Heading</Label><Input value={content.cta.heading} onChange={(event) => updateSection('cta', { ...content.cta, heading: event.target.value })} /></div>
            <div><Label>Primary Label</Label><Input value={content.cta.primaryLabel} onChange={(event) => updateSection('cta', { ...content.cta, primaryLabel: event.target.value })} /></div>
            <div><Label>Primary Link</Label><Input value={content.cta.primaryHref} onChange={(event) => updateSection('cta', { ...content.cta, primaryHref: event.target.value })} /></div>
            <div><Label>Secondary Label</Label><Input value={content.cta.secondaryLabel} onChange={(event) => updateSection('cta', { ...content.cta, secondaryLabel: event.target.value })} /></div>
            <div><Label>Secondary Link</Label><Input value={content.cta.secondaryHref} onChange={(event) => updateSection('cta', { ...content.cta, secondaryHref: event.target.value })} /></div>
          </div>
        </section>
      </div>
    </div>
  );
}
