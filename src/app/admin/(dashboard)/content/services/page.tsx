import ServicesContentClient from "@/components/admin/ServicesContentClient";
import { getServicesContent } from "@/lib/services";

export default async function ServicesContentPage() {
  const initialContent = await getServicesContent();

  return <ServicesContentClient initialContent={initialContent} />;
}
