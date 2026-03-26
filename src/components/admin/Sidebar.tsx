'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    const sidebarContent = (
        <>
            <div className="p-6">
                <img
                    alt="Biznexa Logo"
                    className="h-10 w-auto mb-2 object-contain opacity-90 [filter:drop-shadow(0_0_8px_rgba(0,255,65,0.4))]"
                    src="/lightlogo.svg"
                />
                <div className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-[#00f2ff]/60">Logic Engine v2</div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 space-y-6 pb-8">
                {/* Main */}
                <div>
                    <div className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main</div>
                    <div className="space-y-1">
                        <Link
                            href="/admin"
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive('/admin')
                                    ? 'bg-gradient-to-r from-secondary/20 to-[#00f2ff]/10 border-r-3 border-[#00f2ff] text-[#00f2ff]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">grid_view</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                    </div>
                </div>

                {/* Billing */}
                <div>
                    <div className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Billing</div>
                    <div className="space-y-1">
                        <Link href="/admin/clients" onClick={handleLinkClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/clients') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[20px]">group</span>
                            <span className="text-sm font-medium">Clients</span>
                        </Link>
                        <Link href="/admin/bills" onClick={handleLinkClick} className={`flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/bills') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                <span className="text-sm font-medium">Bills</span>
                            </div>
                            <span className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 Unpaid</span>
                        </Link>
                        <Link href="/admin/expenses" onClick={handleLinkClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/expenses') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                            <span className="text-sm font-medium">Expenses</span>
                        </Link>
                    </div>
                </div>

                {/* Inspection */}
                <div>
                    <div className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inspection</div>
                    <div className="space-y-1">
                        <Link href="/admin/inspections/dashboard" onClick={handleLinkClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/inspections/dashboard') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[20px]">troubleshoot</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        <Link href="/admin/inspections/files" onClick={handleLinkClick} className={`flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/inspections/files') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">folder</span>
                                <span className="text-sm font-medium">Files</span>
                            </div>
                            <span className="material-symbols-outlined text-amber-500 text-[16px] fill-1">warning</span>
                        </Link>
                        <Link href="/admin/inspections/masters" onClick={handleLinkClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/inspections/masters') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[20px]">database</span>
                            <span className="text-sm font-medium">Masters</span>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <div className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Content</div>
                    <div className="space-y-1">
                        <Link href="/admin/leads" onClick={handleLinkClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/leads') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[20px]">architecture</span>
                            <span className="text-sm font-medium">Leads App</span>
                        </Link>
                        <Link href="/admin/blog" onClick={handleLinkClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/blog') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[20px]">article</span>
                            <span className="text-sm font-medium">Blog Posts</span>
                        </Link>
                    </div>
                </div>

                {/* Settings */}
                <div>
                    <div className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Settings</div>
                    <div className="space-y-1">
                        <Link href="/admin/audit" onClick={handleLinkClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/audit') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[20px]">history</span>
                            <span className="text-sm font-medium">Activity Audit</span>
                        </Link>
                        <Link href="/admin/settings/site" onClick={handleLinkClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/settings/site') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            <span className="text-sm font-medium">Site Settings</span>
                        </Link>
                        <Link href="/admin/profile" onClick={handleLinkClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all ${isActive('/admin/profile') ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border-r-3 border-primary text-primary' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined text-[20px]">person</span>
                            <span className="text-sm font-medium">My Profile</span>
                        </Link>
                        <Link href="/admin/login" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-rose-500/10 transition-all text-rose-400">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            <span className="text-sm font-medium">Logout</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar — always visible */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 glass-panel border-r border-white/5 z-50 flex-col overflow-hidden bg-surface/80">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar — overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    {/* Drawer */}
                    <aside className="lg:hidden fixed left-0 top-0 h-full w-64 glass-panel border-r border-white/5 z-[60] flex flex-col overflow-hidden bg-[#0f172a]/95 backdrop-blur-xl">
                        {/* Close button */}
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                                aria-label="Close sidebar"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>
                        {sidebarContent}
                    </aside>
                </>
            )}
        </>
    );
}
