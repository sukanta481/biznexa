import "server-only";

import { NextRequest } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { CLIENT_EXPORT_COLUMNS, getClientFilters, getClientsForExport } from "@/lib/clients";
import { buildExcelSheet, excelResponse, titleCase } from "@/lib/excel-export";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(request.url);
  const filters = getClientFilters(searchParams);
  const rows = await getClientsForExport(filters);

  const notes: string[] = [];
  if (filters.search) notes.push(`Search: "${filters.search}"`);
  if (filters.status) notes.push(`Status: ${titleCase(filters.status)}`);

  const sheet = buildExcelSheet({
    title: "Clients Export",
    columns: CLIENT_EXPORT_COLUMNS,
    rows,
    subtitle: notes,
  });

  return excelResponse(sheet, "clients");
}
