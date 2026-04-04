import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

function getDateRange(preset: string | null, dateFrom: string | null, dateTo: string | null): { from: string; to: string; label: string } | null {
  if (preset) {
    const now = new Date();
    let from: string;
    let to: string;
    let label: string;

    switch (preset) {
      case "7d": {
        from = new Date(now.getTime() - 7 * 86400000).toISOString().split("T")[0];
        to = now.toISOString().split("T")[0];
        label = "Last 7 Days";
        break;
      }
      case "30d": {
        from = new Date(now.getTime() - 30 * 86400000).toISOString().split("T")[0];
        to = now.toISOString().split("T")[0];
        label = "Last 30 Days";
        break;
      }
      case "60d": {
        from = new Date(now.getTime() - 60 * 86400000).toISOString().split("T")[0];
        to = now.toISOString().split("T")[0];
        label = "Last 60 Days";
        break;
      }
      case "this_month": {
        from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
        to = now.toISOString().split("T")[0];
        label = "This Month";
        break;
      }
      case "last_month": {
        const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lmEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        from = lm.toISOString().split("T")[0];
        to = lmEnd.toISOString().split("T")[0];
        label = "Last Month";
        break;
      }
      case "1y": {
        from = `${now.getFullYear() - 1}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
        to = now.toISOString().split("T")[0];
        label = "Last Year";
        break;
      }
      default: {
        return null;
      }
    }
    return { from, to, label };
  }

  if (dateFrom && dateTo) {
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fromParts = dateFrom.split("-");
    const toParts = dateTo.split("-");
    const label = `${MONTHS[parseInt(fromParts[1], 10) - 1]} ${fromParts[2]}, ${fromParts[0]} — ${MONTHS[parseInt(toParts[1], 10) - 1]} ${toParts[2]}, ${toParts[0]}`;
    return { from: dateFrom, to: dateTo, label };
  }

  return null;
}

// ── GET /api/admin/dashboard ──────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const preset = searchParams.get("preset");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    const range = getDateRange(preset, dateFrom, dateTo);
    const dateClause = range ? `AND bill_date >= ? AND bill_date <= ?` : "";
    const dateValues = range ? [range.from, range.to] : [];
    const expClause = range ? `AND expense_date >= ? AND expense_date <= ?` : "";
    const expValues = range ? [range.from, range.to] : [];
    const inspClause = range ? `AND file_date >= ? AND file_date <= ?` : "";
    const inspValues = range ? [range.from, range.to] : [];

    // ── Main Tab ─────────────────────────────────────────────────────────────
    const billingEarnedRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(paid_amount), 0) AS val FROM bills WHERE payment_status IN ('paid', 'partial') ${dateClause}`,
      dateValues,
    );
    const billingEarned = Number(billingEarnedRows[0]?.val ?? 0);

    const inspectionEarnedRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(gross_amount), 0) AS val FROM inspection_files WHERE 1=1 ${inspClause}`,
      inspValues,
    );
    const inspectionEarned = Number(inspectionEarnedRows[0]?.val ?? 0);

    const generalIncomeRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE type = 'income' ${expClause}`,
      expValues,
    );
    const generalIncome = Number(generalIncomeRows[0]?.val ?? 0);

    const totalEarnings = billingEarned + inspectionEarned + generalIncome;

    const totalExpenseRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE type = 'expense' ${expClause}`,
      expValues,
    );
    const totalExpenses = Number(totalExpenseRows[0]?.val ?? 0);
    const netProfit = totalEarnings - totalExpenses;

    const pendingBillsRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(total_amount - paid_amount), 0) AS val FROM bills WHERE payment_status IN ('unpaid', 'partial')`,
    );
    const pendingInspRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(fees - amount), 0) AS val FROM inspection_files WHERE payment_status IN ('due', 'partially')`,
    );
    const pendingPayments = Number(pendingBillsRows[0]?.val ?? 0) + Number(pendingInspRows[0]?.val ?? 0);

    // Monthly data: last 6 months
    const now = new Date();
    const monthlyLabels: string[] = [];
    const monthlyEarningsData: number[] = [];
    const monthlyExpensesData: number[] = [];
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const nextMonthStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`;
      monthlyLabels.push(`${MONTHS[d.getMonth()]} ${d.getFullYear()}`);

      const bRows = await query<RowDataPacket[]>(
        `SELECT COALESCE(SUM(paid_amount), 0) AS val FROM bills WHERE payment_status IN ('paid', 'partial') AND bill_date >= ? AND bill_date < ?`,
        [`${monthStr}-01`, `${nextMonthStr}-01`],
      );
      const iRows = await query<RowDataPacket[]>(
        `SELECT COALESCE(SUM(gross_amount), 0) AS val FROM inspection_files WHERE file_date >= ? AND file_date < ?`,
        [`${monthStr}-01`, `${nextMonthStr}-01`],
      );
      const giRows = await query<RowDataPacket[]>(
        `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE type = 'income' AND expense_date >= ? AND expense_date < ?`,
        [`${monthStr}-01`, `${nextMonthStr}-01`],
      );
      const geRows = await query<RowDataPacket[]>(
        `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE type = 'expense' AND expense_date >= ? AND expense_date < ?`,
        [`${monthStr}-01`, `${nextMonthStr}-01`],
      );

      monthlyEarningsData.push(Number(bRows[0]?.val ?? 0) + Number(iRows[0]?.val ?? 0) + Number(giRows[0]?.val ?? 0));
      monthlyExpensesData.push(Number(geRows[0]?.val ?? 0));
    }

    const recentExpenses = await query<RowDataPacket[]>(
      `SELECT id, title, type, amount, expense_date, category FROM expenses ORDER BY expense_date DESC, created_at DESC LIMIT 5`,
    );

    const bizERows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(paid_amount), 0) AS val FROM bills WHERE payment_status IN ('paid', 'partial') ${dateClause}`,
      dateValues,
    );
    const biznexaEarnings = Number(bizERows[0]?.val ?? 0);

    const iEErows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(gross_amount), 0) AS val FROM inspection_files WHERE 1=1 ${inspClause}`,
      inspValues,
    );
    const inspEarnings = Number(iEErows[0]?.val ?? 0);

    const gIRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE type = 'income' ${expClause}`,
      expValues,
    );
    const genIncome = Number(gIRows[0]?.val ?? 0);

    const bERows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE category = 'biznexa' AND type = 'expense' ${expClause}`,
      expValues,
    );
    const biznexaExpenses = Number(bERows[0]?.val ?? 0);

    const iERows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE category = 'inspection' AND type = 'expense' ${expClause}`,
      expValues,
    );
    const inspectionExpenses = Number(iERows[0]?.val ?? 0);

    const gERows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE category = 'general' AND type = 'expense' ${expClause}`,
      expValues,
    );
    const generalExpenses = Number(gERows[0]?.val ?? 0);

    // ── BizNexa Tab ──────────────────────────────────────────────────────────
    const tbRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(total_amount), 0) AS val, COUNT(*) AS cnt, COALESCE(SUM(paid_amount), 0) AS paid FROM bills`,
    );
    const totalBilled = Number(tbRows[0]?.val ?? 0);
    const totalBillsCount = Number(tbRows[0]?.cnt ?? 0);
    const paidAmount = Number(tbRows[0]?.paid ?? 0);
    const unpaidAmount = totalBilled - paidAmount;

    const bzExpRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE category = 'biznexa' AND type = 'expense'`,
    );
    const biznexaTabExpenses = Number(bzExpRows[0]?.val ?? 0);
    const biznexaNetProfit = paidAmount - biznexaTabExpenses;

    const recentBills = await query<RowDataPacket[]>(
      `SELECT b.id, b.bill_number, b.total_amount, b.status, b.payment_status, b.bill_date, c.name AS client_name
       FROM bills b LEFT JOIN clients c ON c.id = b.client_id ORDER BY b.created_at DESC LIMIT 5`,
    );

    // ── Inspection Tab ───────────────────────────────────────────────────────
    const itRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(fees), 0) AS total_fees, COALESCE(SUM(gross_amount), 0) AS total_earnings, COUNT(*) AS total_files FROM inspection_files`,
    );
    const totalFees = Number(itRows[0]?.total_fees ?? 0);
    const totalInspEarnings = Number(itRows[0]?.total_earnings ?? 0);
    const totalFiles = Number(itRows[0]?.total_files ?? 0);

    const ipRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(fees - amount), 0) AS val FROM inspection_files WHERE payment_status IN ('due', 'partially')`,
    );
    const pendingInspAmount = Number(ipRows[0]?.val ?? 0);

    const ixRows = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(amount), 0) AS val FROM expenses WHERE category = 'inspection' AND type = 'expense'`,
    );
    const inspTabExpenses = Number(ixRows[0]?.val ?? 0);
    const inspNetProfit = totalInspEarnings - inspTabExpenses;

    const recentFiles = await query<RowDataPacket[]>(
      `SELECT f.id, f.file_number, f.file_date, f.customer_name, f.file_type, f.commission, f.payment_status, f.fees, f.gross_amount, b.bank_name
       FROM inspection_files f LEFT JOIN inspection_banks b ON b.id = f.bank_id ORDER BY f.created_at DESC LIMIT 5`,
    );

    // ── General Tab ──────────────────────────────────────────────────────────
    const gtRows = await query<RowDataPacket[]>(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
         COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
         COUNT(*) AS total_records
       FROM expenses WHERE category = 'general'`,
    );
    const generalTotalIncome = Number(gtRows[0]?.total_income ?? 0);
    const generalTotalExpenses = Number(gtRows[0]?.total_expenses ?? 0);
    const generalNetBalance = generalTotalIncome - generalTotalExpenses;
    const generalTotalRecords = Number(gtRows[0]?.total_records ?? 0);

    const recentRecords = await query<RowDataPacket[]>(
      `SELECT id, title, type, amount, description, expense_date FROM expenses WHERE category = 'general' ORDER BY expense_date DESC, created_at DESC LIMIT 10`,
    );

    // ── Admin user ───────────────────────────────────────────────────────────
    const adminRows = await query<RowDataPacket[]>(
      `SELECT full_name FROM admin_users WHERE status = 'active' ORDER BY id ASC LIMIT 1`,
    );
    const adminName = (adminRows[0]?.full_name as string) ?? "Admin";

    return NextResponse.json({
      adminName,
      filterLabel: range?.label ?? "",
      mainData: {
        billingEarned,
        inspectionEarned,
        generalIncome,
        totalEarnings,
        totalExpenses,
        netProfit,
        pendingPayments,
        monthlyLabels,
        monthlyEarnings: monthlyEarningsData,
        monthlyExpenses: monthlyExpensesData,
        recentExpenses,
        biznexaEarnings,
        inspEarnings,
        genIncome,
        biznexaExpenses,
        inspectionExpenses,
        generalExpenses,
      },
      biznexaData: {
        totalBilled,
        paidAmount,
        unpaidAmount,
        totalBills: totalBillsCount,
        totalExpenses: biznexaTabExpenses,
        netProfit: biznexaNetProfit,
        recentBills,
      },
      inspTabData: {
        totalFees,
        totalEarnings: totalInspEarnings,
        pendingAmount: pendingInspAmount,
        totalFiles,
        totalExpenses: inspTabExpenses,
        netProfit: inspNetProfit,
        recentFiles,
      },
      generalTabData: {
        totalIncome: generalTotalIncome,
        totalExpenses: generalTotalExpenses,
        netBalance: generalNetBalance,
        totalRecords: generalTotalRecords,
        recentRecords,
      },
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Failed to load dashboard data." }, { status: 500 });
  }
}
