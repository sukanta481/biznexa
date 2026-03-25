"use client";

import Link from "next/link";
import { COMPANY } from "@/lib/constants";

export default function AboutPage() {
  return (
    <>
      {/* ─── Hero Section: The Vision ─── */}
      <section className="max-w-7xl mx-auto px-8 mb-24 md:mb-32 mt-12">
        <div className="relative overflow-hidden rounded-2xl h-[450px] flex items-center p-12 glass-panel cyber-border">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"></div>
            <img
              alt=""
              className="w-full h-full object-cover opacity-40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOZdYI31MhAQ4MfJOJWS2Xck8njCL8Q5McYnJC3KlUm-L3spGENzRPNt5YlBpiZpVU6O2EAIWOYX_VwVfpbwgzKnPdE5zcQjSFW8FO8euboATWk5IS4eUW9T_9gk-Z3uc98G3m7MwWZjm56BFYISq3eDWJquUaaRm1UCDvqG1csFPLh-Zcifdd1onIiIZHZxVL2FpEAD_LocmRwQKk5fVVKoANHmkIEh-hVRxn8FTCzeTMmg_jiERdMw2Fhu8mFSENiyUViUu7BAsz"
            />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="font-label text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                Our Philosophy
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter mb-6 text-glow leading-none">
              Architecting the <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Future</span>.
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed font-body">
              Biznexa is not just a digital agency. We are a collective of architects, engineers, and visionaries building the high-performance infrastructures of tomorrow's digital economy.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CEO Section: Leadership Profile ─── */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-8">
        <div className="glass-panel rounded-3xl overflow-hidden cyber-border">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Portrait */}
            <div className="lg:col-span-5 relative h-[500px] lg:h-auto overflow-hidden group">
              <img
                alt="Sukanta Saha CEO"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDacnlKmd5_xNSQsj0-pxjr00Bw5gFJhIKOw2mTFzsjuAfdOiZL-REzCyKsTAMGpSr8s4bAko1Aezt8VFCwiSWErN2AC4wyGo6rUprDt2HK2bmhBHZwWDh1zgrDdEQOZQb-Bih-Yp4k3zZVeHDPx_ScV0D8iLOzAKMR-3XU5hACnvwkEEk3lp8bRaiKwVzuVvrydZS-9Do6IYZAcfEDX6SaNTj9Q36owhlxU7igrCGMypFLTCKTMiAbCByaiP3c4zI36JgQy95S6Ft_"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-headline text-3xl font-bold tracking-tighter text-white">SUKANTA SAHA</h3>
                <p className="font-label text-primary text-xs tracking-[0.3em] uppercase mt-1 font-bold">CEO & FOUNDER</p>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-7 p-10 lg:p-20 flex flex-col justify-center">
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container cyber-border w-fit">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  Executive Leadership
                </span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
                A Vision for <span className="text-primary text-glow">Exponential</span> Growth
              </h2>
              <div className="space-y-6 text-on-surface-variant text-lg font-body leading-relaxed mb-12">
                <p className="italic text-white/90 font-light border-l-2 border-primary/40 pl-6 py-2">
                  "We started BizNexa because we kept seeing businesses pay for websites and systems that broke within a year. We build things that last."
                </p>
                <p>
                  Sukanta Saha founded BizNexa to bring enterprise-grade digital solutions to small and mid-sized businesses. With hands-on experience in web development, AI workflow automation, and digital marketing, he leads a team focused on delivering real results.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12 border-t border-white/5 pt-10">
                <div>
                  <div className="text-4xl font-headline font-bold text-primary tracking-tighter">15+</div>
                  <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1 font-bold">Projects Completed</div>
                </div>
                <div>
                  <div className="text-4xl font-headline font-bold text-primary tracking-tighter">10+</div>
                  <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1 font-bold">Happy Clients</div>
                </div>
              </div>

              <div>
                <button className="group flex items-center gap-4 text-white font-label uppercase text-xs font-bold tracking-[0.3em] hover:text-primary transition-all">
                  Full Biography
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">east</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Pillars: Bento Grid ─── */}
      <section className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-3xl font-headline font-bold tracking-tight text-primary uppercase">Strategic Pillars</h2>
          <div className="hidden md:block h-px flex-grow bg-white/5 mx-12"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Pillar 1 */}
          <div className="md:col-span-8 glass-panel p-10 flex flex-col justify-between group hover:border-primary/30 transition-all cyber-border min-h-[380px] rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-9xl text-primary">code</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8 relative z-10">
              <span className="material-symbols-outlined text-primary">architecture</span>
            </div>
            <div className="relative z-10">
              <span className="font-label text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">01 / Engineering</span>
              <h4 className="text-3xl font-headline font-bold mb-4">Scalable Web Development</h4>
              <p className="text-on-surface-variant leading-relaxed max-w-lg font-body">
                We build high-performance, future-ready digital infrastructures using modern frameworks that scale infinitely.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="md:col-span-4 bg-surface-container-high p-10 flex flex-col justify-between hover:border-primary/30 transition-all cyber-border min-h-[380px] rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
            </div>
            <div>
              <span className="font-label text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">02 / Automation</span>
              <h4 className="text-2xl font-headline font-bold mb-4">AI-Driven Automation</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">
                Streamlining complex workflows with bespoke AI solutions to maximize operational efficiency.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="md:col-span-4 bg-surface-container-high p-10 flex flex-col justify-between hover:border-primary/30 transition-all cyber-border min-h-[380px] rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
            <div>
              <span className="font-label text-xs text-secondary tracking-widest uppercase mb-2 block font-bold">03 / Growth</span>
              <h4 className="text-2xl font-headline font-bold mb-4">Digital Marketing & SEO</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">
                Data-driven strategies to dominate search results and social feeds, ensuring your brand stays top-of-mind.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="md:col-span-8 glass-panel p-10 flex flex-col justify-between hover:border-primary/30 transition-all cyber-border min-h-[380px] rounded-2xl group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary">hub</span>
            </div>
            <div className="flex justify-between items-end gap-8">
              <div>
                <h4 className="text-3xl font-headline font-bold mb-4">Seamless API Integration</h4>
                <p className="text-on-surface-variant leading-relaxed max-w-md font-body">
                  Connecting your digital ecosystem with robust, secure, and high-speed integration layers for maximum data velocity.
                </p>
              </div>
              <span className="font-label text-[10px] tracking-widest text-primary/30 uppercase font-bold whitespace-nowrap hidden sm:block">
                V 4.0 Standard
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="glass-panel p-16 rounded-3xl text-center relative overflow-hidden cyber-border">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter mb-10">READY TO START YOUR PROJECT?</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/contact"
                className="bg-primary text-on-primary-fixed px-10 py-4 rounded-lg font-headline font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] transition-all"
              >
                BOOK A CALL
              </Link>
              <Link 
                href="/case-studies"
                className="glass-panel border-white/10 text-white px-10 py-4 rounded-lg font-headline font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-all cyber-border"
              >
                VIEW PORTFOLIO
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
