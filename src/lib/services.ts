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

export interface ServicesProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
  accent: "primary" | "secondary" | "tertiary";
  surface: "glass" | "solid";
}

export interface ServicesMobileCard {
  title: string;
  icon: string;
  imageUrl: string;
  imageAlt: string;
  bullets: string[];
  buttonLabel: string;
  buttonHref: string;
}

export interface ServicesDesktopCard {
  title: string;
  icon: string;
  description: string;
  bullets: string[];
  accent: "primary" | "secondary" | "tertiary";
}

export interface ServicesContent {
  hero: {
    badgeText: string;
    mobileHeadlineLead: string;
    mobileHeadlinePrimary: string;
    mobileHeadlineAccent: string;
    desktopHeadline: string;
    description: string;
    highlights: string[];
    imageUrl: string;
    imageAlt: string;
  };
  workflow: {
    heading: string;
    steps: ServicesProcessStep[];
  };
  mobileServices: {
    heading: string;
    cards: ServicesMobileCard[];
  };
  desktopSidebar: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    description: string;
    highlights: string[];
  };
  desktopServices: ServicesDesktopCard[];
  cta: {
    mobileLead: string;
    mobileAccent: string;
    desktopHeading: string;
    buttonLabel: string;
    buttonHref: string;
  };
}

const SERVICES_SETTING_KEYS = {
  hero: "services_hero",
  workflow: "services_workflow",
  mobileServices: "services_mobile_cards",
  desktopSidebar: "services_desktop_sidebar",
  desktopServices: "services_desktop_cards",
  cta: "services_cta",
} as const;

export const DEFAULT_SERVICES_CONTENT: ServicesContent = {
  hero: {
    badgeText: "Services & Process",
    mobileHeadlineLead: "We build websites,",
    mobileHeadlinePrimary: "websites",
    mobileHeadlineAccent: "workflows",
    desktopHeadline:
      "We build websites, automate workflows with AI, and run digital marketing that brings in leads.",
    description:
      "We build websites, automate business workflows with AI, and run digital marketing that brings in leads. Here's how we do it.",
    highlights: [
      "50+ Websites Delivered",
      "Custom AI Workflows",
      "Full-Stack Development",
    ],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBLiRYDHhVr--MjSFKvE2rFRlYWDp32K-MP2zPI5fVtqElcNiL_esnyBaAGhSHRtkkg5SvD5xn71GaGlKo3WxeVRNnWkuoy_J07d09U793lQvB-HDuLtACeLEZKV-UQ_3OJTrTvztp_zDe57H2VCVp2mHLgA8DDgF4PUgtHMNcr9gMobsQJ3NRnYL7Rg1zCIS8gjdSoL_gV0T-xZVIHJmXPBVIuN_e86p9txi8UTcN6l7qemCCxjglOr3ISorVqR1D9Z7toT-vyLnO",
    imageAlt: "Biznexa Digital Environment",
  },
  workflow: {
    heading: "The Workflow",
    steps: [
      {
        number: "01",
        title: "Detect",
        description:
          "We analyze your current website, competitors, and market to find what's working and what's not.",
        icon: "search",
        accent: "primary",
        surface: "glass",
      },
      {
        number: "02",
        title: "Plan",
        description:
          "We plan the project architecture, timeline, and deliverables based on your goals.",
        icon: "architecture",
        accent: "secondary",
        surface: "solid",
      },
      {
        number: "03",
        title: "Design",
        description:
          "High-fidelity crafting of visual interfaces that balance aesthetic luxury with technical precision.",
        icon: "draw",
        accent: "tertiary",
        surface: "glass",
      },
      {
        number: "04",
        title: "Deliver",
        description:
          "Deployment of robust, battle-tested solutions designed to perform under high-traffic market conditions.",
        icon: "rocket_launch",
        accent: "primary",
        surface: "solid",
      },
    ],
  },
  mobileServices: {
    heading: "Our Services",
    cards: [
      {
        title: "Web Development",
        icon: "lan",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA-3uicma6HYl1jHJZkkk4ghh37cPeOgzBJ0KXxFfe5xj8OP07GjstS5VktEUdnpYuSyk3AN7P2yg6km93xeoWYKieDBajxZnN9oKRhrv3nj86UovWxiKJuF1RUjzRQfF_vW136clpTs1_o0DC8O82tLXSpQVvnkiWg68zBJ08pO_J1cxc2PMm09D-QFvED8XJJDp5Do5dd4N7DjSbuV9eziPjmeJsh6IaAOrLIDxn2KuKQfZWkn3WbRg1wcUkx4sUkS4i3AIUpimMK",
        imageAlt: "Web Development",
        bullets: ["Scalable Infrastructure", "Performance Tuning"],
        buttonLabel: "Get a Quote",
        buttonHref: "/contact",
      },
      {
        title: "Brand Identity",
        icon: "category",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDUq_IVbHQGmqcIXCbA675DkvO5WxjA88RIDoDLexrmYqhXOQUoFiLCWtVHFotcO15zwodGghiEi1oZSj8WEroLDz0CLHnl3Z-TaZu3vuH9ARRtjRlaPCpr54kE8r_C2zMcag88CPkF63F6eMbEFQUYTs2Ua0YnSXOz3URfxjNeQ9SlW-U5dxJs40JHY0S0mn3WGQbOv6iDZ0yrDzA6RTGSXRG3Z13TrtL1ZmopoTr6fTwfJ62oSsyg-QsSgrgyPAPScz0oYRCLrv4R",
        imageAlt: "Brand Identity",
        bullets: ["Visual Language", "Narrative Engineering"],
        buttonLabel: "Learn More",
        buttonHref: "/contact",
      },
      {
        title: "AI Automation",
        icon: "trending_up",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD09PFN27_emiSInFubxuFgS2hZHbXaLWvAvG0lh3aVbP5ADfjK5vG3icRCCHzhy1xWt48h-t2P3VdDeVpLPgBFhXOzUy4Hx209m2sB5XPHAV-iXdrRD230dSDVv1aDrXRB1nIqi7ZXtwriihNYBLI2OGVZH3dzjVzX6xJG4U7xngbuHVG0rdnHC0E8Dzwjh-V8p-pfyZ76iG9sCD-zhiySUIsBtIb8Z4lHQs6LsnWBJ59G56-p2m5hxT1DbwCko4p03bNTqWc1uqK4",
        imageAlt: "AI Automation",
        bullets: ["Conversion Systems", "Workflow AI"],
        buttonLabel: "Get a Quote",
        buttonHref: "/contact",
      },
    ],
  },
  desktopSidebar: {
    eyebrow: "What we do",
    headingLead: "Full-Stack Digital",
    headingAccent: "Solutions",
    description:
      "From conceptual architecture to complex backend orchestration, we handle the full spectrum of digital evolution.",
    highlights: [
      "50+ WEBSITES DELIVERED",
      "CUSTOM AI WORKFLOWS",
      "FULL-STACK DEVELOPMENT",
    ],
  },
  desktopServices: [
    {
      title: "Web Development & Design",
      icon: "developer_mode",
      description:
        "Building high-speed, high-fidelity web experiences using modern frameworks and performance-first methodologies. Our websites are built to convert and scale.",
      bullets: [
        "React & Next.js Systems",
        "Motion Design",
        "API Integrations",
        "E-commerce Engines",
      ],
      accent: "primary",
    },
    {
      title: "Brand Identity & Digital Design",
      icon: "palette",
      description:
        "Crafting visual languages that communicate authority and innovation. We define the \"soul\" of your brand through editorial typography and atmospheric visuals.",
      bullets: [
        "Identity Systems",
        "Cyber Typography",
        "Design Systems",
        "Social Presence",
      ],
      accent: "secondary",
    },
    {
      title: "AI Automation & Digital Marketing",
      icon: "psychology",
      description:
        "Leveraging machine learning and advanced data diagnostics to optimize your conversion funnels and automate operational workflows.",
      bullets: [
        "AI Orchestration",
        "SEO Diagnostics",
        "Data Visualization",
        "Lead Automation",
      ],
      accent: "tertiary",
    },
  ],
  cta: {
    mobileLead: "Ready to Start",
    mobileAccent: "Your Project?",
    desktopHeading: "READY TO START YOUR PROJECT?",
    buttonLabel: "Book a Free Consultation",
    buttonHref: "/contact",
  },
};

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
  return isSchemaMismatchError(error) || isMissingDatabaseConfigError(error) || isDatabaseConnectivityError(error);
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

function toSettingEntries(content: ServicesContent) {
  return [
    {
      key: SERVICES_SETTING_KEYS.hero,
      value: JSON.stringify(content.hero),
      type: "json",
      description: "Services hero content",
    },
    {
      key: SERVICES_SETTING_KEYS.workflow,
      value: JSON.stringify(content.workflow),
      type: "json",
      description: "Services workflow content",
    },
    {
      key: SERVICES_SETTING_KEYS.mobileServices,
      value: JSON.stringify(content.mobileServices),
      type: "json",
      description: "Services mobile cards",
    },
    {
      key: SERVICES_SETTING_KEYS.desktopSidebar,
      value: JSON.stringify(content.desktopSidebar),
      type: "json",
      description: "Services desktop sidebar",
    },
    {
      key: SERVICES_SETTING_KEYS.desktopServices,
      value: JSON.stringify(content.desktopServices),
      type: "json",
      description: "Services desktop cards",
    },
    {
      key: SERVICES_SETTING_KEYS.cta,
      value: JSON.stringify(content.cta),
      type: "json",
      description: "Services CTA section",
    },
  ];
}

export async function getServicesContent(): Promise<ServicesContent> {
  try {
    if (!(await hasSettingsTable())) {
      return DEFAULT_SERVICES_CONTENT;
    }

    const keys = Object.values(SERVICES_SETTING_KEYS);
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
      hero: parseJsonSetting(settingMap.get(SERVICES_SETTING_KEYS.hero), DEFAULT_SERVICES_CONTENT.hero),
      workflow: parseJsonSetting(settingMap.get(SERVICES_SETTING_KEYS.workflow), DEFAULT_SERVICES_CONTENT.workflow),
      mobileServices: parseJsonSetting(
        settingMap.get(SERVICES_SETTING_KEYS.mobileServices),
        DEFAULT_SERVICES_CONTENT.mobileServices,
      ),
      desktopSidebar: parseJsonSetting(
        settingMap.get(SERVICES_SETTING_KEYS.desktopSidebar),
        DEFAULT_SERVICES_CONTENT.desktopSidebar,
      ),
      desktopServices: parseJsonSetting(
        settingMap.get(SERVICES_SETTING_KEYS.desktopServices),
        DEFAULT_SERVICES_CONTENT.desktopServices,
      ),
      cta: parseJsonSetting(settingMap.get(SERVICES_SETTING_KEYS.cta), DEFAULT_SERVICES_CONTENT.cta),
    };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    return DEFAULT_SERVICES_CONTENT;
  }
}

export async function saveServicesContent(content: ServicesContent) {
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
