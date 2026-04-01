import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

async function columnExists(table: string, column: string): Promise<boolean> {
  const rows = await query<RowDataPacket[]>(
    `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return Number(rows[0]?.cnt) > 0;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") ?? "";
  const year = searchParams.get("year") ?? "";
  const fileType = searchParams.get("file_type") ?? "";
  const dateBasis = searchParams.get("date_basis") ?? "file";
  const sort = searchParams.get("sort") ?? "newest";

  const hasUpdatedAt = await columnExists("inspection_files", "updated_at");
  const dateCol =
    dateBasis === "updated" && hasUpdatedAt
      ? "DATE(f.updated_at)"
      : "f.file_date";

  // Build filter conditions
  const conditions: string[] = [];
  const values: unknown[] = [];

  // Date filter — only active when BOTH month AND year are provided
  if (month && year) {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (!isNaN(m) && !isNaN(y) && m >= 1 && m <= 12) {
      const lastDay = new Date(y, m, 0).getDate();
      const first = `${y}-${String(m).padStart(2, "0")}-01`;
      const last = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      conditions.push(`${dateCol} BETWEEN ? AND ?`);
      values.push(first, last);
    }
  }

  if (fileType === "self" || fileType === "office") {
    conditions.push("f.file_type = ?");
    values.push(fileType);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // ── Stats ───────────────────────────────────────────────────────────────────
  const statsRows = await query<RowDataPacket[]>(
    `SELECT
       COALESCE(SUM(f.fees), 0)                                           AS total_fees,
       COALESCE(SUM(f.office_amount), 0)                                  AS office_earned,
       COALESCE(SUM(
         CASE WHEN f.file_type = 'self'
              AND f.payment_status IN ('due', 'partially')
         THEN (COALESCE(f.fees, 0) - COALESCE(f.amount, 0))
         ELSE 0 END
       ), 0)                                                               AS pending_amount,
       COUNT(*)                                                            AS total_files,
       COALESCE(SUM(f.gross_amount), 0)                                   AS total_earnings,
       COUNT(CASE WHEN f.file_type = 'self'
                   AND f.payment_status IN ('due', 'partially') THEN 1 END) AS pending_payments,
       COALESCE(SUM(
         CASE WHEN f.file_type = 'self' AND f.payment_status = 'paid'
         THEN COALESCE(f.amount, 0) ELSE 0 END
       ), 0)                                                               AS total_paid,
       COALESCE(SUM(
         CASE WHEN f.file_type = 'self'
              AND f.payment_status = 'paid'
              AND (f.paid_to_office IS NULL OR f.paid_to_office != 'paid')
         THEN COALESCE(f.office_amount, 0) ELSE 0 END
       ), 0)                                                               AS pending_office
     FROM inspection_files f
     ${where}`,
    values
  );

  // ── Monthly chart data (always for the selected/current year) ───────────────
  const chartYear = year ? parseInt(year, 10) : new Date().getFullYear();

  const chartConds: string[] = ["YEAR(f.file_date) = ?"];
  const chartVals: unknown[] = [chartYear];

  if (fileType === "self" || fileType === "office") {
    chartConds.push("f.file_type = ?");
    chartVals.push(fileType);
  }

  const chartRows = await query<RowDataPacket[]>(
    `SELECT
       MONTH(f.file_date)            AS month,
       COALESCE(SUM(f.gross_amount), 0)  AS income,
       COALESCE(SUM(f.office_amount), 0) AS expenditure
     FROM inspection_files f
     WHERE ${chartConds.join(" AND ")}
     GROUP BY MONTH(f.file_date)
     ORDER BY month ASC`,
    chartVals
  );

  const monthlyMap: Record<number, { income: number; expenditure: number }> = {};
  for (const r of chartRows) {
    monthlyMap[Number(r.month)] = {
      income: Number(r.income),
      expenditure: Number(r.expenditure),
    };
  }
  const chartData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: monthlyMap[i + 1]?.income ?? 0,
    expenditure: monthlyMap[i + 1]?.expenditure ?? 0,
  }));

  // ── Source-wise summary ──────────────────────────────────────────────────────
  const sourceRows = await query<RowDataPacket[]>(
    `SELECT
       COALESCE(s.source_name, 'Unknown') AS source_name,
       COUNT(*)                           AS file_count,
       COALESCE(SUM(f.gross_amount), 0)   AS total_earnings
     FROM inspection_files f
     LEFT JOIN inspection_sources s ON s.id = f.source_id
     ${where}
     GROUP BY f.source_id, s.source_name
     ORDER BY total_earnings DESC`,
    values
  );

  // ── Recent files (10) ────────────────────────────────────────────────────────
  const sortDir = sort === "oldest" ? "ASC" : "DESC";
  const recentRows = await query<RowDataPacket[]>(
    `SELECT
       f.file_number,
       f.file_date,
       f.customer_name,
       f.file_type,
       f.commission,
       f.payment_status,
       b.bank_name,
       s.source_name
     FROM inspection_files f
     LEFT JOIN inspection_banks    b ON b.id = f.bank_id
     LEFT JOIN inspection_sources  s ON s.id = f.source_id
     ${where}
     ORDER BY f.file_date ${sortDir}, f.id ${sortDir}
     LIMIT 10`,
    values
  );

  const s = statsRows[0] ?? {};

  return NextResponse.json({
    stats: {
      total_fees: Number(s.total_fees),
      office_earned: Number(s.office_earned),
      pending_amount: Number(s.pending_amount),
      total_files: Number(s.total_files),
      total_earnings: Number(s.total_earnings),
      pending_payments: Number(s.pending_payments),
      total_paid: Number(s.total_paid),
      pending_office: Number(s.pending_office),
    },
    chartData,
    chartYear,
    sources: sourceRows.map((r) => ({
      source_name: r.source_name as string,
      file_count: Number(r.file_count),
      total_earnings: Number(r.total_earnings),
    })),
    recentFiles: recentRows.map((r) => ({
      file_number: r.file_number as string,
      file_date: r.file_date as string,
      customer_name: r.customer_name as string | null,
      file_type: r.file_type as string,
      commission: Number(r.commission),
      payment_status: r.payment_status as string | null,
      bank_name: r.bank_name as string | null,
    })),
  });
}
