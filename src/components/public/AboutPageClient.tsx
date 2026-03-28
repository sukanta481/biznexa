'use client';

import Link from "next/link";

import type { AboutContent } from "@/lib/about";

export default function AboutPageClient({ content }: { content: AboutContent }) {
  const [metricOne, metricTwo] = content.leadership.metrics;
  const [pillarOne, pillarTwo, pillarThree, pillarFour] = content.pillars.items;

  return (
    <>
      <section className="md:hidden relative px-6 pt-10 pb-12 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary mb-4 block font-bold">{content.hero.badgeText}</span>
          <h1 className="font-headline text-[3.5rem] leading-[1.1] font-bold -ml-1 tracking-tight text-on-surface mb-6">
            {content.hero.headlineLead} <br /> <span className="text-primary">{content.hero.headlineAccent}</span>.
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-[95%]">{content.hero.description}</p>
        </div>
      </section>

      <section className="hidden md:block max-w-7xl mx-auto px-8 mb-24 md:mb-32 mt-12">
        <div className="relative overflow-hidden rounded-2xl h-[450px] flex items-center p-12 glass-panel cyber-border">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"></div>
            <img alt="" className="w-full h-full object-cover opacity-40" src={content.hero.desktopImage} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="font-label text-[10px] font-bold tracking-[0.2em] text-primary uppercase">{content.hero.badgeText}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter mb-6 text-glow leading-none">
              {content.hero.headlineLead} <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{content.hero.headlineAccent}</span>.
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed font-body">{content.hero.description}</p>
          </div>
        </div>
      </section>

      <section className="lg:hidden px-6 py-4">
        <div className="glass-panel rounded-2xl p-6 border border-white/5 relative overflow-hidden cyber-border">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-24 h-24 shrink-0">
              <img alt={content.leadership.name} className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500 border border-primary/20" src={content.leadership.portraitImage} />
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight">{content.leadership.name}</h3>
              <p className="font-label text-[10px] uppercase tracking-widest text-primary font-bold">{content.leadership.title}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <p className="text-white italic text-sm leading-relaxed pl-4 border-l-2 border-primary/40">&quot;{content.leadership.quote}&quot;</p>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">{content.leadership.bio}</p>
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-white/5">
              <div>
                <div className="text-3xl font-headline font-bold text-primary tracking-tighter">{metricOne?.value}</div>
                <div className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant mt-1 font-bold">{metricOne?.label}</div>
              </div>
              <div>
                <div className="text-3xl font-headline font-bold text-primary tracking-tighter">{metricTwo?.value}</div>
                <div className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant mt-1 font-bold">{metricTwo?.label}</div>
              </div>
            </div>
            <button className="flex items-center gap-2 text-white font-label uppercase text-[10px] font-bold tracking-[0.2em] group">
              {content.leadership.bioButtonLabel}
              <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">east</span>
            </button>
          </div>
        </div>
      </section>

      <section className="hidden lg:block max-w-7xl mx-auto px-8 pt-20 pb-8">
        <div className="glass-panel rounded-3xl overflow-hidden cyber-border">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative h-[500px] lg:h-auto overflow-hidden group">
              <img alt={`${content.leadership.name} portrait`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" src={content.leadership.portraitImage} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-headline text-3xl font-bold tracking-tighter text-white">{content.leadership.name.toUpperCase()}</h3>
                <p className="font-label text-primary text-xs tracking-[0.3em] uppercase mt-1 font-bold">{content.leadership.title}</p>
              </div>
            </div>

            <div className="lg:col-span-7 p-10 lg:p-20 flex flex-col justify-center">
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container cyber-border w-fit">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{content.leadership.executiveBadge}</span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
                {content.leadership.headlineLead} <span className="text-primary text-glow">{content.leadership.headlineAccent}</span> Growth
              </h2>
              <div className="space-y-6 text-on-surface-variant text-lg font-body leading-relaxed mb-12">
                <p className="italic text-white/90 font-light border-l-2 border-primary/40 pl-6 py-2">&quot;{content.leadership.quote}&quot;</p>
                <p>{content.leadership.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12 border-t border-white/5 pt-10">
                {content.leadership.metrics.slice(0, 2).map((metric) => (
                  <div key={metric.label}>
                    <div className="text-4xl font-headline font-bold text-primary tracking-tighter">{metric.value}</div>
                    <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1 font-bold">{metric.label}</div>
                  </div>
                ))}
              </div>

              <div>
                <button className="group flex items-center gap-4 text-white font-label uppercase text-xs font-bold tracking-[0.3em] hover:text-primary transition-all">
                  {content.leadership.bioButtonLabel}
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">east</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto md:px-8 py-8 md:py-8">
        <div className="flex items-center justify-between mb-8 md:mb-16 px-6 md:px-0">
          <h2 className="text-3xl font-headline font-bold tracking-tight text-primary uppercase">{content.pillars.heading}</h2>
          <div className="hidden md:block h-px flex-grow bg-white/5 mx-12"></div>
          <div className="flex gap-2 text-on-surface-variant md:hidden">
            <span className="material-symbols-outlined opacity-50">swipe_left</span>
          </div>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 gap-4 md:hidden">
          {content.pillars.items.map((pillar) => (
            <div key={pillar.title} className="min-w-[85vw] snap-center glass-panel rounded-2xl p-8 border border-white/5 flex flex-col h-[340px] relative overflow-hidden cyber-border">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl text-primary">{pillar.icon}</span>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">{pillar.icon}</span>
              </div>
              {pillar.eyebrow ? <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2 font-bold">{pillar.eyebrow}</span> : null}
              <h4 className="font-headline text-2xl font-bold mb-4">{pillar.title}</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-auto">{pillar.description}</p>
              {pillar.footerLabel ? (
                <div className="pt-4 border-t border-white/5">
                  <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary/40 font-bold">{pillar.footerLabel}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-12 gap-6 px-0">
          <div className="col-span-8 glass-panel p-10 flex flex-col justify-between group hover:border-primary/30 transition-all cyber-border min-h-[380px] rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-9xl text-primary">{pillarOne?.icon}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8 relative z-10">
              <span className="material-symbols-outlined text-primary">{pillarOne?.icon}</span>
            </div>
            <div className="relative z-10">
              <span className="font-label text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">{pillarOne?.eyebrow}</span>
              <h4 className="text-3xl font-headline font-bold mb-4">{pillarOne?.title}</h4>
              <p className="text-on-surface-variant leading-relaxed max-w-lg font-body">{pillarOne?.description}</p>
            </div>
          </div>
          <div className="col-span-4 bg-surface-container-high p-10 flex flex-col justify-between hover:border-primary/30 transition-all cyber-border min-h-[380px] rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary">{pillarTwo?.icon}</span>
            </div>
            <div>
              <span className="font-label text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">{pillarTwo?.eyebrow}</span>
              <h4 className="text-2xl font-headline font-bold mb-4">{pillarTwo?.title}</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">{pillarTwo?.description}</p>
            </div>
          </div>
          <div className="col-span-4 bg-surface-container-high p-10 flex flex-col justify-between hover:border-primary/30 transition-all cyber-border min-h-[380px] rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary">{pillarThree?.icon}</span>
            </div>
            <div>
              <span className="font-label text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">{pillarThree?.eyebrow}</span>
              <h4 className="text-2xl font-headline font-bold mb-4">{pillarThree?.title}</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">{pillarThree?.description}</p>
            </div>
          </div>
          <div className="col-span-8 glass-panel p-10 flex flex-col justify-between hover:border-primary/30 transition-all cyber-border min-h-[380px] rounded-2xl group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary">{pillarFour?.icon}</span>
            </div>
            <div className="flex justify-between items-end gap-8">
              <div>
                <h4 className="text-3xl font-headline font-bold mb-4">{pillarFour?.title}</h4>
                <p className="text-on-surface-variant leading-relaxed max-w-md font-body">{pillarFour?.description}</p>
              </div>
              <span className="font-label text-[10px] tracking-widest text-primary/30 uppercase font-bold whitespace-nowrap">{pillarFour?.footerLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
        <div className="glass-panel p-10 md:p-16 rounded-3xl text-center relative overflow-hidden cyber-border border border-primary/20 md:border-transparent">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter mb-10 leading-tight text-white uppercase">{content.cta.heading}</h2>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Link href={content.cta.primaryHref} className="bg-primary text-on-primary-fixed px-10 py-4 rounded-xl md:rounded-lg font-headline font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] transition-all active:scale-95 shadow-[0_0_20px_rgba(0,255,102,0.3)]">
                {content.cta.primaryLabel}
              </Link>
              <Link href={content.cta.secondaryHref} className="glass-panel border border-white/10 text-white px-10 py-4 rounded-xl md:rounded-lg font-headline font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-all active:scale-95 cyber-border">
                {content.cta.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
