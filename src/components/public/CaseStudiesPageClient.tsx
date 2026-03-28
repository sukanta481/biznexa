"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { CaseStudy } from "@/lib/case-studies";

interface CaseStudiesPageClientProps {
  studies: CaseStudy[];
}

export default function CaseStudiesPageClient({ studies }: CaseStudiesPageClientProps) {
  const filters = useMemo(() => ["All", ...Array.from(new Set(studies.map((study) => study.category)))], [studies]);
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredStudies = useMemo(
    () => activeFilter === "All" ? studies : studies.filter((study) => study.category === activeFilter),
    [activeFilter, studies],
  );

  return (
    <main className="pt-24 md:pt-40 pb-12 md:pb-24 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
      <header className="md:hidden mb-12 relative">
        <div className="mb-4"><span className="font-label text-xs uppercase tracking-[0.2em] text-tertiary">Real Results</span></div>
        <h1 className="font-headline text-5xl font-bold tracking-tighter leading-[0.9] text-primary mb-6">CASE STUDIES</h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-[90%] font-body">Real projects. Real results. Explore how we&apos;ve engineered growth and stability for industry leaders through digital transformation.</p>
      </header>
      <header className="hidden md:block mb-24 relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end relative z-10">
          <div className="lg:col-span-8">
            <span className="text-primary font-label font-bold text-xs uppercase tracking-[0.4em] block mb-4">Engineering Excellence</span>
            <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter leading-[0.9] text-glow text-white">SELECTIVE <br /><span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">CASE STUDIES.</span></h1>
          </div>
          <div className="lg:col-span-4 pb-2"><p className="text-on-surface-variant text-lg leading-relaxed max-w-sm font-body">Real projects. Real results. Here&apos;s what we&apos;ve built for businesses like yours.</p></div>
        </div>
      </header>

      <div className="-mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide mb-10 md:mb-16">
        <div className="flex gap-2 md:gap-4 md:flex-wrap min-w-max md:min-w-0">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-5 md:px-6 py-2 rounded-full text-xs font-label font-bold uppercase tracking-wider md:tracking-widest transition-all whitespace-nowrap active:scale-95 ${activeFilter === filter ? "bg-primary border-primary text-on-primary-fixed shadow-[0_0_15px_rgba(0,255,102,0.3)]" : "bg-surface-container md:bg-transparent border border-outline-variant md:border-white/10 text-on-surface-variant hover:border-primary/40 hover:text-white"}`}>{filter}</button>
          ))}
        </div>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-12">
        {filteredStudies.map((project) => (
          <article key={project.slug} className="glass-panel rounded-xl overflow-hidden flex flex-col group border border-white/5">
            <div className="h-60 overflow-hidden relative">
              <img alt={project.coverImageAlt || project.title} className="w-full h-full object-cover" src={project.coverImage} />
              <div className="absolute top-4 left-4"><span className="bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full font-label text-[10px] uppercase tracking-wider text-primary">{project.category}</span></div>
            </div>
            <div className="p-6 flex flex-col">
              <div className="mb-4"><h3 className="font-headline text-2xl font-bold text-on-surface mb-1">{project.title}</h3><p className="text-on-surface-variant text-sm">{project.excerpt}</p></div>
              <div className="mb-6"><div className="text-3xl font-bold text-tertiary tracking-tight mb-1">{project.results[0]?.metric}</div><div className="text-[10px] uppercase tracking-widest text-outline font-label">{project.results[0]?.label}</div></div>
              <Link href={`/case-studies/${project.slug}`} className="flex items-center justify-between w-full py-4 px-6 bg-tertiary text-background font-headline font-bold rounded-lg active:scale-[0.98] transition-all"><span>VIEW CASE STUDY</span><span className="material-symbols-outlined text-xl">arrow_forward</span></Link>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-20">
        {filteredStudies.map((project, index) => (
          <article key={project.slug} className={`group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)] ${index % 3 === 1 ? "md:mt-12" : ""}`}>
            <div className="aspect-[4/5] overflow-hidden rounded-xl relative"><img alt={project.coverImageAlt || project.title} className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110" src={project.coverImage} /></div>
            <div className="flex flex-col space-y-4 flex-grow">
              <div className="flex justify-between items-start"><h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">{project.title}</h3><span className="text-primary font-headline font-black text-xl">{project.results[0]?.metric}</span></div>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">{project.excerpt}</p>
              <div className="flex flex-wrap gap-2 pt-2"><div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span><span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">{project.category}</span></div></div>
              <div className="mt-auto pt-4"><Link href={`/case-studies/${project.slug}`} className="group/btn flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-xs transition-all hover:gap-3 hover:text-white">View Case Study<span className="material-symbols-outlined text-sm">arrow_forward</span></Link></div>
            </div>
          </article>
        ))}
      </div>

      <section className="md:hidden mt-20 mb-12 p-8 rounded-3xl glass-panel border border-primary/20 flex flex-col items-center text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-4">Ready to scale your business? Book a Free Consultation</h2>
        <p className="text-on-surface-variant text-sm mb-8 font-body">Let&apos;s architect your next digital breakthrough together.</p>
        <Link href="/contact" className="w-full py-4 bg-primary text-on-primary-fixed font-headline font-bold rounded-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,102,0.2)] text-center block">BOOK A FREE CONSULTATION</Link>
      </section>
      <section className="hidden md:block mt-48 py-24 px-8 glass-panel cyber-border rounded-3xl relative overflow-hidden bg-surface-container-high/50 border border-primary/20 shadow-[0_0_40px_rgba(0,255,102,0.05)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        <div className="max-w-3xl relative z-10 mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter mb-8 leading-tight text-white">Ready to scale your business?</h2>
          <p className="text-on-surface-variant text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-body">Book a Free Consultation</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6"><Link href="/contact" className="px-12 py-5 bg-primary text-on-primary-fixed font-headline font-extrabold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:shadow-[0_0_50px_rgba(0,255,102,0.6)] transition-all transform hover:scale-105">BOOK A FREE CONSULTATION</Link></div>
        </div>
      </section>
    </main>
  );
}
