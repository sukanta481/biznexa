import CaseStudiesContentClient from "@/components/admin/CaseStudiesContentClient";
import { getAllCaseStudies, getClientDirectoryNames } from "@/lib/case-studies";

export default async function CaseStudiesEditorPage() {
  const [initialStudies, clientDirectory] = await Promise.all([
    getAllCaseStudies({ includeUnpublished: true }),
    getClientDirectoryNames(),
  ]);

  return <CaseStudiesContentClient initialStudies={initialStudies} clientDirectory={clientDirectory} />;
}
