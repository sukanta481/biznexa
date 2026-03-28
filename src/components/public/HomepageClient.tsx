'use client';

import { useState } from "react";
import Link from "next/link";

import type { HomepageContent } from "@/lib/homepage";

interface HomepageClientProps {
  content: HomepageContent;
}

export default function HomepageClient({ content }: HomepageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const [serviceOne, serviceTwo, serviceThree, serviceFour] = content.services;
  const [markerOne, markerTwo] = content.globalReach.markers;

  return (
    <>
      <section className="relative min-h-0 md:min-h-[85vh] flex items-center justify-center overflow-hidden px-6 md:px-8 py-20 md:py-0">
        <div className="absolute inset-0 hero-glow"></div>
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container cyber-border">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              {content.hero.badgeText}
            </span>
          </div>

          <h1 className="font-headline text-4xl md:text-8xl font-bold tracking-tight md:tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] text-glow">
            <span className="md:hidden">
              {content.hero.leadText} <span className="text-primary">{content.hero.accentText}</span>
            </span>
            <span className="hidden md:inline">
              {content.hero.leadText}
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {content.hero.accentText}
              </span>
            </span>
          </h1>

          <p className="max-w-xs md:max-w-2xl mx-auto text-on-surface-variant text-base md:text-xl font-body leading-relaxed mb-8 md:mb-12">
            {content.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center gap-4 sm:gap-6 mt-8 px-6 sm:px-0">
            <Link href={content.hero.primaryCtaHref} className="w-full sm:w-auto bg-primary text-on-primary font-headline font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(0,255,102,0.3)] uppercase tracking-widest text-sm">
              {content.hero.primaryCtaLabel}
            </Link>
            <Link href={content.hero.secondaryCtaHref} className="w-full sm:w-auto glass-panel border border-white/10 text-white font-headline font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 uppercase tracking-widest text-sm">
              {content.hero.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:border-y md:border-white/5 md:bg-surface-container-low/30 px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {content.stats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className="glass-panel md:!bg-transparent md:!backdrop-blur-none p-6 md:p-0 rounded-2xl md:rounded-none border border-outline-variant/10 md:border-none text-center">
              <div className="font-headline text-3xl md:text-5xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="font-label text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-8 max-w-7xl mx-auto" id="services">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-4 text-primary">{content.servicesIntro.heading}</h2>
            <p className="text-on-surface-variant font-body">{content.servicesIntro.description}</p>
          </div>
          <div className="hidden md:block h-px flex-grow bg-outline-variant/20 mx-12"></div>
        </div>

        <div className="flex md:grid overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory md:snap-none pb-8 md:pb-0 px-6 md:px-0 gap-6 md:grid-cols-12 -mx-6 md:mx-0">
          <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-8 group relative overflow-hidden rounded-3xl md:rounded-xl glass-panel cyber-border p-8 md:p-10 min-h-[350px] md:h-[400px] flex flex-col justify-end hover-lift transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="material-symbols-outlined text-9xl text-primary">{serviceOne?.icon ?? "code"}</span>
            </div>
            <div className="relative z-10">
              <span className="font-label text-[10px] md:text-xs text-secondary tracking-widest uppercase mb-2 block">{serviceOne?.eyebrow}</span>
              <h3 className="font-headline text-xl md:text-3xl font-bold mb-4 text-white">{serviceOne?.title}</h3>
              <p className="text-on-surface-variant text-sm md:text-base max-w-md">{serviceOne?.description}</p>
            </div>
          </div>

          <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-4 group relative overflow-hidden rounded-3xl md:rounded-xl bg-surface-container-high border border-outline-variant/20 md:border-cyber-border p-8 md:p-10 min-h-[350px] md:h-[400px] hover-lift transition-all flex flex-col justify-end md:justify-start">
            <div className="absolute md:static top-0 right-0 p-6 md:p-0 md:mb-8 md:w-12 md:h-12 md:rounded-lg md:bg-primary/10 flex items-center justify-center opacity-40 md:opacity-100">
              <span className="material-symbols-outlined text-primary text-5xl md:text-2xl">{serviceTwo?.icon ?? "smart_toy"}</span>
            </div>
            <div className="relative z-10">
              <span className="font-label text-[10px] md:text-xs text-secondary tracking-widest uppercase mb-2 block">{serviceTwo?.eyebrow}</span>
              <h3 className="font-headline text-xl md:text-2xl font-bold mb-4 text-white">{serviceTwo?.title}</h3>
              <p className="text-on-surface-variant text-sm">{serviceTwo?.description}</p>
            </div>
          </div>

          <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-4 group relative overflow-hidden rounded-3xl md:rounded-xl bg-surface-container-high border border-outline-variant/20 md:border-cyber-border p-8 md:p-10 min-h-[350px] md:h-[400px] hover-lift transition-all flex flex-col justify-end md:justify-start">
            <div className="absolute md:static top-0 right-0 p-6 md:p-0 md:mb-8 md:w-12 md:h-12 md:rounded-lg md:bg-secondary/10 flex items-center justify-center opacity-40 md:opacity-100">
              <span className="material-symbols-outlined text-secondary text-5xl md:text-2xl">{serviceThree?.icon ?? "blur_on"}</span>
            </div>
            <div className="relative z-10">
              <span className="font-label text-[10px] md:text-xs text-secondary tracking-widest uppercase mb-2 block">{serviceThree?.eyebrow}</span>
              <h3 className="font-headline text-xl md:text-2xl font-bold mb-4 text-white">{serviceThree?.title}</h3>
              <p className="text-on-surface-variant text-sm">{serviceThree?.description}</p>
            </div>
          </div>

          <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-8 group relative overflow-hidden rounded-3xl md:rounded-xl glass-panel cyber-border p-8 md:p-10 min-h-[350px] md:h-[400px] flex flex-col justify-end hover-lift transition-all">
            <img alt={serviceFour?.title ?? "Service background"} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" src={serviceFour?.imageUrl ?? ""} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            <div className="relative z-10">
              <span className="font-label text-[10px] md:text-xs text-secondary tracking-widest uppercase mb-2 block">{serviceFour?.eyebrow}</span>
              <h3 className="font-headline text-xl md:text-3xl font-bold mb-4 text-white">{serviceFour?.title}</h3>
              <p className="text-on-surface-variant text-sm md:text-base max-w-md">{serviceFour?.description}</p>
            </div>
          </div>
        </div>

        <div className="md:hidden flex justify-center gap-2 mt-4">
          <div className="w-8 h-1 rounded-full bg-primary"></div>
          <div className="w-2 h-1 rounded-full bg-outline-variant/40"></div>
          <div className="w-2 h-1 rounded-full bg-outline-variant/40"></div>
          <div className="w-2 h-1 rounded-full bg-outline-variant/40"></div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden h-[350px] md:h-[600px] relative shadow-[0_0_50px_rgba(0,255,65,0.1)] border border-outline-variant/10 md:border-none group">
          <img alt="Global connectivity map" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" src={content.globalReach.backgroundImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 md:via-background/60 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center p-6 md:p-12">
            <div className="max-w-3xl">
              <h2 className="font-headline text-2xl md:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">{content.globalReach.heading}</h2>
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-6 md:mt-10">
                {[markerOne, markerTwo].filter(Boolean).map((marker) => (
                  <div key={`${marker?.icon}-${marker?.label}`} className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-primary mb-1 md:mb-2 text-2xl md:text-4xl">{marker?.icon}</span>
                    <span className="font-label text-[8px] md:text-xs uppercase tracking-widest text-white">{marker?.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 pt-8 md:pt-24 px-0 md:px-8 max-w-7xl mx-auto bg-surface-container-low/50 md:bg-transparent">
        <div className="px-6 md:px-0 mb-8 md:mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold md:text-center text-primary uppercase">{content.testimonialsIntro.heading}</h2>
          <p className="text-on-surface-variant text-sm mt-2 md:hidden">{content.testimonialsIntro.mobileDescription}</p>
        </div>

        <div className="flex md:grid overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory md:snap-none pb-8 md:pb-0 px-6 md:px-0 gap-6 md:gap-8 md:grid-cols-3">
          {content.testimonials.map((testimonial) => (
            <div key={`${testimonial.name}-${testimonial.company}`} className="snap-center shrink-0 w-[85vw] md:w-auto p-10 rounded-2xl md:rounded-xl bg-surface-container-high border border-white/5 italic text-on-surface-variant relative hover-lift transition-all">
              <span className="absolute top-4 left-4 text-primary text-4xl font-headline opacity-30">&ldquo;</span>
              <p className="text-white md:text-on-surface-variant text-lg md:text-xl md:italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-10 md:mt-8 flex items-center gap-4 not-italic">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{testimonial.initials}</div>
                <div>
                  <div className="text-white font-bold text-base">{testimonial.name}</div>
                  <div className="text-[10px] md:text-[11px] uppercase tracking-widest text-secondary font-label md:font-body">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-8 max-w-lg md:max-w-4xl mx-auto">
        <h2 className="font-headline text-3xl md:text-4xl font-bold md:tracking-tight mb-10 md:mb-16 text-center text-primary uppercase">{content.faqIntro.heading}</h2>
        <div className="space-y-2 md:space-y-4">
          {content.faqs.map((faq, index) => (
            <div key={faq.question} className="group border-b border-outline-variant/20 md:border-outline-variant/30 py-6">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleFaq(index)}>
                <h3 className="font-headline text-base md:text-xl font-medium text-white group-hover:text-primary transition-colors">{faq.question}</h3>
                <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openFaq === index ? "rotate-45" : ""}`}>add</span>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="text-on-surface-variant font-body text-sm md:text-base">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-0 py-20 md:py-0 text-center">
        <div className="bg-gradient-to-br from-surface-container-high to-background md:bg-surface-container-low p-10 md:py-32 md:px-8 rounded-[2.5rem] md:rounded-none border border-white/5 md:border-y md:border-x-0 shadow-2xl md:shadow-none relative overflow-hidden w-full max-w-7xl md:max-w-none mx-auto">
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl md:hidden"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 hidden md:block"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="font-headline text-3xl md:text-7xl font-bold mb-8 md:mb-10 tracking-tighter text-white leading-tight">{content.cta.heading}</h2>
            <p className="md:hidden text-on-surface-variant text-sm mb-12 leading-relaxed">{content.cta.mobileDescription}</p>

            <div className="flex flex-col items-center gap-12 text-center w-full">
              <div className="hidden md:flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex items-center gap-4">
                  <a className="text-3xl font-headline font-light border-b-2 border-primary text-primary hover:text-secondary hover:border-secondary transition-all" href={`mailto:${content.cta.email}`}>
                    {content.cta.email}
                  </a>
                </div>
                <span className="hidden md:block text-outline-variant">/</span>
                <div className="flex items-center gap-6">
                  <a className="flex items-center gap-2 text-2xl font-headline font-medium text-white hover:text-primary transition-colors" href={`tel:${content.cta.phone.replace(/\s+/g, "")}`}>
                    <img alt="WhatsApp" className="w-8 h-8" src={content.cta.whatsappIconUrl} />
                    {content.cta.phone}
                  </a>
                </div>
              </div>

              <Link href={content.cta.primaryHref} className="hidden md:inline-flex px-12 py-5 bg-primary text-on-primary-fixed font-headline font-extrabold uppercase tracking-widest rounded-full hover:shadow-[0_0_50px_rgba(0,255,65,0.4)] transition-all transform hover:scale-105">
                {content.cta.primaryLabel}
              </Link>

              <div className="flex md:hidden flex-col gap-4 w-full">
                <Link href={content.cta.primaryHref} className="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(0,255,102,0.3)] uppercase tracking-widest text-sm">
                  {content.hero.primaryCtaLabel}
                </Link>
                <Link href={content.cta.secondaryHref} className="w-full glass-panel text-white font-headline font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 uppercase tracking-widest text-sm border border-white/10">
                  {content.cta.secondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
