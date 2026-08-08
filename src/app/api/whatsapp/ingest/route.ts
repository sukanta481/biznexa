import "server-only";

import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { recordMessage, upsertConversation, getConversation } from "@/lib/wa-inbox";
import { isS3Configured, putObject } from "@/lib/storage";
import { downloadMedia } from "@/lib/whatsapp";
import { getIntegrationConfig } from "@/lib/integrations";

export const runtime = "nodejs";

function secretMatches(provided: string | null, expected: string | null): boolean {
  if (!expected || !provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

interface IngestBody {
  waId?: string;
  profileName?: string | null;
  waMessageId?: string | null;
  direction?: "in" | "out";
  type?: string;
  text?: string | null;
  mediaId?: string | null;
  mimeType?: string | null;
}

function extForMime(mime: string | null | undefined): string {
  if (!mime) return "";
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
    "audio/aac": ".aac",
    "audio/mp4": ".m4a",
    "audio/mpeg": ".mp3",
    "audio/ogg": ".ogg",
    "video/mp4": ".mp4",
    "video/3gpp": ".3gp",
    "application/pdf": ".pdf",
    "text/plain": ".txt",
  };
  return map[mime] ?? "";
}

export async function POST(request: NextRequest) {
  const { ingestSecret } = await getIntegrationConfig("whatsapp");
  if (!secretMatches(request.headers.get("x-ingest-secret"), ingestSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: IngestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const waId = body.waId?.trim();
  if (!waId) {
    return NextResponse.json({ error: "waId is required." }, { status: 400 });
  }

  const conversationId = await upsertConversation(waId, body.profileName?.trim() || null);

  // A body with no text and no message id is a state probe — n8n asking whether
  // the AI should answer, without anything new to store.
  if (body.waMessageId || body.text || body.mediaId) {
    let mediaPath: string | null = null;
    let mediaMime: string | null = body.mimeType?.trim() || null;

    // WhatsApp media expires from Meta's servers after 30 days, so when S3 is
    // configured we download the bytes and persist them durably now.
    if (body.mediaId && isS3Configured()) {
      const dl = await downloadMedia(body.mediaId);
      if (dl.ok && dl.buffer) {
        const ext = extForMime(dl.mimeType ?? mediaMime);
        const stem = body.waMessageId ?? `nomsgid.${Date.now()}`;
        const safeStem = stem.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `wa/${waId}/${safeStem}${ext}`;
        const stored = await putObject(key, dl.buffer, dl.mimeType ?? mediaMime ?? "application/octet-stream");
        if (stored.ok && stored.url) {
          mediaPath = stored.url;
          mediaMime = dl.mimeType ?? mediaMime;
        }
      }
    }

    await recordMessage({
      conversationId,
      waMessageId: body.waMessageId ?? null,
      direction: body.direction === "out" ? "out" : "in",
      type: body.type ?? (body.mediaId ? "media" : "text"),
      textBody: body.text ?? null,
      mediaPath,
      mediaMime,
    });
  }

  const conversation = await getConversation(conversationId);

  return NextResponse.json({
    ok: true,
    conversationId,
    ai_enabled: conversation ? conversation.ai_enabled === 1 : true,
  });
}
