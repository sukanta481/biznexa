import "server-only";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { isMissingDatabaseConfigError, query } from "@/lib/db";
import { getAllPosts, getAllPostSlugs, getPostBySlug, type BlogPost as FileBlogPost } from "@/lib/mdx";

export interface BlogPost {
  id?: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorImage?: string | null;
  category: string;
  serviceLine?: string | null;
  region?: string | null;
  readTime: string;
  published: boolean;
  content: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  views?: number;
  featured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

interface BlogPostRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  author_image: string | null;
  category: string;
  service_line: string | null;
  region: string | null;
  read_time: string;
  cover_image: string | null;
  cover_image_alt: string | null;
  published: number;
  featured: number;
  views: number;
  seo_title: string | null;
  seo_description: string | null;
  published_at: Date | string | null;
  created_at: Date | string | null;
}

interface CountRow extends RowDataPacket {
  total: number;
  published_total: number;
  draft_total: number;
  total_views: number;
}

interface CategoryRow extends RowDataPacket {
  category: string;
  total: number;
}

interface SlugRow extends RowDataPacket {
  slug: string;
}

interface ColumnRow extends RowDataPacket {
  Field: string;
}

export interface AdminBlogArticle {
  id: number;
  slug: string;
  title: string;
  author: string;
  category: string;
  status: "Published" | "Draft";
  date: string;
}

export interface AdminBlogMetrics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
}

export interface AdminBlogCategoryStat {
  name: string;
  total: number;
  percentage: number;
}

export interface AdminBlogDashboardData {
  metrics: AdminBlogMetrics;
  recentArticles: AdminBlogArticle[];
  categoryStats: AdminBlogCategoryStat[];
}

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  description: string;
  content: string;
  author: string;
  authorImage?: string | null;
  category: string;
  serviceLine?: string | null;
  region?: string | null;
  readTime: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  featured?: boolean;
  published?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
}

interface BlogSchemaConfig {
  selectSql: string;
  publishedCondition: string;
  sortSql: string;
  publishedCountSql: string;
  draftCountSql: string;
  hasAuthorImage: boolean;
  hasServiceLine: boolean;
  hasRegion: boolean;
  hasCoverImageAlt: boolean;
  hasSeoTitle: boolean;
  hasSeoDescription: boolean;
}

function isSchemaMismatchError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "ER_BAD_FIELD_ERROR" || error.code === "ER_NO_SUCH_TABLE")
  );
}

function isDatabaseConnectivityError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    ["ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT"].includes(error.code)
  );
}

function shouldUseFileFallback(error: unknown) {
  return (
    isSchemaMismatchError(error) ||
    isMissingDatabaseConfigError(error) ||
    isDatabaseConnectivityError(error)
  );
}

function toIsoString(value: Date | string | null | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function toNullableDateTime(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 19).replace("T", " ");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function ensureUniqueSlug(baseSlug: string) {
  const normalizedBase = slugify(baseSlug) || `blog-post-${Date.now()}`;
  const rows = await query<SlugRow[]>(
    `
      SELECT slug
      FROM blog_posts
      WHERE slug = ? OR slug LIKE ?
      ORDER BY slug ASC
    `,
    [normalizedBase, `${normalizedBase}-%`],
  );

  const usedSlugs = new Set(rows.map((row) => row.slug));

  if (!usedSlugs.has(normalizedBase)) {
    return normalizedBase;
  }

  let suffix = 2;

  while (usedSlugs.has(`${normalizedBase}-${suffix}`)) {
    suffix += 1;
  }

  return `${normalizedBase}-${suffix}`;
}

function mapRowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    author: row.author,
    authorImage: row.author_image,
    category: row.category,
    serviceLine: row.service_line,
    region: row.region,
    readTime: row.read_time,
    coverImage: row.cover_image,
    coverImageAlt: row.cover_image_alt,
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    views: row.views,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    date: toIsoString(row.published_at ?? row.created_at),
  };
}

function fromFilePost(post: FileBlogPost): BlogPost {
  return {
    ...post,
    featured: false,
    views: 0,
    coverImage: null,
  };
}

async function getBlogSchemaConfig(): Promise<BlogSchemaConfig> {
  const rows = await query<ColumnRow[]>("SHOW COLUMNS FROM blog_posts");
  const columns = new Set(rows.map((row) => row.Field));

  const descriptionSql = columns.has("description")
    ? "COALESCE(description, '')"
    : columns.has("excerpt")
      ? "COALESCE(excerpt, '')"
      : "''";

  const authorSql = columns.has("author") ? "COALESCE(author, 'Sukanta Saha')" : "'Sukanta Saha'";
  const authorImageSql = columns.has("author_image") ? "author_image" : "NULL";
  const readTimeSql = columns.has("read_time") ? "COALESCE(read_time, '5 min read')" : "'5 min read'";
  const serviceLineSql = columns.has("service_line") ? "service_line" : "NULL";
  const regionSql = columns.has("region") ? "COALESCE(region, 'Global')" : "'Global'";

  const coverImageSql = columns.has("cover_image")
    ? "cover_image"
    : columns.has("featured_image")
      ? "featured_image"
      : "NULL";
  const coverImageAltSql = columns.has("cover_image_alt") ? "cover_image_alt" : "NULL";

  const publishedSql = columns.has("published")
    ? "published"
    : columns.has("status")
      ? "CASE WHEN status = 'published' THEN 1 ELSE 0 END"
      : "1";

  const featuredSql = columns.has("featured") ? "featured" : "0";
  const viewsSql = columns.has("views") ? "COALESCE(views, 0)" : "0";
  const seoTitleSql = columns.has("seo_title") ? "seo_title" : "NULL";
  const seoDescriptionSql = columns.has("seo_description") ? "seo_description" : descriptionSql;

  const publishedAtSql = columns.has("published_at")
    ? "published_at"
    : columns.has("created_at")
      ? "created_at"
      : "NULL";

  const createdAtSql = columns.has("created_at")
    ? "created_at"
    : columns.has("published_at")
      ? "published_at"
      : "NULL";

  return {
    selectSql: `
      SELECT
        id,
        slug,
        title,
        ${descriptionSql} AS description,
        content,
        ${authorSql} AS author,
        ${authorImageSql} AS author_image,
        COALESCE(category, 'Technology') AS category,
        ${serviceLineSql} AS service_line,
        ${regionSql} AS region,
        ${readTimeSql} AS read_time,
        ${coverImageSql} AS cover_image,
        ${coverImageAltSql} AS cover_image_alt,
        ${publishedSql} AS published,
        ${featuredSql} AS featured,
        ${viewsSql} AS views,
        ${seoTitleSql} AS seo_title,
        ${seoDescriptionSql} AS seo_description,
        ${publishedAtSql} AS published_at,
        ${createdAtSql} AS created_at
      FROM blog_posts
    `,
    publishedCondition: `${publishedSql} = 1`,
    sortSql: `${featuredSql} DESC, COALESCE(${publishedAtSql}, ${createdAtSql}) DESC`,
    hasAuthorImage: columns.has("author_image"),
    hasServiceLine: columns.has("service_line"),
    hasRegion: columns.has("region"),
    hasCoverImageAlt: columns.has("cover_image_alt"),
    hasSeoTitle: columns.has("seo_title"),
    hasSeoDescription: columns.has("seo_description"),
    publishedCountSql: columns.has("published")
      ? "SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END)"
      : columns.has("status")
        ? "SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END)"
        : "COUNT(*)",
    draftCountSql: columns.has("published")
      ? "SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END)"
      : columns.has("status")
        ? "SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END)"
        : "0",
  };
}

export async function getAllBlogPosts() {
  try {
    const schema = await getBlogSchemaConfig();
    const rows = await query<BlogPostRow[]>(`
      ${schema.selectSql}
      WHERE ${schema.publishedCondition}
      ORDER BY ${schema.sortSql}
    `);

    return rows.map(mapRowToPost);
  } catch (error) {
    if (!shouldUseFileFallback(error)) {
      throw error;
    }

    return getAllPosts().map(fromFilePost);
  }
}

export async function createBlogPost(input: CreateBlogPostInput) {
  const schema = await getBlogSchemaConfig();
  const slug = await ensureUniqueSlug(input.slug || input.title);
  const published = input.published ?? true;
  const publishedAt = published
    ? toNullableDateTime(input.publishedAt) ?? toNullableDateTime(new Date().toISOString())
    : null;

  const columns = [
    "slug",
    "title",
    "description",
    "content",
    "author",
    "category",
    "read_time",
    "cover_image",
    "featured",
    "published",
    "published_at",
  ];

  const values: unknown[] = [
    slug,
    input.title.trim(),
    input.description.trim(),
    input.content,
    input.author.trim(),
    input.category.trim(),
    input.readTime.trim(),
    input.coverImage?.trim() || null,
    published ? Number(Boolean(input.featured)) : Number(Boolean(input.featured)),
    Number(published),
    publishedAt,
  ];

  if (schema.hasAuthorImage) {
    columns.push("author_image");
    values.push(input.authorImage?.trim() || null);
  }

  if (schema.hasServiceLine) {
    columns.push("service_line");
    values.push(input.serviceLine?.trim() || null);
  }

  if (schema.hasRegion) {
    columns.push("region");
    values.push(input.region?.trim() || "Global");
  }

  if (schema.hasCoverImageAlt) {
    columns.push("cover_image_alt");
    values.push(input.coverImageAlt?.trim() || null);
  }

  if (schema.hasSeoTitle) {
    columns.push("seo_title");
    values.push(input.seoTitle?.trim() || null);
  }

  if (schema.hasSeoDescription) {
    columns.push("seo_description");
    values.push(input.seoDescription?.trim() || null);
  }

  const placeholders = columns.map(() => "?").join(", ");

  const result = await query<ResultSetHeader>(
    `
      INSERT INTO blog_posts (${columns.join(", ")})
      VALUES (${placeholders})
    `,
    values,
  );

  return {
    id: result.insertId,
    slug,
  };
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const schema = await getBlogSchemaConfig();
    const rows = await query<BlogPostRow[]>(
      `
        ${schema.selectSql}
        WHERE slug = ?
        LIMIT 1
      `,
      [slug],
    );

    const post = rows[0];
    return post ? mapRowToPost(post) : null;
  } catch (error) {
    if (!shouldUseFileFallback(error)) {
      throw error;
    }

    const fallbackPost = getPostBySlug(slug);
    return fallbackPost ? fromFilePost(fallbackPost) : null;
  }
}

export async function getAllBlogSlugs() {
  try {
    const schema = await getBlogSchemaConfig();
    const rows = await query<SlugRow[]>(`
      SELECT slug
      FROM blog_posts
      WHERE ${schema.publishedCondition}
      ORDER BY ${schema.sortSql}
    `);

    return rows.map((row) => row.slug);
  } catch (error) {
    if (!shouldUseFileFallback(error)) {
      throw error;
    }

    return getAllPostSlugs();
  }
}

export async function getAdminBlogDashboardData(): Promise<AdminBlogDashboardData> {
  try {
    const schema = await getBlogSchemaConfig();
    const [totalsRows, categoryRows, recentRows] = await Promise.all([
      query<CountRow[]>(`
        SELECT
          COUNT(*) AS total,
          COALESCE(${schema.publishedCountSql}, 0) AS published_total,
          COALESCE(${schema.draftCountSql}, 0) AS draft_total,
          COALESCE(SUM(views), 0) AS total_views
        FROM blog_posts
      `),
      query<CategoryRow[]>(`
        SELECT COALESCE(category, 'Technology') AS category, COUNT(*) AS total
        FROM blog_posts
        GROUP BY COALESCE(category, 'Technology')
        ORDER BY total DESC, category ASC
        LIMIT 3
      `),
      query<BlogPostRow[]>(`
        ${schema.selectSql}
        ORDER BY ${schema.sortSql}
        LIMIT 5
      `),
    ]);

    const totals = totalsRows[0];
    const totalArticles = totals?.total ?? 0;

    return {
      metrics: {
        totalArticles,
        publishedArticles: totals?.published_total ?? 0,
        draftArticles: totals?.draft_total ?? 0,
        totalViews: totals?.total_views ?? 0,
      },
      recentArticles: recentRows.map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        author: row.author,
        category: row.category,
        status: row.published ? "Published" : "Draft",
        date: toIsoString(row.published_at ?? row.created_at),
      })),
      categoryStats: categoryRows.map((row) => ({
        name: row.category,
        total: row.total,
        percentage: totalArticles > 0 ? Math.round((row.total / totalArticles) * 100) : 0,
      })),
    };
  } catch (error) {
    if (!shouldUseFileFallback(error)) {
      throw error;
    }

    const filePosts = getAllPosts().map(fromFilePost);
    const categoryCounts = new Map<string, number>();

    for (const post of filePosts) {
      categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
    }

    const totalArticles = filePosts.length;
    const categoryStats = [...categoryCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 3)
      .map(([name, total]) => ({
        name,
        total,
        percentage: totalArticles > 0 ? Math.round((total / totalArticles) * 100) : 0,
      }));

    return {
      metrics: {
        totalArticles,
        publishedArticles: totalArticles,
        draftArticles: 0,
        totalViews: 0,
      },
      recentArticles: filePosts.slice(0, 5).map((post, index) => ({
        id: index + 1,
        slug: post.slug,
        title: post.title,
        author: post.author,
        category: post.category,
        status: post.published ? "Published" : "Draft",
        date: post.date,
      })),
      categoryStats,
    };
  }
}
