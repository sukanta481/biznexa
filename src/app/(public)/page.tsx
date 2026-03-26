"use client";

import { useState } from "react";
import Link from "next/link";
// We are using Google Material Symbols directly via HTML <span> tags as imported in layout.tsx.
// We are using Google Material Symbols directly via HTML <span> tags as imported in layout.tsx.

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-0 md:min-h-[85vh] flex items-center justify-center overflow-hidden px-6 md:px-8 py-20 md:py-0">
        <div className="absolute inset-0 hero-glow"></div>
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container cyber-border">
            <span
              className="material-symbols-outlined text-primary text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              Your Digital Solutions Studio
            </span>
          </div>

          <h1 className="font-headline text-4xl md:text-8xl font-bold tracking-tight md:tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] text-glow">
            <span className="md:hidden">WE ENGINEER <span className="text-primary">DIGITAL SYSTEMS</span> THAT SCALE</span>
            <span className="hidden md:inline">WE ENGINEER<br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                DIGITAL SYSTEMS THAT SCALE
              </span>
            </span>
          </h1>

          <p className="max-w-xs md:max-w-2xl mx-auto text-on-surface-variant text-base md:text-xl font-body leading-relaxed mb-8 md:mb-12">
            We build high-performance websites and AI-driven automation that transform your operations.
          </p>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center gap-4 sm:gap-6 mt-8 px-6 sm:px-0">
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-primary text-on-primary font-headline font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(0,255,102,0.3)] uppercase tracking-widest text-sm"
            >
              BOOK A CALL
            </Link>
            <Link
              href="/case-studies"
              className="w-full sm:w-auto glass-panel border border-white/10 text-white font-headline font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 uppercase tracking-widest text-sm"
            >
              VIEW PORTFOLIO
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Numbered Stats Section ─── */}
      <section className="py-12 md:border-y md:border-white/5 md:bg-surface-container-low/30 px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="glass-panel md:!bg-transparent md:!backdrop-blur-none p-6 md:p-0 rounded-2xl md:rounded-none border border-outline-variant/10 md:border-none text-center">
            <div className="font-headline text-3xl md:text-5xl font-bold text-primary mb-1">50+</div>
            <div className="font-label text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant">Projects Delivered</div>
          </div>
          <div className="glass-panel md:!bg-transparent md:!backdrop-blur-none p-6 md:p-0 rounded-2xl md:rounded-none border border-outline-variant/10 md:border-none text-center">
            <div className="font-headline text-3xl md:text-5xl font-bold text-primary mb-1">100%</div>
            <div className="font-label text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant">Growth Rate</div>
          </div>
          <div className="glass-panel md:!bg-transparent md:!backdrop-blur-none p-6 md:p-0 rounded-2xl md:rounded-none border border-outline-variant/10 md:border-none text-center">
            <div className="font-headline text-3xl md:text-5xl font-bold text-primary mb-1">24/7</div>
            <div className="font-label text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant">AI Monitoring</div>
          </div>
          <div className="glass-panel md:!bg-transparent md:!backdrop-blur-none p-6 md:p-0 rounded-2xl md:rounded-none border border-outline-variant/10 md:border-none text-center">
            <div className="font-headline text-3xl md:text-5xl font-bold text-primary mb-1">15+</div>
            <div className="font-label text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant">Global Clients</div>
          </div>
        </div>
      </section>

      {/* ─── Core Competencies (Bento Grid) ─── */}
      <section className="py-24 px-8 max-w-7xl mx-auto" id="services">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-4 text-primary">OUR CORE SERVICES</h2>
            <p className="text-on-surface-variant font-body">
              We provide end-to-end digital excellence through a blend of engineering precision and strategic marketing.
            </p>
          </div>
          <div className="hidden md:block h-px flex-grow bg-outline-variant/20 mx-12"></div>
        </div>
        
        <div className="flex md:grid overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory md:snap-none pb-8 md:pb-0 px-6 md:px-0 gap-6 md:grid-cols-12 -mx-6 md:mx-0">
          {/* Competency 1 */}
          <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-8 group relative overflow-hidden rounded-3xl md:rounded-xl glass-panel cyber-border p-8 md:p-10 min-h-[350px] md:h-[400px] flex flex-col justify-end hover-lift transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="material-symbols-outlined text-9xl text-primary">code</span>
            </div>
            <div className="relative z-10">
              <span className="font-label text-[10px] md:text-xs text-secondary tracking-widest uppercase mb-2 block">01 / Engineering</span>
              <h3 className="font-headline text-xl md:text-3xl font-bold mb-4 text-white">CUSTOM WEB DEVELOPMENT</h3>
              <p className="text-on-surface-variant text-sm md:text-base max-w-md">Scalable, lightning-fast web applications built with the latest frameworks to give your business a competitive edge.</p>
            </div>
          </div>
          
          {/* Competency 2 */}
          <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-4 group relative overflow-hidden rounded-3xl md:rounded-xl bg-surface-container-high border border-outline-variant/20 md:border-cyber-border p-8 md:p-10 min-h-[350px] md:h-[400px] hover-lift transition-all flex flex-col justify-end md:justify-start">
            <div className="absolute md:static top-0 right-0 p-6 md:p-0 md:mb-8 md:w-12 md:h-12 md:rounded-lg md:bg-primary/10 flex items-center justify-center opacity-40 md:opacity-100">
              <span className="material-symbols-outlined text-primary text-5xl md:text-2xl">smart_toy</span>
            </div>
            <div className="relative z-10">
              <span className="font-label text-[10px] md:text-xs text-secondary tracking-widest uppercase mb-2 block">02 / Automation</span>
              <h3 className="font-headline text-xl md:text-2xl font-bold mb-4 text-white">AI &amp; WORKFLOW AUTOMATION</h3>
              <p className="text-on-surface-variant text-sm">Automate repetitive tasks and integrate AI agents that work 24/7 to boost your team's productivity.</p>
            </div>
          </div>
          
          {/* Competency 3 */}
          <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-4 group relative overflow-hidden rounded-3xl md:rounded-xl bg-surface-container-high border border-outline-variant/20 md:border-cyber-border p-8 md:p-10 min-h-[350px] md:h-[400px] hover-lift transition-all flex flex-col justify-end md:justify-start">
            <div className="absolute md:static top-0 right-0 p-6 md:p-0 md:mb-8 md:w-12 md:h-12 md:rounded-lg md:bg-secondary/10 flex items-center justify-center opacity-40 md:opacity-100">
              <span className="material-symbols-outlined text-secondary text-5xl md:text-2xl">blur_on</span>
            </div>
            <div className="relative z-10">
              <span className="font-label text-[10px] md:text-xs text-secondary tracking-widest uppercase mb-2 block">03 / Experience</span>
              <h3 className="font-headline text-xl md:text-2xl font-bold mb-4 text-white">UI/UX DESIGN</h3>
              <p className="text-on-surface-variant text-sm">Intuitive, immersive user experiences that convert visitors into loyal customers through atmospheric design.</p>
            </div>
          </div>
          
          {/* Competency 4 */}
          <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-8 group relative overflow-hidden rounded-3xl md:rounded-xl glass-panel cyber-border p-8 md:p-10 min-h-[350px] md:h-[400px] flex flex-col justify-end hover-lift transition-all">
            <img 
              alt="Digital data streams representing SEO and marketing" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbaJ3uUeQDxCdMogzbo0N9SxMVu8VvGAX7KfQD7a21hK0nay82z77RHhLQh1NFhB3LR_JjHsSUkbTBLuvhIugTPYntGDwohQ4DB-_lIXG0OVdGxXqFj1GOvGrxhgIcXUdcsUX3pibUYoQCS8bJKSh6E1MwcLjjCm0jaLG_ohPvTIkaLCRoOzAdSFeKTcoG76UalJVe7Ah92bgsrp16BsP_PJ1I5egKXHbzBCjj4hSEdJd7CuYW4NG5JY0Q2nfV3UKhiZpoiYtjGzBY"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            <div className="relative z-10">
              <span className="font-label text-[10px] md:text-xs text-secondary tracking-widest uppercase mb-2 block">04 / Growth</span>
              <h3 className="font-headline text-xl md:text-3xl font-bold mb-4 text-white">DIGITAL MARKETING &amp; SEO</h3>
              <p className="text-on-surface-variant text-sm md:text-base max-w-md">Data-driven strategies to dominate search results and social feeds, ensuring your brand stays top-of-mind.</p>
            </div>
          </div>
        </div>
        
        {/* Mobile Carousel Indicators (Hidden on Desktop) */}
        <div className="md:hidden flex justify-center gap-2 mt-4">
          <div className="w-8 h-1 rounded-full bg-primary"></div>
          <div className="w-2 h-1 rounded-full bg-outline-variant/40"></div>
          <div className="w-2 h-1 rounded-full bg-outline-variant/40"></div>
          <div className="w-2 h-1 rounded-full bg-outline-variant/40"></div>
        </div>
      </section>

      {/* ─── India & Beyond Section ─── */}
      <section className="py-20 md:py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden h-[350px] md:h-[600px] relative shadow-[0_0_50px_rgba(0,255,65,0.1)] border border-outline-variant/10 md:border-none group">
          <img 
            alt="Global connectivity map" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7v72RwlUG4-gPEjoCcbKG84e-pU6IYdjPRyzNxBGplKogCgwd0OEJk806x8WUbsnGu8ikYYSWn-P8YLQKyJPjPC5sUvKZVZehvTRKdATMIqbsFSzGnIgdGn0fefGxvhmome4FM2jkk0H0lJY8KDMUZ15EgUfv2FPk3ovD9t4WCfBsfQzMf5rnt2H8MBscud1XwMTFPbfKW_I2i5zp8eLt8AbFmo4STAIPipEvI2ixSdH9bHHTMkz8tyZnjGsIH5M83w-N3a-Gjhck"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 md:via-background/60 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center p-6 md:p-12">
            <div className="max-w-3xl">
              <h2 className="font-headline text-2xl md:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
                SERVING BUSINESSES ACROSS INDIA &amp; BEYOND
              </h2>
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-6 md:mt-10">
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1 md:mb-2 text-2xl md:text-4xl">location_on</span>
                  <span className="font-label text-[8px] md:text-xs uppercase tracking-widest text-white">Kolkata HQ</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary mb-1 md:mb-2 text-2xl md:text-4xl">public</span>
                  <span className="font-label text-[8px] md:text-xs uppercase tracking-widest text-white">Global Nodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="py-20 md:py-24 pt-8 md:pt-24 px-0 md:px-8 max-w-7xl mx-auto bg-surface-container-low/50 md:bg-transparent">
        <div className="px-6 md:px-0 mb-8 md:mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold md:text-center text-primary uppercase">CLIENT SUCCESS STORIES</h2>
          <p className="text-on-surface-variant text-sm mt-2 md:hidden">What our engineering partners say</p>
        </div>
        
        <div className="flex md:grid overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory md:snap-none pb-8 md:pb-0 px-6 md:px-0 gap-6 md:gap-8 md:grid-cols-3">
          <div className="snap-center shrink-0 w-[85vw] md:w-auto p-10 rounded-2xl md:rounded-xl bg-surface-container-high border border-white/5 italic text-on-surface-variant relative hover-lift transition-all">
            <span className="absolute top-4 left-4 text-primary text-4xl font-headline opacity-30">"</span>
            <p className="text-white md:text-on-surface-variant text-lg md:text-xl md:italic leading-relaxed">
              "Biznexa transformed our manual sales process into a fully automated lead-gen machine. Our ROI tripled in just 3 months."
            </p>
            <div className="mt-10 md:mt-8 flex items-center gap-4 not-italic">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">AK</div>
              <div>
                <div className="text-white font-bold text-base">Amit Kumar</div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-widest text-secondary font-label md:font-body">Founder, TECHSPRINT (SaaS)</div>
              </div>
            </div>
          </div>
          
          <div className="snap-center shrink-0 w-[85vw] md:w-auto p-10 rounded-2xl md:rounded-xl bg-surface-container-high border border-white/5 italic text-on-surface-variant relative hover-lift transition-all">
            <span className="absolute top-4 left-4 text-primary text-4xl font-headline opacity-30">"</span>
            <p className="text-white md:text-on-surface-variant text-lg md:text-xl md:italic leading-relaxed">
              "The website they built for us isn't just a site; it's a high-performance engine. The UI design is years ahead of our competitors."
            </p>
            <div className="mt-10 md:mt-8 flex items-center gap-4 not-italic">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">SR</div>
              <div>
                <div className="text-white font-bold text-base">Sonia Roy</div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-widest text-secondary font-label md:font-body">Marketing Director, LUXMEDIA</div>
              </div>
            </div>
          </div>
          
          <div className="snap-center shrink-0 w-[85vw] md:w-auto p-10 rounded-2xl md:rounded-xl bg-surface-container-high border border-white/5 italic text-on-surface-variant relative hover-lift transition-all">
            <span className="absolute top-4 left-4 text-primary text-4xl font-headline opacity-30">"</span>
            <p className="text-white md:text-on-surface-variant text-lg md:text-xl md:italic leading-relaxed">
              "Professional, technical, and visionary. Their AI solutions saved us over 40 hours of manual data entry per week."
            </p>
            <div className="mt-10 md:mt-8 flex items-center gap-4 not-italic">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">MD</div>
              <div>
                <div className="text-white font-bold text-base">M. Das</div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-widest text-secondary font-label md:font-body">CEO, GLOBAL LOGISTICS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-20 md:py-24 px-6 md:px-8 max-w-lg md:max-w-4xl mx-auto">
        <h2 className="font-headline text-3xl md:text-4xl font-bold md:tracking-tight mb-10 md:mb-16 text-center text-primary uppercase">Frequently Asked Questions</h2>
        <div className="space-y-2 md:space-y-4">
          {[
            {
              q: "How long does a website take to build?",
              a: "A typical corporate website takes 2-4 weeks, while complex web applications with AI integrations can take 6-12 weeks depending on the technical requirements.",
            },
            {
              q: "Do you provide ongoing support?",
              a: "Yes, we offer monthly retainers for hosting, security, performance monitoring, and content updates to ensure your digital assets run flawlessly.",
            },
            {
              q: "What does AI automation cost?",
              a: "Our AI workflow automation starts at custom entry points depending on the complexity of your current infrastructure. We conduct a free audit to determine exact ROI-driven costs.",
            },
            {
              q: "Can you handle my digital marketing too?",
              a: "Absolutely. We are a full-stack digital studio. Once your platform is built, our growth team can run data-driven SEO and Ads campaigns to drive targeted traffic.",
            },
          ].map((faq, index) => (
            <div key={index} className="group border-b border-outline-variant/20 md:border-outline-variant/30 py-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="font-headline text-base md:text-xl font-medium text-white group-hover:text-primary transition-colors">
                  {faq.q}
                </h3>
                <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openFaq === index ? "rotate-45" : ""}`}>
                  add
                </span>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-on-surface-variant font-body text-sm md:text-base">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="px-6 md:px-0 py-20 md:py-0 text-center">
        <div className="bg-gradient-to-br from-surface-container-high to-background md:bg-surface-container-low p-10 md:py-32 md:px-8 rounded-[2.5rem] md:rounded-none border border-white/5 md:border-y md:border-x-0 shadow-2xl md:shadow-none relative overflow-hidden w-full max-w-7xl md:max-w-none mx-auto">
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl md:hidden"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 hidden md:block"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="font-headline text-3xl md:text-7xl font-bold mb-8 md:mb-10 tracking-tighter text-white leading-tight">READY TO SCALE YOUR BUSINESS?</h2>
            
            <p className="md:hidden text-on-surface-variant text-sm mb-12 leading-relaxed">
              Schedule a free audit session with our engineers today. No fluff, just technical clarity.
            </p>
            
            <div className="flex flex-col items-center gap-12 text-center w-full">
              {/* Desktop contact details block */}
              <div className="hidden md:flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex items-center gap-4">
                  <a 
                    className="text-3xl font-headline font-light border-b-2 border-primary text-primary hover:text-secondary hover:border-secondary transition-all" 
                    href="mailto:hello@biznexa.tech"
                  >
                    hello@biznexa.tech
                  </a>
                </div>
                <span className="hidden md:block text-outline-variant">/</span>
                <div className="flex items-center gap-6">
                  <a 
                    className="flex items-center gap-2 text-2xl font-headline font-medium text-white hover:text-primary transition-colors" 
                    href="tel:+919876543210"
                  >
                    <img 
                      alt="WhatsApp" 
                      className="w-8 h-8" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZMFQEYWHXHwq0ys7NmfKsFUAuPUhzqxvrzFlgL15TtiUbnExZpG9-Bd6Awk28L8Bn_ILAfo78IX3mUF12nIY9AHVR6ILkQB1BT7rdjSrobEE6rXcHHQdCUbhLbSnl6vx8y27HpvMMHxJ0XS6rRNfoZFm6Ts7ZJUOXCYzl8UzgwXHLOUNdVnGCOzhcS6uiU5Agj7zH1gr0hZImElZdd1R_e3ioVsOHjBY9wOsY0dUCaUrA7Jf80KtUiDsURMnOsXetptDLw5Gl6zlZ"
                    />
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Desktop button */}
              <Link 
                href="/contact"
                className="hidden md:inline-flex px-12 py-5 bg-primary text-on-primary-fixed font-headline font-extrabold uppercase tracking-widest rounded-full hover:shadow-[0_0_50px_rgba(0,255,65,0.4)] transition-all transform hover:scale-105"
              >
                BOOK A FREE CONSULTATION
              </Link>
              
              {/* Mobile buttons */}
              <div className="flex md:hidden flex-col gap-4 w-full">
                <Link href="/contact" className="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(0,255,102,0.3)] uppercase tracking-widest text-sm">
                  BOOK A CALL
                </Link>
                <Link href="/case-studies" className="w-full glass-panel text-white font-headline font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 uppercase tracking-widest text-sm border border-white/10">
                  VIEW PORTFOLIO
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
