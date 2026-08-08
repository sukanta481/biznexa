# WhatsApp Team Inbox — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Execute one chunk per run, top to bottom. This plan covers the **Next.js app only** — do not touch the n8n workflow. Chunk 5 documents the n8n change for a human to apply.

**Goal:** Add a Chat section to the Biznexa admin panel where a human handles WhatsApp Business conversations, with the existing n8n AI assistant standing down automatically the moment a human replies.

**Architecture:** n8n keeps the Meta webhook and forwards every inbound message to a new app endpoint, which persists it and returns whether the AI should answer. Outbound messages go from the admin UI straight to Meta's Graph API. The UI polls for updates — Amplify's Lambda-based SSR does not support WebSockets.

**Tech Stack:** Next.js 15.5 App Router, React 19, TypeScript, MySQL via `mysql2/promise`, WhatsApp Cloud API v22.0. No new npm dependencies until Chunk 4 (AWS SDK for S3).

---

## Context You Need Before Starting

### How messages flow

```
INBOUND
Meta → n8n WhatsApp Trigger → POST /api/whatsapp/ingest
                              (stores message, returns { ai_enabled })
                                     ↓
                          n8n routes on ai_enabled:
                            true  → existing AI assistant replies
                            false → stops; a human will answer

OUTBOUND
Admin UI → POST /api/admin/chat/conversations/:id/messages
         → app calls Graph API directly
         → stores the outbound row
```

The AI's own replies also come back through `/api/whatsapp/ingest`, so the thread shows one continuous history no matter who answered.

### The two rules that drive the design

**1. The 24-hour window.** Meta only permits free-form messages within 24 hours of the customer's last inbound message. After that the API rejects anything that isn't a pre-approved template. v1 does not implement templates — instead the UI must *show* the window state and disable the composer when it has expired, so an agent is never confused by a silent failure.

**2. AI stands down on human reply.** Sending from the inbox sets `ai_enabled = 0` on that conversation. A toggle in the thread header turns it back on.

### Existing patterns to follow

- Admin API routes live in `src/app/api/admin/**/route.ts` and **must** start with the guard:
  ```ts
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  ```
  from `@/lib/admin-guard`. This is non-negotiable — see `docs/superpowers/plans/2026-08-04-admin-auth-hardening.md` for why.
- Admin pages live in `src/app/admin/(dashboard)/<name>/page.tsx` and delegate to a client component in `src/components/admin/`.
- Database access goes through `query()` from `@/lib/db`. Always use parameterised queries.
- Migrations are plain `.sql` files in `db/`, applied by hand.

### The one endpoint that is NOT admin-guarded

`/api/whatsapp/ingest` is called by n8n, which is not a logged-in admin. It authenticates with a shared secret in the `x-ingest-secret` header, compared using `timingSafeEqual`. It must **never** use `requireAdmin`, and it must **never** be left unauthenticated.

### Environment

Add to `.env.local` and to the `.env.production` block in `amplify.yml`:

```
WHATSAPP_TOKEN=<permanent access token from Meta>
WHATSAPP_PHONE_NUMBER_ID=<from Meta > WhatsApp > API Setup>
WHATSAPP_INGEST_SECRET=<generate: openssl rand -hex 32>
```

`amplify.yml` currently only writes `DB_*` vars. Anything not added there is undefined in production.

### Testing reality

No test runner in this repo, and adding one is out of scope. Verification is a Node script (`scripts/verify-whatsapp-inbox.mjs`, Chunk 1) plus `npx tsc --noEmit` and manual UI checks. `npm run lint` has a **pre-existing** baseline of 13 errors in old `.js` scripts — do not try to fix them and do not treat them as your regression. Compare against the baseline, not against zero.

---

## Chunk 1: Data layer and ingest endpoint

### Task 1: Create the tables

**Files:** Create `db/whatsapp-chat.sql`

- [ ] **Step 1: Write the migration**

```sql
-- WhatsApp team inbox. One contact is one ongoing thread, so contacts and
-- conversations are the same row.

CREATE TABLE IF NOT EXISTS `wa_conversations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `wa_id` VARCHAR(20) NOT NULL COMMENT 'Customer phone in wa_id form, e.g. 918961090050',
  `profile_name` VARCHAR(150) DEFAULT NULL,
  `ai_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `unread_count` INT(11) NOT NULL DEFAULT 0,
  `last_message_at` DATETIME DEFAULT NULL,
  `last_inbound_at` DATETIME DEFAULT NULL COMMENT 'Drives the Meta 24-hour window',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wa_conversations_wa_id` (`wa_id`),
  KEY `idx_wa_conversations_last_message_at` (`last_message_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wa_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` INT(11) NOT NULL,
  `wa_message_id` VARCHAR(128) DEFAULT NULL COMMENT 'Meta wamid; unique gives free idempotency on webhook retries',
  `direction` ENUM('in','out') NOT NULL,
  `type` VARCHAR(32) NOT NULL DEFAULT 'text',
  `text_body` TEXT DEFAULT NULL,
  `media_path` VARCHAR(500) DEFAULT NULL,
  `media_mime` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('pending','sent','delivered','read','failed') NOT NULL DEFAULT 'sent',
  `error_text` TEXT DEFAULT NULL,
  `sent_by` INT(11) DEFAULT NULL COMMENT 'admin_users.id for human replies; NULL for inbound and AI',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wa_messages_wa_message_id` (`wa_message_id`),
  KEY `idx_wa_messages_conversation` (`conversation_id`, `id`),
  CONSTRAINT `fk_wa_messages_conversation`
    FOREIGN KEY (`conversation_id`) REFERENCES `wa_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wa_messages_sent_by`
    FOREIGN KEY (`sent_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

- [ ] **Step 2: Apply locally**

```bash
/c/xampp/mysql/bin/mysql -u root d2w_cms < db/whatsapp-chat.sql
```

- [ ] **Step 3: Verify**

```bash
/c/xampp/mysql/bin/mysql -u root d2w_cms -e "DESCRIBE wa_conversations; DESCRIBE wa_messages;"
```

Expected: 9 columns then 12 columns.

- [ ] **Step 4: Commit**

```bash
git add db/whatsapp-chat.sql
git commit -m "feat(db): add wa_conversations and wa_messages tables for the WhatsApp inbox"
```

---

### Task 2: WhatsApp Cloud API client

**Files:** Create `src/lib/whatsapp.ts`

- [ ] **Step 1: Write the module**

```ts
import "server-only";

const GRAPH_VERSION = "v22.0";

export const WHATSAPP_WINDOW_MS = 24 * 60 * 60 * 1000;

function config() {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error("Missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID.");
  }

  return { token, phoneNumberId };
}

export interface SendResult {
  ok: boolean;
  waMessageId?: string;
  error?: string;
}

/** Sends a plain text message. Only valid inside the 24-hour window. */
export async function sendTextMessage(to: string, body: string): Promise<SendResult> {
  const { token, phoneNumberId } = config();

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: true, body },
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      // Meta nests the useful part at error.message.
      return { ok: false, error: json?.error?.message ?? `Graph API returned ${res.status}` };
    }

    return { ok: true, waMessageId: json?.messages?.[0]?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error calling Graph API" };
  }
}

/** True when a free-form reply is still permitted. */
export function isWithinWindow(lastInboundAt: Date | string | null): boolean {
  if (!lastInboundAt) return false;
  const last = lastInboundAt instanceof Date ? lastInboundAt : new Date(lastInboundAt);
  if (Number.isNaN(last.getTime())) return false;
  return Date.now() - last.getTime() < WHATSAPP_WINDOW_MS;
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/lib/whatsapp.ts
git commit -m "feat(whatsapp): add Cloud API client for sending text messages"
```

---

### Task 3: Conversation data access

**Files:** Create `src/lib/wa-inbox.ts`

Keep all SQL in this module so route handlers stay thin.

- [ ] **Step 1: Write the module**

```ts
import "server-only";

import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { query } from "@/lib/db";

export interface ConversationRow extends RowDataPacket {
  id: number;
  wa_id: string;
  profile_name: string | null;
  ai_enabled: number;
  unread_count: number;
  last_message_at: string | null;
  last_inbound_at: string | null;
}

export interface MessageRow extends RowDataPacket {
  id: number;
  conversation_id: number;
  direction: "in" | "out";
  type: string;
  text_body: string | null;
  media_path: string | null;
  media_mime: string | null;
  status: string;
  error_text: string | null;
  sent_by: number | null;
  created_at: string;
}

/** Finds or creates the conversation for a wa_id. Returns its id. */
export async function upsertConversation(waId: string, profileName: string | null): Promise<number> {
  await query<ResultSetHeader>(
    `INSERT INTO wa_conversations (wa_id, profile_name)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE
       profile_name = COALESCE(VALUES(profile_name), profile_name)`,
    [waId, profileName],
  );

  const rows = await query<ConversationRow[]>(
    `SELECT id FROM wa_conversations WHERE wa_id = ? LIMIT 1`,
    [waId],
  );

  return rows[0].id;
}

export async function getConversation(id: number): Promise<ConversationRow | null> {
  const rows = await query<ConversationRow[]>(
    `SELECT id, wa_id, profile_name, ai_enabled, unread_count, last_message_at, last_inbound_at
       FROM wa_conversations WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function listConversations(): Promise<Array<ConversationRow & { preview: string | null }>> {
  return query<Array<ConversationRow & { preview: string | null }>>(
    `SELECT c.id, c.wa_id, c.profile_name, c.ai_enabled, c.unread_count,
            c.last_message_at, c.last_inbound_at,
            (SELECT m.text_body FROM wa_messages m
              WHERE m.conversation_id = c.id
              ORDER BY m.id DESC LIMIT 1) AS preview
       FROM wa_conversations c
      ORDER BY c.last_message_at DESC, c.id DESC
      LIMIT 200`,
  );
}

export async function listMessages(conversationId: number, limit = 100): Promise<MessageRow[]> {
  const rows = await query<MessageRow[]>(
    `SELECT id, conversation_id, direction, type, text_body, media_path, media_mime,
            status, error_text, sent_by, created_at
       FROM wa_messages
      WHERE conversation_id = ?
      ORDER BY id DESC
      LIMIT ?`,
    [conversationId, limit],
  );
  return rows.reverse(); // oldest first for display
}

export interface RecordMessageInput {
  conversationId: number;
  waMessageId: string | null;
  direction: "in" | "out";
  type?: string;
  textBody: string | null;
  mediaPath?: string | null;
  mediaMime?: string | null;
  status?: "pending" | "sent" | "delivered" | "read" | "failed";
  errorText?: string | null;
  sentBy?: number | null;
}

/**
 * Inserts a message and updates conversation counters.
 * Returns false when the message was a duplicate (Meta retries webhooks).
 */
export async function recordMessage(input: RecordMessageInput): Promise<boolean> {
  try {
    await query<ResultSetHeader>(
      `INSERT INTO wa_messages
         (conversation_id, wa_message_id, direction, type, text_body,
          media_path, media_mime, status, error_text, sent_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.conversationId,
        input.waMessageId,
        input.direction,
        input.type ?? "text",
        input.textBody,
        input.mediaPath ?? null,
        input.mediaMime ?? null,
        input.status ?? "sent",
        input.errorText ?? null,
        input.sentBy ?? null,
      ],
    );
  } catch (err) {
    // Duplicate wa_message_id means Meta redelivered a webhook we already stored.
    if (err && typeof err === "object" && "code" in err && err.code === "ER_DUP_ENTRY") {
      return false;
    }
    throw err;
  }

  if (input.direction === "in") {
    await query<ResultSetHeader>(
      `UPDATE wa_conversations
          SET last_message_at = NOW(), last_inbound_at = NOW(), unread_count = unread_count + 1
        WHERE id = ?`,
      [input.conversationId],
    );
  } else {
    await query<ResultSetHeader>(
      `UPDATE wa_conversations SET last_message_at = NOW() WHERE id = ?`,
      [input.conversationId],
    );
  }

  return true;
}

export async function setAiEnabled(conversationId: number, enabled: boolean): Promise<void> {
  await query<ResultSetHeader>(
    `UPDATE wa_conversations SET ai_enabled = ? WHERE id = ?`,
    [enabled ? 1 : 0, conversationId],
  );
}

export async function markRead(conversationId: number): Promise<void> {
  await query<ResultSetHeader>(
    `UPDATE wa_conversations SET unread_count = 0 WHERE id = ?`,
    [conversationId],
  );
}
```

- [ ] **Step 2: Typecheck and commit**

```bash
npx tsc --noEmit
```

```bash
git add src/lib/wa-inbox.ts
git commit -m "feat(whatsapp): add inbox data access layer"
```

---

### Task 4: The ingest endpoint

**Files:** Create `src/app/api/whatsapp/ingest/route.ts`

This is the only new endpoint not behind `requireAdmin`. It is called by n8n.

- [ ] **Step 1: Write the route**

```ts
import "server-only";

import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { recordMessage, upsertConversation, getConversation } from "@/lib/wa-inbox";

export const runtime = "nodejs";

function secretMatches(provided: string | null): boolean {
  const expected = process.env.WHATSAPP_INGEST_SECRET;
  if (!expected || !provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

interface IngestBody {
  waId?: string;
  profileName?: string | null;
  waMessageId?: string | null;
  direction?: "in" | "out";
  type?: string;
  text?: string | null;
}

export async function POST(request: NextRequest) {
  if (!secretMatches(request.headers.get("x-ingest-secret"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: IngestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const waId = body.waId?.trim();
  if (!waId) {
    return NextResponse.json({ error: "waId is required." }, { status: 400 });
  }

  const conversationId = await upsertConversation(waId, body.profileName?.trim() || null);

  // A body with no text and no message id is a state probe — n8n asking whether
  // the AI should answer, without anything new to store.
  if (body.waMessageId || body.text) {
    await recordMessage({
      conversationId,
      waMessageId: body.waMessageId ?? null,
      direction: body.direction === "out" ? "out" : "in",
      type: body.type ?? "text",
      textBody: body.text ?? null,
    });
  }

  const conversation = await getConversation(conversationId);

  return NextResponse.json({
    ok: true,
    conversationId,
    ai_enabled: conversation ? conversation.ai_enabled === 1 : true,
  });
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/whatsapp/ingest/route.ts
git commit -m "feat(whatsapp): add n8n ingest endpoint with shared-secret auth"
```

---

### Task 5: Verification script

**Files:** Create `scripts/verify-whatsapp-inbox.mjs`

- [ ] **Step 1: Write it**

```js
// Verifies the WhatsApp inbox endpoints.
// Usage: node scripts/verify-whatsapp-inbox.mjs
// Requires: dev server running, WHATSAPP_INGEST_SECRET set in the environment.

const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";
const SECRET = process.env.WHATSAPP_INGEST_SECRET;

let failures = 0;

function report(ok, label, detail) {
  if (ok) console.log(`  PASS  ${label}`);
  else {
    failures += 1;
    console.log(`  FAIL  ${label} — ${detail}`);
  }
}

async function main() {
  console.log(`Verifying WhatsApp inbox at ${BASE}\n`);

  console.log("[1] Admin chat endpoints reject anonymous callers");
  for (const path of [
    "/api/admin/chat/conversations",
    "/api/admin/chat/updates?since=0",
  ]) {
    const res = await fetch(`${BASE}${path}`);
    report(res.status === 401, `GET ${path}`, `got ${res.status}, want 401`);
  }

  console.log("\n[2] Ingest rejects a missing or wrong secret");
  for (const [label, headers] of [
    ["no secret", {}],
    ["wrong secret", { "x-ingest-secret": "definitely-not-the-secret" }],
  ]) {
    const res = await fetch(`${BASE}/api/whatsapp/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify({ waId: "910000000000" }),
    });
    report(res.status === 401, `POST /api/whatsapp/ingest (${label})`, `got ${res.status}, want 401`);
  }

  if (!SECRET) {
    console.log("\n[3] SKIPPED — set WHATSAPP_INGEST_SECRET to test the happy path");
  } else {
    console.log("\n[3] Ingest accepts a valid message");
    const waId = `9199${Date.now().toString().slice(-8)}`;

    const res = await fetch(`${BASE}/api/whatsapp/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ingest-secret": SECRET },
      body: JSON.stringify({
        waId,
        profileName: "Verify Bot",
        waMessageId: `wamid.verify.${Date.now()}`,
        direction: "in",
        text: "hello from the verification script",
      }),
    });
    const json = await res.json().catch(() => ({}));
    report(res.status === 200, "POST /api/whatsapp/ingest (valid)", `got ${res.status}, want 200`);
    report(json.ai_enabled === true, "new conversation defaults to ai_enabled=true", `got ${JSON.stringify(json)}`);

    console.log("\n[4] Duplicate wa_message_id is idempotent");
    const dupId = `wamid.dup.${Date.now()}`;
    const payload = {
      waId,
      waMessageId: dupId,
      direction: "in",
      text: "duplicate test",
    };
    const first = await fetch(`${BASE}/api/whatsapp/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ingest-secret": SECRET },
      body: JSON.stringify(payload),
    });
    const second = await fetch(`${BASE}/api/whatsapp/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ingest-secret": SECRET },
      body: JSON.stringify(payload),
    });
    report(first.status === 200 && second.status === 200, "webhook retry does not error", `got ${first.status}/${second.status}`);
    console.log(`  NOTE  verify by hand that wa_messages has exactly one row for ${dupId}`);
  }

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Verification script crashed:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Run it**

Sections [1] and [2] will fail until Chunk 2 exists — that is expected at this point. Section [2] must pass now.

```bash
node scripts/verify-whatsapp-inbox.mjs
```

Expected now: `[2]` both PASS, `[3]`/`[4]` PASS if the secret is set, `[1]` FAIL with `got 404` (routes not built yet).

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-whatsapp-inbox.mjs
git commit -m "test: add WhatsApp inbox verification script"
```

---

## Chunk 2: Admin API

Every handler in this chunk starts with the `requireAdmin` guard. No exceptions.

### Task 6: Conversation list and updates

**Files:**
- Create `src/app/api/admin/chat/conversations/route.ts`
- Create `src/app/api/admin/chat/updates/route.ts`

- [ ] **Step 1: Conversation list**

```ts
import "server-only";

import { NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { listConversations } from "@/lib/wa-inbox";
import { isWithinWindow } from "@/lib/whatsapp";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const rows = await listConversations();

  return NextResponse.json({
    conversations: rows.map((c) => ({
      id: c.id,
      waId: c.wa_id,
      profileName: c.profile_name,
      aiEnabled: c.ai_enabled === 1,
      unreadCount: c.unread_count,
      lastMessageAt: c.last_message_at,
      windowOpen: isWithinWindow(c.last_inbound_at),
      preview: c.preview,
    })),
  });
}
```

- [ ] **Step 2: Polling endpoint**

Returns only what changed, so the 5-second poll stays cheap.

```ts
import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(request.url);
  const sinceId = Math.max(0, Number.parseInt(searchParams.get("since") ?? "0", 10) || 0);

  const rows = await query<RowDataPacket[]>(
    `SELECT m.id, m.conversation_id, m.direction, m.type, m.text_body,
            m.media_path, m.media_mime, m.status, m.sent_by, m.created_at
       FROM wa_messages m
      WHERE m.id > ?
      ORDER BY m.id ASC
      LIMIT 200`,
    [sinceId],
  );

  const [{ maxId }] = await query<RowDataPacket[]>(
    `SELECT COALESCE(MAX(id), 0) AS maxId FROM wa_messages`,
  ) as unknown as Array<{ maxId: number }>;

  return NextResponse.json({ messages: rows, cursor: maxId });
}
```

- [ ] **Step 3: Typecheck, then commit**

```bash
npx tsc --noEmit
```

```bash
git add src/app/api/admin/chat
git commit -m "feat(chat): add conversation list and polling endpoints"
```

---

### Task 7: Thread read, send, and AI toggle

**Files:**
- Create `src/app/api/admin/chat/conversations/[id]/messages/route.ts`
- Create `src/app/api/admin/chat/conversations/[id]/route.ts`

- [ ] **Step 1: Messages — GET history, POST a reply**

```ts
import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { getConversation, listMessages, markRead, recordMessage, setAiEnabled } from "@/lib/wa-inbox";
import { isWithinWindow, sendTextMessage } from "@/lib/whatsapp";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const conversationId = Number.parseInt(id, 10);
  if (Number.isNaN(conversationId)) {
    return NextResponse.json({ error: "Invalid conversation id." }, { status: 400 });
  }

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const messages = await listMessages(conversationId);
  await markRead(conversationId);

  return NextResponse.json({
    conversation: {
      id: conversation.id,
      waId: conversation.wa_id,
      profileName: conversation.profile_name,
      aiEnabled: conversation.ai_enabled === 1,
      windowOpen: isWithinWindow(conversation.last_inbound_at),
      lastInboundAt: conversation.last_inbound_at,
    },
    messages,
  });
}

export async function POST(request: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const conversationId = Number.parseInt(id, 10);
  if (Number.isNaN(conversationId)) {
    return NextResponse.json({ error: "Invalid conversation id." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Message text is required." }, { status: 400 });
  }

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  if (!isWithinWindow(conversation.last_inbound_at)) {
    return NextResponse.json(
      {
        error:
          "The 24-hour reply window has closed. WhatsApp only allows an approved template message now.",
      },
      { status: 409 },
    );
  }

  const result = await sendTextMessage(conversation.wa_id, text);

  await recordMessage({
    conversationId,
    waMessageId: result.waMessageId ?? null,
    direction: "out",
    textBody: text,
    status: result.ok ? "sent" : "failed",
    errorText: result.ok ? null : result.error ?? "Unknown error",
    sentBy: admin.id,
  });

  // A human has replied, so the AI stands down on this conversation.
  if (result.ok) {
    await setAiEnabled(conversationId, false);
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Failed to send." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, waMessageId: result.waMessageId });
}
```

- [ ] **Step 2: AI toggle**

```ts
import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { getConversation, markRead, setAiEnabled } from "@/lib/wa-inbox";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const conversationId = Number.parseInt(id, 10);
  if (Number.isNaN(conversationId)) {
    return NextResponse.json({ error: "Invalid conversation id." }, { status: 400 });
  }

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));

  if (typeof body.aiEnabled === "boolean") {
    await setAiEnabled(conversationId, body.aiEnabled);
  }

  if (body.markRead === true) {
    await markRead(conversationId);
  }

  const updated = await getConversation(conversationId);

  return NextResponse.json({
    ok: true,
    aiEnabled: updated ? updated.ai_enabled === 1 : true,
  });
}
```

- [ ] **Step 3: Verify the guard count went up**

```bash
grep -rc "await requireAdmin()" src/app/api/admin --include=route.ts | grep -v ":0" | awk -F: '{s+=$2} END {print s}'
```

Expected: `48` (43 existing + 5 new: 2 in Task 6, 3 in Task 7).

- [ ] **Step 4: Run the verification script**

```bash
node scripts/verify-whatsapp-inbox.mjs
```

Expected: sections [1] and [2] all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/chat
git commit -m "feat(chat): add thread history, send, and AI toggle endpoints"
```

---

## Chunk 3: The inbox UI

### Task 8: Chat page and client component

**Files:**
- Create `src/app/admin/(dashboard)/chat/page.tsx`
- Create `src/components/admin/ChatClient.tsx`
- Modify `src/components/admin/Sidebar.tsx`

- [ ] **Step 1: Read the existing patterns first**

Read `src/app/admin/(dashboard)/leads/page.tsx` and `src/components/admin/BlogManagementClient.tsx`. Match their structure, styling conventions, and Tailwind class vocabulary. The admin panel uses a dark theme (`admin-theme`, `bg-[#020617]`) and Material Symbols icon spans. **Do not introduce a different design language.**

- [ ] **Step 2: Build the page shell**

`page.tsx` is a thin server component that renders `<ChatClient />`.

- [ ] **Step 3: Build `ChatClient.tsx`**

Two-pane layout: conversation list on the left, thread on the right. On mobile, show the list, and swap to the thread when one is selected with a back button. Required behaviour:

- Load conversations from `GET /api/admin/chat/conversations`
- Selecting one loads `GET /api/admin/chat/conversations/:id/messages` and clears its unread badge
- Inbound messages left-aligned; outbound right-aligned. Show the sender for outbound (`sent_by` null means the AI answered)
- Composer posts to `POST /api/admin/chat/conversations/:id/messages`
- **When `windowOpen` is false, disable the composer** and show: "The 24-hour reply window has closed. WhatsApp only allows an approved template message now."
- Failed messages render with a distinct style and their `error_text`
- AI toggle in the thread header calls `PATCH /api/admin/chat/conversations/:id`. Label it clearly — on means the AI answers this contact automatically
- Poll `GET /api/admin/chat/updates?since=<cursor>` every 5 seconds. **Pause polling when `document.hidden` is true** and resume on focus. Keep the returned `cursor` in state

Respect `useReducedMotionSafe` from `src/components/ui/Animations.tsx` for any transitions — this user browses with reduced motion enabled.

- [ ] **Step 4: Add the sidebar entry**

In `src/components/admin/Sidebar.tsx`, add to the `Main` group directly after Dashboard:

```ts
{ href: '/admin/chat', icon: 'chat', label: 'Chat' },
```

- [ ] **Step 5: Verify by hand**

Start the dev server, log in, open `/admin/chat`. Then simulate an inbound message:

```bash
curl -sS -X POST http://localhost:3000/api/whatsapp/ingest -H "content-type: application/json" -H "x-ingest-secret: $WHATSAPP_INGEST_SECRET" -d '{"waId":"919999999999","profileName":"Test Lead","waMessageId":"wamid.test.1","direction":"in","text":"Hi, I need a website"}'
```

Expected: the conversation appears in the list within 5 seconds without a manual refresh.

- [ ] **Step 6: Typecheck and commit**

```bash
npx tsc --noEmit
```

```bash
git add src/app/admin src/components/admin
git commit -m "feat(chat): add the WhatsApp inbox UI"
```

---

## Chunk 4: Media via S3

**Do not start this chunk until Chunks 1-3 are reviewed.** It adds a dependency and touches an existing route.

### Task 9: S3 storage helper and upload fix

Media on WhatsApp expires from Meta's servers after 30 days, so it must be copied somewhere durable. Amplify's SSR filesystem is ephemeral — this is also why `/api/admin/upload` writing to `public/uploads` does not work in production today.

- [ ] **Step 1: Add the dependency**

```bash
npm install @aws-sdk/client-s3
```

- [ ] **Step 2: Create `src/lib/storage.ts`** exposing `putObject(key, body, contentType)` returning a public URL, configured from `S3_BUCKET` and `S3_REGION`.

- [ ] **Step 3: Extend `src/lib/whatsapp.ts`** with `downloadMedia(mediaId)` — two Graph calls: `GET /{mediaId}` for the URL, then fetch that URL with the bearer token.

- [ ] **Step 4: Extend the ingest route** to accept `mediaId` + `mimeType`, download, store to S3, and save the resulting URL in `media_path`.

- [ ] **Step 5: Render media in `ChatClient.tsx`** — images inline, everything else as a download link.

- [ ] **Step 6: Repoint `/api/admin/upload`** at `putObject` instead of `writeFile`. Existing committed files under `public/uploads` keep working; only new uploads change destination.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(chat): store WhatsApp media on S3 and fix the admin upload route"
```

---

## Chunk 5: n8n wiring — HUMAN ONLY

**Do not attempt this as an executor.** It is done in the n8n editor.

The tricky part: in n8n, `$json` refers to the *previous node's output*. Inserting an HTTP Request node mid-flow silently rebinds `$json` for everything downstream, which would break the existing `Normalize Lead + Card Details` and `Card Scan or Menu Tap` expressions.

Changes to **Visiting Card QR to WhatsApp Funnel** (`Mniq9AGztKP3Ozj0`):

1. Add an **HTTP Request** node named `Store & Check AI` after `Normalize Lead + Card Details`:
   - `POST https://www.biznexa.tech/api/whatsapp/ingest`
   - Header `x-ingest-secret` = the value of `WHATSAPP_INGEST_SECRET`
   - JSON body:
     ```
     {
       "waId": "{{ $json.waId }}",
       "profileName": "{{ $json.leadName }}",
       "waMessageId": "{{ $json.messageId }}",
       "direction": "in",
       "text": "{{ $json.msgText }}"
     }
     ```

2. Add an **IF** node named `AI Enabled?` after it, testing `{{ $json.ai_enabled }}` is true.

3. Rewire `AI Enabled?` **true** → `Card Scan or Menu Tap`. Leave false unconnected.

4. **Update every downstream expression that uses bare `$json`** to reference the Normalize node explicitly:
   - `Card Scan or Menu Tap` conditions → `{{ $('Normalize Lead + Card Details').item.json.msgText }}` and `.buttonId`
   - `Send Contact Card` → `$('Normalize Lead + Card Details').item.json.phoneNumberId`, `.waId`, and the brand fields
   - `Build Menu Reply` → `.buttonId` and the URL fields
   - `Send Menu Reply` → `.phoneNumberId`, `.waId`, and `$json.replyText` (that one stays, it comes from Build Menu Reply)

5. Also log the AI's own replies: add a second `Store & Check AI`-style node after `Send AI Reply` posting `direction: "out"` with the AI's text, so the inbox shows a complete thread.

Test by messaging the business number, then confirm the message appears in `/admin/chat`.

---

## Definition of Done

- [ ] `node scripts/verify-whatsapp-inbox.mjs` passes fully
- [ ] Guard count is `48`
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run lint` shows no *new* errors beyond the 13-error baseline
- [ ] `/admin/chat` lists conversations, opens threads, and sends replies
- [ ] Sending a reply flips `ai_enabled` to 0; the toggle flips it back
- [ ] Composer is disabled with an explanation when the 24-hour window has closed
- [ ] New inbound messages appear within 5 seconds without a refresh
- [ ] Polling stops when the tab is hidden
- [ ] `WHATSAPP_*` vars added to `amplify.yml`
