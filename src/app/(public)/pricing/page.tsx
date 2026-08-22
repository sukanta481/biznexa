import PricingPlansSection from "@/components/ui/pricing-plans-section";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Website & AI Automation Pricing | BizNexa",
  description:
    "Transparent one-time INR pricing for websites, CMS, SEO and AI automation. Compare the Starter, Growth and Scale plans and see exactly what each one includes.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <main className="pt-20">
      <PricingPlansSection />
    </main>
  );
}
