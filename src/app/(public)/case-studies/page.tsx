import CaseStudiesPageClient from "@/components/public/CaseStudiesPageClient";
import { getAllCaseStudies } from "@/lib/case-studies";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Client Case Studies & Results | BizNexa",
  description:
    "Real BizNexa client projects: logistics CMS platforms, community websites and agency builds, with the measured results each one delivered. Explore the work.",
  path: "/case-studies",
});

// Case studies are CMS-managed, so this page must not be frozen into the build.
// Without this it prerenders as static HTML and anything added later stays
// invisible until the next deploy. Matches the blog listing.
export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const studies = await getAllCaseStudies();

  return <CaseStudiesPageClient studies={studies} />;
}
