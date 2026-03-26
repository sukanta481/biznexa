"use client";

import Link from "next/link";

export default function ServicesPage() {
  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-32 pb-12 md:pb-32">
        <div className="flex flex-col md:flex-row gap-12 items-start md:mt-12">
          <div className="md:w-7/12">
            <span className="font-label text-tertiary md:text-primary uppercase tracking-[0.2em] md:tracking-[0.3em] text-[0.6875rem] md:text-xs mb-4 block">
              Services &amp; Process
            </span>
            <h1 className="font-headline text-[2.75rem] md:text-7xl font-bold tracking-[-0.02em] md:tracking-tighter mb-6 md:mb-8 leading-[1.1] md:text-glow">
              <span className="md:hidden">
                We build <span className="text-primary">websites</span>, automate business <span className="text-tertiary">workflows</span>, and run digital marketing.
              </span>
              <span className="hidden md:inline">
                We build websites, automate workflows with AI, and run{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  digital marketing
                </span>{" "}
                that brings in leads.
              </span>
            </h1>
            <p className="font-body text-sm md:text-lg text-on-surface-variant max-w-[90%] md:max-w-xl leading-relaxed">
              We build websites, automate business workflows with AI, and run digital marketing that brings in leads. Here&apos;s how we do it.
            </p>
            <div className="mt-8 flex flex-col gap-2 font-label text-[0.65rem] uppercase tracking-widest text-tertiary/80 md:hidden">
              <div className="flex items-center gap-2"><span className="w-1 h-1 bg-tertiary rounded-full"></span> 50+ Websites Delivered</div>
              <div className="flex items-center gap-2"><span className="w-1 h-1 bg-tertiary rounded-full"></span> Custom AI Workflows</div>
              <div className="flex items-center gap-2"><span className="w-1 h-1 bg-tertiary rounded-full"></span> Full-Stack Development</div>
            </div>
          </div>
          <div className="hidden md:block md:w-5/12 relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl group-hover:opacity-50 transition-opacity"></div>
            <div className="relative glass-panel rounded-xl aspect-square overflow-hidden cyber-border">
              <img
                alt="Biznexa Digital Environment"
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBLiRYDHhVr--MjSFKvE2rFRlYWDp32K-MP2zPI5fVtqElcNiL_esnyBaAGhSHRtkkg5SvD5xn71GaGlKo3WxeVRNnWkuoy_J07d09U793lQvB-HDuLtACeLEZKV-UQ_3OJTrTvztp_zDe57H2VCVp2mHLgA8DDgF4PUgtHMNcr9gMobsQJ3NRnYL7Rg1zCIS8gjdSoL_gV0T-xZVIHJmXPBVIuN_e86p9txi8UTcN6l7qemCCxjglOr3ISorVqR1D9Z7toT-vyLnO"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Process Bento Grid ─── */}
      <section className="max-w-7xl mx-auto md:px-8 py-8 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 gap-8 px-6 md:px-0">
          <div className="max-w-xl">
            <h2 className="font-headline text-2xl md:text-4xl font-bold tracking-tight mb-0 md:mb-4 text-on-surface md:text-primary uppercase">
              The Workflow
            </h2>
          </div>
          <div className="hidden md:block h-px flex-grow bg-outline-variant/20 mx-12"></div>
          <div className="flex items-center gap-2 text-on-surface-variant md:hidden">
            <span className="material-symbols-outlined text-sm opacity-50">swipe_left</span>
          </div>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 gap-6 md:grid md:grid-cols-4 md:px-0 md:overflow-visible md:snap-none">
          {/* Step 1: Detect */}
          <div className="min-w-[85vw] md:min-w-0 snap-center h-[280px] md:h-auto glass-panel p-8 rounded-xl cyber-border relative overflow-hidden group hover-lift transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="font-headline text-6xl font-bold text-primary">01</span>
            </div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  search
                </span>
              </div>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4 text-white">Detect</h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              We analyze your current website, competitors, and market to find what&apos;s working and what&apos;s not.
            </p>
          </div>

          {/* Step 2: Plan */}
          <div className="min-w-[85vw] md:min-w-0 snap-center h-[280px] md:h-auto bg-surface-container-high p-8 rounded-xl cyber-border relative overflow-hidden group hover-lift transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="font-headline text-6xl font-bold text-secondary">02</span>
            </div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  architecture
                </span>
              </div>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4 text-white">Plan</h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              We plan the project architecture, timeline, and deliverables based on your goals.
            </p>
          </div>

          {/* Step 3: Design */}
          <div className="min-w-[85vw] md:min-w-0 snap-center h-[280px] md:h-auto glass-panel p-8 rounded-xl cyber-border relative overflow-hidden group hover-lift transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="font-headline text-6xl font-bold text-tertiary">03</span>
            </div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  draw
                </span>
              </div>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4 text-white">Design</h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              High-fidelity crafting of visual interfaces that balance aesthetic luxury with technical precision.
            </p>
          </div>

          {/* Step 4: Deliver */}
          <div className="min-w-[85vw] md:min-w-0 snap-center h-[280px] md:h-auto bg-surface-container-high p-8 rounded-xl cyber-border relative overflow-hidden group hover-lift transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="font-headline text-6xl font-bold text-primary">04</span>
            </div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  rocket_launch
                </span>
              </div>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4 text-white">Deliver</h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Deployment of robust, battle-tested solutions designed to perform under high-traffic market conditions.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Services Detailed ─── */}
      <section className="max-w-7xl mx-auto md:px-8 py-10 md:py-32">
        {/* Mobile: Carousel Header */}
        <div className="px-6 md:px-0 mb-8 md:mb-0 flex justify-between items-end md:hidden">
          <h2 className="font-headline text-2xl font-bold text-on-surface">Our Services</h2>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm opacity-50">swipe_left</span>
          </div>
        </div>

        {/* Mobile: Horizontal Scroll Cards */}
        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 gap-6 md:hidden">
          {/* Web Development */}
          <div className="min-w-[85vw] snap-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">lan</span>
              </div>
              <h3 className="font-headline text-xl font-bold tracking-tight">Web Development</h3>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[16/9]">
              <img className="w-full h-full object-cover grayscale opacity-60" alt="Web Development" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-3uicma6HYl1jHJZkkk4ghh37cPeOgzBJ0KXxFfe5xj8OP07GjstS5VktEUdnpYuSyk3AN7P2yg6km93xeoWYKieDBajxZnN9oKRhrv3nj86UovWxiKJuF1RUjzRQfF_vW136clpTs1_o0DC8O82tLXSpQVvnkiWg68zBJ08pO_J1cxc2PMm09D-QFvED8XJJDp5Do5dd4N7DjSbuV9eziPjmeJsh6IaAOrLIDxn2KuKQfZWkn3WbRg1wcUkx4sUkS4i3AIUpimMK" />
            </div>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs text-on-surface-variant"><span className="text-tertiary font-bold">/</span> Scalable Infrastructure</li>
              <li className="flex gap-3 text-xs text-on-surface-variant"><span className="text-tertiary font-bold">/</span> Performance Tuning</li>
            </ul>
            <button className="w-full bg-tertiary text-background py-3 rounded-lg font-headline font-bold uppercase tracking-widest text-xs">Get a Quote</button>
          </div>
          {/* Brand Identity */}
          <div className="min-w-[85vw] snap-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">category</span>
              </div>
              <h3 className="font-headline text-xl font-bold tracking-tight">Brand Identity</h3>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[16/9]">
              <img className="w-full h-full object-cover grayscale opacity-60" alt="Brand Identity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUq_IVbHQGmqcIXCbA675DkvO5WxjA88RIDoDLexrmYqhXOQUoFiLCWtVHFotcO15zwodGghiEi1oZSj8WEroLDz0CLHnl3Z-TaZu3vuH9ARRtjRlaPCpr54kE8r_C2zMcag88CPkF63F6eMbEFQUYTs2Ua0YnSXOz3URfxjNeQ9SlW-U5dxJs40JHY0S0mn3WGQbOv6iDZ0yrDzA6RTGSXRG3Z13TrtL1ZmopoTr6fTwfJ62oSsyg-QsSgrgyPAPScz0oYRCLrv4R" />
            </div>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs text-on-surface-variant"><span className="text-tertiary font-bold">/</span> Visual Language</li>
              <li className="flex gap-3 text-xs text-on-surface-variant"><span className="text-tertiary font-bold">/</span> Narrative Engineering</li>
            </ul>
            <button className="w-full bg-tertiary text-background py-3 rounded-lg font-headline font-bold uppercase tracking-widest text-xs">Learn More</button>
          </div>
          {/* AI Automation */}
          <div className="min-w-[85vw] snap-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <h3 className="font-headline text-xl font-bold tracking-tight">AI Automation</h3>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[16/9]">
              <img className="w-full h-full object-cover grayscale opacity-60" alt="AI Automation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD09PFN27_emiSInFubxuFgS2hZHbXaLWvAvG0lh3aVbP5ADfjK5vG3icRCCHzhy1xWt48h-t2P3VdDeVpLPgBFhXOzUy4Hx209m2sB5XPHAV-iXdrRD230dSDVv1aDrXRB1nIqi7ZXtwriihNYBLI2OGVZH3dzjVzX6xJG4U7xngbuHVG0rdnHC0E8Dzwjh-V8p-pfyZ76iG9sCD-zhiySUIsBtIb8Z4lHQs6LsnWBJ59G56-p2m5hxT1DbwCko4p03bNTqWc1uqK4" />
            </div>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs text-on-surface-variant"><span className="text-tertiary font-bold">/</span> Conversion Systems</li>
              <li className="flex gap-3 text-xs text-on-surface-variant"><span className="text-tertiary font-bold">/</span> Workflow AI</li>
            </ul>
            <button className="w-full bg-tertiary text-background py-3 rounded-lg font-headline font-bold uppercase tracking-widest text-xs">Get a Quote</button>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></div>
        </div>

        {/* Desktop: Sidebar + Cards Layout */}
        <div className="hidden md:grid grid-cols-12 gap-12">
          {/* Sticky Sidebar */}
          <div className="col-span-4 sticky top-32 h-fit">
            <span className="font-label text-secondary uppercase tracking-[0.3em] text-xs mb-4 block">
              What we do
            </span>
            <h2 className="font-headline text-4xl font-bold mb-6 tracking-tight uppercase">
              Full-Stack Digital <br />
              <span className="text-secondary">Solutions</span>
            </h2>
            <p className="font-body text-on-surface-variant mb-8 leading-relaxed">
              From conceptual architecture to complex backend orchestration, we handle the full spectrum of digital evolution.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm font-label text-primary">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>50+ WEBSITES DELIVERED</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-label text-primary">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>CUSTOM AI WORKFLOWS</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-label text-primary">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>FULL-STACK DEVELOPMENT</span>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="col-span-8 space-y-8">
            <div className="bg-surface-container-low p-10 rounded-xl border-l-4 border-primary transition-all hover:bg-surface-container/80 cyber-border hover-lift">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-headline text-2xl font-bold text-white">Web Development & Design</h4>
                <span className="material-symbols-outlined text-primary text-3xl">developer_mode</span>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                Building high-speed, high-fidelity web experiences using modern frameworks and performance-first methodologies. Our websites are built to convert and scale.
              </p>
              <ul className="grid grid-cols-2 gap-y-2 font-body text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div> React & Next.js Systems</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div> Motion Design</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div> API Integrations</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div> E-commerce Engines</li>
              </ul>
            </div>
            <div className="bg-surface-container-low p-10 rounded-xl border-l-4 border-secondary transition-all hover:bg-surface-container/80 cyber-border hover-lift">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-headline text-2xl font-bold text-white">Brand Identity & Digital Design</h4>
                <span className="material-symbols-outlined text-secondary-dim text-3xl">palette</span>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                Crafting visual languages that communicate authority and innovation. We define the &quot;soul&quot; of your brand through editorial typography and atmospheric visuals.
              </p>
              <ul className="grid grid-cols-2 gap-y-2 font-body text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div> Identity Systems</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div> Cyber Typography</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div> Design Systems</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div> Social Presence</li>
              </ul>
            </div>
            <div className="bg-surface-container-low p-10 rounded-xl border-l-4 border-tertiary transition-all hover:bg-surface-container/80 cyber-border hover-lift">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-headline text-2xl font-bold text-white">AI Automation & Digital Marketing</h4>
                <span className="material-symbols-outlined text-tertiary-dim text-3xl">psychology</span>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                Leveraging machine learning and advanced data diagnostics to optimize your conversion funnels and automate operational workflows.
              </p>
              <ul className="grid grid-cols-2 gap-y-2 font-body text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-tertiary/40"></div> AI Orchestration</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-tertiary/40"></div> SEO Diagnostics</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-tertiary/40"></div> Data Visualization</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-tertiary/40"></div> Lead Automation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="px-6 md:px-8 py-20 text-center relative overflow-hidden max-w-7xl mx-auto">
        <div className="md:hidden absolute inset-0 bg-tertiary/5 backdrop-blur-3xl -z-10"></div>
        <h2 className="font-headline text-3xl md:text-6xl font-bold mb-6 md:mb-10 tracking-tighter">
          <span className="md:hidden">Ready to Start <br /><span className="text-tertiary">Your Project?</span></span>
          <span className="hidden md:inline text-white">READY TO START YOUR PROJECT?</span>
        </h2>
        <Link
          href="/contact"
          className="inline-block bg-tertiary md:bg-primary text-background md:text-on-primary-fixed px-10 py-4 rounded-lg md:rounded-full font-headline font-bold uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(155,255,206,0.2)] md:shadow-[0_0_30px_rgba(0,255,102,0.4)] hover:brightness-110 transition-all active:scale-95"
        >
          Book a Free Consultation
        </Link>
      </section>
    </>
  );
}
