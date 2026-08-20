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
