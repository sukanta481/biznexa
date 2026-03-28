import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { getAllCaseStudies, getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/case-studies";
import { COMPANY } from "@/lib/constants";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: `${study.title} - Case Study | ${COMPANY.name}`,
    description: study.excerpt,
    openGraph: {
      title: `${study.title} - ${COMPANY.name} Case Study`,
      description: study.excerpt,
      images: study.coverImage ? [study.coverImage] : undefined,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const allStudies = await getAllCaseStudies();
  const relatedStudies = (study.relatedSlugs.length > 0
    ? allStudies.filter((item) => study.relatedSlugs.includes(item.slug))
    : allStudies.filter((item) => item.slug !== study.slug).slice(0, 3)
  ).slice(0, 3);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: COMPANY.website },
          { name: "Case Studies", url: `${COMPANY.website}/case-studies` },
          { name: study.title, url: `${COMPANY.website}/case-studies/${study.slug}` },
        ]}
      />

      <section className="md:hidden px-6 py-8 mt-20">
        <div className="space-y-2 mb-6">
          <span className="text-primary font-label text-[10px] tracking-[0.2em] uppercase">Case Study: {study.category}</span>
          <h1 className="text-4xl font-headline font-bold leading-tight tracking-tight text-white">{study.title}</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {study.results.slice(0, 2).map((result, i) => (
            <div key={i} className="glass-panel p-5 rounded-lg border-l-2 border-l-tertiary">
              <div className="text-3xl font-headline font-bold text-tertiary">{result.metric}</div>
              <div className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider mt-1">{result.label.split(' ')[0]}</div>
              <div className="text-[11px] text-on-surface-variant mt-2">{result.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="hidden md:flex relative min-h-[870px] items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt={study.coverImageAlt || study.title} className="w-full h-full object-cover opacity-40" style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }} src={study.coverImage} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid md:grid-cols-12 gap-12 items-center mt-20">
          <div className="md:col-span-7">
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-on-surface hover:text-primary transition-colors mb-8 font-label uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Case Studies
            </Link>
            <span className="font-label text-tertiary uppercase tracking-[0.2em] text-xs mb-4 block">Case Study / {study.category}</span>
            <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight tracking-tighter text-glow mb-8 text-white">{study.title}</h1>
            <p className="text-on-surface text-lg max-w-xl mb-10 leading-relaxed font-body">{study.excerpt}</p>
          </div>
          <div className="md:col-span-5">
            <div className="glass-panel p-8 rounded-xl border border-primary/10 shadow-[0_0_50px_rgba(0,255,102,0.1)]">
              <h3 className="font-label text-primary text-sm uppercase tracking-widest mb-6">Impact Summary</h3>
              <div className="space-y-8">
                {study.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded flex items-center justify-center ${i === 0 ? "bg-tertiary/10" : "bg-primary/10"}`}>
                      <span className={`material-symbols-outlined ${i === 0 ? "text-tertiary" : "text-primary"}`}>{i === 0 ? "trending_down" : "verified"}</span>
                    </div>
                    <div>
                      <div className="text-3xl font-headline font-bold text-white">{result.metric}</div>
                      <div className="text-sm text-on-surface">{result.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="md:hidden px-6 space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="h-[1px] w-8 bg-primary/30"></div><h2 className="text-xs font-label font-bold text-primary tracking-[0.15em] uppercase">The Challenge</h2></div>
          <p className="text-on-surface-variant leading-relaxed text-sm font-body">{study.challenge}</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="h-[1px] w-8 bg-primary/30"></div><h2 className="text-xs font-label font-bold text-primary tracking-[0.15em] uppercase">The Biznexa Solution</h2></div>
          <p className="text-on-surface-variant leading-relaxed text-sm font-body">{study.solution}</p>
          <ul className="space-y-3">
            {study.technologies.slice(0, 3).map((tech, i) => (
              <li key={i} className="flex gap-3"><span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span><span className="text-xs text-on-surface">{tech}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hidden md:block max-w-7xl mx-auto px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="md:col-span-1 bg-surface-container p-8 rounded-lg border border-outline-variant/10"><span className="material-symbols-outlined text-error text-4xl mb-6">warning</span><h2 className="font-headline text-2xl font-bold mb-4 text-white">The Challenge</h2><p className="text-on-surface-variant leading-relaxed font-body">{study.challenge}</p></div>
          <div className="md:col-span-2 bg-surface-container-high p-8 rounded-lg relative overflow-hidden group border border-outline-variant/10"><div className="absolute top-0 right-0 p-4 opacity-5"><span className="material-symbols-outlined text-9xl">psychology</span></div><div className="relative z-10"><h2 className="font-headline text-2xl font-bold mb-4 text-primary">The {COMPANY.name} Solution</h2><div className="grid md:grid-cols-2 gap-8"><p className="text-on-surface-variant leading-relaxed font-body">{study.solution}</p><ul className="space-y-4 font-body">{study.technologies.slice(0, 4).map((tech, i) => (<li key={i} className="flex items-center gap-3 text-sm text-on-surface"><span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>Developed with {tech}</li>))}</ul></div></div></div>
        </div>

        <div className="mb-24">
          <h2 className="font-label text-xs tracking-[0.3em] uppercase text-center mb-12 opacity-50 text-white">Quantitative Results</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {study.results.map((result, index) => {
              const colors = ["text-tertiary", "text-primary", "text-secondary", "text-white"];
              return <div key={index} className="text-center p-8 bg-surface-container-low border border-outline-variant/20 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform"><div className={`text-5xl font-headline font-bold mb-2 ${colors[index % colors.length]}`}>{result.metric}</div><div className="text-xs font-label uppercase text-on-surface-variant">{result.label}</div></div>;
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 glass-panel rounded-2xl border border-tertiary/20 text-center shadow-[0_0_30px_rgba(88,231,171,0.05)]">
            <span className="material-symbols-outlined text-6xl text-tertiary/20 absolute -top-8 left-1/2 -translate-x-1/2 bg-surface px-4">format_quote</span>
            <blockquote className="text-2xl md:text-3xl font-headline italic text-white mb-8 leading-snug">&ldquo;{study.clientQuote}&rdquo;</blockquote>
            <div className="flex flex-col items-center">
              <img alt={study.client} className="w-16 h-16 rounded-full border-2 border-primary mb-4 object-cover" src={study.clientImage} />
              <cite className="not-italic font-bold text-white font-headline tracking-wide">{study.client}</cite>
              <span className="text-sm text-on-surface-variant font-body">{study.clientRole}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="md:hidden mt-16 bg-surface-container-low py-12 px-6">
        <h2 className="text-2xl font-headline font-bold mb-8 text-center text-white">Quantifiable Outcomes</h2>
        <div className="space-y-8">
          {study.results.map((result, index) => (
            <div key={index}><div className="text-center"><div className="text-5xl font-headline font-bold text-primary mb-2">{result.metric}</div><p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">{result.label}</p></div>{index < study.results.length - 1 && <div className="h-[1px] w-12 bg-outline-variant mx-auto mt-8"></div>}</div>
          ))}
        </div>
      </section>

      <section className="md:hidden px-6 py-16">
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-6xl">format_quote</span></div><p className="text-on-surface italic leading-relaxed mb-8 relative z-10 font-body">&ldquo;{study.clientQuote}&rdquo;</p><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30"><img alt={study.client} className="w-full h-full object-cover" src={study.clientImage} /></div><div><div className="text-sm font-bold font-headline text-white">{study.client}</div><div className="text-[10px] text-on-surface-variant uppercase tracking-wider">{study.clientRole}</div></div></div></div>
      </section>

      <section className="md:hidden py-12 border-t border-primary/10">
        <div className="px-6 flex justify-between items-end mb-6"><div><h3 className="text-xs font-label text-primary tracking-widest uppercase mb-1">More Success</h3><h2 className="text-xl font-headline font-bold text-white">Similar Projects</h2></div><div className="flex gap-2">{relatedStudies.map((related, index) => <span key={related.slug} className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-primary' : 'bg-outline-variant'}`}></span>)}</div></div>
        <div className="flex overflow-x-auto gap-4 px-6 snap-x scrollbar-hide">{relatedStudies.map((related) => <Link key={related.slug} href={`/case-studies/${related.slug}`} className="min-w-[280px] snap-start glass-panel rounded-xl overflow-hidden flex-shrink-0 block"><div className="h-40 w-full bg-surface-container"><img alt={related.coverImageAlt || related.title} className="w-full h-full object-cover grayscale" src={related.coverImage} /></div><div className="p-5"><div className="text-[10px] text-primary font-label uppercase tracking-widest mb-2">{related.category}</div><h4 className="font-headline font-bold mb-3 text-white">{related.title}</h4><span className="text-[10px] font-label text-primary tracking-tighter flex items-center gap-2">VIEW CASE <span className="material-symbols-outlined text-xs">arrow_forward</span></span></div></Link>)}</div>
      </section>

      <section className="hidden md:block bg-surface-container-low py-24 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12"><h3 className="font-headline text-3xl font-bold text-white tracking-tight">Related Case Studies</h3><Link href="/case-studies" className="text-primary hover:text-white transition-colors font-label text-sm uppercase tracking-widest flex items-center gap-2">View All <span className="material-symbols-outlined text-sm">arrow_forward</span></Link></div>
          <div className="grid md:grid-cols-3 gap-8">{relatedStudies.map((related, index) => { const accent = ["text-primary", "text-secondary", "text-tertiary"][index % 3]; const overlay = ["group-hover:bg-primary/20", "group-hover:bg-secondary/20", "group-hover:bg-tertiary/20"][index % 3]; return <Link key={related.slug} href={`/case-studies/${related.slug}`} className="group cursor-pointer"><div className="overflow-hidden rounded-lg mb-6 aspect-video bg-surface-container-high border border-outline-variant/20 relative"><div className={`absolute inset-0 bg-transparent ${overlay} transition-colors duration-500 z-10 mix-blend-overlay`}></div><img alt={related.coverImageAlt || related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={related.coverImage} /></div><span className={`font-label text-xs ${accent} uppercase tracking-widest font-bold`}>{related.category}</span><h4 className={`font-headline text-xl font-bold mt-2 text-white transition-colors ${index === 0 ? 'group-hover:text-primary' : index === 1 ? 'group-hover:text-secondary' : 'group-hover:text-tertiary'}`}>{related.title}</h4></Link>; })}</div>
        </div>
      </section>
    </>
  );
}
