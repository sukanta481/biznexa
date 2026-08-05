import "server-only";

import { NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { listConversations } from "@/lib/wa-inbox";
import { isWithinWindow } from "@/lib/whatsapp";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const rows = await listConversations();

  return NextResponse.json({
    conversations: rows.map((c) => ({
      id: c.id,
      waId: c.wa_id,
      profileName: c.profile_name,
      aiEnabled: c.ai_enabled === 1,
      unreadCount: c.unread_count,
      lastMessageAt: c.last_message_at,
      windowOpen: isWithinWindow(c.last_inbound_at),
      preview: c.preview,
    })),
  });
}
