'use client';

import { useState } from 'react';

export default function ExpensesManagement() {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [category, setCategory] = useState('All Categories');
    const [regionFilter, setRegionFilter] = useState('All Regions');
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    const resetFilters = () => {
        setDateRange('Last 30 Days');
        setCategory('All Categories');
        setRegionFilter('All Regions');
    };

    return (
        <section className="max-w-[1600px] mx-auto space-y-8">
            {/* Header Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-headline tracking-tight text-emerald-500 shadow-emerald-500/40 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">Expense Tracking</h2>
                    <p className="text-slate-400 font-body mt-1">Real-time fiscal monitoring and overhead management.</p>
                </div>
                <button onClick={() => alert('Record New Expense dialog would open here.')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-lg font-label font-bold text-[11px] uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                    Record New Expense
                </button>
            </div>

            {/* Metric Cards Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-2xl group relative overflow-hidden transition-all hover:-translate-y-1 hover:border-emerald-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                            <span className="material-symbols-outlined text-emerald-500">account_balance_wallet</span>
                        </div>
                        <span className="text-emerald-500 text-xs font-label font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">+2.4%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-label mb-1">Total Expenses</p>
                    <h3 className="text-2xl font-bold font-headline text-white">$142,850.00</h3>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-2xl group relative overflow-hidden transition-all hover:-translate-y-1 hover:border-secondary/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-secondary/10 rounded-xl">
                            <span className="material-symbols-outlined text-secondary">factory</span>
                        </div>
                        <span className="text-slate-400 text-xs font-label font-bold bg-white/5 px-2 py-0.5 rounded-full">Stable</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-label mb-1">Operating Costs</p>
                    <h3 className="text-2xl font-bold font-headline text-white">$58,200.45</h3>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-2xl group relative overflow-hidden transition-all hover:-translate-y-1 hover:border-rose-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                            <span className="material-symbols-outlined text-emerald-500">campaign</span>
                        </div>
                        <span className="text-rose-500 text-xs font-label font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">+12.8%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-label mb-1">Marketing Spend</p>
                    <h3 className="text-2xl font-bold font-headline text-white">$34,110.00</h3>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-2xl group relative overflow-hidden transition-all hover:-translate-y-1 hover:border-emerald-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                            <span className="material-symbols-outlined text-emerald-500">cloud_done</span>
                        </div>
                        <span className="text-emerald-500 text-xs font-label font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">-4.1%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-label mb-1">SaaS Subscriptions</p>
                    <h3 className="text-2xl font-bold font-headline text-white">$12,480.20</h3>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-[#1e293b]/60 backdrop-blur-[16px] border border-white/5 p-4 rounded-2xl flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 min-w-[200px] flex-1 hover:border-white/10 transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-sm text-emerald-500">calendar_today</span>
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-transparent border-none text-xs font-label font-bold text-white focus:ring-0 w-full cursor-pointer uppercase tracking-wider outline-none">
                        <option>Last 30 Days</option>
                        <option>Q3 FY2024</option>
                        <option>Custom Range</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 min-w-[200px] flex-1 hover:border-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm text-emerald-500">category</span>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent border-none text-xs font-label font-bold text-white focus:ring-0 w-full cursor-pointer uppercase tracking-wider outline-none">
                        <option>All Categories</option>
                        <option>Infrastructure</option>
                        <option>Marketing</option>
                        <option>Payroll</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 min-w-[200px] flex-1 hover:border-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm text-emerald-500">public</span>
                    <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="bg-transparent border-none text-xs font-label font-bold text-white focus:ring-0 w-full cursor-pointer uppercase tracking-wider outline-none">
                        <option>All Regions</option>
                        <option>North America</option>
                        <option>EMEA</option>
                        <option>APAC</option>
                    </select>
                </div>
                <button onClick={resetFilters} className="ml-auto w-full md:w-auto flex items-center justify-center gap-2 text-[10px] font-label font-bold text-slate-500 hover:text-emerald-500 transition-all uppercase tracking-[0.2em] group">
                    <span className="material-symbols-outlined text-[18px] group-hover:-rotate-180 transition-transform duration-500">restart_alt</span>
                    Reset Filters
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-[#1e293b]/60 backdrop-blur-[16px] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-label">Date</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-label">Description</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-label">Category</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-label">Amount</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-label">Method</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-label text-center">Status</th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Row 1 */}
                            <tr className="hover:bg-white/[0.03] transition-colors group">
                                <td className="px-6 py-5">
                                    <p className="text-sm font-semibold text-white">Oct 24, 2023</p>
                                    <p className="text-[10px] text-slate-500 font-label">14:20 PM</p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                            <span className="material-symbols-outlined text-[18px] text-emerald-500">cloud</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">AWS Cloud Infrastructure</p>
                                            <p className="text-[10px] text-slate-500 font-label">Invoice #INV-2023-990</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-[10px] font-bold font-label uppercase tracking-wider text-emerald-500 border border-emerald-500/20">Infrastructure</span>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-white">$12,450.00</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px] text-slate-500">credit_card</span>
                                        <span className="text-xs text-slate-400">Visa **** 9012</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase font-label text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Cleared
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => alert('Actions for: AWS Cloud Infrastructure ($12,450.00)')} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            {/* Row 2 */}
                            <tr className="hover:bg-white/[0.03] transition-colors group">
                                <td className="px-6 py-5">
                                    <p className="text-sm font-semibold text-white">Oct 22, 2023</p>
                                    <p className="text-[10px] text-slate-500 font-label">09:15 AM</p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                            <span className="material-symbols-outlined text-[18px] text-secondary">trending_up</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Global Ad Campaign Q4</p>
                                            <p className="text-[10px] text-slate-500 font-label">Google Ads Management</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-2.5 py-1 rounded-md bg-secondary/10 text-[10px] font-bold font-label uppercase tracking-wider text-secondary border border-secondary/20">Marketing</span>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-white">$8,900.00</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px] text-slate-500">account_balance</span>
                                        <span className="text-xs text-slate-400">Wire Transfer</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase font-label text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                        Pending
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => alert('Actions for: Global Ad Campaign Q4 ($8,900.00)')} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            {/* Row 3 */}
                            <tr className="hover:bg-white/[0.03] transition-colors group">
                                <td className="px-6 py-5">
                                    <p className="text-sm font-semibold text-white">Oct 20, 2023</p>
                                    <p className="text-[10px] text-slate-500 font-label">18:00 PM</p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                            <span className="material-symbols-outlined text-[18px] text-emerald-500">groups</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">October Payroll Batch</p>
                                            <p className="text-[10px] text-slate-500 font-label">Core Team - EMEA</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-[10px] font-bold font-label uppercase tracking-wider text-emerald-500 border border-emerald-500/20">Payroll</span>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-white">$45,000.00</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px] text-slate-500">payments</span>
                                        <span className="text-xs text-slate-400">Direct Deposit</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase font-label text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Cleared
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => alert('Actions for: October Payroll Batch ($45,000.00)')} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            {/* Row 4 */}
                            <tr className="hover:bg-white/[0.03] transition-colors group">
                                <td className="px-6 py-5">
                                    <p className="text-sm font-semibold text-white">Oct 18, 2023</p>
                                    <p className="text-[10px] text-slate-500 font-label">11:05 AM</p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                            <span className="material-symbols-outlined text-[18px] text-rose-500">warning</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Data Center Cooling Repair</p>
                                            <p className="text-[10px] text-slate-500 font-label">Emergency Maintenance</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-bold font-label uppercase tracking-wider text-slate-400 border border-white/10">Operations</span>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-white">$2,150.75</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px] text-slate-500">credit_card</span>
                                        <span className="text-xs text-slate-400">Visa **** 2284</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase font-label text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                                        Flagged
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => alert('Actions for: Data Center Cooling Repair ($2,150.75)')} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="bg-white/[0.02] px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center border-t border-white/5">
                    <p className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-slate-500">Showing 1-10 of 248 Transactions</p>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold font-label ${
                                    currentPage === page
                                        ? 'bg-emerald-500 text-slate-950'
                                        : 'border border-white/10 flex items-center justify-center text-slate-500 hover:bg-white/5 hover:text-white transition-all'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Contextual Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
                <div className="bg-[#1e293b]/60 backdrop-blur-[16px] p-8 rounded-2xl lg:col-span-2 border-l-4 border-l-emerald-500 relative overflow-hidden group shadow-lg">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-[120px] text-emerald-500">analytics</span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-500">analytics</span>
                        </div>
                        <h4 className="text-lg font-headline font-bold text-white tracking-tight">Spending Anomaly Detected</h4>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                        Marketing spend in the <span className="text-emerald-500 font-bold">APAC region</span> has increased by 45% compared to previous monthly projections. This correlates with the new product launch phase, but exceeds the allocated buffer by <span className="text-rose-500 font-bold">$4,200</span>.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <button onClick={() => alert('Opening allocation review for APAC marketing spend anomaly.')} className="text-[10px] font-label font-bold uppercase tracking-[0.2em] px-6 py-2.5 bg-emerald-500 text-slate-950 rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-emerald-500/10">Review Allocations</button>
                        <button onClick={() => alert('Anomaly alert dismissed.')} className="text-[10px] font-label font-bold uppercase tracking-[0.2em] px-6 py-2.5 border border-white/10 text-slate-400 rounded-lg hover:bg-white/5 transition-all">Dismiss</button>
                    </div>
                </div>

                <div className="bg-[#1e293b]/60 backdrop-blur-[16px] p-8 rounded-2xl flex flex-col border border-white/10 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-headline font-bold text-white tracking-tight">Upcoming Renewals</h4>
                        <span className="material-symbols-outlined text-slate-500 text-sm">schedule</span>
                    </div>
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(144,147,255,0.5)]"></div>
                                <p className="text-xs font-semibold group-hover:text-secondary transition-colors text-slate-300">Salesforce Enterprise</p>
                            </div>
                            <p className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest">In 3 days</p>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <p className="text-xs font-semibold group-hover:text-emerald-500 transition-colors text-slate-300">GitHub Co-Pilot</p>
                            </div>
                            <p className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest">In 8 days</p>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <p className="text-xs font-semibold group-hover:text-emerald-500 transition-colors text-slate-300">Zoom Pro Plan</p>
                            </div>
                            <p className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest">In 14 days</p>
                        </div>
                    </div>
                    <button onClick={() => alert('Navigating to full subscriptions management view.')} className="mt-8 w-full text-center text-[10px] font-label font-bold uppercase tracking-[0.2em] py-3 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/5 transition-all">View All Subscriptions</button>
                </div>
            </div>

            {/* Floating Action Button */}
            <button onClick={() => alert('Quick action menu: Record expense, Upload receipt, Create report.')} className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-500 rounded-2xl shadow-[0_8px_30px_rgba(16,185,129,0.3)] flex items-center justify-center text-slate-950 hover:scale-105 active:scale-95 transition-all z-50 group border border-emerald-500/50">
                <span className="material-symbols-outlined font-black text-2xl group-hover:rotate-90 transition-transform duration-300">add</span>
            </button>
        </section>
    );
}
