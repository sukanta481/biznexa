'use client';

import { useState, useRef, useEffect } from 'react';

type MasterItem = {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
};

const tabsConfig = {
    Banks: {
        columns: ['Bank Name', 'Swift Code', 'Status', 'Actions'],
        items: [
            { id: 1, name: 'Global Reserve Trust', code: 'GLRT US 33', status: 'active' as const },
            { id: 2, name: 'NeoSphere Banking', code: 'NSPH EU 4X', status: 'active' as const },
            { id: 3, name: 'Zenith Capital Partners', code: 'ZNCP GB 1L', status: 'inactive' as const },
        ],
        icon: 'account_balance',
        codeLabel: 'Swift Code',
        addLabel: 'Add New Bank',
        searchPlaceholder: 'Search banks...',
        totalLabel: 'banks',
        totalCount: 42,
    },
    Branches: {
        columns: ['Branch Name', 'Branch Code', 'Status', 'Actions'],
        items: [
            { id: 1, name: 'Downtown Financial Hub', code: 'DFH-001', status: 'active' as const },
            { id: 2, name: 'East Side Operations', code: 'ESO-042', status: 'active' as const },
            { id: 3, name: 'West End Satellite Office', code: 'WSO-018', status: 'inactive' as const },
        ],
        icon: 'location_city',
        codeLabel: 'Branch Code',
        addLabel: 'Add New Branch',
        searchPlaceholder: 'Search branches...',
        totalLabel: 'branches',
        totalCount: 28,
    },
    Sources: {
        columns: ['Source Name', 'Source ID', 'Status', 'Actions'],
        items: [
            { id: 1, name: 'Government Portal', code: 'GOV-SRC-01', status: 'active' as const },
            { id: 2, name: 'Private Audit Firm', code: 'PVT-SRC-12', status: 'active' as const },
            { id: 3, name: 'Internal Assessment', code: 'INT-SRC-05', status: 'active' as const },
        ],
        icon: 'source',
        codeLabel: 'Source ID',
        addLabel: 'Add New Source',
        searchPlaceholder: 'Search sources...',
        totalLabel: 'sources',
        totalCount: 15,
    },
    'Payment Modes': {
        columns: ['Payment Mode', 'Mode Code', 'Status', 'Actions'],
        items: [
            { id: 1, name: 'Wire Transfer', code: 'WIRE-01', status: 'active' as const },
            { id: 2, name: 'NEFT / RTGS', code: 'NEFT-02', status: 'active' as const },
            { id: 3, name: 'Cheque Deposit', code: 'CHQ-03', status: 'inactive' as const },
        ],
        icon: 'payments',
        codeLabel: 'Mode Code',
        addLabel: 'Add Payment Mode',
        searchPlaceholder: 'Search payment modes...',
        totalLabel: 'payment modes',
        totalCount: 8,
    },
    Accounts: {
        columns: ['Account Name', 'Account No.', 'Status', 'Actions'],
        items: [
            { id: 1, name: 'Operations Fund', code: 'ACC-9920-OPS', status: 'active' as const },
            { id: 2, name: 'Client Escrow', code: 'ACC-4410-ESC', status: 'active' as const },
            { id: 3, name: 'Petty Cash Reserve', code: 'ACC-0012-PCR', status: 'inactive' as const },
        ],
        icon: 'account_balance_wallet',
        codeLabel: 'Account No.',
        addLabel: 'Add New Account',
        searchPlaceholder: 'Search accounts...',
        totalLabel: 'accounts',
        totalCount: 22,
    },
};

type TabKey = keyof typeof tabsConfig;

export default function InspectionMasters() {
    const [activeTab, setActiveTab] = useState<TabKey>('Banks');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const tab = tabsConfig[activeTab];

    const filteredItems = tab.items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTabChange = (t: TabKey) => {
        setActiveTab(t);
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
                <div className="space-y-2">
                    <nav className="flex gap-2 text-[10px] font-label uppercase tracking-widest text-slate-500 mb-1">
                        <span>Admin</span>
                        <span className="opacity-30">/</span>
                        <span>Inspection</span>
                        <span className="opacity-30">/</span>
                        <span className="text-primary">Masters</span>
                    </nav>
                    <h2 className="text-4xl font-bold font-headline tracking-tighter text-on-surface">Inspection Masters Management</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => alert('Downloading CSV templates...')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#192540]/40 backdrop-blur-md border border-white/10 text-primary hover:bg-primary/10 transition-all font-label text-xs uppercase tracking-wider"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download CSV Templates
                    </button>
                    <button
                        onClick={() => alert('Bulk import modal coming soon')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-slate-950 font-bold hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all font-label text-xs uppercase tracking-wider"
                    >
                        <span className="material-symbols-outlined text-lg">upload</span>
                        Bulk Import (CSV)
                    </button>
                </div>
            </div>

            {/* Tabs Interface */}
            <div className="flex gap-6 md:gap-8 border-b border-white/5 overflow-x-auto scrollbar-hide">
                {(Object.keys(tabsConfig) as TabKey[]).map((tabName) => (
                    <button
                        key={tabName}
                        onClick={() => handleTabChange(tabName)}
                        className={`pb-4 border-b-2 whitespace-nowrap font-headline text-sm transition-all ${
                            activeTab === tabName
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-slate-500 hover:text-on-surface'
                        }`}
                    >
                        {tabName}
                    </button>
                ))}
            </div>

            {/* Tab Content — Data Table Card */}
            <div className="bg-[#192540]/40 backdrop-blur-[16px] rounded-xl shadow-2xl overflow-hidden border border-white/5">
                {/* Card Toolbar */}
                <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f1930]/30 border-b border-white/5">
                    <div className="relative w-full md:w-96">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-white/5 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all outline-none text-on-surface"
                            placeholder={tab.searchPlaceholder}
                        />
                    </div>
                    <button
                        onClick={() => alert(`${tab.addLabel} form coming soon`)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-tertiary text-[#00452d] font-bold hover:brightness-110 transition-all font-label text-xs uppercase tracking-wider shadow-lg shadow-tertiary/10 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        {tab.addLabel}
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="bg-[#192540]/30 border-b border-white/5">
                                {tab.columns.map((col, i) => (
                                    <th
                                        key={col}
                                        className={`px-6 md:px-8 py-4 font-headline text-xs uppercase tracking-widest text-slate-500 ${
                                            i === tab.columns.length - 1 ? 'text-right' : ''
                                        }`}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">search_off</span>
                                        No results found for &ldquo;{searchQuery}&rdquo;
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 md:px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-[#192540]/60 flex items-center justify-center text-primary border border-primary/10">
                                                    <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                                                </div>
                                                <span className="font-medium text-sm text-on-surface">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-8 py-5 text-sm font-mono text-secondary">{item.code}</td>
                                        <td className="px-6 md:px-8 py-5">
                                            {item.status === 'active' ? (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-tertiary/10 text-tertiary border border-tertiary/20">Active</span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-white/5 text-slate-400 border border-white/10">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 md:px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => alert(`Edit: ${item.name}`)}
                                                    className="p-2 hover:bg-[#192540] rounded-lg text-slate-500 hover:text-primary transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                                            alert(`Deleted: ${item.name}`);
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-[#192540] rounded-lg text-slate-500 hover:text-rose-500 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 md:px-6 bg-[#0f1930]/20 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <span>Showing {filteredItems.length} of {tab.totalCount} {tab.totalLabel}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:bg-[#192540] transition-all disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        {[1, 2, 3].map(p => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all ${
                                    currentPage === p
                                        ? 'bg-primary text-slate-950 shadow-sm'
                                        : 'border border-white/10 hover:bg-[#192540]'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(3, p + 1))}
                            disabled={currentPage === 3}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:bg-[#192540] transition-all disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
