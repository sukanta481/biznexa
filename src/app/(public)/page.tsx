import HomepageClient from "@/components/public/HomepageClient";
import { getCaseStudyTestimonials } from "@/lib/case-studies";
import { getHomepageContent } from "@/lib/homepage";
import { getSiteSettings } from "@/lib/site-settings";
import { pageMeta } from "@/lib/seo";
import { LocalBusinessSchema, FAQSchema } from "@/components/seo/JsonLd";

export const metadata = pageMeta({
  title: "Web Development & AI Automation Agency | BizNexa",
  description:
    "BizNexa builds custom web applications, AI workflow automation and UI/UX design for growing businesses in India. See our client results and book a free call.",
  path: "/",
});

// Testimonials come from real case studies, so this page must not be frozen
// into the build — a new case study should appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, caseStudyTestimonials, settings] = await Promise.all([
    getHomepageContent(),
    // A database hiccup here must not take the homepage down; fall back to the
    // testimonials configured in Content Manage.
    getCaseStudyTestimonials().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  // Real client quotes win over the configured placeholders. When no case study
  // carries a quote yet, the configured ones still show.
  const testimonials = caseStudyTestimonials.length > 0 ? caseStudyTestimonials : content.testimonials;

  // Site Settings is the single source of truth for contact details, matching
  // what the footer already does. The CTA's own stored values remain as a
  // fallback for when Site Settings has not been filled in.
  const cta = {
    ...content.cta,
    email: settings?.siteEmail || content.cta.email,
    phone: settings?.sitePhone || content.cta.phone,
  };

  return (
    <>
      <LocalBusinessSchema />
      <FAQSchema faqs={content.faqs} />
      <HomepageClient content={{ ...content, testimonials, cta }} />
    </>
  );
}
