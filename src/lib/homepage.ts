import "server-only";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { isMissingDatabaseConfigError, query } from "@/lib/db";

interface SettingRow extends RowDataPacket {
  setting_key: string;
  setting_value: string | null;
}

interface TableRow extends RowDataPacket {
  table_name: string;
}

interface ColumnRow extends RowDataPacket {
  Field: string;
}

export interface HomepageStat {
  value: string;
  label: string;
}

export interface HomepageService {
  eyebrow: string;
  icon: string;
  title: string;
  description: string;
  imageUrl?: string | null;
}

export interface HomepageMarker {
  icon: string;
  label: string;
}

export interface HomepageTestimonial {
  initials: string;
  name: string;
  company: string;
  quote: string;
}

export interface HomepageFaq {
  question: string;
  answer: string;
}

export interface HomepageContent {
  hero: {
    badgeText: string;
    leadText: string;
    accentText: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  stats: HomepageStat[];
  servicesIntro: {
    heading: string;
    description: string;
  };
  services: HomepageService[];
  globalReach: {
    heading: string;
    backgroundImage: string;
    markers: HomepageMarker[];
  };
  testimonialsIntro: {
    heading: string;
    mobileDescription: string;
  };
  testimonials: HomepageTestimonial[];
  faqIntro: {
    heading: string;
  };
  faqs: HomepageFaq[];
  cta: {
    heading: string;
    mobileDescription: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    email: string;
    phone: string;
    whatsappIconUrl: string;
  };
}

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  hero: {
    badgeText: "Your Digital Solutions Studio",
    leadText: "WE ENGINEER",
    accentText: "DIGITAL SYSTEMS THAT SCALE",
    description: "We build high-performance websites and AI-driven automation that transform your operations.",
    primaryCtaLabel: "BOOK A CALL",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "VIEW PORTFOLIO",
    secondaryCtaHref: "/case-studies",
  },
  stats: [
    { value: "50+", label: "Projects Delivered" },
    { value: "100%", label: "Growth Rate" },
    { value: "24/7", label: "AI Monitoring" },
    { value: "15+", label: "Global Clients" },
  ],
  servicesIntro: {
    heading: "OUR CORE SERVICES",
    description: "We provide end-to-end digital excellence through a blend of engineering precision and strategic marketing.",
  },
  services: [
    {
      eyebrow: "01 / Engineering",
      icon: "code",
      title: "CUSTOM WEB DEVELOPMENT",
      description: "Scalable, lightning-fast web applications built with the latest frameworks to give your business a competitive edge.",
      imageUrl: null,
    },
    {
      eyebrow: "02 / Automation",
      icon: "smart_toy",
      title: "AI & WORKFLOW AUTOMATION",
      description: "Automate repetitive tasks and integrate AI agents that work 24/7 to boost your team's productivity.",
      imageUrl: null,
    },
    {
      eyebrow: "03 / Experience",
      icon: "blur_on",
      title: "UI/UX DESIGN",
      description: "Intuitive, immersive user experiences that convert visitors into loyal customers through atmospheric design.",
      imageUrl: null,
    },
    {
      eyebrow: "04 / Growth",
      icon: "trending_up",
      title: "DIGITAL MARKETING & SEO",
      description: "Data-driven strategies to dominate search results and social feeds, ensuring your brand stays top-of-mind.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbaJ3uUeQDxCdMogzbo0N9SxMVu8VvGAX7KfQD7a21hK0nay82z77RHhLQh1NFhB3LR_JjHsSUkbTBLuvhIugTPYntGDwohQ4DB-_lIXG0OVdGxXqFj1GOvGrxhgIcXUdcsUX3pibUYoQCS8bJKSh6E1MwcLjjCm0jaLG_ohPvTIkaLCRoOzAdSFeKTcoG76UalJVe7Ah92bgsrp16BsP_PJ1I5egKXHbzBCjj4hSEdJd7CuYW4NG5JY0Q2nfV3UKhiZpoiYtjGzBY",
    },
  ],
  globalReach: {
    heading: "SERVING BUSINESSES ACROSS INDIA & BEYOND",
    backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7v72RwlUG4-gPEjoCcbKG84e-pU6IYdjPRyzNxBGplKogCgwd0OEJk806x8WUbsnGu8ikYYSWn-P8YLQKyJPjPC5sUvKZVZehvTRKdATMIqbsFSzGnIgdGn0fefGxvhmome4FM2jkk0H0lJY8KDMUZ15EgUfv2FPk3ovD9t4WCfBsfQzMf5rnt2H8MBscud1XwMTFPbfKW_I2i5zp8eLt8AbFmo4STAIPipEvI2ixSdH9bHHTMkz8tyZnjGsIH5M83w-N3a-Gjhck",
    markers: [
      { icon: "location_on", label: "Kolkata HQ" },
      { icon: "public", label: "Global Nodes" },
    ],
  },
  testimonialsIntro: {
    heading: "CLIENT SUCCESS STORIES",
    mobileDescription: "What our engineering partners say",
  },
  testimonials: [
    {
      initials: "AK",
      name: "Amit Kumar",
      company: "Founder, TECHSPRINT (SaaS)",
      quote: "Biznexa transformed our manual sales process into a fully automated lead-gen machine. Our ROI tripled in just 3 months.",
    },
    {
      initials: "SR",
      name: "Sonia Roy",
      company: "Marketing Director, LUXMEDIA",
      quote: "The website they built for us isn't just a site; it's a high-performance engine. The UI design is years ahead of our competitors.",
    },
    {
      initials: "MD",
      name: "M. Das",
      company: "CEO, GLOBAL LOGISTICS",
      quote: "Professional, technical, and visionary. Their AI solutions saved us over 40 hours of manual data entry per week.",
    },
  ],
  faqIntro: {
    heading: "Frequently Asked Questions",
  },
  faqs: [
    {
      question: "How long does a website take to build?",
      answer: "A typical corporate website takes 2-4 weeks, while complex web applications with AI integrations can take 6-12 weeks depending on the technical requirements.",
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes, we offer monthly retainers for hosting, security, performance monitoring, and content updates to ensure your digital assets run flawlessly.",
    },
    {
      question: "What does AI automation cost?",
      answer: "Our AI workflow automation starts at custom entry points depending on the complexity of your current infrastructure. We conduct a free audit to determine exact ROI-driven costs.",
    },
    {
      question: "Can you handle my digital marketing too?",
      answer: "Absolutely. We are a full-stack digital studio. Once your platform is built, our growth team can run data-driven SEO and Ads campaigns to drive targeted traffic.",
    },
  ],
  cta: {
    heading: "READY TO SCALE YOUR BUSINESS?",
    mobileDescription: "Schedule a free audit session with our engineers today. No fluff, just technical clarity.",
    primaryLabel: "BOOK A FREE CONSULTATION",
    primaryHref: "/contact",
    secondaryLabel: "VIEW PORTFOLIO",
    secondaryHref: "/case-studies",
    email: "hello@biznexa.tech",
    phone: "+91 98765 43210",
    whatsappIconUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZMFQEYWHXHwq0ys7NmfKsFUAuPUhzqxvrzFlgL15TtiUbnExZpG9-Bd6Awk28L8Bn_ILAfo78IX3mUF12nIY9AHVR6ILkQB1BT7rdjSrobEE6rXcHHQdCUbhLbSnl6vx8y27HpvMMHxJ0XS6rRNfoZFm6Ts7ZJUOXCYzl8UzgwXHLOUNdVnGCOzhcS6uiU5Agj7zH1gr0hZImElZdd1R_e3ioVsOHjBY9wOsY0dUCaUrA7Jf80KtUiDsURMnOsXetptDLw5Gl6zlZ",
  },
};

const HOMEPAGE_SETTING_KEYS = {
  hero: "homepage_hero",
  stats: "homepage_stats",
  servicesIntro: "homepage_services_intro",
  services: "homepage_services",
  globalReach: "homepage_global_reach",
  testimonialsIntro: "homepage_testimonials_intro",
  testimonials: "homepage_testimonials",
  faqIntro: "homepage_faq_intro",
  faqs: "homepage_faqs",
  cta: "homepage_cta",
} as const;

function isSchemaMismatchError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "ER_BAD_FIELD_ERROR" || error.code === "ER_NO_SUCH_TABLE")
  );
}

function isDatabaseConnectivityError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    ["ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT"].includes(error.code)
  );
}

function shouldUseFallback(error: unknown) {
  return (
    isSchemaMismatchError(error) ||
    isMissingDatabaseConfigError(error) ||
    isDatabaseConnectivityError(error)
  );
}

async function hasSettingsTable() {
  const rows = await query<TableRow[]>(
    `
      SELECT TABLE_NAME AS table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name = 'settings'
      LIMIT 1
    `,
  );

  return rows.length > 0;
}

function parseJsonSetting<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function toSettingEntries(content: HomepageContent) {
  return [
    {
      key: HOMEPAGE_SETTING_KEYS.hero,
      value: JSON.stringify(content.hero),
      type: "json",
      description: "Homepage hero content",
    },
    {
      key: HOMEPAGE_SETTING_KEYS.stats,
      value: JSON.stringify(content.stats),
      type: "json",
      description: "Homepage stat cards",
    },
    {
      key: HOMEPAGE_SETTING_KEYS.servicesIntro,
      value: JSON.stringify(content.servicesIntro),
      type: "json",
      description: "Homepage services section intro",
    },
    {
      key: HOMEPAGE_SETTING_KEYS.services,
      value: JSON.stringify(content.services),
      type: "json",
      description: "Homepage service cards",
    },
    {
      key: HOMEPAGE_SETTING_KEYS.globalReach,
      value: JSON.stringify(content.globalReach),
      type: "json",
      description: "Homepage global reach section",
    },
    {
      key: HOMEPAGE_SETTING_KEYS.testimonialsIntro,
      value: JSON.stringify(content.testimonialsIntro),
      type: "json",
      description: "Homepage testimonials intro",
    },
    {
      key: HOMEPAGE_SETTING_KEYS.testimonials,
      value: JSON.stringify(content.testimonials),
      type: "json",
      description: "Homepage testimonials",
    },
    {
      key: HOMEPAGE_SETTING_KEYS.faqIntro,
      value: JSON.stringify(content.faqIntro),
      type: "json",
      description: "Homepage FAQ intro",
    },
    {
      key: HOMEPAGE_SETTING_KEYS.faqs,
      value: JSON.stringify(content.faqs),
      type: "json",
      description: "Homepage FAQ entries",
    },
    {
      key: HOMEPAGE_SETTING_KEYS.cta,
      value: JSON.stringify(content.cta),
      type: "json",
      description: "Homepage CTA section",
    },
  ];
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    if (!(await hasSettingsTable())) {
      return DEFAULT_HOMEPAGE_CONTENT;
    }

    const keys = Object.values(HOMEPAGE_SETTING_KEYS);
    const placeholders = keys.map(() => "?").join(", ");
    const rows = await query<SettingRow[]>(
      `
        SELECT setting_key, setting_value
        FROM settings
        WHERE setting_key IN (${placeholders})
      `,
      [...keys],
    );

    const settingMap = new Map(rows.map((row) => [row.setting_key, row.setting_value]));

    return {
      hero: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.hero), DEFAULT_HOMEPAGE_CONTENT.hero),
      stats: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.stats), DEFAULT_HOMEPAGE_CONTENT.stats),
      servicesIntro: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.servicesIntro), DEFAULT_HOMEPAGE_CONTENT.servicesIntro),
      services: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.services), DEFAULT_HOMEPAGE_CONTENT.services),
      globalReach: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.globalReach), DEFAULT_HOMEPAGE_CONTENT.globalReach),
      testimonialsIntro: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.testimonialsIntro), DEFAULT_HOMEPAGE_CONTENT.testimonialsIntro),
      testimonials: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.testimonials), DEFAULT_HOMEPAGE_CONTENT.testimonials),
      faqIntro: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.faqIntro), DEFAULT_HOMEPAGE_CONTENT.faqIntro),
      faqs: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.faqs), DEFAULT_HOMEPAGE_CONTENT.faqs),
      cta: parseJsonSetting(settingMap.get(HOMEPAGE_SETTING_KEYS.cta), DEFAULT_HOMEPAGE_CONTENT.cta),
    };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    return DEFAULT_HOMEPAGE_CONTENT;
  }
}

export async function saveHomepageContent(content: HomepageContent) {
  const entries = toSettingEntries(content);
  const columns = await query<ColumnRow[]>("SHOW COLUMNS FROM settings");
  const hasUpdatedBy = columns.some((column) => column.Field === "updated_by");
  const valuePlaceholder = hasUpdatedBy ? "(?, ?, ?, ?, NULL)" : "(?, ?, ?, ?)";

  await query<ResultSetHeader>(
    `
      INSERT INTO settings (setting_key, setting_value, setting_type, description${hasUpdatedBy ? ", updated_by" : ""})
      VALUES ${entries.map(() => valuePlaceholder).join(", ")}
      ON DUPLICATE KEY UPDATE
        setting_value = VALUES(setting_value),
        setting_type = VALUES(setting_type),
        description = VALUES(description)
    `,
    entries.flatMap((entry) => [entry.key, entry.value, entry.type, entry.description]),
  );
}
