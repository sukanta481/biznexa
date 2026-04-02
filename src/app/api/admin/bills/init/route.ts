import "server-only";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const [clients, methods, settings] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT id, name, email, phone, company FROM clients WHERE status = 'active' ORDER BY name ASC`
    ),
    query<RowDataPacket[]>(
      `SELECT id, type, name, bank_name, account_holder, account_number, ifsc_code, branch_name, upi_id, is_default
       FROM payment_methods WHERE is_active = 1 ORDER BY is_default DESC, display_order ASC, id ASC`
    ),
    query<RowDataPacket[]>(
      `SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('bill_prefix','bill_terms')`
    ),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const row of settings) {
    settingsMap[row.setting_key as string] = row.setting_value as string ?? "";
  }

  return NextResponse.json({
    clients,
    banks: methods.filter((m) => m.type === "bank"),
    upis: methods.filter((m) => m.type === "upi"),
    bill_prefix: settingsMap["bill_prefix"] ?? "INV",
    bill_terms: settingsMap["bill_terms"] ?? "Payment is due within 15 days of the invoice date.",
  });
}
