import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

type EntityKey = "banks" | "branches" | "sources" | "payment-modes" | "accounts";

const ENTITY_MAP: Record<EntityKey, { table: string; nameField: string; extraFields: string[] }> = {
  banks: { table: "inspection_banks", nameField: "bank_name", extraFields: [] },
  branches: { table: "inspection_branches", nameField: "branch_name", extraFields: ["bank_id"] },
  sources: { table: "inspection_sources", nameField: "source_name", extraFields: ["phone"] },
  "payment-modes": { table: "inspection_payment_modes", nameField: "mode_name", extraFields: [] },
  accounts: { table: "inspection_my_accounts", nameField: "account_name", extraFields: ["bank_name", "account_number", "ifsc_code"] },
};

function resolveEntity(param: string): EntityKey | null {
  if (param in ENTITY_MAP) return param as EntityKey;
  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity: entityParam, id } = await params;
  const entity = resolveEntity(entityParam);
  if (!entity) return NextResponse.json({ error: "Invalid entity" }, { status: 400 });

  const { table, nameField, extraFields } = ENTITY_MAP[entity];
  const body = await request.json();

  const setClauses: string[] = [];
  const values: unknown[] = [];

  if (body[nameField] !== undefined) {
    const name = body[nameField].toString().trim();
    if (!name) return NextResponse.json({ error: `${nameField} is required` }, { status: 400 });
    setClauses.push(`${nameField} = ?`);
    values.push(name);
  }

  for (const field of extraFields) {
    if (body[field] !== undefined) {
      setClauses.push(`${field} = ?`);
      values.push(body[field] === "" ? null : body[field]);
    }
  }

  if (body.status !== undefined) {
    const status = body.status === "inactive" ? "inactive" : "active";
    setClauses.push(`status = ?`);
    values.push(status);
  }

  if (setClauses.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  values.push(id);
  const result = await query<ResultSetHeader>(
    `UPDATE ${table} SET ${setClauses.join(", ")} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity: entityParam, id } = await params;
  const entity = resolveEntity(entityParam);
  if (!entity) return NextResponse.json({ error: "Invalid entity" }, { status: 400 });

  const { table } = ENTITY_MAP[entity];
  const result = await query<ResultSetHeader>(
    `DELETE FROM ${table} WHERE id = ?`,
    [id]
  );

  if (result.affectedRows === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity: entityParam, id } = await params;
  const entity = resolveEntity(entityParam);
  if (!entity) return NextResponse.json({ error: "Invalid entity" }, { status: 400 });

  const { table } = ENTITY_MAP[entity];
  const rows = await query<RowDataPacket[]>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
