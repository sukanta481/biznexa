'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

import type { CaseStudy } from '@/lib/case-studies';

interface CaseStudiesContentClientProps {
  initialStudies: CaseStudy[];
  clientDirectory?: string[];
}

type ImageField = 'coverImage' | 'clientImage';
type View = 'list' | 'editor';
type StatusFilter = 'All' | 'Published' | 'Draft';

// Seeds the category picker so the dropdown is never empty on a fresh database.
const BASE_CATEGORIES = ['AI Automation', 'Web Development', 'Digital Marketing'];

/**
 * Reads a fetch response as JSON, falling back to the raw body when the server
 * answered with something else (an HTML error page from the host, an empty
 * 502, a proxy timeout). Without this the real failure is hidden behind a
 * generic "Unexpected token <" parse error.
 */
async function readJsonResponse(response: Response): Promise<{ ok?: boolean; error?: string; url?: string }> {
  const raw = await response.text();

  try {
    return JSON.parse(raw) as { ok?: boolean; error?: string; url?: string };
  } catch {
    const snippet = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
    return {
      ok: false,
      error: `Server returned ${response.status} ${response.statusText || 'error'}${snippet ? ` — ${snippet}` : ' with an empty body'}`,
    };
  }
}

function createEmptyStudy(nextSortOrder: number): CaseStudy {
  return {
    slug: '',
    title: '',
    client: '',
    clientName: '',
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
    clientName: typeof study?.clientName === 'string' ? study.clientName : base.clientName,
    clientRole: typeof study?.clientRole === 'string' && study.clientRole.trim() ? study.clientRole : base.clientRole,
    coverImageAlt: typeof study?.coverImageAlt === 'string' && study.coverImageAlt.trim()
      ? study.coverImageAlt
      : (typeof study?.title === 'string' && study.title.trim() ? study.title : base.coverImageAlt),
    published: typeof study?.published === 'boolean' ? study.published : base.published,
    sortOrder: typeof study?.sortOrder === 'number' && Number.isFinite(study.sortOrder) ? study.sortOrder : nextSortOrder,
  };
}

export default function CaseStudiesContentClient({ initialStudies, clientDirectory = [] }: CaseStudiesContentClientProps) {
  const router = useRouter();
  const normalizedInitialStudies = useMemo(
    () => initialStudies.map((study, index) => normalizeStudy(study, index + 1)),
    [initialStudies],
  );
  const [studies, setStudies] = useState(normalizedInitialStudies);
  const [selectedSlug, setSelectedSlug] = useState(normalizedInitialStudies[0]?.slug ?? '__new__');
  const [draft, setDraft] = useState<CaseStudy>(normalizedInitialStudies[0] ?? createEmptyStudy(1));
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // The dashboard lands on the library; the editor opens only on demand.
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const relatedOptions = useMemo(
    () => studies.filter((study) => study.slug && study.slug !== draft.slug),
    [draft.slug, studies],
  );

  const clientOptions = useMemo(
    () => Array.from(new Set([...clientDirectory, ...studies.map((study) => study.client)].filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [clientDirectory, studies],
  );

  const categoryOptions = useMemo(
    () => Array.from(new Set([...BASE_CATEGORIES, ...studies.map((study) => study.category)].filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [studies],
  );

  // Category tabs carry their own counts so the library reads at a glance.
  const categoryTabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const study of studies) {
      if (!study.category) continue;
      counts.set(study.category, (counts.get(study.category) ?? 0) + 1);
    }

    return [
      { name: 'All', count: studies.length },
      ...Array.from(counts.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, count]) => ({ name, count })),
    ];
  }, [studies]);

  const filteredStudies = useMemo(() => {
    const term = search.trim().toLowerCase();

    return studies
      .filter((study) => categoryFilter === 'All' || study.category === categoryFilter)
      .filter((study) => {
        if (statusFilter === 'All') return true;
        return statusFilter === 'Published' ? study.published : !study.published;
      })
      .filter((study) => {
        if (!term) return true;
        return [study.title, study.client, study.slug, study.category, study.excerpt, study.clientName]
          .some((value) => value?.toLowerCase().includes(term));
      })
      .sort((a, b) => (a.sortOrder - b.sortOrder) || a.title.localeCompare(b.title));
  }, [categoryFilter, search, statusFilter, studies]);

  const stats = useMemo(() => ({
    total: studies.length,
    published: studies.filter((study) => study.published).length,
    drafts: studies.filter((study) => !study.published).length,
    categories: new Set(studies.map((study) => study.category).filter(Boolean)).size,
  }), [studies]);

  const hasActiveFilters = search.trim() !== '' || categoryFilter !== 'All' || statusFilter !== 'All';

  function clearFilters() {
    setSearch('');
    setCategoryFilter('All');
    setStatusFilter('All');
  }

  function openEditor(slug: string) {
    selectStudy(slug);
    setView('editor');
  }

  function backToList() {
    setView('list');
    setMessage('');
    setError('');
  }

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

  async function handleUpload(event: ChangeEvent<HTMLInputElement>, field: ImageField) {
    // Capture the element now: React nulls `currentTarget` once the handler
    // returns, so it is unusable after the first await.
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    const fieldLabel = field === 'coverImage' ? 'Hero background image' : 'Portrait / logo';

    setMessage('');
    setError('');
    setUploadingField(field);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await readJsonResponse(response);
      if (!response.ok || !result.ok || !result.url) {
        throw new Error(result.error || `Upload failed (HTTP ${response.status}).`);
      }

      const uploadedUrl = result.url;
      setBrokenImages((current) => ({ ...current, [uploadedUrl]: false }));
      setField(field, uploadedUrl);
      setMessage(`${fieldLabel} uploaded. Publish changes to save it.`);
    } catch (uploadError) {
      const reason = uploadError instanceof Error ? uploadError.message : 'Upload failed.';
      setError(`${fieldLabel} upload failed — ${reason}`);
    } finally {
      setUploadingField(null);
      // Reset so re-picking the same file fires change again.
      input.value = '';
    }
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

      const result = await readJsonResponse(response);
      if (!response.ok || !result.ok) {
        throw new Error(result.error || `Unable to save case study (HTTP ${response.status}).`);
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

  function renderImageField(field: ImageField, previewClassName: string) {
    const value = draft[field];
    const isUploading = uploadingField === field;
    const isBroken = Boolean(value) && brokenImages[value];

    return (
      <>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setField(field, e.target.value)}
            placeholder="Paste an image URL or upload a file"
            className="flex-1 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm font-mono text-slate-400 outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20"
          />
          <label className={`bg-[#1e293b] px-4 rounded-lg text-[#00f2ff] transition-colors border border-white/10 flex items-center ${isUploading ? 'opacity-60 cursor-wait' : 'hover:bg-[#00f2ff]/10 cursor-pointer'}`} title={isUploading ? 'Uploading…' : 'Upload an image'}>
            <span className={`material-symbols-outlined ${isUploading ? 'animate-spin' : ''}`}>{isUploading ? 'progress_activity' : 'upload_file'}</span>
            <input
              type="file"
              accept="image/*,.svg,image/svg+xml"
              className="hidden"
              disabled={isUploading}
              onChange={(event) => { void handleUpload(event, field); }}
            />
          </label>
        </div>

        {isUploading ? <p className="text-xs text-[#00f2ff]">Uploading…</p> : null}

        {value ? (
          <div className={`mt-2 relative rounded-lg overflow-hidden border bg-slate-950/50 ${isBroken ? 'border-red-500/40' : 'border-white/10'} ${previewClassName}`}>
            {isBroken ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-3 text-center">
                <span className="material-symbols-outlined text-red-400">broken_image</span>
                <p className="text-[11px] leading-tight text-red-300">This URL did not load. Check that the file exists and is publicly readable.</p>
              </div>
            ) : (
              <img
                src={value}
                alt={field === 'coverImage' ? (draft.coverImageAlt || 'Cover preview') : 'Portrait / logo preview'}
                className="w-full h-full object-cover"
                onError={() => setBrokenImages((current) => ({ ...current, [value]: true }))}
                onLoad={() => setBrokenImages((current) => (current[value] ? { ...current, [value]: false } : current))}
              />
            )}
            <button
              type="button"
              onClick={() => setField(field, '')}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-lg flex items-center justify-center text-white transition-all"
              title="Remove image"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ) : null}
      </>
    );
  }

  function renderThumb(study: CaseStudy, className: string) {
    const isBroken = Boolean(study.coverImage) && brokenImages[study.coverImage];

    if (!study.coverImage || isBroken) {
      return (
        <div className={`flex shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] ${className}`}>
          <span className={`material-symbols-outlined text-[18px] ${isBroken ? 'text-rose-400' : 'text-slate-600'}`}>
            {isBroken ? 'broken_image' : 'image'}
          </span>
        </div>
      );
    }

    return (
      <img
        src={study.coverImage}
        alt=""
        className={`shrink-0 rounded-lg border border-white/[0.08] object-cover ${className}`}
        onError={() => setBrokenImages((current) => ({ ...current, [study.coverImage]: true }))}
      />
    );
  }

  function statusBadge(published: boolean) {
    return (
      <span className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${published ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border border-slate-500/30 bg-slate-500/20 text-slate-400'}`}>
        {published ? 'Published' : 'Draft'}
      </span>
    );
  }

  if (view === 'list') {
    return (
      <div className="mx-auto w-full max-w-[1400px] space-y-8">
        <div className="mb-2 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-headline text-3xl font-bold uppercase tracking-tight text-white">Case Study Library</h1>
            <p className="mt-1 text-sm text-slate-400">Browse, filter, and edit the proof points that power the public case studies page.</p>
          </div>
          <button
            onClick={() => openEditor('__new__')}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            New Case Study
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {[
            { label: 'Total Studies', value: stats.total, icon: 'workspaces', tone: 'text-white' },
            { label: 'Published', value: stats.published, icon: 'public', tone: 'text-emerald-400' },
            { label: 'Drafts', value: stats.drafts, icon: 'edit_note', tone: 'text-amber-400' },
            { label: 'Categories', value: stats.categories, icon: 'category', tone: 'text-[#00f2ff]' },
          ].map((tile) => (
            <div key={tile.label} className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#1e293b]/40 p-5 backdrop-blur-[8px] transition-all hover:border-[#00f2ff]/30 sm:p-6">
              <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                <span className="material-symbols-outlined text-5xl text-white">{tile.icon}</span>
              </div>
              <div className="mb-1 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-500">{tile.label}</div>
              <div className={`font-headline text-3xl font-bold ${tile.tone}`}>{tile.value}</div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-white/5 bg-[#192540]/60 shadow-2xl backdrop-blur-[16px]">
          <div className="space-y-4 border-b border-white/5 bg-white/5 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-500">search</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, client, slug, or category..."
                  aria-label="Search case studies"
                  className="w-full rounded-lg border border-white/10 bg-slate-950/70 py-3 pl-11 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20"
                />
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-950/70 p-1">
                {(['All', 'Published', 'Draft'] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex-1 whitespace-nowrap rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all sm:flex-none ${statusFilter === status ? 'bg-[#00f2ff]/10 text-[#00f2ff]' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setCategoryFilter(tab.name)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${categoryFilter === tab.name ? 'border-[#00f2ff]/40 bg-[#00f2ff]/10 text-[#00f2ff]' : 'border-white/5 bg-white/[0.03] text-slate-400 hover:border-white/15 hover:text-slate-200'}`}
                >
                  {tab.name}
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${categoryFilter === tab.name ? 'bg-[#00f2ff]/15' : 'bg-white/5'}`}>{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-widest text-slate-500">
                Showing {filteredStudies.length} of {studies.length}
              </p>
              {hasActiveFilters ? (
                <button onClick={clearFilters} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-[#00f2ff]">
                  <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>

          {filteredStudies.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-700">search_off</span>
              <p className="text-sm text-slate-400">
                {studies.length === 0 ? 'No case studies yet.' : 'No case studies match these filters.'}
              </p>
              {hasActiveFilters ? (
                <button onClick={clearFilters} className="text-[11px] font-bold uppercase tracking-widest text-[#00f2ff] transition-colors hover:text-white">Clear filters</button>
              ) : (
                <button onClick={() => openEditor('__new__')} className="text-[11px] font-bold uppercase tracking-widest text-[#00f2ff] transition-colors hover:text-white">Create the first one</button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop: dense table. */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/5 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      <th className="px-8 py-5">Case Study</th>
                      <th className="px-6 py-5">Client</th>
                      <th className="px-6 py-5">Category</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5">Order</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudies.map((study) => (
                      <tr key={study.slug} className="group transition-colors hover:bg-white/5">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            {renderThumb(study, 'h-12 w-16')}
                            <div className="min-w-0">
                              <span className="block truncate text-sm font-bold text-white">{study.title || 'Untitled'}</span>
                              <span className="block truncate font-mono text-[11px] text-slate-500">/{study.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300">{study.client || '—'}</td>
                        <td className="px-6 py-4">
                          <span className="whitespace-nowrap rounded border border-white/5 bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">{study.category || '—'}</span>
                        </td>
                        <td className="px-6 py-4">{statusBadge(study.published)}</td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-400">{study.sortOrder}</td>
                        <td className="px-8 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={`/case-studies/${study.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-md p-2 text-slate-500 transition-colors hover:text-[#00f2ff]"
                              title="View live page"
                            >
                              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            </a>
                            <button
                              onClick={() => openEditor(study.slug)}
                              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-all hover:border-[#00f2ff]/30 hover:bg-[#00f2ff]/[0.06] hover:text-[#00f2ff]"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit_note</span>
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet: stacked cards. */}
              <div className="divide-y divide-white/5 lg:hidden">
                {filteredStudies.map((study) => (
                  <button
                    key={study.slug}
                    onClick={() => openEditor(study.slug)}
                    className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-white/5 sm:p-5"
                  >
                    {renderThumb(study, 'h-14 w-20')}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-bold text-white">{study.title || 'Untitled'}</span>
                        {statusBadge(study.published)}
                      </div>
                      <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-500">/{study.slug}</span>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                        {study.category ? <span className="rounded border border-white/5 bg-white/[0.04] px-2 py-1 text-slate-300">{study.category}</span> : null}
                        {study.client ? <span className="text-slate-500">{study.client}</span> : null}
                      </div>
                    </div>
                    <span className="material-symbols-outlined mt-1 shrink-0 text-[18px] text-slate-600">chevron_right</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 mb-2">
            <button onClick={backToList} className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-[#00f2ff]">Case Studies</button>
            <span className="material-symbols-outlined text-xs text-slate-600">chevron_right</span>
            <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-[#00f2ff]">{selectedSlug === '__new__' ? 'New' : 'Editor'}</span>
          </nav>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight text-white">{draft.title || 'New Case Study'}</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={backToList} className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-headline text-xs font-bold uppercase tracking-[0.2em] text-slate-400 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Library
          </button>
          <button onClick={handleSave} className="bg-[#10b981] text-white font-headline font-bold text-xs uppercase tracking-[0.2em] px-10 py-3 rounded-lg shadow-xl shadow-[#10b981]/10 hover:shadow-[#10b981]/20 hover:scale-[1.02] transition-all disabled:opacity-60" disabled={isSaving}>{isSaving ? 'Saving...' : 'Publish Changes'}</button>
        </div>
      </div>

      {(message || error) ? (
        <div className={`rounded-lg border px-4 py-3 text-sm ${error ? 'border-red-500/40 bg-red-500/10' : 'border-white/10 bg-[#091328]'}`}>
          {message ? <p className="text-emerald-400">{message}</p> : null}
          {error ? (
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-base text-red-400">error</span>
              <div className="min-w-0">
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">Something went wrong</p>
                <p className="mt-1 break-words text-red-200">{error}</p>
              </div>
              <button type="button" onClick={() => setError('')} className="ml-auto shrink-0 text-red-400 transition-colors hover:text-white" title="Dismiss">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-[#0f172a]/60 backdrop-blur-[16px] border border-white/[0.08] p-6 sm:p-8 rounded-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4"><span className="material-symbols-outlined text-[#00f2ff]">id_card</span><h3 className="font-headline font-bold text-lg uppercase tracking-wider text-white">Hero & Identity</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Project Title</label><input type="text" value={draft.title} onChange={(e) => setField('title', e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 font-headline text-lg text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div>
              <div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Slug</label><input type="text" value={draft.slug} onChange={(e) => setField('slug', e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div>
              <div className="space-y-2">
                <label htmlFor="cs-client" className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Client <span className="text-slate-600 normal-case tracking-normal font-body">— pick one or type a new name</span></label>
                <input id="cs-client" list="cs-client-options" type="text" value={draft.client} onChange={(e) => setField('client', e.target.value)} placeholder="Select or type a client" className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" />
                <datalist id="cs-client-options">{clientOptions.map((option) => <option key={option} value={option} />)}</datalist>
              </div>
              <div className="space-y-2">
                <label htmlFor="cs-category" className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Category <span className="text-slate-600 normal-case tracking-normal font-body">— pick one or type a new one</span></label>
                <input id="cs-category" list="cs-category-options" type="text" value={draft.category} onChange={(e) => setField('category', e.target.value)} placeholder="Select or type a category" className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" />
                <datalist id="cs-category-options">{categoryOptions.map((option) => <option key={option} value={option} />)}</datalist>
              </div>
              <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Excerpt</label><textarea value={draft.excerpt} onChange={(e) => setField('excerpt', e.target.value)} className="w-full h-28 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 resize-y" /></div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Hero Background Image URL <span className="text-slate-600 normal-case tracking-normal font-body">— 1200×630px recommended</span></label>
                {renderImageField('coverImage', 'w-full h-40')}
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
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Client Quote</label><textarea value={draft.clientQuote} onChange={(e) => setField('clientQuote', e.target.value)} className="w-full h-24 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm italic text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20 resize-y" /></div>
              <div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Person Name</label><input type="text" value={draft.clientName} onChange={(e) => setField('clientName', e.target.value)} placeholder="e.g. Rajiv Mehta" className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div>
              <div className="space-y-2"><label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Designation / Role</label><input type="text" value={draft.clientRole} onChange={(e) => setField('clientRole', e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-[#00f2ff]/50 focus:ring-2 focus:ring-[#00f2ff]/20" /></div>
              <div className="space-y-2">
                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Portrait / Logo <span className="text-slate-600 normal-case tracking-normal font-body">— 400×400px recommended</span></label>
                {renderImageField('clientImage', 'w-28 h-28')}
              </div>
            </div>
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
