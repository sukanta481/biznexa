import "server-only";

import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { recordMessage, upsertConversation, getConversation } from "@/lib/wa-inbox";

export const runtime = "nodejs";

function secretMatches(provided: string | null): boolean {
  const expected = process.env.WHATSAPP_INGEST_SECRET;
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
}

export async function POST(request: NextRequest) {
  if (!secretMatches(request.headers.get("x-ingest-secret"))) {
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
  if (body.waMessageId || body.text) {
    await recordMessage({
      conversationId,
      waMessageId: body.waMessageId ?? null,
      direction: body.direction === "out" ? "out" : "in",
      type: body.type ?? "text",
      textBody: body.text ?? null,
    });
  }

  const conversation = await getConversation(conversationId);

  return NextResponse.json({
    ok: true,
    conversationId,
    ai_enabled: conversation ? conversation.ai_enabled === 1 : true,
  });
}
