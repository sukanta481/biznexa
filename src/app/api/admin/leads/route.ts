import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

import { query } from "@/lib/db";

interface LeadRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_type: string | null;
  message: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "proposal_sent" | "won" | "lost";
  priority: "low" | "medium" | "high";
  created_at: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const service = searchParams.get("service")?.trim() ?? "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (search) {
    conditions.push("(name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)");
    values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status && status !== "all") {
    conditions.push("status = ?");
    values.push(status);
  }

  if (service && service !== "all") {
    conditions.push("COALESCE(service_type, 'general') = ?");
    values.push(service);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [records, totalRows, metricRows] = await Promise.all([
    query<LeadRow[]>(
      `SELECT id, name, email, phone, company, service_type, message, source, status, priority, created_at
       FROM leads
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    ),
    query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total
       FROM leads
       ${whereClause}`,
      values,
    ),
    query<RowDataPacket[]>(
      `SELECT
          COUNT(*) AS totalLeads,
          SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) AS qualifiedLeads,
          SUM(CASE WHEN status IN ('won', 'lost') THEN 1 ELSE 0 END) AS closedLeads,
          SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS newLeads
       FROM leads`,
    ),
  ]);

  const metrics = metricRows[0] ?? {};
  const totalLeads = Number(metrics.totalLeads ?? 0);
  const qualifiedLeads = Number(metrics.qualifiedLeads ?? 0);
  const closedLeads = Number(metrics.closedLeads ?? 0);

  return NextResponse.json({
    records,
    total: Number(totalRows[0]?.total ?? 0),
    page,
    limit,
    metrics: {
      totalLeads,
      qualifiedLeads,
      newLeads: Number(metrics.newLeads ?? 0),
      conversionRate: totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 1000) / 10 : 0,
      closedLeads,
    },
  });
}
