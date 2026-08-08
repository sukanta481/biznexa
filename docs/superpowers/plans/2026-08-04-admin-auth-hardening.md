# Biznexa Admin Auth Hardening + SEO Fixes — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Work chunk by chunk, in order. Chunk 1 is a live production security fix — do not reorder it behind anything else.

**Goal:** Close a live, unauthenticated-access vulnerability on all Biznexa admin API routes, replace the forgeable session cookie with real DB-backed sessions, then fix the site's missing SEO primitives.

**Architecture:** Sessions become a database record. Login mints a 32-byte random token, stores only its SHA-256 hash in a new `admin_sessions` table, and puts the raw token in an httpOnly cookie. `getCurrentAdmin()` resolves the cookie by hashing it and joining to `admin_users`. Every admin API route handler gains a two-line guard calling that resolver. The existing Next.js middleware stays as a UX redirect only — it runs on the edge runtime and cannot reach MySQL, so it is explicitly **not** the security boundary.

**Tech Stack:** Next.js 15.5 (App Router), React 19, TypeScript, MySQL via `mysql2/promise`, Node `crypto` (no new dependencies), deployed on AWS Amplify behind CloudFront.

---

## Context You Need Before Starting

Read this section fully. It explains the bug you are fixing.

### The current vulnerability (two independent defects)

**Defect A — the session token is never checked.**
`src/lib/auth.ts:77` generates `randomBytes(32)` as a token. `setSessionCookie` (auth.ts:92) writes it into the cookie as `` `${userId}:${token}` ``. But `getCurrentAdmin` (auth.ts:110-141) splits that string, takes **only** `parts[0]` as the user ID, and queries `admin_users` by ID. The token half is discarded and is stored nowhere — there is no sessions table in the schema. Therefore the cookie value `admin_session=1:anything` authenticates as admin user 1.

**Defect B — the admin API has no auth at all.**
`src/middleware.ts:37` declares `matcher: ["/admin/:path*"]`. That pattern does not match `/api/admin/*`. Of 31 route files under `src/app/api/admin/`, exactly one (`auth/me/route.ts`) calls `getCurrentAdmin`. The other 30 query the database directly with no identity check. This is confirmed live: anonymous `GET https://www.biznexa.tech/api/admin/leads` (and `/clients`, `/bills`, `/expenses`, `/dashboard`) returns `200` with real data.

Defect B is the one leaking customer data right now. Fix both together — fixing only B leaves the forgeable cookie, and fixing only A leaves the API wide open.

### Why the guard goes in route handlers, not middleware

Next.js middleware runs on the edge runtime. `mysql2` is a Node TCP client and cannot run there. So middleware cannot verify a token against the database. Do **not** try to "fix" this by extending the middleware matcher to `/api/admin/:path*` — a cookie-existence check is trivially forged, it would return an HTML redirect instead of a JSON 401 (breaking every client-side fetch in the admin UI), and it would block the login route. The per-route guard is the real boundary.

### Testing reality

This repo has **no test runner** — no `test` script, no vitest/jest in `package.json`. Adding one is out of scope for a security hotfix. Instead you will write `scripts/verify-admin-auth.mjs`, a zero-dependency Node script that makes real HTTP requests against a running dev server and asserts status codes. Write it **first**, watch it fail, then make it pass. It verifies the actual security property (401 vs 200), which is what matters here.

Consider adding vitest in a follow-up so `src/lib/auth.ts` can get proper unit tests. Not now.

### Environment setup

```bash
cp .env.example .env.local
```

Fill in `DB_LOCAL_*` for your XAMPP MySQL. Keep `DB_TARGET=local` while developing — **never point a dev server at `DB_TARGET=live` while testing auth changes.**

Run the dev server with:

```bash
npm run dev
```

---

## File Structure

| Path | Status | Responsibility |
|---|---|---|
| `db/admin-sessions.sql` | Create | Migration: `admin_sessions` table |
| `src/lib/auth.ts` | Modify | Session create/resolve/destroy against DB; scrypt password hashing |
| `src/lib/admin-guard.ts` | Create | `requireAdmin()` + `unauthorized()` helpers used by route handlers |
| `src/lib/rate-limit.ts` | Create | In-memory login throttle |
| `src/app/api/admin/**/route.ts` (28 files) | Modify | Add guard to all 43 handlers |
| `src/app/api/admin/auth/login/route.ts` | Modify | Mint DB session; apply rate limit |
| `src/app/api/admin/auth/logout/route.ts` | Modify | Delete DB session row |
| `src/app/api/admin/upload/route.ts` | Modify | Guard + drop SVG + magic-byte check |
| `src/middleware.ts` | Modify | Comment-only: document that it is not the security boundary |
| `scripts/verify-admin-auth.mjs` | Create | Integration verification of the auth boundary |
| `scripts/generate-password-hash.js` | Modify | Emit scrypt hashes |
| `src/app/robots.ts` | Create | Native App Router robots.txt |
| `src/app/sitemap.ts` | Create | Native App Router sitemap.xml |
| `src/lib/constants.ts:21` | Modify | Canonical host → `https://www.biznexa.tech` |
| `src/app/layout.tsx` | Modify | Add `alternates.canonical` |

---

## Chunk 1: Close the auth hole

This chunk alone stops the data leak. Deploy it as soon as it is verified — do not wait for chunks 2-4.

### Task 1: Write the failing verification script

**Files:**
- Create: `scripts/verify-admin-auth.mjs`

- [ ] **Step 1: Write the verification script**

```js
// Verifies the admin API auth boundary.
// Usage: node scripts/verify-admin-auth.mjs
// Optional: VERIFY_BASE_URL, VERIFY_USERNAME, VERIFY_PASSWORD

const BASE = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";

// Every admin endpoint that must reject anonymous callers.
const PROTECTED = [
  ["GET", "/api/admin/leads"],
  ["GET", "/api/admin/clients"],
  ["GET", "/api/admin/bills"],
  ["GET", "/api/admin/bills/init"],
  ["GET", "/api/admin/expenses"],
  ["GET", "/api/admin/dashboard"],
  ["GET", "/api/admin/settings/site"],
  ["GET", "/api/admin/inspection/dashboard"],
  ["GET", "/api/admin/inspection/files"],
  ["GET", "/api/admin/inspection/files/stats"],
  ["GET", "/api/admin/inspection/files/branches"],
  ["GET", "/api/admin/inspection/files/init"],
  ["GET", "/api/admin/inspection/files/lookups"],
  ["GET", "/api/admin/inspection/files/export"],
  ["GET", "/api/admin/inspection/masters/banks"],
  ["POST", "/api/admin/clients"],
  ["POST", "/api/admin/expenses"],
  ["POST", "/api/admin/blog"],
  ["POST", "/api/admin/upload"],
  ["PUT", "/api/admin/content/homepage"],
  ["PUT", "/api/admin/content/about"],
  ["PUT", "/api/admin/content/services"],
  ["PUT", "/api/admin/content/case-studies"],
];

// Cookie values that must NOT authenticate.
const FORGED = [
  "admin_session=1:deadbeef",
  "admin_session=1:",
  "admin_session=2:0000000000000000000000000000000000000000000000000000000000000000",
  "admin_session=" + "a".repeat(64),
];

let failures = 0;

function report(ok, label, detail) {
  if (ok) {
    console.log(`  PASS  ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${label} — ${detail}`);
  }
}

async function call(method, path, cookie) {
  const headers = {};
  if (cookie) headers.cookie = cookie;
  // Send an empty JSON body on writes so a 400 from body parsing cannot be
  // mistaken for a 401 from the auth guard.
  if (method !== "GET") {
    headers["content-type"] = "application/json";
  }
  return fetch(`${BASE}${path}`, {
    method,
    headers,
    body: method === "GET" ? undefined : "{}",
    redirect: "manual",
  });
}

async function checkAnonymous() {
  console.log("\n[1] Anonymous requests must return 401");
  for (const [method, path] of PROTECTED) {
    const res = await call(method, path);
    report(res.status === 401, `${method} ${path}`, `got ${res.status}, want 401`);
  }
}

async function checkForged() {
  console.log("\n[2] Forged session cookies must return 401");
  for (const cookie of FORGED) {
    const res = await call("GET", "/api/admin/leads", cookie);
    report(res.status === 401, `cookie "${cookie.slice(0, 40)}"`, `got ${res.status}, want 401`);
  }
}

async function checkLoginWorks() {
  const username = process.env.VERIFY_USERNAME;
  const password = process.env.VERIFY_PASSWORD;
  if (!username || !password) {
    console.log("\n[3] SKIPPED — set VERIFY_USERNAME and VERIFY_PASSWORD to test the happy path");
    return;
  }

  console.log("\n[3] A real login must be granted access");

  const res = await fetch(`${BASE}/api/admin/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  report(res.status === 200, "POST /api/admin/auth/login", `got ${res.status}, want 200`);

  const setCookie = res.headers.get("set-cookie") ?? "";
  const token = setCookie.split(";")[0];
  report(/^admin_session=[a-f0-9]{64}$/.test(token), "cookie is a bare 64-char hex token", `got "${token}"`);

  const authed = await call("GET", "/api/admin/leads", token);
  report(authed.status === 200, "GET /api/admin/leads with real session", `got ${authed.status}, want 200`);

  const out = await call("POST", "/api/admin/auth/logout", token);
  report(out.status === 200, "POST /api/admin/auth/logout", `got ${out.status}, want 200`);

  const afterLogout = await call("GET", "/api/admin/leads", token);
  report(afterLogout.status === 401, "session is dead after logout", `got ${afterLogout.status}, want 401`);
}

async function main() {
  console.log(`Verifying admin auth boundary at ${BASE}`);
  await checkAnonymous();
  await checkForged();
  await checkLoginWorks();

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Verification script crashed:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Run it against the current code to confirm it fails**

Start the dev server in one terminal (`npm run dev`), then:

```bash
node scripts/verify-admin-auth.mjs
```

Expected: section [1] shows `FAIL` on essentially every line with `got 200, want 401`. Section [2] shows `FAIL` on the `1:deadbeef` cookie. **This failure is the bug reproduced.** If section [1] already passes, stop — you are pointed at the wrong server.

- [ ] **Step 3: Commit the script**

```bash
git add scripts/verify-admin-auth.mjs
git commit -m "test: add admin auth boundary verification script (currently failing)"
```

---

### Task 2: Create the sessions table

**Files:**
- Create: `db/admin-sessions.sql`

Note: `admin_users` is defined in `db/d2w_cms_export.sql:59`, not `db/schema.sql`. Migrations in this repo are plain `.sql` files applied by hand.

- [ ] **Step 1: Write the migration**

```sql
-- Real server-side sessions for the admin panel.
-- Before this table existed, the session cookie carried a user ID that was
-- trusted without verification, so any cookie value authenticated.

CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `token_hash` CHAR(64) NOT NULL COMMENT 'SHA-256 of the raw cookie token; raw token is never stored',
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `ip` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_sessions_token_hash` (`token_hash`),
  KEY `idx_admin_sessions_user_id` (`user_id`),
  KEY `idx_admin_sessions_expires_at` (`expires_at`),
  CONSTRAINT `fk_admin_sessions_user`
    FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

- [ ] **Step 2: Apply it locally**

```bash
mysql -u root d2w_cms < db/admin-sessions.sql
```

- [ ] **Step 3: Verify the table exists**

```bash
mysql -u root d2w_cms -e "DESCRIBE admin_sessions;"
```

Expected: 7 rows — `id`, `user_id`, `token_hash`, `expires_at`, `created_at`, `user_agent`, `ip`.

- [ ] **Step 4: Commit**

```bash
git add db/admin-sessions.sql
git commit -m "feat(db): add admin_sessions table for server-side session storage"
```

---

### Task 3: Make sessions real in `src/lib/auth.ts`

**Files:**
- Modify: `src/lib/auth.ts`

- [ ] **Step 1: Add the token hashing helper and session constants**

Replace lines 8-10 (the constants block) with:

```ts
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_REMEMBER = 60 * 60 * 24 * 7; // 7 days
const SESSION_MAX_AGE_DEFAULT = 60 * 60 * 24; // 1 day
const PEPPER = process.env.AUTH_PEPPER || process.env.APP_SECRET || "biznexa-auth-pepper-2026";

/** The cookie carries the raw token; only this hash is ever persisted. */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
```

- [ ] **Step 2: Replace `authenticateAdmin`'s token minting with session creation**

In `authenticateAdmin`, delete these lines (currently auth.ts:77-89):

```ts
  const token = randomBytes(32).toString("hex");

  return {
    user: { ... },
    token,
  };
```

and replace with a plain user return (the caller will create the session):

```ts
  return {
    user: {
      id: user.id as number,
      username: user.username as string,
      email: user.email as string,
      full_name: user.full_name as string,
      role: user.role as string,
      avatar: user.avatar as string | null,
    },
  };
```

Update its signature on auth.ts:48 from `Promise<{ user: AdminUser; token: string } | null>` to `Promise<{ user: AdminUser } | null>`.

- [ ] **Step 3: Replace `setSessionCookie` with `createSession`**

Delete the whole `setSessionCookie` function (auth.ts:92-103) and add:

```ts
export async function createSession(
  userId: number,
  remember: boolean,
  meta: { userAgent?: string | null; ip?: string | null } = {},
): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const maxAge = remember ? SESSION_MAX_AGE_REMEMBER : SESSION_MAX_AGE_DEFAULT;

  await query<ResultSetHeader>(
    `INSERT INTO admin_sessions (user_id, token_hash, expires_at, user_agent, ip)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND), ?, ?)`,
    [userId, hashToken(token), maxAge, meta.userAgent?.slice(0, 255) ?? null, meta.ip?.slice(0, 45) ?? null],
  );

  // Opportunistic cleanup so the table cannot grow without bound.
  await query<ResultSetHeader>(`DELETE FROM admin_sessions WHERE expires_at < NOW()`);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}
```

- [ ] **Step 4: Make `clearSessionCookie` delete the DB row too**

Replace `clearSessionCookie` (auth.ts:105-108) with:

```ts
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (raw && /^[a-f0-9]{64}$/.test(raw)) {
    await query<ResultSetHeader>(`DELETE FROM admin_sessions WHERE token_hash = ?`, [hashToken(raw)]);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
```

- [ ] **Step 5: Rewrite `getCurrentAdmin` to actually verify the token**

Replace the entire `getCurrentAdmin` function (auth.ts:110-141) with:

```ts
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) return null;

  // Anything that is not a bare 64-char hex token is rejected outright. This
  // also invalidates every legacy "userId:token" cookie, which was forgeable.
  if (!/^[a-f0-9]{64}$/.test(raw)) return null;

  const rows = await query<RowDataPacket[]>(
    `SELECT u.id, u.username, u.email, u.full_name, u.role, u.avatar
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ?
        AND s.expires_at > NOW()
        AND u.status = 'active'
      LIMIT 1`,
    [hashToken(raw)],
  );

  if (!rows.length) return null;

  const user = rows[0];
  return {
    id: user.id as number,
    username: user.username as string,
    email: user.email as string,
    full_name: user.full_name as string,
    role: user.role as string,
    avatar: user.avatar as string | null,
  };
}
```

- [ ] **Step 6: Typecheck**

```bash
npx tsc --noEmit
```

Expected: errors **only** in `src/app/api/admin/auth/login/route.ts` and `logout/route.ts`, because they still call the removed `setSessionCookie` / `clearSessionCookie`. Task 4 fixes those. Any other error means you changed something you should not have.

---

### Task 4: Update the login and logout routes

**Files:**
- Modify: `src/app/api/admin/auth/login/route.ts`
- Modify: `src/app/api/admin/auth/logout/route.ts`

- [ ] **Step 1: Rewrite the login route**

```ts
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, remember } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    const result = await authenticateAdmin(username.trim(), password);

    if (!result) {
      return NextResponse.json({ error: "Invalid credentials or account is inactive." }, { status: 401 });
    }

    await createSession(result.user.id, remember === true, {
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return NextResponse.json({ ok: true, user: result.user });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
```

- [ ] **Step 2: Rewrite the logout route**

```ts
import "server-only";
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

Expected: clean, no errors.

- [ ] **Step 4: Manually confirm login still works**

Restart `npm run dev`, open `http://localhost:3000/admin/login`, log in with a real account. You should land on the dashboard. Then confirm the session is now a real DB row:

```bash
mysql -u root d2w_cms -e "SELECT id, user_id, LEFT(token_hash,12) AS hash, expires_at FROM admin_sessions;"
```

Expected: at least one row.

> If login fails here, it is almost certainly the pre-existing password-hash problem, not your change: `authenticateAdmin` rejects any stored hash that does not start with `$sha256$` (auth.ts:63). Use `node scripts/generate-password-hash.js` to mint a compatible hash and update the row. Chunk 2 replaces this scheme properly.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts src/app/api/admin/auth/login/route.ts src/app/api/admin/auth/logout/route.ts
git commit -m "fix(auth): store sessions in the database and verify the token on every read

The session cookie previously carried a user ID that was trusted without
verification, so any forged cookie value authenticated as that user."
```

---

### Task 5: Add the route guard helper

**Files:**
- Create: `src/lib/admin-guard.ts`

- [ ] **Step 1: Write the helper**

```ts
import "server-only";

import { NextResponse } from "next/server";

import { getCurrentAdmin, type AdminUser } from "@/lib/auth";

/**
 * Resolves the caller's admin identity, optionally restricted to given roles.
 * Returns null when the caller is anonymous, their session is expired or
 * forged, their account is inactive, or their role is not permitted.
 *
 * This is the security boundary for the admin API. `src/middleware.ts` is not
 * — it runs on the edge runtime and cannot reach the database.
 */
export async function requireAdmin(roles?: string[]): Promise<AdminUser | null> {
  const user = await getCurrentAdmin();
  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;
  return user;
}

/** Standard rejection response for the admin API. */
export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/admin-guard.ts
git commit -m "feat(auth): add requireAdmin guard helper for admin API routes"
```

---

### Task 6: Guard all 43 admin API handlers

**Files (28 route files, 43 exported handlers):**

| File | Handlers |
|---|---|
| `src/app/api/admin/bills/route.ts` | GET, POST |
| `src/app/api/admin/bills/init/route.ts` | GET |
| `src/app/api/admin/bills/[id]/route.ts` | GET, PATCH, DELETE |
| `src/app/api/admin/bills/[id]/email/route.ts` | POST |
| `src/app/api/admin/bills/[id]/payment/route.ts` | POST |
| `src/app/api/admin/blog/route.ts` | POST |
| `src/app/api/admin/clients/route.ts` | GET, POST |
| `src/app/api/admin/clients/[id]/route.ts` | GET, PATCH, DELETE |
| `src/app/api/admin/content/about/route.ts` | PUT |
| `src/app/api/admin/content/case-studies/route.ts` | PUT |
| `src/app/api/admin/content/homepage/route.ts` | PUT |
| `src/app/api/admin/content/services/route.ts` | PUT |
| `src/app/api/admin/dashboard/route.ts` | GET |
| `src/app/api/admin/expenses/route.ts` | GET, POST |
| `src/app/api/admin/expenses/[id]/route.ts` | PATCH, DELETE |
| `src/app/api/admin/inspection/dashboard/route.ts` | GET |
| `src/app/api/admin/inspection/files/route.ts` | GET, POST |
| `src/app/api/admin/inspection/files/[id]/route.ts` | GET, PATCH, DELETE |
| `src/app/api/admin/inspection/files/branches/route.ts` | GET |
| `src/app/api/admin/inspection/files/export/route.ts` | GET |
| `src/app/api/admin/inspection/files/init/route.ts` | GET |
| `src/app/api/admin/inspection/files/lookups/route.ts` | GET |
| `src/app/api/admin/inspection/files/stats/route.ts` | GET |
| `src/app/api/admin/inspection/masters/[entity]/route.ts` | GET, POST |
| `src/app/api/admin/inspection/masters/[entity]/[id]/route.ts` | GET, PATCH, DELETE |
| `src/app/api/admin/leads/route.ts` | GET |
| `src/app/api/admin/settings/site/route.ts` | GET, POST |
| `src/app/api/admin/upload/route.ts` | POST |

Do **not** touch the three files under `src/app/api/admin/auth/` — login and logout must stay reachable anonymously, and `me` already calls `getCurrentAdmin`.

- [ ] **Step 1: Apply the guard to every handler**

For each file above, add the import at the top:

```ts
import { requireAdmin, unauthorized } from "@/lib/admin-guard";
```

Then make the **first two statements** of every exported handler:

```ts
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
```

Placement rules:
- The guard goes before anything else — before `request.json()`, before reading `searchParams`, before awaiting `params`. Reject unauthenticated callers before doing any work.
- Put it inside the `try` block if the handler already opens with one; otherwise as the first lines of the function body.
- If a handler does not currently use its `request` argument, this change does not require adding one.
- If TypeScript complains that `admin` is unused, that is expected and fine — it is a `const`, not an import. Do not rename it to `_admin`; later tasks may use it.

Worked example — `src/app/api/admin/leads/route.ts:21`:

```ts
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  // ...rest unchanged
}
```

- [ ] **Step 2: Verify every handler is covered by counting**

```bash
grep -rc "await requireAdmin()" src/app/api/admin --include=route.ts | grep -v ":0" | awk -F: '{s+=$2} END {print s}'
```

Expected output: `43`

If the number is lower, find the gap:

```bash
grep -rLn "requireAdmin" src/app/api/admin --include=route.ts
```

Expected: exactly three files listed, all under `auth/` (`login`, `logout`, `me`).

- [ ] **Step 3: Typecheck and lint**

```bash
npx tsc --noEmit
```

```bash
npm run lint
```

Expected: both clean.

- [ ] **Step 4: Run the verification script — it must now pass**

With `npm run dev` running:

```bash
node scripts/verify-admin-auth.mjs
```

Expected: sections [1] and [2] all `PASS`, and `ALL CHECKS PASSED`. Then run the happy path too:

```bash
VERIFY_USERNAME=your-admin VERIFY_PASSWORD=your-password node scripts/verify-admin-auth.mjs
```

Expected: section [3] also all `PASS`, including `session is dead after logout`.

- [ ] **Step 5: Click through the admin UI**

Log in and visit Leads, Clients, Bills, Expenses, Inspections → Files, and Settings → Site. Every page must load data as before. A page that now shows an error means its fetch lost the cookie — check that the client `fetch` call is same-origin (it should be; none of these use absolute URLs).

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin
git commit -m "fix(security): require an authenticated admin on all 43 admin API handlers

The middleware matcher only covered /admin/*, so every /api/admin/* route was
reachable anonymously. Verified live: GET /api/admin/leads returned 200 with
customer data to unauthenticated callers."
```

---

### Task 7: Document the middleware's real role

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add the clarifying comment**

Insert above `export async function middleware` (middleware.ts:7):

```ts
// UX ONLY — this is not a security boundary.
//
// Middleware runs on the edge runtime and cannot reach MySQL, so it can only
// check that a cookie is present, never that it is valid. Its job is to bounce
// logged-out users to the login page instead of showing them an empty shell.
//
// The real check is requireAdmin() in src/lib/admin-guard.ts, called by every
// admin API handler. Do not extend the matcher below to /api/admin/* — a
// cookie-existence check is trivially forged, and it would return an HTML
// redirect where the admin UI expects a JSON 401.
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "docs(auth): clarify that middleware is a UX redirect, not the security boundary"
```

---

### Task 8: Deploy chunk 1 and confirm the live fix

- [ ] **Step 1: Apply the migration to production**

Connect to the live database (Aurora endpoint from `DB_LIVE_HOST`) and run `db/admin-sessions.sql`. Do this **before** deploying the code — the new code inserts into `admin_sessions` on login.

- [ ] **Step 2: Push and let Amplify build**

```bash
git push origin main
```

- [ ] **Step 3: Verify against production**

```bash
VERIFY_BASE_URL=https://www.biznexa.tech node scripts/verify-admin-auth.mjs
```

Expected: `ALL CHECKS PASSED`. Every endpoint that returned `200` in the original report must now return `401`.

- [ ] **Step 4: Log in on production**

Existing admin cookies are now invalid by design (they fail the 64-hex-char format check), so you will be logged out. Log in again and confirm the dashboard works.

**Rotate the admin password after this deploy.** The credentials were exposed for as long as the API was open, and you cannot tell from logs alone whether anyone used them.

---

## Chunk 2: Password hashing, login throttle, upload hardening

Lower urgency than chunk 1, but all three are real weaknesses.

### Task 9: Replace SHA-256 password hashing with scrypt

**Files:**
- Modify: `src/lib/auth.ts`
- Modify: `scripts/generate-password-hash.js`

Current hashing (auth.ts:21-25) is a **single round** of SHA-256 over `salt + password + PEPPER`. SHA-256 is built for speed, which is exactly wrong for passwords — a commodity GPU tries billions per second. `bcryptjs` is still listed in `package.json` but nothing imports it; the comment at auth.ts:64 says it was dropped over webpack issues. Use Node's built-in `scrypt` instead: memory-hard, zero new dependencies, no bundler problems.

- [ ] **Step 1: Add scrypt hashing alongside the legacy verifier**

Add to the imports on auth.ts:4:

```ts
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
```

Replace `hashPassword` and `verifyPassword` (auth.ts:21-46) with:

```ts
const SCRYPT_KEYLEN = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password + PEPPER, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS).toString("hex");
  return `$scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split("$");
  if (parts.length !== 4) return false;

  const [, scheme, salt, expected] = parts;

  let computed: string;
  if (scheme === "scrypt") {
    computed = scryptSync(password + PEPPER, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS).toString("hex");
  } else if (scheme === "sha256") {
    // Legacy scheme. Still verified so existing accounts can log in once and be
    // transparently upgraded by authenticateAdmin.
    computed = createHash("sha256").update(salt + password + PEPPER).digest("hex");
  } else {
    return false;
  }

  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(computed, "hex"));
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Upgrade legacy hashes on successful login**

In `authenticateAdmin`, find the block that rejects any hash not starting with `$sha256$` (the comment reads "Old bcrypt hash — can't verify without bcryptjs") together with the `isValid` check just below it. Line numbers have shifted since Task 3, so match on the code, not a line number. Replace both with:

```ts
  const isValid = verifyPassword(password, passwordHash);
  if (!isValid) return null;

  // Transparently migrate legacy SHA-256 hashes now that we have the plaintext.
  if (passwordHash.startsWith("$sha256$")) {
    await query<ResultSetHeader>(
      `UPDATE admin_users SET password = ? WHERE id = ?`,
      [hashPassword(password), user.id],
    );
  }
```

- [ ] **Step 3: Update the hash generator script**

`scripts/generate-password-hash.js` emits the old format. Update it to produce `$scrypt$` hashes using the same parameters (`N: 16384, r: 8, p: 1`, keylen 64, `password + PEPPER` as input, hex salt). Read the existing file first and keep its CLI shape.

- [ ] **Step 4: Verify round-trip and legacy upgrade**

Log in with an existing account, then check the stored hash changed scheme:

```bash
mysql -u root d2w_cms -e "SELECT username, LEFT(password, 8) AS scheme FROM admin_users;"
```

Expected: `$scrypt$` (was `$sha256$`). Log out and log back in to confirm the new hash verifies.

- [ ] **Step 5: Drop the unused dependency**

```bash
npm uninstall bcryptjs @types/bcryptjs
```

Confirm nothing imported it:

```bash
grep -rn "bcrypt" src/ scripts/
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth.ts scripts/generate-password-hash.js package.json package-lock.json
git commit -m "fix(auth): hash passwords with scrypt instead of single-round SHA-256"
```

---

### Task 10: Throttle login attempts

**Files:**
- Create: `src/lib/rate-limit.ts`
- Modify: `src/app/api/admin/auth/login/route.ts`

- [ ] **Step 1: Write the limiter**

```ts
import "server-only";

type Bucket = { count: number; resetAt: number };

declare global {
  var __biznexaRateLimits: Map<string, Bucket> | undefined;
}

function buckets(): Map<string, Bucket> {
  if (!globalThis.__biznexaRateLimits) {
    globalThis.__biznexaRateLimits = new Map();
  }
  return globalThis.__biznexaRateLimits;
}

/**
 * Fixed-window limiter. Per-instance and in-memory — good enough to stop
 * credential stuffing from a single source, not a distributed attack.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const store = buckets();
  const bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  return { allowed: true, retryAfter: 0 };
}

/** Clears the window after a successful login so one user is not punished. */
export function resetRateLimit(key: string): void {
  buckets().delete(key);
}
```

- [ ] **Step 2: Apply it in the login route**

Add the import, then insert immediately after `body` is destructured:

```ts
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }
```

And after `createSession(...)` succeeds:

```ts
  resetRateLimit(`login:${ip}`);
```

- [ ] **Step 3: Verify**

```bash
for i in $(seq 1 12); do curl -sS -o /dev/null -w "%{http_code} " -X POST http://localhost:3000/api/admin/auth/login -H "content-type: application/json" -d '{"username":"nope","password":"nope"}'; done; echo
```

Expected: ten `401`s followed by `429 429`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/rate-limit.ts src/app/api/admin/auth/login/route.ts
git commit -m "feat(auth): rate-limit admin login attempts per IP"
```

---

### Task 11: Harden the upload route

**Files:**
- Modify: `src/app/api/admin/upload/route.ts`

The guard from Task 6 is already applied. Two problems remain: `image/svg+xml` is in `ALLOWED_TYPES`, and the declared MIME type is trusted without inspecting the bytes. An SVG is an HTML document — it can carry `<script>`, and these files are served from the same origin, so an uploaded SVG is stored XSS.

- [ ] **Step 1: Remove SVG from the allowlist**

Delete `"image/svg+xml",` from `ALLOWED_TYPES`.

> Check first whether the admin UI currently uploads SVGs — `public/uploads/` contains at least one (`1774642455920-google_stitch_blog_cover_image.svg`, referenced by a blog post). Existing files keep working; only new uploads are blocked. If SVG upload is genuinely needed, the alternative is to serve `/uploads/*` with `Content-Disposition: attachment` and a `Content-Security-Policy: sandbox` header, which is a larger change — prefer just converting those assets to PNG/WebP.

- [ ] **Step 2: Verify the declared type against the file's magic bytes**

Add above the handler:

```ts
const MAGIC: Array<{ type: string; bytes: number[]; offset: number }> = [
  { type: "image/jpeg", bytes: [0xff, 0xd8, 0xff], offset: 0 },
  { type: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47], offset: 0 },
  { type: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 },
  { type: "image/webp", bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
  { type: "image/avif", bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
];

function matchesDeclaredType(buffer: Buffer, declared: string): boolean {
  const sig = MAGIC.find((m) => m.type === declared);
  if (!sig) return false;
  return sig.bytes.every((b, i) => buffer[sig.offset + i] === b);
}
```

Then, after the existing size check and after you have the buffer, before writing to disk:

```ts
  if (!matchesDeclaredType(buffer, file.type)) {
    return Response.json(
      { ok: false, error: "File contents do not match the declared image type." },
      { status: 400 },
    );
  }
```

Read the file first to place this correctly relative to where `buffer` is created.

- [ ] **Step 3: Verify**

An anonymous upload must be rejected by the Task 6 guard:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/admin/upload
```

Expected: `401`.

Then, logged into the admin UI, upload a real PNG (must succeed) and a `.png` file that is actually text (must fail with the content-mismatch message).

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/upload/route.ts
git commit -m "fix(security): reject SVG uploads and verify image magic bytes"
```

---

## Chunk 3: SEO primitives

`robots.txt` and `sitemap.xml` both return 404 on the live site. `next-sitemap` is a dependency but has no config file and no `postbuild` script. Rather than wire that up, use the App Router's native `robots.ts` / `sitemap.ts` — no build step, works on Amplify SSR, and picks up new blog posts and case studies automatically.

### Task 12: Settle the canonical host

**Files:**
- Modify: `src/lib/constants.ts:21`
- Modify: `src/app/layout.tsx`

Right now the apex `biznexa.tech` 302-redirects to `www.biznexa.tech`, but `COMPANY.website` (and therefore `metadataBase`, `og:url`, and the Organization JSON-LD) says the apex. There is also no `<link rel="canonical">` anywhere. Three conflicting signals.

**Decision: standardise on `https://www.biznexa.tech`,** because that is what the site actually serves today. Switching to the apex instead would mean reconfiguring CloudFront and is a bigger change for no benefit. If Sukanta prefers the apex, flip both this constant and the Amplify domain config together — never one without the other.

- [ ] **Step 1: Update the constant**

`src/lib/constants.ts:21`:

```ts
  website: "https://www.biznexa.tech",
```

- [ ] **Step 2: Add a canonical URL to the root metadata**

In `src/app/layout.tsx`, add to the `metadata` object after `description`:

```ts
  alternates: {
    canonical: "/",
  },
```

With `metadataBase` already set, Next resolves this to the absolute canonical URL. Per-page metadata can override it with its own `alternates.canonical`.

- [ ] **Step 3: Make the apex redirect permanent (manual, AWS console)**

This is **not** a code change — it is CloudFront/Amplify domain configuration. In the Amplify console under Domain management, set the `biznexa.tech` → `www.biznexa.tech` redirect to **301 (permanent)** instead of the current 302. A 302 tells search engines the move is temporary and holds back link equity.

- [ ] **Step 4: Verify**

```bash
npm run build && npm start
```

```bash
curl -sSL http://localhost:3000/ | grep -oE '<link rel="canonical"[^>]*>|<meta property="og:url"[^>]*>'
```

Expected: both present and both pointing at `https://www.biznexa.tech`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants.ts src/app/layout.tsx
git commit -m "fix(seo): standardise canonical host on www and emit a canonical link"
```

---

### Task 13: Add robots.txt and sitemap.xml

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Write `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

import { COMPANY } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${COMPANY.website}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Write `src/app/sitemap.ts`**

Uses the existing helpers: `getAllBlogSlugs()` (`src/lib/blog.ts:471`, returns `string[]` of published slugs) and `getAllCaseStudySlugs()` (`src/lib/case-studies.ts:204`, returns `string[]`).

```ts
import type { MetadataRoute } from "next";

import { getAllBlogSlugs } from "@/lib/blog";
import { getAllCaseStudySlugs } from "@/lib/case-studies";
import { COMPANY } from "@/lib/constants";

// Re-generate hourly so new posts appear without a redeploy.
export const revalidate = 3600;

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${COMPANY.website}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // A database hiccup must not take the whole sitemap down — degrade to the
  // static routes rather than throwing.
  const [blogSlugs, caseSlugs] = await Promise.all([
    getAllBlogSlugs().catch(() => [] as string[]),
    getAllCaseStudySlugs().catch(() => [] as string[]),
  ]);

  for (const slug of blogSlugs) {
    entries.push({
      url: `${COMPANY.website}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const slug of caseSlugs) {
    entries.push({
      url: `${COMPANY.website}/case-studies/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
```

- [ ] **Step 3: Verify locally**

```bash
npm run build && npm start
```

```bash
curl -sS http://localhost:3000/robots.txt
```

Expected: `User-Agent: *`, `Allow: /`, `Disallow: /admin/`, `Disallow: /api/`, and the sitemap line.

```bash
curl -sS http://localhost:3000/sitemap.xml | head -20
```

Expected: valid XML, 8 static URLs plus one per published blog post and case study, all on `https://www.biznexa.tech`.

- [ ] **Step 4: Remove the unused dependency**

```bash
npm uninstall next-sitemap
```

- [ ] **Step 5: Commit**

```bash
git add src/app/robots.ts src/app/sitemap.ts package.json package-lock.json
git commit -m "feat(seo): add native robots.txt and sitemap.xml routes"
```

- [ ] **Step 6: After deploying, submit the sitemap**

In Google Search Console, submit `https://www.biznexa.tech/sitemap.xml`. Confirm both files resolve with `200` in production:

```bash
curl -sS -o /dev/null -w "robots %{http_code}\n" https://www.biznexa.tech/robots.txt
```

```bash
curl -sS -o /dev/null -w "sitemap %{http_code}\n" https://www.biznexa.tech/sitemap.xml
```

---

## Chunk 4: Minor polish

Cosmetic and accessibility issues. Safe to defer, but cheap to fix.

### Task 14: Make the hero stat counters crawler-visible

**Files:**
- Modify: `src/components/public/HomepageClient.tsx`

The count-up animation starts from `0`, so the server-rendered HTML says "0+ Projects Delivered", "0% Growth Rate", "0/7 AI Monitoring". Crawlers and no-JS visitors see zeros. The real values (20+, 100%, 24/7) come from the database and only appear after hydration.

- [ ] **Step 1: Locate the counter and initialise it to the target value**

Find the stat counter in `HomepageClient.tsx`. Initialise its `useState` with the **final** value rather than `0`, and start the animation from zero inside the effect that runs on intersection. That way SSR emits the true number and the animation still plays for users with JS.

Respect the existing reduced-motion helper — this repo already has `useReducedMotionSafe` (see `src/components/ui/Animations.tsx`); if the user prefers reduced motion, skip the animation and render the final value directly.

- [ ] **Step 2: Verify the server HTML**

```bash
npm run build && npm start
```

```bash
curl -sS http://localhost:3000/ | grep -oE "(0|20)\+|100%|24/7|0/7"
```

Expected: the real values, no `0+` or `0/7`.

- [ ] **Step 3: Commit**

```bash
git add src/components/public/HomepageClient.tsx
git commit -m "fix(seo): render real stat values in server HTML instead of zeros"
```

---

### Task 15: Hide Material Symbols ligature text from assistive tech

**Files:**
- Modify: components rendering `<span className="material-symbols-outlined">…</span>`

Icon glyph names (`arrow_forward`, `smart_toy`, `blur_on`, `trending_up`, `add`) sit in the accessible text tree. Screen readers announce them literally, and if the Google Fonts stylesheet fails to load, sighted users see the raw words.

- [ ] **Step 1: Find every occurrence**

```bash
grep -rn "material-symbols-outlined" src/ --include=*.tsx | wc -l
```

- [ ] **Step 2: Mark them decorative**

Add `aria-hidden="true"` to each icon span. Where the icon is the *only* content of an interactive element (an icon-only button or link), also give that element an `aria-label` describing the action — otherwise it becomes unlabelled, which is worse than the current state.

- [ ] **Step 3: Verify**

Reload the homepage and confirm icons still render. Then check the accessible tree no longer contains the glyph names — in DevTools, run:

```js
document.querySelector('main').innerText.includes('arrow_forward')
```

Expected: `false`.

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "fix(a11y): hide decorative icon ligatures from the accessibility tree"
```

---

### Task 16: Clean up the working tree

The repo currently has 33 uncommitted changes: the `stitch_biznexa/` design-mockup directory is deleted but not committed, and `biznexa_icon_pack/` is untracked.

- [ ] **Step 1: Confirm the deletions are intentional**

```bash
git status --short
```

Ask Sukanta before committing the `stitch_biznexa/` deletions — those are Stitch design mockups and may still be wanted as reference.

- [ ] **Step 2: Decide on `biznexa_icon_pack/`**

Either commit it (if it holds production logo assets) or add it to `.gitignore` (if it is a scratch download). Check whether anything in `src/` or `public/` references it first.

---

## Definition of Done

- [ ] `node scripts/verify-admin-auth.mjs` passes against `http://localhost:3000`
- [ ] `VERIFY_BASE_URL=https://www.biznexa.tech node scripts/verify-admin-auth.mjs` passes against production
- [ ] `grep -rc "await requireAdmin()" src/app/api/admin --include=route.ts | grep -v ":0" | awk -F: '{s+=$2} END {print s}'` outputs `43`
- [ ] `npx tsc --noEmit` is clean
- [ ] `npm run lint` is clean
- [ ] `npm run build` succeeds
- [ ] Admin UI works end to end: login, every dashboard page loads data, logout invalidates the session
- [ ] Admin password rotated after the chunk 1 deploy
- [ ] `https://www.biznexa.tech/robots.txt` and `/sitemap.xml` both return `200`
- [ ] Apex → www redirect is 301, not 302

---

## Open Questions for Sukanta

1. **Canonical host** — this plan picks `www.biznexa.tech` because that is what the site serves today. Confirm, or say if you want the apex instead (needs a CloudFront change too).
2. **SVG uploads** — Task 11 blocks them. At least one existing blog cover is an SVG. Is SVG upload still needed, or can those assets become PNG/WebP?
3. **Breach assessment** — the admin API was open to the internet. There is no way to tell from the code whether anyone found it. If Amplify/CloudFront access logs are retained, they are worth grepping for `/api/admin/` hits from unfamiliar IPs before the fix date. If customer lead data was accessed, Indian DPDP Act notification obligations may apply.
4. **`stitch_biznexa/` deletions** — commit them or restore them?
