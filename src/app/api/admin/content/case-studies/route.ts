import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { saveCaseStudy } from "@/lib/case-studies";

export const runtime = "nodejs";

const caseStudySchema = z.object({
  id: z.number().optional(),
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  client: z.string().trim().min(1),
  clientName: z.string().trim(),
  clientRole: z.string().trim().min(1),
  category: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  challenge: z.string().trim().min(1),
  solution: z.string().trim().min(1),
  results: z
    .array(
      z.object({
        metric: z.string().trim(),
        label: z.string().trim(),
      }),
    )
    .length(4),
  technologies: z.array(z.string().trim()).min(1),
  coverImage: z.string().trim(),
  coverImageAlt: z.string().trim(),
  clientQuote: z.string().trim(),
  clientImage: z.string().trim(),
  relatedSlugs: z.array(z.string().trim()),
  published: z.boolean(),
  sortOrder: z.number(),
});

const FIELD_LABELS: Record<string, string> = {
  slug: "Slug",
  title: "Project Title",
  client: "Client",
  clientName: "Person Name",
  clientRole: "Designation / Role",
  category: "Category",
  excerpt: "Excerpt",
  challenge: "The Challenge",
  solution: "The Biznexa Solution",
  results: "Quantitative Results",
  technologies: "Technologies",
  coverImage: "Hero Background Image",
  coverImageAlt: "Hero Image Alt",
  clientQuote: "Client Quote",
  clientImage: "Portrait / Logo",
  sortOrder: "Sort Order",
};

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    const body = await request.json();
    const payload = caseStudySchema.parse(body);

    await saveCaseStudy(payload);

    revalidatePath("/case-studies");
    revalidatePath(`/case-studies/${payload.slug}`);
    revalidatePath("/admin/content/case-studies");

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Name the offending field(s) — a bare "Too small" tells the editor
      // nothing about which input to fix.
      const details = error.issues
        .slice(0, 4)
        .map((issue) => {
          const path = issue.path.join(".");
          return path ? `${FIELD_LABELS[path] ?? path}: ${issue.message}` : issue.message;
        })
        .join(" | ");

      return Response.json(
        { ok: false, error: details || "Invalid case study payload." },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Unable to save case study.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
