import { revalidatePath } from "next/cache";
import { z } from "zod";

import { saveServicesContent } from "@/lib/services";

export const runtime = "nodejs";

const servicesContentSchema = z.object({
  hero: z.object({
    badgeText: z.string().trim().min(1),
    mobileHeadlineLead: z.string().trim().min(1),
    mobileHeadlinePrimary: z.string().trim().min(1),
    mobileHeadlineAccent: z.string().trim().min(1),
    desktopHeadline: z.string().trim().min(1),
    description: z.string().trim().min(1),
    highlights: z.array(z.string().trim().min(1)).min(3),
    imageUrl: z.string().trim().min(1),
    imageAlt: z.string().trim().min(1),
  }),
  workflow: z.object({
    heading: z.string().trim().min(1),
    steps: z.array(z.object({
      number: z.string().trim().min(1),
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      icon: z.string().trim().min(1),
      accent: z.enum(["primary", "secondary", "tertiary"]),
      surface: z.enum(["glass", "solid"]),
    })).length(4),
  }),
  mobileServices: z.object({
    heading: z.string().trim().min(1),
    cards: z.array(z.object({
      title: z.string().trim().min(1),
      icon: z.string().trim().min(1),
      imageUrl: z.string().trim().min(1),
      imageAlt: z.string().trim().min(1),
      bullets: z.array(z.string().trim().min(1)).min(2),
      buttonLabel: z.string().trim().min(1),
      buttonHref: z.string().trim().min(1),
    })).length(3),
  }),
  desktopSidebar: z.object({
    eyebrow: z.string().trim().min(1),
    headingLead: z.string().trim().min(1),
    headingAccent: z.string().trim().min(1),
    description: z.string().trim().min(1),
    highlights: z.array(z.string().trim().min(1)).min(3),
  }),
  desktopServices: z.array(z.object({
    title: z.string().trim().min(1),
    icon: z.string().trim().min(1),
    description: z.string().trim().min(1),
    bullets: z.array(z.string().trim().min(1)).min(4),
    accent: z.enum(["primary", "secondary", "tertiary"]),
  })).length(3),
  cta: z.object({
    mobileLead: z.string().trim().min(1),
    mobileAccent: z.string().trim().min(1),
    desktopHeading: z.string().trim().min(1),
    buttonLabel: z.string().trim().min(1),
    buttonHref: z.string().trim().min(1),
  }),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const payload = servicesContentSchema.parse(body);

    await saveServicesContent(payload);

    revalidatePath('/services');
    revalidatePath('/admin/content/services');

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ ok: false, error: error.issues[0]?.message ?? 'Invalid services payload.' }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unable to save services content.';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
