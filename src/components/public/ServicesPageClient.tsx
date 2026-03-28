"use client";

import Link from "next/link";

import type { ServicesContent } from "@/lib/services";

interface ServicesPageClientProps {
  content: ServicesContent;
}

const accentClassMap = {
  primary: {
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  secondary: {
    text: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
  tertiary: {
    text: "text-tertiary",
    bg: "bg-tertiary/10",
    border: "border-tertiary/20",
  },
} as const;

const desktopAccentMap = {
  primary: {
    border: "border-primary",
    icon: "text-primary",
    dot: "bg-primary/40",
  },
  secondary: {
    border: "border-secondary",
    icon: "text-secondary-dim",
    dot: "bg-secondary/40",
  },
  tertiary: {
    border: "border-tertiary",
    icon: "text-tertiary-dim",
    dot: "bg-tertiary/40",
  },
} as const;

export default function ServicesPageClient({ content }: ServicesPageClientProps) {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-32 pb-12 md:pb-32">
        <div className="flex flex-col md:flex-row gap-12 items-start md:mt-12">
          <div className="md:w-7/12">
            <span className="font-label text-tertiary md:text-primary uppercase tracking-[0.2em] md:tracking-[0.3em] text-[0.6875rem] md:text-xs mb-4 block">
              {content.hero.badgeText}
            </span>
            <h1 className="font-headline text-[2.75rem] md:text-7xl font-bold tracking-[-0.02em] md:tracking-tighter mb-6 md:mb-8 leading-[1.1] md:text-glow">
              <span className="md:hidden">
                {content.hero.mobileHeadlineLead} <span className="text-primary">{content.hero.mobileHeadlinePrimary}</span>, automate business <span className="text-tertiary">{content.hero.mobileHeadlineAccent}</span>, and run digital marketing.
              </span>
              <span className="hidden md:inline">{content.hero.desktopHeadline}</span>
            </h1>
            <p className="font-body text-sm md:text-lg text-on-surface-variant max-w-[90%] md:max-w-xl leading-relaxed">
              {content.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-2 font-label text-[0.65rem] uppercase tracking-widest text-tertiary/80 md:hidden">
              {content.hero.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2"><span className="w-1 h-1 bg-tertiary rounded-full"></span> {highlight}</div>
              ))}
            </div>
          </div>
          <div className="hidden md:block md:w-5/12 relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl group-hover:opacity-50 transition-opacity"></div>
            <div className="relative glass-panel rounded-xl aspect-square overflow-hidden cyber-border">
              <img alt={content.hero.imageAlt} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" src={content.hero.imageUrl} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto md:px-8 py-8 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 gap-8 px-6 md:px-0">
          <div className="max-w-xl">
            <h2 className="font-headline text-2xl md:text-4xl font-bold tracking-tight mb-0 md:mb-4 text-on-surface md:text-primary uppercase">{content.workflow.heading}</h2>
          </div>
          <div className="hidden md:block h-px flex-grow bg-outline-variant/20 mx-12"></div>
          <div className="flex items-center gap-2 text-on-surface-variant md:hidden">
            <span className="material-symbols-outlined text-sm opacity-50">swipe_left</span>
          </div>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 gap-6 md:grid md:grid-cols-4 md:px-0 md:overflow-visible md:snap-none">
          {content.workflow.steps.map((step) => {
            const accent = accentClassMap[step.accent];
            const panelClass = step.surface === "glass" ? "glass-panel" : "bg-surface-container-high";

            return (
              <div key={step.number} className={`min-w-[85vw] md:min-w-0 snap-center h-[280px] md:h-auto ${panelClass} p-8 rounded-xl cyber-border relative overflow-hidden group hover-lift transition-all`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <span className={`font-headline text-6xl font-bold ${accent.text}`}>{step.number}</span>
                </div>
                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-lg ${accent.bg} flex items-center justify-center border ${accent.border}`}>
                    <span className={`material-symbols-outlined ${accent.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                  </div>
                </div>
                <h3 className="font-headline text-xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto md:px-8 py-10 md:py-32">
        <div className="px-6 md:px-0 mb-8 md:mb-0 flex justify-between items-end md:hidden">
          <h2 className="font-headline text-2xl font-bold text-on-surface">{content.mobileServices.heading}</h2>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm opacity-50">swipe_left</span>
          </div>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 gap-6 md:hidden">
          {content.mobileServices.cards.map((card) => (
            <div key={card.title} className="min-w-[85vw] snap-center space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <h3 className="font-headline text-xl font-bold tracking-tight">{card.title}</h3>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[16/9]">
                <img className="w-full h-full object-cover grayscale opacity-60" alt={card.imageAlt} src={card.imageUrl} />
              </div>
              <ul className="space-y-3">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-xs text-on-surface-variant"><span className="text-tertiary font-bold">/</span> {bullet}</li>
                ))}
              </ul>
              <Link href={card.buttonHref} className="block w-full bg-tertiary text-background py-3 rounded-lg font-headline font-bold uppercase tracking-widest text-xs text-center">{card.buttonLabel}</Link>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {content.mobileServices.cards.map((card, index) => (
            <div key={card.title} className={`w-1.5 h-1.5 rounded-full ${index === 0 ? "bg-tertiary" : "bg-surface-container-highest"}`}></div>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-12 gap-12">
          <div className="col-span-4 sticky top-32 h-fit">
            <span className="font-label text-secondary uppercase tracking-[0.3em] text-xs mb-4 block">{content.desktopSidebar.eyebrow}</span>
            <h2 className="font-headline text-4xl font-bold mb-6 tracking-tight uppercase">
              {content.desktopSidebar.headingLead} <br />
              <span className="text-secondary">{content.desktopSidebar.headingAccent}</span>
            </h2>
            <p className="font-body text-on-surface-variant mb-8 leading-relaxed">{content.desktopSidebar.description}</p>
            <div className="flex flex-col gap-4">
              {content.desktopSidebar.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-3 text-sm font-label text-primary">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-8 space-y-8">
            {content.desktopServices.map((service) => {
              const accent = desktopAccentMap[service.accent];
              return (
                <div key={service.title} className={`bg-surface-container-low p-10 rounded-xl border-l-4 ${accent.border} transition-all hover:bg-surface-container/80 cyber-border hover-lift`}>
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="font-headline text-2xl font-bold text-white">{service.title}</h4>
                    <span className={`material-symbols-outlined text-3xl ${accent.icon}`}>{service.icon}</span>
                  </div>
                  <p className="font-body text-on-surface-variant leading-relaxed mb-6">{service.description}</p>
                  <ul className="grid grid-cols-2 gap-y-2 font-body text-sm text-on-surface-variant">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${accent.dot}`}></div>{bullet}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-20 text-center relative overflow-hidden max-w-7xl mx-auto">
        <div className="md:hidden absolute inset-0 bg-tertiary/5 backdrop-blur-3xl -z-10"></div>
        <h2 className="font-headline text-3xl md:text-6xl font-bold mb-6 md:mb-10 tracking-tighter">
          <span className="md:hidden">{content.cta.mobileLead} <br /><span className="text-tertiary">{content.cta.mobileAccent}</span></span>
          <span className="hidden md:inline text-white">{content.cta.desktopHeading}</span>
        </h2>
        <Link href={content.cta.buttonHref} className="inline-block bg-tertiary md:bg-primary text-background md:text-on-primary-fixed px-10 py-4 rounded-lg md:rounded-full font-headline font-bold uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(155,255,206,0.2)] md:shadow-[0_0_30px_rgba(0,255,102,0.4)] hover:brightness-110 transition-all active:scale-95">{content.cta.buttonLabel}</Link>
      </section>
    </>
  );
}
