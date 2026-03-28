'use client';

import { useState, useRef } from 'react';

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
        searchPlaceholder: 'Filter banks by name or code...',
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
        searchPlaceholder: 'Filter branches by name or code...',
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
        searchPlaceholder: 'Filter sources by name or ID...',
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
        searchPlaceholder: 'Filter payment modes...',
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
        searchPlaceholder: 'Filter accounts by name or number...',
        totalLabel: 'accounts',
        totalCount: 22,
    },
};

type TabKey = keyof typeof tabsConfig;

const validationErrors = [
    { row: 14, field: 'Swift Code', error: 'Format mismatch' },
    { row: 22, field: 'Bank Name', error: 'Required field empty' },
    { row: 45, field: 'Status', error: "Invalid value 'Activee'" },
];

export default function InspectionMasters() {
    const [activeTab, setActiveTab] = useState<TabKey>('Banks');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDrawer, setShowDrawer] = useState(false);

    // Bulk import state
    const [importEntity, setImportEntity] = useState('Banks');
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tab = tabsConfig[activeTab];

    const filteredItems = tab.items.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTabChange = (t: TabKey) => {
        setActiveTab(t);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) setImportFile(e.dataTransfer.files[0]);
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setImportFile(e.target.files[0]);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
                <div className="space-y-2">
                    <nav className="flex gap-2 text-[10px] font-headline uppercase tracking-widest text-slate-500 mb-1">
                        <span>Admin</span>
                        <span className="opacity-30">/</span>
                        <span>Inspection</span>
                        <span className="opacity-30">/</span>
                        <span className="text-primary">Masters</span>
                    </nav>
                    <h2 className="text-4xl font-bold font-headline tracking-tighter text-white">Inspection Masters Management</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => alert('Downloading CSV templates...')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e293b] border border-white/10 text-white hover:bg-[#1e293b]/80 transition-all font-headline text-xs uppercase tracking-wider"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download CSV Templates
                    </button>
                    <button
                        onClick={() => { setImportFile(null); setShowDrawer(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-slate-950 font-bold hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all font-headline text-xs uppercase tracking-wider"
                    >
                        <span className="material-symbols-outlined text-lg">upload</span>
                        Bulk Import (CSV)
                    </button>
                </div>
            </div>

            {/* Tabs Interface */}
            <div className="flex gap-6 md:gap-10 border-b border-white/5 overflow-x-auto scrollbar-hide">
                {(Object.keys(tabsConfig) as TabKey[]).map((tabName) => (
                    <button
                        key={tabName}
                        onClick={() => handleTabChange(tabName)}
                        className={`pb-4 border-b-2 whitespace-nowrap font-headline text-sm transition-all ${
                            activeTab === tabName
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-slate-500 hover:text-white'
                        }`}
                    >
                        {tabName}
                    </button>
                ))}
            </div>

            {/* Tab Content -- Data Table Card */}
            <div className="bg-[#0f172a]/60 backdrop-blur-[16px] rounded-xl shadow-2xl overflow-hidden border border-white/[0.08]">
                {/* Card Toolbar */}
                <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f172a]/30 border-b border-white/5">
                    <div className="relative w-full md:w-96">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-slate-950/70 pl-12 pr-4 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-body"
                            placeholder={tab.searchPlaceholder}
                        />
                    </div>
                    <button
                        onClick={() => alert(`${tab.addLabel} form coming soon`)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-tertiary text-[#00452d] font-bold hover:brightness-110 transition-all font-headline text-xs uppercase tracking-wider shadow-lg shadow-tertiary/10 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        {tab.addLabel}
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                {tab.columns.map((col, i) => (
                                    <th
                                        key={col}
                                        className={`px-6 md:px-8 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 ${
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
                                                <div className="w-9 h-9 rounded-lg bg-[#1e293b] flex items-center justify-center text-primary border border-white/5">
                                                    <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                                                </div>
                                                <span className="font-medium text-sm text-white">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-8 py-5 text-sm font-mono text-secondary">{item.code}</td>
                                        <td className="px-6 md:px-8 py-5">
                                            {item.status === 'active' ? (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary/10 text-tertiary border border-tertiary/20">Active</span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/10">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 md:px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => alert(`Edit: ${item.name}`)}
                                                    className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-500 hover:text-primary transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                                            alert(`Deleted: ${item.name}`);
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-500 hover:text-rose-500 transition-all"
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
                <div className="p-4 md:px-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <span className="font-headline font-bold uppercase tracking-widest text-[11px]">
                        Showing {filteredItems.length} of {tab.totalCount} {tab.totalLabel}
                    </span>
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:bg-[#1e293b] transition-all disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        {[1, 2, 3].map((p) => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all ${
                                    currentPage === p
                                        ? 'bg-primary text-slate-950 shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                                        : 'border border-white/10 hover:bg-[#1e293b]'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                            disabled={currentPage === 3}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:bg-[#1e293b] transition-all disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Import Drawer */}
            {showDrawer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex justify-end">
                    <div
                        className="w-full max-w-[500px] bg-[#020617] h-full shadow-2xl border-l border-white/[0.08] p-6 md:p-10 flex flex-col overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-bold font-headline text-white">Bulk Import Data</h3>
                            <button
                                onClick={() => setShowDrawer(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#1e293b] transition-all text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-8 flex-1">
                            {/* Entity Selector */}
                            <div>
                                <label className="block text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Entity Selector</label>
                                <div className="relative">
                                    <select
                                        value={importEntity}
                                        onChange={(e) => setImportEntity(e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3.5 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-body appearance-none"
                                    >
                                        <option>Banks</option>
                                        <option>Branches</option>
                                        <option>Sources</option>
                                        <option>Payment Modes</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Upload File</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer group transition-all ${
                                        isDragOver
                                            ? 'border-primary/60 bg-primary/5'
                                            : 'border-white/10 bg-slate-950/40 hover:border-primary/40 hover:bg-slate-950/60'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-5xl text-primary mb-4 group-hover:scale-110 transition-transform">cloud_upload</span>
                                    {importFile ? (
                                        <p className="text-sm font-semibold text-white">{importFile.name}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-semibold mb-1 text-white">Drop .CSV file here</p>
                                            <p className="text-xs text-slate-500">Max size 5MB &middot; Click to browse</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Validation Status */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Validation Status</h4>
                                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold">
                                        3 Validation Errors
                                    </span>
                                </div>
                                <div className="bg-slate-950/70 rounded-xl border border-white/10 overflow-hidden">
                                    <table className="w-full text-[11px]">
                                        <thead>
                                            <tr className="bg-white/5">
                                                <th className="px-4 py-2.5 text-left text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Row</th>
                                                <th className="px-4 py-2.5 text-left text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Field</th>
                                                <th className="px-4 py-2.5 text-left text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Error</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {validationErrors.map((err, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-3.5 font-mono text-white">{err.row}</td>
                                                    <td className="px-4 py-3.5 text-rose-500 font-medium">{err.field}</td>
                                                    <td className="px-4 py-3.5 text-slate-500 italic">{err.error}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/5 transition-all text-[11px] font-headline font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-lg">file_download</span>
                                    Download Full Error Log
                                </button>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="mt-8 pt-6 flex gap-4 border-t border-white/5">
                            <button
                                onClick={() => setShowDrawer(false)}
                                className="flex-1 py-4 bg-[#1e293b]/60 text-white rounded-lg font-headline font-bold text-[11px] uppercase tracking-widest hover:bg-[#1e293b] transition-all border border-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { alert('Processing import...'); setShowDrawer(false); }}
                                className="flex-1 py-4 bg-tertiary text-[#00452d] rounded-lg font-headline font-bold text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
                            >
                                Process Import
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
