import "server-only";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const [banks, sources, paymentModes, accounts, existingCols] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT id, bank_name AS name FROM inspection_banks
       WHERE status = 'active' OR status IS NULL OR status = ''
       ORDER BY bank_name ASC`
    ),
    query<RowDataPacket[]>(
      `SELECT id, source_name AS name FROM inspection_sources
       WHERE status = 'active' OR status IS NULL OR status = ''
       ORDER BY source_name ASC`
    ),
    query<RowDataPacket[]>(
      `SELECT id, mode_name AS name FROM inspection_payment_modes
       WHERE status = 'active' OR status IS NULL OR status = ''
       ORDER BY mode_name ASC`
    ),
    query<RowDataPacket[]>(
      `SELECT id, account_name AS name FROM inspection_my_accounts
       WHERE status = 'active' OR status IS NULL OR status = ''
       ORDER BY account_name ASC`
    ),
    query<RowDataPacket[]>(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'inspection_files'
         AND COLUMN_NAME IN ('report_status_date','payment_status_date','paid_to_office_date','commission_pending')`
    ),
  ]);

  const cols = new Set(existingCols.map((r) => r.COLUMN_NAME as string));

  return NextResponse.json({
    banks,
    sources,
    paymentModes,
    accounts,
    columns: {
      report_status_date: cols.has("report_status_date"),
      payment_status_date: cols.has("payment_status_date"),
      paid_to_office_date: cols.has("paid_to_office_date"),
      commission_pending: cols.has("commission_pending"),
    },
  });
}
