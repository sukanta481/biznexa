import { revalidatePath } from "next/cache";
import { z } from "zod";

import { saveCaseStudy } from "@/lib/case-studies";

export const runtime = "nodejs";

const caseStudySchema = z.object({
  id: z.number().optional(),
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  client: z.string().trim().min(1),
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const payload = caseStudySchema.parse(body);

    await saveCaseStudy(payload);

    revalidatePath("/case-studies");
    revalidatePath(`/case-studies/${payload.slug}`);
    revalidatePath("/admin/content/case-studies");

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          ok: false,
          error: error.issues[0]?.message ?? "Invalid case study payload.",
        },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Unable to save case study.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
