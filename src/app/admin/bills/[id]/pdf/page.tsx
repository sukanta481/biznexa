import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { COMPANY } from "@/lib/constants";

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = {
  title: `Invoice PDF | ${COMPANY.name}`,
  robots: { index: false, follow: false },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Handles: Date objects, ISO strings "2026-04-01T00:00:00.000Z", plain "2026-04-01", null
function fmtDate(v: unknown): string {
  if (!v) return "—";
  let str: string;
  if (v instanceof Date) {
    str = v.toISOString();
  } else {
    str = String(v);
  }
  const datePart = str.split("T")[0]; // "2026-04-01"
  const parts = datePart.split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return str;
  return `${MONTHS[m - 1]} ${String(d).padStart(2, "0")}, ${y}`;
}

function fmtMoney(v: number): string {
  return `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function toPublicAssetUrl(value: unknown): string | null {
  if (!value) return null;
  let path = String(value).trim();
  if (!path) return null;

  // Already a full URL or data URI → return as-is
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // Normalise slashes
  path = path.replace(/\\/g, "/");

  // Strip everything up to and including "/public/"
  const publicMarker = "/public/";
  const publicIdx = path.toLowerCase().indexOf(publicMarker);
  if (publicIdx >= 0) {
    path = path.slice(publicIdx + publicMarker.length);
  }

  // Strip leading "public/"
  if (path.toLowerCase().startsWith("public/")) {
    path = path.slice(7);
  }

  // Ensure leading slash
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  return path;
}

export default async function BillPDFPage({ params }: Props) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) notFound();

  const [bills, items, bankRows, upiRows] = await Promise.all([
    query<RowDataPacket[]>(
      `SELECT b.*, c.name AS client_name, c.email AS client_email,
              c.phone AS client_phone, c.company AS client_company,
              c.address AS client_address, c.gst_number AS client_gst
       FROM bills b LEFT JOIN clients c ON c.id = b.client_id WHERE b.id = ?`,
      [id]
    ),
    query<RowDataPacket[]>(
      `SELECT description, quantity, unit_price, total_price FROM bill_items
       WHERE bill_id = ? ORDER BY display_order ASC`,
      [id]
    ),
    query<RowDataPacket[]>(
      `SELECT pm.name, pm.bank_name, pm.account_holder, pm.account_number, pm.ifsc_code, pm.branch_name
       FROM bills b JOIN payment_methods pm ON pm.id = b.bank_payment_method_id
       WHERE b.id = ? AND b.bank_payment_method_id IS NOT NULL`,
      [id]
    ),
    query<RowDataPacket[]>(
      `SELECT pm.name, pm.upi_id, pm.qr_code_path
       FROM bills b JOIN payment_methods pm ON pm.id = b.upi_payment_method_id
       WHERE b.id = ? AND b.upi_payment_method_id IS NOT NULL`,
      [id]
    ),
  ]);

  if (!bills.length) notFound();
  const b = bills[0];
  const bank = bankRows[0] ?? null;
  const upi  = upiRows[0] ?? null;

  const statusColors: Record<string, string> = {
    draft:     "#94a3b8",
    sent:      "#3b82f6",
    paid:      "#22c55e",
    overdue:   "#ef4444",
    cancelled: "#475569",
  };
  const statusColor = statusColors[b.status as string] ?? "#94a3b8";

  const isPaid = b.payment_status === "paid";
  const balanceDue = Math.max(0, Number(b.total_amount) - Number(b.paid_amount));
  const logoSrc = "/lightlogo.svg";

  const upiId = upi?.upi_id ? String(upi.upi_id).trim() : "";
  // Use the QR code image placed directly in /public folder.
  // The DB qr_code_path stores an uploads/ path that may not exist,
  // so we fall back to the manually-placed /qrcode.jpeg in public/.
  const upiQrSrc = "/qrcode.jpeg";

  return (
    <>
      <style>{`
          :root {
            --brand-primary: #0b2a66;
            --brand-primary-strong: #091f4e;
            --brand-accent: #00a7c2;
            --brand-soft: #f4f8ff;
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; color: #1a1a2e; font-size: 13px; }
          .page { max-width: 860px; margin: 24px auto 60px; background: #fff; border-radius: 12px; box-shadow: 0 4px 32px rgba(0,0,0,0.10); overflow: hidden; }

          /* Top accent bar */
          .accent-bar { height: 5px; background: linear-gradient(90deg, var(--brand-primary-strong) 0%, var(--brand-primary) 58%, var(--brand-accent) 100%); }

          /* Header */
          .header { display: flex; justify-content: space-between; align-items: flex-start; padding: 36px 40px 28px; border-bottom: 1px solid #e2e8f0; }
          .brand-logo-wrap {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--brand-primary-strong);
            border-radius: 10px;
            padding: 10px 18px;
          }
          .brand-logo { height: 46px; width: auto; object-fit: contain; display: block; }
          .brand-contact { font-size: 11px; color: #64748b; margin-top: 10px; line-height: 1.7; }
          .invoice-badge { text-align: right; }
          .invoice-title { font-size: 30px; font-weight: 800; letter-spacing: -1px; color: var(--brand-primary); }
          .invoice-number { font-size: 13px; color: #64748b; margin-top: 4px; font-family: monospace; }
          .status-badge { display: inline-block; margin-top: 8px; padding: 4px 14px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; }

          /* Body padding */
          .body { padding: 32px 40px; }

          /* Meta grid */
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
          .meta-box { background: var(--brand-soft); border: 1px solid #d9e2f1; border-radius: 8px; padding: 16px 18px; }
          .meta-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; }
          .meta-value { font-size: 13px; color: var(--brand-primary-strong); line-height: 1.7; }
          .meta-value strong { font-size: 14px; font-weight: 700; display: block; margin-bottom: 2px; }
          .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed #f1f5f9; }
          .detail-row:last-child { border-bottom: none; }
          .detail-key { color: #94a3b8; font-size: 11px; }
          .detail-val { font-size: 12px; font-weight: 600; color: var(--brand-primary-strong); }

          /* Table */
          .items-wrap { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 28px; }
          table { width: 100%; border-collapse: collapse; }
          thead th { background: var(--brand-primary-strong); color: #fff; padding: 11px 14px; text-align: left; font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; }
          thead th.right { text-align: right; }
          thead th.center { text-align: center; }
          tbody td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 12.5px; color: #1e293b; vertical-align: top; }
          tbody td.right { text-align: right; font-weight: 600; }
          tbody td.center { text-align: center; }
          tbody tr:last-child td { border-bottom: none; }

          /* Totals */
          .totals-wrapper { background: var(--brand-soft); padding: 16px 20px; display: flex; justify-content: flex-end; border-top: 2px solid #e2e8f0; }
          .totals-box { width: 280px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 12.5px; }
          .totals-row:last-child { border-bottom: none; }
          .totals-row.grand { padding: 10px 0 0; font-weight: 800; font-size: 17px; color: var(--brand-primary-strong); }
          .totals-row .lbl { color: #64748b; }
          .totals-row.grand .lbl { color: var(--brand-primary-strong); }
          .totals-row.balance { font-weight: 700; font-size: 14px; padding-top: 8px; border-top: 2px solid #e2e8f0; border-bottom: none; margin-top: 4px; }

          /* Payment Information section – matches desired layout */
          .payment-info-section { margin-bottom: 28px; border: 1px solid #d9e2f1; border-radius: 10px; overflow: hidden; }
          .payment-info-header { display: flex; align-items: center; gap: 8px; padding: 12px 18px; font-size: 13px; font-weight: 700; color: var(--brand-primary-strong); }
          .payment-info-header .pay-icon { font-size: 16px; }
          .payment-info-line { height: 3px; background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%); margin: 0 18px; border-radius: 2px; }
          .payment-info-body { display: flex; padding: 18px; gap: 0; }
          .payment-bank-col { flex: 1; }
          .payment-upi-col { flex: 1; display: flex; flex-direction: column; }
          .col-title { font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--brand-primary-strong); margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
          .payment-bank-col .p-row { display: flex; gap: 8px; margin-bottom: 6px; font-size: 11px; }
          .payment-bank-col .p-row:last-child { margin-bottom: 0; }
          .payment-bank-col .p-key { color: #94a3b8; min-width: 60px; font-size: 10.5px; }
          .payment-bank-col .p-val { font-weight: 600; color: var(--brand-primary-strong); font-size: 10.5px; }
          .upi-details { font-size: 10.5px; color: #475569; margin-bottom: 6px; }
          .upi-details strong { font-weight: 600; color: var(--brand-primary-strong); font-family: monospace; }
          .upi-help { font-size: 10px; color: #94a3b8; line-height: 1.5; }
          .qr-box { width: 110px; height: 110px; border: 2px dashed #3b82f6; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6px; margin-left: auto; flex-shrink: 0; }
          .qr-box img { width: 80px; height: 80px; object-fit: contain; }
          .qr-box .qr-label { font-size: 9px; color: #64748b; margin-top: 4px; font-weight: 600; }

          /* Notes */
          .notes-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
          .notes-section.single { grid-template-columns: 1fr; }
          .notes-box { background: var(--brand-soft); border: 1px solid #d9e2f1; border-radius: 8px; padding: 14px 16px; }
          .notes-text { font-size: 11.5px; color: #475569; line-height: 1.7; white-space: pre-wrap; }

          /* Thank-you banner */
          .thankyou-banner { background: var(--brand-primary-strong); color: #fff; text-align: center; padding: 14px 40px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; }
          .thankyou-banner span { color: var(--brand-accent); }

          /* Signature / stamp area */
          .sign-area { display: flex; justify-content: flex-end; margin-bottom: 28px; }
          .sign-box { text-align: center; }
          .sign-img { width: 160px; height: 80px; object-fit: contain; display: block; margin: 0 auto 6px; }
          .sign-label { font-size: 9px; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; border-top: 1px solid #e2e8f0; padding-top: 6px; }

          /* Footer */
          .footer { background: var(--brand-soft); border-top: 1px solid #e2e8f0; padding: 16px 40px; display: flex; justify-content: space-between; align-items: center; }
          .footer-text { font-size: 10px; color: #94a3b8; }

          /* Print button */
          .print-btn { position: fixed; top: 16px; right: 16px; padding: 10px 20px; background: var(--brand-primary-strong); color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; z-index: 999; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
          .print-btn:hover { background: var(--brand-primary); }

          @media print {
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
            body { background: #fff; margin: 0; padding: 0; font-size: 11px; }
            .print-btn { display: none !important; }
            .page { margin: 0; border-radius: 0; box-shadow: none; max-width: 100%; }
            .accent-bar { height: 4px; }
            .header { padding: 20px 28px 16px; }
            .brand-logo-wrap { padding: 6px 12px; border-radius: 6px; }
            .brand-logo { height: 36px; }
            .brand-contact { font-size: 9px; margin-top: 6px; }
            .invoice-title { font-size: 24px; }
            .body { padding: 16px 28px; }
            .meta-grid { gap: 12px; margin-bottom: 16px; }
            .meta-box { padding: 10px 12px; }
            .meta-label { font-size: 8px; margin-bottom: 4px; }
            .meta-value { font-size: 11px; }
            .meta-value strong { font-size: 12px; }
            .items-wrap { margin-bottom: 16px; }
            thead th { padding: 7px 10px; font-size: 8px; }
            tbody td { padding: 6px 10px; font-size: 11px; }
            .totals-wrapper { padding: 10px 14px; }
            .totals-box { width: 240px; }
            .totals-row { padding: 4px 0; font-size: 11px; }
            .totals-row.grand { font-size: 14px; padding-top: 6px; }
            .payment-info-section { margin-bottom: 16px; page-break-inside: avoid; }
            .payment-info-header { padding: 8px 14px; font-size: 11px; }
            .payment-info-body { padding: 12px 14px; }
            .col-title { font-size: 9px; margin-bottom: 8px; }
            .qr-box { width: 90px; height: 90px; }
            .qr-box img { width: 65px; height: 65px; }
            .notes-section { margin-bottom: 14px; page-break-inside: avoid; }
            .notes-box { padding: 10px 12px; }
            .notes-text { font-size: 10px; }
            .sign-area { margin-bottom: 14px; page-break-inside: avoid; }
            .sign-img { width: 120px; height: 60px; }
            .sign-label { font-size: 8px; }
            .thankyou-banner { padding: 10px 28px; font-size: 13px; }
            .footer { padding: 10px 28px; }
            .footer-text { font-size: 9px; }
          }
        `}</style>

      <button className="print-btn" id="print-btn">🖨&nbsp; Print / Save PDF</button>

        <div className="page">
          <div className="accent-bar"></div>

          {/* ── Header ───────────────────────────────────────────────────── */}
          <div className="header">
            <div>
              {/* Dark background wrapper so light logo is visible on white paper */}
              <div className="brand-logo-wrap">
                <img src={logoSrc} alt={`${COMPANY.name} logo`} className="brand-logo" />
              </div>
              <div className="brand-contact">
                {COMPANY.address.street}, {COMPANY.address.area}<br />
                {COMPANY.address.city}, {COMPANY.address.state} — {COMPANY.address.zip}<br />
                {COMPANY.phone} &nbsp;·&nbsp; {COMPANY.email}
              </div>
            </div>
            <div className="invoice-badge">
              <div className="invoice-title">INVOICE</div>
              <div className="invoice-number">{b.bill_number as string}</div>
              <span className="status-badge" style={{ backgroundColor: statusColor }}>
                {(b.status as string).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="body">
            {/* ── Bill To + Invoice Details ──────────────────────────────── */}
            <div className="meta-grid">
              <div className="meta-box">
                <div className="meta-label">Bill To</div>
                <div className="meta-value">
                  <strong>{b.client_name as string}</strong>
                  {b.client_company ? <span style={{ fontSize: 12, color: "#64748b", display: "block" }}>{b.client_company as string}</span> : null}
                  {b.client_email as string}<br />
                  {b.client_phone ? <>{b.client_phone as string}<br /></> : null}
                  {b.client_address ? <>{b.client_address as string}<br /></> : null}
                  {b.client_gst ? <span style={{ fontSize: 11, color: "#64748b" }}>GST: {b.client_gst as string}</span> : null}
                </div>
              </div>
              <div className="meta-box">
                <div className="meta-label">Invoice Details</div>
                <div className="meta-value" style={{ padding: 0 }}>
                  <div className="detail-row">
                    <span className="detail-key">Invoice No.</span>
                    <span className="detail-val" style={{ fontFamily: "monospace" }}>{b.bill_number as string}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Invoice Date</span>
                    <span className="detail-val">{fmtDate(b.bill_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Due Date</span>
                    <span className="detail-val">{fmtDate(b.due_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Payment Status</span>
                    <span className="detail-val" style={{ color: isPaid ? "#22c55e" : b.payment_status === "partial" ? "#f59e0b" : "#ef4444" }}>
                      {(b.payment_status as string).toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Advance</span>
                    <span className="detail-val" style={{ color: "#22c55e" }}>{fmtMoney(Number(b.paid_amount))}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Due</span>
                    <span className="detail-val" style={{ color: balanceDue > 0 ? "#ef4444" : "#22c55e" }}>{fmtMoney(balanceDue)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Line Items ─────────────────────────────────────────────── */}
            <div className="items-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "48%" }}>Description</th>
                    <th className="center" style={{ width: "12%" }}>Qty</th>
                    <th className="right" style={{ width: "20%" }}>Unit Price</th>
                    <th className="right" style={{ width: "20%" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(items as RowDataPacket[]).map((item, i) => (
                    <tr key={i}>
                      <td>{item.description as string}</td>
                      <td className="center">{Number(item.quantity)}</td>
                      <td className="right">{fmtMoney(Number(item.unit_price))}</td>
                      <td className="right">{fmtMoney(Number(item.total_price))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="totals-wrapper">
                <div className="totals-box">
                  <div className="totals-row">
                    <span className="lbl">Subtotal</span>
                    <span>{fmtMoney(Number(b.subtotal))}</span>
                  </div>
                  {Number(b.tax_percent) > 0 && (
                    <div className="totals-row">
                      <span className="lbl">GST ({Number(b.tax_percent)}%)</span>
                      <span>{fmtMoney(Number(b.tax_amount))}</span>
                    </div>
                  )}
                  {Number(b.discount_amount) > 0 && (
                    <div className="totals-row">
                      <span className="lbl">Discount</span>
                      <span style={{ color: "#22c55e" }}>− {fmtMoney(Number(b.discount_amount))}</span>
                    </div>
                  )}
                  <div className="totals-row grand">
                    <span className="lbl">Total Amount</span>
                    <span>{fmtMoney(Number(b.total_amount))}</span>
                  </div>
                  <div className="totals-row" style={{ color: "#22c55e", fontSize: 12 }}>
                    <span className="lbl" style={{ color: "#22c55e" }}>Advance</span>
                    <span>{fmtMoney(Number(b.paid_amount))}</span>
                  </div>
                  <div className="totals-row balance" style={{ color: balanceDue > 0 ? "#ef4444" : "#22c55e" }}>
                    <span style={{ color: balanceDue > 0 ? "#ef4444" : "#22c55e" }}>Due</span>
                    <span>{fmtMoney(balanceDue)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Payment Information ───────────────────────────────────── */}
            {(bank || upi) && (
              <div className="payment-info-section">
                <div className="payment-info-header">
                  <span className="pay-icon">💳</span> Payment Information
                </div>
                <div className="payment-info-line"></div>
                <div className="payment-info-body">
                  {bank && (
                    <div className="payment-bank-col">
                      <div className="col-title">🏦 BANK TRANSFER</div>
                      {bank.bank_name      && <div className="p-row"><span className="p-key">Bank:</span><span className="p-val">{bank.bank_name as string}</span></div>}
                      {bank.account_number && <div className="p-row"><span className="p-key">A/C No:</span><span className="p-val" style={{ fontFamily: "monospace" }}>{bank.account_number as string}</span></div>}
                      {bank.ifsc_code      && <div className="p-row"><span className="p-key">IFSC:</span><span className="p-val" style={{ fontFamily: "monospace" }}>{bank.ifsc_code as string}</span></div>}
                      {bank.account_holder && <div className="p-row"><span className="p-key">Name:</span><span className="p-val">{bank.account_holder as string}</span></div>}
                      {bank.branch_name    && <div className="p-row"><span className="p-key">Branch:</span><span className="p-val">{bank.branch_name as string}</span></div>}
                    </div>
                  )}
                  {upi && (
                    <div className="payment-upi-col">
                      <div style={{ flex: 1 }}>
                        <div className="col-title">📱 UPI PAYMENT</div>
                        <div className="upi-details">UPI ID: &nbsp;<strong>{upi.upi_id as string}</strong></div>
                        <div className="upi-help">Scan QR code or use UPI ID to pay instantly via any UPI app</div>
                      </div>
                      <div className="qr-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={upiQrSrc} alt="UPI QR Code" />
                        <span className="qr-label">Scan to Pay</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Notes & Terms ──────────────────────────────────────────── */}
            {(b.notes || b.terms) && (
              <div className={`notes-section ${b.notes && b.terms ? "" : "single"}`}>
                {b.notes && (
                  <div className="notes-box">
                    <div className="section-title">Notes</div>
                    <div className="notes-text">{b.notes as string}</div>
                  </div>
                )}
                {b.terms && (
                  <div className="notes-box">
                    <div className="section-title">Terms &amp; Conditions</div>
                    <div className="notes-text">{b.terms as string}</div>
                  </div>
                )}
              </div>
            )}

            {/* ── Authorised Signatory / Stamp ──────────────────────────── */}
            <div className="sign-area">
              <div className="sign-box">
                <img
                  src="/stamp and sign.png"
                  alt="Authorised Signatory"
                  className="sign-img"
                />
                <div className="sign-label">Authorised Signatory — {COMPANY.name}</div>
              </div>
            </div>
          </div>

          {/* ── Thank You Banner ────────────────────────────────────────── */}
          <div className="thankyou-banner">
            Thank You for <span>Your Business!</span>
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <div className="footer">
            <div className="footer-text">{COMPANY.name} &nbsp;·&nbsp; {COMPANY.website} &nbsp;·&nbsp; {COMPANY.email}</div>
            <div className="footer-text">
              Generated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </div>

      <Script id="bill-print-handler" strategy="afterInteractive">
        {`document.getElementById('print-btn')?.addEventListener('click', function () { window.print(); });`}
      </Script>
    </>
  );
}
