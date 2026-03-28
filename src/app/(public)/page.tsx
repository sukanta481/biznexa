import HomepageClient from "@/components/public/HomepageClient";
import { getHomepageContent } from "@/lib/homepage";

export default async function Home() {
  const content = await getHomepageContent();

  return <HomepageClient content={content} />;
}
