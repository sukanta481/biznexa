'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

interface NavItem {
    href: string;
    icon: string;
    label: string;
    badge?: string;
    badgeColor?: string;
    warning?: boolean;
    matchExact?: boolean;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
    {
        title: 'Main',
        items: [
            { href: '/admin', icon: 'space_dashboard', label: 'Dashboard', matchExact: true },
        ],
    },
    {
        title: 'Billing',
        items: [
            { href: '/admin/clients', icon: 'group', label: 'Clients' },
            { href: '/admin/bills', icon: 'receipt_long', label: 'Bills', badge: '3 Unpaid', badgeColor: 'rose' },
            { href: '/admin/expenses', icon: 'account_balance_wallet', label: 'Expenses' },
        ],
    },
    {
        title: 'Inspection',
        items: [
            { href: '/admin/inspections/dashboard', icon: 'troubleshoot', label: 'Dashboard' },
            { href: '/admin/inspections/files', icon: 'folder', label: 'Files', warning: true },
            { href: '/admin/inspections/masters', icon: 'database', label: 'Masters' },
        ],
    },
    {
        title: 'Content Manage',
        items: [
            { href: '/admin/content/homepage', icon: 'home', label: 'Homepage' },
            { href: '/admin/content/about', icon: 'info', label: 'About Us' },
            { href: '/admin/content/services', icon: 'design_services', label: 'Services' },
            { href: '/admin/content/case-studies', icon: 'cases', label: 'Case Studies' },
            { href: '/admin/blog', icon: 'article', label: 'Blog Posts' },
        ],
    },
    {
        title: 'Other',
        items: [
            { href: '/admin/leads', icon: 'architecture', label: 'Leads App' },
        ],
    },
    {
        title: 'Settings',
        items: [
            { href: '/admin/audit', icon: 'history', label: 'Activity Audit' },
            { href: '/admin/settings/site', icon: 'settings', label: 'Site Settings' },
            { href: '/admin/profile', icon: 'person', label: 'My Profile' },
        ],
    },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string, matchExact?: boolean) => {
        if (matchExact) return pathname === href;
        return pathname === href || pathname.startsWith(href + '/');
    };

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    const sidebarContent = (
        <>
            {/* Logo Area */}
            <div className="px-6 py-5 border-b border-white/[0.04]">
                <img
                    alt="Biznexa Logo"
                    className="h-9 w-auto mb-1.5 object-contain opacity-90 [filter:drop-shadow(0_0_8px_rgba(0,242,255,0.3))]"
                    src="/lightlogo.svg"
                />
                <div className="text-[9px] font-headline font-bold uppercase tracking-[0.25em] text-cyan-400/50">Logic Engine v2</div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-6 space-y-5 sidebar-scroll">
                {NAV_GROUPS.map(group => (
                    <div key={group.title}>
                        <div className="px-3 mb-2 text-[9px] font-bold text-slate-500/80 uppercase tracking-[0.2em]">{group.title}</div>
                        <div className="space-y-0.5">
                            {group.items.map(item => {
                                const active = isActive(item.href, item.matchExact);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={handleLinkClick}
                                        className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                                            active
                                                ? 'bg-gradient-to-r from-cyan-500/[0.12] to-blue-500/[0.06] text-cyan-400 shadow-sm shadow-cyan-500/5'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                                active ? 'bg-cyan-500/15' : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                                            }`}>
                                                <span className={`material-symbols-outlined text-[18px] transition-colors ${
                                                    active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                                                }`}>{item.icon}</span>
                                            </div>
                                            <span className="text-[13px] font-medium">{item.label}</span>
                                        </div>
                                        {item.badge && (
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                                item.badgeColor === 'rose'
                                                    ? 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/20'
                                                    : 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/20'
                                            }`}>{item.badge}</span>
                                        )}
                                        {item.warning && (
                                            <span className="material-symbols-outlined text-amber-500 text-[14px] fill-1">warning</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Logout — separate, at bottom */}
                <div>
                    <Link
                        href="/admin/login"
                        onClick={handleLinkClick}
                        className="group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.06]"
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] group-hover:bg-rose-500/10 transition-all duration-200">
                            <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-rose-400 transition-colors">logout</span>
                        </div>
                        <span className="text-[13px] font-medium">Logout</span>
                    </Link>
                </div>
            </nav>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 z-50 flex-col overflow-hidden bg-[#060e20]/95 backdrop-blur-xl border-r border-white/[0.04]">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar — overlay */}
            {isOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                        onClick={onClose}
                    />
                    <aside className="lg:hidden fixed left-0 top-0 h-full w-64 z-[60] flex flex-col overflow-hidden bg-[#060e20]/98 backdrop-blur-xl border-r border-white/[0.04]">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-all text-slate-400 hover:text-white"
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
