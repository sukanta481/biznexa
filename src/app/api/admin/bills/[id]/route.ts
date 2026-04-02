import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

type Ctx = { params: Promise<{ id: string }> };

// ── GET /api/admin/bills/[id] ─────────────────────────────────────────────────
export async function GET(_: NextRequest, { params }: Ctx) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  const [bills, items] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT b.*, c.name AS client_name, c.email AS client_email,
              c.phone AS client_phone, c.company AS client_company, c.gst_number AS client_gst
       FROM bills b LEFT JOIN clients c ON c.id = b.client_id WHERE b.id = ?`,
      [id]
    ),
    query<RowDataPacket[]>(
      `SELECT id, description, quantity, unit_price, total_price, display_order
       FROM bill_items WHERE bill_id = ? ORDER BY display_order ASC`,
      [id]
    ),
  ]);

  if (!bills.length) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({ ...bills[0], items });
}

// ── PATCH /api/admin/bills/[id] ───────────────────────────────────────────────
export async function PATCH(request: NextRequest, { params }: Ctx) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  const body = await request.json();
  const {
    client_id, bill_date, due_date, status, payment_status,
    paid_amount, payment_date, payment_method, payment_bank_id,
    payment_upi_id, payment_reference, payment_notes,
    items, tax_enabled, tax_percent, discount_amount,
    notes, terms, bank_payment_method_id, upi_payment_method_id,
  } = body;

  if (!client_id || !bill_date || !items?.length) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const lineItems = (items as { description: string; quantity: number; unit_price: number }[]);
  const subtotal = lineItems.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0), 0);
  const taxPct   = tax_enabled ? (Number(tax_percent) || 0) : 0;
  const taxAmt   = (subtotal * taxPct) / 100;
  const discAmt  = Number(discount_amount) || 0;
  const total    = subtotal + taxAmt - discAmt;

  await query(
    `UPDATE bills SET
       client_id = ?, bill_date = ?, due_date = ?,
       subtotal = ?, tax_percent = ?, tax_amount = ?, discount_amount = ?, total_amount = ?,
       notes = ?, terms = ?, status = ?, payment_status = ?, paid_amount = ?,
       payment_date = ?, payment_method = ?, payment_bank_id = ?, payment_upi_id = ?,
       payment_reference = ?, payment_notes = ?,
       bank_payment_method_id = ?, upi_payment_method_id = ?
     WHERE id = ?`,
    [
      client_id, bill_date, due_date || null,
      subtotal.toFixed(2), taxPct, taxAmt.toFixed(2), discAmt.toFixed(2), total.toFixed(2),
      notes || null, terms || null, status || "draft",
      payment_status || "unpaid", Number(paid_amount) || 0,
      payment_date || null, payment_method || null,
      payment_bank_id || null, payment_upi_id || null,
      payment_reference || null, payment_notes || null,
      bank_payment_method_id || null, upi_payment_method_id || null,
      id,
    ]
  );

  await query(`DELETE FROM bill_items WHERE bill_id = ?`, [id]);

  if (lineItems.length) {
    const itemValues = lineItems.map((item, idx) => [
      id,
      item.description,
      Number(item.quantity) || 1,
      Number(item.unit_price) || 0,
      ((Number(item.quantity) || 1) * (Number(item.unit_price) || 0)).toFixed(2),
      idx,
    ]);
    await query(
      `INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price, display_order) VALUES ?`,
      [itemValues]
    );
  }

  return NextResponse.json({ success: true });
}

// ── DELETE /api/admin/bills/[id] ──────────────────────────────────────────────
export async function DELETE(_: NextRequest, { params }: Ctx) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  await query(`DELETE FROM bill_items WHERE bill_id = ?`, [id]);
  await query<ResultSetHeader>(`DELETE FROM bills WHERE id = ?`, [id]);

  return NextResponse.json({ success: true });
}
