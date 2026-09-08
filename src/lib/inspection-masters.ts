import "server-only";

import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

import type { ExcelColumn } from "@/lib/excel-export";
import { excelDate, titleCase } from "@/lib/excel-export";

/**
 * The inspection master tables all share the same shape — a name, a status and
 * a handful of entity-specific columns — so the list, write and export routes
 * are driven from this one map. It lives here rather than in a route file so
 * adding an entity cannot half-land in one route and be forgotten in another.
 */

export type MasterEntityKey =
  | "banks"
  | "branches"
  | "sources"
  | "payment-modes"
  | "accounts"
  | "report-types";

export type MasterEntity = {
  table: string;
  nameField: string;
  extraFields: string[];
  label: string;
};

export const MASTER_ENTITIES: Record<MasterEntityKey, MasterEntity> = {
  banks: { table: "inspection_banks", nameField: "bank_name", extraFields: [], label: "Banks" },
  branches: { table: "inspection_branches", nameField: "branch_name", extraFields: ["bank_id"], label: "Branches" },
  sources: { table: "inspection_sources", nameField: "source_name", extraFields: ["phone"], label: "Sources" },
  "payment-modes": { table: "inspection_payment_modes", nameField: "mode_name", extraFields: [], label: "Payment Modes" },
  accounts: {
    table: "inspection_my_accounts",
    nameField: "account_name",
    extraFields: ["bank_name", "account_number", "ifsc_code"],
    label: "Accounts",
  },
  "report-types": { table: "inspection_report_types", nameField: "report_name", extraFields: [], label: "Report Types" },
};

export function resolveMasterEntity(param: string): MasterEntityKey | null {
  return param in MASTER_ENTITIES ? (param as MasterEntityKey) : null;
}

export type MasterExportRow = RowDataPacket;

const COMMON_TAIL: ExcelColumn<MasterExportRow>[] = [
  { label: "Status", value: (row) => titleCase(row.status as string) },
  { label: "Created", value: (row) => excelDate(row.created_at as string) },
];

export const MASTER_EXPORT_COLUMNS: Record<MasterEntityKey, ExcelColumn<MasterExportRow>[]> = {
  banks: [
    { label: "ID", value: (row) => Number(row.id) },
    { label: "Bank Name", value: (row) => row.bank_name as string },
    ...COMMON_TAIL,
  ],
  branches: [
    { label: "ID", value: (row) => Number(row.id) },
    { label: "Branch Name", value: (row) => row.branch_name as string },
    { label: "Bank", value: (row) => (row.bank_name as string) ?? "" },
    ...COMMON_TAIL,
  ],
  sources: [
    { label: "ID", value: (row) => Number(row.id) },
    { label: "Source Name", value: (row) => row.source_name as string },
    { label: "Phone", value: (row) => (row.phone as string) ?? "" },
    ...COMMON_TAIL,
  ],
  "payment-modes": [
    { label: "ID", value: (row) => Number(row.id) },
    { label: "Mode Name", value: (row) => row.mode_name as string },
    ...COMMON_TAIL,
  ],
  accounts: [
    { label: "ID", value: (row) => Number(row.id) },
    { label: "Account Name", value: (row) => row.account_name as string },
    { label: "Bank Name", value: (row) => (row.bank_name as string) ?? "" },
    // Account numbers and IFSC codes stay text so Excel never reformats them.
    { label: "Account Number", value: (row) => (row.account_number as string) ?? "" },
    { label: "IFSC Code", value: (row) => (row.ifsc_code as string) ?? "" },
    ...COMMON_TAIL,
  ],
  "report-types": [
    { label: "ID", value: (row) => Number(row.id) },
    { label: "Report Name", value: (row) => row.report_name as string },
    ...COMMON_TAIL,
  ],
};

/** Every row of one master table matching `search`, unpaginated, for export. */
export async function getMasterRowsForExport(entity: MasterEntityKey, search: string) {
  if (entity === "branches") {
    const where = search ? "WHERE (b.branch_name LIKE ? OR bk.bank_name LIKE ?)" : "";
    const params = search ? [`%${search}%`, `%${search}%`] : [];
    return query<MasterExportRow[]>(
      `SELECT b.id, b.branch_name, b.bank_id, bk.bank_name, b.status, b.created_at
         FROM inspection_branches b
         LEFT JOIN inspection_banks bk ON b.bank_id = bk.id
         ${where}
        ORDER BY b.id DESC`,
      params,
    );
  }

  const { table, nameField } = MASTER_ENTITIES[entity];
  const where = search ? `WHERE ${nameField} LIKE ?` : "";
  const params = search ? [`%${search}%`] : [];
  return query<MasterExportRow[]>(`SELECT * FROM ${table} ${where} ORDER BY id DESC`, params);
}
