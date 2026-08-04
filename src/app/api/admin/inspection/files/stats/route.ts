import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getInspectionFileFilters, getInspectionFileStats } from "@/lib/inspection-files";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";

// ─── GET /api/admin/inspection/files/stats ─────────────────────────────────────
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  const { searchParams } = new URL(request.url);
  const filters = getInspectionFileFilters(searchParams);
  const stats = await getInspectionFileStats(filters);
  return NextResponse.json(stats);
}