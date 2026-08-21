import ServicesPageClient from "@/components/public/ServicesPageClient";
import { getServicesContent } from "@/lib/services";
import { pageMeta } from "@/lib/seo";
import { ServiceSchema } from "@/components/seo/JsonLd";
import { SERVICES } from "@/lib/constants";

export const metadata = pageMeta({
  title: "Web Development & AI Automation Services | BizNexa",
  description:
    "Custom web development, AI workflow automation, UI/UX design and SEO from a Kolkata studio. Most builds ship in 2-4 weeks. Book a free scoping call today.",
  path: "/services",
});

export default async function ServicesPage() {
  const content = await getServicesContent();

  return (
    <>
      {SERVICES.map((service) => (
        <ServiceSchema
          key={service.slug}
          name={service.title}
          description={service.description}
        />
      ))}
      <ServicesPageClient content={content} />
    </>
  );
}
