import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog";
import { COMPANY } from "@/lib/constants";
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/JsonLd";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | ${COMPANY.name} Insights`,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

const AUTHOR_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBcAgfjfM0b9ZmUPskFcDH5B_VQkgrGwsRgZo1msG7yFDn08VQVWV2mhECd_NNc4VYb2VLqA6TNvDH7xFhxRHAa4e_vF1rSSnyiy-w2rz-1XaX5Uw5KYcSmkhUsPre8lrp_05DZ5yPaoEJSg3UJXtvLgeKbgD4dB7C_fNcc7cNAKVtrflAVNHD0ayy0P6DSU1bvwov_dP6JQUNS5GJV3UWofr8wkfILAv7OwDjIEdWjzAz1nub9DxxS8-kIMytFpX3yOdGNM7TmpGrb";

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type SubHeadingProps = ComponentPropsWithoutRef<"h3">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type OrderedListProps = ComponentPropsWithoutRef<"ol">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type StrongProps = ComponentPropsWithoutRef<"strong">;
type QuoteProps = ComponentPropsWithoutRef<"blockquote">;
type LinkProps = ComponentPropsWithoutRef<"a">;
type TableProps = ComponentPropsWithoutRef<"table">;
type TableHeaderProps = ComponentPropsWithoutRef<"th">;
type TableCellProps = ComponentPropsWithoutRef<"td">;

// Custom MDX Components for matching the design system
const mdxComponents = {
  h2: (props: HeadingProps) => (
    <h2 className="font-headline text-3xl font-bold text-white mb-6 mt-12 tracking-tight" {...props} />
  ),
  h3: (props: SubHeadingProps) => (
    <h3 className="font-headline text-2xl font-bold text-white mb-4 mt-8" {...props} />
  ),
  p: (props: ParagraphProps) => (
    <p className="mb-6 first-of-type:first-letter:text-5xl first-of-type:first-letter:font-headline first-of-type:first-letter:text-primary first-of-type:first-letter:mr-3 first-of-type:first-letter:float-left text-on-surface-variant font-body leading-relaxed text-lg" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className="list-disc list-inside space-y-3 mb-6 text-on-surface-variant text-lg leading-relaxed marker:text-primary font-body" {...props} />
  ),
  ol: (props: OrderedListProps) => (
    <ol className="list-decimal list-inside space-y-3 mb-6 text-on-surface-variant text-lg leading-relaxed marker:text-primary font-body" {...props} />
  ),
  li: (props: ListItemProps) => <li className="pl-2" {...props} />,
  strong: (props: StrongProps) => <strong className="font-bold text-white" {...props} />,
  blockquote: (props: QuoteProps) => (
    <div className="glass-panel my-12 p-10 rounded-lg relative overflow-hidden border-r-4 border-r-tertiary">
      <span className="material-symbols-outlined absolute -top-4 -left-2 text-8xl text-primary/10 select-none">format_quote</span>
      <blockquote className="relative z-10 font-headline text-2xl md:text-3xl font-medium text-white leading-snug" {...props}>
        {props?.children}
      </blockquote>
    </div>
  ),
  a: (props: LinkProps) => (
    <a className="text-primary hover:text-tertiary transition-colors border-b border-primary/30 hover:border-tertiary" target={props.href?.startsWith("http") ? "_blank" : "_self"} {...props} />
  ),
  table: (props: TableProps) => (
    <div className="overflow-x-auto mb-8 rounded-lg border border-outline-variant/30 bg-surface-container-low max-w-full">
      <table className="w-full text-left border-collapse" {...props} />
    </div>
  ),
  th: (props: TableHeaderProps) => (
    <th className="p-4 text-sm font-label uppercase tracking-widest text-white border-b border-outline-variant/30" {...props} />
  ),
  td: (props: TableCellProps) => (
    <td className="p-4 text-sm text-on-surface-variant border-b border-outline-variant/30 font-body" {...props} />
  ),
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${COMPANY.website}/blog/${post.slug}`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: COMPANY.website },
          { name: "Blog", url: `${COMPANY.website}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      <ArticleSchema
        title={post.title}
        description={post.description}
        datePublished={post.date}
        author={post.author}
        url={postUrl}
      />

      {/* ─── Hero Section — Mobile ─── */}
      <header className="md:hidden px-6 mb-12 mt-24">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-8">
          <img
            alt="Future of AI"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7ffkI_HOf7ReVFogp_FYUqoHrikhdH2nmvJK2zHqKXxRf3j9czdQ2Vn21cC848Z0hFERhjl_xDaA1A189pD8m1vFVOrx7CnWJ9Zyvh5gQED0o3JrTQcGomJQGChhJqqrxI-0sDSovyenIxIsumDoLO5RgIfjoysuxx1NJO4HJ5W5AWxdi1ytyK71LmvHPu2zm-iBocZThLXQEq4YSUlwYjqCvXTRShYNEkvwlAGLkoIzSWvHtJfkio88Ob86EMFy0-l_LmMxI_xqv"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
          <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-lg border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-headline uppercase tracking-widest text-tertiary bg-tertiary/10 px-2 py-0.5 rounded">{post.category}</span>
              <span className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant">{post.readTime}</span>
            </div>
            <h1 className="text-xl font-headline font-bold text-on-surface leading-tight tracking-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </header>

      {/* ─── Hero Section — Desktop ─── */}
      <header className="hidden md:flex relative w-full h-[716px] items-end overflow-hidden mb-16 mt-20">
        <div className="absolute inset-0 z-0">
          <img
            alt="Future of AI"
            className="w-full h-full object-cover opacity-40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7ffkI_HOf7ReVFogp_FYUqoHrikhdH2nmvJK2zHqKXxRf3j9czdQ2Vn21cC848Z0hFERhjl_xDaA1A189pD8m1vFVOrx7CnWJ9Zyvh5gQED0o3JrTQcGomJQGChhJqqrxI-0sDSovyenIxIsumDoLO5RgIfjoysuxx1NJO4HJ5W5AWxdi1ytyK71LmvHPu2zm-iBocZThLXQEq4YSUlwYjqCvXTRShYNEkvwlAGLkoIzSWvHtJfkio88Ob86EMFy0-l_LmMxI_xqv"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full pb-16">
          <div className="glass-panel p-8 md:p-12 rounded-xl border-l-4 border-l-primary max-w-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] bg-surface-container-high/60">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6 font-label uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Blog
            </Link>
            <div className="flex items-center gap-4 mb-6 mt-4">
              <span className="font-label text-[10px] tracking-[0.2em] uppercase py-1 px-3 bg-primary/20 text-primary border border-primary/30 rounded-full">
                {post.category}
              </span>
              <span className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">
                {post.readTime}
              </span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight text-white">
              {post.title}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 overflow-hidden">
                  <img alt={post.author} className="w-full h-full object-cover" src={AUTHOR_IMG} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white font-body">{post.author}</p>
                  <p className="text-xs text-on-surface-variant font-label uppercase tracking-wider">Author</p>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant/30"></div>
              <p className="text-sm text-on-surface-variant font-label uppercase tracking-wider">
                {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-[44px]">
        {/* ─── Article Content ─── */}
        <article className="lg:col-span-8 max-w-[800px] text-on-surface-variant text-base md:text-lg leading-relaxed w-full">
          {/* Mobile author info */}
          <div className="flex items-center gap-3 mb-10 text-on-surface-variant md:hidden">
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-primary/20 flex items-center justify-center overflow-hidden">
              <img alt={post.author} className="w-full h-full object-cover" src={AUTHOR_IMG} />
            </div>
            <div className="text-xs font-body">
              <p className="font-bold text-on-surface leading-none mb-1">{post.author}</p>
              <p className="opacity-70 leading-none">Published {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            </div>
          </div>

          <MDXRemote source={post.content} components={mdxComponents} />

          {/* Author Bio Box */}
          <div className="mt-16 p-6 md:p-8 glass-panel rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 border border-outline-variant/20 shadow-[0_0_20px_rgba(0,0,0,0.3)] bg-surface-container-high/40">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
              <img alt={post.author} className="w-full h-full object-cover" src={AUTHOR_IMG} />
            </div>
            <div className="flex-grow text-left md:text-left">
              <h4 className="font-headline text-base md:text-xl font-bold text-white mb-1 md:mb-2">{post.author}</h4>
              <p className="text-primary text-xs font-headline uppercase tracking-widest mb-2 md:hidden">Chief Digital Architect</p>
              <p className="text-on-surface-variant text-sm mb-4 leading-relaxed font-body">
                Pioneering digital excellence through innovative web solutions and intelligent automation for growing enterprises.
              </p>
              <div className="flex gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/10">
                <a className="text-primary hover:text-tertiary transition-colors" href="#"><span className="material-symbols-outlined text-xl">link</span></a>
                <a className="text-primary hover:text-tertiary transition-colors" href="#"><span className="material-symbols-outlined text-xl">alternate_email</span></a>
                <a className="text-primary hover:text-tertiary transition-colors" href="#"><span className="material-symbols-outlined text-xl">terminal</span></a>
              </div>
            </div>
          </div>
        </article>

        {/* ─── Sidebar (desktop only) ─── */}
        <aside className="hidden lg:block lg:col-span-4 pl-0 lg:pl-10 border-t lg:border-t-0 lg:border-l border-outline-variant/10 space-y-10 pt-10 lg:pt-0">
          {/* Book a Call CTA */}
          <div className="p-8 rounded-xl border border-primary/40 bg-surface-container-high/60 shadow-[0_0_30px_rgba(88,231,171,0.05)]">
            <h3 className="font-headline text-xl font-bold text-white mb-4">Transform Your Business</h3>
            <p className="text-sm text-on-surface-variant mb-6 font-body">Need a custom AI roadmap for your enterprise? Our experts are ready to build with you.</p>
            <Link
              href="/contact"
              className="block text-center w-full py-4 bg-primary text-on-primary-fixed font-label font-bold uppercase tracking-widest text-xs rounded-sm shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:scale-[1.02] transition-transform"
            >
              Book a Discovery Call
            </Link>
          </div>
          {/* Categories */}
          <div>
            <h4 className="font-label text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-6 flex items-center gap-3">
              Categories <div className="h-px flex-1 bg-outline-variant/30"></div>
            </h4>
            <ul className="space-y-4 font-body">
              <li>
                <Link href="/blog" className="flex justify-between items-center group text-on-surface-variant hover:text-primary transition-colors">
                  <span className="font-headline text-sm uppercase">Cloud Solutions</span>
                  <span className="text-[11px] font-bold py-1 px-3 bg-primary text-on-primary-fixed rounded-full shadow-[0_0_10px_rgba(0,255,102,0.2)]">12</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="flex justify-between items-center group text-on-surface-variant hover:text-primary transition-colors">
                  <span className="font-headline text-sm uppercase">Digital Strategy</span>
                  <span className="text-[11px] font-bold py-1 px-3 bg-primary text-on-primary-fixed rounded-full shadow-[0_0_10px_rgba(0,255,102,0.2)]">08</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="flex justify-between items-center group text-on-surface-variant hover:text-primary transition-colors">
                  <span className="font-headline text-sm uppercase">Cyber Security</span>
                  <span className="text-[11px] font-bold py-1 px-3 bg-primary text-on-primary-fixed rounded-full shadow-[0_0_10px_rgba(0,255,102,0.2)]">15</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="relative group mt-12">
            <div className="absolute -inset-1 bg-primary/10 rounded-3xl blur opacity-25"></div>
            <div className="relative glass-panel p-8 rounded-xl border-t border-primary/20 space-y-6 bg-surface-container-high/40">
              <div>
                <h4 className="font-headline text-lg font-bold text-white mb-2">Stay Ahead of the Curve</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed font-body">Weekly insights on technology, growth, and digital transformation.</p>
              </div>
              <div className="space-y-4">
                <input
                  className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 text-white placeholder:text-outline outline-none transition-all"
                  placeholder="Enter your email address"
                  type="email"
                />
                <button className="w-full py-3 bg-primary text-on-primary-fixed font-label font-bold uppercase tracking-widest text-xs rounded-lg hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,255,102,0.2)]">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Mobile Newsletter ─── */}
      <section className="lg:hidden mt-20 px-6 py-20 bg-surface-container-lowest border-y border-outline-variant/10">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-tertiary">mail</span>
          <h3 className="font-headline font-bold text-lg uppercase tracking-tight">Insights Loop</h3>
        </div>
        <p className="text-sm text-on-surface-variant font-body mb-8 leading-relaxed">
          Get the latest digital architecture blueprints and strategic insights delivered to your terminal weekly.
        </p>
        <div className="flex flex-col gap-3">
          <input
            className="bg-surface-container border-none text-on-surface text-sm font-label tracking-wider placeholder:text-outline-variant rounded-md py-4 px-4 focus:ring-1 focus:ring-primary/30 transition-all outline-none"
            placeholder="ENTER TERMINAL EMAIL"
            type="email"
          />
          <button className="bg-primary text-on-primary-fixed font-headline font-bold text-sm py-4 uppercase tracking-widest rounded-md hover:brightness-110 transition-colors shadow-[0_4px_12px_rgba(0,255,102,0.2)]">
            Subscribe
          </button>
        </div>
      </section>

      {/* ─── Related Insights ─── */}
      <section className="mt-20 md:mt-24 pt-20 md:pt-24 border-t border-outline-variant/10 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Mobile header */}
          <h3 className="md:hidden font-headline font-bold text-xl text-on-surface mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-primary rounded-full"></span>
              Related Insights
            </div>
            <div className="flex items-center gap-2 text-[10px] text-tertiary uppercase tracking-widest opacity-80">
              <span className="material-symbols-outlined text-sm">swipe_left</span>
              Swipe
            </div>
          </h3>
          {/* Desktop header */}
          <div className="hidden md:flex justify-between items-end mb-12">
            <h2 className="font-headline text-4xl font-bold tracking-tighter text-white">
              Related <span className="text-secondary">Insights</span>
            </h2>
            <Link href="/blog" className="text-primary hover:text-white transition-colors font-label text-sm uppercase tracking-widest flex items-center gap-2">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-8">
              <Link href="/blog" className="block group flex-shrink-0 w-[85vw] snap-center">
                <div className="flex flex-col h-full rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/10">
                  <div className="aspect-video w-full overflow-hidden">
                    <img alt="Security" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnG37EZ0BPfXw_gbA1Ew-mZpKMFnOVQRwXU0QTaTP7l0Gwoj_yiV7r4BAuXrjhie93ECwY3tXR_d91K0DL45IJWzRCTH-eHBAic-pAkkwZkND0lVuAaAMy3K9zy27PgMDZ7nT-VyazcsN3qFhUIVruuTbxOR0I78HLX23jmqJP_bHYsDEoz5B5JIYdW4ZqwTwDlXASlvmDvOX1sS7QlEVEHQAsgRuzCwC2a7xiHgm1-Q37yUCD0kp9KRRMJOvNgjQzWurWtGu_0_rm" />
                  </div>
                  <div className="p-5 glass-panel h-full">
                    <span className="text-[10px] font-headline text-primary uppercase tracking-widest mb-2 block">Security</span>
                    <h4 className="font-headline font-bold text-base leading-snug text-on-surface">Securing the Edge: Future Proofing Infrastructure</h4>
                    <p className="text-xs text-on-surface-variant mt-4">8 Min Read &bull; Oct 12, 2024</p>
                  </div>
                </div>
              </Link>
              <Link href="/blog" className="block group flex-shrink-0 w-[85vw] snap-center">
                <div className="flex flex-col h-full rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/10">
                  <div className="aspect-video w-full overflow-hidden">
                    <img alt="Cloud" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdtzqnsrfPwkXy8nrMSOmzAH5GHVhurIdR3pHKWWHvJe__kHkMocgzajrsu739uQnCfJ3KEAiuGwn-YEf8NGXl1SuxQvBi-4LKGtXph-yrr0cxlgsTPECO84NnCe6LMjm2LFvgGWLedS17enTSMiLHIJTlqCtVURmfKtvQHDFsro--E4OQE3Nnj5TxJHOwdlMwxkZj7VzozNfDNbWMbtdP7gOU751AIJgrTqQliW4Qh6bupjX0L7sipa_tRhBqnmjetAHsUIKDe4L5" />
                  </div>
                  <div className="p-5 glass-panel h-full">
                    <span className="text-[10px] font-headline text-primary uppercase tracking-widest mb-2 block">Cloud</span>
                    <h4 className="font-headline font-bold text-base leading-snug text-on-surface">Serverless Architecture: Scale Without Limits</h4>
                    <p className="text-xs text-on-surface-variant mt-4">15 Min Read &bull; Oct 08, 2024</p>
                  </div>
                </div>
              </Link>
              <Link href="/blog" className="block group flex-shrink-0 w-[85vw] snap-center">
                <div className="flex flex-col h-full rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/10">
                  <div className="aspect-video w-full overflow-hidden">
                    <img alt="Hardware" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKqT-HVYzbgqhKZXMyR09xkSIrd9qS6BYTkvCpe80ZZ8XPg_OZ5yB2OZxug3yAVngVmq4o3YOAShS55yaJQ5koSzpI8Bt_MIsfHRUujDIicyOVKcFGTr7Tq8QDfx3nG1d-C33QjfIBsVMgV3jUbg00UILKFxSEaWGRD3xIzZ1MwSxsK2XpdoFEX1WgswZuJzjeIrbXbXtHj5qkxIKaiDwI9zMTqA0ZRxmLvaRD3c3_p1X-MyfhVaTQEP8Ogam5glqTsQr1FPVfYzWQ" />
                  </div>
                  <div className="p-5 glass-panel h-full">
                    <span className="text-[10px] font-headline text-tertiary uppercase tracking-widest mb-2 block">Hardware</span>
                    <h4 className="font-headline font-bold text-base leading-snug text-on-surface">The Silicon Shift: India&apos;s New Chip Economy</h4>
                    <p className="text-xs text-on-surface-variant mt-4">10 Min Read &bull; Sep 29, 2024</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex justify-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="w-2 h-2 rounded-full bg-outline-variant/30"></span>
              <span className="w-2 h-2 rounded-full bg-outline-variant/30"></span>
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 items-stretch">
            <Link href="/blog" className="glass-panel border-outline-variant/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] group cursor-pointer overflow-hidden rounded-xl flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 bg-surface-container-high/40">
              <div className="aspect-video overflow-hidden">
                <img alt="Security" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnG37EZ0BPfXw_gbA1Ew-mZpKMFnOVQRwXU0QTaTP7l0Gwoj_yiV7r4BAuXrjhie93ECwY3tXR_d91K0DL45IJWzRCTH-eHBAic-pAkkwZkND0lVuAaAMy3K9zy27PgMDZ7nT-VyazcsN3qFhUIVruuTbxOR0I78HLX23jmqJP_bHYsDEoz5B5JIYdW4ZqwTwDlXASlvmDvOX1sS7QlEVEHQAsgRuzCwC2a7xiHgm1-Q37yUCD0kp9KRRMJOvNgjQzWurWtGu_0_rm" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <span className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary mb-4 block font-bold">Security</span>
                <h3 className="font-headline text-xl font-bold text-white leading-tight mb-4 group-hover:text-primary transition-colors">Securing the Edge: Future Proofing Infrastructure</h3>
                <div className="mt-auto flex items-center gap-2 text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold">
                  <span>8 Min Read</span>
                  <div className="w-1 h-1 bg-outline-variant/50 rounded-full"></div>
                  <span>Oct 12</span>
                </div>
              </div>
            </Link>
            <Link href="/blog" className="glass-panel border-outline-variant/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] group cursor-pointer overflow-hidden rounded-xl flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 bg-surface-container-high/40">
              <div className="aspect-video overflow-hidden">
                <img alt="Cloud" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdtzqnsrfPwkXy8nrMSOmzAH5GHVhurIdR3pHKWWHvJe__kHkMocgzajrsu739uQnCfJ3KEAiuGwn-YEf8NGXl1SuxQvBi-4LKGtXph-yrr0cxlgsTPECO84NnCe6LMjm2LFvgGWLedS17enTSMiLHIJTlqCtVURmfKtvQHDFsro--E4OQE3Nnj5TxJHOwdlMwxkZj7VzozNfDNbWMbtdP7gOU751AIJgrTqQliW4Qh6bupjX0L7sipa_tRhBqnmjetAHsUIKDe4L5" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <span className="font-label text-[10px] tracking-[0.2em] uppercase text-primary mb-4 block font-bold">Cloud</span>
                <h3 className="font-headline text-xl font-bold text-white leading-tight mb-4 group-hover:text-primary transition-colors">Serverless Architecture: Scale Without Limits</h3>
                <div className="mt-auto flex items-center gap-2 text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold">
                  <span>15 Min Read</span>
                  <div className="w-1 h-1 bg-outline-variant/50 rounded-full"></div>
                  <span>Oct 08</span>
                </div>
              </div>
            </Link>
            <Link href="/blog" className="glass-panel border-outline-variant/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] group cursor-pointer overflow-hidden rounded-xl flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 bg-surface-container-high/40">
              <div className="aspect-video overflow-hidden">
                <img alt="Hardware" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKqT-HVYzbgqhKZXMyR09xkSIrd9qS6BYTkvCpe80ZZ8XPg_OZ5yB2OZxug3yAVngVmq4o3YOAShS55yaJQ5koSzpI8Bt_MIsfHRUujDIicyOVKcFGTr7Tq8QDfx3nG1d-C33QjfIBsVMgV3jUbg00UILKFxSEaWGRD3xIzZ1MwSxsK2XpdoFEX1WgswZuJzjeIrbXbXtHj5qkxIKaiDwI9zMTqA0ZRxmLvaRD3c3_p1X-MyfhVaTQEP8Ogam5glqTsQr1FPVfYzWQ" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <span className="font-label text-[10px] tracking-[0.2em] uppercase text-tertiary mb-4 block font-bold">Hardware</span>
                <h3 className="font-headline text-xl font-bold text-white leading-tight mb-4 group-hover:text-primary transition-colors">The Silicon Shift: India&apos;s New Chip Economy</h3>
                <div className="mt-auto flex items-center gap-2 text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold">
                  <span>10 Min Read</span>
                  <div className="w-1 h-1 bg-outline-variant/50 rounded-full"></div>
                  <span>Sep 29</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
