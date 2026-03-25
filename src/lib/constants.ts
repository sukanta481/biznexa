// ─── Company Information ───
export const COMPANY = {
  name: "BizNexa",
  tagline: "Digital Solutions Studio",
  fullName: "BizNexa — Digital Solutions Studio",
  description:
    "Architecting high-performance digital infrastructure for the next generation of global enterprises.",
  founder: "Sukanta Saha",
  founderTitle: "CEO & Founder",
  address: {
    street: "BB Cyber Plaza, Innovation District",
    area: "Salt Lake Sector V",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    zip: "700091",
    full: "BB Cyber Plaza, Innovation District, Salt Lake Sector V, Kolkata, West Bengal, India - 700091",
  },
  phone: "+91 89610 90050",
  email: "hello@biznexa.com",
  website: "https://biznexa.tech",
  whatsapp: "https://wa.me/918961090050",
  social: {
    linkedin: "https://linkedin.com/company/biznexa",
    twitter: "https://twitter.com/biznexa",
    behance: "https://behance.net/biznexa",
    instagram: "https://instagram.com/biznexa",
  },
} as const;

// ─── Navigation Links ───
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
] as const;

// ─── Services ───
export const SERVICES = [
  {
    title: "Custom Web Development",
    slug: "web-development",
    description:
      "Scalable, lightning-fast web applications built with the latest frameworks to give your business a competitive edge.",
    icon: "Globe",
  },
  {
    title: "AI & Workflow Automation",
    slug: "ai-automation",
    description:
      "Automate repetitive tasks and integrate AI agents that work 24/7 to boost your team's productivity.",
    icon: "Bot",
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description:
      "Intuitive, immersive user experiences that convert visitors into loyal customers through atmospheric design.",
    icon: "Palette",
  },
  {
    title: "Digital Marketing & SEO",
    slug: "digital-marketing",
    description:
      "Data-driven strategies to dominate search results and social feeds, ensuring your brand stays top-of-mind.",
    icon: "TrendingUp",
  },
] as const;

// ─── Process Steps ───
export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Detect",
    description:
      "We analyze your current website, competitors, and market to find what's working and what's not.",
  },
  {
    step: "02",
    title: "Plan",
    description:
      "We plan the project architecture, timeline, and deliverables based on your goals.",
  },
  {
    step: "03",
    title: "Design",
    description:
      "High-fidelity crafting of visual interfaces that balance aesthetic luxury with technical precision.",
  },
  {
    step: "04",
    title: "Deliver",
    description:
      "Deployment of robust, battle-tested solutions designed to perform under high-traffic market conditions.",
  },
] as const;

// ─── Strategic Pillars ───
export const STRATEGIC_PILLARS = [
  {
    title: "Scalable Web Development",
    description:
      "We build high-performance, future-ready digital infrastructures using modern frameworks that scale infinitely.",
    icon: "Layers",
  },
  {
    title: "AI-Driven Automation",
    description:
      "Streamlining complex workflows with bespoke AI solutions to maximize operational efficiency.",
    icon: "Cpu",
  },
  {
    title: "Digital Marketing & SEO",
    description:
      "Data-driven strategies to dominate search results and social feeds, ensuring your brand stays top-of-mind.",
    icon: "BarChart3",
  },
  {
    title: "Seamless API Integration",
    description:
      "Connecting your digital ecosystem with robust, secure, and high-speed integration layers for maximum data velocity.",
    icon: "Plug",
  },
] as const;

// ─── CTA Text ───
export const CTA_TEXT = "Book a Free Consultation" as const;

// ─── Footer Columns ───
export const FOOTER_NAV = {
  navigation: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
  ],
  capabilities: [
    { label: "Web Development", href: "/services#web-development" },
    { label: "AI Automation", href: "/services#ai-automation" },
    { label: "UI/UX Design", href: "/services#ui-ux-design" },
    { label: "Digital Marketing", href: "/services#digital-marketing" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;
