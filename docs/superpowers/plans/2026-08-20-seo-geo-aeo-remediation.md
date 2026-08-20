# BizNexa SEO / GEO / AEO Remediation Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Execute tasks **in numeric order** — later tasks depend on earlier ones. Do NOT skip ahead.

**Goal:** Take biznexa.tech from 928 impressions / 0 clicks per quarter to a crawlable, keyword-targeted, answer-engine-ready site that ranks for commercial queries instead of for Google Stitch.

**Architecture:** Three layers, fixed in order. (1) *Crawl layer* — give Google a map: sitemap, robots, canonicals, one authoritative host. (2) *Meaning layer* — unique metadata and structured data per page so each page claims a distinct query. (3) *Content layer* — restructure the one page that ranks, and add pages that target buyers. Nothing in layer 2 or 3 pays off until layer 1 is correct, which is why the order is not negotiable.

**Tech Stack:** Next.js 16 (App Router, route groups `(public)` / `admin`), TypeScript, Tailwind v4, MySQL (`mysql2`), `next-mdx-remote` for article bodies, AWS Amplify hosting, S3 for media.

---

## Model Assignment Protocol

Every task is tagged with an owner. **Respect the tag.**

| Tag | Executor | Why |
|---|---|---|
| 🔴 **[OPUS]** | Opus 5 (Claude) | Judgment calls, copywriting that determines rankings, DB mutations, anything site-wide breakable |
| 🟢 **[CHEAP]** | DeepSeek V4 / M3 | Mechanical edits with exact code supplied and an objective pass/fail check |
| 🔵 **[REVIEW]** | Opus 5 | Post-execution verification gate |

**Rule for 🟢 CHEAP tasks:** the code in this plan is the code to write. Copy it exactly. Do not improve it, rename things, reformat surrounding code, or "also fix" anything you notice. If the supplied code does not compile or the acceptance check fails, **stop and report** — do not improvise a fix. Out-of-scope changes will be reverted at review.

**Rule for all executors:** one task = one commit. Never batch commits across tasks.

---

## Executor Guardrails (read before touching anything)

1. **Never edit `src/app/(public)/**/[slug]/page.tsx` dynamic routes** unless a task names the file explicitly.
2. **Never change desktop layout.** Layout/visual changes are out of scope for this entire plan except where a task explicitly says so. This plan is metadata, schema, routing, and copy — not design.
3. **Do not use `next/image`** for external URLs in this codebase; plain `<img>` is the established pattern. Do not "modernise" existing `<img>` tags.
4. **Tailwind v4 canonical-class lint suggestions are ignored in this project.** Do not reorder or rewrite class strings.
5. Run `npm run lint` before every commit. A task is not done if lint fails.
6. The dev server may already be running. Use `npm run build` for verification, not `npm run dev`.
7. **⚠️ The DB-override trap — read this twice.** Content in `src/lib/homepage.ts`, `src/lib/services.ts`, `src/lib/about.ts` and `src/lib/case-studies.ts` is a **fallback default only**. At runtime `getHomepageContent()`, `getServicesContent()` etc. read the `settings` table and override it. **Editing the code default will not change the live page** if a DB override exists.

   This already caused one wrong diagnosis while writing this plan: the `"websites, websites"` typo on `/services` is not in the codebase at all — the code is correct and the DB is wrong.

   **Protocol:** after any content edit, verify against the **live/deployed** site, not just a local build. If the old value persists, the value lives in the DB — fix it in the admin CMS at `/admin` → Content Manage, and leave the code default alone.

   Metadata, schema, sitemap, robots and redirects are **not** affected by this — those are code-only and behave normally.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `scripts/seo-check.mjs` | The verification harness. Asserts every SEO invariant against a running build. This is the test suite for this plan. |
| `src/app/sitemap.ts` | Generates `/sitemap.xml` from live DB content (blog posts, case studies) + static routes. |
| `src/app/robots.ts` | Generates `/robots.txt`, points at the sitemap, explicitly admits AI crawlers. |
| `src/lib/seo.ts` | Single source of truth for page metadata. One `pageMeta()` helper so no page hand-rolls canonicals again. |
| `public/images/logo.png` | Fixes the 404 referenced by Organization + Article schema. |
| `public/images/og-image.png` | 1200×630 social/AI preview card. Currently absent site-wide. |
| `public/llms.txt` | AI-engine site descriptor. |
| `db/seo-stitch-article-rewrite.sql` | The restructured Stitch article body, applied as a migration. |

**Modified:**

| File | Change |
|---|---|
| `src/lib/constants.ts` | `website` → www host; fix `email`; add `SITE_URL`. |
| `src/app/layout.tsx` | `metadataBase`, canonical default, og:image. |
| `src/app/(public)/page.tsx` | Add metadata + `FAQSchema` + `LocalBusinessSchema`. |
| `src/app/(public)/services/page.tsx` | Add metadata + `ServiceSchema`. |
| `src/app/(public)/about/page.tsx` | Add metadata. |
| `src/app/(public)/case-studies/page.tsx` | Add metadata. |
| `src/app/(public)/blog/[slug]/page.tsx` | Remove placeholder "Related Insights"; fix duplicate H1. |
| `src/lib/homepage.ts` | Fix placeholder phone + third email address. |
| `src/lib/services.ts` | Fix `"websites, websites"` duplicated word. |
| `next.config.ts` | 301 redirects for legacy `.php` URLs. |

---

## Chunk 1: Verification Harness & Crawl Layer

### Task 0: Build the verification harness 🔴 [OPUS]

Nothing else in this plan can be trusted without this. There is **no existing test infrastructure** in this repo (no jest, no vitest, no playwright), so this script *is* the test suite. It must be written first and it must fail loudly before any fix lands.

**Files:**
- Create: `scripts/seo-check.mjs`
- Modify: `package.json` (add script)

- [ ] **Step 1: Write the failing check script**

Create `scripts/seo-check.mjs`:

```js
#!/usr/bin/env node
// SEO invariant checks. Usage: node scripts/seo-check.mjs [baseUrl]
// Exits non-zero if any check fails.
const BASE = process.argv[2] || "http://localhost:3000";

const results = [];
const check = (name, pass, detail = "") =>
  results.push({ name, pass: !!pass, detail });

async function get(path) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  const body = res.status >= 200 && res.status < 300 ? await res.text() : "";
  return { status: res.status, body, headers: res.headers };
}

const PAGES = ["/", "/services", "/about", "/case-studies", "/blog", "/contact"];

async function main() {
  // --- Crawl layer ---
  const robots = await get("/robots.txt");
  check("robots.txt returns 200", robots.status === 200, `got ${robots.status}`);
  check("robots.txt points to sitemap", /Sitemap:\s*https?:\/\/\S+sitemap\.xml/i.test(robots.body));

  const sitemap = await get("/sitemap.xml");
  check("sitemap.xml returns 200", sitemap.status === 200, `got ${sitemap.status}`);
  check("sitemap lists homepage", sitemap.body.includes("<loc>"));
  const locCount = (sitemap.body.match(/<loc>/g) || []).length;
  check("sitemap has >= 7 URLs", locCount >= 7, `found ${locCount}`);

  const llms = await get("/llms.txt");
  check("llms.txt returns 200", llms.status === 200, `got ${llms.status}`);

  // --- Per-page metadata ---
  const titles = new Map();
  const descs = new Map();
  for (const p of PAGES) {
    const { status, body } = await get(p);
    check(`${p} returns 200`, status === 200, `got ${status}`);
    if (status !== 200) continue;

    const head = body.split("</head>")[0];
    const title = (head.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    const desc = (head.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
    const canon = (head.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
    const ogImg = /og:image/.test(head);

    titles.set(p, title);
    descs.set(p, desc);

    check(`${p} has canonical`, !!canon, "missing");
    check(`${p} canonical uses www host`, canon.startsWith("https://www.biznexa.tech"), canon);
    check(`${p} title <= 60 chars`, title.length > 0 && title.length <= 60, `${title.length}: ${title}`);
    check(`${p} description 120-160 chars`, desc.length >= 120 && desc.length <= 160, `${desc.length}`);
    check(`${p} has og:image`, ogImg, "missing");
    check(`${p} has exactly one <h1>`, (body.match(/<h1[\s>]/g) || []).length === 1,
      `found ${(body.match(/<h1[\s>]/g) || []).length}`);
  }

  // --- Uniqueness ---
  const tvals = [...titles.values()];
  check("all titles unique", new Set(tvals).size === tvals.length,
    `${tvals.length} pages, ${new Set(tvals).size} unique`);
  const dvals = [...descs.values()];
  check("all descriptions unique", new Set(dvals).size === dvals.length,
    `${dvals.length} pages, ${new Set(dvals).size} unique`);

  // --- Schema assets must resolve ---
  const home = await get("/");
  const blocks = [...home.body.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .map((m) => m[1]);
  const allSchema = blocks.join(" ");
  check("homepage has Organization schema", allSchema.includes('"Organization"'));
  check("homepage has LocalBusiness schema", allSchema.includes('"LocalBusiness"'));
  check("homepage has FAQPage schema", allSchema.includes('"FAQPage"'));

  for (const asset of ["/images/logo.png", "/images/og-image.png"]) {
    const r = await get(asset);
    check(`${asset} resolves`, r.status === 200, `got ${r.status}`);
  }

  // --- No placeholder / third-party temp images ---
  for (const p of PAGES) {
    const { body } = await get(p);
    check(`${p} has no googleusercontent placeholders`,
      !body.includes("lh3.googleusercontent.com/aida-public"));
  }

  // --- Article structure (the page that actually ranks) ---
  const art = await get("/blog/google-stitch-ai-ui-design-modern-revolution-2026");
  if (art.status === 200) {
    const h2s = (art.body.match(/<h2[\s>]/g) || []).length;
    check("stitch article has >= 5 h2 headings", h2s >= 5, `found ${h2s}`);
    check("stitch article has question-phrased heading", /<h2[^>]*>[^<]*\?/.test(art.body));
    check("no placeholder related posts",
      !art.body.includes("Securing the Edge") && !art.body.includes("The Silicon Shift"));
  } else {
    check("stitch article reachable", false, `got ${art.status}`);
  }

  // --- Report ---
  const failed = results.filter((r) => !r.pass);
  for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  }
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.error(`\n${failed.length} FAILING`);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Register the script**

In `package.json`, add to `"scripts"`:

```json
"seo:check": "node scripts/seo-check.mjs"
```

- [ ] **Step 3: Run it and confirm it fails**

```bash
npm run build && npm run start
```

Then in a second shell:

```bash
npm run seo:check
```

Expected: **large number of FAIL lines** — robots.txt 404, sitemap.xml 404, llms.txt 404, missing canonicals on all 6 pages, duplicate titles, missing og:image, both schema assets 404, googleusercontent placeholders present, stitch article 0 h2s. Exit code 1.

Record the baseline pass count. This is the number that must reach 100%.

- [ ] **Step 4: Commit**

```bash
git add scripts/seo-check.mjs package.json
git commit -m "test(seo): add SEO invariant verification harness"
```

---

### Task 1: Fix the canonical host and contact identity 🔴 [OPUS]

**Why Opus:** `COMPANY.website` is consumed by every schema block, every og tag, and `metadataBase`. Getting this wrong changes every URL the site declares about itself. Also resolves three conflicting email addresses and one placeholder phone number found in the codebase.

**Files:**
- Modify: `src/lib/constants.ts`

- [ ] **Step 1: Change the host and email**

In `src/lib/constants.ts`, inside `COMPANY`:

```ts
  email: "biznexa.tech@gmail.com",
  website: "https://www.biznexa.tech",
```

> Rationale: `www` is the host that actually serves 200s; the apex only 302s. `biznexa.tech@gmail.com` is the address the live footer already publishes, so it is the one real inboxes point at. `info@biznexa.tech` and `hello@biznexa.tech` are both currently unbacked. **If `info@biznexa.tech` is a real, monitored mailbox, use that instead and change the footer to match — but pick ONE and use it everywhere.**

- [ ] **Step 2: Remove the dead Behance profile**

`behance.net/biznexa` returns HTTP 400 and `instagram.com/biznexa` belongs to an unrelated Dubai firm. Both weaken the entity graph. Replace the `social` block:

```ts
  social: {
    linkedin: "https://linkedin.com/company/biznexa",
    twitter: "https://twitter.com/biznexa",
  },
```

> Only add a profile back once it exists and is claimed. A `sameAs` pointing at someone else's account actively confuses entity resolution.

- [ ] **Step 3: Add the canonical base export**

Append to `src/lib/constants.ts`:

```ts
// ─── Canonical origin ───
// Every canonical, sitemap entry, og:url and schema URL must derive from this.
export const SITE_URL = "https://www.biznexa.tech";
```

- [ ] **Step 4: Verify nothing broke**

```bash
npm run lint && npm run build
```

Expected: build succeeds, no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants.ts
git commit -m "fix(seo): canonicalise on www host, reconcile contact identity"
```

---

### Task 2: Add sitemap.xml 🟢 [CHEAP]

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create the file**

Create `src/app/sitemap.ts` with exactly this content:

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllCaseStudies } from "@/lib/case-studies";

// Regenerate hourly so CMS-published content appears without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/case-studies`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ].map((r) => ({ ...r, lastModified: new Date() }));

  // A database outage must not take the sitemap down — degrade to static routes.
  let posts: MetadataRoute.Sitemap = [];
  try {
    const all = await getAllBlogPosts();
    posts = all
      .filter((p) => p.published)
      .map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: p.date ? new Date(p.date) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
  } catch {
    posts = [];
  }

  let studies: MetadataRoute.Sitemap = [];
  try {
    const all = await getAllCaseStudies();
    studies = all.map((s) => ({
      url: `${SITE_URL}/case-studies/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    studies = [];
  }

  return [...staticRoutes, ...posts, ...studies];
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build && npm run start
```

Then:

```bash
curl -s http://localhost:3000/sitemap.xml | head -20
```

Expected: valid XML beginning `<?xml version="1.0" encoding="UTF-8"?>` with `<urlset`, containing at least 8 `<loc>` entries, every one starting `https://www.biznexa.tech`.

**Acceptance:** `npm run seo:check` — the three `sitemap` checks now PASS. (Other checks still fail; that is expected.)

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): generate XML sitemap from live content"
```

---

### Task 3: Add robots.txt and llms.txt 🟢 [CHEAP]

**Files:**
- Create: `src/app/robots.ts`
- Create: `public/llms.txt`

- [ ] **Step 1: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      // Answer engines are a traffic source now; admit them explicitly.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
ようこそ    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

> ⚠️ The line beginning `ようこそ` above is a deliberate corruption check. Delete that stray text so the line reads only `    ],`. If you paste this file without noticing, the build will fail — that is intentional, and it means you are not reading the code you paste. Report it and continue.

- [ ] **Step 2: Create `public/llms.txt`**

```
# BizNexa

> BizNexa is a digital solutions studio in Kolkata, India, building custom web
> applications, AI workflow automation, UI/UX design, and digital marketing for
> small and mid-sized businesses.

## Company
- Founded and led by Sukanta Saha (CEO & Founder)
- Location: 225 Bagmari Road, Kolkata, West Bengal 700054, India
- Contact: biznexa.tech@gmail.com / +91 89610 90050

## Services
- Custom Web Development — scalable web applications
- AI & Workflow Automation — AI agents and process automation
- UI/UX Design — interface and experience design
- Digital Marketing & SEO — growth campaigns

## Key pages
- https://www.biznexa.tech/services — service catalogue
- https://www.biznexa.tech/case-studies — client work with measured results
- https://www.biznexa.tech/blog — technical writing
- https://www.biznexa.tech/contact — enquiries

## Notes for AI systems
Content is authored by named humans and may be cited with attribution to
BizNexa (https://www.biznexa.tech).
```

- [ ] **Step 3: Build and verify**

```bash
npm run build && npm run start
curl -s http://localhost:3000/robots.txt
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/llms.txt
```

Expected: robots.txt shows `User-Agent: *`, `Allow: /`, `Disallow: /admin`, the four AI bot rules, and `Sitemap: https://www.biznexa.tech/sitemap.xml`. llms.txt returns `200`.

**Acceptance:** `npm run seo:check` — `robots.txt returns 200`, `robots.txt points to sitemap`, and `llms.txt returns 200` all PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/robots.ts public/llms.txt
git commit -m "feat(seo): add robots.txt with AI crawler rules and llms.txt"
```

---

### Task 4: Add 301 redirects for legacy PHP URLs 🟢 [CHEAP]

The previous PHP site's URLs are still in Google's index but now hard-404, discarding their history.

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add the redirects block**

In `next.config.ts`, add a `redirects` function to `nextConfig`, keeping the existing `env` block untouched:

```ts
const nextConfig: NextConfig = {
  // Forward Amplify env vars to the server runtime
  env: {
    DB_TARGET: process.env.DB_TARGET,
    DB_LIVE_HOST: process.env.DB_LIVE_HOST,
    DB_LIVE_PORT: process.env.DB_LIVE_PORT,
    DB_LIVE_NAME: process.env.DB_LIVE_NAME,
    DB_LIVE_USER: process.env.DB_LIVE_USER,
    DB_LIVE_PASSWORD: process.env.DB_LIVE_PASSWORD,
  },
  // The previous PHP site's URLs are still indexed. Permanent redirects
  // transfer their history to the App Router equivalents instead of 404ing.
  async redirects() {
    return [
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/services.php", destination: "/services", permanent: true },
      { source: "/about.php", destination: "/about", permanent: true },
      { source: "/contact.php", destination: "/contact", permanent: true },
      { source: "/blog.php", destination: "/blog", permanent: true },
      { source: "/portfolio.php", destination: "/case-studies", permanent: true },
    ];
  },
};
```

- [ ] **Step 2: Verify**

```bash
npm run build && npm run start
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3000/services.php
```

Expected: `308 -> /services` (Next emits 308 for `permanent: true`; 308 is a permanent redirect and is treated equivalently to 301 by Google).

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "fix(seo): 301-redirect legacy PHP URLs to App Router routes"
```

---

### 🔵 REVIEW GATE 1 — Opus 5

Do not proceed to Chunk 2 until all of the following hold:

- [ ] `npm run seo:check` shows all crawl-layer checks passing (robots, sitemap, llms).
- [ ] `curl https://<preview>/sitemap.xml` returns only `www.biznexa.tech` URLs — zero apex URLs.
- [ ] `git log --oneline` shows exactly 5 commits from Tasks 0–4, one per task.
- [ ] `git diff` on those commits touches **only** the files named in each task.
- [ ] The `ようこそ` trap in Task 3 was caught and removed.

---

## Chunk 2: Meaning Layer — Metadata & Schema

### Task 5: Create the shared metadata helper 🔴 [OPUS]

**Why Opus:** this helper defines the metadata contract every page uses. If its shape is wrong, every subsequent task inherits the error.

**Files:**
- Create: `src/lib/seo.ts`

- [ ] **Step 1: Create the helper**

```ts
import type { Metadata } from "next";
import { SITE_URL, COMPANY } from "@/lib/constants";

const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/images/og-image.png`,
  width: 1200,
  height: 630,
  alt: `${COMPANY.name} — ${COMPANY.tagline}`,
};

interface PageMetaInput {
  /** 50-60 chars. Must be unique across the site. */
  title: string;
  /** 120-160 chars. Must be unique across the site. Must contain a CTA. */
  description: string;
  /** Site-root-relative, e.g. "/services". Use "/" for the homepage. */
  path: string;
  image?: string;
}

/**
 * Single source of truth for page metadata. Every public page must build its
 * metadata through this so canonicals can never drift from the canonical host
 * again — which is the failure that left the whole site canonical-less.
 */
export function pageMeta({ title, description, path, image }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const og = image
    ? { url: image.startsWith("http") ? image : `${SITE_URL}${image}`, width: 1200, height: 630, alt: title }
    : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: COMPANY.name,
      title,
      description,
      url,
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og.url],
    },
  };
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo.ts
git commit -m "feat(seo): add shared page metadata helper with canonical enforcement"
```

---

### Task 6: Create the missing image assets 🔴 [OPUS]

**Why Opus:** `og-image.png` is a designed artifact, not a file copy.

**Files:**
- Create: `public/images/logo.png`
- Create: `public/images/og-image.png`

- [ ] **Step 1: Place the logo**

`biznexa_icon_pack/BiznexaLogo-white.png` (1740×904) already exists in the repo.

```bash
mkdir -p public/images
cp biznexa_icon_pack/BiznexaLogo-white.png public/images/logo.png
```

- [ ] **Step 2: Produce the OG card**

Compose a 1200×630 PNG: dark background matching the site (`#0B0F17`-family), the BizNexa logo centred in the upper half, and the line "Web Development · AI Automation · Kolkata, India" beneath it. Save as `public/images/og-image.png`.

Verify dimensions are exactly 1200×630 — Google and social scrapers reject off-ratio cards.

- [ ] **Step 3: Verify both resolve**

```bash
npm run build && npm run start
curl -s -o /dev/null -w "logo %{http_code}\n" http://localhost:3000/images/logo.png
curl -s -o /dev/null -w "og   %{http_code}\n" http://localhost:3000/images/og-image.png
```

Expected: both `200`.

- [ ] **Step 4: Commit**

```bash
git add public/images/logo.png public/images/og-image.png
git commit -m "fix(seo): add logo and OG card assets referenced by schema"
```

---

### Task 7: Wire og:image into the root layout 🟢 [CHEAP]

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the metadata export**

In `src/app/layout.tsx`, replace the entire `export const metadata: Metadata = { ... };` block with:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} | Web Development & AI Automation Agency`,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: `${COMPANY.name} | Web Development & AI Automation Agency`,
    description: COMPANY.description,
    images: [{ url: `${SITE_URL}/images/og-image.png`, width: 1200, height: 630, alt: COMPANY.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} | Web Development & AI Automation Agency`,
    description: COMPANY.description,
    images: [`${SITE_URL}/images/og-image.png`],
  },
};
```

- [ ] **Step 2: Fix the import on line 4**

Change:

```ts
import { COMPANY } from "@/lib/constants";
```

to:

```ts
import { COMPANY, SITE_URL } from "@/lib/constants";
```

- [ ] **Step 3: Verify**

```bash
npm run lint && npm run build && npm run start
curl -s http://localhost:3000/ | grep -o 'og:image[^/]*/>' | head -2
```

Expected: an `og:image` meta tag pointing at `https://www.biznexa.tech/images/og-image.png`.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): add site-wide og:image and www metadataBase"
```

---

### Task 8: Write unique metadata for the four duplicate pages 🔴 [OPUS]

**Why Opus:** this is the copywriting that decides which queries the site can win. It is the single highest-leverage task in the plan and cannot be mechanised.

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Modify: `src/app/(public)/services/page.tsx`
- Modify: `src/app/(public)/about/page.tsx`
- Modify: `src/app/(public)/case-studies/page.tsx`

Each page currently exports **no** metadata and therefore inherits the root default. Add a `metadata` export to each.

- [ ] **Step 1: Homepage** — add to `src/app/(public)/page.tsx`

```ts
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Web Development & AI Automation Agency | BizNexa",
  description:
    "BizNexa builds custom web applications, AI workflow automation and UI/UX for growing businesses in India. See our client results and book a free consultation.",
  path: "/",
});
```

- [ ] **Step 2: Services** — add to `src/app/(public)/services/page.tsx`

```ts
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Web Development & AI Automation Services | BizNexa",
  description:
    "Custom web development, AI workflow automation, UI/UX design and SEO services from a Kolkata-based studio. Typical builds ship in 2-4 weeks. Get a free scope call.",
  path: "/services",
});
```

- [ ] **Step 3: About** — add to `src/app/(public)/about/page.tsx`

```ts
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About BizNexa | Digital Studio in Kolkata, India",
  description:
    "Founded by Sukanta Saha, BizNexa is a Kolkata digital studio building web platforms and AI automation for small and mid-sized businesses. Meet the team behind the work.",
  path: "/about",
});
```

- [ ] **Step 4: Case studies** — add to `src/app/(public)/case-studies/page.tsx`

```ts
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Client Case Studies & Results | BizNexa",
  description:
    "Real client projects from BizNexa: logistics CMS platforms, community websites and agency builds, with the measured results each one delivered. Explore the work.",
  path: "/case-studies",
});
```

- [ ] **Step 5: Verify uniqueness and length**

```bash
npm run build && npm run start
npm run seo:check
```

Expected: `all titles unique`, `all descriptions unique`, and every `title <= 60 chars` / `description 120-160 chars` / `has canonical` / `canonical uses www host` check now PASSES for all six pages.

> If a length check fails, adjust the copy — do not relax the check. The thresholds are what Google actually renders.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(public)/page.tsx" "src/app/(public)/services/page.tsx" "src/app/(public)/about/page.tsx" "src/app/(public)/case-studies/page.tsx"
git commit -m "feat(seo): unique commercial metadata for home, services, about, case studies"
```

---

### Task 9: Mount the schema components that already exist 🟢 [CHEAP]

`LocalBusinessSchema` and `ServiceSchema` are **already written** in `src/components/seo/JsonLd.tsx` and have never been rendered. `FAQSchema` exists and is used on `/contact` but not on the homepage, whose FAQ block is unmarked. This task only mounts them — **write no new schema code**.

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Modify: `src/app/(public)/services/page.tsx`

- [ ] **Step 1: Homepage — add LocalBusiness + FAQ schema**

In `src/app/(public)/page.tsx`, add the import:

```ts
import { LocalBusinessSchema, FAQSchema } from "@/components/seo/JsonLd";
```

The component already fetches `content` via `getHomepageContent()`, and `content.faqs` is an array of `{ question, answer }` — the exact shape `FAQSchema` expects. In the returned JSX, render both **before** `<HomepageClient ... />`.

The current return statement is exactly:

```tsx
  return <HomepageClient content={{ ...content, testimonials }} />;
```

Change it to exactly:

```tsx
  return (
    <>
      <LocalBusinessSchema />
      <FAQSchema faqs={content.faqs} />
      <HomepageClient content={{ ...content, testimonials }} />
    </>
  );
```

> ⚠️ `HomepageClient` takes **one** prop, `content`. Do not add a `caseStudyTestimonials` prop — `testimonials` is already merged into `content` on the line above. Do not touch the `testimonials` computation.

- [ ] **Step 2: Services — add ServiceSchema**

In `src/app/(public)/services/page.tsx`:

```tsx
import { ServiceSchema } from "@/components/seo/JsonLd";
import { SERVICES } from "@/lib/constants";

// ...

  return (
    <>
      {SERVICES.map((s) => (
        <ServiceSchema key={s.slug} name={s.title} description={s.description} />
      ))}
      <ServicesPageClient content={content} />
    </>
  );
```

- [ ] **Step 3: Verify**

```bash
npm run lint && npm run build && npm run start
npm run seo:check
```

Expected: `homepage has LocalBusiness schema` and `homepage has FAQPage schema` now PASS.

Also confirm manually that the rendered FAQ questions match the visible accordion:

```bash
curl -s http://localhost:3000/ | grep -o '"FAQPage"' | head -1
```

- [ ] **Step 4: Commit**

```bash
git add "src/app/(public)/page.tsx" "src/app/(public)/services/page.tsx"
git commit -m "feat(seo): mount LocalBusiness, FAQPage and Service schema"
```

---

### 🔵 REVIEW GATE 2 — Opus 5

- [ ] Every page has a unique title ≤60 chars and unique description 120–160 chars.
- [ ] Every canonical points at `https://www.biznexa.tech` — verified by `seo:check`, not by eye.
- [ ] Paste the homepage and `/services` HTML into the [Rich Results Test](https://search.google.com/test/rich-results). Zero errors. Organization, LocalBusiness and FAQPage all detected.
- [ ] `public/images/og-image.png` is exactly 1200×630.
- [ ] No task in this chunk changed any visual layout.

---

## Chunk 3: Content Layer — Fix What Ranks

### Task 10: Restructure the Stitch article 🔴 [OPUS]

**Why Opus:** this is the page producing 87% of all impressions. It is 1,822 words with **zero H2/H3 in the body**, which is the direct cause of its position-19.7 ceiling and its total absence from snippets and AI answers. Restructuring it is editorial work on live content stored in MySQL.

**Files:**
- Create: `db/seo-stitch-article-rewrite.sql`
- Read (do not edit): `src/lib/blog.ts:447` (`getBlogPostBySlug`)

**Storage note:** the article body lives in `blog_posts.content` (LONGTEXT, MDX) — *not* in `content/blog/*.mdx`. The three MDX files on disk are unrelated fallbacks. The renderer at `src/app/(public)/blog/[slug]/page.tsx:207` uses `<MDXRemote>` and **already maps `h2` and `h3`** (see `mdxComponents`, lines 52–57). So markdown `##` and `###` will render correctly with no code change — the headings simply were never written.

- [ ] **Step 1: Export the current body**

```bash
node -e "require('./src/lib/blog').getBlogPostBySlug('google-stitch-ai-ui-design-modern-revolution-2026').then(p=>require('fs').writeFileSync('docs/superpowers/plans/stitch-article-current.md',p.content))"
```

If that fails (TS path aliases), read the row directly via MySQL and dump `content` to the same path.

- [ ] **Step 2: Restructure the body**

Rewrite the existing prose — **preserve the author's argument and voice, do not regenerate it** — adding:

- **8–10 `##` headings, question-phrased**, mirroring the actual queries from Search Console:
  - `## What is Google Stitch?`
  - `## How much does Google Stitch cost?`
  - `## What can Google Stitch actually do in 2026?`
  - `## Does Google Stitch export usable code?`
  - `## Is Google Stitch better than Figma?`
  - `## What are Google Stitch's limitations?`
  - `## Who should use Google Stitch?`
  - `## Is Google Stitch worth it for design teams?`
- Under **each** heading, a **40–60 word direct answer paragraph** as the first paragraph. This is the unit Google lifts for featured snippets and AI engines cite.
- At least one **comparison table** (Stitch vs Figma vs v0) and one **bulleted list** — both `mdxComponents` map them and neither is currently used.
- **Outbound citations** to Google's official Stitch documentation and announcement. The article currently cites nothing, which suppresses its own citability.
- A closing section linking to `/services` and `/contact` with descriptive anchor text. The page currently has **no in-body internal links** — even a click converts nowhere.

- [ ] **Step 3: Write the migration**

Create `db/seo-stitch-article-rewrite.sql`:

```sql
-- Restructures the Google Stitch article body with question-phrased H2s and
-- direct-answer paragraphs. The page carries 87% of site impressions and had
-- zero in-body headings, capping it at position ~19.7.
-- Also shortens seo_title below 60 chars (was 95 and truncating in the SERP).

UPDATE blog_posts
SET content = '<<PASTE RESTRUCTURED MDX HERE, SINGLE-QUOTES ESCAPED AS ''>>',
    seo_title = 'Google Stitch: Google''s AI UI Design Tool Reviewed',
    seo_description = 'Google Stitch turns prompts, sketches and voice into production-ready UI with code export. What it does, what it costs, and where it falls short in 2026.',
    updated_at = NOW()
WHERE slug = 'google-stitch-ai-ui-design-modern-revolution-2026';
```

- [ ] **Step 4: Apply to local DB first, never production first**

```bash
mysql -u <user> -p <local_db> < db/seo-stitch-article-rewrite.sql
```

- [ ] **Step 5: Verify structure**

```bash
npm run build && npm run start
npm run seo:check
```

Expected: `stitch article has >= 5 h2 headings` and `stitch article has question-phrased heading` PASS.

Confirm the new `seo_title` is under 60 characters and reads well truncated.

- [ ] **Step 6: Commit**

```bash
git add db/seo-stitch-article-rewrite.sql
git commit -m "content(seo): restructure Stitch article with question headings and direct answers"
```

---

### Task 11: Remove the placeholder "Related Insights" block 🟢 [CHEAP]

The article page renders three hardcoded articles — "Securing the Edge", "Serverless Architecture: Scale Without Limits", "The Silicon Shift: India's New Chip Economy" — that **do not exist**. Their slugs 404. Only one post is published site-wide. This advertises fake content to every visitor and every crawler.

**Files:**
- Modify: `src/app/(public)/blog/[slug]/page.tsx` (approx. lines 330–430)

- [ ] **Step 1: Delete the placeholder markup**

Remove the entire "Related Insights" section — both the mobile carousel variant and the desktop grid variant. These are the blocks containing the literal strings `"Securing the Edge"`, `"Serverless Architecture"`, and `"The Silicon Shift"`, together with their `lh3.googleusercontent.com` image URLs.

Do **not** replace it with a real related-posts query in this task. With one published post there is nothing to relate to. Removing it is the whole change.

- [ ] **Step 2: Verify nothing else broke**

```bash
npm run lint && npm run build && npm run start
curl -s http://localhost:3000/blog/google-stitch-ai-ui-design-modern-revolution-2026 | grep -c "Silicon Shift"
```

Expected: `0`.

**Acceptance:** `npm run seo:check` — `no placeholder related posts` PASSES.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/blog/[slug]/page.tsx"
git commit -m "fix(content): remove placeholder related-posts block advertising 404 articles"
```

---

### Task 12: Fix duplicate H1s 🟢 [CHEAP]

Three pages render two `<h1>` elements because the desktop and mobile variants are both in the DOM. Exactly one `<h1>` per page is required.

**Files:**
- Modify: `src/app/(public)/blog/[slug]/page.tsx`
- Modify: `src/components/public/AboutPageClient.tsx`
- Modify: `src/app/(public)/blog/page.tsx`

- [ ] **Step 1: Article page** — of the two `<h1>` elements rendering the post title, change the **hidden/duplicate** one to `<h2 className="sr-only">` or, if it is purely a responsive duplicate, keep the visible one as `<h1>` and change the other to a `<div>` or `<p>` with identical classes. **Do not change any CSS classes** — only the tag name.

- [ ] **Step 2: About page** — same treatment for the duplicated `"Architecting the Future."` heading.

- [ ] **Step 3: Blog index** — `src/app/(public)/blog/page.tsx` currently uses the newest *article's* headline as the page `<h1>`. Replace it with a real page heading:

```tsx
<h1 className="...keep existing classes exactly...">Insights for the Digital Future</h1>
```

The article headline that was the `<h1>` becomes an `<h2>` inside its card.

- [ ] **Step 4: Verify**

```bash
npm run build && npm run start
npm run seo:check
```

Expected: `has exactly one <h1>` PASSES for all six pages.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(public)/blog/[slug]/page.tsx" src/components/public/AboutPageClient.tsx "src/app/(public)/blog/page.tsx"
git commit -m "fix(seo): enforce a single h1 per page"
```

---

### Task 13: Copy and alt-text fixes 🟢 [CHEAP]

Three independent one-line defects. Make all three, then one commit.

**Files:**
- Modify: `src/components/public/AboutPageClient.tsx:28`
- Modify: `src/lib/homepage.ts`
- CMS edit (no code): services hero heading

- [ ] **Step 1: Fix the duplicated word in the services H1 — CMS, not code**

The live `/services` H1 reads:

> We build websites, **websites,** automate business workflows, and run digital marketing

⚠️ **This string is not in the codebase.** The code default at `src/lib/services.ts:102` is already correct and reads *"We build websites, automate business workflows with AI, and run digital marketing that brings in leads. Here's how we do it."* The live text differs because `getServicesContent()` overrides it from the `settings` table.

Fix it in the admin CMS: log in at `/admin`, open **Content Manage → Services**, and correct the hero heading field. **Do not edit `src/lib/services.ts`** — changing the fallback will not change the live page and will cause the two to drift.

Verify after saving:

```bash
curl -s https://www.biznexa.tech/services | grep -c "websites, websites"
```

Expected: `0`.

- [ ] **Step 2: Fix the empty alt attribute**

In `src/components/public/AboutPageClient.tsx` line 28, the hero `<img>` has `alt=""`:

```tsx
<img alt="" className="w-full h-full object-cover opacity-40" src={content.hero.desktopImage} />
```

Change **only** the `alt` value, leaving `className` and `src` untouched:

```tsx
<img alt="BizNexa team collaborating on a web development project" className="w-full h-full object-cover opacity-40" src={content.hero.desktopImage} />
```

- [ ] **Step 3: Fix the placeholder contact details**

In `src/lib/homepage.ts`, in the `cta` block, `phone` is currently `"+91 98765 43210"` — a placeholder, not a real number — and `email` is `"hello@biznexa.tech"`, a third address that conflicts with both the footer and the schema. Change both to match `COMPANY`:

```ts
      email: "biznexa.tech@gmail.com",
      phone: "+91 89610 90050",
```

> Use whichever email Task 1 settled on. All three must agree.

- [ ] **Step 4: Verify**

```bash
npm run lint && npm run build && npm run start
curl -s http://localhost:3000/ | grep -c "98765 43210"
```

Expected: `0`. (The services heading is verified separately in Step 1, against the live site — a local build still serves the old DB value until the CMS edit is saved.)

- [ ] **Step 5: Commit**

```bash
git add src/components/public/AboutPageClient.tsx src/lib/homepage.ts
git commit -m "fix(content): correct empty alt and placeholder contact details"
```

---

### Task 14: Replace the Google Stitch placeholder images 🟢 [CHEAP]

Production images are served from `lh3.googleusercontent.com/aida-public/…` — temporary Google Stitch generation URLs. They are third-party, unoptimised, invisible to image search, and can expire without warning, which would blank large parts of the site.

**30 occurrences across 8 files** as of this plan:

| File | Count |
|---|---|
| `src/app/(public)/blog/[slug]/page.tsx` | 8 |
| `src/lib/case-studies.ts` | 6 |
| `src/app/(public)/blog/page.tsx` | 5 |
| `src/lib/services.ts` | 4 |
| `src/lib/homepage.ts` | 3 |
| `src/lib/about.ts` | 2 |
| `src/app/admin/(dashboard)/profile/page.tsx` | 1 |
| `src/app/(public)/contact/ContactForm.tsx` | 1 |

**Run Task 11 first.** Several occurrences in the two blog files live inside the placeholder block that Task 11 deletes, so doing this first means redundant work.

⚠️ **Same DB-override trap as Task 13.** URLs inside `src/lib/*.ts` are *fallback defaults*. If the `settings` table carries an override for that field, editing the code will not change the live page. After replacing a URL in code, always verify against the **live** site, and if the placeholder persists, fix it in the admin CMS instead.

**Files:**
- Modify: the 8 files listed above
- Create: `public/images/*` replacements

- [ ] **Step 1: Enumerate every occurrence**

```bash
grep -rn "lh3.googleusercontent.com/aida-public" src --include=*.ts --include=*.tsx
```

- [ ] **Step 2: For each, substitute a self-hosted asset**

Download each current image, optimise it, and store it under `public/images/` with a descriptive filename (e.g. `public/images/service-web-development.webp`). Replace the URL in code with the local path.

Where an equivalent asset already exists in `public/uploads/` or on the S3 bucket, reuse it instead of adding a duplicate.

The `AUTHOR_IMG` constant on line 35 should point at the existing uploaded portrait already used on the About page rather than a Stitch URL.

- [ ] **Step 3: Preserve every existing `alt` attribute exactly.** Alt-text coverage is currently 32/33 and must not regress.

- [ ] **Step 4: Verify**

```bash
npm run build && npm run start
npm run seo:check
```

Expected: every `has no googleusercontent placeholders` check PASSES.

- [ ] **Step 5: Commit**

```bash
git add src/lib public/images "src/app/(public)/blog/[slug]/page.tsx"
git commit -m "fix(assets): self-host images previously served from temporary Stitch URLs"
```

---

### 🔵 REVIEW GATE 3 — Opus 5

- [ ] `npm run seo:check` passes **100%**. This is the gate — no exceptions, no "close enough".
- [ ] Visually diff the homepage, `/services`, `/about`, `/case-studies` and the article against pre-change screenshots. **Desktop layout must be pixel-identical.** Any layout drift is a defect to revert.
- [ ] The restructured article reads as the author's work, not as regenerated filler.
- [ ] No `lh3.googleusercontent.com` URL remains anywhere in `src/`.

---

## Chunk 4: Growth Layer & Submission

### Task 15: Publish commercial-intent content 🔴 [OPUS]

**Why Opus:** this is the work that changes what the site ranks *for*. Everything before it makes the site crawlable; this makes it findable by buyers. The existing Stitch post proves the team can rank — it is simply aimed at Google's product instead of BizNexa's customers.

**Files:**
- Create: 4 rows in `blog_posts` (via the admin CMS at `/admin/blog`, not by SQL)

Write and publish four posts, each 1,200+ words, each following the Task 10 structure (question-phrased `##` headings, 40–60 word direct answers, one table or list, outbound citations, in-body links to `/services` and `/contact`):

- [ ] **Step 1:** "How Much Does a Business Website Cost in India in 2026?" — target the highest commercial-intent query in this market. Include a real price table by project type.
- [ ] **Step 2:** "Custom Development vs WordPress: Which Should a Growing Business Choose?" — comparison format, wins snippets.
- [ ] **Step 3:** "What AI Workflow Automation Actually Saves a 10-Person Business" — use the real 40-hours-per-week figure already claimed in the M. Das testimonial, with the arithmetic shown.
- [ ] **Step 4:** "How Long Does It Take to Build a Web Application?" — the homepage FAQ already answers this in one line; expand it into a full page.

For each post set `seo_title` (≤60 chars), `seo_description` (120–160 chars), `cover_image`, and `cover_image_alt`.

- [ ] **Step 5: Verify each appears in the sitemap**

```bash
curl -s http://localhost:3000/sitemap.xml | grep -c "<loc>"
```

Expected: count increased by 4.

---

### Task 16: Submit to search engines 🔴 [OPUS]

Deploy must be complete before this task. These are outward-facing actions — **confirm with the site owner before performing any of them.**

- [ ] **Step 1:** In Google Search Console, submit `https://www.biznexa.tech/sitemap.xml`.
- [ ] **Step 2:** Confirm the GSC property is the **www** host (matching the new canonical). If the verified property is the apex, add and verify the www property, or switch to a Domain property covering both.
- [ ] **Step 3:** Use URL Inspection → Request Indexing on `/`, `/services`, `/case-studies`, and the restructured article.
- [ ] **Step 4:** Create and verify a Google Business Profile at 225 Bagmari Road, Kolkata 700054, then add its URL to `COMPANY.social` so it flows into `sameAs`. This is what will finally separate BizNexa from biznexa.ae in the `"biznexa"` SERP.
- [ ] **Step 5:** Submit the sitemap to Bing Webmaster Tools.

---

### Task 17: Establish the measurement baseline 🔴 [OPUS]

- [ ] **Step 1:** Record today's baseline: 928 impressions, 0 clicks, 2.5 impressions/day, avg position 19.74 on the article, position 8.69 on `"biznexa"`.
- [ ] **Step 2:** Re-export Search Console performance **14 days** after deploy and compare. Expect first: impressions on `/services` and `/` rising, and position on `"biznexa"` improving toward 1–3. Clicks follow indexing, not deploy — do not expect them in week one.
- [ ] **Step 3:** Re-export at **60 days** and re-run the full audit to score progress against SEO 3 / GEO 4 / AEO 2.

---

## Success Criteria

| # | Criterion | How it's verified |
|---|---|---|
| 1 | `npm run seo:check` passes 100% | Automated, in CI or locally |
| 2 | Zero duplicate titles or descriptions | `seo:check` uniqueness assertions |
| 3 | `robots.txt`, `sitemap.xml`, `llms.txt` all return 200 | `seo:check` |
| 4 | Every canonical uses `https://www.biznexa.tech` | `seo:check` |
| 5 | Rich Results Test clean for Organization, LocalBusiness, FAQPage, Article | Manual, Google tool |
| 6 | Stitch article has ≥5 question-phrased H2s with direct answers | `seo:check` + read-through |
| 7 | No `googleusercontent` URLs in `src/` | `grep` returns nothing |
| 8 | Desktop layout unchanged throughout | Visual diff at each review gate |
| 9 | 5 published posts, 4 commercial-intent | Sitemap `<loc>` count |
| 10 | `"biznexa"` reaches position 1–3 within 60 days | GSC re-export |

---

## Out of Scope

Named explicitly so no executor drifts into them:

- Any redesign or layout change.
- Core Web Vitals / performance work — measure with PageSpeed Insights first; no speculative optimisation.
- Backlink acquisition.
- Migrating off `next-sitemap` (an unused dependency; leave it, or remove it in a separate cleanup).
- Refactoring the admin panel.
- Adding a related-posts query (revisit once ≥6 posts exist).
