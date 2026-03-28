'use client';

import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';

import type { ServicesContent } from '@/lib/services';

interface ServicesContentClientProps {
  initialContent: ServicesContent;
}

function Label({ children }: { children: ReactNode }) {
  return <label className="block font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{children}</label>;
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full bg-slate-950/80 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 transition-all ${props.className ?? ''}`} />;
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full bg-slate-950/80 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 transition-all ${props.className ?? ''}`} />;
}

function ImageField({
  label,
  value,
  onChange,
  onUpload,
  isUploading,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
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
        {value ? (
          <div className="overflow-hidden rounded-lg border border-white/10 bg-black/20">
            <img src={value} alt={label} className="h-40 w-full object-cover" />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-xs text-slate-500">No image selected yet.</div>
        )}
      </div>
    </div>
  );
}

export default function ServicesContentClient({ initialContent }: ServicesContentClientProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const glassPanel = 'bg-[#192540]/40 backdrop-blur-[20px] border border-[#8ff5ff]/5 rounded-lg';

  function updateSection<K extends keyof ServicesContent>(section: K, value: ServicesContent[K]) {
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

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Upload failed.');
      }

      return result.url as string;
    } finally {
      setUploadingField('');
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/content/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to save services content.');
      }

      setMessage('Services content synced successfully.');
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save services content.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-10 pb-36">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Services Management</h2>
          <p className="text-slate-400 font-body text-sm">This editor now follows the live Services page: hero, workflow, mobile cards, desktop content, and CTA.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.refresh()} className="px-5 py-2.5 rounded-lg bg-[#1e293b] text-white font-headline text-xs uppercase tracking-widest hover:bg-[#334155] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">visibility</span>
            Reload Data
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-[#10b981] text-[#00452d] font-headline font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">publish</span>
            Publish All Updates
          </button>
        </div>
      </div>

      <section className={`${glassPanel} p-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-6xl">bolt</span></div>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-[#00f2ff]">web</span>
          <h3 className="font-headline text-xs uppercase tracking-[0.2em] text-[#00f2ff] font-bold">1. Hero Section</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-[#00f2ff]/20 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2"><Label>Badge Text</Label><Input value={content.hero.badgeText} onChange={(e) => updateSection('hero', { ...content.hero, badgeText: e.target.value })} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Mobile Headline Lead</Label><Input value={content.hero.mobileHeadlineLead} onChange={(e) => updateSection('hero', { ...content.hero, mobileHeadlineLead: e.target.value })} /></div>
              <div className="space-y-2"><Label>Mobile Primary Word</Label><Input value={content.hero.mobileHeadlinePrimary} onChange={(e) => updateSection('hero', { ...content.hero, mobileHeadlinePrimary: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Mobile Accent Word</Label><Input value={content.hero.mobileHeadlineAccent} onChange={(e) => updateSection('hero', { ...content.hero, mobileHeadlineAccent: e.target.value })} /></div>
            <div className="space-y-2"><Label>Desktop Headline</Label><Textarea rows={3} value={content.hero.desktopHeadline} onChange={(e) => updateSection('hero', { ...content.hero, desktopHeadline: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={content.hero.description} onChange={(e) => updateSection('hero', { ...content.hero, description: e.target.value })} /></div>
            {content.hero.highlights.map((highlight, index) => (
              <div key={index} className="space-y-2"><Label>Mobile Highlight {index + 1}</Label><Input value={highlight} onChange={(e) => updateSection('hero', { ...content.hero, highlights: content.hero.highlights.map((item, itemIndex) => itemIndex === index ? e.target.value : item) })} /></div>
            ))}
          </div>
          <div className="space-y-6">
            <ImageField
              label="Hero Image"
              value={content.hero.imageUrl}
              isUploading={uploadingField === 'hero-image'}
              onChange={(value) => updateSection('hero', { ...content.hero, imageUrl: value })}
              onUpload={async (file) => {
                const url = await uploadImage('hero-image', file);
                updateSection('hero', { ...content.hero, imageUrl: url });
              }}
            />
            <div className="space-y-2"><Label>Hero Image Alt</Label><Input value={content.hero.imageAlt} onChange={(e) => updateSection('hero', { ...content.hero, imageAlt: e.target.value })} /></div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#00f2ff]">account_tree</span><h3 className="font-headline text-xs uppercase tracking-[0.2em] text-[#00f2ff] font-bold">2. Workflow</h3><div className="flex-1 h-px bg-gradient-to-r from-[#00f2ff]/20 to-transparent" /></div>
        <div className="space-y-2"><Label>Workflow Heading</Label><Input value={content.workflow.heading} onChange={(e) => updateSection('workflow', { ...content.workflow, heading: e.target.value })} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.workflow.steps.map((step, index) => (
            <div key={step.number} className={`${glassPanel} p-6 space-y-4`}>
              <div className="space-y-2"><Label>Number</Label><Input value={step.number} onChange={(e) => updateSection('workflow', { ...content.workflow, steps: content.workflow.steps.map((item, itemIndex) => itemIndex === index ? { ...item, number: e.target.value } : item) })} /></div>
              <div className="space-y-2"><Label>Icon</Label><Input value={step.icon} onChange={(e) => updateSection('workflow', { ...content.workflow, steps: content.workflow.steps.map((item, itemIndex) => itemIndex === index ? { ...item, icon: e.target.value } : item) })} /></div>
              <div className="space-y-2"><Label>Title</Label><Input value={step.title} onChange={(e) => updateSection('workflow', { ...content.workflow, steps: content.workflow.steps.map((item, itemIndex) => itemIndex === index ? { ...item, title: e.target.value } : item) })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={step.description} onChange={(e) => updateSection('workflow', { ...content.workflow, steps: content.workflow.steps.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item) })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Accent</Label><Input value={step.accent} onChange={(e) => updateSection('workflow', { ...content.workflow, steps: content.workflow.steps.map((item, itemIndex) => itemIndex === index ? { ...item, accent: e.target.value as typeof item.accent } : item) })} /></div>
                <div className="space-y-2"><Label>Surface</Label><Input value={step.surface} onChange={(e) => updateSection('workflow', { ...content.workflow, steps: content.workflow.steps.map((item, itemIndex) => itemIndex === index ? { ...item, surface: e.target.value as typeof item.surface } : item) })} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#00f2ff]">view_carousel</span><h3 className="font-headline text-xs uppercase tracking-[0.2em] text-[#00f2ff] font-bold">3. Mobile Service Cards</h3><div className="flex-1 h-px bg-gradient-to-r from-[#00f2ff]/20 to-transparent" /></div>
        <div className="space-y-2"><Label>Mobile Section Heading</Label><Input value={content.mobileServices.heading} onChange={(e) => updateSection('mobileServices', { ...content.mobileServices, heading: e.target.value })} /></div>
        <div className="grid grid-cols-1 gap-6">
          {content.mobileServices.cards.map((card, index) => (
            <div key={index} className={`${glassPanel} p-6 md:p-8 space-y-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Card Title</Label><Input value={card.title} onChange={(e) => updateSection('mobileServices', { ...content.mobileServices, cards: content.mobileServices.cards.map((item, itemIndex) => itemIndex === index ? { ...item, title: e.target.value } : item) })} /></div>
                  <div className="space-y-2"><Label>Icon</Label><Input value={card.icon} onChange={(e) => updateSection('mobileServices', { ...content.mobileServices, cards: content.mobileServices.cards.map((item, itemIndex) => itemIndex === index ? { ...item, icon: e.target.value } : item) })} /></div>
                  <div className="space-y-2"><Label>Image Alt</Label><Input value={card.imageAlt} onChange={(e) => updateSection('mobileServices', { ...content.mobileServices, cards: content.mobileServices.cards.map((item, itemIndex) => itemIndex === index ? { ...item, imageAlt: e.target.value } : item) })} /></div>
                  <div className="space-y-2"><Label>Button Label</Label><Input value={card.buttonLabel} onChange={(e) => updateSection('mobileServices', { ...content.mobileServices, cards: content.mobileServices.cards.map((item, itemIndex) => itemIndex === index ? { ...item, buttonLabel: e.target.value } : item) })} /></div>
                  <div className="space-y-2"><Label>Button Link</Label><Input value={card.buttonHref} onChange={(e) => updateSection('mobileServices', { ...content.mobileServices, cards: content.mobileServices.cards.map((item, itemIndex) => itemIndex === index ? { ...item, buttonHref: e.target.value } : item) })} /></div>
                  {card.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="space-y-2"><Label>Bullet {bulletIndex + 1}</Label><Input value={bullet} onChange={(e) => updateSection('mobileServices', { ...content.mobileServices, cards: content.mobileServices.cards.map((item, itemIndex) => itemIndex === index ? { ...item, bullets: item.bullets.map((bulletItem, innerIndex) => innerIndex === bulletIndex ? e.target.value : bulletItem) } : item) })} /></div>
                  ))}
                </div>
                <div className="space-y-4">
                  <ImageField
                    label={`Card ${index + 1} Image`}
                    value={card.imageUrl}
                    isUploading={uploadingField === `mobile-card-${index}`}
                    onChange={(value) => updateSection('mobileServices', { ...content.mobileServices, cards: content.mobileServices.cards.map((item, itemIndex) => itemIndex === index ? { ...item, imageUrl: value } : item) })}
                    onUpload={async (file) => {
                      const url = await uploadImage(`mobile-card-${index}`, file);
                      updateSection('mobileServices', { ...content.mobileServices, cards: content.mobileServices.cards.map((item, itemIndex) => itemIndex === index ? { ...item, imageUrl: url } : item) });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#00f2ff]">dns</span><h3 className="font-headline text-xs uppercase tracking-[0.2em] text-[#00f2ff] font-bold">4. Desktop Services</h3><div className="flex-1 h-px bg-gradient-to-r from-[#00f2ff]/20 to-transparent" /></div>
        <div className={`${glassPanel} p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6`}>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Sidebar Eyebrow</Label><Input value={content.desktopSidebar.eyebrow} onChange={(e) => updateSection('desktopSidebar', { ...content.desktopSidebar, eyebrow: e.target.value })} /></div>
            <div className="space-y-2"><Label>Sidebar Heading Lead</Label><Input value={content.desktopSidebar.headingLead} onChange={(e) => updateSection('desktopSidebar', { ...content.desktopSidebar, headingLead: e.target.value })} /></div>
            <div className="space-y-2"><Label>Sidebar Heading Accent</Label><Input value={content.desktopSidebar.headingAccent} onChange={(e) => updateSection('desktopSidebar', { ...content.desktopSidebar, headingAccent: e.target.value })} /></div>
            <div className="space-y-2"><Label>Sidebar Description</Label><Textarea rows={4} value={content.desktopSidebar.description} onChange={(e) => updateSection('desktopSidebar', { ...content.desktopSidebar, description: e.target.value })} /></div>
          </div>
          <div className="space-y-4">
            {content.desktopSidebar.highlights.map((highlight, index) => (
              <div key={index} className="space-y-2"><Label>Sidebar Highlight {index + 1}</Label><Input value={highlight} onChange={(e) => updateSection('desktopSidebar', { ...content.desktopSidebar, highlights: content.desktopSidebar.highlights.map((item, itemIndex) => itemIndex === index ? e.target.value : item) })} /></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {content.desktopServices.map((service, index) => (
            <div key={index} className={`${glassPanel} p-6 md:p-8 space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Service Title</Label><Input value={service.title} onChange={(e) => updateSection('desktopServices', content.desktopServices.map((item, itemIndex) => itemIndex === index ? { ...item, title: e.target.value } : item))} /></div>
                  <div className="space-y-2"><Label>Icon</Label><Input value={service.icon} onChange={(e) => updateSection('desktopServices', content.desktopServices.map((item, itemIndex) => itemIndex === index ? { ...item, icon: e.target.value } : item))} /></div>
                  <div className="space-y-2"><Label>Accent</Label><Input value={service.accent} onChange={(e) => updateSection('desktopServices', content.desktopServices.map((item, itemIndex) => itemIndex === index ? { ...item, accent: e.target.value as typeof item.accent } : item))} /></div>
                </div>
                <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={service.description} onChange={(e) => updateSection('desktopServices', content.desktopServices.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item))} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="space-y-2"><Label>Bullet {bulletIndex + 1}</Label><Input value={bullet} onChange={(e) => updateSection('desktopServices', content.desktopServices.map((item, itemIndex) => itemIndex === index ? { ...item, bullets: item.bullets.map((bulletItem, innerIndex) => innerIndex === bulletIndex ? e.target.value : bulletItem) } : item))} /></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${glassPanel} p-8`} style={{ borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#10b981]">ads_click</span><h3 className="font-headline text-xs uppercase tracking-[0.2em] text-[#10b981] font-bold">5. CTA Configuration</h3><div className="flex-1 h-px bg-gradient-to-r from-[#10b981]/20 to-transparent" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Mobile Lead</Label><Input value={content.cta.mobileLead} onChange={(e) => updateSection('cta', { ...content.cta, mobileLead: e.target.value })} /></div>
              <div className="space-y-2"><Label>Mobile Accent</Label><Input value={content.cta.mobileAccent} onChange={(e) => updateSection('cta', { ...content.cta, mobileAccent: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Desktop Heading</Label><Input value={content.cta.desktopHeading} onChange={(e) => updateSection('cta', { ...content.cta, desktopHeading: e.target.value })} /></div>
          </div>
          <div className="w-full md:w-80 space-y-3">
            <div className="space-y-2"><Label>Button Text</Label><Input value={content.cta.buttonLabel} onChange={(e) => updateSection('cta', { ...content.cta, buttonLabel: e.target.value })} /></div>
            <div className="space-y-2"><Label>Button Link</Label><Input value={content.cta.buttonHref} onChange={(e) => updateSection('cta', { ...content.cta, buttonHref: e.target.value })} /></div>
          </div>
        </div>
      </section>

      {(message || error) ? (
        <div className="rounded-lg border border-white/10 bg-[#091328] px-4 py-3 text-sm">
          {message ? <p className="text-emerald-400">{message}</p> : null}
          {error ? <p className="text-red-400">{error}</p> : null}
        </div>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 lg:left-72 p-4 md:p-6 bg-[#020617]/90 backdrop-blur-md border-t border-white/5 z-40 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2 text-[10px] font-headline text-slate-500 uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> Services CMS Sync</div>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => router.refresh()} className="text-[#00f2ff] font-headline font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-125 transition"><span className="material-symbols-outlined text-base">visibility</span>Reload</button>
          <div className="h-4 w-px bg-white/10" />
          <button onClick={handleSave} disabled={isSaving} className="px-6 md:px-8 py-3 bg-[#10b981] text-[#00452d] font-headline font-black text-sm uppercase tracking-[0.1em] rounded-lg hover:brightness-110 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center gap-3 disabled:opacity-60"><span className="material-symbols-outlined">publish</span>{isSaving ? 'Publishing...' : 'Publish All Updates'}</button>
        </div>
      </div>
    </div>
  );
}
