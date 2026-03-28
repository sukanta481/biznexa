import ServicesPageClient from "@/components/public/ServicesPageClient";
import { getServicesContent } from "@/lib/services";

export default async function ServicesPage() {
  const content = await getServicesContent();

  return <ServicesPageClient content={content} />;
}
