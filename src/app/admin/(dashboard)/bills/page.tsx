'use client';

import { useState } from 'react';

export default function BillsManagement() {
    const [serviceCategory, setServiceCategory] = useState('All Services');
    const [region, setRegion] = useState('Global (All)');
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    return (
        <section className="max-w-[1600px] mx-auto space-y-8">
            {/* Title & Create */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-bold tracking-tight cyber-glow-cyan text-primary">Bills & Invoicing</h2>
                    <p className="text-slate-400 mt-1 text-sm">Manage commercial billing flow and monitor collection health.</p>
                </div>
                <button onClick={() => alert('Create New Invoice dialog would open here.')} className="flex items-center gap-2 bg-primary px-6 py-2.5 rounded-lg text-slate-950 font-headline font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                    <span className="material-symbols-outlined text-lg">add</span>
                    CREATE NEW INVOICE
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-label text-slate-400 uppercase tracking-widest">Total Invoiced</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-headline font-bold text-white">$1.24M</span>
                            <span className="text-emerald-500 text-xs font-medium flex items-center">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                12%
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4 rounded-full"></div>
                    </div>
                </div>

                <div className="bg-red-500/5 backdrop-blur-[8px] p-6 rounded-xl border border-red-500/20">
                    <span className="text-[10px] font-label text-red-400 uppercase tracking-widest">Outstanding Amount</span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-headline font-bold text-red-500">$342.5K</span>
                    </div>
                    <div className="mt-6 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        <p className="text-[11px] text-slate-400">Immediate attention required</p>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl">
                    <span className="text-[10px] font-label text-emerald-500 uppercase tracking-widest">Paid This Month</span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-headline font-bold text-white">$118.2K</span>
                    </div>
                    <div className="mt-6 flex gap-1 items-end h-6">
                        <div className="w-1 bg-emerald-500/20 rounded-full h-2"></div>
                        <div className="w-1 bg-emerald-500/40 rounded-full h-4"></div>
                        <div className="w-1 bg-emerald-500/20 rounded-full h-2"></div>
                        <div className="w-1 bg-emerald-500 rounded-full h-6 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <div className="w-1 bg-emerald-500/60 rounded-full h-3"></div>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl">
                    <span className="text-[10px] font-label text-secondary uppercase tracking-widest">Avg Collection Time</span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-headline font-bold text-white">14 Days</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-6 italic">-2 days vs last quarter</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 p-5 rounded-2xl flex flex-wrap items-center gap-6 shadow-lg">
                <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                    <label className="text-[10px] font-label uppercase text-slate-400 tracking-wider">Date Range</label>
                    <div className="bg-slate-900/50 flex items-center px-4 py-2.5 rounded-lg gap-3 cursor-pointer border border-white/5 hover:border-primary/20 transition-all">
                        <span className="material-symbols-outlined text-lg text-primary">calendar_today</span>
                        <span className="text-sm text-white">Last 30 Days</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                    <label className="text-[10px] font-label uppercase text-slate-400 tracking-wider">Service Category</label>
                    <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)} className="bg-slate-900/50 text-sm text-white border border-white/5 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 outline-none rounded-lg py-2.5 px-4 cursor-pointer">
                        <option>All Services</option>
                        <option>Cloud Infrastructure</option>
                        <option>AI Consultancy</option>
                        <option>Security Audit</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                    <label className="text-[10px] font-label uppercase text-slate-400 tracking-wider">Region</label>
                    <select value={region} onChange={(e) => setRegion(e.target.value)} className="bg-slate-900/50 text-sm text-white border border-white/5 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 outline-none rounded-lg py-2.5 px-4 cursor-pointer">
                        <option>Global (All)</option>
                        <option>North America</option>
                        <option>EMEA</option>
                        <option>APAC</option>
                    </select>
                </div>
                <div className="ml-auto mt-auto">
                    <button onClick={() => alert(`Applying filters:\nService Category: ${serviceCategory}\nRegion: ${region}`)} className="bg-slate-800/50 hover:bg-slate-800 text-primary border border-primary/20 flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all text-sm font-bold shadow-lg">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        APPLY FILTERS
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#192540]/60 backdrop-blur-[16px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400">Invoice ID</th>
                                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400">Client Name</th>
                                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400">Due Date</th>
                                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-5 font-headline text-sm font-medium text-white">#INV-2024-001</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-secondary/20 flex items-center justify-center text-secondary font-bold text-[10px]">NL</div>
                                        <span className="text-sm font-semibold text-white">Nebula Labs Corp.</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-headline text-sm font-bold text-white">$42,500.00</td>
                                <td className="px-6 py-5 text-sm text-slate-400">Oct 12, 2023</td>
                                <td className="px-6 py-5">
                                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-label uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">Paid</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => alert('Viewing invoice #INV-2024-001')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">visibility</span></button>
                                        <button onClick={() => alert('Downloading invoice #INV-2024-001')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">download</span></button>
                                        <button onClick={() => alert('Sending invoice #INV-2024-001 to Nebula Labs Corp.')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">send</span></button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-5 font-headline text-sm font-medium text-white">#INV-2024-002</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">QT</div>
                                        <span className="text-sm font-semibold text-white">Quantum Tech Systems</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-headline text-sm font-bold text-white">$18,200.00</td>
                                <td className="px-6 py-5 text-sm text-slate-400">Nov 04, 2023</td>
                                <td className="px-6 py-5">
                                    <span className="bg-white/5 text-slate-400 text-[10px] font-label uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">Unpaid</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => alert('Viewing invoice #INV-2024-002')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">visibility</span></button>
                                        <button onClick={() => alert('Downloading invoice #INV-2024-002')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">download</span></button>
                                        <button onClick={() => alert('Sending invoice #INV-2024-002 to Quantum Tech Systems')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">send</span></button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-5 font-headline text-sm font-medium text-white">#INV-2024-003</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-[10px]">VE</div>
                                        <span className="text-sm font-semibold text-white">Vortex Energy Group</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-headline text-sm font-bold text-red-500">$124,000.00</td>
                                <td className="px-6 py-5 text-sm text-red-400/80 font-medium">Oct 01, 2023</td>
                                <td className="px-6 py-5">
                                    <span className="bg-red-500/10 text-red-500 text-[10px] font-label uppercase tracking-widest px-3 py-1 rounded-full border border-red-500/20 animate-pulse">Overdue</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => alert('Viewing invoice #INV-2024-003')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">visibility</span></button>
                                        <button onClick={() => alert('Downloading invoice #INV-2024-003')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">download</span></button>
                                        <button onClick={() => alert('Sending invoice #INV-2024-003 to Vortex Energy Group')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">send</span></button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-5 font-headline text-sm font-medium text-white">#INV-2024-004</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-[10px]">AS</div>
                                        <span className="text-sm font-semibold text-white">Apex Solutions Ltd</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-headline text-sm font-bold text-white">$9,450.00</td>
                                <td className="px-6 py-5 text-sm text-slate-400">Nov 15, 2023</td>
                                <td className="px-6 py-5">
                                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-label uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">Paid</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => alert('Viewing invoice #INV-2024-004')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">visibility</span></button>
                                        <button onClick={() => alert('Downloading invoice #INV-2024-004')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">download</span></button>
                                        <button onClick={() => alert('Sending invoice #INV-2024-004 to Apex Solutions Ltd')} className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">send</span></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between bg-white/[0.02] border-t border-white/5 gap-4">
                    <span className="text-[10px] text-slate-500 font-label uppercase tracking-wider font-bold">Showing 1 to 4 of 28 invoices</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 transition-all">
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold ${
                                        currentPage === page
                                            ? 'bg-primary/20 border border-primary/20 text-primary'
                                            : 'border border-transparent hover:border-white/5 hover:bg-white/5 transition-all text-slate-400'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 hover:bg-white/5 text-slate-400 transition-all">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button onClick={() => alert('Quick action menu would open here.')} className="fixed bottom-8 right-8 w-14 h-14 rounded-xl bg-primary text-slate-950 shadow-[0_8px_30px_rgba(0,242,255,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border border-primary/50">
                <span className="material-symbols-outlined font-black text-2xl group-hover:rotate-90 transition-transform">add</span>
            </button>
        </section>
    );
}
