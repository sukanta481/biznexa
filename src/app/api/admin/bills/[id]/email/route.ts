import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: NextRequest, { params }: Ctx) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  const rows = await query<RowDataPacket[]>(
    `SELECT b.bill_number, b.total_amount, b.due_date, c.name AS client_name, c.email AS client_email
     FROM bills b LEFT JOIN clients c ON c.id = b.client_id WHERE b.id = ?`,
    [id]
  );
  if (!rows.length) return NextResponse.json({ error: "Bill not found." }, { status: 404 });

  // Mark as sent
  await query(
    `UPDATE bills SET sent_via_email = 1, email_sent_at = NOW(), status = IF(status = 'draft', 'sent', status) WHERE id = ?`,
    [id]
  );

  // TODO: integrate with an email provider (Nodemailer / Resend / SendGrid)
  // For now this marks the bill as sent and returns success.
  return NextResponse.json({
    success: true,
    message: `Bill ${rows[0].bill_number as string} marked as sent to ${rows[0].client_email as string}.`,
  });
}
