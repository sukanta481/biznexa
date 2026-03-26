'use client';

import { useState } from 'react';

export default function InspectionDashboard() {
    const [dateFilter, setDateFilter] = useState('Last 30 Days');
    const [serviceFilter, setServiceFilter] = useState('All Services');
    const [regionFilter, setRegionFilter] = useState('All Regions');

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Page Header & Filters */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-bold font-headline text-on-surface cyber-glow-cyan tracking-tight uppercase">Inspection Dashboard</h2>
                        <p className="text-slate-400 font-body mt-1">Real-time system monitoring and audit compliance.</p>
                    </div>
                </div>

                {/* Advanced Filters */}
                <div className="flex flex-wrap items-center gap-3 bg-[#1e293b]/40 backdrop-blur-[8px] p-3 rounded-xl border border-white/5">
                    <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-3 border border-white/10">
                        <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-8 cursor-pointer uppercase tracking-wider outline-none">
                            <option>Last 30 Days</option>
                            <option>Quarter to Date</option>
                            <option>Yearly Report</option>
                        </select>
                    </div>
                    <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-3 border border-white/10">
                        <span className="material-symbols-outlined text-primary text-sm">category</span>
                        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-8 cursor-pointer uppercase tracking-wider outline-none">
                            <option>All Services</option>
                            <option>Technical Audit</option>
                            <option>Safety Review</option>
                        </select>
                    </div>
                    <div className="bg-slate-900/50 px-4 py-2 rounded-lg flex items-center gap-3 border border-white/10">
                        <span className="material-symbols-outlined text-primary text-sm">public</span>
                        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-8 cursor-pointer uppercase tracking-wider outline-none">
                            <option>All Regions</option>
                            <option>US-East</option>
                            <option>EU-Central</option>
                            <option>AP-South</option>
                        </select>
                    </div>
                    <button onClick={() => alert(`Filters applied:\nDate: ${dateFilter}\nService: ${serviceFilter}\nRegion: ${regionFilter}`)} className="bg-primary hover:bg-primary/80 text-slate-950 font-label text-[11px] font-black px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all ml-auto uppercase tracking-tighter shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-sm font-bold">filter_list</span>
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-primary/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2.5 rounded-xl">folder_zip</span>
                        <span className="text-primary text-xs font-label font-bold">+12% &uarr;</span>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Total Inspection Files</p>
                        <h3 className="text-3xl font-bold font-headline mt-1 text-white">12,482</h3>
                    </div>
                </div>

                <div className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-rose-500/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-rose-500 bg-rose-500/10 p-2.5 rounded-xl">pending_actions</span>
                        <span className="bg-rose-500 text-slate-950 text-[9px] font-black font-label px-2 py-0.5 rounded-full animate-pulse uppercase">Action Required</span>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Pending Reviews</p>
                        <h3 className="text-3xl font-bold font-headline mt-1 text-white">84</h3>
                    </div>
                </div>

                <div className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-secondary/30 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2.5 rounded-xl">verified</span>
                        <span className="text-slate-400 text-xs font-label">98% Success</span>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">Completed Audits</p>
                        <h3 className="text-3xl font-bold font-headline mt-1 text-white">1,204</h3>
                    </div>
                </div>

                <div className="bg-[#192540]/60 backdrop-blur-[16px] p-6 rounded-2xl flex flex-col justify-between group hover:border-primary/40 transition-all border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2.5 rounded-xl">analytics</span>
                        <div className="flex -space-x-1 items-end">
                            <div className="w-1.5 h-4 bg-primary/30 rounded-full"></div>
                            <div className="w-1.5 h-6 bg-primary/50 rounded-full"></div>
                            <div className="w-1.5 h-3 bg-primary/70 rounded-full"></div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-slate-500 text-[10px] font-label tracking-[0.15em] uppercase">System Health Score</p>
                        <h3 className="text-3xl font-bold font-headline mt-1 text-primary cyber-glow-cyan">99.2%</h3>
                    </div>
                </div>
            </div>

            {/* Data Visualization & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-[#192540]/60 backdrop-blur-[16px] rounded-2xl p-8 space-y-8 border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-lg font-bold font-headline text-white uppercase">Scan Performance Metrics</h4>
                            <p className="text-xs text-slate-500 mt-1">Cross-regional system integrity analysis</p>
                        </div>
                        <div className="flex gap-4 bg-white/5 p-2 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 px-2">
                                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00f2ff]"></span>
                                <span className="text-[10px] font-label font-bold text-slate-400 uppercase tracking-tighter">SUCCESS</span>
                            </div>
                            <div className="flex items-center gap-2 px-2 border-l border-white/10">
                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                <span className="text-[10px] font-label font-bold text-slate-400 uppercase tracking-tighter">REVIEW</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Visualizer */}
                    <div className="h-64 flex items-end justify-between gap-6 px-4 pb-4">
                        {/* Day Group (Simulated Data) */}
                        <div className="flex-1 flex flex-col items-center gap-3 h-full">
                            <div className="w-full flex items-end gap-1.5 h-full">
                                <div className="w-full bg-primary/20 hover:bg-primary/30 rounded-t-lg h-[65%] transition-all relative group">
                                    <div className="absolute inset-x-0 bottom-0 bg-primary h-[85%] rounded-t-lg shadow-[0_0_15px_rgba(0,242,255,0.2)]"></div>
                                </div>
                                <div className="w-full bg-secondary/20 hover:bg-secondary/30 rounded-t-lg h-[25%] transition-all relative group">
                                    <div className="absolute inset-x-0 bottom-0 bg-secondary h-[40%] rounded-t-lg"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-label text-slate-500 font-bold uppercase">MON</span>
                        </div>
                        {/* Repeat for 7 days */}
                        <div className="flex-1 flex flex-col items-center gap-3 h-full">
                            <div className="w-full flex items-end gap-1.5 h-full">
                                <div className="w-full bg-primary/20 rounded-t-lg h-[80%] relative hover:bg-primary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-primary h-[90%] rounded-t-lg shadow-[0_0_15px_rgba(0,242,255,0.2)]"></div>
                                </div>
                                <div className="w-full bg-secondary/20 rounded-t-lg h-[20%] relative hover:bg-secondary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-secondary h-[30%] rounded-t-lg"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-label text-slate-500 font-bold uppercase">TUE</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-3 h-full">
                            <div className="w-full flex items-end gap-1.5 h-full">
                                <div className="w-full bg-primary/20 rounded-t-lg h-[90%] relative hover:bg-primary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-primary h-[95%] rounded-t-lg shadow-[0_0_15px_rgba(0,242,255,0.2)]"></div>
                                </div>
                                <div className="w-full bg-secondary/20 rounded-t-lg h-[10%] relative hover:bg-secondary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-secondary h-[15%] rounded-t-lg"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-label text-slate-500 font-bold uppercase">WED</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-3 h-full">
                            <div className="w-full flex items-end gap-1.5 h-full">
                                <div className="w-full bg-primary/20 rounded-t-lg h-[70%] relative hover:bg-primary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-primary h-[75%] rounded-t-lg shadow-[0_0_15px_rgba(0,242,255,0.2)]"></div>
                                </div>
                                <div className="w-full bg-secondary/20 rounded-t-lg h-[40%] relative hover:bg-secondary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-secondary h-[50%] rounded-t-lg"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-label text-slate-500 font-bold uppercase">THU</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-3 h-full">
                            <div className="w-full flex items-end gap-1.5 h-full">
                                <div className="w-full bg-primary/20 rounded-t-lg h-[85%] relative hover:bg-primary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-primary h-[92%] rounded-t-lg shadow-[0_0_15px_rgba(0,242,255,0.2)]"></div>
                                </div>
                                <div className="w-full bg-secondary/20 rounded-t-lg h-[15%] relative hover:bg-secondary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-secondary h-[20%] rounded-t-lg"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-label text-slate-500 font-bold uppercase">FRI</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-3 h-full">
                            <div className="w-full flex items-end gap-1.5 h-full">
                                <div className="w-full bg-primary/20 rounded-t-lg h-[55%] relative hover:bg-primary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-primary h-[65%] rounded-t-lg shadow-[0_0_15px_rgba(0,242,255,0.2)]"></div>
                                </div>
                                <div className="w-full bg-secondary/20 rounded-t-lg h-[35%] relative hover:bg-secondary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-secondary h-[45%] rounded-t-lg"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-label text-slate-500 font-bold uppercase">SAT</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-3 h-full">
                            <div className="w-full flex items-end gap-1.5 h-full">
                                <div className="w-full bg-primary/20 rounded-t-lg h-[92%] relative hover:bg-primary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-primary h-[98%] rounded-t-lg shadow-[0_0_15px_rgba(0,242,255,0.2)]"></div>
                                </div>
                                <div className="w-full bg-secondary/20 rounded-t-lg h-[8%] relative hover:bg-secondary/30 transition-all">
                                    <div className="absolute inset-x-0 bottom-0 bg-secondary h-[10%] rounded-t-lg"></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-label text-slate-500 font-bold uppercase">SUN</span>
                        </div>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="bg-[#192540]/60 backdrop-blur-[16px] rounded-2xl p-6 flex flex-col border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs font-black font-headline uppercase tracking-[0.2em] text-white">Inspection Log</h4>
                        <button onClick={() => alert('Viewing all inspection logs')} className="text-primary text-[10px] font-bold hover:underline uppercase tracking-tighter">View All</button>
                    </div>
                    <div className="space-y-6 overflow-y-auto scroll-hide flex-1">
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                                <span className="material-symbols-outlined text-primary text-xl">task_alt</span>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-white">Audit #8291 Completed</p>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">West Region Technical Scan passed with 100% compliance.</p>
                                <span className="text-[10px] text-slate-600 font-bold mt-2 block uppercase">2 mins ago</span>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                <span className="material-symbols-outlined text-rose-500 text-xl">warning</span>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-white">Critical Failure Detected</p>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Service &apos;Nexus-Core&apos; failed security validation in Cloud-02.</p>
                                <span className="text-[10px] text-slate-600 font-bold mt-2 block uppercase">18 mins ago</span>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 p-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
                                <span className="material-symbols-outlined text-secondary text-xl">cloud_sync</span>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-white">System Sync Initiated</p>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Automated backup of inspection database v2.4.1.</p>
                                <span className="text-[10px] text-slate-600 font-bold mt-2 block uppercase">1 hour ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Feed Table */}
            <div className="bg-[#192540]/60 backdrop-blur-[16px] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h4 className="text-xs font-black font-headline uppercase tracking-[0.2em] text-white">Live Inspection Stream</h4>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                        <span className="text-primary text-[10px] font-black uppercase tracking-widest">Live Feed</span>
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-900/50">
                                <th className="px-6 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">File ID</th>
                                <th className="px-6 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">Service Node</th>
                                <th className="px-6 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">Region</th>
                                <th className="px-6 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">Integrity</th>
                                <th className="px-6 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black">Status</th>
                                <th className="px-6 py-4 text-[10px] font-label text-slate-500 uppercase tracking-widest font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="px-6 py-5 text-sm font-bold font-headline text-primary tracking-tight">#INS-9022-X</td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">Core Infrastructure</span>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase mt-0.5">v.3.2.1</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-medium uppercase tracking-tight">US-East-01</td>
                                <td className="px-6 py-5">
                                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[94%] shadow-[0_0_8px_#00f2ff]"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 text-[9px] font-black rounded-lg bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">Secure</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => alert('Actions for #INS-9022-X')} className="text-slate-500 hover:text-white transition-all"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="px-6 py-5 text-sm font-bold font-headline text-primary tracking-tight">#INS-8841-A</td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">Auth Gateway</span>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase mt-0.5">v.1.1.0</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-medium uppercase tracking-tight">EU-Central-1</td>
                                <td className="px-6 py-5">
                                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="bg-rose-500 h-full w-[42%] shadow-[0_0_8px_#ef4444]"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 text-[9px] font-black rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-widest">Failed</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => alert('Actions for #INS-8841-A')} className="text-slate-500 hover:text-white transition-all"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-white/[0.03] transition-colors">
                                <td className="px-6 py-5 text-sm font-bold font-headline text-primary tracking-tight">#INS-9011-P</td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">Data Warehouse</span>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase mt-0.5">v.4.0.5</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-medium uppercase tracking-tight">AP-South-1</td>
                                <td className="px-6 py-5">
                                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full w-[80%] shadow-[0_0_8px_#6366f1]"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 text-[9px] font-black rounded-lg bg-secondary/10 text-secondary border border-secondary/20 uppercase tracking-widest">Review</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => alert('Actions for #INS-9011-P')} className="text-slate-500 hover:text-white transition-all"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-white/[0.01] flex justify-center border-t border-white/5">
                    <button onClick={() => alert('Loading more entries...')} className="text-[10px] font-black text-slate-500 hover:text-primary transition-all tracking-[0.3em] uppercase">Load More Entries</button>
                </div>
            </div>

            {/* Floating Action Button */}
            <button onClick={() => alert('Create new inspection')} className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-2xl shadow-[0_8px_30px_rgba(0,242,255,0.3)] flex items-center justify-center text-slate-950 hover:scale-105 active:scale-95 transition-all z-50 group">
                <span className="material-symbols-outlined font-black text-2xl group-hover:rotate-90 transition-transform duration-300">add</span>
            </button>
        </div>
    );
}
