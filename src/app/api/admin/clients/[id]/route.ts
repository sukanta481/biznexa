import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ── GET /api/admin/clients/[id] ────────────────────────────────────────────────
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<RowDataPacket[]>(
    `SELECT * FROM clients WHERE id = ?`,
    [id],
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

// ── PATCH /api/admin/clients/[id] ──────────────────────────────────────────────
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { name, email, phone, company, gst_number, address, status } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Client name is required." }, { status: 400 });
  }

  await query<ResultSetHeader>(
    `UPDATE clients SET name = ?, email = ?, phone = ?, company = ?, gst_number = ?, address = ?, status = ?
     WHERE id = ?`,
    [
      name.trim(),
      email?.trim() ?? '',
      phone?.trim() || null,
      company?.trim() || null,
      gst_number?.trim() || null,
      address?.trim() || null,
      status || "active",
      id,
    ],
  );

  return NextResponse.json({ ok: true });
}

// ── DELETE /api/admin/clients/[id] ─────────────────────────────────────────────
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const billRows = await query<RowDataPacket[]>(
    `SELECT COUNT(*) AS bill_count FROM bills WHERE client_id = ?`,
    [id],
  );

  const billCount = Number(billRows[0]?.bill_count ?? 0);

  if (billCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete client with ${billCount} bill(s). Delete the bills first or set client as inactive.` },
      { status: 409 },
    );
  }

  await query<ResultSetHeader>(`DELETE FROM clients WHERE id = ?`, [id]);

  return NextResponse.json({ ok: true });
}
