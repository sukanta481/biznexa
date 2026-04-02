import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Ctx) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  const body = await request.json();
  const { amount, method, bank_id, upi_id, payment_date, reference, notes } = body;

  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) {
    return NextResponse.json({ error: "Amount must be a positive number." }, { status: 400 });
  }
  if (!method || !payment_date) {
    return NextResponse.json({ error: "Payment method and date are required." }, { status: 400 });
  }

  const rows = await query<RowDataPacket[]>(
    `SELECT total_amount, paid_amount FROM bills WHERE id = ?`, [id]
  );
  if (!rows.length) return NextResponse.json({ error: "Bill not found." }, { status: 404 });

  const total     = Number(rows[0].total_amount);
  const existing  = Number(rows[0].paid_amount);
  const newPaid   = Math.min(existing + parsed, total);

  let paymentStatus: string;
  let billStatus: string;

  if (newPaid >= total) {
    paymentStatus = "paid";
    billStatus    = "paid";
  } else if (newPaid > 0) {
    paymentStatus = "partial";
    billStatus    = "sent";
  } else {
    paymentStatus = "unpaid";
    billStatus    = "sent";
  }

  await query(
    `UPDATE bills SET
       paid_amount = ?, payment_status = ?, status = ?,
       payment_date = ?, payment_method = ?,
       payment_bank_id = ?, payment_upi_id = ?,
       payment_reference = ?, payment_notes = ?
     WHERE id = ?`,
    [
      newPaid.toFixed(2), paymentStatus, billStatus,
      payment_date, method,
      bank_id || null, upi_id || null,
      reference || null, notes || null,
      id,
    ]
  );

  return NextResponse.json({ success: true, paid_amount: newPaid, payment_status: paymentStatus });
}
