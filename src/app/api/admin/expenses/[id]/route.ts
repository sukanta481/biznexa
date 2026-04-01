import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ResultSetHeader } from "mysql2/promise";

// ── PATCH /api/admin/expenses/[id] ───────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

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
    `UPDATE expenses
     SET category = ?, type = ?, title = ?, description = ?, amount = ?, expense_date = ?
     WHERE id = ?`,
    [category, type, title, description || null, parsed, expense_date, id]
  );

  if (result.affectedRows === 0) {
    return NextResponse.json({ error: "Record not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// ── DELETE /api/admin/expenses/[id] ──────────────────────────────────────────
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  await query<ResultSetHeader>(`DELETE FROM expenses WHERE id = ?`, [id]);

  return NextResponse.json({ success: true });
}
