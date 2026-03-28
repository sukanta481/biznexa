'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

import type { AdminBlogCategoryStat, AdminBlogDashboardData } from '@/lib/blog';

interface BlogManagementClientProps {
  dashboard: AdminBlogDashboardData;
}

interface BlogFormState {
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  authorImage: string;
  category: string;
  serviceLine: string;
  region: string;
  readTime: string;
  coverImage: string;
  coverImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  featured: boolean;
  published: boolean;
}

const CATEGORY_OPTIONS = ['Technology', 'AI', 'Marketing', 'Cloud', 'Web Development', 'Business'];
const SERVICE_OPTIONS = ['Web Dev', 'AI Solutions', 'Marketing', 'Cloud'];
const REGION_OPTIONS = ['EMEA', 'APAC', 'Americas', 'Global'];

const INITIAL_FORM_STATE: BlogFormState = {
  title: '',
  slug: '',
  description: '',
  content: '',
  author: 'Sukanta Saha',
  authorImage: '',
  category: 'Technology',
  serviceLine: 'Web Dev',
  region: 'Global',
  readTime: '5 min read',
  coverImage: '',
  coverImageAlt: '',
  seoTitle: '',
  seoDescription: '',
  publishedAt: '',
  featured: false,
  published: true,
};

function formatCompactNumber(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return `${value}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getCategoryColorClass(index: number) {
  const classes = [
    'bg-primary shadow-[0_0_5px_rgba(0,242,255,0.5)]',
    'bg-secondary shadow-[0_0_5px_rgba(99,102,241,0.5)]',
    'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]',
  ];

  return classes[index % classes.length];
}

function CategoryLegend({ categoryStats }: { categoryStats: AdminBlogCategoryStat[] }) {
  return (
    <div className="w-full space-y-4">
      {categoryStats.length > 0 ? (
        categoryStats.map((category, index) => (
          <div key={category.name} className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${getCategoryColorClass(index)}`}></div>
              <span className="text-slate-400 font-medium">{category.name}</span>
            </div>
            <span className="font-bold text-white">{category.percentage}%</span>
          </div>
        ))
      ) : (
        <div className="text-xs text-slate-400">No categories yet.</div>
      )}
    </div>
  );
}

function FormLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
      {children}
    </label>
  );
}

function FormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-2 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 ${props.className ?? ''}`}
    />
  );
}

function FormTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-2 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 ${props.className ?? ''}`}
    />
  );
}

function FormSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`mt-2 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 ${props.className ?? ''}`}
    />
  );
}

function ImageUploadField({
  id,
  label,
  value,
  onChange,
  placeholder = 'https://...',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
        signal: AbortSignal.timeout(30_000),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Upload failed.');
      onChange(data.url);
    } catch (err) {
      const msg = err instanceof Error
        ? err.name === 'TimeoutError' ? 'Upload timed out. Try a smaller file.' : err.message
        : 'Upload failed.';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) uploadFile(file);
  }

  const hasPreview = value && (value.startsWith('/') || value.startsWith('http'));

  return (
    <div className="space-y-2">
      <FormLabel htmlFor={id}>{label}</FormLabel>

      <div className="flex items-center gap-2 mt-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setUploadError(''); }}
          placeholder={placeholder}
          className="flex-1 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary disabled:opacity-50"
          title="Upload from device"
        >
          {uploading ? (
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-500/30 border-t-primary" />
          ) : (
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
          )}
          <span className="hidden sm:inline">{uploading ? 'Uploading...' : 'Upload'}</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
          onChange={handleFileChange}
          className="hidden"
          aria-label={`Upload ${label}`}
        />
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative mt-1 flex min-h-[80px] items-center justify-center rounded-lg border border-dashed transition-all duration-200 ${
          dragOver
            ? 'border-primary/50 bg-primary/[0.06]'
            : hasPreview
              ? 'border-white/[0.06] bg-white/[0.02]'
              : 'border-white/[0.08] bg-white/[0.02]'
        }`}
      >
        {hasPreview ? (
          <div className="flex items-center gap-3 p-3 w-full">
            <img
              src={value}
              alt="Preview"
              className="h-14 w-14 rounded-lg object-cover border border-white/10 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-300 truncate">{value}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Drag &amp; drop to replace</p>
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="shrink-0 rounded-md p-1 text-slate-500 hover:text-rose-400 transition-colors"
              title="Remove image"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-3 text-center px-4">
            <span className={`material-symbols-outlined text-[22px] ${dragOver ? 'text-primary' : 'text-slate-600'}`}>cloud_upload</span>
            <p className="text-[10px] text-slate-500">
              Drag &amp; drop an image here, or use the upload button
            </p>
            <p className="text-[10px] text-slate-600">JPEG, PNG, WebP, GIF, SVG, AVIF &middot; Max 5 MB</p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-400">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {uploadError}
        </div>
      )}
    </div>
  );
}

export default function BlogManagementClient({ dashboard }: BlogManagementClientProps) {
    const router = useRouter();
    const [realTimeActive, setRealTimeActive] = useState(true);
    const [dateDropdown, setDateDropdown] = useState(false);
    const [serviceDropdown, setServiceDropdown] = useState(false);
    const [regionDropdown, setRegionDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState('Last 30 Days');
    const [selectedService, setSelectedService] = useState('All');
    const [selectedRegion, setSelectedRegion] = useState('EMEA');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [form, setForm] = useState<BlogFormState>(INITIAL_FORM_STATE);

    const { metrics, recentArticles, categoryStats } = dashboard;

    function updateForm<K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function openCreateModal() {
        setSubmitError('');
        setSubmitSuccess('');
        setForm(INITIAL_FORM_STATE);
        setIsCreateModalOpen(true);
    }

    async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess('');

        try {
            const response = await fetch('/api/admin/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
                signal: AbortSignal.timeout(30_000),
            });

            const result = await response.json();

            if (!response.ok || !result.ok) {
                throw new Error(result.error || 'Unable to create blog post.');
            }

            setSubmitSuccess(`Post created successfully at /blog/${result.slug}`);
            setForm(INITIAL_FORM_STATE);
            router.refresh();
        } catch (error) {
            const msg = error instanceof Error
                ? error.name === 'TimeoutError' ? 'Request timed out. Check your database connection and try again.' : error.message
                : 'Unable to create blog post.';
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-white tracking-tight cyber-glow-cyan uppercase">Article Repository</h1>
                    <p className="text-slate-400 text-sm mt-1">Editorial precision and content architecture. Growth is <span className="text-emerald-500 font-bold">+8.2%</span> this cycle.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => { setDateDropdown(!dateDropdown); setServiceDropdown(false); setRegionDropdown(false); }}
                            className="bg-[#1e293b]/40 backdrop-blur-[8px] px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:border-primary/30 transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                            <span className="text-slate-300">{selectedDate}</span>
                        </button>
                        {dateDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl z-50 min-w-[160px] py-1">
                                {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'All Time'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSelectedDate(opt); setDateDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-primary/10 transition-colors ${selectedDate === opt ? 'text-primary font-bold' : 'text-slate-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => { setServiceDropdown(!serviceDropdown); setDateDropdown(false); setRegionDropdown(false); }}
                            className="bg-[#1e293b]/40 backdrop-blur-[8px] px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:border-primary/30 transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">filter_list</span>
                            <span className="text-slate-300">Service: {selectedService}</span>
                        </button>
                        {serviceDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl z-50 min-w-[160px] py-1">
                                {['All', 'Web Dev', 'AI Solutions', 'Marketing', 'Cloud'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSelectedService(opt); setServiceDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-primary/10 transition-colors ${selectedService === opt ? 'text-primary font-bold' : 'text-slate-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => { setRegionDropdown(!regionDropdown); setDateDropdown(false); setServiceDropdown(false); }}
                            className="bg-[#1e293b]/40 backdrop-blur-[8px] px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:border-primary/30 transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">public</span>
                            <span className="text-slate-300">Region: {selectedRegion}</span>
                        </button>
                        {regionDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl z-50 min-w-[160px] py-1">
                                {['EMEA', 'APAC', 'Americas', 'Global'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSelectedRegion(opt); setRegionDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-primary/10 transition-colors ${selectedRegion === opt ? 'text-primary font-bold' : 'text-slate-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="bg-emerald-500 text-slate-950 px-5 py-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Create New Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl text-white">description</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Total Articles</div>
                    <div className="text-3xl font-headline font-bold text-white">{metrics.totalArticles}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-emerald-500">+{metrics.publishedArticles}</span>
                        <span className="text-slate-500 uppercase tracking-tighter">vs last month</span>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl text-emerald-500">visibility</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Total Views</div>
                    <div className="text-3xl font-headline font-bold text-white">{formatCompactNumber(metrics.totalViews)}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-emerald-500">+15.4%</span>
                        <span className="text-slate-500 uppercase tracking-tighter">organic reach</span>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl text-secondary">bar_chart</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Engagement Rate</div>
                    <div className="text-3xl font-headline font-bold text-white">{metrics.totalArticles > 0 ? `${Math.max(1, Math.round((metrics.publishedArticles / metrics.totalArticles) * 48) / 10).toFixed(1)}%` : "4.8%"}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-emerald-500">+0.2%</span>
                        <span className="text-slate-500 uppercase tracking-tighter">industry benchmark</span>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl text-rose-500">forum</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">New Comments</div>
                    <div className="text-3xl font-headline font-bold text-white">{metrics.draftArticles}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-secondary">PENDING</span>
                        <span className="text-slate-500 uppercase tracking-tighter">review required</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl p-8 relative shadow-lg">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-lg font-headline font-bold text-white">Content Performance</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-tighter mt-1">Database-driven article inventory and visibility telemetry</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setRealTimeActive(!realTimeActive)}
                                className={`text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest transition-all ${
                                    realTimeActive
                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,242,255,0.2)]'
                                        : 'bg-white/5 text-slate-500 border border-white/10 hover:text-slate-300'
                                }`}
                            >
                                REAL-TIME
                            </button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[35%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[45%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[55%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[65%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[75%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[85%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[95%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                    </div>
                    <div className="flex justify-between mt-6 px-2 text-[10px] font-headline font-bold text-slate-500 uppercase tracking-widest">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl p-8 flex flex-col items-center shadow-lg">
                    <h3 className="text-lg font-headline font-bold text-white self-start mb-8">Category Distribution</h3>
                    <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(30, 41, 59, 1)" strokeWidth="12"></circle>
                            <circle className="drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]" cx="50" cy="50" fill="transparent" r="40" stroke="#00f2ff" strokeDasharray="251.2" strokeDashoffset="125.6" strokeWidth="12"></circle>
                            <circle className="transform rotate-[180deg] origin-center" cx="50" cy="50" fill="transparent" r="40" stroke="#6366f1" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="12"></circle>
                            <circle className="transform rotate-[270deg] origin-center" cx="50" cy="50" fill="transparent" r="40" stroke="#10b981" strokeDasharray="251.2" strokeDashoffset="200.96" strokeWidth="12"></circle>
                        </svg>
                        <div className="absolute text-center">
                            <span className="block text-2xl font-headline font-bold text-white">{categoryStats.length}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Topics</span>
                        </div>
                    </div>

                    <CategoryLegend categoryStats={categoryStats} />
                </div>
            </div>

            <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h3 className="text-lg font-headline font-bold text-white">Recent Articles</h3>
                    <span className="material-symbols-outlined text-slate-500 cursor-pointer">more_vert</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="px-8 py-5">Title</th>
                                <th className="px-6 py-5">Author</th>
                                <th className="px-6 py-5">Category</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentArticles.length > 0 ? (
                                recentArticles.map((article, index) => (
                                    <tr key={article.slug} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-bold text-white block mb-0.5">{article.title}</span>
                                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{article.slug}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${index % 2 === 0 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>{getInitials(article.author)}</div>
                                                <span className="text-xs text-slate-300">{article.author}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-300">{article.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${article.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>{article.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-300">{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        <td className="px-8 py-4 text-right">
                                            <button onClick={() => alert(`Editing: ${article.title}`)} className="material-symbols-outlined text-slate-500 hover:text-primary transition-colors text-xl">edit_note</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-10 text-center text-slate-400 text-sm">
                                        No articles available yet. Add rows to `blog_posts` and they will appear here automatically.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-white/5 flex justify-center">
                    <button
                        onClick={() => alert('Connect this action to your full article manager when you are ready.')}
                        className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-primary hover:text-white transition-colors"
                    >
                        View All Articles
                    </button>
                </div>
            </div>

            {isCreateModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsCreateModalOpen(false); }}
                >
                    <div className="absolute inset-0 bg-[#020617]/85 backdrop-blur-md" />

                    <div className="relative max-h-[95vh] sm:max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.08] bg-[#0f172a]/95 backdrop-blur-2xl shadow-[0_25px_100px_-12px_rgba(0,242,255,0.08),0_20px_60px_-15px_rgba(0,0,0,0.6)]">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-4 py-4 sm:px-6 sm:py-5">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                                    <span className="material-symbols-outlined text-[20px] text-primary">edit_document</span>
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-headline font-bold text-white tracking-tight">Create Blog Post</h2>
                                    <p className="mt-0.5 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-slate-500">
                                        New article for the content repository
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="group rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-slate-500 transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                                aria-label="Close modal"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreatePost} className="max-h-[calc(95vh-76px)] sm:max-h-[calc(92vh-84px)] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-6 sm:space-y-7">

                            <div className="space-y-4 sm:space-y-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-primary">title</span>
                                    <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Core Details</span>
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/[0.06] to-transparent ml-2" />
                                </div>

                                <div>
                                    <FormLabel htmlFor="title">Post Title</FormLabel>
                                    <FormInput id="title" value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="How AI workflows are changing service delivery" required />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                                    <div>
                                        <FormLabel htmlFor="slug">Slug</FormLabel>
                                        <FormInput id="slug" value={form.slug} onChange={(event) => updateForm('slug', event.target.value)} placeholder="leave blank to auto-generate" />
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="publishedAt">Publish Date</FormLabel>
                                        <FormInput id="publishedAt" type="datetime-local" value={form.publishedAt} onChange={(event) => updateForm('publishedAt', event.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <FormLabel htmlFor="description">Short Description</FormLabel>
                                    <FormTextarea id="description" rows={3} value={form.description} onChange={(event) => updateForm('description', event.target.value)} placeholder="Used on blog cards, metadata, and the top of the detail page." required />
                                </div>

                                <div>
                                    <FormLabel htmlFor="content">Post Content</FormLabel>
                                    <FormTextarea id="content" rows={10} value={form.content} onChange={(event) => updateForm('content', event.target.value)} placeholder="Write the blog body here. HTML/MDX-safe content from the editor can be stored in this field." required className="font-mono text-xs leading-relaxed" />
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-secondary">person</span>
                                    <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Author &amp; Classification</span>
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/[0.06] to-transparent ml-2" />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                                    <div>
                                        <FormLabel htmlFor="author">Author Name</FormLabel>
                                        <FormInput id="author" value={form.author} onChange={(event) => updateForm('author', event.target.value)} required />
                                    </div>
                                    <ImageUploadField
                                        id="authorImage"
                                        label="Author Image"
                                        value={form.authorImage}
                                        onChange={(url) => updateForm('authorImage', url)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <FormLabel htmlFor="category">Category</FormLabel>
                                        <FormSelect id="category" value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                                            {CATEGORY_OPTIONS.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </FormSelect>
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="serviceLine">Service Line</FormLabel>
                                        <FormSelect id="serviceLine" value={form.serviceLine} onChange={(event) => updateForm('serviceLine', event.target.value)}>
                                            {SERVICE_OPTIONS.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </FormSelect>
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="region">Region</FormLabel>
                                        <FormSelect id="region" value={form.region} onChange={(event) => updateForm('region', event.target.value)}>
                                            {REGION_OPTIONS.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </FormSelect>
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="readTime">Read Time</FormLabel>
                                        <FormInput id="readTime" value={form.readTime} onChange={(event) => updateForm('readTime', event.target.value)} placeholder="5 min read" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-emerald-500">image</span>
                                    <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Media &amp; SEO</span>
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/[0.06] to-transparent ml-2" />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                                    <ImageUploadField
                                        id="coverImage"
                                        label="Cover Image"
                                        value={form.coverImage}
                                        onChange={(url) => updateForm('coverImage', url)}
                                    />
                                    <div>
                                        <FormLabel htmlFor="coverImageAlt">Cover Image Alt Text</FormLabel>
                                        <FormInput id="coverImageAlt" value={form.coverImageAlt} onChange={(event) => updateForm('coverImageAlt', event.target.value)} placeholder="Meaningful image description" />
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="seoTitle">SEO Title</FormLabel>
                                        <FormInput id="seoTitle" value={form.seoTitle} onChange={(event) => updateForm('seoTitle', event.target.value)} placeholder="Optional override for browser title" />
                                    </div>
                                    <div>
                                        <FormLabel htmlFor="seoDescription">SEO Description</FormLabel>
                                        <FormTextarea id="seoDescription" rows={3} value={form.seoDescription} onChange={(event) => updateForm('seoDescription', event.target.value)} placeholder="Optional override for metadata description" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
                                    <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Publishing Options</span>
                                </div>
                                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                    <label className="group flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 cursor-pointer transition-all duration-200 hover:border-primary/20 hover:bg-primary/[0.03] has-[:checked]:border-primary/30 has-[:checked]:bg-primary/[0.05]">
                                        <input type="checkbox" checked={form.published} onChange={(event) => updateForm('published', event.target.checked)} className="h-4 w-4 rounded border-white/20 bg-slate-950 text-primary focus:ring-primary/30" />
                                        <div>
                                            <span className="text-sm font-medium text-slate-200">Publish immediately</span>
                                            <span className="block text-[10px] text-slate-500 mt-0.5">Goes live as soon as saved</span>
                                        </div>
                                    </label>
                                    <label className="group flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 cursor-pointer transition-all duration-200 hover:border-secondary/20 hover:bg-secondary/[0.03] has-[:checked]:border-secondary/30 has-[:checked]:bg-secondary/[0.05]">
                                        <input type="checkbox" checked={form.featured} onChange={(event) => updateForm('featured', event.target.checked)} className="h-4 w-4 rounded border-white/20 bg-slate-950 text-secondary focus:ring-secondary/30" />
                                        <div>
                                            <span className="text-sm font-medium text-slate-200">Featured article</span>
                                            <span className="block text-[10px] text-slate-500 mt-0.5">Highlighted on the blog landing</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {(submitError || submitSuccess) && (
                                <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${submitError ? 'border-rose-500/20 bg-rose-500/[0.07] text-rose-300' : 'border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300'}`}>
                                    <span className={`material-symbols-outlined text-[18px] mt-0.5 shrink-0 ${submitError ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {submitError ? 'error' : 'check_circle'}
                                    </span>
                                    <span>{submitError || submitSuccess}</span>
                                </div>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-white/[0.06] pt-5">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06] hover:text-slate-200 w-full sm:w-auto text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative rounded-lg bg-emerald-500 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-950 transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-auto text-center"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {isSubmitting ? (
                                            <>
                                                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                                Create Post
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
