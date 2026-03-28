import { revalidatePath } from "next/cache";
import { z } from "zod";

import { saveHomepageContent } from "@/lib/homepage";

export const runtime = "nodejs";

const statSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

const serviceSchema = z.object({
  eyebrow: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  imageUrl: z.string().trim().optional().nullable(),
});

const markerSchema = z.object({
  icon: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

const testimonialSchema = z.object({
  initials: z.string().trim().min(1),
  name: z.string().trim().min(1),
  company: z.string().trim().min(1),
  quote: z.string().trim().min(1),
});

const faqSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});

const homepageSchema = z.object({
  hero: z.object({
    badgeText: z.string().trim().min(1),
    leadText: z.string().trim().min(1),
    accentText: z.string().trim().min(1),
    description: z.string().trim().min(1),
    primaryCtaLabel: z.string().trim().min(1),
    primaryCtaHref: z.string().trim().min(1),
    secondaryCtaLabel: z.string().trim().min(1),
    secondaryCtaHref: z.string().trim().min(1),
  }),
  stats: z.array(statSchema).length(4),
  servicesIntro: z.object({
    heading: z.string().trim().min(1),
    description: z.string().trim().min(1),
  }),
  services: z.array(serviceSchema).length(4),
  globalReach: z.object({
    heading: z.string().trim().min(1),
    backgroundImage: z.string().trim().min(1),
    markers: z.array(markerSchema).min(2),
  }),
  testimonialsIntro: z.object({
    heading: z.string().trim().min(1),
    mobileDescription: z.string().trim().min(1),
  }),
  testimonials: z.array(testimonialSchema).min(1),
  faqIntro: z.object({
    heading: z.string().trim().min(1),
  }),
  faqs: z.array(faqSchema).min(1),
  cta: z.object({
    heading: z.string().trim().min(1),
    mobileDescription: z.string().trim().min(1),
    primaryLabel: z.string().trim().min(1),
    primaryHref: z.string().trim().min(1),
    secondaryLabel: z.string().trim().min(1),
    secondaryHref: z.string().trim().min(1),
    email: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    whatsappIconUrl: z.string().trim().min(1),
  }),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const payload = homepageSchema.parse(body);

    await saveHomepageContent(payload);

    revalidatePath("/");
    revalidatePath("/admin/content/homepage");

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ ok: false, error: error.issues[0]?.message ?? "Invalid homepage payload." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unable to save homepage content.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
