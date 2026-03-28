import { NextResponse } from "next/server";
import { z } from "zod";

import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";

const siteSettingsSchema = z.object({
  social: z.object({
    whatsapp: z.string().trim(),
    linkedin: z.string().trim(),
    twitter: z.string().trim(),
    facebook: z.string().trim(),
    instagram: z.string().trim(),
    youtube: z.string().trim(),
    github: z.string().trim(),
    telegram: z.string().trim(),
  }),
});

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error("Failed to load site settings", error);
    return NextResponse.json({ ok: false, error: "Failed to load site settings." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const settings = siteSettingsSchema.parse(body);

    await saveSiteSettings(settings);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save site settings", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid site settings payload.", issues: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: false, error: "Failed to save site settings." }, { status: 500 });
  }
}
