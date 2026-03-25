import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudyBySlug, getAllCaseStudySlugs } from "@/lib/case-studies";
import { COMPANY } from "@/lib/constants";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: `${study.title} — Case Study | ${COMPANY.name}`,
    description: study.excerpt,
    openGraph: {
      title: `${study.title} — ${COMPANY.name} Case Study`,
      description: study.excerpt,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: COMPANY.website },
          { name: "Case Studies", url: `${COMPANY.website}/case-studies` },
          { name: study.title, url: `${COMPANY.website}/case-studies/${study.slug}` },
        ]}
      />

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[870px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Logistics background"
            className="w-full h-full object-cover opacity-40"
            style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkDV1d46c79xed9SILihkf6hBrdgjMMkCPPAjkrlIX03ZISf-DUEiOPH4DDGqdYFgO3CS8lhmcKlusvl0r4HVDdrdjXe5aD9nmI9uLYk5x0hO3G8QacrX0qHpf3-GwV3aZ86FMaGq9A732KTW4F2sF_jKsaO8azJ_aEZW3L1FkWyUpjEiLv0JTbve_u56SvpwjmsgLsjwQdc6S4Aoip8G76Kt2I6NPrf10EBCq6Bm7vwl8k1KWmcixO3ty81ILHuuVVqEK7IDIEW6v"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid md:grid-cols-12 gap-12 items-center mt-20">
          <div className="md:col-span-7">
            <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-sm text-on-surface hover:text-primary transition-colors mb-8 font-label uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Case Studies
            </Link>
            <span className="font-label text-tertiary uppercase tracking-[0.2em] text-xs mb-4 block">
              Case Study / {study.category}
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight tracking-tighter text-glow mb-8 text-white">
              {study.title.split(' ').slice(0, -2).join(' ')}{" "}
              <span className="text-tertiary">{study.title.split(' ').slice(-2).join(' ')}</span>
            </h1>
            <p className="text-on-surface text-lg max-w-xl mb-10 leading-relaxed font-body">
              {study.excerpt}
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="glass-panel p-8 rounded-xl border border-primary/10 shadow-[0_0_50px_rgba(0,255,102,0.1)]">
              <h3 className="font-label text-primary text-sm uppercase tracking-widest mb-6">Impact Summary</h3>
              <div className="space-y-8">
                {study.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded flex items-center justify-center ${i === 0 ? "bg-tertiary/10" : "bg-primary/10"}`}>
                      <span className={`material-symbols-outlined ${i === 0 ? "text-tertiary" : "text-primary"}`}>
                        {i === 0 ? "trending_down" : "verified"}
                      </span>
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

      {/* ─── Content Sections: Bento Grid Approach ─── */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {/* The Challenge */}
          <div className="md:col-span-1 bg-surface-container p-8 rounded-lg border border-outline-variant/10">
            <span className="material-symbols-outlined text-error text-4xl mb-6">warning</span>
            <h2 className="font-headline text-2xl font-bold mb-4 text-white">The Challenge</h2>
            <p className="text-on-surface-variant leading-relaxed font-body">
              {study.challenge}
            </p>
          </div>
          {/* The Solution */}
          <div className="md:col-span-2 bg-surface-container-high p-8 rounded-lg relative overflow-hidden group border border-outline-variant/10">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-9xl">psychology</span>
            </div>
            <div className="relative z-10">
              <h2 className="font-headline text-2xl font-bold mb-4 text-primary">The {COMPANY.name} Solution</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <p className="text-on-surface-variant leading-relaxed font-body">
                  {study.solution}
                </p>
                <ul className="space-y-4 font-body">
                  {study.technologies.slice(0, 3).map((tech, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                      Developed with {tech}
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                    Automated Exception Handling
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Quantitative Results ─── */}
        <div className="mb-24">
          <h2 className="font-label text-xs tracking-[0.3em] uppercase text-center mb-12 opacity-50 text-white">
            Quantitative Results
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {study.results.map((result, index) => {
              const colors = ["text-tertiary", "text-primary", "text-secondary", "text-white"];
              return (
                <div key={index} className="text-center p-8 bg-surface-container-low border border-outline-variant/20 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform">
                  <div className={`text-5xl font-headline font-bold mb-2 ${colors[index % colors.length]}`}>
                    {result.metric}
                  </div>
                  <div className="text-xs font-label uppercase text-on-surface-variant">
                    {result.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Testimonial ─── */}
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 glass-panel rounded-2xl border border-tertiary/20 text-center shadow-[0_0_30px_rgba(88,231,171,0.05)]">
            <span className="material-symbols-outlined text-6xl text-tertiary/20 absolute -top-8 left-1/2 -translate-x-1/2 bg-surface px-4">
              format_quote
            </span>
            <blockquote className="text-2xl md:text-3xl font-headline italic text-white mb-8 leading-snug">
              "Biznexa didn't just provide a tool; they transformed our entire digital architecture. Their approach has set a new benchmark for what's possible."
            </blockquote>
            <div className="flex flex-col items-center">
              <img
                alt="Executive Portrait"
                className="w-16 h-16 rounded-full border-2 border-primary mb-4 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA39dAxR9YZVgFTIudq8UvVHpwyh4vL5FsGYdmOONfKAbAWFbmDBlgLQPZ0Ctl2q4Izf9z4uyzck6_whZbYOjBW2keOStaU9071r3jqs9K4Q8I2eO96_6iCudlne_fL6GWy282SLQ5RMxj8nKPx83DJi6cUHfL5Nkbbwj2BuNZDUD7IRSvmFIyFS_uZzYm4nHON2yAu0InYEpnmIm93vc8HnteJtx1qvAwHX7Ypf_pm_8KHvxyOEgwzQd_BIMPIYoB9JTofNsedXNwi"
              />
              <cite className="not-italic font-bold text-white font-headline tracking-wide">{study.client}</cite>
              <span className="text-sm text-on-surface-variant font-body">Executive Sponsor</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related Case Studies (Static Design Match) ─── */}
      <section className="bg-surface-container-low py-24 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <h3 className="font-headline text-3xl font-bold text-white tracking-tight">Related Case Studies</h3>
            <Link href="/case-studies" className="text-primary hover:text-white transition-colors font-label text-sm uppercase tracking-widest flex items-center gap-2">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/case-studies" className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg mb-6 aspect-video bg-surface-container-high border border-outline-variant/20 relative">
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500 z-10 mix-blend-overlay"></div>
                <img
                  alt="Case study 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxHqT2oPqWwJ6aYHsffnQ2NRB2SaV5X2rjORn7NxmtjzSpX7M_0vxVY8NgWoVmhqtwQt2zn3K6J1WcJ3gLBJYV8QMbvHajYjsWH6-UQe3X4x5-6Hvjm_rDzqR2ViexQ4eb0SE0QJ-zsC__1mk2251jYi8kChRXcE4-jRi7YFTQSNWPvDnIhJ6RQJK3nHA0GECgeehtxRDFry479COiGexfmcniP0lJP1cniZcL1zWZ1hXL_tpzev577IZ4gQbaK0QhhGkUR5eWHMKC"
                />
              </div>
              <span className="font-label text-xs text-primary uppercase tracking-widest font-bold">FinTech</span>
              <h4 className="font-headline text-xl font-bold mt-2 text-white group-hover:text-primary transition-colors">
                Algorithmic Risk Assessment
              </h4>
            </Link>

            <Link href="/case-studies" className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg mb-6 aspect-video bg-surface-container-high border border-outline-variant/20 relative">
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/20 transition-colors duration-500 z-10 mix-blend-overlay"></div>
                <img
                  alt="Case study 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCE6EY6e-REWanzm5V86o0yysbjCXynPzrvG9XAr1M4RT-kHbB1chXHx2o4IN36sEa9I1qyA5X8YFebfLNBMTFBPDsov4sIIkC5r906iuM-rVUdkmR_Kj1LRYYPjyWn_cFkzpOMo0enDaORtb0xlrXFn_F04BiYtktGbhmOzzMBdJ1yj3izpxa63ah6AK961CEmTAeP101AYnsTDkjTbQIrB18beFIX4IIHWEV0e1Mat-aqFWrrYa9GIpgZ7Ch6a3SkCzjYQNt9LFv"
                />
              </div>
              <span className="font-label text-xs text-secondary uppercase tracking-widest font-bold">Hardware</span>
              <h4 className="font-headline text-xl font-bold mt-2 text-white group-hover:text-secondary transition-colors">
                IoT Edge Node Integration
              </h4>
            </Link>

            <Link href="/case-studies" className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg mb-6 aspect-video bg-surface-container-high border border-outline-variant/20 relative">
                 <div className="absolute inset-0 bg-tertiary/0 group-hover:bg-tertiary/20 transition-colors duration-500 z-10 mix-blend-overlay"></div>
                <img
                  alt="Case study 3"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyOmAOx7_tiWDzPxfie3T4xRIZSUPKYydwaaq-T9pyeOQDozsFRWc0-GALxl1_UBKG_O3-O-2_jag7YJfkQEcsHg3q7HlGi1kMNF26rHu5-OM98kAe97aj3QYQbLYE7Bvvwkk_ZZcMluI6yzOVtVLkxGVtlPSNg6unrZbeMnXIOK-QXSacFdWOaZyWNxKEmh3s9DiWwmxHr4J6Q_aJpv_hpHExl2HhlWzH-ilxli_RSA0ARuuuVz1iKy-7kw4LXK2r8atJ_8WNRI_d"
                />
              </div>
              <span className="font-label text-xs text-tertiary uppercase tracking-widest font-bold">Manufacturing</span>
              <h4 className="font-headline text-xl font-bold mt-2 text-white group-hover:text-tertiary transition-colors">
                Predictive Maintenance Systems
              </h4>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
