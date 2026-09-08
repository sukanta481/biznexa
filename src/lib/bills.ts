import "server-only";

import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

import type { ExcelColumn } from "@/lib/excel-export";
import { excelDate, excelNumber, titleCase } from "@/lib/excel-export";

export type BillFilters = {
  search: string;
  clientId: string;
  status: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
};

export function getBillFilters(searchParams: URLSearchParams): BillFilters {
  return {
    search: searchParams.get("search") ?? "",
    clientId: searchParams.get("client_id") ?? "",
    status: searchParams.get("status") ?? "",
    paymentStatus: searchParams.get("payment_status") ?? "",
    dateFrom: searchParams.get("date_from") ?? "",
    dateTo: searchParams.get("date_to") ?? "",
    amountMin: searchParams.get("amount_min") ?? "",
    amountMax: searchParams.get("amount_max") ?? "",
  };
}

/** Shared by the list and export routes so the two can never drift apart. */
export function buildBillWhere(filters: BillFilters) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.search) {
    conditions.push("(b.bill_number LIKE ? OR c.name LIKE ? OR c.email LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like);
  }
  if (filters.clientId) { conditions.push("b.client_id = ?"); params.push(filters.clientId); }
  if (filters.status) { conditions.push("b.status = ?"); params.push(filters.status); }
  if (filters.paymentStatus) { conditions.push("b.payment_status = ?"); params.push(filters.paymentStatus); }
  if (filters.dateFrom) { conditions.push("b.bill_date >= ?"); params.push(filters.dateFrom); }
  if (filters.dateTo) { conditions.push("b.bill_date <= ?"); params.push(filters.dateTo); }
  if (filters.amountMin) { conditions.push("b.total_amount >= ?"); params.push(filters.amountMin); }
  if (filters.amountMax) { conditions.push("b.total_amount <= ?"); params.push(filters.amountMax); }

  return { where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "", params };
}

export type BillExportRow = RowDataPacket;

export const BILL_EXPORT_COLUMNS: ExcelColumn<BillExportRow>[] = [
  { label: "Bill No.", value: (row) => (row.bill_number as string) ?? "" },
  { label: "Bill Date", value: (row) => excelDate(row.bill_date as string) },
  { label: "Due Date", value: (row) => excelDate(row.due_date as string) },
  { label: "Client", value: (row) => (row.client_name as string) ?? "" },
  { label: "Company", value: (row) => (row.client_company as string) ?? "" },
  { label: "Email", value: (row) => (row.client_email as string) ?? "" },
  { label: "Phone", value: (row) => (row.client_phone as string) ?? "" },
  { label: "GST Number", value: (row) => (row.client_gst as string) ?? "" },
  { label: "Subtotal", value: (row) => excelNumber(row.subtotal as number) },
  { label: "Tax %", value: (row) => excelNumber(row.tax_percent as number) },
  { label: "Tax Amount", value: (row) => excelNumber(row.tax_amount as number) },
  { label: "Discount", value: (row) => excelNumber(row.discount_amount as number) },
  { label: "Total Amount", value: (row) => excelNumber(row.total_amount as number) },
  { label: "Paid Amount", value: (row) => excelNumber(row.paid_amount as number) },
  // Derived rather than stored, so the sheet balances even on partial payments.
  { label: "Balance Due", value: (row) => balanceDue(row) },
  { label: "Status", value: (row) => titleCase(row.status as string) },
  { label: "Payment Status", value: (row) => titleCase(row.payment_status as string) },
  { label: "Payment Date", value: (row) => excelDate(row.payment_date as string) },
  { label: "Payment Method", value: (row) => (row.payment_method_name as string) ?? "" },
  { label: "Notes", value: (row) => (row.notes as string) ?? "" },
  { label: "Created", value: (row) => excelDate(row.created_at as string) },
];

function balanceDue(row: BillExportRow) {
  const total = Number(row.total_amount ?? 0);
  const paid = Number(row.paid_amount ?? 0);
  if (!Number.isFinite(total) || !Number.isFinite(paid)) return null;
  return Math.round((total - paid) * 100) / 100;
}

/** Every bill matching the filters, unpaginated. */
export async function getBillsForExport(filters: BillFilters) {
  const { where, params } = buildBillWhere(filters);
  return query<BillExportRow[]>(
    `SELECT b.id, b.bill_number, b.bill_date, b.due_date,
            b.subtotal, b.tax_percent, b.tax_amount, b.discount_amount, b.total_amount,
            b.status, b.payment_status, b.paid_amount, b.payment_date,
            b.notes, b.created_at,
            c.name AS client_name, c.email AS client_email, c.phone AS client_phone,
            c.company AS client_company, c.gst_number AS client_gst,
            COALESCE(bank.name, upi.name) AS payment_method_name
       FROM bills b
       LEFT JOIN clients c ON c.id = b.client_id
       LEFT JOIN payment_methods bank ON bank.id = b.bank_payment_method_id
       LEFT JOIN payment_methods upi ON upi.id = b.upi_payment_method_id
       ${where}
      ORDER BY b.created_at DESC`,
    params,
  );
}
