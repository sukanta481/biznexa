import AboutContentClient from "@/components/admin/AboutContentClient";
import { getAboutContent } from "@/lib/about";

export default async function AboutUsContentPage() {
  const initialContent = await getAboutContent();

  return <AboutContentClient initialContent={initialContent} />;
}
