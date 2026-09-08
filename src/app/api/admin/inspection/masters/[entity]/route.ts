import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { MASTER_ENTITIES, resolveMasterEntity } from "@/lib/inspection-masters";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { entity: entityParam } = await params;
  const entity = resolveMasterEntity(entityParam);
  if (!entity) return NextResponse.json({ error: "Invalid entity" }, { status: 400 });

  const { table } = MASTER_ENTITIES[entity];
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get("perPage") ?? "20")));
  const all = url.searchParams.get("all") === "true";
  const offset = (page - 1) * perPage;

  // Special case: banks requested as dropdown list
  if (all) {
    const rows = await query<RowDataPacket[]>(
      `SELECT id, bank_name FROM inspection_banks WHERE status = 'active' ORDER BY bank_name ASC`
    );
    return NextResponse.json({ items: rows });
  }

  if (entity === "branches") {
    const searchClause = search
      ? `WHERE (ib2.branch_name LIKE ? OR bk.bank_name LIKE ?)`
      : "";
    const searchParams = search ? [`%${search}%`, `%${search}%`] : [];

    const [items, countRows] = await Promise.all([
      query<RowDataPacket[]>(
        `SELECT ib2.id, ib2.branch_name, ib2.bank_id, bk.bank_name, ib2.status, ib2.created_at
         FROM inspection_branches ib2
         LEFT JOIN inspection_banks bk ON ib2.bank_id = bk.id
         ${searchClause}
         ORDER BY ib2.id DESC
         LIMIT ? OFFSET ?`,
        [...searchParams, perPage, offset]
      ),
      query<RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM inspection_branches ib2
         LEFT JOIN inspection_banks bk ON ib2.bank_id = bk.id
         ${searchClause}`,
        searchParams
      ),
    ]);

    return NextResponse.json({ items, total: (countRows[0] as RowDataPacket).total });
  }

  const { nameField } = MASTER_ENTITIES[entity];
  const searchClause = search ? `WHERE ${nameField} LIKE ?` : "";
  const searchParams = search ? [`%${search}%`] : [];

  const [items, countRows] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT * FROM ${table} ${searchClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...searchParams, perPage, offset]
    ),
    query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM ${table} ${searchClause}`,
      searchParams
    ),
  ]);

  return NextResponse.json({ items, total: (countRows[0] as RowDataPacket).total });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { entity: entityParam } = await params;
  const entity = resolveMasterEntity(entityParam);
  if (!entity) return NextResponse.json({ error: "Invalid entity" }, { status: 400 });

  const { table, nameField, extraFields } = MASTER_ENTITIES[entity];
  const body = await request.json();

  const name = (body[nameField] ?? "").toString().trim();
  if (!name) return NextResponse.json({ error: `${nameField} is required` }, { status: 400 });

  const status = body.status === "inactive" ? "inactive" : "active";

  const columns = [nameField, ...extraFields, "status"];
  const values: unknown[] = [name];

  for (const field of extraFields) {
    const val = body[field] ?? null;
    values.push(val === "" ? null : val);
  }
  values.push(status);

  const placeholders = columns.map(() => "?").join(", ");
  const result = await query<ResultSetHeader>(
    `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`,
    values
  );

  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
