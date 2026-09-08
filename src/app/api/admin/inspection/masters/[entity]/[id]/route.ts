import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { MASTER_ENTITIES, resolveMasterEntity } from "@/lib/inspection-masters";


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { entity: entityParam, id } = await params;
  const entity = resolveMasterEntity(entityParam);
  if (!entity) return NextResponse.json({ error: "Invalid entity" }, { status: 400 });

  const { table, nameField, extraFields } = MASTER_ENTITIES[entity];
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
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { entity: entityParam, id } = await params;
  const entity = resolveMasterEntity(entityParam);
  if (!entity) return NextResponse.json({ error: "Invalid entity" }, { status: 400 });

  const { table } = MASTER_ENTITIES[entity];
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
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { entity: entityParam, id } = await params;
  const entity = resolveMasterEntity(entityParam);
  if (!entity) return NextResponse.json({ error: "Invalid entity" }, { status: 400 });

  const { table } = MASTER_ENTITIES[entity];
  const rows = await query<RowDataPacket[]>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
