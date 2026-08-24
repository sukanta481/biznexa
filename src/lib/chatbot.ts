import { COMPANY, PROCESS_STEPS } from "@/lib/constants";

export type ChatbotLink = { label: string; href: string };

export type ChatbotReply = {
  /** Bubble text. Newlines are preserved by the widget. */
  text: string;
  /** Quick-reply chips rendered under the bubble. */
  suggestions: string[];
  /** Deep links rendered as buttons under the bubble. */
  links: ChatbotLink[];
  /** "lead-form" tells the widget to open its inline contact form. */
  action?: "lead-form";
};

/**
 * Plan facts mirrored from `src/components/ui/pricing-plans-section.tsx`.
 * Update both when pricing changes — the bot must never quote a stale number.
 */
const PLANS = [
  { name: "Starter", price: "₹8,999", delivery: "5–7 days", support: "20 days" },
  { name: "Growth", price: "₹14,999", delivery: "10–14 days", support: "30 days" },
  { name: "Scale", price: "₹25,999+", delivery: "25–30 days", support: "45 days" },
] as const;

const DEFAULT_SUGGESTIONS = [
  "What services do you offer?",
  "How much does a website cost?",
  "How long does a project take?",
  "Talk to the team",
];

const LINK_SERVICES: ChatbotLink = { label: "See all services", href: "/services" };
const LINK_PRICING: ChatbotLink = { label: "View pricing", href: "/pricing" };
const LINK_CONTACT: ChatbotLink = { label: "Contact page", href: "/contact" };
const LINK_WORK: ChatbotLink = { label: "Case studies", href: "/case-studies" };

type Intent = {
  id: string;
  /** Single words match whole tokens; multi-word entries match as phrases. */
  keywords: string[];
  reply: ChatbotReply;
};

const INTENTS: Intent[] = [
  {
    id: "greeting",
    keywords: ["hi", "hey", "hello", "yo", "namaste", "good morning", "good afternoon", "good evening"],
    reply: {
      text: `Hi! I'm Nexa, the ${COMPANY.name} assistant.\nAsk me about our services, pricing or timelines — or I can hand you straight to the team.`,
      suggestions: DEFAULT_SUGGESTIONS,
      links: [],
    },
  },
  {
    id: "capabilities",
    keywords: ["what can you do", "who are you", "are you a bot", "are you human", "help me"],
    reply: {
      text: "I'm a small assistant trained on this site. I can explain what we build, what it costs, how long it takes, and how we work — and I can pass your details to the team whenever you're ready.",
      suggestions: DEFAULT_SUGGESTIONS,
      links: [],
    },
  },
  {
    id: "plan-details",
    keywords: [
      "starter", "growth", "scale", "included", "what s included", "whats included",
      "difference between", "compare", "which plan",
    ],
    reply: {
      text: `${PLANS[0].name} (${PLANS[0].price}) is a 5-page template build with basic CMS and on-page SEO.\n${PLANS[1].name} (${PLANS[1].price}) adds custom UI/UX, full technical SEO with schema, a FAQ AI bot and AI lead capture.\n${PLANS[2].name} (${PLANS[2].price}) is unlimited pages, premium custom design, a headless CMS with a custom dashboard and an advanced AI agent.`,
      suggestions: ["How long does a project take?", "What about support?", "Book a free consultation"],
      links: [LINK_PRICING, LINK_CONTACT],
    },
  },
  {
    id: "pricing",
    keywords: [
      "price", "pricing", "cost", "costs", "budget", "rate", "rates", "charge", "charges",
      "fees", "quote", "how much", "plan", "plans", "package", "packages",
    ],
    reply: {
      text: `Website builds are one-time INR pricing:\n• ${PLANS[0].name} — ${PLANS[0].price}, up to 5 pages\n• ${PLANS[1].name} — ${PLANS[1].price}, custom design, FAQ AI bot and AI lead capture\n• ${PLANS[2].name} — ${PLANS[2].price}, unlimited pages and an advanced AI agent\n\nAutomation builds, SEO retainers and custom platforms are quoted after a short scoping call.`,
      suggestions: ["What's included in Growth?", "How long does a project take?", "Book a free consultation"],
      links: [LINK_PRICING, LINK_CONTACT],
    },
  },
  {
    id: "timeline",
    keywords: [
      "how long", "timeline", "time line", "delivery", "deliver", "duration", "deadline",
      "turnaround", "how fast", "how soon", "when can you",
    ],
    reply: {
      text: `From content handoff:\n• ${PLANS[0].name} — ${PLANS[0].delivery}\n• ${PLANS[1].name} — ${PLANS[1].delivery}\n• ${PLANS[2].name} — ${PLANS[2].delivery}\n\nAutomation and custom platform work is scoped per workflow — usually 2 to 6 weeks.`,
      suggestions: ["How much does it cost?", "How do you work?", "Book a free consultation"],
      links: [LINK_PRICING],
    },
  },
  {
    id: "web-development",
    keywords: [
      "website", "web site", "web development", "webapp", "web app", "landing page",
      "ecommerce", "e commerce", "online store", "cms", "wordpress",
    ],
    reply: {
      text: "We build fast, scalable sites and web apps — custom UI, headless or WordPress CMS, technical SEO baked in, and 90+ speed scores on the Growth and Scale plans.",
      suggestions: ["How much does a website cost?", "What tech do you use?", "Book a free consultation"],
      links: [{ label: "Web development", href: "/services#web-development" }, LINK_PRICING],
    },
  },
  {
    id: "ai-automation",
    keywords: [
      "ai", "automation", "automate", "chatbot", "chat bot", "bot", "agent", "agents",
      "workflow", "workflows", "n8n", "integration", "integrations", "api",
    ],
    reply: {
      text: "We build AI agents and workflow automations — support and lead-capture bots (like this one), CRM and WhatsApp integrations, and automations that clear repetitive back-office work 24/7.",
      suggestions: ["Can you build a bot like this?", "How much does automation cost?", "Book a free consultation"],
      links: [{ label: "AI & automation", href: "/services#ai-automation" }, LINK_CONTACT],
    },
  },
  {
    id: "design",
    keywords: ["design", "ui", "ux", "ui ux", "user experience", "redesign", "branding", "figma", "prototype"],
    reply: {
      text: "UI/UX is where most of our projects start — research, wireframes, high-fidelity design and motion, handed over as a build-ready system rather than a flat mockup.",
      suggestions: ["Can I see your work?", "How much does a redesign cost?", "Book a free consultation"],
      links: [{ label: "UI/UX design", href: "/services#ui-ux-design" }, LINK_WORK],
    },
  },
  {
    id: "marketing",
    keywords: ["seo", "marketing", "google", "ranking", "rank", "traffic", "ads", "social media", "leads"],
    reply: {
      text: "Digital marketing and SEO: technical SEO and schema, Core Web Vitals, content strategy, and GA4 dashboards so you can see what each channel actually returns.",
      suggestions: ["How much does it cost?", "How long does a project take?", "Book a free consultation"],
      links: [{ label: "Digital marketing", href: "/services#digital-marketing" }],
    },
  },
  {
    id: "services",
    keywords: ["service", "services", "what do you do", "what do you build", "offer", "offerings", "capabilities"],
    reply: {
      text: "Four things: custom web development, AI & workflow automation, UI/UX design, and digital marketing & SEO.\nWhich one are you exploring?",
      suggestions: ["Web development", "AI automation", "UI/UX design", "SEO & marketing"],
      links: [LINK_SERVICES],
    },
  },
  {
    id: "process",
    keywords: ["process", "how do you work", "how it works", "steps", "workflow process", "approach", "methodology"],
    reply: {
      text: `Four steps — ${PROCESS_STEPS.map((step) => step.title).join(" → ")}.\nWe audit where you are, plan the architecture and timeline, design the interface, then ship and support it.`,
      suggestions: ["How long does a project take?", "How much does it cost?", "Book a free consultation"],
      links: [],
    },
  },
  {
    id: "support",
    keywords: ["support", "maintenance", "maintain", "after launch", "warranty", "bug", "bugs", "retainer"],
    reply: {
      text: `Every build ships with post-launch support — ${PLANS[0].support} on ${PLANS[0].name}, ${PLANS[1].support} on ${PLANS[1].name}, ${PLANS[2].support} on ${PLANS[2].name}. After that we offer monthly retainers for hosting, updates and iteration.`,
      suggestions: ["View pricing", "Talk to the team"],
      links: [LINK_PRICING],
    },
  },
  {
    id: "tech",
    keywords: ["tech", "stack", "technology", "technologies", "next js", "nextjs", "react", "framework", "hosting", "aws"],
    reply: {
      text: "Mostly Next.js, React and TypeScript on the front end, Node and MySQL behind it, headless or WordPress CMS depending on the plan, deployed on AWS. We pick the stack around your team, not the other way round.",
      suggestions: ["Can I see your work?", "Book a free consultation"],
      links: [LINK_WORK],
    },
  },
  {
    id: "work",
    keywords: ["case study", "case studies", "portfolio", "your work", "examples", "clients", "projects", "previous work"],
    reply: {
      text: "Yes — our case studies walk through the problem, the build and the result for each project.",
      suggestions: ["What services do you offer?", "Book a free consultation"],
      links: [LINK_WORK],
    },
  },
  {
    id: "blog",
    keywords: ["blog", "article", "articles", "insights", "resources", "guides"],
    reply: {
      text: "We publish notes on web performance, AI automation and SEO on the blog.",
      suggestions: ["What services do you offer?", "Talk to the team"],
      links: [{ label: "Read the blog", href: "/blog" }],
    },
  },
  {
    id: "location",
    keywords: ["where", "location", "address", "office", "based", "city", "kolkata", "india", "remote"],
    reply: {
      text: `We're based at ${COMPANY.address.full}, ${COMPANY.address.state}, and work with clients remotely across India and abroad.`,
      suggestions: ["Talk to the team", "Book a free consultation"],
      links: [LINK_CONTACT],
    },
  },
  {
    id: "about",
    keywords: ["about", "about you", "your company", "founder", "team", "who runs", "experience", "history"],
    reply: {
      text: `${COMPANY.fullName}. Founded by ${COMPANY.founder} (${COMPANY.founderTitle}), we build digital infrastructure for businesses that need it to actually perform.`,
      suggestions: ["What services do you offer?", "Can I see your work?"],
      links: [{ label: "About us", href: "/about" }, LINK_WORK],
    },
  },
  {
    id: "contact",
    keywords: [
      "contact", "reach", "email", "phone", "call", "number", "whatsapp", "talk to a human",
      "talk to the team", "talk to someone", "speak to", "human", "sales", "support team",
    ],
    reply: {
      text: `Happy to connect you.\n📞 ${COMPANY.phone}\n✉️ ${COMPANY.email}\nOr message us on WhatsApp — usually the fastest.`,
      suggestions: ["Book a free consultation"],
      links: [LINK_CONTACT, { label: "Chat on WhatsApp", href: COMPANY.whatsapp }],
    },
  },
  {
    id: "lead",
    keywords: [
      "book", "booking", "consultation", "consult", "hire", "get started", "start a project",
      "new project", "demo", "meeting", "schedule", "appointment", "proposal", "work with you",
      "work together", "enquiry", "inquiry",
    ],
    reply: {
      text: "Great — leave your details and the team will get back to you, usually within one working day.",
      suggestions: [],
      links: [],
      action: "lead-form",
    },
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank you", "thankyou", "thx", "appreciate it", "great", "awesome", "perfect"],
    reply: {
      text: "Anytime. Anything else I can dig up for you?",
      suggestions: DEFAULT_SUGGESTIONS,
      links: [],
    },
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "see you", "later", "that's all", "thats all", "nothing else"],
    reply: {
      text: "Thanks for stopping by. We're on WhatsApp and email whenever you need us.",
      suggestions: ["Book a free consultation"],
      links: [{ label: "Chat on WhatsApp", href: COMPANY.whatsapp }],
    },
  },
];

const FALLBACK: ChatbotReply = {
  text: "I don't have a good answer for that one yet — but the team does. Want to leave your details, or ask me about services, pricing or timelines?",
  suggestions: ["What services do you offer?", "How much does a website cost?", "Book a free consultation"],
  links: [LINK_CONTACT, { label: "Chat on WhatsApp", href: COMPANY.whatsapp }],
};

/** Lowercases and reduces everything that isn't a letter or digit to a single space. */
function normalize(input: string): string {
  return ` ${input.toLowerCase().replace(/[^a-z0-9₹]+/g, " ").trim()} `;
}

/**
 * Longer keyword phrases score higher, so "how much" beats a stray "much" and a
 * three-word phrase outranks a single generic token.
 */
function scoreIntent(intent: Intent, padded: string): number {
  let score = 0;

  for (const keyword of intent.keywords) {
    const words = keyword.split(" ");
    if (padded.includes(` ${keyword} `)) {
      score += words.length * 2;
    } else if (words.length > 1 && padded.includes(keyword)) {
      score += words.length;
    }
  }

  return score;
}

/** Deterministic, site-grounded answer for a visitor message. */
export function getChatbotReply(message: string): ChatbotReply {
  const padded = normalize(message);

  if (!padded.trim()) {
    return FALLBACK;
  }

  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    const score = scoreIntent(intent, padded);
    // Ties keep the earlier (more specific) intent.
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }

  return best ? best.reply : FALLBACK;
}

/** Opening bubble shown when the panel is first opened. */
export function getChatbotGreeting(): ChatbotReply {
  return {
    text: `Hi 👋 I'm Nexa, the ${COMPANY.name} assistant.\nAsk me about what we build, what it costs, or how fast we ship.`,
    suggestions: DEFAULT_SUGGESTIONS,
    links: [],
  };
}
