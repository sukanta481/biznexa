"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

import { CountUp, ScrollReveal, TextReveal, useReducedMotionSafe } from "@/components/ui/Animations";

import type { CaseStudy } from "@/lib/case-studies";

interface CaseStudiesPageClientProps {
  studies: CaseStudy[];
}

/** Cover image drifts vertically as the row scrolls through the viewport. */
function ParallaxCover({ project }: { project: CaseStudy }) {
  const reduceMotion = useReducedMotionSafe();
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <Link
      ref={ref}
      href={`/case-studies/${project.slug}`}
      className="relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[26rem]"
    >
      <motion.img
        alt={project.coverImageAlt || project.title}
        src={project.coverImage}
        style={{ y }}
        className="h-[116%] w-full scale-105 object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/70 px-4 py-1.5 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.8)]" />
        <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">{project.category}</span>
      </span>
    </Link>
  );
}

export default function CaseStudiesPageClient({ studies }: CaseStudiesPageClientProps) {
  const filters = useMemo(() => ["All", ...Array.from(new Set(studies.map((study) => study.category)))], [studies]);
  const [activeFilter, setActiveFilter] = useState("All");
  const reduceMotion = useReducedMotionSafe();

  const filteredStudies = useMemo(
    () => activeFilter === "All" ? studies : studies.filter((study) => study.category === activeFilter),
    [activeFilter, studies],
  );

  return (
    <main className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/6 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* ── Header ───────────────────────────────────────── */}
        <header className="relative mb-12 md:mb-20">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 block font-label text-xs font-bold uppercase tracking-[0.35em] text-primary"
              >
                Engineering Excellence
              </motion.span>
              <h1 className="font-headline text-5xl font-bold leading-[0.95] tracking-tighter text-white md:text-7xl lg:text-8xl">
                <TextReveal text="SELECTIVE" delay={0.1} />
                <br />
                <TextReveal
                  text="CASE STUDIES."
                  delay={0.25}
                  className="bg-gradient-to-r from-primary via-tertiary to-primary bg-clip-text text-transparent"
                />
              </h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="lg:col-span-4 lg:pb-3"
            >
              <p className="max-w-sm font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
                Real projects. Real results. Here&apos;s what we&apos;ve built for businesses like yours.
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
                <span className="font-headline text-3xl font-bold text-primary">{String(studies.length).padStart(2, "0")}</span>
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Featured<br />Projects
                </span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ── Filters ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="-mx-6 mb-12 overflow-x-auto px-6 scrollbar-hide md:mx-0 md:mb-16 md:px-0"
        >
          <div className="flex min-w-max gap-2 md:min-w-0 md:flex-wrap md:gap-3">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`relative whitespace-nowrap rounded-full px-5 py-2.5 font-label text-xs font-bold uppercase tracking-wider transition-colors duration-200 active:scale-95 md:px-6 ${isActive ? "text-on-primary-fixed" : "border border-white/10 text-on-surface-variant hover:border-primary/40 hover:text-white"}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="case-filter-pill"
                      className="absolute inset-0 rounded-full bg-primary shadow-[0_0_18px_rgba(0,255,102,0.35)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{filter}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Spotlight rows ───────────────────────────────── */}
        <div className="flex flex-col gap-10 md:gap-16">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredStudies.map((project, index) => (
              <motion.article
                key={project.slug}
                layout
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.55, ease: [0.21, 0.65, 0.36, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-white/8 bg-surface-container-low/50 transition-colors duration-300 hover:border-primary/25"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  {/* Visual */}
                  <ParallaxCover project={project} />

                  {/* Content */}
                  <div className="flex flex-col justify-center p-7 md:p-10 lg:p-14">
                    <span className="mb-4 font-headline text-sm font-bold text-primary/50">{String(index + 1).padStart(2, "0")}</span>
                    <h2 className="mb-2 font-headline text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-primary md:text-4xl">
                      {project.title}
                    </h2>
                    {project.client && (
                      <span className="mb-5 font-label text-[10px] uppercase tracking-widest text-secondary md:text-xs">{project.client}</span>
                    )}
                    <p className="mb-8 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant md:text-base">{project.excerpt}</p>

                    {project.results.length > 0 && (
                      <div className="mb-8 grid grid-cols-3 gap-4 border-y border-white/5 py-6">
                        {project.results.slice(0, 3).map((result) => (
                          <div key={`${result.metric}-${result.label}`}>
                            <CountUp value={result.metric} className="block font-headline text-xl font-bold text-tertiary md:text-3xl" />
                            <span className="mt-1 block font-label text-[9px] uppercase tracking-widest text-on-surface-variant md:text-[10px]">{result.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {project.technologies.length > 0 && (
                      <div className="mb-8 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <span key={tech} className="rounded-full border border-white/10 px-3 py-1 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/case-studies/${project.slug}`}
                      className="group/btn inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 px-7 py-3.5 font-headline text-xs font-bold uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-on-primary-fixed active:scale-95"
                    >
                      View Case Study
                      <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover/btn:translate-x-1">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {filteredStudies.length === 0 && (
            <div className="rounded-3xl border border-white/8 bg-surface-container-low/50 py-24 text-center">
              <p className="font-body text-on-surface-variant">No case studies in this category yet.</p>
            </div>
          )}
        </div>

        {/* ── CTA ──────────────────────────────────────────── */}
        <ScrollReveal className="relative mt-20 overflow-hidden rounded-[2.5rem] border border-primary/15 bg-surface-container-low/60 px-6 py-16 text-center md:mt-32 md:px-8 md:py-24">
          <div className="pointer-events-none absolute -top-28 right-0 h-80 w-80 rounded-full bg-primary/8 blur-[120px]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-5 font-headline text-3xl font-bold leading-tight tracking-tight text-white md:text-6xl md:tracking-tighter">
              Ready to scale your business?
            </h2>
            <p className="mb-10 font-body text-sm leading-relaxed text-on-surface-variant md:text-lg">
              Let&apos;s architect your next digital breakthrough together.
            </p>
            <Link
              href="/contact"
              className="inline-block w-full rounded-full bg-primary px-12 py-5 font-headline text-sm font-extrabold uppercase tracking-widest text-on-primary-fixed shadow-[0_0_24px_rgba(0,255,102,0.3)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,255,102,0.5)] active:scale-95 sm:w-auto"
            >
              Book a Free Consultation
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
