import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { getConversation, markRead, setAiEnabled } from "@/lib/wa-inbox";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Ctx) {
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

  const body = await request.json().catch(() => ({}));

  if (typeof body.aiEnabled === "boolean") {
    await setAiEnabled(conversationId, body.aiEnabled);
  }

  if (body.markRead === true) {
    await markRead(conversationId);
  }

  const updated = await getConversation(conversationId);

  return NextResponse.json({
    ok: true,
    aiEnabled: updated ? updated.ai_enabled === 1 : true,
  });
}
