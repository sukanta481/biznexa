'use client';

import { useState, useRef } from 'react';

export default function InspectionFiles() {
    const [dateFilter, setDateFilter] = useState('Date Range: Last 30 Days');
    const [serviceFilter, setServiceFilter] = useState('Service: All Categories');
    const [regionFilter, setRegionFilter] = useState('Region: Global Operations');
    const [currentPage, setCurrentPage] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const totalPages = 3;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-headline font-bold text-primary tracking-tight cyber-glow-cyan">Inspection Files</h2>
                    <p className="text-slate-400 text-sm">Centralized repository for secure site audit documentation and master records.</p>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { if (e.target.files?.[0]) alert(`Uploading: ${e.target.files[0].name}`); }} />
                <button onClick={() => fileInputRef.current?.click()} className="bg-tertiary px-6 py-3.5 rounded-xl flex items-center gap-2 font-headline font-black text-[#00452d] text-xs uppercase tracking-widest shadow-[0_8px_24px_rgba(16,185,129,0.2)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.4)] transition-all active:scale-95 group">
                    <span className="material-symbols-outlined text-lg group-hover:-translate-y-1 transition-transform">cloud_upload</span>
                    Upload New File
                </button>
            </div>

            {/* Metric Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Active Files */}
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] p-6 rounded-2xl flex flex-col justify-between group overflow-hidden relative border border-white/5 hover:border-primary/30 transition-all">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <span className="material-symbols-outlined text-primary text-3xl">folder_shared</span>
                        <span className="text-[10px] font-label text-primary font-bold tracking-[0.2em] bg-primary/10 px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                    <div className="mt-8 relative z-10">
                        <p className="text-4xl font-headline font-bold tracking-tighter">1,284</p>
                        <p className="text-slate-400 text-[10px] font-label uppercase tracking-[0.2em] mt-2">Active Files</p>
                    </div>
                </div>

                {/* Storage Used */}
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] p-6 rounded-2xl flex flex-col justify-between group overflow-hidden relative border border-white/5 hover:border-secondary/30 transition-all">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <span className="material-symbols-outlined text-secondary text-3xl">storage</span>
                        <span className="text-[10px] font-label text-secondary font-bold tracking-[0.2em]">74% FULL</span>
                    </div>
                    <div className="mt-8 relative z-10">
                        <p className="text-4xl font-headline font-bold tracking-tighter">42.8 <span className="text-xl opacity-40">GB</span></p>
                        <p className="text-slate-400 text-[10px] font-label uppercase tracking-[0.2em] mt-2">Storage Used</p>
                    </div>
                </div>

                {/* Flagged Files */}
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border-rose-500/10 p-6 rounded-2xl flex flex-col justify-between group overflow-hidden relative border hover:border-rose-500/30 transition-all">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <span className="material-symbols-outlined text-rose-500 text-3xl">report</span>
                        <span className="text-[10px] font-label text-rose-500 font-bold tracking-[0.2em] bg-rose-500/10 px-2 py-0.5 rounded-full">URGENT</span>
                    </div>
                    <div className="mt-8 relative z-10">
                        <p className="text-4xl font-headline font-bold tracking-tighter">18</p>
                        <p className="text-slate-400 text-[10px] font-label uppercase tracking-[0.2em] mt-2">Flagged Files</p>
                    </div>
                </div>

                {/* Last Scan */}
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] p-6 rounded-2xl flex flex-col justify-between group overflow-hidden relative border border-white/5 hover:border-tertiary/30 transition-all">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/5 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <span className="material-symbols-outlined text-tertiary text-3xl">security</span>
                        <span className="text-[10px] font-label text-tertiary font-bold tracking-[0.2em] bg-tertiary/10 px-2 py-0.5 rounded-full">SECURE</span>
                    </div>
                    <div className="mt-8 relative z-10">
                        <p className="text-xl font-headline font-bold">Oct 24, 2023</p>
                        <p className="text-slate-400 text-[10px] font-label uppercase tracking-[0.2em] mt-2">Last Scan Date</p>
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-[#192540]/60 backdrop-blur-[16px] p-4 rounded-2xl flex flex-wrap items-center gap-6 border border-white/5 shadow-lg">
                <div className="flex items-center gap-3 text-slate-400 pl-2">
                    <span className="material-symbols-outlined text-primary text-xl">tune</span>
                    <span className="font-label text-[10px] uppercase tracking-[0.2em] font-bold">Filters</span>
                </div>
                <div className="flex flex-wrap gap-4 flex-1">
                    <div className="relative group">
                        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold font-label uppercase tracking-widest text-on-surface pl-4 pr-10 py-2.5 focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer min-w-[160px] outline-none">
                            <option>Date Range: Last 30 Days</option>
                            <option>Date Range: Last 90 Days</option>
                            <option>Date Range: YTD</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                    </div>
                    <div className="relative group">
                        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold font-label uppercase tracking-widest text-on-surface pl-4 pr-10 py-2.5 focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer min-w-[160px] outline-none">
                            <option>Service: All Categories</option>
                            <option>Service: Structural</option>
                            <option>Service: Electrical</option>
                            <option>Service: Fire Safety</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                    </div>
                    <div className="relative group">
                        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold font-label uppercase tracking-widest text-on-surface pl-4 pr-10 py-2.5 focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer min-w-[160px] outline-none">
                            <option>Region: Global Operations</option>
                            <option>Region: North District</option>
                            <option>Region: South District</option>
                            <option>Region: Overseas</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 pr-2">
                    <button onClick={() => alert('Refreshing file list...')} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 hover:text-primary transition-all text-slate-400 border border-white/5">
                        <span className="material-symbols-outlined text-xl">refresh</span>
                    </button>
                    <button onClick={() => alert('More options')} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 hover:text-primary transition-all text-slate-400 border border-white/5">
                        <span className="material-symbols-outlined text-xl">more_vert</span>
                    </button>
                </div>
            </div>

            {/* Data Table Section */}
            <div className="bg-[#192540]/60 backdrop-blur-[16px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-8 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">File Name</th>
                                <th className="px-6 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-center">Type</th>
                                <th className="px-6 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Size</th>
                                <th className="px-6 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Upload Date</th>
                                <th className="px-6 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Status</th>
                                <th className="px-6 py-5 font-label text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Owner</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Row 1 */}
                            <tr className="hover:bg-primary/5 transition-all group cursor-pointer">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-on-surface">Structural_Audit_V2.pdf</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold font-label tracking-widest mt-0.5">Project: Nexus Tower</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="bg-primary/10 border border-primary/20 px-3 py-1 rounded text-[10px] font-black text-primary uppercase tracking-widest">PDF</span>
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-medium">12.4 MB</td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-medium">Oct 22, 2023</td>
                                <td className="px-6 py-5">
                                    <span className="flex items-center gap-2 text-tertiary text-[11px] font-black font-headline uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_12px_#10b981]"></span>
                                        Secure
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full ring-1 ring-white/10 bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">AC</div>
                                        <span className="text-sm font-medium text-on-surface">Alex Chen</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => alert('Downloading Structural_Audit_V2.pdf')} className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl border border-white/5 transition-all">
                                            <span className="material-symbols-outlined text-xl">download</span>
                                        </button>
                                        <button onClick={() => alert('Previewing Structural_Audit_V2.pdf')} className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl border border-white/5 transition-all">
                                            <span className="material-symbols-outlined text-xl">visibility</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* Row 2 */}
                            <tr className="hover:bg-primary/5 transition-all group cursor-pointer">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined">architecture</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-on-surface">Main_Elevator_Schematics.dwg</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold font-label tracking-widest mt-0.5">Project: SkyRise Plaza</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="bg-secondary/10 border border-secondary/20 px-3 py-1 rounded text-[10px] font-black text-secondary uppercase tracking-widest">CAD</span>
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-medium">45.2 MB</td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-medium">Oct 20, 2023</td>
                                <td className="px-6 py-5">
                                    <span className="flex items-center gap-2 text-secondary text-[11px] font-black font-headline uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_12px_#6366f1]"></span>
                                        Pending
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full ring-1 ring-white/10 bg-secondary/10 flex items-center justify-center text-[10px] font-bold text-secondary">SJ</div>
                                        <span className="text-sm font-medium text-on-surface">Sarah J.</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => alert('Downloading Main_Elevator_Schematics.dwg')} className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl border border-white/5 transition-all">
                                            <span className="material-symbols-outlined text-xl">download</span>
                                        </button>
                                        <button onClick={() => alert('Previewing Main_Elevator_Schematics.dwg')} className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl border border-white/5 transition-all">
                                            <span className="material-symbols-outlined text-xl">visibility</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* Row 3 */}
                            <tr className="hover:bg-primary/5 transition-all group cursor-pointer">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined">warning</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-on-surface">Foundation_Crack_Log_01.xlsx</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold font-label tracking-widest mt-0.5">Project: Marina Bay</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded text-[10px] font-black text-rose-500 uppercase tracking-widest">DATA</span>
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-medium">2.8 MB</td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-medium">Oct 19, 2023</td>
                                <td className="px-6 py-5">
                                    <span className="flex items-center gap-2 text-rose-500 text-[11px] font-black font-headline uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_12px_#ef4444]"></span>
                                        Warning
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400">MK</div>
                                        <span className="text-sm font-medium text-on-surface">Marcus Kane</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => alert('Downloading Foundation_Crack_Log_01.xlsx')} className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl border border-white/5 transition-all">
                                            <span className="material-symbols-outlined text-xl">download</span>
                                        </button>
                                        <button onClick={() => alert('Previewing Foundation_Crack_Log_01.xlsx')} className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl border border-white/5 transition-all">
                                            <span className="material-symbols-outlined text-xl">visibility</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="px-8 py-6 bg-white/[0.02] flex justify-between items-center border-t border-white/5">
                    <p className="text-[11px] text-slate-500 font-bold font-label uppercase tracking-widest">Showing 3 of 1,284 entries</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 hover:text-primary disabled:opacity-30 transition-all">
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${currentPage === page ? 'bg-primary/20 text-primary border border-primary/20' : 'border border-white/10 hover:bg-white/5 hover:text-primary'}`}>{page}</button>
                        ))}
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 hover:text-primary disabled:opacity-30 transition-all">
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Decorative */}
            <div className="pt-12 pb-8 flex justify-center opacity-20 pointer-events-none">
                <div className="flex items-center gap-6">
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    <span className="material-symbols-outlined text-primary text-lg">precision_manufacturing</span>
                    <div className="h-px w-32 bg-gradient-to-l from-transparent via-primary to-transparent"></div>
                </div>
            </div>
        </div>
    );
}
