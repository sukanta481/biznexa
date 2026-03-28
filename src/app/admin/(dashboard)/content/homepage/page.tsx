import HomepageContentClient from "@/components/admin/HomepageContentClient";
import { getHomepageContent } from "@/lib/homepage";

export default async function HomepageContentPage() {
  const initialContent = await getHomepageContent();

  return <HomepageContentClient initialContent={initialContent} />;
}
