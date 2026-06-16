'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import PricingPlansSection from "@/components/ui/pricing-plans-section";
import { CountUp, ScrollReveal, StaggerGroup, StaggerItem, TextReveal, useReducedMotionSafe } from "@/components/ui/Animations";

import type { HomepageContent, HomepageService } from "@/lib/homepage";

interface HomepageClientProps {
  content: HomepageContent;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function ServiceCard({ service, index }: { service: HomepageService; index: number }) {
  return (
    <div className="group relative flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-surface-container-high/60 p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(0,255,102,0.08)] lg:min-h-[420px] lg:p-10">
      {service.imageUrl ? (
        <>
          <img
            alt={service.title}
            src={service.imageUrl}
            className="absolute inset-0 h-full w-full object-cover opacity-15 transition-all duration-700 group-hover:scale-105 group-hover:opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </>
      ) : (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 right-4 select-none font-headline text-[9rem] font-bold leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-primary/10"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <div className="relative z-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
          <span className="material-symbols-outlined text-2xl text-primary">{service.icon}</span>
        </div>
        <span className="mb-2 block font-label text-[10px] uppercase tracking-widest text-secondary md:text-xs">{service.eyebrow}</span>
        <h3 className="mb-3 font-headline text-xl font-bold text-white md:text-2xl">{service.title}</h3>
        <p className="max-w-md font-body text-sm leading-relaxed text-on-surface-variant md:text-base">{service.description}</p>
      </div>
    </div>
  );
}

/**
 * Desktop: the section pins to the viewport and the service cards pan
 * horizontally as the visitor scrolls vertically. Mobile keeps the
 * swipeable snap carousel.
 */
function ServicesShowcase({ content }: { content: HomepageContent }) {
  const reduceMotion = useReducedMotionSafe();
  const isDesktop = useIsDesktop();
  const horizontal = isDesktop && !reduceMotion;

  if (horizontal) {
    return <DesktopServicesShowcase content={content} />;
  }

  return <MobileServicesShowcase content={content} />;
}

function ServicesHeader({ content }: { content: HomepageContent }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-xl">
        <span className="mb-3 block font-label text-xs font-bold uppercase tracking-[0.3em] text-primary">What we do</span>
        <h2 className="mb-4 font-headline text-3xl font-bold tracking-tight text-white md:text-5xl">{content.servicesIntro.heading}</h2>
        <p className="font-body text-on-surface-variant">{content.servicesIntro.description}</p>
      </div>
      <div className="hidden h-px flex-grow bg-gradient-to-r from-primary/30 to-transparent md:mx-12 md:block" />
    </div>
  );
}

function MobileServicesShowcase({ content }: { content: HomepageContent }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28" id="services">
      <ScrollReveal className="mb-12 md:mb-16">
        <ServicesHeader content={content} />
      </ScrollReveal>
      <StaggerGroup className="-mx-6 flex touch-pan-x snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-6 pb-8 scrollbar-hide md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
        {content.services.map((service, index) => (
          <StaggerItem key={service.title} className="w-[85vw] shrink-0 snap-center md:w-auto">
            <ServiceCard service={service} index={index} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

function DesktopServicesShowcase({ content }: { content: HomepageContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxShift, setMaxShift] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.04], [0.4, 1]);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current && viewportRef.current) {
        setMaxShift(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[300vh]" id="services">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div style={{ opacity: headerOpacity }} className="mx-auto w-full max-w-7xl px-8 pb-12">
          <ServicesHeader content={content} />
        </motion.div>

        <div ref={viewportRef} className="w-full">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max gap-8 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-16"
          >
            {content.services.map((service, index) => (
              <div key={service.title} className="w-[30rem] shrink-0">
                <ServiceCard service={service} index={index} />
              </div>
            ))}

            {/* trailing card invites the visitor onward */}
            <Link
              href="/case-studies"
              className="group flex w-[22rem] shrink-0 flex-col items-start justify-end rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-10 transition-colors duration-300 hover:bg-primary/10"
            >
              <span className="material-symbols-outlined mb-6 text-5xl text-primary transition-transform duration-300 group-hover:translate-x-2">arrow_forward</span>
              <span className="font-headline text-2xl font-bold text-white">See it in action</span>
              <span className="mt-2 font-label text-xs uppercase tracking-widest text-primary">View case studies</span>
            </Link>
          </motion.div>
        </div>

        {/* progress rail tied to the horizontal pan */}
        <div className="mx-auto mt-12 w-full max-w-7xl px-8">
          <div className="h-px w-56 bg-white/10">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialColumn({
  children,
  index,
  progress,
  enabled,
}: {
  children: React.ReactNode;
  index: number;
  progress: MotionValue<number>;
  enabled: boolean;
}) {
  // middle column drifts against its neighbours for depth
  const range: [number, number] = index === 1 ? [56, -40] : [0, 24];
  const y = useTransform(progress, [0, 1], enabled ? range : [0, 0]);

  return (
    <motion.div style={{ y }} className="w-[85vw] shrink-0 snap-center md:w-auto">
      {children}
    </motion.div>
  );
}

export default function HomepageClient({ content }: HomepageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const reduceMotion = useReducedMotionSafe();
  const isDesktop = useIsDesktop();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroContentScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.94]);

  const testimonialsRef = useRef<HTMLElement>(null);
  const { scrollYProgress: testimonialsProgress } = useScroll({
    target: testimonialsRef,
    offset: ["start end", "end start"],
  });

  const marqueeItems = content.services.map((service) => service.title);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative -mt-28 flex min-h-[100svh] flex-col overflow-hidden bg-background"
      >
        {/* Layered background: aurora glows + faint grid, brand-green only */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -top-40 left-[8%] h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[140px]"
            animate={reduceMotion ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-48 right-[4%] h-[30rem] w-[30rem] rounded-full bg-secondary/10 blur-[140px]"
            animate={reduceMotion ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="hero-grid-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
        </div>

        <motion.div
          style={{ y: heroContentY, opacity: heroContentOpacity, scale: heroContentScale }}
          className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pt-40 pb-20 md:px-8 md:pt-44"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.25em] text-primary md:text-xs">
              {content.hero.badgeText}
            </span>
          </motion.div>

          <h1 className="mb-8 max-w-5xl font-headline text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl lg:tracking-tighter">
            <TextReveal text={content.hero.leadText} delay={0.1} />
            <br />
            <TextReveal
              text={content.hero.accentText}
              delay={0.3}
              className="bg-gradient-to-r from-primary via-tertiary to-primary bg-clip-text text-transparent"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-10 max-w-xl font-body text-base leading-relaxed text-on-surface-variant md:text-xl"
          >
            {content.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center"
          >
            <Link
              href={content.hero.primaryCtaHref}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-9 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary-fixed shadow-[0_0_24px_rgba(0,255,102,0.25)] transition-all duration-300 hover:shadow-[0_0_44px_rgba(0,255,102,0.45)] active:scale-95"
            >
              {content.hero.primaryCtaLabel}
              <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <Link
              href={content.hero.secondaryCtaHref}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-9 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-surface transition-all duration-300 hover:border-primary/40 hover:text-white active:scale-95"
            >
              {content.hero.secondaryCtaLabel}
            </Link>
          </motion.div>
        </motion.div>

        {/* Service marquee along the hero's bottom edge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="relative z-10 border-t border-white/5 bg-surface-container-low/40 py-5 backdrop-blur-sm"
        >
          <div className="marquee-track" aria-hidden>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {marqueeItems.map((item) => (
                  <span key={`${copy}-${item}`} className="flex items-center gap-10 px-5 font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant/70 md:text-sm">
                    {item}
                    <span className="text-primary">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="border-b border-white/5 px-6 py-14 md:px-8 md:py-16">
        <StaggerGroup className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 md:grid-cols-4">
          {content.stats.map((stat, index) => (
            <StaggerItem
              key={`${stat.value}-${stat.label}`}
              className={`flex flex-col items-center text-center ${index > 0 ? "md:border-l md:border-white/5" : ""}`}
            >
              <CountUp value={stat.value} className="mb-2 font-headline text-4xl font-bold text-primary md:text-6xl" />
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant md:text-xs">{stat.label}</span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ── Services (pinned horizontal pan on desktop) ──────── */}
      <ServicesShowcase content={content} />

      <PricingPlansSection />

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section ref={testimonialsRef} className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <ScrollReveal className="mb-12 md:mb-16 md:text-center">
          <span className="mb-3 block font-label text-xs font-bold uppercase tracking-[0.3em] text-primary">Testimonials</span>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-white md:text-5xl">{content.testimonialsIntro.heading}</h2>
          <p className="mt-3 font-body text-sm text-on-surface-variant md:hidden">{content.testimonialsIntro.mobileDescription}</p>
        </ScrollReveal>

        <StaggerGroup className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-8 scrollbar-hide md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {content.testimonials.map((testimonial, index) => (
            <TestimonialColumn
              key={`${testimonial.name}-${testimonial.company}`}
              index={index}
              progress={testimonialsProgress}
              enabled={isDesktop && !reduceMotion}
            >
              <StaggerItem className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-surface-container-high/60 p-8 transition-all duration-300 hover:border-primary/25 md:p-10">
                <span aria-hidden className="mb-6 block font-headline text-5xl leading-none text-primary/40">&ldquo;</span>
                <p className="flex-1 font-body text-base leading-relaxed text-on-surface md:text-lg">{testimonial.quote}</p>
                <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-headline font-bold text-primary">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-headline text-base font-bold text-white">{testimonial.name}</div>
                    <div className="font-label text-[10px] uppercase tracking-widest text-secondary">{testimonial.company}</div>
                  </div>
                </div>
              </StaggerItem>
            </TestimonialColumn>
          ))}
        </StaggerGroup>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-20 md:px-8 md:py-28">
        <ScrollReveal className="mb-10 text-center md:mb-16">
          <span className="mb-3 block font-label text-xs font-bold uppercase tracking-[0.3em] text-primary">FAQ</span>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-white md:text-5xl">{content.faqIntro.heading}</h2>
        </ScrollReveal>

        <StaggerGroup className="space-y-3">
          {content.faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <StaggerItem key={faq.question}>
                <div className={`rounded-2xl border transition-colors duration-300 ${isOpen ? "border-primary/30 bg-surface-container-high/60" : "border-white/10 bg-surface-container-low/40"}`}>
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center gap-4 px-6 py-5 text-left md:px-8 md:py-6"
                  >
                    <span className="font-headline text-sm font-bold text-primary/60">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className={`flex-1 font-headline text-base font-medium transition-colors md:text-xl ${isOpen ? "text-primary" : "text-white"}`}>{faq.question}</h3>
                    <span className={`material-symbols-outlined shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>add</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 pl-[3.75rem] font-body text-sm text-on-surface-variant md:px-8 md:pb-7 md:pl-[4.25rem] md:text-base">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="px-6 pb-20 md:px-8 md:pb-28">
        <ScrollReveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-primary/15 bg-surface-container-low/60 px-6 py-16 text-center md:px-8 md:py-28">
          <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-secondary/8 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <h2 className="mb-6 font-headline text-3xl font-bold leading-tight tracking-tight text-white md:text-6xl md:tracking-tighter">{content.cta.heading}</h2>
            <p className="mb-10 font-body text-sm leading-relaxed text-on-surface-variant md:text-lg">{content.cta.mobileDescription}</p>

            <div className="mb-12 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
              <a
                href={`mailto:${content.cta.email}`}
                className="font-headline text-xl font-light text-primary underline decoration-primary/40 underline-offset-8 transition-colors hover:text-tertiary md:text-3xl"
              >
                {content.cta.email}
              </a>
              <span className="hidden text-outline-variant md:block">/</span>
              <a
                href={`tel:${content.cta.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 font-headline text-lg font-medium text-white transition-colors hover:text-primary md:text-2xl"
              >
                <img alt="WhatsApp" className="h-7 w-7 md:h-8 md:w-8" src={content.cta.whatsappIconUrl} />
                {content.cta.phone}
              </a>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={content.cta.primaryHref}
                className="w-full rounded-full bg-primary px-12 py-5 font-headline text-sm font-extrabold uppercase tracking-widest text-on-primary-fixed shadow-[0_0_24px_rgba(0,255,102,0.3)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,255,102,0.5)] active:scale-95 sm:w-auto"
              >
                {content.cta.primaryLabel}
              </Link>
              <Link
                href={content.cta.secondaryHref}
                className="w-full rounded-full border border-white/15 px-12 py-5 font-headline text-sm font-bold uppercase tracking-widest text-on-surface transition-all duration-300 hover:border-primary/40 hover:text-white active:scale-95 sm:w-auto"
              >
                {content.cta.secondaryLabel}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
