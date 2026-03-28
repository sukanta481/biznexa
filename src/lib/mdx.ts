import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
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
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(".mdx", "");
      const filePath = path.join(BLOG_DIR, filename);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        author: data.author || "Sukanta Saha",
        authorImage: data.authorImage || null,
        category: data.category || "Technology",
        serviceLine: data.serviceLine || null,
        region: data.region || "Global",
        readTime: data.readTime || "5 min read",
        published: data.published !== false,
        content,
        coverImage: data.coverImage || null,
        coverImageAlt: data.coverImageAlt || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      } satisfies BlogPost;
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || "",
    author: data.author || "Sukanta Saha",
    authorImage: data.authorImage || null,
    category: data.category || "Technology",
    serviceLine: data.serviceLine || null,
    region: data.region || "Global",
    readTime: data.readTime || "5 min read",
    published: data.published !== false,
    content,
    coverImage: data.coverImage || null,
    coverImageAlt: data.coverImageAlt || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
