import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export const dynamic = 'force-dynamic';
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

export default async function BlogListingPage() {
  const posts = await getAllBlogPosts();
  // If we have posts, use the first one as featured, otherwise fall back
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const featuredImage = featuredPost?.coverImage ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuCiM9Oxq36ibZ9WYyBfDjv_J4NvliAAXKaTYVrzcZJfeosLOqS_Ljw546q6JD8dxUUW2U4XPgLgPOuutiCjLvwVGevNGYtMw0WhIBQk6-RtABRLt9IuW4oTD_1630t-C6CkM6UUk0588VHUVTF77GbOc-GJ8Jwfa3BrAWrO_7FFhj5OozkGwYH3EElucv67uioyT2mzVO5l67yFeebgAfH2kKluki2lnBjXbnsqgbhuYrHgkoK-ahktVJz87g6BYZjDKildhv_U-IQc";
  const featuredImageAlt = featuredPost?.coverImageAlt ?? featuredPost?.title ?? "Premium AI Visualization";

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: COMPANY.website },
          { name: "Blog", url: `${COMPANY.website}/blog` },
        ]}
      />

      <div className="pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16 md:space-y-24 md:mt-12">
        {/* ─── Featured Post Hero ─── */}
        <section className="relative group">
          <div className="hidden md:block absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass-panel rounded-xl md:rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-0 md:min-h-[500px] border border-primary/10 shadow-2xl md:shadow-none">
            <div className="lg:w-1/2 relative h-64 lg:h-auto">
              <img
                alt={featuredImageAlt}
                className="absolute inset-0 w-full h-full object-cover"
                src={featuredImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#060e20] md:from-background via-[#060e20]/40 md:via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4 md:hidden">
                <span className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-headline font-bold uppercase tracking-widest px-3 py-1 rounded">Featured Insight</span>
              </div>
            </div>
            <div className="lg:w-1/2 p-6 md:p-8 lg:p-16 flex flex-col justify-center space-y-4 md:space-y-6 bg-surface-container-high/40">
              <div className="hidden md:flex items-center gap-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest font-label bg-primary/20 rounded">
                  Featured Insight
                </span>
                <span className="text-sm opacity-60 font-body">
                  {featuredPost ? featuredPost.readTime : "12 Min Read"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant text-xs font-label md:hidden">
                <span>{featuredPost ? new Date(featuredPost.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase() : "MARCH 20, 2024"}</span>
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                <span>{featuredPost ? featuredPost.readTime?.toUpperCase() : "12 MIN READ"}</span>
              </div>
              <h1 className="text-3xl lg:text-6xl font-bold font-headline leading-tight text-white tracking-tight">
                {featuredPost ? (
                  <>
                    {featuredPost.title.split(' ').slice(0, 3).join(' ')}{" "}
                    <span className="text-primary">{featuredPost.title.split(' ').slice(3).join(' ')}</span>
                  </>
                ) : (
                  <>The Future of <span className="text-primary">AI</span> in Indian SMBs</>
                )}
              </h1>
              <p className="text-sm md:text-lg leading-relaxed text-on-surface-variant max-w-xl font-body">
                {featuredPost ? featuredPost.description : "Explore how localized AI solutions are transforming small to medium businesses across the subcontinent, from automated logistics to vernacular customer support."}
              </p>
              <div className="pt-2">
                <Link
                  href={featuredPost ? `/blog/${featuredPost.slug}` : "#"}
                  className="inline-flex items-center gap-2 text-primary font-bold font-label uppercase tracking-widest text-xs group/link hover:text-white transition-colors"
                >
                  READ FULL ARTICLE
                  <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Category Navigation & Grid ─── */}
        <section className="space-y-6 md:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary font-label md:font-label mb-0 md:mb-2">
                Knowledge Hub
              </h2>
              <h3 className="hidden md:block text-3xl font-bold font-headline text-white">Explore Categories</h3>
            </div>
            <div className="flex overflow-x-auto gap-3 scrollbar-hide md:flex-wrap">
              <button className="flex-none px-6 py-2.5 rounded-full bg-primary text-on-primary-fixed md:bg-primary/10 md:text-primary font-headline md:font-body text-xs font-bold md:font-medium shadow-[0_0_15px_rgba(88,231,171,0.3)] md:shadow-none md:glass-panel md:border md:border-primary transition-all">All Posts</button>
              <button className="flex-none px-6 py-2.5 rounded-full glass-panel text-on-surface-variant font-headline md:font-body text-xs font-medium md:border md:border-outline-variant/20 hover:bg-white/5 transition-all">Web Dev</button>
              <button className="flex-none px-6 py-2.5 rounded-full glass-panel text-on-surface-variant font-headline md:font-body text-xs font-medium md:border md:border-outline-variant/20 hover:bg-white/5 transition-all">AI Automation</button>
              <button className="flex-none px-6 py-2.5 rounded-full glass-panel text-on-surface-variant font-headline md:font-body text-xs font-medium md:border md:border-outline-variant/20 hover:bg-white/5 transition-all">Digital Marketing</button>
              <button className="flex-none px-6 py-2.5 rounded-full glass-panel text-on-surface-variant font-headline md:font-body text-xs font-medium md:border md:border-outline-variant/20 hover:bg-white/5 transition-all">Cloud Solutions</button>
            </div>
          </div>

          {/* Blog Grid — Mobile: horizontal cards, Desktop: vertical card grid */}
          {/* Mobile blog cards */}
          <div className="md:hidden space-y-6">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="glass-panel rounded-xl flex overflow-hidden shadow-lg h-40">
                    <div className="w-1/3 relative h-full">
                      <img
                        alt={post.title}
                        className="w-full h-full object-cover grayscale brightness-75"
                        src={post.coverImage ?? STITCH_IMAGES[index % STITCH_IMAGES.length]}
                      />
                    </div>
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-primary font-headline text-[10px] font-bold uppercase tracking-widest">{post.category}</span>
                        <h3 className="text-on-surface font-headline font-bold text-sm leading-snug line-clamp-2 mt-1">{post.title}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            alt={post.author}
                            className="w-5 h-5 rounded-full border border-primary/20"
                            src={post.authorImage ?? AUTHOR_IMAGE}
                          />
                          <span className="text-on-surface-variant text-[10px]">{post.author}</span>
                        </div>
                        <span className="text-on-surface-variant text-[10px]">{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-on-surface-variant font-body mb-4">No content modules deployed yet. Awaiting transmission.</p>
              </div>
            )}
          </div>

          {/* Desktop blog grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      src={post.coverImage ?? STITCH_IMAGES[index % STITCH_IMAGES.length]}
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
                          alt={post.author}
                          className="w-6 h-6 rounded-full border border-primary/30"
                          src={AUTHOR_IMAGE}
                        />
                        <span className="text-xs font-medium text-on-surface-variant font-body">By {post.author}</span>
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
            <div className="flex justify-center pt-4 md:pt-8">
              <button className="px-8 md:px-10 py-3 bg-primary text-on-primary-fixed font-bold font-headline md:font-label uppercase tracking-widest rounded-lg md:rounded-sm hover:brightness-110 transition-all active:scale-95 md:active:scale-100 flex items-center gap-2 shadow-lg shadow-primary/20 md:shadow-[0_0_20px_rgba(0,255,102,0.2)] md:hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] md:hover:scale-105 text-xs">
                Load More Articles
                <span className="material-symbols-outlined text-lg hidden md:inline">expand_more</span>
              </button>
            </div>
          )}
        </section>

        {/* ─── Newsletter CTA ─── */}
        <section className="relative py-12 md:mt-32 md:mb-12">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full translate-y-1/4 pointer-events-none hidden md:block"></div>
          <div className="relative glass-panel rounded-xl md:rounded-3xl p-8 md:p-12 lg:p-20 text-center space-y-6 md:space-y-8 border border-primary/20 md:border-primary/10 md:shadow-[0_0_40px_rgba(0,255,102,0.05)] md:bg-surface-container-high/50 overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-[60px] rounded-full md:hidden"></div>
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold font-headline text-white tracking-tight leading-tight">Stay Ahead of the Curve</h2>
              <p className="text-on-surface-variant text-sm md:text-lg font-body leading-relaxed">
                Weekly insights on technology, business growth, and digital transformation delivered straight to your inbox.
              </p>
            </div>
            <form className="max-w-md mx-auto space-y-4 md:space-y-0 md:flex md:flex-row md:gap-4">
              <input
                className="w-full md:flex-grow bg-surface-container-highest/50 md:bg-surface-container border-none md:border md:border-outline-variant/30 rounded-lg px-6 py-4 text-sm md:text-base focus:ring-1 focus:ring-primary/50 text-white font-body placeholder:text-outline/60 md:placeholder:text-on-surface-variant outline-none transition-all"
                placeholder="Enter your email address"
                type="email"
                required
              />
              <button
                className="w-full md:w-auto bg-primary text-on-primary-fixed font-bold font-headline md:font-label uppercase tracking-widest text-sm md:text-sm px-8 py-4 rounded-lg hover:brightness-110 transition-all active:scale-95 md:active:scale-100 whitespace-nowrap shadow-lg shadow-primary/20 md:shadow-[0_0_15px_rgba(0,255,102,0.2)]"
                type="submit"
              >
                Subscribe Now
              </button>
            </form>
            <p className="text-[10px] md:text-xs text-outline md:text-on-surface-variant italic md:not-italic font-body md:opacity-60">
              Subscribe for weekly insights on web development, AI automation, and digital marketing. No spam.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
