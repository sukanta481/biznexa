'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Stats {
    total_fees: number;
    office_earned: number;
    expenditure: number;
    pending_amount: number;
    total_files: number;
    total_earnings: number;
    pending_payments: number;
    total_paid: number;
    pending_office: number;
}
interface ChartMonth { month: number; income: number; expenditure: number; }
interface SourceRow { source_name: string; file_count: number; total_earnings: number; }
interface RecentFile {
    file_number: string;
    file_date: string;
    customer_name: string | null;
    file_type: string;
    commission: number;
    payment_status: string | null;
    bank_name: string | null;
}
interface DashData {
    stats: Stats;
    chartData: ChartMonth[];
    chartYear: number;
    sources: SourceRow[];
    recentFiles: RecentFile[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtMoney(v: number) {
    return `₹${Math.round(v).toLocaleString('en-IN')}`;
}

function fmtDate(val: string | null): string {
    if (!val) return '—';
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return `${String(d.getDate()).padStart(2, '0')} ${MONTH_NAMES[d.getMonth()]}`;
}

function buildYearOptions() {
    const cur = new Date().getFullYear();
    const opts = [{ value: '', label: 'All Years' }];
    for (let y = cur + 1; y >= 2020; y--) opts.push({ value: String(y), label: String(y) });
    return opts;
}
const YEAR_OPTIONS = buildYearOptions();

const MONTH_OPTIONS = [
    { value: '', label: 'All Months' },
    ...MONTH_NAMES.map((m, i) => ({ value: String(i + 1).padStart(2, '0'), label: m })),
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function InspectionDashboard() {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [fileType, setFileType] = useState('');
    const [dateBasis, setDateBasis] = useState('file');
    const [sort, setSort] = useState('newest');

    const [data, setData] = useState<DashData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async (m: string, y: string, ft: string, db: string, s: string) => {
        setLoading(true);
        try {
            const p = new URLSearchParams();
            if (m) p.set('month', m);
            if (y) p.set('year', y);
            if (ft) p.set('file_type', ft);
            p.set('date_basis', db);
            p.set('sort', s);
            const res = await fetch(`/api/admin/inspection/dashboard?${p}`);
            if (res.ok) setData(await res.json());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(month, year, fileType, dateBasis, sort); }, [month, year, fileType, dateBasis, sort, fetchData]);

    const hasDateFilter = !!(month && year);
    const subtitle = hasDateFilter
        ? `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year} Overview`
        : 'All Time Overview';

    const chartData = data?.chartData ?? [];
    const maxVal = Math.max(...chartData.map(c => Math.max(c.income, c.expenditure)), 1);

    const stats = data?.stats;

    function filesHref(extra?: Record<string, string>) {
        const p = new URLSearchParams();
        // Pass date range as dateFrom/dateTo for the files page filter
        if (month && year) {
            const m = parseInt(month, 10);
            const y = parseInt(year, 10);
            const lastDay = new Date(y, m, 0).getDate();
            p.set('dateFrom', `${y}-${String(m).padStart(2, '0')}-01`);
            p.set('dateTo', `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
        }
        if (fileType) p.set('type', fileType);
        if (extra) Object.entries(extra).forEach(([k, v]) => p.set(k, v));
        return `/admin/inspections/files?${p}`;
    }

    function handleReset() {
        setMonth(''); setYear(''); setFileType(''); setDateBasis('file'); setSort('newest');
    }

    const Dash = () => <span className="text-slate-600">—</span>;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-bold font-headline text-on-surface cyber-glow-cyan tracking-tight uppercase">Inspection Dashboard</h2>
                        <p className="text-slate-400 font-body mt-1">{subtitle}</p>
                    </div>
                    <Link
                        href="/admin/inspections/files"
                        className="bg-primary hover:bg-primary/80 text-slate-950 font-label text-[11px] font-black px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all uppercase tracking-tighter shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-sm font-bold">add</span>
                        New File
                    </Link>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 bg-[#1e293b]/40 backdrop-blur-[8px] p-3 rounded-xl border border-white/5">
                    <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10">
                        <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                        <select value={month} onChange={e => setMonth(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-6 cursor-pointer uppercase tracking-wider outline-none">
                            {MONTH_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10">
                        <span className="material-symbols-outlined text-primary text-sm">event</span>
                        <select value={year} onChange={e => setYear(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-6 cursor-pointer uppercase tracking-wider outline-none">
                            {YEAR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10">
                        <span className="material-symbols-outlined text-primary text-sm">folder_open</span>
                        <select value={fileType} onChange={e => setFileType(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-6 cursor-pointer uppercase tracking-wider outline-none">
                            <option value="">All Types</option>
                            <option value="self">Self</option>
                            <option value="office">Office</option>
                        </select>
                    </div>
                    <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10">
                        <span className="material-symbols-outlined text-primary text-sm">date_range</span>
                        <select value={dateBasis} onChange={e => setDateBasis(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-6 cursor-pointer uppercase tracking-wider outline-none">
                            <option value="file">File Date</option>
                            <option value="updated">Updated Date</option>
                        </select>
                    </div>
                    <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10">
                        <span className="material-symbols-outlined text-primary text-sm">sort</span>
                        <select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-6 cursor-pointer uppercase tracking-wider outline-none">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                    <button
                        onClick={handleReset}
                        className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-xs font-label font-bold uppercase tracking-wider transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-sm">restart_alt</span>
                        Reset
                    </button>
                </div>
            </div>

            {/* ── 7 Stat Cards ────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* 1. Total Fees Worked */}
                <Link href={filesHref()} className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-secondary/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2.5 rounded-xl">receipt_long</span>
                        <span className="material-symbols-outlined text-slate-600 group-hover:text-secondary transition-colors text-lg">open_in_new</span>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Total Fees Worked</p>
                        <h3 className="text-2xl font-bold font-headline mt-1 text-white">{loading ? <Dash /> : fmtMoney(stats?.total_fees ?? 0)}</h3>
                    </div>
                </Link>

                {/* 2. Office Earned */}
                <Link href={filesHref({ type: 'self' })} className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-primary/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2.5 rounded-xl">account_balance</span>
                        <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-lg">open_in_new</span>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Office Earned</p>
                        <h3 className="text-2xl font-bold font-headline mt-1 text-white">{loading ? <Dash /> : fmtMoney(stats?.office_earned ?? 0)}</h3>
                    </div>
                </Link>

                {/* 3. Pending Amount */}
                <Link href={filesHref({ type: 'self', payment_status: 'pending_payment' })} className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-amber-400/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-amber-400 bg-amber-400/10 p-2.5 rounded-xl">hourglass_empty</span>
                        <span className="material-symbols-outlined text-slate-600 group-hover:text-amber-400 transition-colors text-lg">open_in_new</span>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Pending Amount</p>
                        <h3 className="text-2xl font-bold font-headline mt-1 text-amber-400">{loading ? <Dash /> : fmtMoney(stats?.pending_amount ?? 0)}</h3>
                    </div>
                </Link>

                {/* 4. Total Files — clickable */}
                <Link href={filesHref({ metric: 'total_files' })} className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-primary/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2.5 rounded-xl">folder_zip</span>
                        <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-lg">open_in_new</span>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Total Files</p>
                        <h3 className="text-3xl font-bold font-headline mt-1 text-white">{loading ? <Dash /> : (stats?.total_files ?? 0).toLocaleString()}</h3>
                    </div>
                </Link>

                {/* 5. Total Earnings — clickable */}
                <Link href={filesHref({ metric: 'total_earnings' })} className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-tertiary/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2.5 rounded-xl">payments</span>
                        <span className="material-symbols-outlined text-slate-600 group-hover:text-tertiary transition-colors text-lg">open_in_new</span>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Total Earnings</p>
                        <h3 className="text-2xl font-bold font-headline mt-1 text-tertiary">{loading ? <Dash /> : fmtMoney(stats?.total_earnings ?? 0)}</h3>
                    </div>
                </Link>

                {/* 6. Pending Payments — clickable */}
                <Link href={filesHref({ metric: 'pending_payments', status_group: 'pending' })} className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-rose-500/30 transition-all border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-rose-500 bg-rose-500/10 p-2.5 rounded-xl">pending_actions</span>
                        {!loading && (stats?.pending_payments ?? 0) > 0 && (
                            <span className="bg-rose-500 text-slate-950 text-[9px] font-black font-label px-2 py-0.5 rounded-full animate-pulse uppercase">Action Required</span>
                        )}
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Pending Payments</p>
                        <h3 className="text-3xl font-bold font-headline mt-1 text-white">{loading ? <Dash /> : (stats?.pending_payments ?? 0)}</h3>
                    </div>
                </Link>

                {/* 7. Total Paid */}
                <Link href={filesHref({ type: 'self', payment_status: 'paid' })} className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-tertiary/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2.5 rounded-xl">check_circle</span>
                        <span className="material-symbols-outlined text-slate-600 group-hover:text-tertiary transition-colors text-lg">open_in_new</span>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Total Paid</p>
                        <h3 className="text-2xl font-bold font-headline mt-1 text-tertiary">{loading ? <Dash /> : fmtMoney(stats?.total_paid ?? 0)}</h3>
                    </div>
                </Link>

                {/* 8. Pending Office */}
                <Link href={filesHref({ type: 'self', payment_status: 'paid', paid_to_office: 'due' })} className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-orange-400/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-orange-400 bg-orange-400/10 p-2.5 rounded-xl">account_balance</span>
                        {!loading && (stats?.pending_office ?? 0) > 0 && (
                            <span className="bg-orange-400/20 text-orange-400 border border-orange-400/30 text-[9px] font-black font-label px-2 py-0.5 rounded-full animate-pulse uppercase">Pending</span>
                        )}
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Pending Office</p>
                        <h3 className="text-2xl font-bold font-headline mt-1 text-orange-400">{loading ? <Dash /> : fmtMoney(stats?.pending_office ?? 0)}</h3>
                    </div>
                </Link>
            </div>

            {/* ── Scan Performance Metrics + Period Summary ────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Monthly Chart */}
                <div className="lg:col-span-2 bg-[#192540]/60 backdrop-blur-[16px] rounded-2xl p-8 space-y-8 border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h4 className="text-lg font-bold font-headline text-white uppercase">Scan Performance Metrics</h4>
                            <p className="text-xs text-slate-500 mt-1">
                                Monthly income &amp; expenditure — {data?.chartYear ?? new Date().getFullYear()}
                            </p>
                        </div>
                        <div className="flex gap-4 bg-white/5 p-2 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 px-2">
                                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00f2ff]"></span>
                                <span className="text-[10px] font-label font-bold text-slate-400 uppercase tracking-tighter">INCOME</span>
                            </div>
                            <div className="flex items-center gap-2 px-2 border-l border-white/10">
                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                <span className="text-[10px] font-label font-bold text-slate-400 uppercase tracking-tighter">EXPENDITURE</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 px-1 pb-4">
                        {MONTH_NAMES.map((mn, i) => {
                            const d = chartData[i] ?? { income: 0, expenditure: 0 };
                            const incH = maxVal > 0 ? Math.max((d.income / maxVal) * 100, d.income > 0 ? 3 : 0) : 0;
                            const expH = maxVal > 0 ? Math.max((d.expenditure / maxVal) * 100, d.expenditure > 0 ? 3 : 0) : 0;
                            return (
                                <div key={mn} className="flex-1 flex flex-col items-center gap-2 h-full min-w-0">
                                    <div className="w-full flex items-end gap-0.5 h-full">
                                        {/* Income bar */}
                                        <div
                                            className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-all relative group/inc"
                                            style={{ height: `${incH || 2}%`, opacity: d.income > 0 ? 1 : 0.3 }}
                                        >
                                            {d.income > 0 && (
                                                <div className="absolute inset-0 bg-primary rounded-t-sm shadow-[0_0_10px_rgba(0,242,255,0.15)]"></div>
                                            )}
                                            {d.income > 0 && (
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0f172a]/95 border border-primary/20 rounded px-2 py-1 text-[9px] font-bold text-primary opacity-0 group-hover/inc:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                    {fmtMoney(d.income)}
                                                </div>
                                            )}
                                        </div>
                                        {/* Expenditure bar */}
                                        <div
                                            className="flex-1 bg-secondary/20 hover:bg-secondary/40 rounded-t-sm transition-all relative group/exp"
                                            style={{ height: `${expH || 2}%`, opacity: d.expenditure > 0 ? 1 : 0.3 }}
                                        >
                                            {d.expenditure > 0 && (
                                                <div className="absolute inset-0 bg-secondary rounded-t-sm"></div>
                                            )}
                                            {d.expenditure > 0 && (
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0f172a]/95 border border-secondary/20 rounded px-2 py-1 text-[9px] font-bold text-secondary opacity-0 group-hover/exp:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                    {fmtMoney(d.expenditure)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-label text-slate-500 font-bold uppercase">{mn}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Period Summary */}
                <div className="bg-[#192540]/60 backdrop-blur-[16px] rounded-2xl p-6 flex flex-col border border-white/5 shadow-xl">
                    <h4 className="text-xs font-black font-headline uppercase tracking-[0.2em] text-white mb-6">Period Summary</h4>
                    <div className="space-y-5 flex-1">
                        <div>
                            <p className="text-[10px] text-slate-500 font-label uppercase tracking-widest mb-1">Total Income</p>
                            <p className="text-2xl font-bold font-headline text-primary cyber-glow-cyan">{loading ? '—' : fmtMoney(stats?.total_earnings ?? 0)}</p>
                        </div>
                        <div className="border-t border-white/5 pt-5">
                            <p className="text-[10px] text-slate-500 font-label uppercase tracking-widest mb-1">Expenditure</p>
                            <p className="text-2xl font-bold font-headline text-secondary">{loading ? '—' : fmtMoney(stats?.expenditure ?? 0)}</p>
                        </div>
                        <div className="border-t border-white/5 pt-5">
                            <p className="text-[10px] text-slate-500 font-label uppercase tracking-widest mb-1">Net Commission</p>
                            <p className="text-2xl font-bold font-headline text-tertiary">
                                {loading ? '—' : fmtMoney((stats?.total_earnings ?? 0) - (stats?.expenditure ?? 0))}
                            </p>
                        </div>
                        <div className="border-t border-white/5 pt-5">
                            <p className="text-[10px] text-slate-500 font-label uppercase tracking-widest mb-1">Pending Recovery</p>
                            <p className="text-xl font-bold font-headline text-amber-400">{loading ? '—' : fmtMoney(stats?.pending_amount ?? 0)}</p>
                        </div>
                        <div className="border-t border-white/5 pt-5">
                            <p className="text-[10px] text-slate-500 font-label uppercase tracking-widest mb-1">Total Fees Worked</p>
                            <p className="text-xl font-bold font-headline text-slate-300">{loading ? '—' : fmtMoney(stats?.total_fees ?? 0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Source Summary + Recent Files ────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Source-wise Summary (5/12) */}
                <div className="lg:col-span-5 bg-[#192540]/60 backdrop-blur-[16px] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                        <h4 className="text-xs font-black font-headline uppercase tracking-[0.2em] text-white">Source-wise Summary</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50">
                                    <th className="px-6 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">Source</th>
                                    <th className="px-6 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black text-center">Files</th>
                                    <th className="px-6 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black text-right">Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-10 text-center">
                                            <span className="material-symbols-outlined text-slate-600 text-3xl animate-spin">progress_activity</span>
                                        </td>
                                    </tr>
                                ) : (data?.sources?.length ?? 0) === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-10 text-center text-slate-500 text-xs font-label uppercase tracking-widest">No data for this period</td>
                                    </tr>
                                ) : (
                                    <>
                                        {data!.sources.map((src, i) => (
                                            <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                                                <td className="px-6 py-4 text-sm text-white font-medium">{src.source_name}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-[11px] font-bold">{src.file_count}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white font-medium text-right">{fmtMoney(src.total_earnings)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-white/[0.025] border-t-2 border-white/10">
                                            <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold">
                                                    {data!.sources.reduce((a, s) => a + s.file_count, 0)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-primary text-right">
                                                {fmtMoney(data!.sources.reduce((a, s) => a + s.total_earnings, 0))}
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Files (7/12) */}
                <div className="lg:col-span-7 bg-[#192540]/60 backdrop-blur-[16px] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <h4 className="text-xs font-black font-headline uppercase tracking-[0.2em] text-white">Recent Files</h4>
                        <Link href={filesHref()} className="text-primary text-[10px] font-bold hover:underline uppercase tracking-tighter">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[580px]">
                            <thead>
                                <tr className="bg-slate-900/50">
                                    <th className="px-5 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">File #</th>
                                    <th className="px-5 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">Date</th>
                                    <th className="px-5 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">Customer</th>
                                    <th className="px-5 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">Bank</th>
                                    <th className="px-5 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">Type</th>
                                    <th className="px-5 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black text-right">Commission</th>
                                    <th className="px-5 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center">
                                            <span className="material-symbols-outlined text-slate-600 text-3xl animate-spin">progress_activity</span>
                                        </td>
                                    </tr>
                                ) : (data?.recentFiles?.length ?? 0) === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-slate-500 text-xs font-label uppercase tracking-widest">No files for this period</td>
                                    </tr>
                                ) : (
                                    data!.recentFiles.map((f, i) => (
                                        <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                                            <td className="px-5 py-4 text-sm font-bold font-headline text-primary tracking-tight whitespace-nowrap">{f.file_number}</td>
                                            <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">{fmtDate(f.file_date)}</td>
                                            <td className="px-5 py-4 text-sm text-white max-w-[120px] truncate">{f.customer_name ?? '—'}</td>
                                            <td className="px-5 py-4 text-xs text-slate-500 max-w-[100px] truncate">{f.bank_name ?? '—'}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-0.5 text-[9px] font-black rounded border uppercase tracking-widest ${
                                                    f.file_type === 'self'
                                                        ? 'bg-primary/10 text-primary border-primary/20'
                                                        : 'bg-secondary/10 text-secondary border-secondary/20'
                                                }`}>
                                                    {f.file_type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-right font-medium text-white whitespace-nowrap">
                                                ₹{Math.round(f.commission).toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {f.file_type === 'office' ? (
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">NA</span>
                                                ) : f.payment_status === 'paid' ? (
                                                    <span className="px-2 py-0.5 text-[9px] font-black rounded border bg-tertiary/10 text-tertiary border-tertiary/20 uppercase tracking-widest">Paid</span>
                                                ) : f.payment_status === 'partially' ? (
                                                    <span className="px-2 py-0.5 text-[9px] font-black rounded border bg-amber-500/10 text-amber-400 border-amber-500/20 uppercase tracking-widest">Partial</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 text-[9px] font-black rounded border bg-rose-500/10 text-rose-500 border-rose-500/20 uppercase tracking-widest">Due</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {!loading && (data?.recentFiles?.length ?? 0) > 0 && (
                        <div className="p-5 border-t border-white/5 text-center">
                            <Link href={filesHref()} className="text-[10px] font-black text-slate-500 hover:text-primary transition-all tracking-[0.3em] uppercase">
                                View All Files
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
