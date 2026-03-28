'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type SiteSocialLinks = {
  whatsapp: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  github: string;
  telegram: string;
};

const EMPTY_SOCIALS: SiteSocialLinks = {
  whatsapp: '',
  linkedin: '',
  twitter: '',
  facebook: '',
  instagram: '',
  youtube: '',
  github: '',
  telegram: '',
};

const SOCIAL_FIELDS: Array<{ key: keyof SiteSocialLinks; label: string; placeholder: string }> = [
  { key: 'whatsapp', label: 'WhatsApp Link', placeholder: 'https://wa.me/919876543210' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/your-brand' },
  { key: 'twitter', label: 'X / Twitter', placeholder: 'https://x.com/yourbrand' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourbrand' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourbrand' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourbrand' },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourbrand' },
  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/yourbrand' },
];

export default function SiteSettings() {
  const [platformName, setPlatformName] = useState('Biznexa Cloud');
  const [contactEmail, setContactEmail] = useState('admin@biznexa.io');
  const [ga4Id, setGa4Id] = useState('G-BZNXA2024');
  const [metaTitle, setMetaTitle] = useState('Biznexa | Enterprise Logic Engine');
  const [keywords, setKeywords] = useState('cms, enterprise, headless, nodejs, architecture');
  const [s3Region, setS3Region] = useState('us-east-1');
  const [social, setSocial] = useState<SiteSocialLinks>(EMPTY_SOCIALS);
  const [isLoadingSocial, setIsLoadingSocial] = useState(true);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [socialMessage, setSocialMessage] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings/site', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.error ?? 'Failed to load social links.');
        }

        if (active) {
          setSocial({ ...EMPTY_SOCIALS, ...data.settings.social });
        }
      } catch (error) {
        if (active) {
          setSocialMessage(error instanceof Error ? error.message : 'Failed to load social links.');
        }
      } finally {
        if (active) {
          setIsLoadingSocial(false);
        }
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const activeCount = useMemo(
    () => Object.values(social).filter((value) => value.trim().length > 0).length,
    [social],
  );

  async function handleSaveSocialLinks() {
    setIsSavingSocial(true);
    setSocialMessage(null);

    try {
      const response = await fetch('/api/admin/settings/site', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ social }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'Failed to save social links.');
      }

      setSocialMessage('Social links updated successfully.');
    } catch (error) {
      setSocialMessage(error instanceof Error ? error.message : 'Failed to save social links.');
    } finally {
      setIsSavingSocial(false);
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <header className="mb-12">
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight mb-2">Site Settings</h1>
        <p className="text-slate-400 max-w-2xl font-body">Configure your global platform architecture, SEO parameters, and cloud service integrations from a single authoritative dashboard.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8 bg-[#0f1930]/80 backdrop-blur-[16px] rounded-xl p-8 shadow-lg relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full -mr-32 -mt-32 blur-[100px] transition-all group-hover:bg-cyan-400/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-cyan-400">palette</span>
              <h3 className="text-xl font-headline font-semibold text-white">General Branding</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-headline uppercase tracking-widest text-[10px] text-slate-500">Platform Identity</label>
                  <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="bg-[#192540]/60 border border-white/5 rounded-sm px-4 py-3 focus:ring-1 focus:ring-cyan-400/30 transition-all text-white outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-headline uppercase tracking-widest text-[10px] text-slate-500">Primary Contact Email</label>
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="bg-[#192540]/60 border border-white/5 rounded-sm px-4 py-3 focus:ring-1 focus:ring-cyan-400/30 transition-all text-white outline-none" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-headline uppercase tracking-widest text-[10px] text-slate-500">Brand Logo Asset</label>
                <input type="file" ref={logoInputRef} accept=".svg,.png,.webp" className="hidden" onChange={(e) => { if (e.target.files?.[0]) alert(`Selected: ${e.target.files[0].name}`); }} />
                <div onClick={() => logoInputRef.current?.click()} className="flex-1 border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center bg-black/20 group/upload hover:bg-black/40 hover:border-cyan-400/30 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-slate-600 group-hover/upload:text-cyan-400 transition-colors mb-2">cloud_upload</span>
                  <p className="text-xs text-slate-400 text-center">Drag and drop logo<br/>SVG, PNG or WEBP (Max 2MB)</p>
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button onClick={() => alert('Branding saved!')} className="bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 py-2.5 rounded-md font-headline uppercase tracking-widest text-xs font-bold text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-400/20">
                Save Branding
              </button>
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 bg-[#141f38]/80 backdrop-blur-[16px] rounded-xl p-8 flex flex-col justify-between border border-white/5 shadow-lg">
          <div>
            <h4 className="font-headline uppercase tracking-widest text-[10px] text-cyan-400 mb-6">System Health</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">CMS Engine</span>
                <span className="px-2 py-0.5 bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[10px] font-bold rounded uppercase">Stable</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">API Latency</span>
                <span className="text-sm text-white font-mono">24ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Last Sync</span>
                <span className="text-sm text-white">2m ago</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-xs text-slate-500 italic">&quot;Configuration changes are propagated across the global edge network in ~60 seconds.&quot;</p>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-5 bg-[#0f1930]/80 backdrop-blur-[16px] rounded-xl p-8 shadow-lg border border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-secondary">query_stats</span>
            <h3 className="text-xl font-headline font-semibold text-white">SEO & Analytics</h3>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-headline uppercase tracking-widest text-[10px] text-slate-500">Google Analytics 4 ID</label>
              <input type="text" value={ga4Id} onChange={(e) => setGa4Id(e.target.value)} className="w-full bg-[#192540]/60 border border-white/5 rounded-sm px-4 py-3 focus:ring-1 focus:ring-secondary/30 transition-all text-white font-mono outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-headline uppercase tracking-widest text-[10px] text-slate-500">Global Meta Title</label>
              <input type="text" placeholder="The Next Generation Enterprise CMS" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="bg-[#192540]/60 border border-white/5 rounded-sm px-4 py-3 focus:ring-1 focus:ring-secondary/30 transition-all text-white outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-headline uppercase tracking-widest text-[10px] text-slate-500">Meta Keywords</label>
              <textarea rows={3} value={keywords} onChange={(e) => setKeywords(e.target.value)} className="bg-[#192540]/60 border border-white/5 rounded-sm px-4 py-3 focus:ring-1 focus:ring-secondary/30 transition-all text-white resize-none outline-none"></textarea>
            </div>
            <button onClick={() => alert('Metadata updated!')} className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 py-3 rounded-md font-headline uppercase tracking-widest text-xs font-bold text-slate-950 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-emerald-400/10">
              Update Metadata
            </button>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-7 bg-[#0f1930]/80 backdrop-blur-[16px] rounded-xl p-8 shadow-lg relative overflow-hidden border border-white/5">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-emerald-400">api</span>
            <h3 className="text-xl font-headline font-semibold text-white">Cloud & AI Bridge</h3>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-[#192540]/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-2.5 bg-black/20 rounded-lg text-slate-400 border border-white/5 shrink-0">
                <span className="material-symbols-outlined">cloud</span>
              </div>
              <div className="flex-1 w-full space-y-4">
                <h4 className="text-sm font-headline font-bold text-white uppercase tracking-wider">AWS Storage Configuration</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-slate-500">Access Key</label>
                    <input type="password" defaultValue="••••••••••••••••" className="w-full bg-[#141f38] border border-white/5 text-xs rounded px-3 py-2 text-cyan-400 outline-none focus:ring-1 focus:ring-cyan-400/30" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase text-slate-500">S3 Region</label>
                    <select value={s3Region} onChange={(e) => setS3Region(e.target.value)} className="w-full bg-[#141f38] border border-white/5 text-xs rounded px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-400/30">
                      <option>us-east-1</option>
                      <option>eu-central-1</option>
                      <option>ap-southeast-1</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-[#192540]/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="p-2.5 bg-black/20 rounded-lg text-slate-400 border border-white/5 shrink-0">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <div className="flex-1 w-full space-y-4">
                <h4 className="text-sm font-headline font-bold text-white uppercase tracking-wider">AI Provider Integration</h4>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase text-slate-500">OpenAI Secret Key</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="password" defaultValue="sk-••••••••••••••••••••••••" className="flex-1 min-w-0 bg-[#141f38] border border-white/5 text-xs rounded px-3 py-2 text-cyan-400 outline-none focus:ring-1 focus:ring-cyan-400/30" />
                    <button onClick={() => alert('Connection test successful!')} className="bg-[#192540] px-4 py-2 sm:py-0 text-[10px] font-headline uppercase font-bold text-slate-300 border border-white/10 rounded hover:bg-white/5 transition-colors shrink-0">Test Connection</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">lock</span>
              Encryption: AES-256-GCM
            </span>
            <button onClick={() => alert('Keys secured!')} className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 py-2.5 rounded-md font-headline uppercase tracking-widest text-xs font-bold text-slate-950 hover:opacity-90 transition-all shadow-lg shadow-emerald-400/20">
              Secure All Keys
            </button>
          </div>
        </section>

        <section className="col-span-12 bg-[#0f1930]/80 backdrop-blur-[16px] rounded-xl p-8 shadow-lg border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[120px] -mr-24 -mt-24"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary">share</span>
                  <h3 className="text-xl font-headline font-semibold text-white">Social Links</h3>
                </div>
                <p className="text-sm text-slate-400 max-w-2xl">
                  Configure all footer social links here. If a field is empty, that social icon stays hidden on the frontend automatically.
                </p>
              </div>
              <div className="bg-[#141f38]/80 border border-white/5 rounded-lg px-4 py-3 min-w-[180px]">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Active Icons</div>
                <div className="text-2xl font-mono text-white">{isLoadingSocial ? '--' : activeCount}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {SOCIAL_FIELDS.map((field) => (
                <div key={field.key} className="flex flex-col gap-2">
                  <label className="font-headline uppercase tracking-widest text-[10px] text-slate-500">
                    {field.label}
                  </label>
                  <input
                    type="url"
                    value={social[field.key]}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setSocial((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    className="bg-[#192540]/60 border border-white/5 rounded-sm px-4 py-3 focus:ring-1 focus:ring-primary/30 transition-all text-white outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-xs text-slate-500">
                Supported platforms: WhatsApp, LinkedIn, X/Twitter, Facebook, Instagram, YouTube, GitHub, Telegram.
              </div>
              <button
                onClick={handleSaveSocialLinks}
                disabled={isSavingSocial || isLoadingSocial}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 py-2.5 rounded-md font-headline uppercase tracking-widest text-xs font-bold text-slate-950 hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-emerald-400/20"
              >
                {isSavingSocial ? 'Saving...' : 'Save Social Links'}
              </button>
            </div>

            {socialMessage ? (
              <p className="mt-4 text-sm text-slate-300">{socialMessage}</p>
            ) : null}
          </div>
        </section>

        <div className="col-span-12 h-64 rounded-xl overflow-hidden relative border border-white/5 shadow-lg group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL12wKDySTP6LwyhMhlbWURsCwqHSAdstQV6ayWp7qo6SJSziKqt1Wa__74IfM4qxghwlnCAunCwBHUpBudiAzZKdS4TtttAez2YCA5dnDOMXN5f_p6HYJhUfpIgUPfHGBh6Ce0XjXjsiCD1eQ9UH_2gDLN_Sk9bJF0V4ckfj9ufdtFrYG8uq93MY1K5fZjlyBJn8KLWoPqRDPihx7SEI0RnF1AqFSfxv3vzBodkVjPwwucDQgfoAJqtoZM5eSnZZ-WKTKecSTXOuY"
            alt="Global Network"
            className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-[#060e20]/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 pr-8">
            <span className="inline-block px-3 py-1 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 text-[10px] font-headline font-bold uppercase tracking-widest rounded-full mb-3">Global Edge Network</span>
            <h3 className="text-xl md:text-2xl font-headline tracking-tight text-white max-w-lg">Your configuration is mirrored across <span className="text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]">24 global regions</span> for sub-millisecond delivery.</h3>
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
}
