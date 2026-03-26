"use client";

import { useState } from "react";
import Link from "next/link";

export default function CaseStudiesPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Web Development", "AI Automation", "Digital Marketing"];

  return (
    <main className="pt-24 md:pt-40 pb-12 md:pb-24 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* ─── Hero Section ─── */}
      {/* Mobile Hero */}
      <header className="md:hidden mb-12 relative">
        <div className="mb-4">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-tertiary">Real Results</span>
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tighter leading-[0.9] text-primary mb-6">
          CASE STUDIES
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-[90%] font-body">
          Real projects. Real results. Explore how we&apos;ve engineered growth and stability for industry leaders through digital transformation.
        </p>
      </header>
      {/* Desktop Hero */}
      <header className="hidden md:block mb-24 relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end relative z-10">
          <div className="lg:col-span-8">
            <span className="text-primary font-label font-bold text-xs uppercase tracking-[0.4em] block mb-4">
              Engineering Excellence
            </span>
            <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter leading-[0.9] text-glow text-white">
              SELECTIVE <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                CASE STUDIES.
              </span>
            </h1>
          </div>
          <div className="lg:col-span-4 pb-2">
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-sm font-body">
              Real projects. Real results. Here&apos;s what we&apos;ve built for businesses like yours.
            </p>
          </div>
        </div>
      </header>

      {/* ─── Filter Bar ─── */}
      <div className="-mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide mb-10 md:mb-16">
        <div className="flex gap-2 md:gap-4 md:flex-wrap min-w-max md:min-w-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 md:px-6 py-2 rounded-full text-xs font-label font-bold uppercase tracking-wider md:tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                activeFilter === filter
                  ? "bg-primary border-primary text-on-primary-fixed shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                  : "bg-surface-container md:bg-transparent border border-outline-variant md:border-white/10 text-on-surface-variant hover:border-primary/40 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Project Grid ─── */}
      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-12">
        {[
          { name: "AI-Powered Logistics Transformation", desc: "How we automated route optimization and reduced delivery costs by 35% using custom AI agents.", stat: "35%", statLabel: "Cost Reduction", category: "AI AUTOMATION", slug: "ai-logistics-transformation", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFlvMBUpYvpWH3dHiMdarFZN3MlWoXyk50_XR9iZM0oziHKYZdc32GWiy6bX1JsPlNxmWFl9ilfRbcCKVhKFzCnpYcmm9NKsepk7D-D1lQB_wGoK7SYnzd9yF-3eA3BQPfz5_lQlOFlLy7h71GOmjglJG4iQJtvl8yH_TOMVrffOhU-gOzuy44mBAWff-ffVt-QCQeyC2rXMbGa_psR6FgfpWFqZ5KeisZ2h2BlT0Gi2eQcKVtmqywZ7HpxFEPgo5zp-QjtUmEnAES" },
          { name: "E-Commerce Revenue Surge", desc: "A complete platform redesign that increased conversion rates by 280% and reduced cart abandonment.", stat: "280%", statLabel: "Conversion Increase", category: "WEB DEV", slug: "ecommerce-redesign", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd3UUy35oCMyX66vZHBASNxgGruCgFnWgYB7EowfvSXV7fbbLTFAP678DYe_y1-XqcLHWPegF1tBxGddSYCtZcuudMZLg4OIyckICpLFxPd0y-bv-SY8GvCBU7qVTdhmntUu-0vLYjakflICcQxW9-ekzDZdwFaBBhD8TJl1QBWtXxX8hgSeDs8GftUi1V5xEJnM9H2JTmqFcZ4bH9J1V_nKcD1P1gBl8f-q0x0vjyYJNg46TWAPZDH9RLRwddQX7xQYB_u31QMiM9" },
          { name: "From Page 5 to Page 1", desc: "A comprehensive SEO overhaul that took a law firm from obscurity to the top of Google search results.", stat: "520%", statLabel: "Organic Traffic", category: "MARKETING", slug: "seo-market-dominance", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbtiicdNvZKIqk7-GlgEwKXOmQkABVKPL5s7W3WdEiqKSzHxobNpRLDjYesfOoBC2eVXf_FDe2jFsRutn6D9fqHZDRiUtyhgls2vlhCe2qvDTeTKA4xwV3BAfZ-DxRpNpQzB3VDijqGOuWhIoSqm7pBYsG9hvkwLinjANcVo0v_bh2DWjLX1Yamiw0PQxzKYya_nicxATPVYkCHmJsVywMZ07FaiGdxc10er68DtuWy_H6oSIjbnytJB5x5lLqAv4zxXCFtQE13mtF" },
        ].map((project) => (
          <article key={project.slug} className="glass-panel rounded-xl overflow-hidden flex flex-col group border border-white/5">
            <div className="h-60 overflow-hidden relative">
              <img alt={project.name} className="w-full h-full object-cover" src={project.img} />
              <div className="absolute top-4 left-4">
                <span className="bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full font-label text-[10px] uppercase tracking-wider text-primary">{project.category}</span>
              </div>
            </div>
            <div className="p-6 flex flex-col">
              <div className="mb-4">
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-1">{project.name}</h3>
                <p className="text-on-surface-variant text-sm">{project.desc}</p>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-tertiary tracking-tight mb-1">{project.stat}</div>
                <div className="text-[10px] uppercase tracking-widest text-outline font-label">{project.statLabel}</div>
              </div>
              <Link
                href={`/case-studies/${project.slug}`}
                className="flex items-center justify-between w-full py-4 px-6 bg-tertiary text-background font-headline font-bold rounded-lg active:scale-[0.98] transition-all"
              >
                <span>VIEW CASE STUDY</span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop Cards */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-20">

        {/* Project Card 1 — AI Logistics */}
        <article className="group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
            <img
              alt="AI Logistics Dashboard"
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFlvMBUpYvpWH3dHiMdarFZN3MlWoXyk50_XR9iZM0oziHKYZdc32GWiy6bX1JsPlNxmWFl9ilfRbcCKVhKFzCnpYcmm9NKsepk7D-D1lQB_wGoK7SYnzd9yF-3eA3BQPfz5_lQlOFlLy7h71GOmjglJG4iQJtvl8yH_TOMVrffOhU-gOzuy44mBAWff-ffVt-QCQeyC2rXMbGa_psR6FgfpWFqZ5KeisZ2h2BlT0Gi2eQcKVtmqywZ7HpxFEPgo5zp-QjtUmEnAES"
            />
          </div>
          <div className="flex flex-col space-y-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">AI-Powered Logistics</h3>
              <span className="text-primary font-headline font-black text-xl">35% Savings</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              Automated route optimization and reduced delivery costs by 35% using custom AI agents for GlobalFreight Solutions.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">AI Automation</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/case-studies/ai-logistics-transformation"
                className="group/btn flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-xs transition-all hover:gap-3 hover:text-white"
              >
                View Case Study
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Project Card 2 — E-Commerce */}
        <article className="group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift md:mt-12 border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
            <img
              alt="E-Commerce Platform"
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd3UUy35oCMyX66vZHBASNxgGruCgFnWgYB7EowfvSXV7fbbLTFAP678DYe_y1-XqcLHWPegF1tBxGddSYCtZcuudMZLg4OIyckICpLFxPd0y-bv-SY8GvCBU7qVTdhmntUu-0vLYjakflICcQxW9-ekzDZdwFaBBhD8TJl1QBWtXxX8hgSeDs8GftUi1V5xEJnM9H2JTmqFcZ4bH9J1V_nKcD1P1gBl8f-q0x0vjyYJNg46TWAPZDH9RLRwddQX7xQYB_u31QMiM9"
            />
          </div>
          <div className="flex flex-col space-y-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">E-Commerce Surge</h3>
              <span className="text-primary font-headline font-black text-xl">280% Growth</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              Complete platform redesign that increased conversion rates by 280% and reduced cart abandonment for ArtisanCraft India.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">Web Development</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/case-studies/ecommerce-redesign"
                className="group/btn flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-xs transition-all hover:gap-3 hover:text-white"
              >
                View Case Study
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Project Card 3 — SEO */}
        <article className="group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
            <img
              alt="SEO Analytics"
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbtiicdNvZKIqk7-GlgEwKXOmQkABVKPL5s7W3WdEiqKSzHxobNpRLDjYesfOoBC2eVXf_FDe2jFsRutn6D9fqHZDRiUtyhgls2vlhCe2qvDTeTKA4xwV3BAfZ-DxRpNpQzB3VDijqGOuWhIoSqm7pBYsG9hvkwLinjANcVo0v_bh2DWjLX1Yamiw0PQxzKYya_nicxATPVYkCHmJsVywMZ07FaiGdxc10er68DtuWy_H6oSIjbnytJB5x5lLqAv4zxXCFtQE13mtF"
            />
          </div>
          <div className="flex flex-col space-y-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">Page 5 to Page 1</h3>
              <span className="text-primary font-headline font-black text-xl">520% Traffic</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              Comprehensive SEO overhaul that took Zenith Legal from obscurity to the top of Google search results.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">Digital Marketing</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/case-studies/seo-market-dominance"
                className="group/btn flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-xs transition-all hover:gap-3 hover:text-white"
              >
                View Case Study
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </article>

      </div>

      {/* ─── CTA Section ─── */}
      {/* Mobile CTA */}
      <section className="md:hidden mt-20 mb-12 p-8 rounded-3xl glass-panel border border-primary/20 flex flex-col items-center text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-4">Ready to scale your business? Book a Free Consultation</h2>
        <p className="text-on-surface-variant text-sm mb-8 font-body">Let&apos;s architect your next digital breakthrough together.</p>
        <Link
          href="/contact"
          className="w-full py-4 bg-primary text-on-primary-fixed font-headline font-bold rounded-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,102,0.2)] text-center block"
        >
          BOOK A FREE CONSULTATION
        </Link>
      </section>
      {/* Desktop CTA */}
      <section className="hidden md:block mt-48 py-24 px-8 glass-panel cyber-border rounded-3xl relative overflow-hidden bg-surface-container-high/50 border border-primary/20 shadow-[0_0_40px_rgba(0,255,102,0.05)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        <div className="max-w-3xl relative z-10 mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter mb-8 leading-tight text-white">
            Ready to scale your business?
          </h2>
          <p className="text-on-surface-variant text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-body">
            Book a Free Consultation
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/contact"
              className="px-12 py-5 bg-primary text-on-primary-fixed font-headline font-extrabold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:shadow-[0_0_50px_rgba(0,255,102,0.6)] transition-all transform hover:scale-105"
            >
              BOOK A FREE CONSULTATION
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
