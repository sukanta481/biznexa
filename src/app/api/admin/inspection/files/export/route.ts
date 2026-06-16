import "server-only";

import { NextRequest, NextResponse } from "next/server";
import {
  getInspectionFileFilters,
  getInspectionFilesForExport,
  type InspectionFileExportRow,
} from "@/lib/inspection-files";

type ExportFormat = "excel" | "pdf";

const EXPORT_COLUMNS: Array<{ label: string; value: (row: InspectionFileExportRow) => string | number | null }> = [
  { label: "File Ref", value: (row) => row.file_number },
  { label: "Date", value: (row) => formatDate(row.file_date) },
  { label: "Type", value: (row) => titleCase(row.file_type) },
  { label: "Location", value: (row) => titleCase(row.location) },
  { label: "Client", value: (row) => row.customer_name },
  { label: "Phone", value: (row) => row.customer_phone },
  { label: "Bank", value: (row) => row.bank_name },
  { label: "Branch", value: (row) => row.branch_name },
  { label: "Source", value: (row) => row.source_name },
  { label: "Report Status", value: (row) => titleCase(row.report_status) },
  { label: "Payment Status", value: (row) => titleCase(row.payment_status) },
  { label: "Paid to Office", value: (row) => titleCase(row.paid_to_office) },
  { label: "Fees", value: (row) => numberValue(row.fees) },
  { label: "Amount Paid", value: (row) => numberValue(row.amount) },
  { label: "Office Amount", value: (row) => numberValue(row.office_amount) },
  { label: "Commission", value: (row) => numberValue(row.commission) },
  { label: "Extra Amount", value: (row) => numberValue(row.extra_amount) },
  { label: "Gross Amount", value: (row) => numberValue(row.gross_amount) },
  { label: "Payment Mode", value: (row) => row.mode_name },
  { label: "Received Account", value: (row) => row.received_account_name },
  { label: "Property Value", value: (row) => numberValue(row.property_value) },
  { label: "Property Address", value: (row) => row.property_address },
  { label: "Notes", value: (row) => row.notes },
];

const PDF_COLUMNS = [
  EXPORT_COLUMNS[0],
  EXPORT_COLUMNS[1],
  EXPORT_COLUMNS[2],
  EXPORT_COLUMNS[4],
  EXPORT_COLUMNS[6],
  EXPORT_COLUMNS[7],
  EXPORT_COLUMNS[9],
  EXPORT_COLUMNS[17],
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = parseFormat(searchParams.get("format"));
  if (!format) {
    return NextResponse.json({ error: "Invalid export format." }, { status: 400 });
  }

  const rows = await getInspectionFilesForExport(getInspectionFileFilters(searchParams));
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `inspection-files-${stamp}.${format === "excel" ? "xls" : "pdf"}`;

  if (format === "excel") {
    return new NextResponse(buildExcel(rows), {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return new NextResponse(buildPdf(rows), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

function parseFormat(format: string | null): ExportFormat | null {
  if (format === "excel" || format === "pdf") return format;
  return null;
}

function buildExcel(rows: InspectionFileExportRow[]) {
  const header = EXPORT_COLUMNS
    .map((column) => `<th>${escapeHtml(column.label)}</th>`)
    .join("");
  const body = rows
    .map((row) => {
      const cells = EXPORT_COLUMNS
        .map((column) => `<td>${escapeHtml(formatCell(column.value(row)))}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

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
  </style>
</head>
<body>
  <h2>Inspection Files Export</h2>
  <p>Total records: ${rows.length}</p>
  <table>
    <thead><tr>${header}</tr></thead>
    <tbody>${body}</tbody>
  </table>
</body>
</html>`;
}

function buildPdf(rows: InspectionFileExportRow[]) {
  const pageWidth = 842;
  const pageHeight = 595;
  const margin = 28;
  const rowHeight = 18;
  const colWidths = [86, 62, 46, 116, 88, 88, 76, 70];
  const objects: string[] = [];
  const pages: number[] = [];
  const rowsPerPage = Math.max(1, Math.floor((pageHeight - 128) / rowHeight));
  const chunks = chunkRows(rows, rowsPerPage);
  const safeChunks = chunks.length ? chunks : [[]];

  for (let pageIndex = 0; pageIndex < safeChunks.length; pageIndex++) {
    const contentId = 5 + pageIndex * 2;
    const pageId = contentId + 1;
    const stream = buildPdfPageStream({
      rows: safeChunks[pageIndex],
      pageIndex,
      pageCount: safeChunks.length,
      pageWidth,
      pageHeight,
      margin,
      rowHeight,
      colWidths,
      totalRows: rows.length,
    });

    objects.push(`<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    pages.push(pageId);
  }

  const catalog = "<< /Type /Catalog /Pages 2 0 R >>";
  const pagesObject = `<< /Type /Pages /Kids [${pages.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`;
  const fontRegular = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  const fontBold = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  const allObjects = [catalog, pagesObject, fontRegular, fontBold, ...objects];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  allObjects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "binary"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "binary");
  pdf += `xref\n0 ${allObjects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${allObjects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "binary");
}

function buildPdfPageStream(options: {
  rows: InspectionFileExportRow[];
  pageIndex: number;
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  rowHeight: number;
  colWidths: number[];
  totalRows: number;
}) {
  const { rows, pageIndex, pageCount, pageHeight, margin, rowHeight, colWidths, totalRows } = options;
  const commands: string[] = ["0.96 0.98 1 rg", `0 0 ${options.pageWidth} ${pageHeight} re f`];
  const tableTop = pageHeight - 96;
  const generated = formatDate(new Date());

  addText(commands, "Inspection Files Export", margin, pageHeight - 38, 16, true);
  addText(commands, `Total records: ${totalRows}    Generated: ${generated}`, margin, pageHeight - 58, 9);
  addText(commands, `Page ${pageIndex + 1} of ${pageCount}`, options.pageWidth - margin - 70, pageHeight - 58, 9);

  commands.push("0.06 0.09 0.16 rg", `${margin} ${tableTop - rowHeight + 4} ${colWidths.reduce((sum, width) => sum + width, 0)} ${rowHeight} re f`);

  let x = margin;
  PDF_COLUMNS.forEach((column, index) => {
    addText(commands, column.label, x + 4, tableTop - 9, 7, true, colWidths[index] - 8);
    x += colWidths[index];
  });

  rows.forEach((row, rowIndex) => {
    const y = tableTop - rowHeight * (rowIndex + 2) + 4;
    commands.push(rowIndex % 2 === 0 ? "1 1 1 rg" : "0.94 0.96 0.98 rg");
    commands.push(`${margin} ${y} ${colWidths.reduce((sum, width) => sum + width, 0)} ${rowHeight} re f`);

    let cellX = margin;
    PDF_COLUMNS.forEach((column, columnIndex) => {
      addText(commands, formatCell(column.value(row)), cellX + 4, y + 6, 7, false, colWidths[columnIndex] - 8);
      cellX += colWidths[columnIndex];
    });
  });

  commands.push("0.8 0.84 0.9 RG", `0.5 w`, `${margin} ${tableTop - rowHeight + 4} ${colWidths.reduce((sum, width) => sum + width, 0)} ${rowHeight * (rows.length + 1)} re S`);
  return commands.join("\n");
}

function addText(commands: string[], text: string, x: number, y: number, size: number, bold = false, maxChars?: number) {
  const clipped = maxChars && text.length > maxChars ? `${text.slice(0, Math.max(0, maxChars - 3))}...` : text;
  commands.push("0 0 0 rg");
  commands.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td (${escapePdfText(clipped)}) Tj ET`);
}

function chunkRows(rows: InspectionFileExportRow[], size: number) {
  const chunks: InspectionFileExportRow[][] = [];
  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }
  return chunks;
}

function formatDate(value: string | Date | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value).split("T")[0];
  return date.toISOString().slice(0, 10);
}

function formatCell(value: string | number | null) {
  if (value == null) return "";
  return String(value);
}

function numberValue(value: number | string | null) {
  if (value == null || value === "") return null;
  return Number(value);
}

function titleCase(value: string | null) {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapePdfText(value: string) {
  return value
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}
