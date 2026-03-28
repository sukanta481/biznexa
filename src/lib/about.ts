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

export interface AboutMetric {
  value: string;
  label: string;
}

export interface AboutPillar {
  eyebrow?: string | null;
  icon: string;
  title: string;
  description: string;
  footerLabel?: string | null;
}

export interface AboutContent {
  hero: {
    badgeText: string;
    headlineLead: string;
    headlineAccent: string;
    description: string;
    desktopImage: string;
  };
  leadership: {
    portraitImage: string;
    name: string;
    title: string;
    executiveBadge: string;
    headlineLead: string;
    headlineAccent: string;
    quote: string;
    bio: string;
    bioButtonLabel: string;
    metrics: AboutMetric[];
  };
  pillars: {
    heading: string;
    items: AboutPillar[];
  };
  cta: {
    heading: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  hero: {
    badgeText: "Our Philosophy",
    headlineLead: "Architecting the",
    headlineAccent: "Future",
    description:
      "Biznexa is not just a digital agency. We are a collective of architects, engineers, and visionaries building the high-performance infrastructures of tomorrow's digital economy.",
    desktopImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOZdYI31MhAQ4MfJOJWS2Xck8njCL8Q5McYnJC3KlUm-L3spGENzRPNt5YlBpiZpVU6O2EAIWOYX_VwVfpbwgzKnPdE5zcQjSFW8FO8euboATWk5IS4eUW9T_9gk-Z3uc98G3m7MwWZjm56BFYISq3eDWJquUaaRm1UCDvqG1csFPLh-Zcifdd1onIiIZHZxVL2FpEAD_LocmRwQKk5fVVKoANHmkIEh-hVRxn8FTCzeTMmg_jiERdMw2Fhu8mFSENiyUViUu7BAsz",
  },
  leadership: {
    portraitImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDacnlKmd5_xNSQsj0-pxjr00Bw5gFJhIKOw2mTFzsjuAfdOiZL-REzCyKsTAMGpSr8s4bAko1Aezt8VFCwiSWErN2AC4wyGo6rUprDt2HK2bmhBHZwWDh1zgrDdEQOZQb-Bih-Yp4k3zZVeHDPx_ScV0D8iLOzAKMR-3XU5hACnvwkEEk3lp8bRaiKwVzuVvrydZS-9Do6IYZAcfEDX6SaNTj9Q36owhlxU7igrCGMypFLTCKTMiAbCByaiP3c4zI36JgQy95S6Ft_",
    name: "Sukanta Saha",
    title: "CEO & Founder",
    executiveBadge: "Executive Leadership",
    headlineLead: "A Vision for",
    headlineAccent: "Exponential",
    quote:
      "We started BizNexa because we kept seeing businesses pay for websites and systems that broke within a year. We build things that last.",
    bio:
      "Sukanta Saha founded BizNexa to bring enterprise-grade digital solutions to small and mid-sized businesses. With hands-on experience in web development, AI workflow automation, and digital marketing, he leads a team focused on delivering real results.",
    bioButtonLabel: "Full Biography",
    metrics: [
      { value: "15+", label: "Projects Completed" },
      { value: "10+", label: "Happy Clients" },
    ],
  },
  pillars: {
    heading: "Strategic Pillars",
    items: [
      {
        eyebrow: "01 / Engineering",
        icon: "architecture",
        title: "Scalable Web Development",
        description:
          "We build high-performance, future-ready digital infrastructures using modern frameworks that scale infinitely.",
      },
      {
        eyebrow: "02 / Automation",
        icon: "smart_toy",
        title: "AI-Driven Automation",
        description:
          "Streamlining complex workflows with bespoke AI solutions to maximize operational efficiency.",
      },
      {
        eyebrow: "03 / Growth",
        icon: "trending_up",
        title: "Digital Marketing & SEO",
        description:
          "Data-driven strategies to dominate search results and social feeds, ensuring your brand stays top-of-mind.",
      },
      {
        eyebrow: null,
        icon: "hub",
        title: "Seamless API Integration",
        description:
          "Connecting your digital ecosystem with robust, secure, and high-speed integration layers for maximum data velocity.",
        footerLabel: "V 4.0 Standard",
      },
    ],
  },
  cta: {
    heading: "READY TO START YOUR PROJECT?",
    primaryLabel: "BOOK A CALL",
    primaryHref: "/contact",
    secondaryLabel: "VIEW PORTFOLIO",
    secondaryHref: "/case-studies",
  },
};

const ABOUT_SETTING_KEYS = {
  hero: "about_hero",
  leadership: "about_leadership",
  pillars: "about_pillars",
  cta: "about_cta",
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

function toSettingEntries(content: AboutContent) {
  return [
    {
      key: ABOUT_SETTING_KEYS.hero,
      value: JSON.stringify(content.hero),
      type: "json",
      description: "About page hero content",
    },
    {
      key: ABOUT_SETTING_KEYS.leadership,
      value: JSON.stringify(content.leadership),
      type: "json",
      description: "About page leadership section",
    },
    {
      key: ABOUT_SETTING_KEYS.pillars,
      value: JSON.stringify(content.pillars),
      type: "json",
      description: "About page strategic pillars",
    },
    {
      key: ABOUT_SETTING_KEYS.cta,
      value: JSON.stringify(content.cta),
      type: "json",
      description: "About page CTA section",
    },
  ];
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    if (!(await hasSettingsTable())) {
      return DEFAULT_ABOUT_CONTENT;
    }

    const keys = Object.values(ABOUT_SETTING_KEYS);
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
      hero: parseJsonSetting(settingMap.get(ABOUT_SETTING_KEYS.hero), DEFAULT_ABOUT_CONTENT.hero),
      leadership: parseJsonSetting(settingMap.get(ABOUT_SETTING_KEYS.leadership), DEFAULT_ABOUT_CONTENT.leadership),
      pillars: parseJsonSetting(settingMap.get(ABOUT_SETTING_KEYS.pillars), DEFAULT_ABOUT_CONTENT.pillars),
      cta: parseJsonSetting(settingMap.get(ABOUT_SETTING_KEYS.cta), DEFAULT_ABOUT_CONTENT.cta),
    };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    return DEFAULT_ABOUT_CONTENT;
  }
}

export async function saveAboutContent(content: AboutContent) {
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
