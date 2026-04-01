'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'active' | 'inactive';
type EntityKey = 'banks' | 'branches' | 'sources' | 'payment-modes' | 'accounts';

interface BankRow { id: number; bank_name: string; status: Status; }
interface BranchRow { id: number; branch_name: string; bank_id: number; bank_name: string; status: Status; }
interface SourceRow { id: number; source_name: string; phone: string | null; status: Status; }
interface PaymentModeRow { id: number; mode_name: string; status: Status; }
interface AccountRow { id: number; account_name: string; bank_name: string; account_number: string; ifsc_code: string | null; status: Status; }

type AnyRow = BankRow | BranchRow | SourceRow | PaymentModeRow | AccountRow;

interface ApiResponse { items: AnyRow[]; total: number; }

// ─── Tab config (static metadata) ────────────────────────────────────────────

const TABS: { key: EntityKey; label: string; icon: string; addLabel: string; searchPlaceholder: string; totalLabel: string }[] = [
    { key: 'banks', label: 'Banks', icon: 'account_balance', addLabel: 'Add New Bank', searchPlaceholder: 'Filter banks by name...', totalLabel: 'banks' },
    { key: 'branches', label: 'Branches', icon: 'location_city', addLabel: 'Add New Branch', searchPlaceholder: 'Filter branches by name or bank...', totalLabel: 'branches' },
    { key: 'sources', label: 'Sources', icon: 'source', addLabel: 'Add New Source', searchPlaceholder: 'Filter sources by name...', totalLabel: 'sources' },
    { key: 'payment-modes', label: 'Payment Modes', icon: 'payments', addLabel: 'Add Payment Mode', searchPlaceholder: 'Filter payment modes...', totalLabel: 'payment modes' },
    { key: 'accounts', label: 'Accounts', icon: 'account_balance_wallet', addLabel: 'Add New Account', searchPlaceholder: 'Filter accounts...', totalLabel: 'accounts' },
];

const PER_PAGE = 15;

// ─── Helper: empty form state per entity ─────────────────────────────────────

function emptyForm(entity: EntityKey) {
    switch (entity) {
        case 'banks': return { bank_name: '', status: 'active' };
        case 'branches': return { branch_name: '', bank_id: '', status: 'active' };
        case 'sources': return { source_name: '', phone: '', status: 'active' };
        case 'payment-modes': return { mode_name: '', status: 'active' };
        case 'accounts': return { account_name: '', bank_name: '', account_number: '', ifsc_code: '', status: 'active' };
    }
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────

function MasterModal({
    entity,
    initial,
    bankOptions,
    onClose,
    onSaved,
}: {
    entity: EntityKey;
    initial: Record<string, string> | null;
    bankOptions: { id: number; bank_name: string }[];
    onClose: () => void;
    onSaved: () => void;
}) {
    const isEdit = !!initial;
    const [form, setForm] = useState<Record<string, string>>(initial ?? emptyForm(entity) as Record<string, string>);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const tab = TABS.find(t => t.key === entity)!;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const url = isEdit
                ? `/api/admin/inspection/masters/${entity}/${(initial as Record<string, string>).id}`
                : `/api/admin/inspection/masters/${entity}`;
            const res = await fetch(url, {
                method: isEdit ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                signal: AbortSignal.timeout(15_000),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error((j as { error?: string }).error ?? 'Save failed');
            }
            onSaved();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSaving(false);
        }
    }

    const fieldClass = "w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-body";
    const labelClass = "block text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 mb-2";

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[70] flex items-center justify-center p-4">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-lg font-bold font-headline text-white">
                        {isEdit ? 'Edit' : 'Add'} {tab.label.replace(/s$/, '')}
                    </h3>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Banks */}
                    {entity === 'banks' && (
                        <div>
                            <label className={labelClass}>Bank Name</label>
                            <input value={form.bank_name} onChange={e => set('bank_name', e.target.value)} required className={fieldClass} placeholder="e.g. State Bank of India" />
                        </div>
                    )}

                    {/* Branches */}
                    {entity === 'branches' && (<>
                        <div>
                            <label className={labelClass}>Branch Name</label>
                            <input value={form.branch_name} onChange={e => set('branch_name', e.target.value)} required className={fieldClass} placeholder="e.g. Kolkata Main Branch" />
                        </div>
                        <div>
                            <label className={labelClass}>Bank</label>
                            <div className="relative">
                                <select value={form.bank_id} onChange={e => set('bank_id', e.target.value)} required className={`${fieldClass} appearance-none`}>
                                    <option value="">Select a bank...</option>
                                    {bankOptions.map(b => <option key={b.id} value={b.id}>{b.bank_name}</option>)}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                            </div>
                        </div>
                    </>)}

                    {/* Sources */}
                    {entity === 'sources' && (<>
                        <div>
                            <label className={labelClass}>Source Name</label>
                            <input value={form.source_name} onChange={e => set('source_name', e.target.value)} required className={fieldClass} placeholder="e.g. Government Portal" />
                        </div>
                        <div>
                            <label className={labelClass}>Phone <span className="normal-case text-slate-600">(optional)</span></label>
                            <input value={form.phone} onChange={e => set('phone', e.target.value)} className={fieldClass} placeholder="+91 98765 43210" />
                        </div>
                    </>)}

                    {/* Payment Modes */}
                    {entity === 'payment-modes' && (
                        <div>
                            <label className={labelClass}>Mode Name</label>
                            <input value={form.mode_name} onChange={e => set('mode_name', e.target.value)} required className={fieldClass} placeholder="e.g. NEFT / RTGS" />
                        </div>
                    )}

                    {/* Accounts */}
                    {entity === 'accounts' && (<>
                        <div>
                            <label className={labelClass}>Account Name</label>
                            <input value={form.account_name} onChange={e => set('account_name', e.target.value)} required className={fieldClass} placeholder="e.g. Operations Fund" />
                        </div>
                        <div>
                            <label className={labelClass}>Bank Name</label>
                            <input value={form.bank_name} onChange={e => set('bank_name', e.target.value)} required className={fieldClass} placeholder="e.g. HDFC Bank" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Account Number</label>
                                <input value={form.account_number} onChange={e => set('account_number', e.target.value)} required className={fieldClass} placeholder="0123456789" />
                            </div>
                            <div>
                                <label className={labelClass}>IFSC Code <span className="normal-case text-slate-600">(optional)</span></label>
                                <input value={form.ifsc_code} onChange={e => set('ifsc_code', e.target.value)} className={fieldClass} placeholder="HDFC0001234" />
                            </div>
                        </div>
                    </>)}

                    {/* Status */}
                    <div>
                        <label className={labelClass}>Status</label>
                        <div className="flex gap-3">
                            {(['active', 'inactive'] as const).map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => set('status', s)}
                                    className={`flex-1 py-2.5 rounded-lg border text-xs font-headline font-bold uppercase tracking-wider transition-all ${
                                        form.status === s
                                            ? s === 'active'
                                                ? 'border-tertiary/50 bg-tertiary/10 text-tertiary'
                                                : 'border-slate-500/50 bg-white/5 text-slate-300'
                                            : 'border-white/10 text-slate-500 hover:border-white/20'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">{error}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all font-headline text-xs uppercase tracking-wider">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="flex-1 py-3 rounded-lg bg-primary text-slate-950 font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all font-headline text-xs uppercase tracking-wider disabled:opacity-50">
                            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InspectionMasters() {
    const [activeTab, setActiveTab] = useState<EntityKey>('banks');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Data state
    const [items, setItems] = useState<AnyRow[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [bankOptions, setBankOptions] = useState<{ id: number; bank_name: string }[]>([]);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Record<string, string> | null>(null);

    // Delete state
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Bulk import
    const [showDrawer, setShowDrawer] = useState(false);
    const [importEntity, setImportEntity] = useState('banks');
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tab = TABS.find(t => t.key === activeTab)!;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

    // ── Fetch data ─────────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search: searchQuery,
                page: String(currentPage),
                perPage: String(PER_PAGE),
            });
            const res = await fetch(`/api/admin/inspection/masters/${activeTab}?${params}`, {
                signal: AbortSignal.timeout(15_000),
            });
            if (!res.ok) throw new Error('Fetch failed');
            const data: ApiResponse = await res.json();
            setItems(data.items);
            setTotal(data.total);
        } catch {
            setItems([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [activeTab, searchQuery, currentPage]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Fetch bank options for branch dropdown
    useEffect(() => {
        if (activeTab === 'branches' || showModal) {
            fetch(`/api/admin/inspection/masters/banks?all=true`)
                .then(r => r.json())
                .then((d: { items: { id: number; bank_name: string }[] }) => setBankOptions(d.items ?? []))
                .catch(() => {});
        }
    }, [activeTab, showModal]);

    function handleTabChange(key: EntityKey) {
        setActiveTab(key);
        setSearchQuery('');
        setCurrentPage(1);
    }

    // ── Row helpers ────────────────────────────────────────────────────────────
    function getRowName(item: AnyRow): string {
        if ('bank_name' in item && activeTab === 'banks') return (item as BankRow).bank_name;
        if ('branch_name' in item) return (item as BranchRow).branch_name;
        if ('source_name' in item) return (item as SourceRow).source_name;
        if ('mode_name' in item) return (item as PaymentModeRow).mode_name;
        if ('account_name' in item) return (item as AccountRow).account_name;
        return '';
    }

    function getRowCode(item: AnyRow): string {
        if (activeTab === 'branches') {
            const b = item as BranchRow;
            return b.bank_name ?? `Bank #${b.bank_id}`;
        }
        if (activeTab === 'sources') return (item as SourceRow).phone ?? '—';
        if (activeTab === 'accounts') {
            const a = item as AccountRow;
            return a.account_number + (a.ifsc_code ? ` · ${a.ifsc_code}` : '');
        }
        return '#' + item.id;
    }

    function getCodeLabel(): string {
        switch (activeTab) {
            case 'branches': return 'Bank';
            case 'sources': return 'Phone';
            case 'accounts': return 'Account No. / IFSC';
            default: return 'ID';
        }
    }

    function toEditForm(item: AnyRow): Record<string, string> {
        return Object.fromEntries(
            Object.entries(item).map(([k, v]) => [k, v == null ? '' : String(v)])
        );
    }

    // ── Delete ─────────────────────────────────────────────────────────────────
    async function handleDelete(id: number, name: string) {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await fetch(`/api/admin/inspection/masters/${activeTab}/${id}`, {
                method: 'DELETE',
                signal: AbortSignal.timeout(10_000),
            });
            fetchData();
        } finally {
            setDeletingId(null);
        }
    }

    // ── Drag & drop ────────────────────────────────────────────────────────────
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) setImportFile(e.dataTransfer.files[0]);
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setImportFile(e.target.files[0]);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
                <div className="space-y-2">
                    <nav className="flex gap-2 text-[10px] font-headline uppercase tracking-widest text-slate-500 mb-1">
                        <span>Admin</span><span className="opacity-30">/</span>
                        <span>Inspection</span><span className="opacity-30">/</span>
                        <span className="text-primary">Masters</span>
                    </nav>
                    <h2 className="text-4xl font-bold font-headline tracking-tighter text-white">Inspection Masters</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => { setImportFile(null); setShowDrawer(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-slate-950 font-bold hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all font-headline text-xs uppercase tracking-wider"
                    >
                        <span className="material-symbols-outlined text-lg">upload</span>
                        Bulk Import (CSV)
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 md:gap-10 border-b border-white/5 overflow-x-auto scrollbar-hide">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => handleTabChange(t.key)}
                        className={`pb-4 border-b-2 whitespace-nowrap font-headline text-sm transition-all ${
                            activeTab === t.key
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-slate-500 hover:text-white'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-[#0f172a]/60 backdrop-blur-[16px] rounded-xl shadow-2xl overflow-hidden border border-white/[0.08]">
                {/* Toolbar */}
                <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f172a]/30 border-b border-white/5">
                    <div className="relative w-full md:w-96">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full rounded-lg border border-white/10 bg-slate-950/70 pl-12 pr-4 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-body"
                            placeholder={tab.searchPlaceholder}
                        />
                    </div>
                    <button
                        onClick={() => { setEditItem(null); setShowModal(true); }}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-tertiary text-[#00452d] font-bold hover:brightness-110 transition-all font-headline text-xs uppercase tracking-wider shadow-lg shadow-tertiary/10 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        {tab.addLabel}
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-6 md:px-8 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Name</th>
                                <th className="px-6 md:px-8 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">{getCodeLabel()}</th>
                                <th className="px-6 md:px-8 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Status</th>
                                <th className="px-6 md:px-8 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-3xl animate-spin block mb-2 opacity-50">progress_activity</span>
                                        Loading...
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">search_off</span>
                                        {searchQuery ? `No results for "${searchQuery}"` : `No ${tab.totalLabel} found. Add one to get started.`}
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => {
                                    const name = getRowName(item);
                                    const code = getRowCode(item);
                                    return (
                                        <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 md:px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-[#1e293b] flex items-center justify-center text-primary border border-white/5 shrink-0">
                                                        <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                                                    </div>
                                                    <span className="font-medium text-sm text-white">{name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 md:px-8 py-5 text-sm font-mono text-secondary">{code}</td>
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
                                                        onClick={() => { setEditItem(toEditForm(item)); setShowModal(true); }}
                                                        className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-500 hover:text-primary transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id, name)}
                                                        disabled={deletingId === item.id}
                                                        className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-500 hover:text-rose-500 transition-all disabled:opacity-40"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">
                                                            {deletingId === item.id ? 'hourglass_empty' : 'delete'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 md:px-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <span className="font-headline font-bold uppercase tracking-widest text-[11px]">
                        {loading ? 'Loading...' : `Showing ${items.length} of ${total} ${tab.totalLabel}`}
                    </span>
                    {totalPages > 1 && (
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:bg-[#1e293b] transition-all disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const p = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                return (
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
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:bg-[#1e293b] transition-all disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <MasterModal
                    entity={activeTab}
                    initial={editItem}
                    bankOptions={bankOptions}
                    onClose={() => { setShowModal(false); setEditItem(null); }}
                    onSaved={() => { setShowModal(false); setEditItem(null); fetchData(); }}
                />
            )}

            {/* Bulk Import Drawer */}
            {showDrawer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex justify-end">
                    <div className="w-full max-w-[500px] bg-[#020617] h-full shadow-2xl border-l border-white/[0.08] p-6 md:p-10 flex flex-col overflow-y-auto">
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
                            <div>
                                <label className="block text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Entity Selector</label>
                                <div className="relative">
                                    <select
                                        value={importEntity}
                                        onChange={e => setImportEntity(e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3.5 text-sm text-white outline-none transition focus:border-primary/50 font-body appearance-none"
                                    >
                                        {TABS.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Upload CSV File</label>
                                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer group transition-all ${
                                        isDragOver ? 'border-primary/60 bg-primary/5' : 'border-white/10 bg-slate-950/40 hover:border-primary/40 hover:bg-slate-950/60'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-5xl text-primary mb-4 group-hover:scale-110 transition-transform">cloud_upload</span>
                                    {importFile ? (
                                        <p className="text-sm font-semibold text-white">{importFile.name}</p>
                                    ) : (<>
                                        <p className="text-sm font-semibold mb-1 text-white">Drop .CSV file here</p>
                                        <p className="text-xs text-slate-500">Max size 5MB · Click to browse</p>
                                    </>)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 flex gap-4 border-t border-white/5">
                            <button
                                onClick={() => setShowDrawer(false)}
                                className="flex-1 py-4 bg-[#1e293b]/60 text-white rounded-lg font-headline font-bold text-[11px] uppercase tracking-widest hover:bg-[#1e293b] transition-all border border-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { alert('CSV bulk import coming soon.'); setShowDrawer(false); }}
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
