import { revalidatePath } from "next/cache";
import { z } from "zod";

import { saveAboutContent } from "@/lib/about";

export const runtime = "nodejs";

const metricSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

const pillarSchema = z.object({
  eyebrow: z.string().trim().nullable().optional(),
  icon: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  footerLabel: z.string().trim().nullable().optional(),
});

const aboutSchema = z.object({
  hero: z.object({
    badgeText: z.string().trim().min(1),
    headlineLead: z.string().trim().min(1),
    headlineAccent: z.string().trim().min(1),
    description: z.string().trim().min(1),
    desktopImage: z.string().trim().min(1),
  }),
  leadership: z.object({
    portraitImage: z.string().trim().min(1),
    name: z.string().trim().min(1),
    title: z.string().trim().min(1),
    executiveBadge: z.string().trim().min(1),
    headlineLead: z.string().trim().min(1),
    headlineAccent: z.string().trim().min(1),
    quote: z.string().trim().min(1),
    bio: z.string().trim().min(1),
    bioButtonLabel: z.string().trim().min(1),
    metrics: z.array(metricSchema).min(2),
  }),
  pillars: z.object({
    heading: z.string().trim().min(1),
    items: z.array(pillarSchema).length(4),
  }),
  cta: z.object({
    heading: z.string().trim().min(1),
    primaryLabel: z.string().trim().min(1),
    primaryHref: z.string().trim().min(1),
    secondaryLabel: z.string().trim().min(1),
    secondaryHref: z.string().trim().min(1),
  }),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const payload = aboutSchema.parse(body);

    await saveAboutContent(payload);

    revalidatePath('/about');
    revalidatePath('/admin/content/about');

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ ok: false, error: error.issues[0]?.message ?? 'Invalid About page payload.' }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unable to save About page content.';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}