'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Expense {
    id: number;
    category: 'biznexa' | 'inspection' | 'general';
    type: 'income' | 'expense';
    title: string;
    description: string | null;
    amount: number;
    expense_date: string;
    created_at: string;
}

interface Stats {
    total_income: number;
    total_expense: number;
    biznexa_expense: number;
    inspection_expense: number;
    general_income: number;
    general_expense: number;
}

interface FormState {
    type: string;
    category: string;
    title: string;
    amount: string;
    expense_date: string;
    description: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(val: string): string {
    const [y, m, d] = val.split('T')[0].split('-').map(Number);
    return `${MONTHS[m - 1]} ${String(d).padStart(2, '0')}, ${y}`;
}

function fmtMoney(v: number): string {
    return `₹${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function today(): string {
    return new Date().toISOString().split('T')[0];
}

const BLANK_FORM: FormState = {
    type: 'expense',
    category: '',
    title: '',
    amount: '',
    expense_date: today(),
    description: '',
};

// ── Badge helpers ─────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
    return type === 'income'
        ? <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-tertiary/10 text-tertiary border border-tertiary/20">Income</span>
        : <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20">Expense</span>;
}

function CatBadge({ category }: { category: string }) {
    if (category === 'biznexa')
        return <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">BizNexa</span>;
    if (category === 'inspection')
        return <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">Inspection</span>;
    return <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">General</span>;
}

// ── Shared form fields ────────────────────────────────────────────────────────
function ExpenseFormFields({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
    const inp = 'w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition font-body placeholder:text-slate-600';
    const lbl = 'block text-[10px] font-bold font-label uppercase tracking-widest text-slate-500 mb-1.5';
    const sel = `${inp} appearance-none cursor-pointer`;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={lbl}>Type *</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={sel}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <div>
                    <label className={lbl}>Category *</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={sel}>
                        <option value="" disabled>Select Category</option>
                        <option value="biznexa">BizNexa</option>
                        <option value="inspection">Inspection</option>
                        <option value="general">General</option>
                    </select>
                </div>
            </div>
            <div>
                <label className={lbl}>Title *</label>
                <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Freelance Payment, Fuel Cost"
                    className={inp}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={lbl}>Amount (₹) *</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.amount}
                        onChange={e => setForm({ ...form, amount: e.target.value })}
                        placeholder="0.00"
                        className={inp}
                    />
                </div>
                <div>
                    <label className={lbl}>Date *</label>
                    <input
                        type="date"
                        value={form.expense_date}
                        onChange={e => setForm({ ...form, expense_date: e.target.value })}
                        className={`${inp} [color-scheme:dark]`}
                    />
                </div>
            </div>
            <div>
                <label className={lbl}>Description</label>
                <textarea
                    rows={2}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Optional details..."
                    className={`${inp} resize-none`}
                />
            </div>
        </div>
    );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-[#0f1c2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <h3 className="text-sm font-black font-headline uppercase tracking-[0.15em] text-white">{title}</h3>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ExpensesPage() {
    // Filters
    const [search, setSearch]     = useState('');
    const [category, setCategory] = useState('');
    const [type, setType]         = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo]     = useState('');
    const [page, setPage]         = useState(1);

    // Data
    const [records, setRecords]   = useState<Expense[]>([]);
    const [stats, setStats]       = useState<Stats | null>(null);
    const [total, setTotal]       = useState(0);
    const [loading, setLoading]   = useState(true);

    // Modals
    const [modal, setModal]       = useState<'add' | 'edit' | 'delete' | null>(null);
    const [active, setActive]     = useState<Expense | null>(null);
    const [form, setForm]         = useState<FormState>(BLANK_FORM);
    const [saving, setSaving]     = useState(false);
    const [formError, setFormError] = useState('');

    const LIMIT = 20;
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const p = new URLSearchParams();
            if (search)   p.set('search', search);
            if (category) p.set('category', category);
            if (type)     p.set('type', type);
            if (dateFrom) p.set('date_from', dateFrom);
            if (dateTo)   p.set('date_to', dateTo);
            p.set('page', String(page));
            const res = await fetch(`/api/admin/expenses?${p}`);
            if (res.ok) {
                const data = await res.json();
                setRecords(data.records ?? []);
                setStats(data.stats ?? null);
                setTotal(data.total ?? 0);
            }
        } finally {
            setLoading(false);
        }
    }, [search, category, type, dateFrom, dateTo, page]);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => { setPage(1); }, [search, category, type, dateFrom, dateTo]);

    // ── Modal helpers ─────────────────────────────────────────────────────────
    function openAdd() {
        setForm(BLANK_FORM);
        setFormError('');
        setModal('add');
    }

    function openEdit(r: Expense) {
        setActive(r);
        setForm({
            type: r.type,
            category: r.category,
            title: r.title,
            amount: String(r.amount),
            expense_date: r.expense_date.split('T')[0],
            description: r.description ?? '',
        });
        setFormError('');
        setModal('edit');
    }

    function openDelete(r: Expense) {
        setActive(r);
        setModal('delete');
    }

    function closeModal() {
        setModal(null);
        setActive(null);
        setSaving(false);
        setFormError('');
    }

    // ── CRUD ──────────────────────────────────────────────────────────────────
    async function handleAdd() {
        setFormError('');
        if (!form.category || !form.type || !form.title.trim() || !form.amount || !form.expense_date) {
            setFormError('Please fill all required fields.');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/admin/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (!res.ok) { setFormError(json.error ?? 'Failed to add record.'); return; }
            closeModal();
            fetchData();
        } catch {
            setFormError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    async function handleEdit() {
        if (!active) return;
        setFormError('');
        if (!form.category || !form.type || !form.title.trim() || !form.amount || !form.expense_date) {
            setFormError('Please fill all required fields.');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/expenses/${active.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (!res.ok) { setFormError(json.error ?? 'Failed to update record.'); return; }
            closeModal();
            fetchData();
        } catch {
            setFormError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!active) return;
        setSaving(true);
        try {
            await fetch(`/api/admin/expenses/${active.id}`, { method: 'DELETE' });
            closeModal();
            fetchData();
        } catch {
            /* silent */
        } finally {
            setSaving(false);
        }
    }

    function handleReset() {
        setSearch(''); setCategory(''); setType('');
        setDateFrom(''); setDateTo(''); setPage(1);
    }

    // ── Stat card ─────────────────────────────────────────────────────────────
    function StatCard({ label, value, borderColor, valueColor, children }: {
        label: string; value?: string; borderColor: string; valueColor: string; children?: React.ReactNode;
    }) {
        return (
            <div className={`bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 border-l-4 ${borderColor} p-5 rounded-xl`}>
                <p className="text-[10px] font-label font-bold uppercase tracking-widest text-slate-500 mb-2">{label}</p>
                {value !== undefined
                    ? <p className={`text-xl font-headline font-bold ${valueColor}`}>{value}</p>
                    : children
                }
            </div>
        );
    }

    const s = stats;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-headline tracking-tight text-on-surface cyber-glow-cyan uppercase">Expenses & Income</h2>
                    <p className="text-slate-400 font-body mt-1">Track all income and expenses — BizNexa, Inspection & General</p>
                </div>
                <button
                    onClick={openAdd}
                    className="bg-primary hover:bg-primary/80 text-slate-950 font-label text-[11px] font-black px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all uppercase tracking-tighter shadow-lg shadow-primary/20 active:scale-95"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Record
                </button>
            </div>

            {/* ── Stat Cards ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    label="Total Income"
                    value={loading ? '—' : fmtMoney(s?.total_income ?? 0)}
                    borderColor="border-l-tertiary"
                    valueColor="text-tertiary"
                />
                <StatCard
                    label="Total Expenses"
                    value={loading ? '—' : fmtMoney(s?.total_expense ?? 0)}
                    borderColor="border-l-rose-500"
                    valueColor="text-rose-400"
                />
                <StatCard
                    label="BizNexa Expenses"
                    value={loading ? '—' : fmtMoney(s?.biznexa_expense ?? 0)}
                    borderColor="border-l-secondary"
                    valueColor="text-secondary"
                />
                <StatCard
                    label="Inspection Expenses"
                    value={loading ? '—' : fmtMoney(s?.inspection_expense ?? 0)}
                    borderColor="border-l-amber-400"
                    valueColor="text-amber-400"
                />
                <StatCard
                    label="General (Inc / Exp)"
                    borderColor="border-l-purple-500"
                    valueColor=""
                >
                    {loading ? (
                        <p className="text-xl font-headline font-bold text-slate-500">—</p>
                    ) : (
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold font-headline text-tertiary">+{fmtMoney(s?.general_income ?? 0)}</p>
                            <p className="text-sm font-bold font-headline text-rose-400">-{fmtMoney(s?.general_expense ?? 0)}</p>
                        </div>
                    )}
                </StatCard>
            </div>

            {/* ── Filters ─────────────────────────────────────────────────── */}
            <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-4 rounded-xl flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search title or description..."
                        className="w-full rounded-lg border border-white/10 bg-slate-950/60 pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition font-body"
                    />
                </div>
                {/* Category */}
                <div className="bg-slate-900/50 px-3 py-2.5 rounded-lg flex items-center gap-2 border border-white/10">
                    <span className="material-symbols-outlined text-primary text-sm">category</span>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-6 cursor-pointer uppercase tracking-wider outline-none">
                        <option value="">All Categories</option>
                        <option value="biznexa">BizNexa</option>
                        <option value="inspection">Inspection</option>
                        <option value="general">General</option>
                    </select>
                </div>
                {/* Type */}
                <div className="bg-slate-900/50 px-3 py-2.5 rounded-lg flex items-center gap-2 border border-white/10">
                    <span className="material-symbols-outlined text-primary text-sm">swap_vert</span>
                    <select value={type} onChange={e => setType(e.target.value)} className="bg-transparent border-none text-xs font-label text-slate-300 focus:ring-0 p-0 pr-6 cursor-pointer uppercase tracking-wider outline-none">
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                {/* Date range */}
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => setDateFrom(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5 text-xs text-white outline-none focus:border-primary/50 transition [color-scheme:dark] font-body"
                    />
                    <span className="text-slate-500 text-xs">–</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => setDateTo(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5 text-xs text-white outline-none focus:border-primary/50 transition [color-scheme:dark] font-body"
                    />
                </div>
                {/* Reset */}
                <button
                    onClick={handleReset}
                    className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-xs font-label font-bold uppercase tracking-wider transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    Reset
                </button>
            </div>

            {/* ── Table ───────────────────────────────────────────────────── */}
            <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/5">
                                <th className="px-6 py-4 text-[10px] font-label font-black uppercase tracking-widest text-slate-500">Date</th>
                                <th className="px-6 py-4 text-[10px] font-label font-black uppercase tracking-widest text-slate-500">Title</th>
                                <th className="px-6 py-4 text-[10px] font-label font-black uppercase tracking-widest text-slate-500">Type</th>
                                <th className="px-6 py-4 text-[10px] font-label font-black uppercase tracking-widest text-slate-500">Category</th>
                                <th className="px-6 py-4 text-[10px] font-label font-black uppercase tracking-widest text-slate-500">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-label font-black uppercase tracking-widest text-slate-500">Description</th>
                                <th className="px-6 py-4 text-[10px] font-label font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-600 animate-spin block mb-2">progress_activity</span>
                                        <span className="text-slate-500 text-xs font-label uppercase tracking-widest">Loading...</span>
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-700 block mb-2">receipt_long</span>
                                        <span className="text-slate-500 text-xs font-label uppercase tracking-widest">No records yet</span>
                                    </td>
                                </tr>
                            ) : (
                                records.map(r => (
                                    <tr key={r.id} className="hover:bg-white/[0.025] transition-colors group">
                                        <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">{fmtDate(r.expense_date)}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-sm text-white">{r.title}</span>
                                        </td>
                                        <td className="px-6 py-4"><TypeBadge type={r.type} /></td>
                                        <td className="px-6 py-4"><CatBadge category={r.category} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {r.type === 'income'
                                                ? <span className="font-bold text-sm text-tertiary">+{fmtMoney(Number(r.amount))}</span>
                                                : <span className="font-bold text-sm text-rose-400">-{fmtMoney(Number(r.amount))}</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate">
                                            {r.description || <span className="text-slate-700">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(r)}
                                                    className="px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 text-[10px] font-black font-label uppercase tracking-wider transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => openDelete(r)}
                                                    className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-[10px] font-black font-label uppercase tracking-wider transition-all"
                                                >
                                                    Delete
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
                <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] font-label font-bold uppercase tracking-widest text-slate-500">
                        Showing {records.length} of {total} records
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-white/5 disabled:opacity-30 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const pg = totalPages <= 5 ? i + 1
                                : page <= 3 ? i + 1
                                : page >= totalPages - 2 ? totalPages - 4 + i
                                : page - 2 + i;
                            return (
                                <button
                                    key={pg}
                                    onClick={() => setPage(pg)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${pg === page ? 'bg-primary text-slate-950 shadow-[0_0_12px_rgba(0,242,255,0.2)]' : 'border border-white/10 text-slate-500 hover:text-primary hover:bg-white/5'}`}
                                >
                                    {pg}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-white/5 disabled:opacity-30 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Add Modal ───────────────────────────────────────────────── */}
            {modal === 'add' && (
                <Modal title="Add Record" onClose={closeModal}>
                    <ExpenseFormFields form={form} setForm={setForm} />
                    {formError && <p className="mt-3 text-xs text-rose-400 font-medium">{formError}</p>}
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={closeModal} className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs font-label font-bold uppercase tracking-wider transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={saving}
                            className="px-6 py-2.5 rounded-lg bg-primary text-slate-950 text-xs font-label font-black uppercase tracking-wider hover:bg-primary/80 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {saving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                            Add Record
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── Edit Modal ──────────────────────────────────────────────── */}
            {modal === 'edit' && active && (
                <Modal title="Edit Record" onClose={closeModal}>
                    <ExpenseFormFields form={form} setForm={setForm} />
                    {formError && <p className="mt-3 text-xs text-rose-400 font-medium">{formError}</p>}
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={closeModal} className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs font-label font-bold uppercase tracking-wider transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleEdit}
                            disabled={saving}
                            className="px-6 py-2.5 rounded-lg bg-primary text-slate-950 text-xs font-label font-black uppercase tracking-wider hover:bg-primary/80 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {saving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                            Save Changes
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── Delete Modal ─────────────────────────────────────────────── */}
            {modal === 'delete' && active && (
                <Modal title="Delete Record" onClose={closeModal}>
                    <div className="flex gap-4 items-start">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-rose-500">warning</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Are you sure you want to delete this record?</p>
                            <p className="text-sm text-slate-400 mt-1">
                                <span className="text-white font-semibold">&ldquo;{active.title}&rdquo;</span> will be permanently removed.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={closeModal} className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs font-label font-bold uppercase tracking-wider transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={saving}
                            className="px-6 py-2.5 rounded-lg bg-rose-500 text-white text-xs font-label font-black uppercase tracking-wider hover:bg-rose-600 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {saving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                            Delete
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
