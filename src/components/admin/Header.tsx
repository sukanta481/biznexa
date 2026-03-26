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

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const notifications = [
        { icon: 'mail', color: 'text-primary', bg: 'bg-primary/10', title: 'New Inquiry: Quantum Systems', time: '12m ago', desc: 'Potential architecture audit for EU data center.' },
        { icon: 'check_circle', color: 'text-tertiary', bg: 'bg-tertiary/10', title: 'Milestone Completed', time: '2h ago', desc: 'AI Implementation Phase 1 for NexGen Financial.' },
        { icon: 'pending', color: 'text-rose-400', bg: 'bg-rose-500/10', title: 'Pending Bill: AWS Infra', time: '5h ago', desc: 'Invoice #UX-902 requires executive approval.' },
    ];

    return (
        <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 glass-panel border-b border-white/5 z-40 px-4 lg:px-8 flex justify-between items-center bg-surface/80">
            {/* Left: Hamburger + Breadcrumb */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all text-slate-400 hover:text-primary"
                    aria-label="Toggle sidebar"
                >
                    <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">{title}</span>
                    <span className="material-symbols-outlined text-[16px] text-slate-700">chevron_right</span>
                    <span className="text-[#00f2ff] font-bold">{subtitle}</span>
                </div>
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-4 lg:gap-6">
                {/* Search */}
                <div className="relative hidden lg:block">
                    <input
                        className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-xs w-64 focus:ring-1 focus:ring-[#00f2ff]/40 focus:bg-white/10 outline-none transition-all text-on-surface"
                        placeholder="Search architecture..."
                        type="text"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1.5 text-[18px] text-slate-500">search</span>
                </div>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                        className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all"
                        aria-label="Notifications"
                    >
                        <span className="material-symbols-outlined text-slate-400 hover:text-[#00f2ff] transition-colors">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0f172a]"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <h4 className="text-sm font-headline font-bold text-on-surface">Notifications</h4>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest cursor-pointer hover:text-primary/80">Mark all read</span>
                            </div>
                            {notifications.map((n, i) => (
                                <div key={i} className="p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">
                                    <div className={`w-8 h-8 rounded-full ${n.bg} flex items-center justify-center ${n.color} flex-shrink-0`}>
                                        <span className="material-symbols-outlined text-[16px]">{n.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-on-surface truncate">{n.title}</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                                    </div>
                                    <span className="text-[9px] text-slate-600 font-bold uppercase whitespace-nowrap">{n.time}</span>
                                </div>
                            ))}
                            <Link href="/admin/audit" className="block p-3 text-center text-[10px] font-headline font-bold uppercase tracking-[0.15em] text-primary hover:bg-primary/5 transition-colors">
                                View All Notifications
                            </Link>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                        className="h-9 w-9 rounded-lg overflow-hidden border border-white/10 p-0.5 bg-primary/10 flex items-center justify-center hover:border-primary/30 transition-all cursor-pointer"
                        aria-label="Profile menu"
                    >
                        <span className="text-xs font-bold text-primary">SS</span>
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                            <div className="p-4 border-b border-white/5">
                                <p className="text-sm font-bold text-on-surface">Sukanta Saha</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">admin@biznexa.studio</p>
                            </div>
                            <div className="py-1">
                                <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    My Profile
                                </Link>
                                <Link href="/admin/settings/site" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                    Site Settings
                                </Link>
                                <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">history</span>
                                    Activity Log
                                </Link>
                            </div>
                            <div className="border-t border-white/5 py-1">
                                <Link href="/admin/login" className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-all">
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
