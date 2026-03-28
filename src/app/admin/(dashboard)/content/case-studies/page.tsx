import CaseStudiesContentClient from "@/components/admin/CaseStudiesContentClient";
import { getAllCaseStudies } from "@/lib/case-studies";

export default async function CaseStudiesEditorPage() {
  const initialStudies = await getAllCaseStudies({ includeUnpublished: true });

  return <CaseStudiesContentClient initialStudies={initialStudies} />;
}
