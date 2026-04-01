import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

async function getOptionalCols(): Promise<Set<string>> {
  const rows = await query<RowDataPacket[]>(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'inspection_files'
       AND COLUMN_NAME IN ('report_status_date','payment_status_date','paid_to_office_date','commission_pending')`
  );
  return new Set(rows.map((r) => r.COLUMN_NAME as string));
}

// ─── GET /api/admin/inspection/files/[id] ────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const rows = await query<RowDataPacket[]>(
    `SELECT f.*,
            b.bank_name,
            br.branch_name,
            s.source_name,
            pm.mode_name AS payment_mode_name,
            ma.account_name AS received_account_name
     FROM inspection_files f
     LEFT JOIN inspection_banks b ON b.id = f.bank_id
     LEFT JOIN inspection_branches br ON br.id = f.branch_id
     LEFT JOIN inspection_sources s ON s.id = f.source_id
     LEFT JOIN inspection_payment_modes pm ON pm.id = f.payment_mode_id
     LEFT JOIN inspection_my_accounts ma ON ma.id = f.received_account_id
     WHERE f.id = ?`,
    [numId]
  );

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

// ─── PATCH /api/admin/inspection/files/[id] ───────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const body = await request.json();
  const cols = await getOptionalCols();
  const fileType: "office" | "self" = body.file_type === "self" ? "self" : "office";

  if (body.bank_id && body.branch_id) {
    const check = await query<RowDataPacket[]>(
      `SELECT id FROM inspection_branches WHERE id = ? AND bank_id = ?`,
      [body.branch_id, body.bank_id]
    );
    if (check.length === 0) {
      return NextResponse.json({ error: "Selected branch does not belong to the selected bank." }, { status: 400 });
    }
  }

  let paymentModeName = "";
  if (body.payment_mode_id) {
    const pmRows = await query<RowDataPacket[]>(
      `SELECT mode_name FROM inspection_payment_modes WHERE id = ?`,
      [body.payment_mode_id]
    );
    paymentModeName = (pmRows[0]?.mode_name as string) ?? "";
  }

  const isGstMode = paymentModeName.toLowerCase().includes("gst");
  const commissionPendingRequired =
    cols.has("commission_pending") &&
    fileType === "self" &&
    isGstMode &&
    body.paid_to_office === "paid";

  if (commissionPendingRequired) {
    if (body.commission_pending !== "yes" && body.commission_pending !== "no") {
      return NextResponse.json({ error: "Commission Pending must be Yes or No." }, { status: 400 });
    }
  }

  const fees = fileType === "self" ? (parseFloat(body.fees) || 0) : 0;
  const extraAmount = parseFloat(body.extra_amount) || 0;

  let commission: number;
  let officeAmount: number | null;
  let amount: number | null;

  if (fileType === "self") {
    commission = Math.round(fees * 0.30 * 100) / 100;
    officeAmount = Math.round(fees * 0.70 * 100) / 100;
    const paymentStatus = body.payment_status ?? "due";
    if (paymentStatus === "paid") amount = fees;
    else if (paymentStatus === "partially") amount = parseFloat(body.amount) || null;
    else amount = null;
  } else {
    const loc = body.location ?? "";
    commission = loc === "kolkata" ? 300 : loc === "out_of_kolkata" ? 350 : 0;
    officeAmount = null;
    amount = null;
  }

  const grossAmount = Math.round((commission + extraAmount) * 100) / 100;

  const updates: Record<string, unknown> = {
    file_date: body.file_date || new Date().toISOString().split("T")[0],
    file_type: fileType,
    location: fileType === "office" ? (body.location || null) : null,
    customer_name: body.customer_name || null,
    customer_phone: body.customer_phone || null,
    property_address: body.property_address || null,
    property_value: body.property_value ? parseFloat(body.property_value) : null,
    bank_id: body.bank_id ? parseInt(body.bank_id) : null,
    branch_id: body.branch_id ? parseInt(body.branch_id) : null,
    source_id: body.source_id ? parseInt(body.source_id) : null,
    fees: fileType === "self" ? fees : null,
    report_status: fileType === "self" ? (body.report_status || null) : null,
    payment_mode_id: fileType === "self" ? (body.payment_mode_id ? parseInt(body.payment_mode_id) : null) : null,
    payment_status: fileType === "self" ? (body.payment_status || "due") : null,
    amount,
    paid_to_office: fileType === "self" ? (body.paid_to_office || null) : null,
    office_amount: officeAmount,
    commission,
    extra_amount: extraAmount,
    gross_amount: grossAmount,
    received_account_id: body.received_account_id ? parseInt(body.received_account_id) : null,
    notes: body.notes || null,
  };

  if (cols.has("report_status_date")) {
    updates.report_status_date = fileType === "self" ? (body.report_status_date || null) : null;
  }
  if (cols.has("payment_status_date")) {
    updates.payment_status_date = fileType === "self" ? (body.payment_status_date || null) : null;
  }
  if (cols.has("paid_to_office_date")) {
    updates.paid_to_office_date = fileType === "self" && body.paid_to_office === "paid"
      ? (body.paid_to_office_date || null) : null;
  }
  if (cols.has("commission_pending")) {
    updates.commission_pending = commissionPendingRequired ? body.commission_pending : null;
  }

  const setClauses = Object.keys(updates).map((k) => `${k} = ?`).join(", ");
  const values = [...Object.values(updates), numId];

  const result = await query<ResultSetHeader>(
    `UPDATE inspection_files SET ${setClauses} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await query<RowDataPacket[]>(
    `SELECT file_number FROM inspection_files WHERE id = ?`,
    [numId]
  );
  return NextResponse.json({ id: numId, file_number: updated[0]?.file_number ?? "" });
}

// ─── DELETE /api/admin/inspection/files/[id] ──────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const result = await query<ResultSetHeader>(
    `DELETE FROM inspection_files WHERE id = ?`,
    [numId]
  );

  if (result.affectedRows === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
