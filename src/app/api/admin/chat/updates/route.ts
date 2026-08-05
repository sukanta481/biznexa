import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(request.url);
  const sinceId = Math.max(0, Number.parseInt(searchParams.get("since") ?? "0", 10) || 0);

  const rows = await query<RowDataPacket[]>(
    `SELECT m.id, m.conversation_id, m.direction, m.type, m.text_body,
            m.media_path, m.media_mime, m.status, m.sent_by, m.created_at
       FROM wa_messages m
      WHERE m.id > ?
      ORDER BY m.id ASC
      LIMIT 200`,
    [sinceId],
  );

  const [{ maxId }] = await query<RowDataPacket[]>(
    `SELECT COALESCE(MAX(id), 0) AS maxId FROM wa_messages`,
  ) as unknown as Array<{ maxId: number }>;

  return NextResponse.json({ messages: rows, cursor: maxId });
}
