'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    onMenuToggle?: () => void;
}

export default function Header({ title = 'Dashboard', subtitle = 'Main Overview', onMenuToggle }: HeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const notifications = [
        { icon: 'mail', color: 'text-cyan-400', bg: 'bg-cyan-500/10', title: 'New Inquiry: Quantum Systems', time: '12m ago', desc: 'Potential architecture audit for EU data center.' },
        { icon: 'check_circle', color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Milestone Completed', time: '2h ago', desc: 'AI Implementation Phase 1 for NexGen Financial.' },
        { icon: 'pending', color: 'text-rose-400', bg: 'bg-rose-500/10', title: 'Pending Bill: AWS Infra', time: '5h ago', desc: 'Invoice #UX-902 requires executive approval.' },
    ];

    return (
        <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 z-40 px-4 lg:px-8 flex justify-between items-center bg-[#060e20]/80 backdrop-blur-xl border-b border-white/[0.04]">
            {/* Left: Hamburger + Breadcrumb */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-all text-slate-400 hover:text-cyan-400"
                    aria-label="Toggle sidebar"
                >
                    <span className="material-symbols-outlined text-xl">menu</span>
                </button>
                <nav className="flex items-center gap-1.5 text-sm">
                    <span className="text-slate-500 font-medium">{title}</span>
                    <span className="material-symbols-outlined text-[14px] text-slate-600">chevron_right</span>
                    <span className="text-cyan-400 font-semibold">{subtitle}</span>
                </nav>
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
                {/* Search */}
                <div className="relative hidden lg:block">
                    <input
                        className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-2 pl-10 pr-4 text-xs w-56 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500/20 focus:bg-white/[0.05] outline-none transition-all text-slate-300 placeholder:text-slate-600"
                        placeholder="Search…"
                        type="text"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-slate-600">search</span>
                </div>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-all group"
                        aria-label="Notifications"
                    >
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-cyan-400 transition-colors text-xl">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#060e20]" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0a1628]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                            <div className="p-4 border-b border-white/[0.05] flex justify-between items-center">
                                <h4 className="text-sm font-bold text-white">Notifications</h4>
                                <button className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider hover:text-cyan-300 transition">Mark all read</button>
                            </div>
                            {notifications.map((n, i) => (
                                <div key={i} className="p-4 flex items-start gap-3 hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] cursor-pointer group">
                                    <div className={`w-9 h-9 rounded-xl ${n.bg} flex items-center justify-center ${n.color} flex-shrink-0 ring-1 ring-white/[0.04]`}>
                                        <span className="material-symbols-outlined text-[16px]">{n.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">{n.title}</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{n.desc}</p>
                                    </div>
                                    <span className="text-[9px] text-slate-600 font-semibold uppercase whitespace-nowrap">{n.time}</span>
                                </div>
                            ))}
                            <Link href="/admin/audit" className="block p-3 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400 hover:bg-cyan-500/[0.05] transition-colors">
                                View All Notifications
                            </Link>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                        className="h-9 w-9 rounded-xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-cyan-500/15 to-blue-500/10 flex items-center justify-center hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5 transition-all cursor-pointer"
                        aria-label="Profile menu"
                    >
                        <span className="text-xs font-bold text-cyan-400">SS</span>
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0a1628]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                            <div className="p-4 border-b border-white/[0.05]">
                                <p className="text-sm font-bold text-white">Sukanta Saha</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">admin@biznexa.studio</p>
                            </div>
                            <div className="py-1">
                                <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all">
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    My Profile
                                </Link>
                                <Link href="/admin/settings/site" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all">
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                    Site Settings
                                </Link>
                                <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all">
                                    <span className="material-symbols-outlined text-[18px]">history</span>
                                    Activity Log
                                </Link>
                            </div>
                            <div className="border-t border-white/[0.05] py-1">
                                <Link href="/admin/login" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/[0.06] transition-all">
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Logout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
