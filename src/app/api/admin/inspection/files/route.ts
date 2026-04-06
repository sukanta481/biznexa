import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ─── GET /api/admin/inspection/files ─────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const type = searchParams.get("type") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (search) {
    conditions.push("(f.file_number LIKE ? OR f.customer_name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status) {
    conditions.push("f.report_status = ?");
    params.push(status);
  }
  if (type) {
    conditions.push("f.file_type = ?");
    params.push(type);
  }
  if (dateFrom) {
    conditions.push("f.file_date >= ?");
    params.push(dateFrom);
  }
  if (dateTo) {
    conditions.push("f.file_date <= ?");
    params.push(dateTo);
  }

  const paymentStatus = searchParams.get("payment_status") ?? "";
  const paidToOffice = searchParams.get("paid_to_office") ?? "";

  if (paymentStatus === "pending_payment") {
    conditions.push("f.payment_status IN ('due', 'partially')");
  } else if (paymentStatus) {
    conditions.push("f.payment_status = ?");
    params.push(paymentStatus);
  }

  if (paidToOffice === "due") {
    conditions.push("(f.paid_to_office IS NULL OR f.paid_to_office != 'paid')");
  } else if (paidToOffice) {
    conditions.push("f.paid_to_office = ?");
    params.push(paidToOffice);
  }

  // Bank filter
  const bankId = searchParams.get("bank_id") ?? "";
  if (bankId) {
    conditions.push("f.bank_id = ?");
    params.push(parseInt(bankId, 10));
  }

  // Branch filter
  const branchId = searchParams.get("branch_id") ?? "";
  if (branchId) {
    conditions.push("f.branch_id = ?");
    params.push(parseInt(branchId, 10));
  }

  // Source filter
  const sourceId = searchParams.get("source_id") ?? "";
  if (sourceId) {
    conditions.push("f.source_id = ?");
    params.push(parseInt(sourceId, 10));
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRows, rows] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM inspection_files f ${where}`,
      params
    ),
    query<RowDataPacket[]>(
      `SELECT f.id, f.file_number, f.file_date, f.file_type,
              f.customer_name, f.report_status, f.payment_status,
              f.fees, f.commission, f.gross_amount,
              b.bank_name, br.branch_name
       FROM inspection_files f
       LEFT JOIN inspection_banks b ON b.id = f.bank_id
       LEFT JOIN inspection_branches br ON br.id = f.branch_id
       ${where}
       ORDER BY f.id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ),
  ]);

  return NextResponse.json({
    files: rows,
    total: (countRows[0]?.total as number) ?? 0,
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
       AND COLUMN_NAME IN ('report_status_date','payment_status_date','paid_to_office_date','commission_pending')`
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

  let commission: number;
  let officeAmount: number | null;
  let amount: number | null;

  if (fileType === "self") {
    commission = Math.round(fees * 0.30 * 100) / 100;
    officeAmount = Math.round(fees * 0.70 * 100) / 100;

    const paymentStatus = body.payment_status ?? "due";
    if (paymentStatus === "paid") {
      amount = fees;
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
    "fees", "report_status",
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

  const placeholders = columns.map(() => "?").join(", ");
  const result = await query<ResultSetHeader>(
    `INSERT INTO inspection_files (${columns.join(", ")}) VALUES (${placeholders})`,
    values
  );

  return NextResponse.json({ id: result.insertId, file_number: fileNumber }, { status: 201 });
}
