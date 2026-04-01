import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ── GET /api/admin/expenses ───────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search   = searchParams.get("search")    ?? "";
  const category = searchParams.get("category")  ?? "";
  const type     = searchParams.get("type")      ?? "";
  const dateFrom = searchParams.get("date_from") ?? "";
  const dateTo   = searchParams.get("date_to")   ?? "";
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit    = 20;
  const offset   = (page - 1) * limit;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (search) {
    conditions.push("(e.title LIKE ? OR e.description LIKE ?)");
    values.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    conditions.push("e.category = ?");
    values.push(category);
  }
  if (type) {
    conditions.push("e.type = ?");
    values.push(type);
  }
  if (dateFrom) {
    conditions.push("e.expense_date >= ?");
    values.push(dateFrom);
  }
  if (dateTo) {
    conditions.push("e.expense_date <= ?");
    values.push(dateTo);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  // Stats + total count in one aggregation query over the full filtered set
  const [statsRows, records] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT
         COALESCE(SUM(CASE WHEN e.type = 'income'  THEN e.amount ELSE 0 END), 0) AS total_income,
         COALESCE(SUM(CASE WHEN e.type = 'expense' THEN e.amount ELSE 0 END), 0) AS total_expense,
         COALESCE(SUM(CASE WHEN e.category = 'biznexa'    AND e.type = 'expense' THEN e.amount ELSE 0 END), 0) AS biznexa_expense,
         COALESCE(SUM(CASE WHEN e.category = 'inspection' AND e.type = 'expense' THEN e.amount ELSE 0 END), 0) AS inspection_expense,
         COALESCE(SUM(CASE WHEN e.category = 'general'    AND e.type = 'income'  THEN e.amount ELSE 0 END), 0) AS general_income,
         COALESCE(SUM(CASE WHEN e.category = 'general'    AND e.type = 'expense' THEN e.amount ELSE 0 END), 0) AS general_expense,
         COUNT(*) AS total
       FROM expenses e
       ${where}`,
      values
    ),
    query<RowDataPacket[]>(
      `SELECT e.id, e.category, e.type, e.title, e.description,
              e.amount, e.expense_date, e.created_at
       FROM expenses e
       ${where}
       ORDER BY e.expense_date DESC, e.id DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    ),
  ]);

  const s = statsRows[0] ?? {};

  return NextResponse.json({
    stats: {
      total_income:       Number(s.total_income),
      total_expense:      Number(s.total_expense),
      biznexa_expense:    Number(s.biznexa_expense),
      inspection_expense: Number(s.inspection_expense),
      general_income:     Number(s.general_income),
      general_expense:    Number(s.general_expense),
    },
    records,
    total: Number(s.total),
    page,
    limit,
  });
}

// ── POST /api/admin/expenses ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { category, type, title, description, amount, expense_date } = body;

  if (!category || !type || !title || !amount || !expense_date) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) {
    return NextResponse.json({ error: "Amount must be a positive number." }, { status: 400 });
  }

  const result = await query<ResultSetHeader>(
    `INSERT INTO expenses (category, type, title, description, amount, expense_date, created_by)
     VALUES (?, ?, ?, ?, ?, ?, NULL)`,
    [category, type, title, description || null, parsed, expense_date]
  );

  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
