"use client";

import { useState } from "react";
import Link from "next/link";

export default function CaseStudiesPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Web Development", "AI Automation", "Digital Marketing"];

  return (
    <main className="pt-40 pb-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* ─── Hero Section ─── */}
      <header className="mb-24 relative">
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
              Real projects. Real results. Here's what we've built for businesses like yours.
            </p>
          </div>
        </div>
      </header>

      {/* ─── Filter Bar ─── */}
      <div className="flex flex-wrap items-center gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full border text-xs font-label font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeFilter === filter
                ? "bg-primary border-primary text-on-primary-fixed"
                : "border-white/10 text-on-surface-variant hover:border-primary/40 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ─── Project Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-20">
        
        {/* Project Card 1 */}
        <article className="group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
            <img
              alt="Blockchain Dashboard Interface"
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFlvMBUpYvpWH3dHiMdarFZN3MlWoXyk50_XR9iZM0oziHKYZdc32GWiy6bX1JsPlNxmWFl9ilfRbcCKVhKFzCnpYcmm9NKsepk7D-D1lQB_wGoK7SYnzd9yF-3eA3BQPfz5_lQlOFlLy7h71GOmjglJG4iQJtvl8yH_TOMVrffOhU-gOzuy44mBAWff-ffVt-QCQeyC2rXMbGa_psR6FgfpWFqZ5KeisZ2h2BlT0Gi2eQcKVtmqywZ7HpxFEPgo5zp-QjtUmEnAES"
            />
          </div>
          <div className="flex flex-col space-y-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">Nexus Protocol</h3>
              <span className="text-primary font-headline font-black text-xl">40% Growth</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              Next-gen decentralized finance dashboard for real-time asset tracking and automated smart-contract execution.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">Web Development</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/case-studies/nexus-protocol"
                className="group/btn flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-xs transition-all hover:gap-3 hover:text-white"
              >
                View Case Study
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Project Card 2 */}
        <article className="group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift md:mt-12 border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
            <img
              alt="Cybersecurity Infrastructure Visualization"
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd3UUy35oCMyX66vZHBASNxgGruCgFnWgYB7EowfvSXV7fbbLTFAP678DYe_y1-XqcLHWPegF1tBxGddSYCtZcuudMZLg4OIyckICpLFxPd0y-bv-SY8GvCBU7qVTdhmntUu-0vLYjakflICcQxW9-ekzDZdwFaBBhD8TJl1QBWtXxX8hgSeDs8GftUi1V5xEJnM9H2JTmqFcZ4bH9J1V_nKcD1P1gBl8f-q0x0vjyYJNg46TWAPZDH9RLRwddQX7xQYB_u31QMiM9"
            />
          </div>
          <div className="flex flex-col space-y-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">Sentinel Guard</h3>
              <span className="text-primary font-headline font-black text-xl">85% Security</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              Enterprise-grade security infrastructure providing real-time threat detection and AI-driven response systems.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">AI Automation</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/case-studies/sentinel-guard"
                className="group/btn flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-xs transition-all hover:gap-3 hover:text-white"
              >
                View Case Study
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Project Card 3 */}
        <article className="group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
            <img
              alt="Cloud Computing Server Farm"
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbtiicdNvZKIqk7-GlgEwKXOmQkABVKPL5s7W3WdEiqKSzHxobNpRLDjYesfOoBC2eVXf_FDe2jFsRutn6D9fqHZDRiUtyhgls2vlhCe2qvDTeTKA4xwV3BAfZ-DxRpNpQzB3VDijqGOuWhIoSqm7pBYsG9hvkwLinjANcVo0v_bh2DWjLX1Yamiw0PQxzKYya_nicxATPVYkCHmJsVywMZ07FaiGdxc10er68DtuWy_H6oSIjbnytJB5x5lLqAv4zxXCFtQE13mtF"
            />
          </div>
          <div className="flex flex-col space-y-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">Aether Cloud</h3>
              <span className="text-primary font-headline font-black text-xl">99.9% Uptime</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              Scalable cloud-native architecture optimized for zero-latency data processing and global distribution.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">Web Development</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/case-studies/aether-cloud"
                className="group/btn flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-xs transition-all hover:gap-3 hover:text-white"
              >
                View Case Study
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Project Card 4 */}
        <article className="group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
            <img
              alt="AI Vision Processing"
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7N3Rh31Xq-0LTobq4veTACs9ZPTMKGMk6dAVLrBgLcAfVJr06j2ZxfYdiChVRCLD9s40Iht023lZLlPRdQTvxFGjhlXm-hFxQ_FeoT_cabl-ZSekt7g-DYhQzvj83eptE_tv94D7c48eonzX-OZa66YGx03T7Y-3b5a3UREVQzd5FUx3T8m7q-NZbX-Vwlif7p9Y4zVfBExJqNmktPu0VqXqsLd2cW9FA8tVG37XldyWB4znBGplw3VG8o3nrUc98luQKxbU3wGbH"
            />
          </div>
          <div className="flex flex-col space-y-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">Omni Sight</h3>
              <span className="text-primary font-headline font-black text-xl">99.9% Detect</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              Computer vision solution for manufacturing quality control, achieving 99.9% error detection rates.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">AI Automation</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/case-studies/omni-sight"
                className="group/btn flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-xs transition-all hover:gap-3 hover:text-white"
              >
                View Case Study
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Project Card 5 */}
        <article className="group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift md:mt-12 border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
            <img
              alt="Semiconductor Microchip"
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrjEeqVX4D83PzpoUqTeMwdrALjxdGzijQT4arCOMJajPQGeLUiZwdef_Cd1FXAPTo6W9ZOv7QF_D2a3tzV1MvsB1umqpxU9H2cmP2n-FyAjvrfT0CmyKHdwNYK2dC9gmdRmr39TeT02dxTvdYoIu7Wo-U382Ptv8Q4fo29ZxJEyKVLR0jkBeM16odKG2ByD5MlggRNh9Og8DXQ1WoR66AIpb-HPn7-ksN0G54EG1L1uFSbdjQFrkFmJ8gvjPuOJ92q5WNoIej942F"
            />
          </div>
          <div className="flex flex-col space-y-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">Core Flux</h3>
              <span className="text-primary font-headline font-black text-xl">70% Efficiency</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              Embedded systems development for IoT edge devices, focusing on ultra-low power consumption and durability.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">AI Automation</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/case-studies/core-flux"
                className="group/btn flex items-center gap-2 text-primary font-label font-bold uppercase tracking-widest text-xs transition-all hover:gap-3 hover:text-white"
              >
                View Case Study
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Project Card 6 */}
        <article className="group relative flex flex-col space-y-6 glass-panel cyber-border rounded-2xl p-6 hover-lift border border-primary/10 bg-surface-container-high/40 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
            <img
              alt="Global Data Network"
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZDIE0srZCQQFbik-wp5zueFwI8jmHeGxoparqIuxvSrLnMcz4JNgKR4vzdiZNDyu7bO5_L4zu0oARd-V2wKva8yrN-AH2j_ZtWD_VMndmMEZKmnoeo_Q1iIS81MQ_AT6IB69r84frnjmPWd6P6G3yCC9tCjJwfj-9psJvD-Ovtob5cFeT7qTU6fUQt9-bC4IJbFWYqDed_VaNDhX2RgVwzvLTs-6ydlZ6wkm6XKfdLQshkTddMBKBDDZqEW-7qdVLRxPtzgXy0XsM"
            />
          </div>
          <div className="flex flex-col space-y-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">Orbit Mesh</h3>
              <span className="text-primary font-headline font-black text-xl">5ms Latency</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">
              Low-latency communication protocol for satellite-to-ground data transmission in extreme environments.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label text-primary">Digital Marketing</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/case-studies/orbit-mesh"
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
      <section className="mt-48 py-24 px-8 glass-panel cyber-border rounded-3xl relative overflow-hidden bg-surface-container-high/50 border border-primary/20 shadow-[0_0_40px_rgba(0,255,102,0.05)]">
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
