import "server-only";

import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { open, seal } from "@/lib/crypto-box";
import { query } from "@/lib/db";

export type Provider = "whatsapp" | "smtp" | "s3";

export interface WhatsAppConfig {
  token: string;
  phoneNumberId: string;
  ingestSecret: string;
}

export interface SmtpConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
  secure: string;
  fromEmail: string;
  notificationEmail: string;
}

export interface S3Config {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  forcePathStyle: string;
  publicBase: string;
}

export type ProviderConfig = Record<string, string>;

interface CredentialRow extends RowDataPacket {
  provider: string;
  config_json: string | null;
  last_verified_at: string | null;
  verify_error: string | null;
  updated_at: string;
}

// Field name -> env var. When a database value is absent or blank, the env var
// is used, so existing deployments keep working unchanged.
const ENV_FALLBACK: Record<Provider, Record<string, string>> = {
  whatsapp: {
    token: "WHATSAPP_TOKEN",
    phoneNumberId: "WHATSAPP_PHONE_NUMBER_ID",
    ingestSecret: "WHATSAPP_INGEST_SECRET",
  },
  smtp: {
    host: "SMTP_HOST",
    port: "SMTP_PORT",
    user: "SMTP_USER",
    pass: "SMTP_PASS",
    secure: "SMTP_SECURE",
    fromEmail: "CONTACT_FROM_EMAIL",
    notificationEmail: "CONTACT_NOTIFICATION_EMAIL",
  },
  s3: {
    bucket: "S3_BUCKET",
    region: "S3_REGION",
    accessKeyId: "S3_ACCESS_KEY_ID",
    secretAccessKey: "S3_SECRET_ACCESS_KEY",
    endpoint: "S3_ENDPOINT",
    forcePathStyle: "S3_FORCE_PATH_STYLE",
    publicBase: "S3_PUBLIC_BASE",
  },
};

/** Which fields are secret. Used for masking and for write-only handling. */
export const SECRET_FIELDS: Record<Provider, string[]> = {
  whatsapp: ["token", "ingestSecret"],
  smtp: ["pass"],
  s3: ["secretAccessKey"],
};

const CACHE_TTL_MS = 60_000;
const cache = new Map<Provider, { at: number; config: ProviderConfig }>();

export function invalidateIntegrationCache(provider?: Provider) {
  if (provider) cache.delete(provider);
  else cache.clear();
}

async function readStored(provider: Provider): Promise<ProviderConfig> {
  const rows = await query<CredentialRow[]>(
    `SELECT config_json FROM integration_credentials WHERE provider = ? LIMIT 1`,
    [provider],
  );

  if (!rows.length) return {};

  // open() returns null on a missing or rotated key — degrade to env rather
  // than failing, so a key problem never takes the site down.
  const plaintext = open(rows[0].config_json);
  if (!plaintext) return {};

  try {
    return JSON.parse(plaintext) as ProviderConfig;
  } catch {
    return {};
  }
}

/**
 * Resolved config for a provider: stored values first, env vars where a stored
 * value is missing or blank.
 */
export async function getIntegrationConfig(provider: Provider): Promise<ProviderConfig> {
  const hit = cache.get(provider);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.config;

  let stored: ProviderConfig = {};
  try {
    stored = await readStored(provider);
  } catch {
    // Table missing or database unreachable — fall back to env entirely.
    stored = {};
  }

  const resolved: ProviderConfig = {};
  for (const [field, envVar] of Object.entries(ENV_FALLBACK[provider])) {
    const fromDb = stored[field];
    resolved[field] = fromDb && fromDb.trim() ? fromDb : process.env[envVar] ?? "";
  }

  cache.set(provider, { at: Date.now(), config: resolved });
  return resolved;
}

/** True when a stored (database) value exists for this field. */
export async function getStoredConfig(provider: Provider): Promise<ProviderConfig> {
  try {
    return await readStored(provider);
  } catch {
    return {};
  }
}

/**
 * Merges `updates` into the stored config and re-encrypts.
 * A field whose value is an empty string is left unchanged — that is how the
 * UI submits "user did not retype this secret".
 */
export async function saveIntegrationConfig(
  provider: Provider,
  updates: ProviderConfig,
  adminId: number,
): Promise<void> {
  const current = await getStoredConfig(provider);
  const merged: ProviderConfig = { ...current };

  for (const [field, value] of Object.entries(updates)) {
    if (typeof value !== "string") continue;
    if (SECRET_FIELDS[provider].includes(field) && value === "") continue;
    merged[field] = value;
  }

  await query<ResultSetHeader>(
    `INSERT INTO integration_credentials (provider, config_json, updated_by)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE config_json = VALUES(config_json), updated_by = VALUES(updated_by)`,
    [provider, seal(JSON.stringify(merged)), adminId],
  );

  invalidateIntegrationCache(provider);
}

export async function recordVerification(
  provider: Provider,
  ok: boolean,
  error: string | null,
): Promise<void> {
  await query<ResultSetHeader>(
    `UPDATE integration_credentials
        SET last_verified_at = ${ok ? "NOW()" : "last_verified_at"}, verify_error = ?
      WHERE provider = ?`,
    [ok ? null : error, provider],
  );
}

export async function getVerificationState(provider: Provider) {
  const rows = await query<CredentialRow[]>(
    `SELECT last_verified_at, verify_error, updated_at
       FROM integration_credentials WHERE provider = ? LIMIT 1`,
    [provider],
  );
  return rows[0] ?? null;
}
