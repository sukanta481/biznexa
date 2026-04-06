import "server-only";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const banks = await query<RowDataPacket[]>(
    `SELECT id, bank_name FROM inspection_banks WHERE status = 'active' ORDER BY bank_name ASC`,
  );
  const branches = await query<RowDataPacket[]>(
    `SELECT id, branch_name, bank_id FROM inspection_branches WHERE status = 'active' ORDER BY branch_name ASC`,
  );
  const sources = await query<RowDataPacket[]>(
    `SELECT id, source_name FROM inspection_sources WHERE status = 'active' ORDER BY source_name ASC`,
  );

  return NextResponse.json({
    banks,
    branches,
    sources,
  });
}
