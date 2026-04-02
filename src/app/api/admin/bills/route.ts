import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ── GET /api/admin/bills ──────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search        = searchParams.get("search")         ?? "";
  const client_id     = searchParams.get("client_id")      ?? "";
  const status        = searchParams.get("status")         ?? "";
  const payment_status = searchParams.get("payment_status") ?? "";
  const date_from     = searchParams.get("date_from")      ?? "";
  const date_to       = searchParams.get("date_to")        ?? "";
  const amount_min    = searchParams.get("amount_min")     ?? "";
  const amount_max    = searchParams.get("amount_max")     ?? "";
  const page          = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit         = 20;
  const offset        = (page - 1) * limit;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (search) {
    conditions.push("(b.bill_number LIKE ? OR c.name LIKE ? OR c.email LIKE ?)");
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (client_id) { conditions.push("b.client_id = ?"); values.push(client_id); }
  if (status)    { conditions.push("b.status = ?");    values.push(status); }
  if (payment_status) { conditions.push("b.payment_status = ?"); values.push(payment_status); }
  if (date_from) { conditions.push("b.bill_date >= ?"); values.push(date_from); }
  if (date_to)   { conditions.push("b.bill_date <= ?"); values.push(date_to); }
  if (amount_min) { conditions.push("b.total_amount >= ?"); values.push(amount_min); }
  if (amount_max) { conditions.push("b.total_amount <= ?"); values.push(amount_max); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [statsRows, records] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT
         COUNT(*)                              AS total_bills,
         COALESCE(SUM(b.total_amount), 0)      AS total_amount,
         COALESCE(SUM(b.paid_amount), 0)       AS paid_amount,
         COUNT(*)                              AS total
       FROM bills b
       LEFT JOIN clients c ON c.id = b.client_id
       ${where}`,
      values
    ),
    query<RowDataPacket[]>(
      `SELECT b.id, b.bill_number, b.client_id, b.bill_date, b.due_date,
              b.subtotal, b.tax_percent, b.tax_amount, b.discount_amount, b.total_amount,
              b.status, b.payment_status, b.paid_amount, b.payment_date,
              b.bank_payment_method_id, b.upi_payment_method_id,
              b.notes, b.terms, b.created_at,
              c.name AS client_name, c.email AS client_email, c.phone AS client_phone,
              c.company AS client_company, c.gst_number AS client_gst
       FROM bills b
       LEFT JOIN clients c ON c.id = b.client_id
       ${where}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    ),
  ]);

  const s = statsRows[0] ?? {};
  const totalAmt  = Number(s.total_amount ?? 0);
  const paidAmt   = Number(s.paid_amount ?? 0);

  return NextResponse.json({
    stats: {
      total_bills:   Number(s.total_bills ?? 0),
      total_amount:  totalAmt,
      paid_amount:   paidAmt,
      unpaid_amount: totalAmt - paidAmt,
    },
    records,
    total: Number(s.total ?? 0),
    page,
    limit,
  });
}

// ── POST /api/admin/bills ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    client_id, bill_date, due_date, status,
    items, tax_enabled, tax_percent, discount_amount,
    notes, terms, bank_payment_method_id, upi_payment_method_id,
  } = body;

  if (!client_id || !bill_date || !items?.length) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // ── Generate bill number ──────────────────────────────────────────────────
  const prefixRows = await query<RowDataPacket[]>(
    `SELECT setting_value FROM settings WHERE setting_key = 'bill_prefix'`
  );
  const prefix = (prefixRows[0]?.setting_value as string) ?? "INV";
  const year   = new Date().getFullYear();
  const pattern = `${prefix}-${year}-%`;

  const lastRows = await query<RowDataPacket[]>(
    `SELECT bill_number FROM bills WHERE bill_number LIKE ? ORDER BY bill_number DESC LIMIT 1`,
    [pattern]
  );
  let seq = 1;
  if (lastRows.length) {
    const parts = (lastRows[0].bill_number as string).split("-");
    const last  = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(last)) seq = last + 1;
  }
  const bill_number = `${prefix}-${year}-${String(seq).padStart(4, "0")}`;

  // ── Compute totals ────────────────────────────────────────────────────────
  const lineItems = (items as { description: string; quantity: number; unit_price: number }[]);
  const subtotal = lineItems.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0), 0);
  const taxPct   = tax_enabled ? (Number(tax_percent) || 0) : 0;
  const taxAmt   = (subtotal * taxPct) / 100;
  const discAmt  = Number(discount_amount) || 0;
  const total    = subtotal + taxAmt - discAmt;

  const result = await query<ResultSetHeader>(
    `INSERT INTO bills (bill_number, client_id, bill_date, due_date, subtotal, tax_percent, tax_amount,
       discount_amount, total_amount, notes, terms, status, payment_status, paid_amount,
       bank_payment_method_id, upi_payment_method_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', 0, ?, ?, NULL)`,
    [
      bill_number, client_id, bill_date, due_date || null,
      subtotal.toFixed(2), taxPct, taxAmt.toFixed(2), discAmt.toFixed(2), total.toFixed(2),
      notes || null, terms || null, status || "draft",
      bank_payment_method_id || null, upi_payment_method_id || null,
    ]
  );

  const billId = result.insertId;

  if (lineItems.length) {
    const itemValues = lineItems.map((item, idx) => [
      billId,
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

  return NextResponse.json({ id: billId, bill_number }, { status: 201 });
}
