'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
interface RecentExpense {
  id: number;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  expense_date: string;
  category: string;
}

interface RecentBill {
  id: number;
  bill_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  bill_date: string;
  client_name: string | null;
}

interface RecentFile {
  id: number;
  file_number: string;
  file_date: string | null;
  customer_name: string | null;
  file_type: string | null;
  commission: number;
  payment_status: string | null;
  fees: number | null;
  gross_amount: number;
  bank_name: string | null;
}

interface RecentRecord {
  id: number;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  description: string | null;
  expense_date: string;
}

interface DashboardData {
  adminName: string;
  filterLabel: string;
  mainData: {
    billingEarned: number;
    inspectionEarned: number;
    generalIncome: number;
    totalEarnings: number;
    totalExpenses: number;
    netProfit: number;
    pendingPayments: number;
    monthlyLabels: string[];
    monthlyEarnings: number[];
    monthlyExpenses: number[];
    recentExpenses: RecentExpense[];
    biznexaEarnings: number;
    inspEarnings: number;
    genIncome: number;
    biznexaExpenses: number;
    inspectionExpenses: number;
    generalExpenses: number;
  };
  biznexaData: {
    totalBilled: number;
    paidAmount: number;
    unpaidAmount: number;
    totalBills: number;
    totalExpenses: number;
    netProfit: number;
    recentBills: RecentBill[];
  };
  inspTabData: {
    totalFees: number;
    totalEarnings: number;
    pendingAmount: number;
    totalFiles: number;
    totalExpenses: number;
    netProfit: number;
    recentFiles: RecentFile[];
  };
  generalTabData: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    totalRecords: number;
    recentRecords: RecentRecord[];
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtMoney(v: number): string {
  return `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtMoneyShort(v: number): string {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v.toFixed(0)}`;
}

function fmtDate(v: string | null): string {
  if (!v) return '—';
  const datePart = v.split('T')[0];
  const parts = datePart.split('-').map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return v;
  return `${MONTHS[m - 1]} ${String(d).padStart(2, '0')}, ${y}`;
}

const TABS = [
  { id: 'main', label: 'Main Dashboard', icon: 'space_dashboard' },
  { id: 'biznexa', label: 'BizNexa Agency', icon: 'business' },
  { id: 'inspection', label: 'Inspection', icon: 'verified' },
  { id: 'general', label: 'General', icon: 'account_balance_wallet' },
] as const;

const PRESETS = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '60d', label: 'Last 60 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: '1y', label: 'Last Year' },
] as const;

// ── Stat Card Component ────────────────────────────────────────────────────────
function StatCard({ icon, iconColor, iconBg, label, value, valueColor = 'text-white', subtitle, accentGradient }: {
  icon: string; iconColor: string; iconBg: string;
  label: string; value: string; valueColor?: string;
  subtitle?: string; accentGradient?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20">
      {/* Subtle accent glow */}
      {accentGradient && (
        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.07] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.15] ${accentGradient}`} />
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ring-1 ring-white/[0.06]`}>
            <span className={`material-symbols-outlined text-xl ${iconColor}`}>{icon}</span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        </div>
        <div className={`text-[1.625rem] font-bold tracking-tight leading-none ${valueColor}`}>{value}</div>
        {subtitle && <div className="text-[11px] text-slate-500 mt-2">{subtitle}</div>}
      </div>
    </div>
  );
}

// ── Bar Chart Component ────────────────────────────────────────────────────────
function BarChart({ labels, earnings, expenses }: { labels: string[]; earnings: number[]; expenses: number[] }) {
  const maxVal = Math.max(...earnings, ...expenses, 1);
  // Create 4 horizontal grid lines
  const gridValues = [0.25, 0.5, 0.75, 1].map(f => maxVal * f);

  return (
    <div className="relative">
      {/* Y-axis grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-2">
        {gridValues.reverse().map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[9px] text-slate-600 w-10 text-right shrink-0 tabular-nums">{fmtMoneyShort(val)}</span>
            <div className="flex-1 border-b border-dashed border-white/[0.04]" />
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-600 w-10 text-right shrink-0">₹0</span>
          <div className="flex-1 border-b border-white/[0.06]" />
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-2 sm:gap-3 h-56 pl-12 pt-2 pb-8 relative z-10">
        {labels.map((label, i) => {
          const earnH = Math.max((earnings[i] / maxVal) * 100, 1.5);
          const expH = Math.max((expenses[i] / maxVal) * 100, 1.5);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end min-w-0">
              <div className="flex gap-[3px] items-end w-full justify-center h-full">
                <div className="group relative w-2/5 max-w-5 transition-all duration-300">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80 hover:opacity-100 transition-all duration-200 cursor-default"
                    style={{ height: `${earnH}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10">
                    {fmtMoneyShort(earnings[i])}
                  </div>
                </div>
                <div className="group relative w-2/5 max-w-5 transition-all duration-300">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-rose-600 to-rose-400 opacity-80 hover:opacity-100 transition-all duration-200 cursor-default"
                    style={{ height: `${expH}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-rose-400 text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10">
                    {fmtMoneyShort(expenses[i])}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-medium truncate w-full text-center">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-emerald-600 to-emerald-400" />
          <span className="text-[11px] text-slate-400 font-medium">Earnings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-rose-600 to-rose-400" />
          <span className="text-[11px] text-slate-400 font-medium">Expenses</span>
        </div>
      </div>
    </div>
  );
}

// ── Breakdown Row ──────────────────────────────────────────────────────────────
function BreakdownRow({ label, amount, total, color, isExpense }: {
  label: string; amount: number; total: number; color: string; isExpense?: boolean;
}) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className={`font-semibold tabular-nums ${isExpense ? 'text-rose-400' : 'text-white'}`}>{fmtMoney(amount)}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.max(pct, 1)}%` }} />
      </div>
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────────────────────────
function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

// ── Inner component ───────────────────────────────────────────────────────────
function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main');

  const [preset, setPreset] = useState(searchParams.get('preset') ?? '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') ?? '');
  const [dateTo, setDateTo] = useState(searchParams.get('date_to') ?? '');

  const hasFilter = preset !== '' || (dateFrom !== '' && dateTo !== '');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const tabFromHash = TABS.find(t => t.id === hash)?.id;
    const tabFromQuery = searchParams.get('tab');
    if (tabFromHash) setActiveTab(tabFromHash);
    else if (tabFromQuery && TABS.find(t => t.id === tabFromQuery)) setActiveTab(tabFromQuery);
  }, [searchParams]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (preset) qs.set('preset', preset);
      if (dateFrom) qs.set('date_from', dateFrom);
      if (dateTo) qs.set('date_to', dateTo);
      const res = await fetch(`/api/admin/dashboard?${qs.toString()}`);
      const json = await res.json();
      setData(json);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [preset, dateFrom, dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function switchTab(name: string) {
    setActiveTab(name);
    window.location.hash = name;
  }

  function applyDateFilter(e: React.FormEvent) {
    e.preventDefault();
    setPreset('');
    const qs = new URLSearchParams();
    if (dateFrom) qs.set('date_from', dateFrom);
    if (dateTo) qs.set('date_to', dateTo);
    if (activeTab !== 'main') qs.set('tab', activeTab);
    router.push(`/admin?${qs.toString()}${activeTab !== 'main' ? `#${activeTab}` : ''}`);
  }

  function clearFilter() {
    setPreset('');
    setDateFrom('');
    setDateTo('');
    router.push(`/admin${activeTab !== 'main' ? `#${activeTab}` : ''}`);
  }

  function handlePresetClick(p: string) {
    setPreset(p);
    setDateFrom('');
    setDateTo('');
    const qs = new URLSearchParams();
    qs.set('preset', p);
    if (activeTab !== 'main') qs.set('tab', activeTab);
    router.push(`/admin?${qs.toString()}${activeTab !== 'main' ? `#${activeTab}` : ''}`);
  }

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin" />
        <span className="text-sm text-slate-500 font-medium">Loading dashboard…</span>
      </div>
    );
  }

  return (
    <>
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <header className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Welcome back, <span className="text-white font-medium">{data.adminName}</span>!</p>
      </header>

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 mb-6 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/15 text-cyan-400 shadow-inner shadow-cyan-500/10 ring-1 ring-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Date Filter Bar ────────────────────────────────────────────────── */}
      <SectionCard className="p-4 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => handlePresetClick(p.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  preset === p.id
                    ? 'text-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block w-px h-6 bg-white/[0.08]" />

          {/* Custom date range */}
          <form onSubmit={applyDateFilter} className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all w-auto"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
            />
            <span className="text-slate-500 text-xs font-medium">to</span>
            <input
              type="date"
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all w-auto"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
            />
            <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1.5 rounded-lg text-xs font-bold text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200 active:scale-95">
              Apply
            </button>
          </form>
        </div>

        {/* Active filter indicator */}
        {hasFilter && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.05]">
            <span className="material-symbols-outlined text-sm text-cyan-400">filter_alt</span>
            {data.filterLabel && (
              <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full ring-1 ring-cyan-500/20">
                {data.filterLabel}
              </span>
            )}
            {dateFrom && dateTo && !preset && (
              <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full ring-1 ring-cyan-500/20">
                {fmtDate(dateFrom)} — {fmtDate(dateTo)}
              </span>
            )}
            <button onClick={clearFilter} className="text-xs font-medium text-rose-400 hover:text-rose-300 transition flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">close</span>
              Clear
            </button>
          </div>
        )}
      </SectionCard>

      {/* ══ MAIN TAB ══════════════════════════════════════════════════════════ */}
      {activeTab === 'main' && (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon="trending_up" iconColor="text-emerald-400" iconBg="bg-emerald-500/10"
              label="Total Earnings" value={fmtMoney(data.mainData.totalEarnings)}
              accentGradient="bg-emerald-500"
              subtitle={data.filterLabel || undefined}
            />
            <StatCard
              icon="trending_down" iconColor="text-rose-400" iconBg="bg-rose-500/10"
              label="Total Expenses" value={fmtMoney(data.mainData.totalExpenses)}
              accentGradient="bg-rose-500"
              subtitle={data.filterLabel || undefined}
            />
            <StatCard
              icon="account_balance" iconColor={data.mainData.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
              iconBg={data.mainData.netProfit >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}
              label="Net Profit" value={fmtMoney(data.mainData.netProfit)}
              valueColor={data.mainData.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
              accentGradient={data.mainData.netProfit >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}
            />
            <StatCard
              icon="schedule" iconColor="text-amber-400" iconBg="bg-amber-500/10"
              label="Pending" value={fmtMoney(data.mainData.pendingPayments)}
              accentGradient="bg-amber-500"
              subtitle="Bills + Inspection due"
            />
          </div>

          {/* Chart + Recent Records */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SectionCard className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-lg">bar_chart</span>
                  Earnings vs Expenses
                </h3>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Last 6 Months</span>
              </div>
              <BarChart labels={data.mainData.monthlyLabels} earnings={data.mainData.monthlyEarnings} expenses={data.mainData.monthlyExpenses} />
            </SectionCard>

            <SectionCard className="overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-white/[0.06] flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-lg">receipt</span>
                  Recent Records
                </h3>
                <Link href="/admin/expenses" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-wider transition">View All</Link>
              </div>
              <div className="divide-y divide-white/[0.04] flex-1 overflow-y-auto">
                {data.mainData.recentExpenses.length === 0 ? (
                  <div className="px-5 py-12 text-center text-slate-500 text-xs">
                    <span className="material-symbols-outlined text-3xl text-slate-700 mb-2 block">inbox</span>
                    No records yet
                  </div>
                ) : (
                  data.mainData.recentExpenses.map(exp => (
                    <div key={exp.id} className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.02] transition-colors group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${exp.type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                          <span className={`material-symbols-outlined text-sm ${exp.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {exp.type === 'income' ? 'arrow_downward' : 'arrow_upward'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">{exp.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{fmtDate(exp.expense_date)} · <span className="uppercase">{exp.category}</span></div>
                        </div>
                      </div>
                      <div className={`text-sm font-bold tabular-nums shrink-0 ml-3 ${exp.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {exp.type === 'income' ? '+' : '−'}{fmtMoney(Number(exp.amount))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          </div>

          {/* Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-emerald-400 text-lg">pie_chart</span>
                <h3 className="text-sm font-bold text-white">Earnings Breakdown</h3>
              </div>
              <div className="space-y-4">
                <BreakdownRow label="BizNexa Agency" amount={data.mainData.biznexaEarnings} total={data.mainData.totalEarnings} color="bg-gradient-to-r from-cyan-500 to-blue-500" />
                <BreakdownRow label="Inspection" amount={data.mainData.inspEarnings} total={data.mainData.totalEarnings} color="bg-gradient-to-r from-violet-500 to-purple-500" />
                <BreakdownRow label="General Income" amount={data.mainData.genIncome} total={data.mainData.totalEarnings} color="bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="flex justify-between text-sm pt-4 border-t border-white/[0.06]">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-bold tabular-nums">{fmtMoney(data.mainData.totalEarnings)}</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-rose-400 text-lg">donut_small</span>
                <h3 className="text-sm font-bold text-white">Expense Breakdown</h3>
              </div>
              <div className="space-y-4">
                <BreakdownRow label="BizNexa" amount={data.mainData.biznexaExpenses} total={data.mainData.totalExpenses} color="bg-gradient-to-r from-rose-500 to-pink-500" isExpense />
                <BreakdownRow label="Inspection" amount={data.mainData.inspectionExpenses} total={data.mainData.totalExpenses} color="bg-gradient-to-r from-orange-500 to-amber-500" isExpense />
                <BreakdownRow label="General" amount={data.mainData.generalExpenses} total={data.mainData.totalExpenses} color="bg-gradient-to-r from-red-500 to-rose-500" isExpense />
                <div className="flex justify-between text-sm pt-4 border-t border-white/[0.06]">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-rose-400 font-bold tabular-nums">{fmtMoney(data.mainData.totalExpenses)}</span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* ══ BIZNEXA TAB ═══════════════════════════════════════════════════════ */}
      {activeTab === 'biznexa' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="request_quote" iconColor="text-cyan-400" iconBg="bg-cyan-500/10" label="Total Billed" value={fmtMoney(data.biznexaData.totalBilled)} accentGradient="bg-cyan-500" />
            <StatCard icon="check_circle" iconColor="text-emerald-400" iconBg="bg-emerald-500/10" label="Paid Amount" value={fmtMoney(data.biznexaData.paidAmount)} valueColor="text-emerald-400" accentGradient="bg-emerald-500" />
            <StatCard icon="pending" iconColor="text-rose-400" iconBg="bg-rose-500/10" label="Unpaid Amount" value={fmtMoney(data.biznexaData.unpaidAmount)} valueColor="text-rose-400" accentGradient="bg-rose-500" />
            <StatCard icon="description" iconColor="text-blue-400" iconBg="bg-blue-500/10" label="Total Bills" value={String(data.biznexaData.totalBills)} accentGradient="bg-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profit highlight */}
            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.08] via-blue-500/[0.04] to-transparent p-6">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500 rounded-full opacity-[0.04] blur-3xl" />
              <div className="relative z-10">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 mb-2">BizNexa Profit</div>
                <div className={`text-3xl font-bold tracking-tight ${data.biznexaData.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{fmtMoney(data.biznexaData.netProfit)}</div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Paid − Expenses
                </div>
              </div>
            </div>

            <SectionCard className="p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">BizNexa Expenses</div>
              <div className="text-2xl font-bold text-rose-400 tracking-tight">{fmtMoney(data.biznexaData.totalExpenses)}</div>
              <Link href="/admin/expenses?category=biznexa" className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium mt-3 transition group">
                View All <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </Link>
            </SectionCard>

            <SectionCard className="p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Quick Actions</div>
              <div className="space-y-2">
                <Link href="/admin/bills?action=new" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold py-2.5 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-[0.98]">
                  <span className="material-symbols-outlined text-sm">add</span> New Bill
                </Link>
                <Link href="/admin/clients" className="flex items-center justify-center gap-2 w-full border border-white/[0.08] text-slate-300 text-xs font-bold py-2.5 rounded-xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                  <span className="material-symbols-outlined text-sm">group</span> Manage Clients
                </Link>
                <Link href="/admin/expenses" className="flex items-center justify-center gap-2 w-full border border-white/[0.08] text-slate-300 text-xs font-bold py-2.5 rounded-xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                  <span className="material-symbols-outlined text-sm">add_card</span> Add Expense
                </Link>
              </div>
            </SectionCard>
          </div>

          {/* Recent Bills Table */}
          <SectionCard className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-lg">receipt_long</span>
                Recent Bills
              </h3>
              <Link href="/admin/bills" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-wider transition">View All</Link>
            </div>
            {data.biznexaData.recentBills.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500 text-xs">
                <span className="material-symbols-outlined text-3xl text-slate-700 mb-2 block">inbox</span>
                No bills yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 border-b border-white/[0.04]">
                      <th className="text-left px-6 py-3">Bill #</th>
                      <th className="text-left px-6 py-3">Client</th>
                      <th className="text-right px-6 py-3">Amount</th>
                      <th className="text-center px-6 py-3">Status</th>
                      <th className="text-center px-6 py-3">Payment</th>
                      <th className="text-left px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.biznexaData.recentBills.map(bill => (
                      <tr key={bill.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] group transition">
                        <td className="px-6 py-3.5 text-sm font-mono text-cyan-400 font-semibold">{bill.bill_number}</td>
                        <td className="px-6 py-3.5 text-sm text-slate-200">{bill.client_name || '—'}</td>
                        <td className="px-6 py-3.5 text-sm text-white font-semibold text-right tabular-nums">{fmtMoney(Number(bill.total_amount))}</td>
                        <td className="px-6 py-3.5 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            bill.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' :
                            bill.status === 'sent' ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20' :
                            'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20'
                          }`}>{bill.status}</span>
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            bill.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' :
                            bill.payment_status === 'partial' ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
                          }`}>{bill.payment_status}</span>
                        </td>
                        <td className="px-6 py-3.5 text-sm text-slate-400">{fmtDate(bill.bill_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* ══ INSPECTION TAB ════════════════════════════════════════════════════ */}
      {activeTab === 'inspection' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="engineering" iconColor="text-violet-400" iconBg="bg-violet-500/10" label="Total Fees Worked" value={fmtMoney(data.inspTabData.totalFees)} accentGradient="bg-violet-500" />
            <StatCard icon="savings" iconColor="text-emerald-400" iconBg="bg-emerald-500/10" label="Total Earnings" value={fmtMoney(data.inspTabData.totalEarnings)} valueColor="text-emerald-400" accentGradient="bg-emerald-500" />
            <StatCard icon="hourglass_top" iconColor="text-rose-400" iconBg="bg-rose-500/10" label="Pending Amount" value={fmtMoney(data.inspTabData.pendingAmount)} valueColor="text-rose-400" accentGradient="bg-rose-500" />
            <StatCard icon="folder_open" iconColor="text-blue-400" iconBg="bg-blue-500/10" label="Total Files" value={String(data.inspTabData.totalFiles)} accentGradient="bg-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-orange-500/[0.04] to-transparent p-6">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500 rounded-full opacity-[0.04] blur-3xl" />
              <div className="relative z-10">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-2">Inspection Profit</div>
                <div className={`text-3xl font-bold tracking-tight ${data.inspTabData.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{fmtMoney(data.inspTabData.netProfit)}</div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Earned − Expenses
                </div>
              </div>
            </div>

            <SectionCard className="p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Inspection Expenses</div>
              <div className="text-2xl font-bold text-rose-400 tracking-tight">{fmtMoney(data.inspTabData.totalExpenses)}</div>
              <Link href="/admin/expenses?category=inspection" className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium mt-3 transition group">
                View All <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </Link>
            </SectionCard>

            <SectionCard className="p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Quick Actions</div>
              <div className="space-y-2">
                <Link href="/admin/inspections/files?action=new" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold py-2.5 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98]">
                  <span className="material-symbols-outlined text-sm">add</span> New File
                </Link>
                <Link href="/admin/inspections/dashboard" className="flex items-center justify-center gap-2 w-full border border-white/[0.08] text-slate-300 text-xs font-bold py-2.5 rounded-xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                  <span className="material-symbols-outlined text-sm">space_dashboard</span> Full Dashboard
                </Link>
                <Link href="/admin/expenses" className="flex items-center justify-center gap-2 w-full border border-white/[0.08] text-slate-300 text-xs font-bold py-2.5 rounded-xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                  <span className="material-symbols-outlined text-sm">add_card</span> Add Expense
                </Link>
              </div>
            </SectionCard>
          </div>

          {/* Recent Files Table */}
          <SectionCard className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-lg">folder_special</span>
                Recent Inspection Files
              </h3>
              <Link href="/admin/inspections/files" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-wider transition">View All</Link>
            </div>
            {data.inspTabData.recentFiles.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500 text-xs">
                <span className="material-symbols-outlined text-3xl text-slate-700 mb-2 block">inbox</span>
                No files yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 border-b border-white/[0.04]">
                      <th className="text-left px-6 py-3">File #</th>
                      <th className="text-left px-6 py-3">Date</th>
                      <th className="text-left px-6 py-3">Customer</th>
                      <th className="text-left px-6 py-3">Bank</th>
                      <th className="text-center px-6 py-3">Type</th>
                      <th className="text-right px-6 py-3">Commission</th>
                      <th className="text-center px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.inspTabData.recentFiles.map(file => (
                      <tr key={file.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                        <td className="px-6 py-3.5 text-sm font-mono text-cyan-400 font-semibold">{file.file_number}</td>
                        <td className="px-6 py-3.5 text-sm text-slate-400">{fmtDate(file.file_date)}</td>
                        <td className="px-6 py-3.5 text-sm text-slate-200">{file.customer_name || '—'}</td>
                        <td className="px-6 py-3.5 text-sm text-slate-400">{file.bank_name || '—'}</td>
                        <td className="px-6 py-3.5 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            file.file_type === 'office' ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20' :
                            'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20'
                          }`}>{file.file_type || '—'}</span>
                        </td>
                        <td className="px-6 py-3.5 text-sm text-white font-semibold text-right tabular-nums">{fmtMoney(Number(file.commission))}</td>
                        <td className="px-6 py-3.5 text-center">
                          {file.file_type === 'office' ? (
                            <span className="text-[10px] text-slate-500 font-medium">N/A</span>
                          ) : (
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              file.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' :
                              file.payment_status === 'partially' ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
                            }`}>{file.payment_status || '—'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* ══ GENERAL TAB ═══════════════════════════════════════════════════════ */}
      {activeTab === 'general' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="savings" iconColor="text-emerald-400" iconBg="bg-emerald-500/10" label="Total Income" value={fmtMoney(data.generalTabData.totalIncome)} valueColor="text-emerald-400" accentGradient="bg-emerald-500" />
            <StatCard icon="money_off" iconColor="text-rose-400" iconBg="bg-rose-500/10" label="Total Expenses" value={fmtMoney(data.generalTabData.totalExpenses)} valueColor="text-rose-400" accentGradient="bg-rose-500" />
            <StatCard
              icon="balance" iconColor={data.generalTabData.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}
              iconBg={data.generalTabData.netBalance >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}
              label="Net Balance" value={fmtMoney(data.generalTabData.netBalance)}
              valueColor={data.generalTabData.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}
              accentGradient={data.generalTabData.netBalance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}
            />
            <StatCard icon="format_list_numbered" iconColor="text-violet-400" iconBg="bg-violet-500/10" label="Total Records" value={String(data.generalTabData.totalRecords)} accentGradient="bg-violet-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.08] via-purple-500/[0.04] to-transparent p-6">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-violet-500 rounded-full opacity-[0.04] blur-3xl" />
              <div className="relative z-10">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-400 mb-2">General Balance</div>
                <div className={`text-3xl font-bold tracking-tight ${data.generalTabData.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{fmtMoney(data.generalTabData.netBalance)}</div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Income − Expenses
                </div>
              </div>
            </div>

            <SectionCard className="p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Quick Actions</div>
              <div className="space-y-2">
                <Link href="/admin/expenses?category=general" className="flex items-center justify-center gap-2 w-full border border-white/[0.08] text-slate-300 text-xs font-bold py-2.5 rounded-xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                  <span className="material-symbols-outlined text-sm">list_alt</span> All General Records
                </Link>
                <Link href="/admin/expenses?category=general&type=income" className="flex items-center justify-center gap-2 w-full border border-white/[0.08] text-slate-300 text-xs font-bold py-2.5 rounded-xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                  <span className="material-symbols-outlined text-sm">trending_up</span> View Income
                </Link>
                <Link href="/admin/expenses?category=general&type=expense" className="flex items-center justify-center gap-2 w-full border border-white/[0.08] text-slate-300 text-xs font-bold py-2.5 rounded-xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all">
                  <span className="material-symbols-outlined text-sm">trending_down</span> View Expenses
                </Link>
              </div>
            </SectionCard>

            <SectionCard className="p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Add New</div>
              <Link href="/admin/expenses" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined text-sm">add</span> Add Record
              </Link>
            </SectionCard>
          </div>

          {/* Recent Records Table */}
          <SectionCard className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-violet-400 text-lg">history</span>
                Recent General Records
              </h3>
              <Link href="/admin/expenses?category=general" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-wider transition">View All</Link>
            </div>
            {data.generalTabData.recentRecords.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500 text-xs">
                <span className="material-symbols-outlined text-3xl text-slate-700 mb-2 block">inbox</span>
                No records yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 border-b border-white/[0.04]">
                      <th className="text-left px-6 py-3">Date</th>
                      <th className="text-left px-6 py-3">Title</th>
                      <th className="text-center px-6 py-3">Type</th>
                      <th className="text-right px-6 py-3">Amount</th>
                      <th className="text-left px-6 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.generalTabData.recentRecords.map(rec => (
                      <tr key={rec.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                        <td className="px-6 py-3.5 text-sm text-slate-400">{fmtDate(rec.expense_date)}</td>
                        <td className="px-6 py-3.5 text-sm text-slate-200 font-semibold">{rec.title}</td>
                        <td className="px-6 py-3.5 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            rec.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
                          }`}>{rec.type}</span>
                        </td>
                        <td className={`px-6 py-3.5 text-sm font-semibold text-right tabular-nums ${rec.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {rec.type === 'income' ? '+' : '−'}{fmtMoney(Number(rec.amount))}
                        </td>
                        <td className="px-6 py-3.5 text-xs text-slate-500 max-w-[200px] truncate">{rec.description || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin" />
        <span className="text-sm text-slate-500 font-medium">Loading dashboard…</span>
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}
