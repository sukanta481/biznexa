import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { COMPANY } from "@/lib/constants";
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

interface AdminUserRow extends RowDataPacket {
  id: number;
}

interface ActivityLogTableRow extends RowDataPacket {
  table_name: string;
}

export interface SitePhoneEntry {
  label: string;
  number: string;
}

export interface SiteEmailEntry {
  department: string;
  email: string;
}

export interface SiteSocialLinks {
  whatsapp: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  github: string;
  telegram: string;
}

export type SiteSettingKey =
  | "site_name"
  | "site_email"
  | "site_phone"
  | "site_address"
  | "facebook_url"
  | "twitter_url"
  | "linkedin_url"
  | "instagram_url"
  | "stat_years"
  | "stat_projects"
  | "stat_clients"
  | "stat_countries"
  | "hero_title"
  | "hero_subtitle"
  | "hero_image";

export interface SiteSettings {
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  social: SiteSocialLinks;
  stats: {
    years: string;
    projects: string;
    clients: string;
    countries: string;
  };
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  contactPhones: SitePhoneEntry[];
  contactEmails: SiteEmailEntry[];
  flat: Record<SiteSettingKey, string>;
}

export interface SiteSettingsUpdateInput {
  settings: Record<SiteSettingKey, string>;
  contactPhones: SitePhoneEntry[];
  contactEmails: SiteEmailEntry[];
  updatedBy?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

const SETTING_META: Record<SiteSettingKey, { type: "text" | "email" | "url" | "number"; description: string }> = {
  site_name: { type: "text", description: "Website name" },
  site_email: { type: "email", description: "Primary contact email" },
  site_phone: { type: "text", description: "Primary contact phone" },
  site_address: { type: "text", description: "Business address" },
  facebook_url: { type: "url", description: "Facebook page URL" },
  twitter_url: { type: "url", description: "Twitter profile URL" },
  linkedin_url: { type: "url", description: "LinkedIn profile URL" },
  instagram_url: { type: "url", description: "Instagram profile URL" },
  stat_years: { type: "number", description: "Years of experience shown on homepage" },
  stat_projects: { type: "number", description: "Projects completed shown on homepage" },
  stat_clients: { type: "number", description: "Happy clients shown on homepage" },
  stat_countries: { type: "number", description: "Countries served shown on homepage" },
  hero_title: { type: "text", description: "Homepage hero title" },
  hero_subtitle: { type: "text", description: "Homepage hero subtitle" },
  hero_image: { type: "url", description: "Homepage hero image URL" },
};

export const PHONE_LABEL_OPTIONS = ["Sales", "Support", "WhatsApp", "Office", "HR", "General"] as const;
export const EMAIL_DEPARTMENT_OPTIONS = ["Sales", "Support", "Billing", "HR", "Careers", "General"] as const;

const SETTINGS_JSON_KEYS = {
  contactPhones: "contact_phones",
  contactEmails: "contact_emails",
} as const;

const SETTING_KEYS = Object.keys(SETTING_META) as SiteSettingKey[];

const DEFAULT_FLAT_SETTINGS: Record<SiteSettingKey, string> = {
  site_name: "BizNexa",
  site_email: COMPANY.email,
  site_phone: COMPANY.phone,
  site_address: COMPANY.address.full,
  facebook_url: "",
  twitter_url: COMPANY.social.twitter,
  linkedin_url: COMPANY.social.linkedin,
  instagram_url: COMPANY.social.instagram,
  stat_years: "5",
  stat_projects: "150",
  stat_clients: "120",
  stat_countries: "15",
  hero_title: "Website Design and Development Company",
  hero_subtitle: "Custom Web Design Services at Affordable Pricing",
  hero_image: "",
};

const DEFAULT_SITE_SETTINGS: SiteSettings = toSiteSettings(DEFAULT_FLAT_SETTINGS, [], []);

function toSiteSettings(
  flat: Record<SiteSettingKey, string>,
  contactPhones: SitePhoneEntry[],
  contactEmails: SiteEmailEntry[],
): SiteSettings {
  return {
    siteName: flat.site_name,
    siteEmail: flat.site_email,
    sitePhone: flat.site_phone,
    siteAddress: flat.site_address,
    social: {
      whatsapp: flat.site_phone ? `https://wa.me/${flat.site_phone.replace(/\D/g, "")}` : "",
      linkedin: flat.linkedin_url,
      twitter: flat.twitter_url,
      facebook: flat.facebook_url,
      instagram: flat.instagram_url,
      youtube: "",
      github: "",
      telegram: "",
    },
    stats: {
      years: flat.stat_years,
      projects: flat.stat_projects,
      clients: flat.stat_clients,
      countries: flat.stat_countries,
    },
    hero: {
      title: flat.hero_title,
      subtitle: flat.hero_subtitle,
      image: flat.hero_image,
    },
    contactPhones,
    contactEmails,
    flat,
  };
}

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

async function hasTable(tableName: string) {
  const rows = await query<TableRow[]>(
    `
      SELECT TABLE_NAME AS table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name = ?
      LIMIT 1
    `,
    [tableName],
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

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhoneEntries(entries: SitePhoneEntry[]) {
  return entries
    .map((entry) => ({
      label: PHONE_LABEL_OPTIONS.includes(entry.label as (typeof PHONE_LABEL_OPTIONS)[number]) ? entry.label : "General",
      number: sanitizeString(entry.number),
    }))
    .filter((entry) => entry.number.length > 0);
}

function normalizeEmailEntries(entries: SiteEmailEntry[]) {
  return entries
    .map((entry) => ({
      department: EMAIL_DEPARTMENT_OPTIONS.includes(entry.department as (typeof EMAIL_DEPARTMENT_OPTIONS)[number])
        ? entry.department
        : "General",
      email: sanitizeString(entry.email),
    }))
    .filter((entry) => entry.email.length > 0);
}

async function getSettingsColumns() {
  return query<ColumnRow[]>("SHOW COLUMNS FROM settings");
}

async function getDefaultAdminUserId() {
  try {
    if (!(await hasTable("admin_users"))) {
      return null;
    }

    const rows = await query<AdminUserRow[]>(
      `
        SELECT id
        FROM admin_users
        WHERE status = 'active'
        ORDER BY id ASC
        LIMIT 1
      `,
    );

    return rows[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    if (!(await hasTable("settings"))) {
      return DEFAULT_SITE_SETTINGS;
    }

    const keys = [...SETTING_KEYS, SETTINGS_JSON_KEYS.contactPhones, SETTINGS_JSON_KEYS.contactEmails];
    const placeholders = keys.map(() => "?").join(", ");
    const rows = await query<SettingRow[]>(
      `
        SELECT setting_key, setting_value
        FROM settings
        WHERE setting_key IN (${placeholders})
      `,
      keys,
    );

    const settingMap = new Map(rows.map((row) => [row.setting_key, row.setting_value ?? ""]));
    const flat = { ...DEFAULT_FLAT_SETTINGS };

    for (const key of SETTING_KEYS) {
      const value = settingMap.get(key);
      if (typeof value === "string" && value.length > 0) {
        flat[key] = value;
      }
    }

    const contactPhones = normalizePhoneEntries(
      parseJsonSetting<SitePhoneEntry[]>(settingMap.get(SETTINGS_JSON_KEYS.contactPhones), []),
    );
    const contactEmails = normalizeEmailEntries(
      parseJsonSetting<SiteEmailEntry[]>(settingMap.get(SETTINGS_JSON_KEYS.contactEmails), []),
    );

    return toSiteSettings(flat, contactPhones, contactEmails);
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(input: SiteSettingsUpdateInput) {
  if (!(await hasTable("settings"))) {
    throw new Error("Settings table does not exist. Please run the database migration first.");
  }

  const normalizedFlat = { ...DEFAULT_FLAT_SETTINGS };

  for (const key of SETTING_KEYS) {
    normalizedFlat[key] = sanitizeString(input.settings[key]);
  }

  const contactPhones = normalizePhoneEntries(input.contactPhones);
  const contactEmails = normalizeEmailEntries(input.contactEmails);
  const requestedUpdatedBy = input.updatedBy ?? null;
  const updatedBy = requestedUpdatedBy ?? (await getDefaultAdminUserId());
  const columns = await getSettingsColumns();
  const hasUpdatedBy = columns.some((column) => column.Field === "updated_by");
  const valuePlaceholder = hasUpdatedBy ? "(?, ?, ?, ?, ?)" : "(?, ?, ?, ?)";

  const entries = [
    ...SETTING_KEYS.map((key) => ({
      key,
      value: normalizedFlat[key],
      type: SETTING_META[key].type,
      description: SETTING_META[key].description,
    })),
    {
      key: SETTINGS_JSON_KEYS.contactPhones,
      value: JSON.stringify(contactPhones),
      type: "json" as const,
      description: "Additional contact phone numbers",
    },
    {
      key: SETTINGS_JSON_KEYS.contactEmails,
      value: JSON.stringify(contactEmails),
      type: "json" as const,
      description: "Department-wise contact emails",
    },
  ];

  await query<ResultSetHeader>(
    `
      INSERT INTO settings (setting_key, setting_value, setting_type, description${hasUpdatedBy ? ", updated_by" : ""})
      VALUES ${entries.map(() => valuePlaceholder).join(", ")}
      ON DUPLICATE KEY UPDATE
        setting_value = VALUES(setting_value),
        setting_type = VALUES(setting_type),
        description = VALUES(description)
        ${hasUpdatedBy ? ", updated_by = VALUES(updated_by)" : ""}
    `,
    entries.flatMap((entry) =>
      hasUpdatedBy
        ? [entry.key, entry.value, entry.type, entry.description, updatedBy]
        : [entry.key, entry.value, entry.type, entry.description],
    ),
  );

  await logSiteSettingsActivity({
    userId: updatedBy,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  });
}

async function logSiteSettingsActivity({
  userId,
  ipAddress,
  userAgent,
}: {
  userId: number | null;
  ipAddress: string | null;
  userAgent: string | null;
}) {
  try {
    const rows = await query<ActivityLogTableRow[]>(
      `
        SELECT TABLE_NAME AS table_name
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = 'activity_log'
        LIMIT 1
      `,
    );

    if (rows.length === 0) {
      return;
    }

    await query<ResultSetHeader>(
      `
        INSERT INTO activity_log (user_id, action, table_name, record_id, description, ip_address, user_agent)
        VALUES (?, 'update', 'settings', NULL, 'Updated site settings', ?, ?)
      `,
      [userId, ipAddress, userAgent],
    );
  } catch {
    // Logging must never block settings updates.
  }
}

function getCsrfSecret() {
  return process.env.CSRF_SECRET || process.env.APP_SECRET || process.env.NEXTAUTH_SECRET || "biznexa-site-settings-secret";
}

function signCsrfPayload(payload: string) {
  return createHmac("sha256", getCsrfSecret()).update(payload).digest("hex");
}

export function createCsrfToken(scope = "site-settings") {
  const timestamp = Date.now().toString();
  const nonce = randomBytes(12).toString("hex");
  const payload = `${scope}.${timestamp}.${nonce}`;
  const signature = signCsrfPayload(payload);

  return `${payload}.${signature}`;
}

export function verifyCsrfToken(token: string, scope = "site-settings", maxAgeMs = 2 * 60 * 60 * 1000) {
  const parts = token.split(".");

  if (parts.length !== 4) {
    return false;
  }

  const [tokenScope, timestamp, nonce, signature] = parts;

  if (tokenScope !== scope || !timestamp || !nonce || !signature) {
    return false;
  }

  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age < 0 || age > maxAgeMs) {
    return false;
  }

  const expectedSignature = signCsrfPayload(`${tokenScope}.${timestamp}.${nonce}`);

  try {
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"));
  } catch {
    return false;
  }
}

export function getSettingMeta() {
  return SETTING_META;
}
