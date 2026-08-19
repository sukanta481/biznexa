import HomepageClient from "@/components/public/HomepageClient";
import { getCaseStudyTestimonials } from "@/lib/case-studies";
import { getHomepageContent } from "@/lib/homepage";

// Testimonials come from real case studies, so this page must not be frozen
// into the build — a new case study should appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, caseStudyTestimonials] = await Promise.all([
    getHomepageContent(),
    // A database hiccup here must not take the homepage down; fall back to the
    // testimonials configured in Content Manage.
    getCaseStudyTestimonials().catch(() => []),
  ]);

  // Real client quotes win over the configured placeholders. When no case study
  // carries a quote yet, the configured ones still show.
  const testimonials = caseStudyTestimonials.length > 0 ? caseStudyTestimonials : content.testimonials;

  return <HomepageClient content={{ ...content, testimonials }} />;
}
