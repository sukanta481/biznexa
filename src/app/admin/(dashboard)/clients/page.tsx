'use client';

import { useState, useRef, useEffect } from 'react';

const dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'All Time'];
const serviceOptions = ['All', 'Cloud Infrastructure', 'AI Agent Deployment', 'Data Modeling', 'Supply Chain Optimization', 'Research & Development'];
const regionOptions = ['EMEA', 'APAC', 'AMER', 'Global'];

export default function ClientsManagement() {
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

    return (
        <div className="flex flex-col gap-8">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight cyber-glow-cyan uppercase">Client Management</h1>
                    <p className="text-slate-400 text-sm mt-1">Structural partnerships and fiscal performance overview.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3" ref={dropdownRef}>
                    {/* Date Filter */}
                    <div className="relative">
                        <div
                            className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:border-primary/30 transition-all"
                            onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                            <span className="text-slate-300">{dateFilter}</span>
                        </div>
                        {openDropdown === 'date' && (
                            <div className="absolute top-full left-0 mt-1 z-50 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl shadow-black/40 min-w-[160px] py-1">
                                {dateOptions.map((opt) => (
                                    <div
                                        key={opt}
                                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-all ${opt === dateFilter ? 'text-primary' : 'text-slate-300'}`}
                                        onClick={() => { setDateFilter(opt); setOpenDropdown(null); }}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Service Filter */}
                    <div className="relative">
                        <div
                            className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:border-primary/30 transition-all"
                            onClick={() => setOpenDropdown(openDropdown === 'service' ? null : 'service')}
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">filter_list</span>
                            <span className="text-slate-300">Service: {serviceFilter}</span>
                        </div>
                        {openDropdown === 'service' && (
                            <div className="absolute top-full left-0 mt-1 z-50 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl shadow-black/40 min-w-[200px] py-1">
                                {serviceOptions.map((opt) => (
                                    <div
                                        key={opt}
                                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-all ${opt === serviceFilter ? 'text-primary' : 'text-slate-300'}`}
                                        onClick={() => { setServiceFilter(opt); setOpenDropdown(null); }}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Region Filter */}
                    <div className="relative">
                        <div
                            className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:border-primary/30 transition-all"
                            onClick={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">public</span>
                            <span className="text-slate-300">Region: {regionFilter}</span>
                        </div>
                        {openDropdown === 'region' && (
                            <div className="absolute top-full left-0 mt-1 z-50 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl shadow-black/40 min-w-[140px] py-1">
                                {regionOptions.map((opt) => (
                                    <div
                                        key={opt}
                                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-all ${opt === regionFilter ? 'text-primary' : 'text-slate-300'}`}
                                        onClick={() => { setRegionFilter(opt); setOpenDropdown(null); }}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        className="flex items-center gap-2 bg-tertiary text-background px-5 py-2 rounded-lg font-headline font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-lg shadow-tertiary/20 ml-2"
                        onClick={() => alert('Add New Client form coming soon!')}
                    >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        Add New Client
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
                {/* Active Retainers */}
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-4xl">handshake</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-widest mb-1">Active Retainers</span>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-headline font-bold text-on-surface">12</span>
                            <span className="flex items-center text-tertiary text-[10px] font-bold mb-1.5">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                +2
                            </span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary/30 w-full"></div>
                </div>

                {/* Available Volume */}
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-4xl">account_balance_wallet</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-widest mb-1">Available Volume</span>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-headline font-bold text-on-surface text-primary cyber-glow-cyan">$1.2M</span>
                            <span className="flex items-center text-tertiary text-[10px] font-bold mb-1.5">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                14%
                            </span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary/30 w-full"></div>
                </div>

                {/* Average Retention */}
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-4xl">verified_user</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-widest mb-1">Average Retention</span>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-headline font-bold text-on-surface">94%</span>
                            <span className="flex items-center text-tertiary text-[10px] font-bold mb-1.5">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                0.4%
                            </span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary/30 w-full"></div>
                </div>

                {/* Monthly Growth */}
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-4xl">monitoring</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-widest mb-1">Monthly Growth</span>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-headline font-bold text-on-surface">+8.2%</span>
                            <span className="flex items-center text-tertiary text-[10px] font-bold mb-1.5">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                1.2%
                            </span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary/30 w-full"></div>
                </div>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Client Card 1 */}
                <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 p-8 rounded-xl relative flex flex-col group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-2">
                            <span className="text-xl font-headline font-bold text-primary/60 group-hover:text-primary transition-all">GF</span>
                        </div>
                        <span className="text-[9px] font-headline font-bold text-tertiary bg-tertiary/10 px-2.5 py-1 rounded border border-tertiary/20 uppercase tracking-widest">PAID</span>
                    </div>
                    <h3 className="text-lg font-headline font-bold text-on-surface mb-1 uppercase tracking-tight">Global Finance Corp</h3>
                    <p className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-[0.15em] mb-6">Cloud Infrastructure</p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                        <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Total Billable</div>
                            <div className="text-2xl font-headline font-bold text-on-surface">$245,000</div>
                        </div>
                        <button
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:bg-primary/20 hover:border-primary/30 transition-all"
                            onClick={() => alert('Opening details for Global Finance Corp')}
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                        </button>
                    </div>
                </div>

                {/* Client Card 2 */}
                <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-rose-500/20 p-8 rounded-xl relative flex flex-col group hover:border-rose-500/40 transition-all">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-2">
                            <span className="text-xl font-headline font-bold text-rose-400/60 group-hover:text-rose-400 transition-all">NL</span>
                        </div>
                        <span className="text-[9px] font-headline font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 uppercase tracking-widest">OVERDUE</span>
                    </div>
                    <h3 className="text-lg font-headline font-bold text-on-surface mb-1 uppercase tracking-tight">Neural Link Systems</h3>
                    <p className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-[0.15em] mb-6">AI Agent Deployment</p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                        <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Total Billable</div>
                            <div className="text-2xl font-headline font-bold text-on-surface">$89,200</div>
                        </div>
                        <button
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 transition-all"
                            onClick={() => alert('Payment overdue for Neural Link Systems')}
                        >
                            <span className="material-symbols-outlined text-[18px]">priority_high</span>
                        </button>
                    </div>
                </div>

                {/* Client Card 3 */}
                <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 p-8 rounded-xl relative flex flex-col group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-2">
                            <span className="text-xl font-headline font-bold text-primary/60 group-hover:text-primary transition-all">AA</span>
                        </div>
                        <span className="text-[9px] font-headline font-bold text-tertiary bg-tertiary/10 px-2.5 py-1 rounded border border-tertiary/20 uppercase tracking-widest">PAID</span>
                    </div>
                    <h3 className="text-lg font-headline font-bold text-on-surface mb-1 uppercase tracking-tight">Aether Architects</h3>
                    <p className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-[0.15em] mb-6">Data Modeling</p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                        <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Total Billable</div>
                            <div className="text-2xl font-headline font-bold text-on-surface">$112,000</div>
                        </div>
                        <button
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:bg-primary/20 hover:border-primary/30 transition-all"
                            onClick={() => alert('Opening details for Aether Architects')}
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                        </button>
                    </div>
                </div>

                {/* Client Card 4 */}
                <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 p-8 rounded-xl relative flex flex-col group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-2">
                            <span className="text-xl font-headline font-bold text-primary/60 group-hover:text-primary transition-all">VL</span>
                        </div>
                        <span className="text-[9px] font-headline font-bold text-tertiary bg-tertiary/10 px-2.5 py-1 rounded border border-tertiary/20 uppercase tracking-widest">PAID</span>
                    </div>
                    <h3 className="text-lg font-headline font-bold text-on-surface mb-1 uppercase tracking-tight">Velocity Logistics</h3>
                    <p className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-[0.15em] mb-6">Supply Chain Optimization</p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                        <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Total Billable</div>
                            <div className="text-2xl font-headline font-bold text-on-surface">$56,700</div>
                        </div>
                        <button
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:bg-primary/20 hover:border-primary/30 transition-all"
                            onClick={() => alert('Opening details for Velocity Logistics')}
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                        </button>
                    </div>
                </div>

                {/* Client Card 5 */}
                <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-rose-500/20 p-8 rounded-xl relative flex flex-col group hover:border-rose-500/40 transition-all">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-2">
                            <span className="text-xl font-headline font-bold text-rose-400/60 group-hover:text-rose-400 transition-all">QC</span>
                        </div>
                        <span className="text-[9px] font-headline font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 uppercase tracking-widest">OVERDUE</span>
                    </div>
                    <h3 className="text-lg font-headline font-bold text-on-surface mb-1 uppercase tracking-tight">Quantum Core Labs</h3>
                    <p className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-[0.15em] mb-6">Research &amp; Development</p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                        <div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Total Billable</div>
                            <div className="text-2xl font-headline font-bold text-on-surface">$412,000</div>
                        </div>
                        <button
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 transition-all"
                            onClick={() => alert('Payment overdue for Quantum Core Labs')}
                        >
                            <span className="material-symbols-outlined text-[18px]">priority_high</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
