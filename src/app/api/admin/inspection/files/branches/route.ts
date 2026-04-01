import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function GET(request: NextRequest) {
  const bankId = new URL(request.url).searchParams.get("bank_id");
  if (!bankId || isNaN(Number(bankId))) {
    return NextResponse.json({ branches: [] });
  }

  const branches = await query<RowDataPacket[]>(
    `SELECT id, branch_name, bank_id FROM inspection_branches
     WHERE bank_id = ?
       AND (status = 'active' OR status IS NULL OR status = '')
     ORDER BY branch_name ASC`,
    [bankId]
  );

  return NextResponse.json({ branches });
}
