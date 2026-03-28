import "server-only";

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

export interface SiteSettings {
  social: SiteSocialLinks;
}

const SITE_SETTINGS_KEYS = {
  social: "site_settings_social",
} as const;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  social: {
    whatsapp: COMPANY.whatsapp,
    linkedin: COMPANY.social.linkedin,
    twitter: COMPANY.social.twitter,
    facebook: "",
    instagram: COMPANY.social.instagram,
    youtube: "",
    github: "",
    telegram: "",
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

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    if (!(await hasSettingsTable())) {
      return DEFAULT_SITE_SETTINGS;
    }

    const rows = await query<SettingRow[]>(
      `
        SELECT setting_key, setting_value
        FROM settings
        WHERE setting_key = ?
      `,
      [SITE_SETTINGS_KEYS.social],
    );

    const socialRow = rows.find((row) => row.setting_key === SITE_SETTINGS_KEYS.social);

    return {
      social: {
        ...DEFAULT_SITE_SETTINGS.social,
        ...parseJsonSetting<Partial<SiteSocialLinks>>(socialRow?.setting_value, {}),
      },
    };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings) {
  const columns = await query<ColumnRow[]>("SHOW COLUMNS FROM settings");
  const hasUpdatedBy = columns.some((column) => column.Field === "updated_by");

  await query<ResultSetHeader>(
    `
      INSERT INTO settings (setting_key, setting_value, setting_type, description${hasUpdatedBy ? ", updated_by" : ""})
      VALUES (?, ?, 'json', 'Site social links'${hasUpdatedBy ? ", NULL" : ""})
      ON DUPLICATE KEY UPDATE
        setting_value = VALUES(setting_value),
        setting_type = VALUES(setting_type),
        description = VALUES(description)
    `,
    [SITE_SETTINGS_KEYS.social, JSON.stringify(settings.social)],
  );
}
