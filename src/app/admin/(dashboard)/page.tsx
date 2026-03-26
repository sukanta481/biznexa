'use client';

import { useState, useRef, useEffect } from 'react';

function FilterButton({ icon, label, value, options, id, openDropdown, setOpenDropdown, onSelect }: { icon: string; label: string; value: string; options: string[]; id: string; openDropdown: string | null; setOpenDropdown: (v: string | null) => void; onSelect: (v: string) => void }) {
    return (
        <div className="relative">
            <button
                onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
                className={`bg-[#1e293b]/40 backdrop-blur-sm border px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${openDropdown === id ? 'border-primary/40 bg-[#1e293b]/60' : 'border-white/5 hover:border-white/20'}`}
            >
                <span className="material-symbols-outlined text-[16px] text-primary">{icon}</span>
                <span className="text-slate-300">{label}: {value}</span>
                <span className="material-symbols-outlined text-[14px] text-slate-500">expand_more</span>
            </button>
            {openDropdown === id && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => { onSelect(opt); setOpenDropdown(null); }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-all ${opt === value ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminDashboard() {
    const [dateFilter, setDateFilter] = useState('Last 30 Days');
    const [serviceFilter, setServiceFilter] = useState('All');
    const [regionFilter, setRegionFilter] = useState('EMEA');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'All Time'];
    const serviceOptions = ['All', 'Web Dev', 'AI Solutions', 'Marketing', 'Cloud Infra'];
    const regionOptions = ['EMEA', 'APAC', 'Americas', 'Global'];

    return (
        <div className="flex flex-col gap-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface tracking-tight cyber-glow-cyan uppercase">Global Operations</h1>
                    <p className="text-slate-400 text-sm mt-1">Network performance is stable. Growth is <span className="text-tertiary font-bold">+12.4%</span> this cycle.</p>
                </div>

                {/* Top-level filters */}
                <div className="flex flex-wrap items-center gap-3" ref={dropdownRef}>
                    <FilterButton icon="calendar_today" label="" value={dateFilter} options={dateOptions} id="date" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} onSelect={setDateFilter} />
                    <FilterButton icon="filter_list" label="Service" value={serviceFilter} options={serviceOptions} id="service" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} onSelect={setServiceFilter} />
                    <FilterButton icon="public" label="Region" value={regionFilter} options={regionOptions} id="region" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} onSelect={setRegionFilter} />
                </div>
            </div>

            {/* Metric cards with trend indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 p-5 md:p-6 rounded-xl relative overflow-hidden group hover:bg-[#1e293b]/60 hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl">payments</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Total Earnings</div>
                    <div className="text-3xl font-headline font-bold text-on-surface">$248,390</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-tertiary">+18.2%</span>
                        <span className="text-slate-500 uppercase tracking-tighter">vs last month</span>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 p-5 md:p-6 rounded-xl relative overflow-hidden group hover:bg-[#1e293b]/60 hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl">account_balance_wallet</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Total Expenses</div>
                    <div className="text-3xl font-headline font-bold text-on-surface">$52,140</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-rose-400">-4.1%</span>
                        <span className="text-slate-500 uppercase tracking-tighter">optimization gain</span>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 p-5 md:p-6 rounded-xl relative overflow-hidden group hover:bg-[#1e293b]/60 hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl">bolt</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Active Leads</div>
                    <div className="text-3xl font-headline font-bold text-on-surface">42</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-tertiary">+5</span>
                        <span className="text-slate-500 uppercase tracking-tighter">since Monday</span>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 p-5 md:p-6 rounded-xl relative overflow-hidden group hover:bg-[#1e293b]/60 hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl">star</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Retention Rate</div>
                    <div className="text-3xl font-headline font-bold text-on-surface">94.8%</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-tertiary">+0.5%</span>
                        <span className="text-slate-500 uppercase tracking-tighter">industry lead</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Revenue Velocity projection chart */}
                <div className="lg:col-span-2 bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 md:p-8 relative hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-8 md:mb-10">
                        <div>
                            <h3 className="text-lg font-headline font-bold text-on-surface">Revenue Velocity</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-tighter mt-1">Real-time fiscal throughput (USD/Day)</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-[10px] font-bold px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95">PROJECTION</button>
                        </div>
                    </div>

                    {/* Mock Projection Chart */}
                    <div className="h-48 md:h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                        {[40, 55, 35, 70, 85, 95, 90].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group rounded-t-sm hover:from-primary/30 transition-all cursor-pointer" style={{ height: `${h}%` }}>
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0f172a]/90 border border-white/10 rounded px-2 py-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    ${Math.round(h * 280)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 md:mt-6 px-2 text-[10px] font-headline font-bold text-slate-600 uppercase tracking-widest">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Expense Categories card with donut/pie chart */}
                <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 md:p-8 flex flex-col items-center hover:border-primary/30 transition-all">
                    <h3 className="text-lg font-headline font-bold text-on-surface self-start mb-8">Expense Categories</h3>

                    <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(30, 41, 59, 1)" strokeWidth="12"></circle>
                            <circle className="drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]" cx="50" cy="50" fill="transparent" r="40" stroke="#00f2ff" strokeDasharray="251.2" strokeDashoffset="138.16" strokeWidth="12"></circle>
                            <circle className="transform rotate-[162deg] origin-center" cx="50" cy="50" fill="transparent" r="40" stroke="#6366f1" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="12"></circle>
                            <circle className="transform rotate-[270deg] origin-center" cx="50" cy="50" fill="transparent" r="40" stroke="#10b981" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="12"></circle>
                        </svg>
                        <div className="absolute text-center">
                            <span className="block text-2xl font-headline font-bold text-on-surface">$52K</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Spent</span>
                        </div>
                    </div>

                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-primary shadow-[0_0_5px_rgba(0,242,255,0.5)]"></div>
                                <span className="text-slate-400 font-medium">Infrastructure</span>
                            </div>
                            <span className="font-bold text-on-surface">45%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-secondary shadow-[0_0_5px_rgba(99,102,241,0.5)]"></div>
                                <span className="text-slate-400 font-medium">SaaS Subs</span>
                            </div>
                            <span className="font-bold text-on-surface">30%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-tertiary shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-slate-400 font-medium">Outsourcing</span>
                            </div>
                            <span className="font-bold text-on-surface">25%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                {/* Recent Intelligence vertical feed */}
                <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden flex flex-col hover:border-primary/30 transition-all">
                    <div className="p-5 md:p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="text-lg font-headline font-bold text-on-surface">Recent Intelligence</h3>
                        <button className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-primary transition-colors">more_vert</button>
                    </div>
                    <div className="flex-1">
                        <div className="p-5 md:p-6 flex items-start gap-4 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-1 gap-2">
                                    <span className="font-bold text-sm text-on-surface truncate">New Inquiry: Quantum Systems</span>
                                    <span className="text-[10px] text-slate-500 font-headline font-bold uppercase whitespace-nowrap">12M AGO</span>
                                </div>
                                <p className="text-xs text-[#b0b8c8]">Potential architecture audit for EU-based data center.</p>
                            </div>
                        </div>
                        <div className="p-5 md:p-6 flex items-start gap-4 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-1 gap-2">
                                    <span className="font-bold text-sm text-on-surface truncate">Milestone: AI Implementation Phase 1</span>
                                    <span className="text-[10px] text-slate-500 font-headline font-bold uppercase whitespace-nowrap">2H AGO</span>
                                </div>
                                <p className="text-xs text-[#b0b8c8]">Completed for Client: NexGen Financial. Billing generated.</p>
                            </div>
                        </div>
                        <div className="p-5 md:p-6 flex items-start gap-4 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 flex-shrink-0">
                                <span className="material-symbols-outlined">pending</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-1 gap-2">
                                    <span className="font-bold text-sm text-on-surface truncate">Pending Bill: AWS Core Infrastructure</span>
                                    <span className="text-[10px] text-slate-500 font-headline font-bold uppercase whitespace-nowrap">5H AGO</span>
                                </div>
                                <p className="text-xs text-[#b0b8c8]">Invoice #UX-902 requires executive approval.</p>
                            </div>
                        </div>
                    </div>
                    <button className="p-4 text-center text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-primary border-t border-white/5 hover:bg-primary/5 transition-colors w-full active:scale-[0.98]">
                        View Comprehensive Audit Log
                    </button>
                </div>

                {/* Right side of bottom grid */}
                <div className="flex flex-col gap-6">
                    {/* Project Status cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 p-5 md:p-6 rounded-xl relative hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all">
                                    <span className="material-symbols-outlined text-primary">rocket_launch</span>
                                </div>
                                <span className="text-[9px] font-headline font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/20 uppercase tracking-widest">ON TRACK</span>
                            </div>
                            <h4 className="font-bold text-on-surface mb-1 text-sm font-headline">Project Apollo</h4>
                            <p className="text-[11px] text-[#b0b8c8] mb-5 leading-relaxed">Enterprise-grade CMS overhaul for Global Logistics.</p>
                            <div className="w-full bg-white/5 h-1.5 rounded-full mb-2">
                                <div className="bg-primary h-full rounded-full shadow-[0_0_8px_#00f2ff]" style={{ width: '75%' }}></div>
                            </div>
                            <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                <span>75% Complete</span>
                                <span>$12,400 due</span>
                            </div>
                        </div>

                        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 p-5 md:p-6 rounded-xl relative hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-secondary/30 transition-all">
                                    <span className="material-symbols-outlined text-secondary">memory</span>
                                </div>
                                <span className="text-[9px] font-headline font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20 uppercase tracking-widest">RESEARCH</span>
                            </div>
                            <h4 className="font-bold text-on-surface mb-1 text-sm font-headline">AI Middleware</h4>
                            <p className="text-[11px] text-[#b0b8c8] mb-5 leading-relaxed">Building autonomous lead qualification agent.</p>
                            <div className="w-full bg-white/5 h-1.5 rounded-full mb-2">
                                <div className="bg-secondary h-full rounded-full shadow-[0_0_8px_#6366f1]" style={{ width: '32%' }}></div>
                            </div>
                            <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                <span>32% Complete</span>
                                <span>Lab phase</span>
                            </div>
                        </div>
                    </div>

                    {/* Global Milestone card */}
                    <div className="bg-gradient-to-br from-primary/5 to-transparent border border-white/5 p-5 md:p-6 rounded-xl flex gap-6 items-center flex-1 hover:border-primary/30 transition-all">
                        <div className="hidden sm:flex w-28 h-28 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 items-center justify-center relative group">
                            <span className="material-symbols-outlined text-4xl text-primary transition-transform group-hover:scale-110">emoji_events</span>
                            <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full"></div>
                        </div>
                        <div>
                            <div className="text-[10px] font-headline font-bold text-primary mb-1 uppercase tracking-[0.2em]">Global Milestone</div>
                            <h4 className="font-headline font-bold text-lg text-on-surface">Top Architecture Agency 2024</h4>
                            <p className="text-xs text-[#b0b8c8] mt-2 leading-relaxed">Biznexa has been recognized as the most innovative tech architecture firm in the tri-state area.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
