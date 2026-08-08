import { NextResponse } from "next/server";
import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3";
import nodemailer from "nodemailer";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import {
  getIntegrationConfig,
  recordVerification,
  type Provider,
} from "@/lib/integrations";

export const runtime = "nodejs";

const PROVIDERS: Provider[] = ["whatsapp", "smtp", "s3"];

function isProvider(value: unknown): value is Provider {
  return typeof value === "string" && (PROVIDERS as string[]).includes(value);
}

async function probeWhatsApp(): Promise<{ ok: boolean; detail: string }> {
  const cfg = await getIntegrationConfig("whatsapp");
  const { token, phoneNumberId } = cfg;
  if (!token || !phoneNumberId) {
    return { ok: false, detail: "WhatsApp token and phone number ID are both required." };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v22.0/${phoneNumberId}?fields=display_phone_number,verified_name`,
      { headers: { authorization: `Bearer ${token}` } },
    );
    const json = (await res.json().catch(() => ({}))) as {
      display_phone_number?: string;
      verified_name?: string;
      error?: { message?: string };
    };

    if (!res.ok) {
      return { ok: false, detail: json?.error?.message ?? `Graph API returned ${res.status}` };
    }

    const display = json.display_phone_number ?? phoneNumberId;
    const name = json.verified_name ?? "unknown";
    return { ok: true, detail: `${name} (${display})` };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : "Network error calling Graph API" };
  }
}

async function probeSmtp(): Promise<{ ok: boolean; detail: string }> {
  const cfg = await getIntegrationConfig("smtp");
  const { host, port: portStr, user, pass, secure: secureStr } = cfg;
  if (!host || !user || !pass) {
    return { ok: false, detail: "SMTP host, user, and password are all required." };
  }

  const port = Number(portStr ?? "587");
  const transport = {
    host,
    port,
    secure: secureStr === "true" || port === 465,
    auth: { user, pass },
  };

  try {
    await nodemailer.createTransport(transport).verify();
    return { ok: true, detail: "SMTP connection accepted" };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : "SMTP verification failed" };
  }
}

async function probeS3(): Promise<{ ok: boolean; detail: string }> {
  const cfg = await getIntegrationConfig("s3");
  const { bucket, region, accessKeyId, secretAccessKey, endpoint, forcePathStyle } = cfg;
  if (!bucket || !region) {
    return { ok: false, detail: "S3 bucket and region are both required." };
  }

  try {
    const credentials = accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined;
    const client = new S3Client({
      region,
      credentials,
      endpoint: endpoint || undefined,
      forcePathStyle: forcePathStyle === "true",
    });
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return { ok: true, detail: `${bucket} (${region})` };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : "S3 HeadBucket failed" };
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    const body = (await request.json().catch(() => null)) as { provider?: unknown } | null;
    if (!body || !isProvider(body.provider)) {
      return NextResponse.json({ ok: false, error: "Unknown provider." }, { status: 400 });
    }

    let result: { ok: boolean; detail: string };
    if (body.provider === "whatsapp") result = await probeWhatsApp();
    else if (body.provider === "smtp") result = await probeSmtp();
    else result = await probeS3();

    await recordVerification(body.provider, result.ok, result.ok ? null : result.detail);

    return NextResponse.json(result.ok ? { ok: true, detail: result.detail } : { ok: false, error: result.detail });
  } catch (error) {
    console.error("Failed to test integration", error);
    const message = error instanceof Error ? error.message : "Failed to test integration.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
