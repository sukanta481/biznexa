import { NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { isEncryptionConfigured, mask } from "@/lib/crypto-box";
import {
  getIntegrationConfig,
  getStoredConfig,
  getVerificationState,
  saveIntegrationConfig,
  SECRET_FIELDS,
  type Provider,
  type ProviderConfig,
} from "@/lib/integrations";

export const runtime = "nodejs";

const PROVIDERS: Provider[] = ["whatsapp", "smtp", "s3"];

// Field names per provider. Must stay in sync with integrations.ts ENV_FALLBACK.
const PROVIDER_FIELDS: Record<Provider, readonly string[]> = {
  whatsapp: ["token", "phoneNumberId", "ingestSecret"],
  smtp: ["host", "port", "user", "pass", "secure", "fromEmail", "notificationEmail"],
  s3: ["bucket", "region", "accessKeyId", "secretAccessKey", "endpoint", "forcePathStyle", "publicBase"],
};

function isProvider(value: unknown): value is Provider {
  return typeof value === "string" && (PROVIDERS as string[]).includes(value);
}

type FieldMeta = { set: boolean; preview?: string; value?: string; source: "database" | "env" | "unset" };

interface ProviderView {
  provider: Provider;
  fields: Record<string, FieldMeta>;
  lastVerifiedAt: string | null;
  verifyError: string | null;
  updatedAt: string | null;
}

async function buildView(provider: Provider, resolved: ProviderConfig, stored: ProviderConfig): Promise<ProviderView> {
  const fields: Record<string, FieldMeta> = {};
  const secretFields = SECRET_FIELDS[provider];

  for (const field of PROVIDER_FIELDS[provider]) {
    const value = resolved[field] ?? "";
    const storedValue = stored[field] ?? "";
    const fromDb = storedValue.trim().length > 0;
    const fromEnv = value.trim().length > 0;
    const isSecret = secretFields.includes(field);

    let source: FieldMeta["source"];
    if (fromDb) source = "database";
    else if (fromEnv) source = "env";
    else source = "unset";

    const meta: FieldMeta = { set: fromDb || fromEnv, source };

    if (isSecret) {
      // Never return the actual value — only a masked preview.
      meta.preview = mask(value);
    } else {
      meta.value = value;
    }

    fields[field] = meta;
  }

  const verification = await getVerificationState(provider);

  return {
    provider,
    fields,
    lastVerifiedAt: verification?.last_verified_at ?? null,
    verifyError: verification?.verify_error ?? null,
    updatedAt: verification?.updated_at ?? null,
  };
}

async function loadAllViews() {
  const views: ProviderView[] = [];
  for (const provider of PROVIDERS) {
    const [resolved, stored] = await Promise.all([
      getIntegrationConfig(provider),
      getStoredConfig(provider),
    ]);
    views.push(await buildView(provider, resolved, stored));
  }
  return views;
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    const providers = await loadAllViews();
    return NextResponse.json({ ok: true, encryptionConfigured: isEncryptionConfigured(), providers });
  } catch (error) {
    console.error("Failed to load integrations", error);
    return NextResponse.json({ ok: false, error: "Failed to load integrations." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    if (!isEncryptionConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Encryption key is not configured. Set CREDENTIALS_KEY before saving credentials." },
        { status: 400 },
      );
    }

    const body = (await request.json().catch(() => null)) as { provider?: unknown; fields?: unknown } | null;
    if (!body || !isProvider(body.provider)) {
      return NextResponse.json({ ok: false, error: "Unknown provider." }, { status: 400 });
    }

    const provider = body.provider;
    const updates: ProviderConfig = {};
    if (body.fields && typeof body.fields === "object") {
      for (const field of Object.entries(body.fields as Record<string, unknown>)) {
        if (typeof field[1] !== "string") continue;
        if (!PROVIDER_FIELDS[provider].includes(field[0])) continue;
        updates[field[0]] = field[1];
      }
    }

    await saveIntegrationConfig(provider, updates, admin.id);

    // Never echo submitted secret values back — return the same masked shape as GET.
    const providers = await loadAllViews();
    return NextResponse.json({ ok: true, encryptionConfigured: true, providers });
  } catch (error) {
    console.error("Failed to save integrations", error);
    const message = error instanceof Error ? error.message : "Failed to save integrations.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
