import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { getConversation, listMessages, markRead, recordMessage, setAiEnabled } from "@/lib/wa-inbox";
import { isWithinWindow, sendTextMessage } from "@/lib/whatsapp";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const conversationId = Number.parseInt(id, 10);
  if (Number.isNaN(conversationId)) {
    return NextResponse.json({ error: "Invalid conversation id." }, { status: 400 });
  }

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const messages = await listMessages(conversationId);
  await markRead(conversationId);

  return NextResponse.json({
    conversation: {
      id: conversation.id,
      waId: conversation.wa_id,
      profileName: conversation.profile_name,
      aiEnabled: conversation.ai_enabled === 1,
      windowOpen: isWithinWindow(conversation.last_inbound_at),
      lastInboundAt: conversation.last_inbound_at,
    },
    messages,
  });
}

export async function POST(request: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const conversationId = Number.parseInt(id, 10);
  if (Number.isNaN(conversationId)) {
    return NextResponse.json({ error: "Invalid conversation id." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Message text is required." }, { status: 400 });
  }

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  if (!isWithinWindow(conversation.last_inbound_at)) {
    return NextResponse.json(
      {
        error:
          "The 24-hour reply window has closed. WhatsApp only allows an approved template message now.",
      },
      { status: 409 },
    );
  }

  const result = await sendTextMessage(conversation.wa_id, text);

  await recordMessage({
    conversationId,
    waMessageId: result.waMessageId ?? null,
    direction: "out",
    textBody: text,
    status: result.ok ? "sent" : "failed",
    errorText: result.ok ? null : result.error ?? "Unknown error",
    sentBy: admin.id,
  });

  // A human has replied, so the AI stands down on this conversation.
  if (result.ok) {
    await setAiEnabled(conversationId, false);
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Failed to send." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, waMessageId: result.waMessageId });
}
