'use client';

import { useState } from 'react';

export default function LeadsCRM() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-headline font-bold tracking-tight text-on-surface cyber-glow-cyan uppercase">Leads Management</h2>
                    <p className="text-slate-400 text-sm font-body">Orchestrating growth through architectural precision.</p>
                </div>
                <button
                    onClick={() => alert('Opening new lead creation form...')}
                    className="bg-primary text-slate-900 font-headline font-bold py-3 px-6 rounded-lg flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                >
                    <span className="material-symbols-outlined">add</span>
                    NEW LEAD
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all">
                    <div>
                        <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Total Leads</p>
                        <h3 className="text-3xl font-headline font-bold text-on-surface">1,284</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-tertiary">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span className="text-xs font-bold">+12% vs last month</span>
                    </div>
                </div>
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all">
                    <div>
                        <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Qualified Leads</p>
                        <h3 className="text-3xl font-headline font-bold text-on-surface">412</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-tertiary">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span className="text-xs font-bold">+5% conversion</span>
                    </div>
                </div>
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all">
                    <div>
                        <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Conversion Rate</p>
                        <h3 className="text-3xl font-headline font-bold text-on-surface">32.1%</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-tertiary">
                        <span className="material-symbols-outlined text-sm">insights</span>
                        <span className="text-xs font-bold">+2.4% yield increase</span>
                    </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col justify-between hover:bg-primary/10 transition-all">
                    <div>
                        <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary mb-1">Expected Revenue</p>
                        <h3 className="text-3xl font-headline font-bold text-primary cyber-glow-cyan">$2.4M</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-slate-500">
                        <span className="text-xs font-bold">Based on 412 qualified entities</span>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 p-4 rounded-xl flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px] relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                    <input
                        className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-10 text-sm focus:ring-1 focus:ring-primary/30 outline-none transition-all text-on-surface"
                        placeholder="Search Leads..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="bg-white/5 border border-white/5 text-slate-300 text-sm rounded-lg py-2 px-4 focus:ring-1 focus:ring-primary/30 outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Status: All</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                </select>
                <select
                    className="bg-white/5 border border-white/5 text-slate-300 text-sm rounded-lg py-2 px-4 focus:ring-1 focus:ring-primary/30 outline-none"
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                >
                    <option value="all">Service: All</option>
                    <option value="webdev">Web Dev</option>
                    <option value="ai">AI Solutions</option>
                    <option value="marketing">Marketing</option>
                </select>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg text-sm text-slate-400 border border-white/5">
                    <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                    <span>Last 30 Days</span>
                </div>
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">filter_list</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Leads Table Area */}
                <div className="lg:col-span-8">
                    <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-white/5">
                                        <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Lead Name</th>
                                        <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Company</th>
                                        <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Service</th>
                                        <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Status</th>
                                        <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Lead Score</th>
                                        <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border border-white/10 group-hover:border-primary/40 transition-all bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">JV</div>
                                                <div>
                                                    <p className="text-sm font-bold text-on-surface">Julian Vane</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">LinkedIn Referral</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">TechSprint AI</td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded-sm bg-secondary/10 text-secondary text-[9px] font-headline font-bold uppercase tracking-wider border border-secondary/20 whitespace-nowrap">AI Solutions</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[9px] font-bold uppercase tracking-wider">New</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full shadow-[0_0_8px_rgba(0,242,255,0.6)]" style={{ width: '85%' }}></div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => alert('Viewing details for Julian Vane')} className="material-symbols-outlined text-[20px] text-slate-500 hover:text-primary transition-colors">visibility</button>
                                                <button onClick={() => alert('Opening chat with Julian Vane')} className="material-symbols-outlined text-[20px] text-slate-500 hover:text-primary transition-colors">chat_bubble</button>
                                                <button onClick={() => alert('More options for Julian Vane')} className="material-symbols-outlined text-[20px] text-slate-500 hover:text-primary transition-colors">more_vert</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border border-white/10 group-hover:border-primary/40 transition-all bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary">SC</div>
                                                <div>
                                                    <p className="text-sm font-bold text-on-surface">Sarah Chen</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Google Ads</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">NexFlow Systems</td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-headline font-bold uppercase tracking-wider border border-primary/20 whitespace-nowrap">Web Dev</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[9px] font-bold uppercase tracking-wider">Contacted</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full shadow-[0_0_8px_rgba(0,242,255,0.6)]" style={{ width: '62%' }}></div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => alert('Viewing details for Sarah Chen')} className="material-symbols-outlined text-[20px] text-slate-500 hover:text-primary transition-colors">visibility</button>
                                                <button onClick={() => alert('Opening chat with Sarah Chen')} className="material-symbols-outlined text-[20px] text-slate-500 hover:text-primary transition-colors">chat_bubble</button>
                                                <button onClick={() => alert('More options for Sarah Chen')} className="material-symbols-outlined text-[20px] text-slate-500 hover:text-primary transition-colors">more_vert</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border border-white/10 group-hover:border-primary/40 transition-all bg-tertiary/10 flex items-center justify-center text-xs font-bold text-tertiary">MT</div>
                                                <div>
                                                    <p className="text-sm font-bold text-on-surface">Marcus Thorne</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Referral</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">Blackwood Group</td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded-sm bg-tertiary/10 text-tertiary text-[9px] font-headline font-bold uppercase tracking-wider border border-tertiary/20 whitespace-nowrap">Marketing</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[9px] font-bold uppercase tracking-wider">Qualified</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full shadow-[0_0_8px_rgba(0,242,255,0.6)]" style={{ width: '98%' }}></div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => alert('Viewing details for Marcus Thorne')} className="material-symbols-outlined text-[20px] text-slate-500 hover:text-primary transition-colors">visibility</button>
                                                <button onClick={() => alert('Opening chat with Marcus Thorne')} className="material-symbols-outlined text-[20px] text-slate-500 hover:text-primary transition-colors">chat_bubble</button>
                                                <button onClick={() => alert('More options for Marcus Thorne')} className="material-symbols-outlined text-[20px] text-slate-500 hover:text-primary transition-colors">more_vert</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 flex items-center justify-between bg-white/5 border-t border-white/5">
                            <p className="text-xs text-slate-500 font-bold uppercase">Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, 1284)} of 1,284 leads</p>
                            <div className="flex items-center gap-4">
                                <button
                                    className="text-slate-500 hover:text-on-surface transition-colors disabled:opacity-30"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <span className="text-xs font-headline font-bold text-primary tracking-widest uppercase">PAGE {currentPage}</span>
                                <button
                                    className="text-slate-500 hover:text-on-surface transition-colors disabled:opacity-30"
                                    disabled={currentPage >= 129}
                                    onClick={() => setCurrentPage((p) => Math.min(129, p + 1))}
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lead Intelligence Panel */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden transition-all hover:border-primary/30">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-headline font-bold text-on-surface uppercase tracking-tight">Lead Velocity</h4>
                                <span className="material-symbols-outlined text-primary cyber-glow-cyan">analytics</span>
                            </div>
                            <div className="h-32 flex items-end gap-2 px-2">
                                <div className="flex-1 bg-white/5 rounded-t hover:bg-primary/20 transition-all h-[30%]"></div>
                                <div className="flex-1 bg-white/5 rounded-t hover:bg-primary/20 transition-all h-[45%]"></div>
                                <div className="flex-1 bg-white/5 rounded-t hover:bg-primary/20 transition-all h-[25%]"></div>
                                <div className="flex-1 bg-white/5 rounded-t hover:bg-primary/20 transition-all h-[60%]"></div>
                                <div className="flex-1 bg-primary/20 rounded-t h-[80%] border-t-2 border-primary shadow-[0_0_15px_rgba(0,242,255,0.3)]"></div>
                                <div className="flex-1 bg-white/5 rounded-t hover:bg-primary/20 transition-all h-[50%]"></div>
                                <div className="flex-1 bg-white/5 rounded-t hover:bg-primary/20 transition-all h-[70%]"></div>
                            </div>
                            <div className="flex justify-between mt-2 px-1">
                                <span className="text-[8px] font-headline font-bold text-slate-500 uppercase tracking-widest">Mon</span>
                                <span className="text-[8px] font-headline font-bold text-slate-500 uppercase tracking-widest">Tue</span>
                                <span className="text-[8px] font-headline font-bold text-slate-500 uppercase tracking-widest">Wed</span>
                                <span className="text-[8px] font-headline font-bold text-slate-500 uppercase tracking-widest">Thu</span>
                                <span className="text-[8px] font-headline font-bold text-primary uppercase tracking-widest">Fri</span>
                                <span className="text-[8px] font-headline font-bold text-slate-500 uppercase tracking-widest">Sat</span>
                                <span className="text-[8px] font-headline font-bold text-slate-500 uppercase tracking-widest">Sun</span>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
                    </section>

                    <section className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl hover:border-primary/30 transition-all">
                        <h4 className="font-headline font-bold text-on-surface mb-6 uppercase tracking-tight">Recent Activity</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4 relative">
                                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 z-10 shadow-[0_0_8px_rgba(0,242,255,1)]"></div>
                                <div className="absolute left-[3px] top-4 w-[1px] h-full bg-white/5"></div>
                                <div>
                                    <p className="text-sm text-on-surface font-bold leading-tight">New lead from TechSprint via LinkedIn</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-headline font-bold mt-1">2 MINUTES AGO</p>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 z-10 shadow-[0_0_8px_rgba(99,102,241,1)]"></div>
                                <div className="absolute left-[3px] top-4 w-[1px] h-full bg-white/5"></div>
                                <div>
                                    <p className="text-sm text-on-surface font-bold leading-tight">Julian Vane opened &apos;Proposal_v2.pdf&apos;</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-headline font-bold mt-1">1 HOUR AGO</p>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <div className="w-2 h-2 rounded-full bg-tertiary mt-1.5 z-10 shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                                <div className="absolute left-[3px] top-4 w-[1px] h-10 bg-white/5"></div>
                                <div>
                                    <p className="text-sm text-on-surface font-bold leading-tight">Sarah Chen qualified for enterprise tier</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-headline font-bold mt-1">4 HOURS AGO</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => alert('Opening full activity history...')}
                            className="w-full mt-8 py-3 rounded-lg border border-white/10 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/5 transition-all"
                        >
                            View Full History
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}
