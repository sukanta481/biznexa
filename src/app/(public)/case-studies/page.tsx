import CaseStudiesPageClient from "@/components/public/CaseStudiesPageClient";
import { getAllCaseStudies } from "@/lib/case-studies";

export default async function CaseStudiesPage() {
  const studies = await getAllCaseStudies();

  return <CaseStudiesPageClient studies={studies} />;
}
