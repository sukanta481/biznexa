"use client";

export default function ServicesPage() {
  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="max-w-7xl mx-auto px-8 pt-24 md:pt-32 pb-24 md:pb-32">
        <div className="flex flex-col md:flex-row gap-12 items-start mt-12">
          <div className="md:w-7/12">
            <span className="font-label text-primary uppercase tracking-[0.3em] text-xs mb-4 block">
              Engineered Excellence
            </span>
            <h1 className="font-headline text-4xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1] text-glow">
              We build websites, automate workflows with AI, and run{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                digital marketing
              </span>{" "}
              that brings in leads.
            </h1>
            <p className="font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Here's how we do it.
            </p>
          </div>
          <div className="md:w-5/12 relative group">
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
      <section className="max-w-7xl mx-auto px-8 py-24 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-4 text-primary uppercase">
              Our Process
            </h2>
            <p className="text-on-surface-variant font-body">
              Our systematic approach to engineering high-growth digital infrastructure.
            </p>
          </div>
          <div className="hidden md:block h-px flex-grow bg-outline-variant/20 mx-12"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1: Detect */}
          <div className="glass-panel p-8 rounded-xl cyber-border relative overflow-hidden group hover-lift transition-all">
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
              We analyze your current website, competitors, and market to find what's working and what's not.
            </p>
          </div>

          {/* Step 2: Plan */}
          <div className="bg-surface-container-high p-8 rounded-xl cyber-border relative overflow-hidden group hover-lift transition-all">
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
          <div className="glass-panel p-8 rounded-xl cyber-border relative overflow-hidden group hover-lift transition-all">
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
          <div className="bg-surface-container-high p-8 rounded-xl cyber-border relative overflow-hidden group hover-lift transition-all">
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
      <section className="max-w-7xl mx-auto px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Sticky Sidebar */}
          <div className="md:col-span-4 sticky top-32 h-fit">
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
          <div className="md:col-span-8 space-y-8">
            {/* Service 1 */}
            <div className="bg-surface-container-low p-10 rounded-xl border-l-4 border-primary transition-all hover:bg-surface-container/80 cyber-border hover-lift">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-headline text-2xl font-bold text-white">Web Development & Design</h4>
                <span className="material-symbols-outlined text-primary text-3xl">developer_mode</span>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                Building high-speed, high-fidelity web experiences using modern frameworks and performance-first methodologies. Our websites are built to convert and scale.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 font-body text-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div> React & Next.js Systems
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div> Motion Design
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div> API Integrations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div> E-commerce Engines
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="bg-surface-container-low p-10 rounded-xl border-l-4 border-secondary transition-all hover:bg-surface-container/80 cyber-border hover-lift">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-headline text-2xl font-bold text-white">Brand Identity & Digital Design</h4>
                <span className="material-symbols-outlined text-secondary-dim text-3xl">palette</span>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                Crafting visual languages that communicate authority and innovation. We define the "soul" of your brand through editorial typography and atmospheric visuals.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 font-body text-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div> Identity Systems
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div> Cyber Typography
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div> Design Systems
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div> Social Presence
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-surface-container-low p-10 rounded-xl border-l-4 border-tertiary transition-all hover:bg-surface-container/80 cyber-border hover-lift">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-headline text-2xl font-bold text-white">AI Automation & Digital Marketing</h4>
                <span className="material-symbols-outlined text-tertiary-dim text-3xl">psychology</span>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                Leveraging machine learning and advanced data diagnostics to optimize your conversion funnels and automate operational workflows.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 font-body text-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary/40"></div> AI Orchestration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary/40"></div> SEO Diagnostics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary/40"></div> Data Visualization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary/40"></div> Lead Automation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
