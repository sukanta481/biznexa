'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

import type { CaseStudy } from '@/lib/case-studies';

interface CaseStudiesContentClientProps {
  initialStudies: CaseStudy[];
}

function createEmptyStudy(nextSortOrder: number): CaseStudy {
  return {
    slug: '',
    title: '',
    client: '',
    clientRole: 'Executive Sponsor',
    category: 'AI Automation',
    excerpt: '',
    challenge: '',
    solution: '',
    results: [
      { metric: '', label: '' },
      { metric: '', label: '' },
      { metric: '', label: '' },
      { metric: '', label: '' },
    ],
    technologies: [''],
    coverImage: '',
    coverImageAlt: '',
    clientQuote: '',
    clientImage: '',
    relatedSlugs: [],
    published: true,
    sortOrder: nextSortOrder,
  };
}

function normalizeStudy(study: Partial<CaseStudy> | undefined, nextSortOrder = 1): CaseStudy {
  const base = createEmptyStudy(nextSortOrder);

  const results = Array.isArray(study?.results) ? study.results : [];
  const technologies = Array.isArray(study?.technologies) ? study.technologies : [];
  const relatedSlugs = Array.isArray(study?.relatedSlugs) ? study.relatedSlugs : [];

  return {
    ...base,
    ...study,
    results: base.results.map((fallbackItem, index) => {
      const currentItem = results[index];
      return {
        metric: typeof currentItem?.metric === 'string' ? currentItem.metric : fallbackItem.metric,
        label: typeof currentItem?.label === 'string' ? currentItem.label : fallbackItem.label,
      };
    }),
    technologies: technologies.length > 0 ? technologies.filter((item): item is string => typeof item === 'string') : base.technologies,
    relatedSlugs: relatedSlugs.filter((item): item is string => typeof item === 'string'),
    clientRole: typeof study?.clientRole === 'string' && study.clientRole.trim() ? study.clientRole : base.clientRole,
    coverImageAlt: typeof study?.coverImageAlt === 'string' && study.coverImageAlt.trim()
      ? study.coverImageAlt
      : (typeof study?.title === 'string' && study.title.trim() ? study.title : base.coverImageAlt),
    published: typeof study?.published === 'boolean' ? study.published : base.published,
    sortOrder: typeof study?.sortOrder === 'number' && Number.isFinite(study.sortOrder) ? study.sortOrder : nextSortOrder,
  };
}

export default function CaseStudiesContentClient({ initialStudies }: CaseStudiesContentClientProps) {
  const router = useRouter();
  const normalizedInitialStudies = useMemo(
    () => initialStudies.map((study, index) => normalizeStudy(study, index + 1)),
    [initialStudies],
  );
  const [studies, setStudies] = useState(normalizedInitialStudies);
  const [selectedSlug, setSelectedSlug] = useState(normalizedInitialStudies[0]?.slug ?? '__new__');
  const [draft, setDraft] = useState<CaseStudy>(normalizedInitialStudies[0] ?? createEmptyStudy(1));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const relatedOptions = useMemo(
    () => studies.filter((study) => study.slug && study.slug !== draft.slug),
    [draft.slug, studies],
  );

  function setField<K extends keyof CaseStudy>(field: K, value: CaseStudy[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function selectStudy(slug: string) {
    setSelectedSlug(slug);
    setMessage('');
    setError('');

    if (slug === '__new__') {
      const nextSortOrder = studies.length + 1;
      setDraft(createEmptyStudy(nextSortOrder));
      return;
    }

    const selected = studies.find((study) => study.slug === slug);
    if (selected) {
      setDraft(normalizeStudy(selected, selected.sortOrder || studies.length + 1));
    }
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'clientImage') {
    const file = event.target.files?.[0];
    if (!file) return;

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

    setField(field, result.url as string);
    event.currentTarget.value = '';
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/content/case-studies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to save case study.');
      }

      const normalizedDraft = normalizeStudy(draft, draft.sortOrder || studies.length + 1);
      const nextStudies = studies.some((study) => study.slug === normalizedDraft.slug)
        ? studies.map((study) => (study.slug === normalizedDraft.slug ? normalizedDraft : study))
        : [...studies, normalizedDraft];

      setStudies(nextStudies);
      setDraft(normalizedDraft);
      setSelectedSlug(normalizedDraft.slug);
      setMessage('Case study synced successfully.');
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save case study.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Case Studies</span>
            <span className="material-symbols-outlined text-xs text-slate-600">chevron_right</span>
            <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-[#00f2ff]">Editor</span>
          </nav>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight text-white">{draft.title || 'New Case Study'}</h2>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <select value={selectedSlug} onChange={(event) => selectStudy(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none">
            {studies.map((study) => <option key={study.slug} value={study.slug}>{study.title}</option>)}
            <option value="__new__">+ New Case Study</option>
          </select>
          <button onClick={() => selectStudy('__new__')} className="px-6 py-3 text-slate-400 font-headline text-xs font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">New</button>
          <button onClick={handleSave} className="bg-[#10b981] text-white font-headline font-bold text-xs uppercase tracking-[0.2em] px-10 py-3 rounded-lg shadow-xl shadow-[#10b981]/10 hover:shadow-[#10b981]/20 hover:scale-[1.02] transition-all disabled:opacity-60" disabled={isSaving}>{isSaving ? 'Saving...' : 'Publish Changes'}</button>
        </div>
      </div>

      {(message || error) ? <div className="rounded-lg border border-white/10 bg-[#091328] px-4 py-3 text-sm">{message ? <p className="text-emerald-400">{message}</p> : null}{error ? <p className="text-red-400">{error}</p> : null}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-[#0f172a]/60 backdrop-blur-[16px] border border-white/[0.08] p-6 sm:p-8 rounded-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4"><span className="material-symbols-outlined text-[#00f2ff]">id_card</span><h3 className="font-headline font-bold text-lg uppercase tracking-wider text-white">Hero & Identity</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Project Title</label><input type="text" value={draft.title} onChange={(e) => setField('title', e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 font-headline text-lg text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div>
              <div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Slug</label><input type="text" value={draft.slug} onChange={(e) => setField('slug', e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div>
              <div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Client</label><input type="text" value={draft.client} onChange={(e) => setField('client', e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div>
              <div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Category</label><input type="text" value={draft.category} onChange={(e) => setField('category', e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div>
              <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Excerpt</label><textarea value={draft.excerpt} onChange={(e) => setField('excerpt', e.target.value)} className="w-full h-28 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 resize-y" /></div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Hero Background Image URL</label>
                <div className="flex gap-2">
                  <input type="text" value={draft.coverImage} onChange={(e) => setField('coverImage', e.target.value)} className="flex-1 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm font-mono text-slate-400 outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" />
                  <label className="bg-[#1e293b] px-4 rounded-lg text-[#00f2ff] hover:bg-[#00f2ff]/10 transition-colors border border-white/10 flex items-center cursor-pointer">
                    <span className="material-symbols-outlined">upload_file</span>
                    <input type="file" accept="image/*,.svg,image/svg+xml" className="hidden" onChange={(event) => { void handleUpload(event, 'coverImage'); }} />
                  </label>
                </div>
                {draft.coverImage && (
                  <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden border border-white/10 bg-slate-950/50">
                    <img src={draft.coverImage} alt={draft.coverImageAlt || 'Cover preview'} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setField('coverImage', '')} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-lg flex items-center justify-center text-white transition-all" title="Remove image">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Hero Image Alt</label><input type="text" value={draft.coverImageAlt} onChange={(e) => setField('coverImageAlt', e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div>
            </div>
          </section>

          <section className="bg-[#0f172a]/60 backdrop-blur-[16px] border border-white/[0.08] p-6 sm:p-8 rounded-lg space-y-8">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4"><span className="material-symbols-outlined text-[#00f2ff]">auto_stories</span><h3 className="font-headline font-bold text-lg uppercase tracking-wider text-white">Narrative Content</h3></div>
            <div className="space-y-3"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">The Challenge</label><textarea value={draft.challenge} onChange={(e) => setField('challenge', e.target.value)} className="w-full h-40 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm font-body text-white leading-relaxed outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 resize-y" /></div>
            <div className="space-y-3"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">The Biznexa Solution</label><textarea value={draft.solution} onChange={(e) => setField('solution', e.target.value)} className="w-full h-48 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm font-body text-white leading-relaxed outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 resize-y" /></div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-[#0f172a]/60 backdrop-blur-[16px] border border-white/[0.08] p-6 sm:p-8 rounded-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4"><span className="material-symbols-outlined text-[#00f2ff]">analytics</span><h3 className="font-headline font-bold text-lg uppercase tracking-wider text-white">Quantitative Results</h3></div>
            <div className="space-y-6">{draft.results.map((stat, index) => <div key={index} className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[9px] font-headline font-bold uppercase tracking-[0.2em] text-slate-600">Value {index + 1}</label><input type="text" value={stat.metric} onChange={(e) => setField('results', draft.results.map((item, itemIndex) => itemIndex === index ? { ...item, metric: e.target.value } : item))} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-[#00f2ff] font-bold outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div><div className="space-y-2"><label className="text-[9px] font-headline font-bold uppercase tracking-[0.2em] text-slate-600">Label {index + 1}</label><input type="text" value={stat.label} onChange={(e) => setField('results', draft.results.map((item, itemIndex) => itemIndex === index ? { ...item, label: e.target.value } : item))} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div></div>)}</div>
          </section>

          <section className="bg-[#0f172a]/60 backdrop-blur-[16px] border border-white/[0.08] p-6 sm:p-8 rounded-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4"><span className="material-symbols-outlined text-[#00f2ff]">psychology</span><h3 className="font-headline font-bold text-lg uppercase tracking-wider text-white">Technologies</h3></div>
            <div className="space-y-3">{draft.technologies.map((tech, index) => <input key={index} type="text" value={tech} onChange={(e) => setField('technologies', draft.technologies.map((item, itemIndex) => itemIndex === index ? e.target.value : item))} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" />)}</div>
          </section>

          <section className="bg-[#0f172a]/60 backdrop-blur-[16px] border border-white/[0.08] p-6 sm:p-8 rounded-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4"><span className="material-symbols-outlined text-[#00f2ff]">format_quote</span><h3 className="font-headline font-bold text-lg uppercase tracking-wider text-white">Social Proof</h3></div>
            <div className="space-y-4"><div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Client Quote</label><textarea value={draft.clientQuote} onChange={(e) => setField('clientQuote', e.target.value)} className="w-full h-24 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm italic text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 resize-y" /></div><div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Client Role</label><input type="text" value={draft.clientRole} onChange={(e) => setField('clientRole', e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div><div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Client Portrait URL</label><div className="flex gap-2"><input type="text" value={draft.clientImage} onChange={(e) => setField('clientImage', e.target.value)} className="flex-1 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm font-mono text-slate-400 outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /><label className="bg-[#1e293b] px-4 rounded-lg text-[#00f2ff] hover:bg-[#00f2ff]/10 transition-colors border border-white/10 flex items-center cursor-pointer"><span className="material-symbols-outlined">upload_file</span><input type="file" accept="image/*,.svg,image/svg+xml" className="hidden" onChange={(event) => { void handleUpload(event, 'clientImage'); }} /></label></div></div></div>
          </section>

          <section className="bg-[#0f172a]/60 backdrop-blur-[16px] border border-white/[0.08] p-6 sm:p-8 rounded-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4"><span className="material-symbols-outlined text-[#00f2ff]">link</span><h3 className="font-headline font-bold text-lg uppercase tracking-wider text-white">Related Studies</h3></div>
            <div className="space-y-2">{relatedOptions.map((study) => <label key={study.slug} className="flex items-center gap-3 bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 hover:border-[#00f2ff]/30 p-3 rounded-lg cursor-pointer transition-colors"><input type="checkbox" checked={draft.relatedSlugs.includes(study.slug)} onChange={() => setField('relatedSlugs', draft.relatedSlugs.includes(study.slug) ? draft.relatedSlugs.filter((slug) => slug !== study.slug) : [...draft.relatedSlugs, study.slug])} className="rounded bg-slate-950 border-slate-600 text-[#00f2ff] focus:ring-0 focus:ring-offset-0" /><span className="text-xs text-white font-body">{study.title}</span></label>)}</div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Sort Order</label><input type="number" value={draft.sortOrder} onChange={(e) => setField('sortOrder', Number(e.target.value))} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div><div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Published</label><select value={draft.published ? 'true' : 'false'} onChange={(e) => setField('published', e.target.value === 'true')} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none"><option value="true">Published</option><option value="false">Draft</option></select></div></div>
          </section>
        </div>
      </div>
    </div>
  );
}
