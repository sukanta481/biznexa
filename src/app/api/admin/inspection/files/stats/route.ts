import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getInspectionFileFilters, getInspectionFileStats } from "@/lib/inspection-files";

// ─── GET /api/admin/inspection/files/stats ─────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = getInspectionFileFilters(searchParams);
  const stats = await getInspectionFileStats(filters);
  return NextResponse.json(stats);
}