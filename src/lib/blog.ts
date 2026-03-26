import "server-only";

import type { RowDataPacket } from "mysql2/promise";

import { query } from "@/lib/db";
import { getAllPosts, getAllPostSlugs, getPostBySlug, type BlogPost as FileBlogPost } from "@/lib/mdx";

export interface BlogPost {
  id?: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  published: boolean;
  content: string;
  coverImage?: string | null;
  views?: number;
  featured?: boolean;
}

interface BlogPostRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  read_time: string;
  cover_image: string | null;
  published: number;
  featured: number;
  views: number;
  published_at: Date | string | null;
  created_at: Date | string;
}

interface CountRow extends RowDataPacket {
  total: number;
}

interface CategoryRow extends RowDataPacket {
  category: string;
  total: number;
}

interface SlugRow extends RowDataPacket {
  slug: string;
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

function isSchemaMismatchError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "ER_BAD_FIELD_ERROR" || error.code === "ER_NO_SUCH_TABLE")
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

function mapRowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    author: row.author,
    category: row.category,
    readTime: row.read_time,
    coverImage: row.cover_image,
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    views: row.views,
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

export async function getAllBlogPosts() {
  try {
    const rows = await query<BlogPostRow[]>(
      `
        SELECT id, slug, title, description, content, author, category, read_time, cover_image,
               published, featured, views, published_at, created_at
        FROM blog_posts
        WHERE published = 1
        ORDER BY featured DESC, published_at DESC, created_at DESC
      `,
    );

    return rows.map(mapRowToPost);
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }

    return getAllPosts().map(fromFilePost);
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const rows = await query<BlogPostRow[]>(
      `
        SELECT id, slug, title, description, content, author, category, read_time, cover_image,
               published, featured, views, published_at, created_at
        FROM blog_posts
        WHERE slug = ?
        LIMIT 1
      `,
      [slug],
    );

    const post = rows[0];
    return post ? mapRowToPost(post) : null;
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }

    const fallbackPost = getPostBySlug(slug);
    return fallbackPost ? fromFilePost(fallbackPost) : null;
  }
}

export async function getAllBlogSlugs() {
  try {
    const rows = await query<SlugRow[]>(
      `
        SELECT slug
        FROM blog_posts
        WHERE published = 1
        ORDER BY published_at DESC, created_at DESC
      `,
    );

    return rows.map((row) => row.slug);
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }

    return getAllPostSlugs();
  }
}

export async function getAdminBlogDashboardData(): Promise<AdminBlogDashboardData> {
  try {
    const [totalsRows, categoryRows, recentRows] = await Promise.all([
      query<
        (CountRow & {
          published_total: number;
          draft_total: number;
          total_views: number;
        })[]
      >(
        `
          SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) AS published_total,
            SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) AS draft_total,
            COALESCE(SUM(views), 0) AS total_views
          FROM blog_posts
        `,
      ),
      query<CategoryRow[]>(
        `
          SELECT category, COUNT(*) AS total
          FROM blog_posts
          GROUP BY category
          ORDER BY total DESC, category ASC
          LIMIT 3
        `,
      ),
      query<BlogPostRow[]>(
        `
          SELECT id, slug, title, description, content, author, category, read_time, cover_image,
                 published, featured, views, published_at, created_at
          FROM blog_posts
          ORDER BY COALESCE(published_at, created_at) DESC
          LIMIT 5
        `,
      ),
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
    if (!isSchemaMismatchError(error)) {
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
