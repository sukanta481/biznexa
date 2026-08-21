# Executor Prompts — Tasks 7, 9, 11, 12

Branch: `seo-remediation`, at commit `e848e48` or later.

## ⚠️ Sequencing — this matters

| Batch | Tasks | Parallel? |
|---|---|---|
| **1** | Task 7, Task 9 | ✅ Yes — different files, run simultaneously |
| **2** | Task 11 + 12 (one executor, two commits) | ❌ Run only after Batch 1 lands |

**Tasks 13 and 14 are deliberately not included yet.** They modify
`AboutPageClient.tsx`, `blog/page.tsx` and `blog/[slug]/page.tsx` — the same
files Task 12 touches. Handing them out now guarantees merge conflicts. They
come after Batch 2.

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
4. NEVER change a CSS class, a Tailwind class string, or any visual layout.
   Several tasks below change an HTML tag name (e.g. h1 -> h2) — when you do,
   the className must be copied across byte-for-byte unchanged.
5. A `next dev` server may already be holding port 3000. Do NOT kill it and
   do NOT run `npm run dev`. Verify like this instead:
       npm run build
       npx next start -p 3100
   and point all curl/Invoke-WebRequest checks at http://localhost:3100.
6. `npm run seo:check` defaults to port 3000. Always pass the port explicitly:
       node scripts/seo-check.mjs http://localhost:3100
7. If the code below does not compile, or a verification command does not
   produce the expected output, STOP and report exactly what happened.
   Do not improvise a fix.
8. Use the exact commit message given at the end of each task.
```

---

# BATCH 1 — run these two in parallel

## PROMPT FOR TASK 7 — Site-wide og:image in the root layout

```
[paste shared preamble here]

CONTEXT: Six public pages now get og:image from a shared helper, but routes
that do not use that helper (/blog/[slug], /case-studies/[slug], /privacy,
/terms) still emit no og:image at all. The root layout must supply a default.
The site sets twitter:card to "summary_large_image" but has never shipped an
image, so every share currently renders a blank card.

MODIFY exactly one file: src/app/layout.tsx

STEP 1 — change the import on line 4.

FIND this exact line:
import { COMPANY } from "@/lib/constants";

REPLACE with:
import { COMPANY, SITE_URL } from "@/lib/constants";

STEP 2 — replace the whole metadata export.

FIND this exact block:

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.website),
  title: {
    default: `${COMPANY.name} | Digital Solutions Studio`,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: COMPANY.website,
    siteName: COMPANY.name,
    title: `${COMPANY.name} | Digital Solutions Studio`,
    description: COMPANY.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} | Digital Solutions Studio`,
    description: COMPANY.description,
  },
};

REPLACE with exactly:

const DEFAULT_TITLE = `${COMPANY.name} | Web Development & AI Automation Agency`;
const OG_IMAGE = {
  url: `${SITE_URL}/images/og-image.png`,
  width: 1200,
  height: 630,
  alt: COMPANY.name,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: DEFAULT_TITLE,
    description: COMPANY.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: COMPANY.description,
    images: [OG_IMAGE.url],
  },
};

Do not change anything else in the file. The RootLayout function, the font
setup, and the <OrganizationSchema /> mount all stay exactly as they are.

VERIFY:
  npm run build
  npx next start -p 3100
Then in a second shell:
  curl -s http://localhost:3100/privacy | Select-String "og:image"
  curl -s http://localhost:3100/terms | Select-String "og:image"

(bash equivalent: curl -s http://localhost:3100/privacy | grep -o 'og:image[^>]*>')

EXPECTED:
- Build succeeds.
- Both /privacy and /terms now emit an og:image meta tag pointing at
  https://www.biznexa.tech/images/og-image.png
- These two pages previously had NO og:image at all.

Then run:
  node scripts/seo-check.mjs http://localhost:3100
The total must not go DOWN. It was 53/63 before this task. Some checks will
still fail (schema, placeholder images, article headings) — those are other
people's tasks, not yours.

REPORT BACK: the og:image tag exactly as it appears on /privacy, and the
"N/63 checks passed" line.

COMMIT:
  git add src/app/layout.tsx
  git commit -m "feat(seo): add site-wide og:image and canonical metadataBase"
```

---

## PROMPT FOR TASK 9 — Mount the schema components that already exist

```
[paste shared preamble here]

CONTEXT: `LocalBusinessSchema` and `ServiceSchema` are ALREADY fully written
in src/components/seo/JsonLd.tsx and have never been rendered anywhere.
`FAQSchema` is already written and already used on /contact, but the homepage
FAQ section has no schema attached.

YOU ARE ONLY MOUNTING EXISTING COMPONENTS. Do not write any new schema code.
Do not open or modify src/components/seo/JsonLd.tsx.

--- STEP 1: homepage ---

MODIFY: src/app/(public)/page.tsx

Add this import below the existing `import { pageMeta } from "@/lib/seo";`:

import { LocalBusinessSchema, FAQSchema } from "@/components/seo/JsonLd";

Then FIND this exact line (it is the last line of the Home function):

  return <HomepageClient content={{ ...content, testimonials }} />;

REPLACE with exactly:

  return (
    <>
      <LocalBusinessSchema />
      <FAQSchema faqs={content.faqs} />
      <HomepageClient content={{ ...content, testimonials }} />
    </>
  );

IMPORTANT:
- `HomepageClient` takes exactly ONE prop, `content`. Do not add a
  `caseStudyTestimonials` prop. The testimonials are already merged into
  `content` by the line above.
- Do not touch the `testimonials` computation, the `dynamic` export, the
  metadata export, or the Promise.all block.
- `content.faqs` is already an array of { question, answer } — exactly the
  shape FAQSchema expects. Do not transform it.

--- STEP 2: services ---

MODIFY: src/app/(public)/services/page.tsx

Add these two imports below the existing `import { pageMeta } from "@/lib/seo";`:

import { ServiceSchema } from "@/components/seo/JsonLd";
import { SERVICES } from "@/lib/constants";

Then FIND this exact block:

export default async function ServicesPage() {
  const content = await getServicesContent();

  return <ServicesPageClient content={content} />;
}

REPLACE with exactly:

export default async function ServicesPage() {
  const content = await getServicesContent();

  return (
    <>
      {SERVICES.map((service) => (
        <ServiceSchema
          key={service.slug}
          name={service.title}
          description={service.description}
        />
      ))}
      <ServicesPageClient content={content} />
    </>
  );
}

Do not change the metadata export at the top of the file.

VERIFY:
  npm run build
  npx next start -p 3100
Then:
  node scripts/seo-check.mjs http://localhost:3100

EXPECTED — these two checks must flip from FAIL to PASS:
  PASS  homepage has LocalBusiness schema
  PASS  homepage has FAQPage schema

Also confirm the Service schema rendered on /services:
  curl -s http://localhost:3100/services | grep -c '"Service"'
Expected: 4 or more (one per service).

Sanity check the homepage still renders normally — the FAQ accordion, the
testimonials, and the services grid must all still be present and unchanged.

REPORT BACK: the "N/63 checks passed" line, and the count from the
'"Service"' grep.

COMMIT:
  git add "src/app/(public)/page.tsx" "src/app/(public)/services/page.tsx"
  git commit -m "feat(seo): mount LocalBusiness, FAQPage and Service schema"
```

---

# BATCH 2 — run only after Batch 1 has landed

## PROMPT FOR TASKS 11 + 12 — Remove fake related posts, fix duplicate H1s

```
[paste shared preamble here]

This is TWO tasks in one prompt because they modify the same files. Do them
in order and make TWO SEPARATE COMMITS.

===================================================================
TASK 11 — Remove the placeholder "Related Insights" block
===================================================================

CONTEXT: The article page renders three "Related Insights" cards for articles
that DO NOT EXIST:
  - "Securing the Edge: Future Proofing Infrastructure"
  - "Serverless Architecture: Scale Without Limits"
  - "The Silicon Shift: India's New Chip Economy"
Their URLs return 404. The site has exactly ONE published post. This block
advertises fake content to every visitor and every crawler.

MODIFY: src/app/(public)/blog/[slug]/page.tsx

DELETE the entire "Related Insights" section — there are TWO variants in the
markup, a mobile carousel and a desktop grid. Both must go. You can find the
whole region by searching for these strings:
  "Related Insights"
  "Securing the Edge"
  "Serverless Architecture"
  "The Silicon Shift"

Delete the complete JSX region containing them, including the section wrapper,
the heading, the card markup, and the lh3.googleusercontent.com image URLs
used by those cards.

DO NOT replace it with a real related-posts query. With one published post
there is nothing to relate to. Deleting it IS the entire task.

Be careful to leave intact everything that is NOT part of that section —
especially the <MDXRemote> render, the author bio box, and the footer.

VERIFY:
  npm run lint
  npm run build
  npx next start -p 3100
Then:
  curl -s http://localhost:3100/blog/google-stitch-ai-ui-design-modern-revolution-2026 | grep -c "Silicon Shift"

EXPECTED: 0

NOTE: on a machine with no database connection this article may return 404
locally, in which case the grep returns 0 trivially. That is acceptable —
the real check is that the strings are gone from the source file:
  grep -c "Silicon Shift" "src/app/(public)/blog/[slug]/page.tsx"
EXPECTED: 0

COMMIT (first commit):
  git add "src/app/(public)/blog/[slug]/page.tsx"
  git commit -m "fix(content): remove placeholder related-posts block advertising 404 articles"

===================================================================
TASK 12 — Enforce exactly one <h1> per page
===================================================================

CONTEXT: Two pages render TWO <h1> elements. The cause is the same in both:
there is a mobile section (`md:hidden`) and a desktop section
(`hidden md:block` / `hidden md:flex`), and BOTH contain an <h1>. CSS hides
one visually but both are in the DOM, so crawlers see two.

THE RULE: keep the MOBILE <h1> as the <h1>, and demote the DESKTOP duplicate
to <h2>. Google indexes mobile-first, so the mobile one is the heading that
is actually visible when Google renders the page. The text is identical in
both, so no ranking signal is lost.

WHEN YOU CHANGE A TAG, COPY THE className ACROSS BYTE-FOR-BYTE. Changing
h1 -> h2 with an identical className produces ZERO visual change. If the page
looks different afterwards, you changed something you should not have.

--- 12a: src/app/(public)/blog/[slug]/page.tsx ---

There are two <h1> tags, around lines 137 and 171.
- Line ~137 is inside the MOBILE header. LEAVE IT AS <h1>.
- Line ~171 is inside the block starting `<header className="hidden md:flex ...`.
  Change ONLY that one from <h1 ...> to <h2 ...> and its closing </h1> to
  </h2>. Keep its className exactly as-is.

--- 12b: src/components/public/AboutPageClient.tsx ---

There are two <h1> tags, around lines 17 and 34.
- Line ~17 is inside `<section className="md:hidden ...`. LEAVE IT AS <h1>.
- Line ~34 is inside `<section className="hidden md:block ...`.
  Change ONLY that one from <h1 ...> to <h2 ...> and its closing </h1> to
  </h2>. Keep its className exactly as-is.

--- 12c: src/app/(public)/blog/page.tsx ---

This page has only ONE <h1> (around line 71), so the count is already
correct — but the <h1> is the FEATURED ARTICLE'S headline, not a page title.
The blog index should be titled as the blog, not as whichever post is newest.

Change that <h1 ...> to <h2 ...> (and </h1> to </h2>), keeping its className
byte-for-byte.

Then add a screen-reader-only page heading. The page component returns a
fragment; around line 32-34 the code reads:

  return (
    <>
      <BreadcrumbSchema

Insert the new heading between the `<>` line and the `<BreadcrumbSchema` line,
so it becomes exactly:

  return (
    <>
      <h1 className="sr-only">Insights for the Digital Future</h1>
      <BreadcrumbSchema

`sr-only` is a standard Tailwind utility: the heading is read by crawlers and
screen readers but is invisible on screen, so the page looks identical.

VERIFY:
  npm run lint
  npm run build
  npx next start -p 3100
Then:
  node scripts/seo-check.mjs http://localhost:3100

EXPECTED — this check must flip from FAIL to PASS:
  PASS  /about has exactly one <h1>
And these must STAY passing:
  PASS  /blog has exactly one <h1>
  PASS  / has exactly one <h1>
  PASS  /services has exactly one <h1>
  PASS  /case-studies has exactly one <h1>
  PASS  /contact has exactly one <h1>

Then confirm visually that /about and /blog look EXACTLY as before at both
desktop (1280px) and mobile (375px) widths. Any visual difference is a bug.

REPORT BACK: the "N/63 checks passed" line, and confirmation that /about and
/blog are visually unchanged at both widths.

COMMIT (second commit):
  git add "src/app/(public)/blog/[slug]/page.tsx" src/components/public/AboutPageClient.tsx "src/app/(public)/blog/page.tsx"
  git commit -m "fix(seo): enforce a single h1 per page"
```
