import AboutPageClient from "@/components/public/AboutPageClient";
import { getAboutContent } from "@/lib/about";

export default async function AboutPage() {
  const content = await getAboutContent();

  return <AboutPageClient content={content} />;
}
