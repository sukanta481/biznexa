import "server-only";

import { NextRequest } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { BILL_EXPORT_COLUMNS, getBillFilters, getBillsForExport } from "@/lib/bills";
import { buildExcelSheet, excelResponse, titleCase } from "@/lib/excel-export";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(request.url);
  const filters = getBillFilters(searchParams);
  const rows = await getBillsForExport(filters);

  const notes: string[] = [];
  if (filters.search) notes.push(`Search: "${filters.search}"`);
  if (filters.status) notes.push(`Status: ${titleCase(filters.status)}`);
  if (filters.paymentStatus) notes.push(`Payment: ${titleCase(filters.paymentStatus)}`);
  if (filters.dateFrom || filters.dateTo) {
    notes.push(`Bill date: ${filters.dateFrom || "any"} to ${filters.dateTo || "any"}`);
  }
  if (filters.amountMin || filters.amountMax) {
    notes.push(`Amount: ${filters.amountMin || "any"} to ${filters.amountMax || "any"}`);
  }

  const totals = rows.reduce(
    (acc, row) => {
      acc.total += Number(row.total_amount ?? 0);
      acc.paid += Number(row.paid_amount ?? 0);
      return acc;
    },
    { total: 0, paid: 0 },
  );
  notes.push(
    `Total billed: ${totals.total.toFixed(2)}   Paid: ${totals.paid.toFixed(2)}   Outstanding: ${(totals.total - totals.paid).toFixed(2)}`,
  );

  const sheet = buildExcelSheet({
    title: "Bills Export",
    columns: BILL_EXPORT_COLUMNS,
    rows,
    subtitle: notes,
  });

  return excelResponse(sheet, "bills");
}
