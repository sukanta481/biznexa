import "server-only";

import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export interface InspectionFileFilters {
  search: string;
  status: string;
  type: string;
  dateFrom: string;
  dateTo: string;
  paymentStatus: string;
  paidToOffice: string;
  bankId: string;
  branchId: string;
  sourceId: string;
}

export interface InspectionFileListRow extends RowDataPacket {
  id: number;
  file_number: string;
  file_date: string | Date | null;
  file_type: "self" | "office";
  customer_name: string | null;
  report_status: string | null;
  payment_status: string | null;
  fees: number | null;
  commission: number | null;
  gross_amount: number | null;
  bank_name: string | null;
  branch_name: string | null;
}

export interface InspectionFileExportRow extends InspectionFileListRow {
  location: string | null;
  customer_phone: string | null;
  property_address: string | null;
  property_value: number | null;
  source_name: string | null;
  mode_name: string | null;
  amount: number | null;
  paid_to_office: string | null;
  office_amount: number | null;
  extra_amount: number | null;
  received_account_name: string | null;
  notes: string | null;
}

export function getInspectionFileFilters(searchParams: URLSearchParams): InspectionFileFilters {
  return {
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
    type: searchParams.get("type") ?? "",
    dateFrom: searchParams.get("dateFrom") ?? "",
    dateTo: searchParams.get("dateTo") ?? "",
    paymentStatus: searchParams.get("payment_status") ?? "",
    paidToOffice: searchParams.get("paid_to_office") ?? "",
    bankId: searchParams.get("bank_id") ?? "",
    branchId: searchParams.get("branch_id") ?? "",
    sourceId: searchParams.get("source_id") ?? "",
  };
}

export function buildInspectionFileWhere(filters: InspectionFileFilters) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.search) {
    conditions.push("(f.file_number LIKE ? OR f.customer_name LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.status) {
    conditions.push("f.report_status = ?");
    params.push(filters.status);
  }

  if (filters.type) {
    conditions.push("f.file_type = ?");
    params.push(filters.type);
  }

  if (filters.dateFrom) {
    conditions.push("f.file_date >= ?");
    params.push(filters.dateFrom);
  }

  if (filters.dateTo) {
    conditions.push("f.file_date <= ?");
    params.push(filters.dateTo);
  }

  if (filters.paymentStatus === "pending_payment") {
    conditions.push("f.payment_status IN ('due', 'partially')");
  } else if (filters.paymentStatus) {
    conditions.push("f.payment_status = ?");
    params.push(filters.paymentStatus);
  }

  if (filters.paidToOffice === "due") {
    conditions.push("(f.paid_to_office IS NULL OR f.paid_to_office != 'paid')");
  } else if (filters.paidToOffice) {
    conditions.push("f.paid_to_office = ?");
    params.push(filters.paidToOffice);
  }

  if (filters.bankId) {
    conditions.push("f.bank_id = ?");
    params.push(parseInt(filters.bankId, 10));
  }

  if (filters.branchId) {
    conditions.push("f.branch_id = ?");
    params.push(parseInt(filters.branchId, 10));
  }

  if (filters.sourceId) {
    conditions.push("f.source_id = ?");
    params.push(parseInt(filters.sourceId, 10));
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
}

export async function getInspectionFilesPage(filters: InspectionFileFilters, limit: number, offset: number) {
  const { where, params } = buildInspectionFileWhere(filters);

  const [countRows, rows] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM inspection_files f ${where}`,
      params
    ),
    query<InspectionFileListRow[]>(
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

  return {
    files: rows,
    total: (countRows[0]?.total as number) ?? 0,
  };
}

export async function getInspectionFileStats(filters: InspectionFileFilters) {
  const { where, params } = buildInspectionFileWhere(filters);

  const [statusRows, financeRows] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT f.report_status, COUNT(*) as count
       FROM inspection_files f
       ${where}
       GROUP BY f.report_status`,
      params
    ),
    query<RowDataPacket[]>(
      `SELECT
         COALESCE(SUM(CASE WHEN file_type = 'self' THEN fees ELSE 0 END), 0) as totalFees,
         COALESCE(SUM(commission), 0) as totalCommission,
         COALESCE(SUM(CASE WHEN file_type = 'self' AND payment_status = 'paid' THEN fees ELSE 0 END), 0) as paidAmount,
         COALESCE(SUM(CASE WHEN file_type = 'self' AND payment_status IN ('due', 'partially') THEN COALESCE(fees, 0) - COALESCE(amount, 0) ELSE 0 END), 0) as pendingAmount,
         COALESCE(SUM(CASE WHEN paid_to_office = 'paid' THEN commission ELSE 0 END), 0) as paidToOffice,
         COALESCE(SUM(CASE WHEN paid_to_office != 'paid' OR paid_to_office IS NULL THEN commission ELSE 0 END), 0) as pendingToOffice,
         COUNT(*) as totalFiles,
         COALESCE(SUM(gross_amount), 0) as totalGross
       FROM inspection_files f
       ${where}`,
      params
    ),
  ]);

  const statusBreakdown: Record<string, number> = {};
  let totalCount = 0;
  for (const row of statusRows) {
    statusBreakdown[row.report_status ?? 'unknown'] = Number(row.count);
    totalCount += Number(row.count);
  }

  const fin = financeRows[0];
  return {
    totalFiles: Number(fin.totalFiles) ?? 0,
    totalFees: Number(fin.totalFees) ?? 0,
    totalCommission: Number(fin.totalCommission) ?? 0,
    paidAmount: Number(fin.paidAmount) ?? 0,
    pendingAmount: Number(fin.pendingAmount) ?? 0,
    paidToOffice: Number(fin.paidToOffice) ?? 0,
    pendingToOffice: Number(fin.pendingToOffice) ?? 0,
    totalGross: Number(fin.totalGross) ?? 0,
    statusBreakdown,
  };
}

export async function getInspectionFilesForExport(filters: InspectionFileFilters) {
  const { where, params } = buildInspectionFileWhere(filters);

  return query<InspectionFileExportRow[]>(
    `SELECT f.id, f.file_number, f.file_date, f.file_type, f.location,
            f.customer_name, f.customer_phone, f.property_address, f.property_value,
            f.report_status, f.payment_status, f.fees, f.amount,
            f.paid_to_office, f.office_amount, f.commission, f.extra_amount,
            f.gross_amount, f.notes,
            b.bank_name, br.branch_name, s.source_name,
            pm.mode_name, ma.account_name AS received_account_name
     FROM inspection_files f
     LEFT JOIN inspection_banks b ON b.id = f.bank_id
     LEFT JOIN inspection_branches br ON br.id = f.branch_id
     LEFT JOIN inspection_sources s ON s.id = f.source_id
     LEFT JOIN inspection_payment_modes pm ON pm.id = f.payment_mode_id
     LEFT JOIN inspection_my_accounts ma ON ma.id = f.received_account_id
     ${where}
     ORDER BY f.id DESC`,
    params
  );
}
