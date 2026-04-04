import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ── GET /api/admin/clients ──────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (search) {
    conditions.push("(c.name LIKE ? OR c.email LIKE ? OR c.company LIKE ? OR c.phone LIKE ?)");
    values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    conditions.push("c.status = ?");
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [statsRows, records] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total
       FROM clients c
       ${where}`,
      values,
    ),
    query<RowDataPacket[]>(
      `SELECT c.id, c.name, c.email, c.phone, c.company, c.address,
              c.gst_number, c.status, c.created_at,
              (SELECT COUNT(*) FROM bills WHERE client_id = c.id) AS bill_count,
              COALESCE((SELECT SUM(total_amount) FROM bills WHERE client_id = c.id AND payment_status = 'paid'), 0) AS total_paid
       FROM clients c
       ${where}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    ),
  ]);

  return NextResponse.json({
    records,
    total: Number(statsRows[0]?.total ?? 0),
    page,
    limit,
  });
}

// ── POST /api/admin/clients ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, company, gst_number, address, status } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Client name is required." }, { status: 400 });
  }

  const result = await query<ResultSetHeader>(
    `INSERT INTO clients (name, email, phone, company, gst_number, address, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
    [
      name.trim(),
      email?.trim() ?? '',
      phone?.trim() || null,
      company?.trim() || null,
      gst_number?.trim() || null,
      address?.trim() || null,
      status || "active",
    ],
  );

  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
