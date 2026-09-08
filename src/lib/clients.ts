import "server-only";

import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

import type { ExcelColumn } from "@/lib/excel-export";
import { excelDate, excelNumber, titleCase } from "@/lib/excel-export";

export type ClientFilters = {
  search: string;
  status: string;
};

export function getClientFilters(searchParams: URLSearchParams): ClientFilters {
  return {
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
  };
}

/** Shared by the list and export routes so the two can never drift apart. */
export function buildClientWhere(filters: ClientFilters) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.search) {
    conditions.push("(c.name LIKE ? OR c.email LIKE ? OR c.company LIKE ? OR c.phone LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like, like);
  }

  if (filters.status) {
    conditions.push("c.status = ?");
    params.push(filters.status);
  }

  return { where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "", params };
}

export type ClientExportRow = RowDataPacket;

export const CLIENT_EXPORT_COLUMNS: ExcelColumn<ClientExportRow>[] = [
  { label: "ID", value: (row) => Number(row.id) },
  { label: "Name", value: (row) => (row.name as string) ?? "" },
  { label: "Company", value: (row) => (row.company as string) ?? "" },
  { label: "Email", value: (row) => (row.email as string) ?? "" },
  // Phone and GSTIN stay text — as numbers Excel would strip leading zeros.
  { label: "Phone", value: (row) => (row.phone as string) ?? "" },
  { label: "GST Number", value: (row) => (row.gst_number as string) ?? "" },
  { label: "Address", value: (row) => (row.address as string) ?? "" },
  { label: "Status", value: (row) => titleCase(row.status as string) },
  { label: "Bills", value: (row) => excelNumber(row.bill_count as number) },
  { label: "Total Paid", value: (row) => excelNumber(row.total_paid as number) },
  { label: "Created", value: (row) => excelDate(row.created_at as string) },
];

/** Every client matching the filters, unpaginated. */
export async function getClientsForExport(filters: ClientFilters) {
  const { where, params } = buildClientWhere(filters);
  return query<ClientExportRow[]>(
    `SELECT c.id, c.name, c.email, c.phone, c.company, c.address,
            c.gst_number, c.status, c.created_at,
            (SELECT COUNT(*) FROM bills WHERE client_id = c.id) AS bill_count,
            COALESCE((SELECT SUM(total_amount) FROM bills
                       WHERE client_id = c.id AND payment_status = 'paid'), 0) AS total_paid
       FROM clients c
       ${where}
      ORDER BY c.created_at DESC`,
    params,
  );
}
