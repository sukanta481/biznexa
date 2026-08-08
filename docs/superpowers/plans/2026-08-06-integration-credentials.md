# Integration Credentials Settings — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Execute one chunk per run, top to bottom. This plan handles live secrets — read the security rules before writing code.

**Goal:** A settings page at `/admin/settings/integrations` where WhatsApp, SMTP, and S3 credentials are entered, stored encrypted in the database, and verified with a "Test connection" button — instead of requiring an `amplify.yml` edit and redeploy for every change.

**Architecture:** Credentials live in a dedicated `integration_credentials` table, encrypted with AES-256-GCM using one long-lived `CREDENTIALS_KEY` env var. A resolver reads database first and falls back to existing env vars, so nothing breaks on deploy. The API is write-only: secrets go in, only masked previews come back.

**Tech Stack:** Next.js 15.5 App Router, MySQL, Node `crypto` (no new dependency), `@aws-sdk/client-s3` and `nodemailer` already installed.

---

## Context You Need Before Starting

### Why a separate table

The existing `settings` table is a generic key-value store, and `getSiteSettings()` in `src/lib/site-settings.ts` reads **every** row and returns it to the client. A secret placed there would ship to the browser on every settings page load.

`integration_credentials` is separate so that function is structurally incapable of returning a secret. **Do not store credentials in the `settings` table.** Do not extend `SiteSettingKey`.

### Why encryption, given the key is also in env

An attacker with full server access gets both the key and the ciphertext, so this is not absolute protection. It defends against the realistic case: a database backup, a dump, read-only DB access, or an over-exposed API. In August 2026 this project shipped an unauthenticated admin API that made the entire database publicly readable — plaintext tokens would have leaked with it. Encryption means a database-level leak does not hand over the Meta token.

### Security rules — non-negotiable

1. **Never log a decrypted secret.** No `console.log`, no error message that interpolates a credential value, no echoing it in an API response.
2. **`GET` never returns plaintext.** It returns a mask (`••••••3f9a`) plus metadata only.
3. **Test endpoints never echo the credential** back in their response or error text.
4. **Decryption failure is not fatal.** If `CREDENTIALS_KEY` changes or is missing, treat the stored config as unset, fall back to env, and surface a clear error in the UI. Never crash the app.
5. **Every new admin route starts with the guard:**
   ```ts
   const admin = await requireAdmin();
   if (!admin) return unauthorized();
   ```

### Existing code you will modify

All three consumers already build their clients **per call**, not at module scope — so switching them to an async resolver is straightforward:

- `src/lib/whatsapp.ts` — `config()` reads `process.env.WHATSAPP_*`
- `src/lib/storage.ts` — `client()`, `publicUrl()`, `isS3Configured()` read `process.env.S3_*`
- `src/lib/contact-mail.ts` — reads `process.env.SMTP_*` inside the send function

### Environment

One new variable, set once and never rotated:

```
CREDENTIALS_KEY=<64 hex chars — generate with: openssl rand -hex 32>
```

Add it to `.env.local`, `.env.example` (placeholder only), and the `amplify.yml` `.env.production` block.

### Testing reality

No test runner; do not add one. Verification is `scripts/verify-integrations.mjs` (Chunk 1) plus `npx tsc --noEmit`.

`npm run lint` has a **pre-existing baseline of 13 errors** in old `.js` files. Do not fix them; do not treat them as your regression.

---

## Chunk 1: Encryption and storage layer

### Task 1: The table

**Files:** Create `db/integration-credentials.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Encrypted third-party credentials. Deliberately NOT the `settings` table:
-- getSiteSettings() returns every row it finds, so a secret there would be
-- sent to the browser.

CREATE TABLE IF NOT EXISTS `integration_credentials` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `provider` VARCHAR(50) NOT NULL COMMENT 'whatsapp | smtp | s3',
  `config_json` TEXT DEFAULT NULL COMMENT 'AES-256-GCM ciphertext of the config object',
  `last_verified_at` DATETIME DEFAULT NULL,
  `verify_error` TEXT DEFAULT NULL,
  `updated_by` INT(11) DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_integration_credentials_provider` (`provider`),
  CONSTRAINT `fk_integration_credentials_user`
    FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

- [ ] **Step 2: Apply and verify locally**

```bash
/c/xampp/mysql/bin/mysql -u root d2w_cms < db/integration-credentials.sql
```

```bash
/c/xampp/mysql/bin/mysql -u root d2w_cms -e "DESCRIBE integration_credentials;"
```

Expected: 7 columns.

- [ ] **Step 3: Commit**

```bash
git add db/integration-credentials.sql
git commit -m "feat(db): add integration_credentials table"
```

---

### Task 2: Encryption helper

**Files:** Create `src/lib/crypto-box.ts`

- [ ] **Step 1: Write it**

```ts
import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;

function key(): Buffer | null {
  const raw = process.env.CREDENTIALS_KEY;
  if (!raw || !/^[a-f0-9]{64}$/i.test(raw)) return null;
  return Buffer.from(raw, "hex");
}

export function isEncryptionConfigured(): boolean {
  return key() !== null;
}

/** Returns "iv:tag:ciphertext", all base64. Throws when the key is absent. */
export function seal(plaintext: string): string {
  const k = key();
  if (!k) throw new Error("CREDENTIALS_KEY is missing or malformed (want 64 hex chars).");

  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, k, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

/**
 * Returns null on any failure — missing key, wrong key, tampered payload.
 * Callers treat null as "not configured" and fall back to env. Never throws,
 * so a rotated key degrades gracefully instead of taking the app down.
 */
export function open(sealed: string | null): string | null {
  if (!sealed) return null;
  const k = key();
  if (!k) return null;

  const parts = sealed.split(":");
  if (parts.length !== 3) return null;

  try {
    const iv = Buffer.from(parts[0], "base64");
    const tag = Buffer.from(parts[1], "base64");
    const enc = Buffer.from(parts[2], "base64");

    const decipher = createDecipheriv(ALGO, k, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

/** Masks a secret for display: last 4 characters only. */
export function mask(value: string | null | undefined): string {
  if (!value) return "";
  if (value.length <= 4) return "••••";
  return `••••••${value.slice(-4)}`;
}
```

- [ ] **Step 2: Typecheck and commit**

```bash
npx tsc --noEmit
```

```bash
git add src/lib/crypto-box.ts
git commit -m "feat(security): add AES-256-GCM helper for credential storage"
```

---

### Task 3: Credential resolver

**Files:** Create `src/lib/integrations.ts`

This is the single place that decides "database or env".

- [ ] **Step 1: Write it**

```ts
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
```

- [ ] **Step 2: Typecheck and commit**

```bash
npx tsc --noEmit
```

```bash
git add src/lib/integrations.ts
git commit -m "feat(settings): add credential resolver with env fallback"
```

---

### Task 4: Verification script

**Files:** Create `scripts/verify-integrations.mjs`

- [ ] **Step 1: Write it**

Model it on `scripts/verify-whatsapp-inbox.mjs`. It must check:

1. `GET /api/admin/settings/integrations` returns 401 anonymously
2. `POST /api/admin/settings/integrations` returns 401 anonymously
3. `POST /api/admin/settings/integrations/test` returns 401 anonymously
4. Print a `NOTE` reminding a human to confirm, after saving a token through the UI, that `SELECT config_json FROM integration_credentials` shows ciphertext and **not** the plaintext token

Sections 1-3 will 404 until Chunk 3. That is expected.

- [ ] **Step 2: Commit**

```bash
git add scripts/verify-integrations.mjs
git commit -m "test: add integration credentials verification script"
```

---

## Chunk 2: Point the consumers at the resolver

Behaviour must not change when nothing is stored in the database — env vars still win by fallback.

### Task 5: WhatsApp

**Files:** Modify `src/lib/whatsapp.ts`

- [ ] **Step 1: Make `config()` async and read from the resolver**

Replace the `config()` function so it awaits `getIntegrationConfig("whatsapp")` and reads `token` / `phoneNumberId` from the result, keeping the same "throw when missing" behaviour. `sendTextMessage` and `downloadMedia` already `await`, so they just await `config()` now.

- [ ] **Step 2: Update the ingest secret check**

`src/app/api/whatsapp/ingest/route.ts` compares against `process.env.WHATSAPP_INGEST_SECRET`. Change `secretMatches` to take the expected value as a parameter, and have the handler `await getIntegrationConfig("whatsapp")` to obtain it.

**Keep `timingSafeEqual`.** Keep the length check before it. Do not simplify this to `===`.

- [ ] **Step 3: Typecheck, then verify nothing regressed**

```bash
npx tsc --noEmit
```

With the dev server running and `WHATSAPP_INGEST_SECRET` still only in `.env.local`:

```bash
node scripts/verify-whatsapp-inbox.mjs
```

Expected: `ALL CHECKS PASSED` — proving env fallback works with nothing in the database.

- [ ] **Step 4: Commit**

```bash
git add src/lib/whatsapp.ts src/app/api/whatsapp/ingest/route.ts
git commit -m "refactor(whatsapp): resolve credentials through the integrations layer"
```

---

### Task 6: S3 and SMTP

**Files:** Modify `src/lib/storage.ts`, `src/lib/contact-mail.ts`

- [ ] **Step 1: `storage.ts`**

Make `isS3Configured()`, `client()` and `publicUrl()` async, resolving through `getIntegrationConfig("s3")`. Both call sites — `src/app/api/admin/upload/route.ts` and `src/app/api/whatsapp/ingest/route.ts` — already run in async handlers, so add `await`.

While you are here, fix the silent production fallback flagged in review. In `upload/route.ts`, when S3 is not configured:

```ts
} else if (process.env.NODE_ENV === "production") {
  return Response.json(
    { ok: false, error: "File storage is not configured." },
    { status: 500 },
  );
} else {
  // existing local-disk fallback
```

Amplify's SSR filesystem is ephemeral, so the silent fallback there writes files that can never be served.

- [ ] **Step 2: `contact-mail.ts`**

Resolve SMTP settings through `getIntegrationConfig("smtp")` instead of reading `process.env` directly. Keep the existing `COMPANY.email` default for the recipient.

- [ ] **Step 3: Typecheck and commit**

```bash
npx tsc --noEmit
```

```bash
git add src/lib/storage.ts src/lib/contact-mail.ts src/app/api/admin/upload/route.ts src/app/api/whatsapp/ingest/route.ts
git commit -m "refactor(storage,mail): resolve credentials through the integrations layer"
```

---

## Chunk 3: API

### Task 7: Read and save

**Files:** Create `src/app/api/admin/settings/integrations/route.ts`

- [ ] **Step 1: `GET` — masked view only**

Guard first. For each of the three providers return:

```ts
{
  provider: "whatsapp",
  fields: {
    token: { set: true, preview: "••••••3f9a", source: "database" | "env" | "unset" },
    phoneNumberId: { set: true, value: "109384756...", source: "database" },
    ...
  },
  lastVerifiedAt, verifyError, updatedAt
}
```

Non-secret fields (per `SECRET_FIELDS`) return their real `value`. Secret fields return **only** `set`, `preview` and `source` — never `value`. Build the preview with `mask()` from `crypto-box`.

Also return `encryptionConfigured: isEncryptionConfigured()` so the UI can warn when `CREDENTIALS_KEY` is missing.

- [ ] **Step 2: `POST` — save**

Guard first. Body: `{ provider, fields: { ... } }`. Validate `provider` is one of the three; reject anything else with 400. Call `saveIntegrationConfig(provider, fields, admin.id)`.

If `isEncryptionConfigured()` is false, return 400 with "Encryption key is not configured. Set CREDENTIALS_KEY before saving credentials." — do not attempt to store plaintext.

Return the same masked shape as `GET`. **Never echo submitted secret values back.**

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/settings/integrations/route.ts
git commit -m "feat(settings): add integrations read and save endpoints"
```

---

### Task 8: Test connection

**Files:** Create `src/app/api/admin/settings/integrations/test/route.ts`

- [ ] **Step 1: Write the three probes**

Guard first. Body: `{ provider }`. Each probe uses the **resolved** config and returns `{ ok, detail }` where `detail` is a short human string. On failure return the provider's error message — but never the credential.

- **whatsapp** — `GET https://graph.facebook.com/v22.0/{phoneNumberId}?fields=display_phone_number,verified_name` with `Authorization: Bearer {token}`. On success, `detail` is the verified name and display number.
- **smtp** — `nodemailer.createTransport(config).verify()`. On success, `detail` is "SMTP connection accepted".
- **s3** — `HeadBucketCommand` from `@aws-sdk/client-s3` (already installed). On success, `detail` is the bucket name and region.

Call `recordVerification(provider, ok, error)` with the result.

- [ ] **Step 2: Confirm the guard count**

```bash
grep -rc "await requireAdmin()" src/app/api/admin --include=route.ts | grep -v ":0" | awk -F: '{s+=$2} END {print s}'
```

Expected: `51` (48 existing + 2 in Task 7 + 1 here).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/settings/integrations/test/route.ts
git commit -m "feat(settings): add credential test-connection endpoint"
```

---

## Chunk 4: UI

### Task 9: Integrations page

**Files:**
- Create `src/app/admin/(dashboard)/settings/integrations/page.tsx`
- Create `src/components/admin/IntegrationsClient.tsx`
- Modify `src/components/admin/Sidebar.tsx`

- [ ] **Step 1: Read the existing pattern first**

Read `src/components/admin/SiteSettingsClient.tsx` and match its structure, field components, and Tailwind vocabulary. The admin theme uses `border-cyan-400/25 bg-cyan-400/10` for secondary controls and `bg-gradient-to-r from-emerald-400 to-cyan-300` for primary actions. **Use those** — do not invent a new gradient.

- [ ] **Step 2: Build the client component**

Three collapsible provider cards: WhatsApp Cloud API, Email (SMTP), File storage (S3).

Required behaviour:

- Secret inputs render **empty** with the mask as placeholder (`••••••3f9a`). Submitting an empty secret field leaves the stored value unchanged — the resolver already implements this; the UI must not send a blank over a real value by accident.
- Each field shows its source as a small badge: `database`, `env`, or `not set`. This is what makes the migration path legible.
- A **Test connection** button per provider, showing a spinner then the `detail` string on success or the error on failure.
- A **Generate** button beside the WhatsApp ingest secret. It creates a 64-hex-char value client-side via `crypto.getRandomValues`, puts it in the field, and shows a one-time notice: "Copy this now — you will not see it again. Paste it into the n8n `x-ingest-secret` header." After save, it is masked forever.
- When `encryptionConfigured` is false, show a prominent banner: "CREDENTIALS_KEY is not set. Credentials cannot be saved until it is configured." and disable all save buttons.

Respect `useReducedMotionSafe` from `src/components/ui/Animations.tsx` for any transitions.

- [ ] **Step 3: Sidebar**

Add to the `Settings` group, above `Site Settings`:

```ts
{ href: '/admin/settings/integrations', icon: 'key', label: 'Integrations' },
```

- [ ] **Step 4: Verify by hand**

Log in, open `/admin/settings/integrations`. With nothing stored, every field should show source `env` (for those set in `.env.local`) or `not set`. Save a WhatsApp phone number ID, reload, confirm it now shows `database`.

Then confirm the secret never leaves the server:

```bash
/c/xampp/mysql/bin/mysql -u root d2w_cms -e "SELECT provider, LEFT(config_json,40) AS ciphertext FROM integration_credentials;"
```

Expected: base64 ciphertext, no readable token.

- [ ] **Step 5: Typecheck and commit**

```bash
npx tsc --noEmit
```

```bash
git add src/app/admin src/components/admin
git commit -m "feat(settings): add integrations credentials UI"
```

---

## Definition of Done

- [ ] `npx tsc --noEmit` clean
- [ ] `npm run lint` shows no new errors beyond the 13-error baseline
- [ ] Guard count is `51`
- [ ] `node scripts/verify-integrations.mjs` passes
- [ ] `node scripts/verify-whatsapp-inbox.mjs` still passes — proving env fallback is intact
- [ ] `config_json` in the database is ciphertext, verified by eye
- [ ] `GET /api/admin/settings/integrations` returns no plaintext secret anywhere in its response
- [ ] Test connection works for all three providers
- [ ] Upload route returns 500 in production when S3 is unconfigured, instead of silently writing to disk
- [ ] `CREDENTIALS_KEY` added to `.env.example` and `amplify.yml`

---

## Human-only follow-up

1. Generate the production key: `openssl rand -hex 32`. Set it in the Amplify console and add it to the `.env.production` block in `amplify.yml`.
2. After deploying, enter each set of credentials through the UI and press Test connection.
3. Once all three verify, the corresponding env vars can be removed from `amplify.yml` — the database becomes the source of truth. Keep `CREDENTIALS_KEY`.
4. Rotating the WhatsApp ingest secret means updating it in **both** the settings page and the n8n `Store & Check AI` node header.
