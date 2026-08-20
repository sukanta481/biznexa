import AboutPageClient from "@/components/public/AboutPageClient";
import { getAboutContent } from "@/lib/about";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About BizNexa | Digital Studio in Kolkata, India",
  description:
    "Founded by Sukanta Saha, BizNexa is a Kolkata studio building web platforms and AI automation for small and mid-sized businesses. Meet the team behind the work.",
  path: "/about",
});

export default async function AboutPage() {
  const content = await getAboutContent();

  return <AboutPageClient content={content} />;
}
