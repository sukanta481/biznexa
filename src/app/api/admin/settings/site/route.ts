import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import {
  createCsrfToken,
  EMAIL_DEPARTMENT_OPTIONS,
  getSiteSettings,
  PHONE_LABEL_OPTIONS,
  saveSiteSettings,
  verifyCsrfToken,
  type SiteEmailEntry,
  type SitePhoneEntry,
  type SiteSettingKey,
} from "@/lib/site-settings";

export const runtime = "nodejs";

function parseSettings(formData: FormData) {
  const settings = {} as Record<SiteSettingKey, string>;

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^settings\[(.+)\]$/);

    if (!match) {
      continue;
    }

    settings[match[1] as SiteSettingKey] = typeof value === "string" ? value.trim() : "";
  }

  return settings;
}

function parsePhoneEntries(formData: FormData) {
  const labels = formData.getAll("phone_label[]");
  const numbers = formData.getAll("phone_number[]");
  const rows: SitePhoneEntry[] = [];

  for (let index = 0; index < Math.max(labels.length, numbers.length); index += 1) {
    const rawLabel = labels[index];
    const rawNumber = numbers[index];
    const label = typeof rawLabel === "string" ? rawLabel : "General";
    const number = typeof rawNumber === "string" ? rawNumber.trim() : "";

    if (!number) {
      continue;
    }

    rows.push({
      label: PHONE_LABEL_OPTIONS.includes(label as (typeof PHONE_LABEL_OPTIONS)[number]) ? label : "General",
      number,
    });
  }

  return rows;
}

function parseEmailEntries(formData: FormData) {
  const departments = formData.getAll("email_department[]");
  const addresses = formData.getAll("email_address[]");
  const rows: SiteEmailEntry[] = [];

  for (let index = 0; index < Math.max(departments.length, addresses.length); index += 1) {
    const rawDepartment = departments[index];
    const rawAddress = addresses[index];
    const department = typeof rawDepartment === "string" ? rawDepartment : "General";
    const email = typeof rawAddress === "string" ? rawAddress.trim() : "";

    if (!email) {
      continue;
    }

    rows.push({
      department: EMAIL_DEPARTMENT_OPTIONS.includes(department as (typeof EMAIL_DEPARTMENT_OPTIONS)[number])
        ? department
        : "General",
      email,
    });
  }

  return rows;
}

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ ok: true, settings, csrfToken: createCsrfToken() });
  } catch (error) {
    console.error("Failed to load site settings", error);
    return NextResponse.json({ ok: false, error: "Failed to load site settings." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    if (formData.get("update_settings") !== "1") {
      return NextResponse.json({ ok: false, error: "Invalid settings request." }, { status: 400 });
    }

    const csrfToken = formData.get("csrf_token");
    if (typeof csrfToken !== "string" || !verifyCsrfToken(csrfToken)) {
      return NextResponse.json({ ok: false, error: "Invalid or expired CSRF token." }, { status: 403 });
    }

    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || null;
    const userAgent = headerStore.get("user-agent");

    await saveSiteSettings({
      settings: parseSettings(formData),
      contactPhones: parsePhoneEntries(formData),
      contactEmails: parseEmailEntries(formData),
      ipAddress,
      userAgent,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/case-studies");
    revalidatePath("/blog");
    revalidatePath("/contact");
    revalidatePath("/admin/settings/site");

    return NextResponse.json({
      ok: true,
      message: "Settings updated successfully!",
      csrfToken: createCsrfToken(),
    });
  } catch (error) {
    console.error("Failed to save site settings", error);

    const message = error instanceof Error ? error.message : "Failed to save site settings.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
