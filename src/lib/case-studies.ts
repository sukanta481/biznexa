export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  category: string;
  excerpt: string;
  challenge: string;
  solution: string;
  results: { metric: string; label: string }[];
  technologies: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "ai-logistics-transformation",
    title: "AI-Powered Logistics Transformation",
    client: "GlobalFreight Solutions",
    category: "AI Automation",
    excerpt:
      "How we automated route optimization and reduced delivery costs by 35% using custom AI agents.",
    challenge:
      "GlobalFreight was spending 40+ hours per week on manual route planning across 200+ delivery vehicles. Their legacy system couldn't handle real-time traffic data or dynamic customer priorities.",
    solution:
      "We built a custom AI-powered route optimization engine that processes real-time traffic, weather, and priority data. The system auto-assigns deliveries, optimizes routes every 15 minutes, and provides a live dashboard for fleet managers.",
    results: [
      { metric: "35%", label: "Cost Reduction" },
      { metric: "40hrs", label: "Weekly Hours Saved" },
      { metric: "98.5%", label: "On-Time Delivery" },
      { metric: "2.5x", label: "Fleet Efficiency" },
    ],
    technologies: ["Python", "TensorFlow", "Next.js", "PostgreSQL", "Redis"],
  },
  {
    slug: "ecommerce-redesign",
    title: "E-Commerce Revenue Surge",
    client: "ArtisanCraft India",
    category: "Web Development",
    excerpt:
      "A complete platform redesign that increased conversion rates by 280% and reduced cart abandonment.",
    challenge:
      "ArtisanCraft's existing Shopify store had a 78% cart abandonment rate and page load times exceeding 8 seconds. Mobile users accounted for 70% of traffic but only 15% of conversions.",
    solution:
      "We rebuilt the entire platform on a headless commerce architecture with Next.js, achieving sub-2-second load times. We redesigned the checkout flow to 3 steps and implemented AI-powered product recommendations.",
    results: [
      { metric: "280%", label: "Conversion Increase" },
      { metric: "1.8s", label: "Page Load Time" },
      { metric: "45%", label: "Cart Abandonment Drop" },
      { metric: "₹2.1Cr", label: "Q1 Revenue" },
    ],
    technologies: ["Next.js", "Shopify Hydrogen", "Tailwind CSS", "Vercel"],
  },
  {
    slug: "seo-market-dominance",
    title: "From Page 5 to Page 1",
    client: "Zenith Legal Associates",
    category: "Digital Marketing",
    excerpt:
      "A comprehensive SEO overhaul that took a law firm from obscurity to the top of Google search results.",
    challenge:
      "Zenith Legal had no online presence despite being a reputable firm for 15 years. Their website was a basic WordPress template with no SEO optimization, ranking on page 5+ for all target keywords.",
    solution:
      "We executed a full technical SEO audit, rebuilt the site with proper schema markup, created a content strategy targeting 50+ keywords, and built a local SEO campaign with Google Business Profile optimization.",
    results: [
      { metric: "Page 1", label: "Google Ranking" },
      { metric: "520%", label: "Organic Traffic" },
      { metric: "34", label: "Keywords on Page 1" },
      { metric: "3x", label: "Client Inquiries" },
    ],
    technologies: ["Next.js", "Schema.org", "Google Analytics", "Ahrefs"],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}
