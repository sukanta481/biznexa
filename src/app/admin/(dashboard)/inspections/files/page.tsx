'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CreateInspectionFileModal from '@/components/admin/CreateInspectionFileModal';
import ViewInspectionFileModal from '@/components/admin/ViewInspectionFileModal';

interface InspectionFile {
    id: number;
    file_number: string;
    file_date: string;
    file_type: 'self' | 'office';
    customer_name: string | null;
    report_status: string | null;
    payment_status: string | null;
    fees: number | null;
    commission: number | null;
    gross_amount: number | null;
    bank_name: string | null;
    branch_name: string | null;
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    completed: 'bg-tertiary/10 text-tertiary border border-tertiary/20',
    draft: 'bg-white/5 text-slate-400 border border-white/10',
    submitted: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
};

const LIMIT = 20;

const PAYMENT_STATUS_LABELS: Record<string, string> = {
    pending_payment: 'Payment Pending (Due / Partial)',
    paid: 'Paid',
    due: 'Due',
    partially: 'Partially Paid',
};

const PAID_TO_OFFICE_LABELS: Record<string, string> = {
    due: 'Not Paid to Office',
    paid: 'Paid to Office',
};

function InspectionFilesInner() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Normal visible filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState(() => searchParams.get('type') ?? '');
    const [dateFrom, setDateFrom] = useState(() => searchParams.get('dateFrom') ?? '');
    const [dateTo, setDateTo] = useState(() => searchParams.get('dateTo') ?? '');
    const [currentPage, setCurrentPage] = useState(1);

    // Hidden deep-link filters (from dashboard cards)
    const [paymentStatusFilter] = useState(() => searchParams.get('payment_status') ?? '');
    const [paidToOfficeFilter] = useState(() => searchParams.get('paid_to_office') ?? '');

    const hasDashboardFilter = !!(paymentStatusFilter || paidToOfficeFilter || searchParams.get('dateFrom') || searchParams.get('dateTo'));

    const [showModal, setShowModal] = useState(false);
    const [editFileId, setEditFileId] = useState<number | null>(null);
    const [viewFileId, setViewFileId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [files, setFiles] = useState<InspectionFile[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            if (statusFilter) params.set('status', statusFilter);
            if (typeFilter) params.set('type', typeFilter);
            if (dateFrom) params.set('dateFrom', dateFrom);
            if (dateTo) params.set('dateTo', dateTo);
            if (paymentStatusFilter) params.set('payment_status', paymentStatusFilter);
            if (paidToOfficeFilter) params.set('paid_to_office', paidToOfficeFilter);
            params.set('page', String(currentPage));
            params.set('limit', String(LIMIT));

            const res = await fetch(`/api/admin/inspection/files?${params}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setFiles(data.files ?? []);
            setTotal(data.total ?? 0);
        } catch {
            setFiles([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, statusFilter, typeFilter, dateFrom, dateTo, paymentStatusFilter, paidToOfficeFilter, currentPage]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleDelete = useCallback(async (file: InspectionFile) => {
        if (!confirm(`Delete file "${file.file_number}"? This cannot be undone.`)) return;
        setDeletingId(file.id);
        try {
            const res = await fetch(`/api/admin/inspection/files/${file.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const json = await res.json() as { error?: string };
                alert(json.error ?? 'Delete failed.');
            } else {
                fetchFiles();
            }
        } catch {
            alert('Delete failed. Please try again.');
        } finally {
            setDeletingId(null);
        }
    }, [fetchFiles]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, typeFilter, dateFrom, dateTo]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = String(d.getFullYear()).slice(-2);
        return `${dd}-${mm}-${yy}`;
    };

    const formatFee = (file: InspectionFile) => {
        const amount = file.file_type === 'self' ? file.fees : file.commission;
        if (amount == null) return '—';
        return `₹${Number(amount).toLocaleString('en-IN')}`;
    };

    const statusLabel = (status: string | null) => status ?? '—';
    const statusClass = (status: string | null) =>
        statusStyles[(status ?? '').toLowerCase()] ?? 'bg-white/5 text-slate-400 border border-white/10';

    // Build a human-readable summary of active dashboard filters
    const dashFilterTags: string[] = [];
    if (typeFilter) dashFilterTags.push(`Type: ${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}`);
    if (paymentStatusFilter) dashFilterTags.push(`Payment: ${PAYMENT_STATUS_LABELS[paymentStatusFilter] ?? paymentStatusFilter}`);
    if (paidToOfficeFilter) dashFilterTags.push(`Office: ${PAID_TO_OFFICE_LABELS[paidToOfficeFilter] ?? paidToOfficeFilter}`);
    if (dateFrom && dateTo) dashFilterTags.push(`Date: ${formatDate(dateFrom)} – ${formatDate(dateTo)}`);
    else if (dateFrom) dashFilterTags.push(`From: ${formatDate(dateFrom)}`);
    else if (dateTo) dashFilterTags.push(`To: ${formatDate(dateTo)}`);

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-headline font-bold text-white tracking-tight">
                        Inspection Files
                        <span className="ml-3 inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                            {total}
                        </span>
                    </h2>
                    <p className="text-slate-400 text-sm font-body">Management and tracking of property inspection reports.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-tertiary px-6 py-3 rounded-lg flex items-center gap-2 font-headline font-bold text-[#00452d] text-xs uppercase tracking-widest shadow-[0_8px_24px_rgba(16,185,129,0.2)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.4)] transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    + Add New File
                </button>
            </div>

            {/* Dashboard filter context banner */}
            {hasDashboardFilter && dashFilterTags.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap bg-secondary/5 border border-secondary/20 rounded-xl px-5 py-3">
                    <span className="material-symbols-outlined text-secondary text-lg shrink-0">filter_alt</span>
                    <span className="text-[11px] font-headline font-bold uppercase tracking-widest text-secondary shrink-0">Dashboard Filter:</span>
                    <div className="flex flex-wrap gap-2 flex-1">
                        {dashFilterTags.map(tag => (
                            <span key={tag} className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-[11px] font-bold">{tag}</span>
                        ))}
                    </div>
                    <button
                        onClick={() => router.push('/admin/inspections/files')}
                        className="ml-auto flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-white transition-colors shrink-0"
                        title="Clear dashboard filters"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                        Clear
                    </button>
                </div>
            )}

            {/* Filter Bar */}
            <div className="bg-[#0f172a]/60 backdrop-blur-[16px] p-4 rounded-xl flex flex-wrap items-center gap-4 border border-white/[0.08]">
                <div className="relative flex-1 min-w-[200px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by file ref or client..."
                        className="w-full rounded-lg border border-white/10 bg-slate-950/70 pl-10 pr-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-body"
                    />
                </div>
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 appearance-none pr-10 font-body min-w-[160px]"
                    >
                        <option value="">Status: All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="submitted">Submitted</option>
                        <option value="draft">Draft</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                </div>
                <div className="relative">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 appearance-none pr-10 font-body min-w-[140px]"
                    >
                        <option value="">Type: All</option>
                        <option value="self">Self</option>
                        <option value="office">Office</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 [color-scheme:dark] font-body"
                    />
                    <span className="text-slate-500 text-xs">to</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 [color-scheme:dark] font-body"
                    />
                </div>
            </div>

            {/* Files Data Table */}
            <div className="bg-[#0f172a]/60 backdrop-blur-[16px] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">File Ref</th>
                                <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Client</th>
                                <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Type</th>
                                <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Date</th>
                                <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Status</th>
                                <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Fee</th>
                                <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 block opacity-30 animate-spin">progress_activity</span>
                                        Loading...
                                    </td>
                                </tr>
                            ) : files.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">search_off</span>
                                        No files found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                files.map((file) => (
                                    <tr key={file.id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                                        <td className="px-6 py-5">
                                            <span className="font-headline font-bold text-sm text-white">{file.file_number}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-300 font-body">{file.customer_name ?? '—'}</td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs text-slate-400 font-body capitalize">{file.file_type}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-400 font-body">{formatDate(file.file_date)}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass(file.report_status)}`}>
                                                {statusLabel(file.report_status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-headline font-bold text-white">{formatFee(file)}</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditFileId(file.id)}
                                                    className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-500 hover:text-primary transition-all"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => setViewFileId(file.id)}
                                                    className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-500 hover:text-secondary transition-all"
                                                    title="View"
                                                >
                                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file)}
                                                    disabled={deletingId === file.id}
                                                    className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-500 hover:text-rose-500 transition-all disabled:opacity-40"
                                                    title="Delete"
                                                >
                                                    <span className={`material-symbols-outlined text-xl ${deletingId === file.id ? 'animate-spin' : ''}`}>
                                                        {deletingId === file.id ? 'progress_activity' : 'delete'}
                                                    </span>
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
                <div className="px-6 py-4 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5">
                    <p className="text-[11px] text-slate-500 font-headline font-bold uppercase tracking-widest">
                        Showing {files.length} of {total} files
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 hover:text-primary disabled:opacity-30 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                        currentPage === page
                                            ? 'bg-primary text-slate-950 shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                                            : 'border border-white/10 hover:bg-white/5 hover:text-primary'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 hover:text-primary disabled:opacity-30 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Create New Inspection File Modal */}
            {showModal && (
                <CreateInspectionFileModal
                    onClose={() => setShowModal(false)}
                    onSaved={(fileNumber) => {
                        alert(`File ${fileNumber} created successfully.`);
                        setShowModal(false);
                        fetchFiles();
                    }}
                />
            )}

            {/* Edit Inspection File Modal */}
            {editFileId !== null && (
                <CreateInspectionFileModal
                    fileId={editFileId}
                    onClose={() => setEditFileId(null)}
                    onSaved={(fileNumber) => {
                        alert(`File ${fileNumber} updated successfully.`);
                        setEditFileId(null);
                        fetchFiles();
                    }}
                />
            )}

            {/* View Inspection File Modal */}
            {viewFileId !== null && (
                <ViewInspectionFileModal
                    fileId={viewFileId}
                    onClose={() => setViewFileId(null)}
                />
            )}
        </div>
    );
}

export default function InspectionFiles() {
    return (
        <Suspense>
            <InspectionFilesInner />
        </Suspense>
    );
}
