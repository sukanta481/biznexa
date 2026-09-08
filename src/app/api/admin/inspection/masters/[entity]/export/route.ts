import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { buildExcelSheet, excelResponse } from "@/lib/excel-export";
import {
  MASTER_ENTITIES,
  MASTER_EXPORT_COLUMNS,
  getMasterRowsForExport,
  resolveMasterEntity,
} from "@/lib/inspection-masters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { entity: entityParam } = await params;
  const entity = resolveMasterEntity(entityParam);
  if (!entity) return NextResponse.json({ error: "Invalid entity" }, { status: 400 });

  const search = new URL(request.url).searchParams.get("search") ?? "";
  const rows = await getMasterRowsForExport(entity, search);
  const { label } = MASTER_ENTITIES[entity];

  const sheet = buildExcelSheet({
    title: `Inspection Masters — ${label}`,
    columns: MASTER_EXPORT_COLUMNS[entity],
    rows,
    subtitle: search ? [`Filtered by: "${search}"`] : [],
  });

  return excelResponse(sheet, `inspection-${entity}`);
}
