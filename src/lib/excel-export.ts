import "server-only";

import { NextResponse } from "next/server";

/**
 * Excel exports are written as an HTML table served with an Excel content type.
 * Excel opens it happily, it needs no dependency, and a .xls of a few thousand
 * admin rows is well under any size that would justify a real XLSX writer.
 */

export type ExcelColumn<Row> = {
  label: string;
  /** Return a number for numeric cells so Excel can sum them; a string otherwise. */
  value: (row: Row) => string | number | null;
};

export function buildExcelSheet<Row>(options: {
  title: string;
  columns: ExcelColumn<Row>[];
  rows: Row[];
  /** Optional lines under the title — active filters, totals, whatever helps. */
  subtitle?: string[];
}) {
  const { title, columns, rows, subtitle = [] } = options;

  const header = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
  const body = rows
    .map((row) => {
      const cells = columns
        .map((column) => {
          const value = column.value(row);
          // Text cells are forced to string format so numbers that are really
          // identifiers — phone numbers, account numbers, GSTINs — keep their
          // leading zeros instead of being rounded into scientific notation.
          if (typeof value === "number" && Number.isFinite(value)) {
            return `<td class="num">${value}</td>`;
          }
          return `<td>${escapeHtml(value == null ? "" : String(value))}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  const notes = subtitle.map((line) => `<p>${escapeHtml(line)}</p>`).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th { background: #0f172a; color: #ffffff; font-weight: 700; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 12px; vertical-align: top; }
    td { mso-number-format: "\\@"; }
    td.num { mso-number-format: "General"; text-align: right; }
  </style>
</head>
<body>
  <h2>${escapeHtml(title)}</h2>
  <p>Total records: ${rows.length}</p>
  ${notes}
  <table>
    <thead><tr>${header}</tr></thead>
    <tbody>${body}</tbody>
  </table>
</body>
</html>`;
}

/** Wraps a sheet in a download response named `<slug>-YYYY-MM-DD.xls`. */
export function excelResponse(sheet: string, slug: string) {
  const filename = `${slug}-${new Date().toISOString().slice(0, 10)}.xls`;
  return new NextResponse(sheet, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export function excelDate(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value).split("T")[0];
  return date.toISOString().slice(0, 10);
}

export function excelNumber(value: number | string | null | undefined) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function titleCase(value: string | null | undefined) {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
