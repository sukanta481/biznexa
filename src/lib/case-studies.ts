import "server-only";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { isMissingDatabaseConfigError, query } from "@/lib/db";

export interface CaseStudyResult {
  metric: string;
  label: string;
}

export interface CaseStudy {
  id?: number;
  slug: string;
  title: string;
  client: string;
  clientRole: string;
  category: string;
  excerpt: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  technologies: string[];
  coverImage: string;
  coverImageAlt: string;
  clientQuote: string;
  clientImage: string;
  relatedSlugs: string[];
  published: boolean;
  sortOrder: number;
}

interface CaseStudyRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  client: string;
  client_role: string | null;
  category: string;
  excerpt: string;
  challenge: string;
  solution: string;
  results_json: string;
  technologies_json: string;
  cover_image: string | null;
  cover_image_alt: string | null;
  client_quote: string | null;
  client_image: string | null;
  related_slugs_json: string | null;
  published: number;
  sort_order: number;
}

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    slug: "ai-logistics-transformation",
    title: "AI-Powered Logistics Transformation",
    client: "GlobalFreight Solutions",
    clientRole: "Executive Sponsor",
    category: "AI Automation",
    excerpt: "How we automated route optimization and reduced delivery costs by 35% using custom AI agents.",
    challenge: "GlobalFreight was spending 40+ hours per week on manual route planning across 200+ delivery vehicles. Their legacy system couldn't handle real-time traffic data or dynamic customer priorities.",
    solution: "We built a custom AI-powered route optimization engine that processes real-time traffic, weather, and priority data. The system auto-assigns deliveries, optimizes routes every 15 minutes, and provides a live dashboard for fleet managers.",
    results: [
      { metric: "35%", label: "Cost Reduction" },
      { metric: "40hrs", label: "Weekly Hours Saved" },
      { metric: "98.5%", label: "On-Time Delivery" },
      { metric: "2.5x", label: "Fleet Efficiency" },
    ],
    technologies: ["Python", "TensorFlow", "Next.js", "PostgreSQL", "Redis"],
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFlvMBUpYvpWH3dHiMdarFZN3MlWoXyk50_XR9iZM0oziHKYZdc32GWiy6bX1JsPlNxmWFl9ilfRbcCKVhKFzCnpYcmm9NKsepk7D-D1lQB_wGoK7SYnzd9yF-3eA3BQPfz5_lQlOFlLy7h71GOmjglJG4iQJtvl8yH_TOMVrffOhU-gOzuy44mBAWff-ffVt-QCQeyC2rXMbGa_psR6FgfpWFqZ5KeisZ2h2BlT0Gi2eQcKVtmqywZ7HpxFEPgo5zp-QjtUmEnAES",
    coverImageAlt: "AI Logistics Dashboard",
    clientQuote: "Biznexa didn't just provide a tool; they transformed our entire digital architecture. Their approach has set a new benchmark for what's possible.",
    clientImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA39dAxR9YZVgFTIudq8UvVHpwyh4vL5FsGYdmOONfKAbAWFbmDBlgLQPZ0Ctl2q4Izf9z4uyzck6_whZbYOjBW2keOStaU9071r3jqs9K4Q8I2eO96_6iCudlne_fL6GWy282SLQ5RMxj8nKPx83DJi6cUHfL5Nkbbwj2BuNZDUD7IRSvmFIyFS_uZzYm4nHON2yAu0InYEpnmIm93vc8HnteJtx1qvAwHX7Ypf_pm_8KHvxyOEgwzQd_BIMPIYoB9JTofNsedXNwi",
    relatedSlugs: ["ecommerce-redesign", "seo-market-dominance"],
    published: true,
    sortOrder: 1,
  },
  {
    slug: "ecommerce-redesign",
    title: "E-Commerce Revenue Surge",
    client: "ArtisanCraft India",
    clientRole: "Executive Sponsor",
    category: "Web Development",
    excerpt: "A complete platform redesign that increased conversion rates by 280% and reduced cart abandonment.",
    challenge: "ArtisanCraft's existing Shopify store had a 78% cart abandonment rate and page load times exceeding 8 seconds. Mobile users accounted for 70% of traffic but only 15% of conversions.",
    solution: "We rebuilt the entire platform on a headless commerce architecture with Next.js, achieving sub-2-second load times. We redesigned the checkout flow to 3 steps and implemented AI-powered product recommendations.",
    results: [
      { metric: "280%", label: "Conversion Increase" },
      { metric: "1.8s", label: "Page Load Time" },
      { metric: "45%", label: "Cart Abandonment Drop" },
      { metric: "INR 2.1Cr", label: "Q1 Revenue" },
    ],
    technologies: ["Next.js", "Shopify Hydrogen", "Tailwind CSS", "Vercel"],
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd3UUy35oCMyX66vZHBASNxgGruCgFnWgYB7EowfvSXV7fbbLTFAP678DYe_y1-XqcLHWPegF1tBxGddSYCtZcuudMZLg4OIyckICpLFxPd0y-bv-SY8GvCBU7qVTdhmntUu-0vLYjakflICcQxW9-ekzDZdwFaBBhD8TJl1QBWtXxX8hgSeDs8GftUi1V5xEJnM9H2JTmqFcZ4bH9J1V_nKcD1P1gBl8f-q0x0vjyYJNg46TWAPZDH9RLRwddQX7xQYB_u31QMiM9",
    coverImageAlt: "E-Commerce Platform",
    clientQuote: "Biznexa gave us a storefront that finally performed like our brand deserved. The speed gains alone changed the business.",
    clientImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA39dAxR9YZVgFTIudq8UvVHpwyh4vL5FsGYdmOONfKAbAWFbmDBlgLQPZ0Ctl2q4Izf9z4uyzck6_whZbYOjBW2keOStaU9071r3jqs9K4Q8I2eO96_6iCudlne_fL6GWy282SLQ5RMxj8nKPx83DJi6cUHfL5Nkbbwj2BuNZDUD7IRSvmFIyFS_uZzYm4nHON2yAu0InYEpnmIm93vc8HnteJtx1qvAwHX7Ypf_pm_8KHvxyOEgwzQd_BIMPIYoB9JTofNsedXNwi",
    relatedSlugs: ["ai-logistics-transformation", "seo-market-dominance"],
    published: true,
    sortOrder: 2,
  },
  {
    slug: "seo-market-dominance",
    title: "From Page 5 to Page 1",
    client: "Zenith Legal Associates",
    clientRole: "Executive Sponsor",
    category: "Digital Marketing",
    excerpt: "A comprehensive SEO overhaul that took a law firm from obscurity to the top of Google search results.",
    challenge: "Zenith Legal had no online presence despite being a reputable firm for 15 years. Their website was a basic WordPress template with no SEO optimization, ranking on page 5+ for all target keywords.",
    solution: "We executed a full technical SEO audit, rebuilt the site with proper schema markup, created a content strategy targeting 50+ keywords, and built a local SEO campaign with Google Business Profile optimization.",
    results: [
      { metric: "Page 1", label: "Google Ranking" },
      { metric: "520%", label: "Organic Traffic" },
      { metric: "34", label: "Keywords on Page 1" },
      { metric: "3x", label: "Client Inquiries" },
    ],
    technologies: ["Next.js", "Schema.org", "Google Analytics", "Ahrefs"],
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbtiicdNvZKIqk7-GlgEwKXOmQkABVKPL5s7W3WdEiqKSzHxobNpRLDjYesfOoBC2eVXf_FDe2jFsRutn6D9fqHZDRiUtyhgls2vlhCe2qvDTeTKA4xwV3BAfZ-DxRpNpQzB3VDijqGOuWhIoSqm7pBYsG9hvkwLinjANcVo0v_bh2DWjLX1Yamiw0PQxzKYya_nicxATPVYkCHmJsVywMZ07FaiGdxc10er68DtuWy_H6oSIjbnytJB5x5lLqAv4zxXCFtQE13mtF",
    coverImageAlt: "SEO Analytics",
    clientQuote: "Their SEO system turned our website into a real acquisition channel. We went from invisible to a category leader.",
    clientImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA39dAxR9YZVgFTIudq8UvVHpwyh4vL5FsGYdmOONfKAbAWFbmDBlgLQPZ0Ctl2q4Izf9z4uyzck6_whZbYOjBW2keOStaU9071r3jqs9K4Q8I2eO96_6iCudlne_fL6GWy282SLQ5RMxj8nKPx83DJi6cUHfL5Nkbbwj2BuNZDUD7IRSvmFIyFS_uZzYm4nHON2yAu0InYEpnmIm93vc8HnteJtx1qvAwHX7Ypf_pm_8KHvxyOEgwzQd_BIMPIYoB9JTofNsedXNwi",
    relatedSlugs: ["ai-logistics-transformation", "ecommerce-redesign"],
    published: true,
    sortOrder: 3,
  },
];

function isSchemaMismatchError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error.code === "ER_BAD_FIELD_ERROR" || error.code === "ER_NO_SUCH_TABLE");
}

function isDatabaseConnectivityError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" && ["ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT"].includes(error.code);
}

function shouldUseFallback(error: unknown) {
  return isSchemaMismatchError(error) || isMissingDatabaseConfigError(error) || isDatabaseConnectivityError(error);
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapRow(row: CaseStudyRow): CaseStudy {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    clientRole: row.client_role ?? "Executive Sponsor",
    category: row.category,
    excerpt: row.excerpt,
    challenge: row.challenge,
    solution: row.solution,
    results: parseJson(row.results_json, [] as CaseStudyResult[]),
    technologies: parseJson(row.technologies_json, [] as string[]),
    coverImage: row.cover_image ?? "",
    coverImageAlt: row.cover_image_alt ?? row.title,
    clientQuote: row.client_quote ?? "",
    clientImage: row.client_image ?? "",
    relatedSlugs: parseJson(row.related_slugs_json, [] as string[]),
    published: row.published === 1,
    sortOrder: row.sort_order,
  };
}

export async function getAllCaseStudies(options?: { includeUnpublished?: boolean }): Promise<CaseStudy[]> {
  try {
    const rows = await query<CaseStudyRow[]>(`
      SELECT *
      FROM case_studies
      ${options?.includeUnpublished ? "" : "WHERE published = 1"}
      ORDER BY sort_order ASC, id ASC
    `);

    if (rows.length === 0) {
      return options?.includeUnpublished ? DEFAULT_CASE_STUDIES : DEFAULT_CASE_STUDIES.filter((study) => study.published);
    }

    return rows.map(mapRow);
  } catch (error) {
    if (!shouldUseFallback(error)) throw error;
    return options?.includeUnpublished ? DEFAULT_CASE_STUDIES : DEFAULT_CASE_STUDIES.filter((study) => study.published);
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
  const studies = await getAllCaseStudies();
  return studies.find((study) => study.slug === slug);
}

export async function getAllCaseStudySlugs(): Promise<string[]> {
  const studies = await getAllCaseStudies();
  return studies.map((study) => study.slug);
}

export async function saveCaseStudy(study: CaseStudy) {
  const relatedSlugs = study.relatedSlugs.filter((slug) => slug && slug !== study.slug);
  await query<ResultSetHeader>(`
    INSERT INTO case_studies (
      id, slug, title, client, client_role, category, excerpt, challenge, solution,
      results_json, technologies_json, cover_image, cover_image_alt, client_quote, client_image,
      related_slugs_json, published, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      slug = VALUES(slug),
      title = VALUES(title),
      client = VALUES(client),
      client_role = VALUES(client_role),
      category = VALUES(category),
      excerpt = VALUES(excerpt),
      challenge = VALUES(challenge),
      solution = VALUES(solution),
      results_json = VALUES(results_json),
      technologies_json = VALUES(technologies_json),
      cover_image = VALUES(cover_image),
      cover_image_alt = VALUES(cover_image_alt),
      client_quote = VALUES(client_quote),
      client_image = VALUES(client_image),
      related_slugs_json = VALUES(related_slugs_json),
      published = VALUES(published),
      sort_order = VALUES(sort_order)
  `, [
    study.id ?? null,
    study.slug,
    study.title,
    study.client,
    study.clientRole,
    study.category,
    study.excerpt,
    study.challenge,
    study.solution,
    JSON.stringify(study.results),
    JSON.stringify(study.technologies),
    study.coverImage,
    study.coverImageAlt,
    study.clientQuote,
    study.clientImage,
    JSON.stringify(relatedSlugs),
    study.published ? 1 : 0,
    study.sortOrder,
  ]);
}
