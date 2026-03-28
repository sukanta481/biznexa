import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createBlogPost } from "@/lib/blog";

export const runtime = "nodejs";

const createBlogPostSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  slug: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().min(20, "Description must be at least 20 characters."),
  content: z.string().min(20, "Content must be at least 20 characters."),
  author: z.string().trim().min(2, "Author is required."),
  authorImage: z.string().trim().optional().or(z.literal("")),
  category: z.string().trim().min(2, "Category is required."),
  serviceLine: z.string().trim().optional().or(z.literal("")),
  region: z.string().trim().min(2, "Region is required."),
  readTime: z.string().trim().min(3, "Read time is required."),
  coverImage: z.string().trim().optional().or(z.literal("")),
  coverImageAlt: z.string().trim().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
  publishedAt: z.string().trim().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = createBlogPostSchema.parse(json);

    const created = await createBlogPost({
      title: payload.title,
      slug: payload.slug || undefined,
      description: payload.description,
      content: payload.content,
      author: payload.author,
      authorImage: payload.authorImage || null,
      category: payload.category,
      serviceLine: payload.serviceLine || null,
      region: payload.region,
      readTime: payload.readTime,
      coverImage: payload.coverImage || null,
      coverImageAlt: payload.coverImageAlt || null,
      featured: payload.featured ?? false,
      published: payload.published ?? true,
      seoTitle: payload.seoTitle || null,
      seoDescription: payload.seoDescription || null,
      publishedAt: payload.publishedAt || null,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${created.slug}`);
    revalidatePath("/admin/blog");

    return Response.json({
      ok: true,
      ...created,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          ok: false,
          error: error.issues[0]?.message ?? "Invalid blog payload.",
        },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Unable to create blog post.";

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
