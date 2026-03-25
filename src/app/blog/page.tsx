import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { COMPANY } from "@/lib/constants";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Blog — Insights for the Digital Future | Biznexa",
  description:
    "Explore how localized AI solutions are transforming SMBs, along with the latest insights on web development and digital marketing.",
  openGraph: {
    title: "BizNexa Blog — Insights & News",
    description: "Insights on web development, AI automation, and digital strategy.",
  },
};

const STITCH_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDqjUkbztnBFTvFBA9Jk-GjdtMfdrNzumR8bq6t9lVdVrsZ04TWhFwu3mIHIaygvfVKnVSNbEXfceTGAJtfvMSap8Maq4J3SDwco8WcXNw3dJvGcXHK8d5gjoeMN6ZC9K4HOjoQWJurcabwquIeUR7fwaDXYfmHGYFG4ORK5A6-DDWe2woMCr4b0bGep2Qy4DcPnZGVXXlFjGe-SE3coZ7DWfAnhaEqWNMsr5GPqPaapG6kjsOYCPM-7dXfvXP591U2bo1buiftB327",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCotl3V0bE4jocEa40LkoEA2BcY6afyL80ps1iRP86uhfTDYzgJIwEZcFJAMvITvjOwLIifoePB3p1Zyk-3vWBd68U_oB53e4byEIsIGWtg2TTKUP0VFbE6R3DmSS3SzAe1WyQdsyBTVHD-iBPa2lxaHd4I0-_kI_3siiVIuOeg4Nhyy-p2Zh9taQ40QF83W_eyGZQmgTV_NR0GFzz0ihZ7fnaJKjm8a7UXVvvXRxbfwnKsMd7Bi7HND2Wi2MvA84yf3LQ946aOaTh3",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBG4D3jTsZNY0bRvY2H8_du6pWcDjR85pXc5Dha3RQwVfyPKgEJzSWUI4TX7BoFMgS9EknvNuIpd3ko78h22bmVM2_jB4SEmnBkDQfwQO8o_qPWTPbC2thFIndmDS2d3sV-T-GmvtLh8zROoQyBdu0vEPJoVaiOX06C-UtR9yL6UjcsB7hCkxqurUAt44nHTdOeAhxLAd3giZjRweVLfwEecOeV_UYRugE_63g_s3UVZugi9-X4pDW6-mDXkgGjqS2THIJLLGzu59V0"
];

const AUTHOR_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCR_6bd8GuWfs49lxyJtS9lnDuJGS4cLn9ft40MTuL7Eil1YIF1obwdhD6z_j61Pi_-bM64gDEKQjXnKVSMSGaHDCjEiqUQFUivmSjAXaXDokUg9GUyl0FbWf995neLwKOaejahPn-L5WW6vXGALuYOeUnQJeZxpoWDVPmSWDX_CFKJDElmO0185wALTgxgYdUq3DBveiA027ZDT-JMCd8z2GSduXG8uEo-seG3dMXvBlz-iQ4pZwT3qQFvkOCCVnzzpKSM8wzIHpsE";

export default function BlogListingPage() {
  const posts = getAllPosts();
  // If we have posts, use the first one as featured, otherwise fall back
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.length > 0 ? posts.slice(1) : [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: COMPANY.website },
          { name: "Blog", url: `${COMPANY.website}/blog` },
        ]}
      />

      <div className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-24 mt-12">
        {/* ─── Featured Post Hero ─── */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass-panel rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[500px] border border-primary/10">
            <div className="lg:w-1/2 relative h-64 lg:h-auto">
              {/* Clear Premium Image */}
              <img
                alt="Premium AI Visualization"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiM9Oxq36ibZ9WYyBfDjv_J4NvliAAXKaTYVrzcZJfeosLOqS_Ljw546q6JD8dxUUW2U4XPgLgPOuutiCjLvwVGevNGYtMw0WhIBQk6-RtABRLt9IuW4oTD_1630t-C6CkM6UUk0588VHUVTF77GbOc-GJ8Jwfa3BrAWrO_7FFhj5OozkGwYH3EElucv67uioyT2mzVO5l67yFeebgAfH2kKluki2lnBjXbnsqgbhuYrHgkoK-ahktVJz87g6BYZjDKildhv_U-IQc"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
            </div>
            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center space-y-6 bg-surface-container-high/40">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest font-label bg-primary/20 rounded">
                  Featured Insight
                </span>
                <span className="text-sm opacity-60 font-body">
                  {featuredPost ? featuredPost.readTime : "12 Min Read"}
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold font-headline leading-tight text-on-surface text-white">
                {featuredPost ? (
                  <>
                    {featuredPost.title.split(' ').slice(0, 3).join(' ')}{" "}
                    <span className="text-primary">{featuredPost.title.split(' ').slice(3).join(' ')}</span>
                  </>
                ) : (
                  <>The Future of <span className="text-primary">AI</span> in Indian SMBs</>
                )}
              </h1>
              <p className="text-lg leading-relaxed text-on-surface-variant max-w-xl font-body">
                {featuredPost ? featuredPost.description : "Explore how localized AI solutions are transforming small to medium businesses across the subcontinent, from automated logistics to vernacular customer support."}
              </p>
              <div className="pt-4">
                <Link
                  href={featuredPost ? `/blog/${featuredPost.slug}` : "#"}
                  className="inline-flex items-center gap-2 text-primary font-bold font-label uppercase tracking-wider group/link hover:text-white transition-colors"
                >
                  Read Full Article
                  <span className="material-symbols-outlined group-hover/link:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Category Navigation & Grid ─── */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary font-label mb-2">
                Knowledge Hub
              </h2>
              <h3 className="text-3xl font-bold font-headline text-white">Explore Categories</h3>
            </div>
            <div className="flex flex-wrap gap-3 font-body">
              <button className="px-6 py-2 rounded-full glass-panel border border-primary text-primary font-medium transition-all bg-primary/10">All Posts</button>
              <button className="px-6 py-2 rounded-full glass-panel border border-outline-variant/20 hover:bg-white/5 transition-all text-on-surface-variant text-sm">Web Dev</button>
              <button className="px-6 py-2 rounded-full glass-panel border border-outline-variant/20 hover:bg-white/5 transition-all text-on-surface-variant text-sm">AI Automation</button>
              <button className="px-6 py-2 rounded-full glass-panel border border-outline-variant/20 hover:bg-white/5 transition-all text-on-surface-variant text-sm">Digital Marketing</button>
              <button className="px-6 py-2 rounded-full glass-panel border border-outline-variant/20 hover:bg-white/5 transition-all text-on-surface-variant text-sm">Cloud Solutions</button>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <article
                  key={post.slug}
                  className="glass-panel rounded-2xl overflow-hidden flex flex-col hover:-translate-y-2 transition-transform duration-300 group border border-outline-variant/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={STITCH_IMAGES[index % STITCH_IMAGES.length]}
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-surface-container-highest/90 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-8 flex-grow flex flex-col space-y-4 bg-surface-container-low/50">
                    <h4 className="text-xl font-bold font-headline text-white leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-on-surface-variant line-clamp-3 font-body">
                      {post.description}
                    </p>
                    <div className="pt-4 mt-auto flex items-center justify-between border-t border-outline-variant/10">
                      <div className="flex items-center gap-3">
                        <img
                          alt="Author"
                          className="w-6 h-6 rounded-full border border-primary/30"
                          src={AUTHOR_IMAGE}
                        />
                        <span className="text-xs font-medium text-on-surface-variant font-body">By Sukanta Saha</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary font-bold font-label text-xs uppercase tracking-widest inline-flex items-center gap-1 group/btn hover:text-white transition-colors"
                      >
                        Read{" "}
                        <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                          chevron_right
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-on-surface-variant font-body mb-4">No content modules deployed yet. Awaiting transmission.</p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {posts.length > 0 && (
            <div className="flex justify-center pt-8">
              <button className="px-10 py-3 bg-primary text-on-primary-fixed font-bold font-label uppercase tracking-widest rounded-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] hover:scale-105">
                Load More Articles
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
            </div>
          )}
        </section>

        {/* ─── Newsletter CTA ─── */}
        <section className="relative mt-32 mb-12">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full translate-y-1/4 pointer-events-none"></div>
          <div className="relative glass-panel rounded-3xl p-12 lg:p-20 text-center space-y-8 border border-primary/10 shadow-[0_0_40px_rgba(0,255,102,0.05)] bg-surface-container-high/50">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold font-headline text-white tracking-tight">Stay Ahead of the Curve</h2>
              <p className="text-on-surface-variant text-lg font-body leading-relaxed">
                Weekly insights on technology, business growth, and digital transformation delivered straight to your inbox.
              </p>
            </div>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                className="flex-grow bg-surface-container border border-outline-variant/30 rounded-lg px-6 py-4 focus:ring-1 focus:ring-primary/50 text-white font-body placeholder:text-on-surface-variant outline-none transition-all"
                placeholder="Enter your email address"
                type="email"
                required
              />
              <button
                className="bg-primary text-on-primary-fixed font-bold font-label uppercase tracking-widest text-sm px-8 py-4 rounded-lg hover:brightness-110 transition-all whitespace-nowrap shadow-[0_0_15px_rgba(0,255,102,0.2)]"
                type="submit"
              >
                Subscribe Now
              </button>
            </form>
            <p className="text-xs text-on-surface-variant font-body opacity-60">
              Subscribe for weekly insights on web development, AI automation, and digital marketing. No spam.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
