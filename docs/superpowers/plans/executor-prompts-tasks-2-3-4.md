# Executor Prompts — Tasks 2, 3, 4

Hand each block below to a separate executor (DeepSeek V4 / M3). They are self-contained.

**Ordering:** Tasks 2, 3, 4 are independent of each other and may run in parallel or in any order. All three depend on Task 1 (already committed as `406d330`), so make sure the executor starts from branch `seo-remediation` at or after that commit.

---

## Shared preamble (prepend to every prompt)

```
You are working in a Next.js 16 (App Router) + TypeScript repository at
C:\xampp\htdocs\biznexaN on branch `seo-remediation`. Shell is PowerShell on
Windows; a bash shell is also available.

RULES — these override any instinct you have to be helpful:
1. Make ONLY the change described below. Do not refactor, rename, reformat,
   or "also fix" anything you notice. Out-of-scope edits will be reverted.
2. `npm run lint` currently reports 13 PRE-EXISTING errors, all
   "A require() style import is forbidden", in these files:
   download_admin_screens.js, scripts/add-report-status-options.js,
   scripts/generate-password-hash.js, scripts/reset-next-cache.js,
   scripts/seed-blog-posts.js
   These are NOT your problem. Do not fix them. Do not touch those files.
   Your task is done if lint reports those same 13 errors and no new ones.
3. `npm run lint` also reports ~53 warnings about using <img> instead of
   next/image. This project deliberately uses plain <img>. Ignore them.
   Never convert an <img> to next/image.
4. Do NOT run `npm run dev`. Use `npm run build` then `npm run start` to
   verify. A dev server may already be running on port 3000.
5. Do not change any visual layout, CSS class, or component markup.
6. If the code below does not compile, or a verification command does not
   produce the expected output, STOP and report exactly what happened.
   Do not improvise a fix.
7. Make exactly one commit, using the message given at the end.
```

---

## PROMPT FOR TASK 2 — Create the XML sitemap

```
[paste shared preamble here]

TASK: The site has no sitemap.xml (it currently returns HTTP 404). Create one
using the Next.js App Router convention.

CREATE a new file at exactly this path: src/app/sitemap.ts

Its complete contents must be exactly:

---BEGIN FILE---
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
---END FILE---

Notes so you don't get confused:
- `SITE_URL` is already exported from src/lib/constants.ts. Do not create it.
- `getAllBlogPosts` and `getAllCaseStudies` already exist and are already
  exported. Do not create or modify them.
- The try/catch blocks are deliberate. Keep them.

VERIFY:
  npm run build
  npm run start
Then in a second shell:
  curl -s http://localhost:3000/sitemap.xml | head -20
  curl -s http://localhost:3000/sitemap.xml | grep -c "<loc>"

EXPECTED:
- Build succeeds.
- Output is valid XML starting with <?xml version="1.0" encoding="UTF-8"?>
  and containing <urlset.
- The <loc> count is 8 or more.
- EVERY url begins with https://www.biznexa.tech — if any begins with
  https://biznexa.tech (no www), STOP and report it.

Also run:
  npm run seo:check
The three checks named "sitemap.xml returns 200", "sitemap lists homepage"
and "sitemap has >= 7 URLs" must go from FAIL to PASS. Many other checks
will still FAIL — that is expected and not your concern.

REPORT BACK: the exact <loc> count, and the first 3 URLs from the sitemap.

COMMIT:
  git add src/app/sitemap.ts
  git commit -m "feat(seo): generate XML sitemap from live content"
```

---

## PROMPT FOR TASK 3 — Create robots.txt and llms.txt

```
[paste shared preamble here]

TASK: The site has no robots.txt and no llms.txt (both return HTTP 404).
Create both.

STEP 1 — CREATE a new file at exactly this path: src/app/robots.ts

Its complete contents must be exactly:

---BEGIN FILE---
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
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
---END FILE---

`SITE_URL` is already exported from src/lib/constants.ts. Do not create it.

STEP 2 — CREATE a new file at exactly this path: public/llms.txt

Its complete contents must be exactly:

---BEGIN FILE---
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
---END FILE---

VERIFY:
  npm run build
  npm run start
Then in a second shell:
  curl -s http://localhost:3000/robots.txt
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/llms.txt

EXPECTED:
- Build succeeds.
- robots.txt contains: "User-Agent: *", "Allow: /", "Disallow: /admin",
  the four AI bot user-agents, and a line
  "Sitemap: https://www.biznexa.tech/sitemap.xml"
- llms.txt returns 200.

Also run:
  npm run seo:check
The checks "robots.txt returns 200", "robots.txt points to sitemap" and
"llms.txt returns 200" must go from FAIL to PASS. Many other checks will
still FAIL — that is expected and not your concern.

REPORT BACK: quote the four AI user-agent strings exactly as they appear in
the file you wrote, and paste the full body of the generated /robots.txt.

COMMIT:
  git add src/app/robots.ts public/llms.txt
  git commit -m "feat(seo): add robots.txt with AI crawler rules and llms.txt"
```

---

## PROMPT FOR TASK 4 — 301-redirect legacy PHP URLs

```
[paste shared preamble here]

TASK: This site was previously a PHP site. Its old URLs (e.g. /services.php)
are still in Google's index but now return HTTP 404, discarding their ranking
history. Add permanent redirects to the App Router equivalents.

MODIFY exactly one file: next.config.ts

Its current complete contents are:

---CURRENT---
import type { NextConfig } from "next";

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
};

export default nextConfig;
---END CURRENT---

Replace it with exactly this:

---NEW---
import type { NextConfig } from "next";

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

export default nextConfig;
---END NEW---

Do NOT remove or alter the `env` block. It is required for database access
in production.

VERIFY:
  npm run build
  npm run start
Then in a second shell:
  curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3000/services.php
  curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3000/index.php

EXPECTED:
- Build succeeds.
- /services.php returns 308 with redirect to /services
- /index.php returns 308 with redirect to /
- 308 is correct. Next.js emits 308 for `permanent: true`, and Google treats
  308 exactly like a 301. Do NOT try to force a 301.

REPORT BACK: the status code and redirect target for all six .php paths.

COMMIT:
  git add next.config.ts
  git commit -m "fix(seo): 301-redirect legacy PHP URLs to App Router routes"
```
