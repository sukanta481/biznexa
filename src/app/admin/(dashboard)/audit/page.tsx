'use client';

import { useState } from 'react';

export default function ActivityAudit() {
    const [dateRange, setDateRange] = useState('Last 24 Hours');
    const [userProfile, setUserProfile] = useState('All Administrators');
    const [category, setCategory] = useState('All Actions');
    const [liveSyncActive, setLiveSyncActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Activity Audit Log</h1>
                    <p className="text-slate-400 font-body mt-2 max-w-2xl">A mathematical record of all administrative trajectories within the Biznexa ecosystem. Precise, unalterable, and real-time.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => alert('Exporting audit data...')}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#192540]/60 backdrop-blur-[8px] border border-white/10 text-white rounded-lg hover:bg-[#1f2b49]/80 transition-all font-label uppercase tracking-widest text-[11px]"
                    >
                        <span className="material-symbols-outlined text-sm">download</span> Export CSV
                    </button>
                    <button
                        onClick={() => setLiveSyncActive(!liveSyncActive)}
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 font-bold rounded-lg shadow-lg transition-all font-label uppercase tracking-widest text-[11px] ${
                            liveSyncActive
                                ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 shadow-emerald-500/40 ring-2 ring-emerald-400/50'
                                : 'bg-gradient-to-r from-primary to-cyan-500 text-slate-950 shadow-primary/20 hover:shadow-primary/40'
                        }`}
                    >
                        <span className={`material-symbols-outlined text-sm ${liveSyncActive ? 'animate-spin' : ''}`}>refresh</span> {liveSyncActive ? 'Syncing...' : 'Live Sync'}
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            <section className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-[#192540]/40 backdrop-blur-[16px] rounded-xl border border-white/5">
                <div className="space-y-2">
                    <label className="font-label uppercase tracking-widest text-[10px] text-primary/70">Date Range</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_month</span>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full bg-[#0f1930]/60 border border-white/5 rounded-md pl-10 py-2.5 text-sm font-body focus:ring-1 focus:ring-primary/30 appearance-none text-white outline-none"
                        >
                            <option>Last 24 Hours</option>
                            <option>Past 7 Days</option>
                            <option>Past 30 Days</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="font-label uppercase tracking-widest text-[10px] text-primary/70">User Profile</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">person</span>
                        <select
                            value={userProfile}
                            onChange={(e) => setUserProfile(e.target.value)}
                            className="w-full bg-[#0f1930]/60 border border-white/5 rounded-md pl-10 py-2.5 text-sm font-body focus:ring-1 focus:ring-primary/30 appearance-none text-white outline-none"
                        >
                            <option>All Administrators</option>
                            <option>System Auto-Bot</option>
                            <option>Alex Rivera</option>
                            <option>Elena Vance</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="font-label uppercase tracking-widest text-[10px] text-primary/70">Category</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">category</span>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[#0f1930]/60 border border-white/5 rounded-md pl-10 py-2.5 text-sm font-body focus:ring-1 focus:ring-primary/30 appearance-none text-white outline-none"
                        >
                            <option>All Actions</option>
                            <option>Content Update</option>
                            <option>Billing Transaction</option>
                            <option>System Security</option>
                            <option>Database Migration</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => alert(`Applying filters:\n- Date Range: ${dateRange}\n- User: ${userProfile}\n- Category: ${category}`)}
                        className="w-full py-2.5 bg-[#0f1930]/60 text-primary font-label uppercase tracking-widest text-[10px] rounded-md hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 border border-white/5"
                    >
                        <span className="material-symbols-outlined text-sm">filter_list</span> Apply Filters
                    </button>
                </div>
            </section>

            {/* Audit Table */}
            <div className="bg-[#192540]/40 backdrop-blur-[16px] rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#141f38]/50 border-b border-white/5">
                                <th className="px-6 py-4 font-label uppercase tracking-widest text-[10px] text-slate-400">Timestamp</th>
                                <th className="px-6 py-4 font-label uppercase tracking-widest text-[10px] text-slate-400">User Entity</th>
                                <th className="px-6 py-4 font-label uppercase tracking-widest text-[10px] text-slate-400">Category</th>
                                <th className="px-6 py-4 font-label uppercase tracking-widest text-[10px] text-slate-400">Description</th>
                                <th className="px-6 py-4 font-label uppercase tracking-widest text-[10px] text-slate-400">IP Identity</th>
                                <th className="px-6 py-4 font-label uppercase tracking-widest text-[10px] text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Row 1 */}
                            <tr className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium font-headline text-white">Oct 24, 2023</span>
                                        <span className="text-[11px] text-slate-500 font-body">14:32:05 UTC</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-cyan-900/40 flex items-center justify-center text-[10px] font-bold text-cyan-400 border border-cyan-400/20">AR</div>
                                        <span className="text-sm font-body text-slate-200">Alex Rivera</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-cyan-400/10 text-cyan-400 text-[9px] font-label font-bold uppercase tracking-wider rounded-full border border-cyan-400/20">Content Update</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-body text-slate-300 truncate max-w-xs" title="Modified API documentation endpoint: /v1/auth/callback">Modified API documentation endpoint: /v1/auth/callback</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-slate-400">192.168.1.104</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => alert('Action menu for: Modified API documentation endpoint')} className="text-slate-500 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            {/* Row 2 */}
                            <tr className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium font-headline text-white">Oct 24, 2023</span>
                                        <span className="text-[11px] text-slate-500 font-body">12:15:44 UTC</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-indigo-900/40 flex items-center justify-center text-[10px] font-bold text-secondary border border-secondary/20">EV</div>
                                        <span className="text-sm font-body text-slate-200">Elena Vance</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-secondary/10 text-secondary text-[9px] font-label font-bold uppercase tracking-wider rounded-full border border-secondary/20">Billing</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-body text-slate-300 truncate max-w-xs" title="Authorized refund for transaction ID #99281-BZX">Authorized refund for transaction ID #99281-BZX</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-slate-400">45.22.109.12</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => alert('Action menu for: Authorized refund for transaction ID #99281-BZX')} className="text-slate-500 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            {/* Row 3 */}
                            <tr className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium font-headline text-white">Oct 24, 2023</span>
                                        <span className="text-[11px] text-slate-500 font-body">09:02:11 UTC</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-slate-700">SB</div>
                                        <span className="text-sm font-body text-slate-200">System Bot</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-emerald-400/10 text-emerald-400 text-[9px] font-label font-bold uppercase tracking-wider rounded-full border border-emerald-400/20">System</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-body text-slate-300 truncate max-w-xs" title="Automated nightly database backup completed successfully">Automated nightly database backup completed successfully</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-slate-400">localhost::0</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => alert('Action menu for: Automated nightly database backup completed')} className="text-slate-500 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            {/* Row 4 */}
                            <tr className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium font-headline text-white">Oct 23, 2023</span>
                                        <span className="text-[11px] text-slate-500 font-body">23:58:19 UTC</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-rose-500/10 flex items-center justify-center text-[10px] font-bold text-rose-500 border border-rose-500/20">SC</div>
                                        <span className="text-sm font-body text-slate-200">Security Core</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-rose-500/10 text-rose-500 text-[9px] font-label font-bold uppercase tracking-wider rounded-full border border-rose-500/20">Security</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-body text-slate-300 truncate max-w-xs" title="Flagged multiple failed login attempts from unknown IP">Flagged multiple failed login attempts from unknown IP</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-rose-500/80">103.4.11.201</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => alert('Action menu for: Flagged multiple failed login attempts')} className="text-slate-500 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            {/* Row 5 */}
                            <tr className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium font-headline text-white">Oct 23, 2023</span>
                                        <span className="text-[11px] text-slate-500 font-body">21:44:02 UTC</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-cyan-900/40 flex items-center justify-center text-[10px] font-bold text-cyan-400 border border-cyan-400/20">AR</div>
                                        <span className="text-sm font-body text-slate-200">Alex Rivera</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-cyan-400/10 text-cyan-400 text-[9px] font-label font-bold uppercase tracking-wider rounded-full border border-cyan-400/20">Content Update</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-body text-slate-300 truncate max-w-xs" title="Published new 'Technical Architecture' blog series">Published new &apos;Technical Architecture&apos; blog series</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-slate-400">192.168.1.104</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => alert("Action menu for: Published new 'Technical Architecture' blog series")} className="text-slate-500 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 bg-[#0f1930]/30 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[11px] font-label uppercase tracking-widest text-slate-500">Showing 1 to 5 of 2,482 entries</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="px-3 py-1.5 rounded bg-[#192540] border border-white/5 text-slate-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1.5 rounded text-xs font-headline ${
                                    currentPage === page
                                        ? 'bg-primary text-slate-950 font-bold'
                                        : 'bg-[#192540] border border-white/5 text-slate-400 hover:text-primary transition-colors'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                            className="px-3 py-1.5 rounded bg-[#192540] border border-white/5 text-slate-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* System Health Mini-Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#192540]/40 backdrop-blur-[16px] rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-primary">security</span>
                        <h3 className="font-headline font-bold uppercase tracking-wider text-xs text-slate-300">Security Integrity</h3>
                    </div>
                    <div className="text-2xl font-headline font-bold text-white">99.9%</div>
                    <div className="w-full bg-[#0f1930] rounded-full h-1 mt-3">
                        <div className="bg-primary h-full rounded-full w-[99.9%] shadow-[0_0_8px_rgba(0,242,255,0.6)]"></div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 font-body">Last verification 14 minutes ago.</p>
                </div>

                <div className="p-6 bg-[#192540]/40 backdrop-blur-[16px] rounded-xl border border-white/5 hover:border-secondary/20 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-secondary">hub</span>
                        <h3 className="font-headline font-bold uppercase tracking-wider text-xs text-slate-300">Active Sessions</h3>
                    </div>
                    <div className="text-2xl font-headline font-bold text-white">14 Nodes</div>
                    <div className="flex items-end gap-1 mt-3 h-8">
                        <div className="w-1.5 bg-secondary rounded-full h-[30%]"></div>
                        <div className="w-1.5 bg-secondary rounded-full h-[60%]"></div>
                        <div className="w-1.5 bg-secondary/40 rounded-full h-[40%]"></div>
                        <div className="w-1.5 bg-secondary rounded-full h-[90%] shadow-[0_0_8px_rgba(144,147,255,0.6)]"></div>
                        <div className="w-1.5 bg-secondary rounded-full h-[50%]"></div>
                        <div className="w-1.5 bg-secondary/20 rounded-full h-[20%]"></div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 font-body">Distributed access cluster active.</p>
                </div>

                <div className="p-6 bg-[#192540]/40 backdrop-blur-[16px] rounded-xl border border-white/5 hover:border-emerald-400/20 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-emerald-400">history</span>
                        <h3 className="font-headline font-bold uppercase tracking-wider text-xs text-slate-300">Retention Policy</h3>
                    </div>
                    <div className="text-2xl font-headline font-bold text-white">365 <span className="text-lg text-slate-400">Days</span></div>
                    <p className="text-sm font-body text-emerald-400 mt-2">Audit data immutable</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-body">Encrypted at AES-256 rest.</p>
                </div>
            </div>
        </div>
    );
}
