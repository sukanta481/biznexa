import type { MetadataRoute } from "next";
import type { RowDataPacket } from "mysql2/promise";

import { SITE_URL } from "@/lib/constants";
import { query } from "@/lib/db";

// Regenerate hourly so CMS-published content appears without a redeploy.
export const revalidate = 3600;

interface SlugRow extends RowDataPacket {
  slug: string;
  updated_at: Date | string | null;
}

// Slugs are read from the database directly rather than through
// getAllBlogPosts()/getAllCaseStudies(), because those fall back to the MDX
// fixtures in content/blog when the DB is unreachable. Those fixture slugs do
// not exist in production — emitting them would hand Google a sitemap of 404s
// while omitting the only article that ranks. For a sitemap a short correct
// list beats a long invented one, so a DB failure yields static routes alone.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  let posts: MetadataRoute.Sitemap = [];
  try {
    const rows = await query<SlugRow[]>(
      "SELECT slug, updated_at FROM blog_posts WHERE published = 1 ORDER BY published_at DESC",
    );
    posts = rows.map((row) => ({
      url: `${SITE_URL}/blog/${row.slug}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    posts = [];
  }

  let studies: MetadataRoute.Sitemap = [];
  try {
    const rows = await query<SlugRow[]>(
      "SELECT slug, updated_at FROM case_studies WHERE published = 1 ORDER BY sort_order ASC",
    );
    studies = rows.map((row) => ({
      url: `${SITE_URL}/case-studies/${row.slug}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    studies = [];
  }

  return [...staticRoutes, ...posts, ...studies];
}
