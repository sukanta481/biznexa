import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getInspectionFileFilters, getInspectionFilesPage } from "@/lib/inspection-files";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";

// ─── GET /api/admin/inspection/files ─────────────────────────────────────────
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10));
  const offset = (page - 1) * limit;
  const { files, total } = await getInspectionFilesPage(
    getInspectionFileFilters(searchParams),
    limit,
    offset
  );

  return NextResponse.json({
    files,
    total,
    page,
    limit,
  });
}

// ─── Column existence cache (per process lifetime) ────────────────────────────
let colCache: Set<string> | null = null;
async function getOptionalCols(): Promise<Set<string>> {
  if (colCache) return colCache;
  const rows = await query<RowDataPacket[]>(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'inspection_files'
       AND COLUMN_NAME IN ('report_status_date','payment_status_date','paid_to_office_date','commission_pending','payment_done_date')`
  );
  colCache = new Set(rows.map((r) => r.COLUMN_NAME as string));
  return colCache;
}

// ─── File number generator ────────────────────────────────────────────────────
async function generateFileNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `INS-${year}-`;

  for (let attempt = 0; attempt < 5; attempt++) {
    const rows = await query<RowDataPacket[]>(
      `SELECT MAX(CAST(SUBSTRING_INDEX(file_number, '-', -1) AS UNSIGNED)) AS max_seq
       FROM inspection_files
       WHERE file_number LIKE ?`,
      [`${prefix}%`]
    );
    const maxSeq = (rows[0]?.max_seq as number | null) ?? 0;
    const nextSeq = maxSeq + 1 + attempt; // increment on retry
    const candidate = `${prefix}${String(nextSeq).padStart(4, "0")}`;

    // Check uniqueness
    const existing = await query<RowDataPacket[]>(
      `SELECT id FROM inspection_files WHERE file_number = ?`,
      [candidate]
    );
    if (existing.length === 0) return candidate;
  }
  throw new Error("Could not generate a unique file number after 5 attempts.");
}

// ─── POST /api/admin/inspection/files ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const body = await request.json();
  const cols = await getOptionalCols();

  const fileType: "office" | "self" = body.file_type === "self" ? "self" : "office";

  // ── Validate branch belongs to bank ────────────────────────────────────────
  if (body.bank_id && body.branch_id) {
    const check = await query<RowDataPacket[]>(
      `SELECT id FROM inspection_branches WHERE id = ? AND bank_id = ?`,
      [body.branch_id, body.bank_id]
    );
    if (check.length === 0) {
      return NextResponse.json({ error: "Selected branch does not belong to the selected bank." }, { status: 400 });
    }
  }

  // ── Resolve payment mode name for GST check ────────────────────────────────
  let paymentModeName = "";
  if (body.payment_mode_id) {
    const pmRows = await query<RowDataPacket[]>(
      `SELECT mode_name FROM inspection_payment_modes WHERE id = ?`,
      [body.payment_mode_id]
    );
    paymentModeName = (pmRows[0]?.mode_name as string) ?? "";
  }

  const isGstMode = paymentModeName.toLowerCase().includes("gst");
  const commissionPendingRequired =
    cols.has("commission_pending") &&
    fileType === "self" &&
    isGstMode &&
    body.paid_to_office === "paid";

  if (commissionPendingRequired) {
    if (body.commission_pending !== "yes" && body.commission_pending !== "no") {
      return NextResponse.json({ error: "Commission Pending must be Yes or No." }, { status: 400 });
    }
  }

  // ── Server-side calculations ───────────────────────────────────────────────
  const fees = fileType === "self" ? (parseFloat(body.fees) || 0) : 0;
  const extraAmount = parseFloat(body.extra_amount) || 0;

  // Add-on reports apply to self files only; office files earn a flat
  // commission, so extra deliverables do not change the split there.
  const addonReports: Array<{ report_type_id: number | null; report_name: string; fees: number }> =
    fileType === "self" && Array.isArray(body.addon_reports)
      ? (body.addon_reports as unknown[])
          .map((raw) => {
            const r = raw as Record<string, unknown>;
            const name = typeof r.report_name === "string" ? r.report_name.trim() : "";
            const amountValue = Math.round((parseFloat(String(r.fees)) || 0) * 100) / 100;
            const typeId = r.report_type_id ? parseInt(String(r.report_type_id), 10) : null;
            return { report_type_id: Number.isNaN(typeId as number) ? null : typeId, report_name: name, fees: amountValue };
          })
          .filter((r) => r.report_name.length > 0)
      : [];

  const addonFees = Math.round(addonReports.reduce((sum, r) => sum + r.fees, 0) * 100) / 100;

  // The office share is taken from everything the customer is billed, base fee
  // and add-on reports together.
  const totalFees = Math.round((fees + addonFees) * 100) / 100;

  let commission: number;
  let officeAmount: number | null;
  let amount: number | null;

  if (fileType === "self") {
    commission = Math.round(totalFees * 0.30 * 100) / 100;
    officeAmount = Math.round(totalFees * 0.70 * 100) / 100;

    const paymentStatus = body.payment_status ?? "due";
    if (paymentStatus === "paid") {
      amount = totalFees;
    } else if (paymentStatus === "partially") {
      amount = parseFloat(body.amount) || null;
    } else {
      amount = null;
    }
  } else {
    const loc = body.location ?? "";
    commission = loc === "kolkata" ? 300 : loc === "out_of_kolkata" ? 350 : 0;
    officeAmount = null;
    amount = null;
  }

  const grossAmount = Math.round((commission + extraAmount) * 100) / 100;

  // ── Generate file number ───────────────────────────────────────────────────
  const fileNumber = await generateFileNumber();

  // ── Build INSERT ───────────────────────────────────────────────────────────
  const columns: string[] = [
    "file_number", "file_date", "file_type",
    "location", "customer_name", "customer_phone",
    "property_address", "property_value",
    "bank_id", "branch_id", "source_id",
    "fees", "addon_fees", "report_status",
    "payment_mode_id", "payment_status", "amount",
    "paid_to_office", "office_amount", "commission",
    "extra_amount", "gross_amount", "received_account_id", "notes",
  ];

  const values: unknown[] = [
    fileNumber,
    body.file_date || new Date().toISOString().split("T")[0],
    fileType,
    fileType === "office" ? (body.location || null) : null,
    body.customer_name || null,
    body.customer_phone || null,
    body.property_address || null,
    body.property_value ? parseFloat(body.property_value) : null,
    body.bank_id ? parseInt(body.bank_id) : null,
    body.branch_id ? parseInt(body.branch_id) : null,
    body.source_id ? parseInt(body.source_id) : null,
    fileType === "self" ? fees : null,
    addonFees,
    fileType === "self" ? (body.report_status || null) : null,
    fileType === "self" ? (body.payment_mode_id ? parseInt(body.payment_mode_id) : null) : null,
    fileType === "self" ? (body.payment_status || "due") : null,
    amount,
    fileType === "self" ? (body.paid_to_office || null) : null,
    officeAmount,
    commission,
    extraAmount,
    grossAmount,
    body.received_account_id ? parseInt(body.received_account_id) : null,
    body.notes || null,
  ];

  // Append optional columns if they exist
  if (cols.has("report_status_date")) {
    columns.push("report_status_date");
    values.push(fileType === "self" ? (body.report_status_date || null) : null);
  }
  if (cols.has("payment_status_date")) {
    columns.push("payment_status_date");
    values.push(fileType === "self" ? (body.payment_status_date || null) : null);
  }
  if (cols.has("paid_to_office_date")) {
    columns.push("paid_to_office_date");
    values.push(fileType === "self" && body.paid_to_office === "paid" ? (body.paid_to_office_date || null) : null);
  }
  if (cols.has("commission_pending")) {
    columns.push("commission_pending");
    values.push(commissionPendingRequired ? body.commission_pending : null);
  }
  if (cols.has("payment_done_date")) {
    columns.push("payment_done_date");
    values.push(fileType === "office" ? (body.payment_done_date || null) : null);
  }

  const placeholders = columns.map(() => "?").join(", ");
  const result = await query<ResultSetHeader>(
    `INSERT INTO inspection_files (${columns.join(", ")}) VALUES (${placeholders})`,
    values
  );

  if (addonReports.length > 0) {
    for (const report of addonReports) {
      await query<ResultSetHeader>(
        `INSERT INTO inspection_file_reports (file_id, report_type_id, report_name, fees)
         VALUES (?, ?, ?, ?)`,
        [result.insertId, report.report_type_id, report.report_name, report.fees],
      );
    }
  }

  return NextResponse.json({ id: result.insertId, file_number: fileNumber }, { status: 201 });
}
