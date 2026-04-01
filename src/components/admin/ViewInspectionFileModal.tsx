'use client';

import { useState, useEffect } from 'react';

interface FileDetail {
    id: number;
    file_number: string;
    file_date: string;
    file_type: 'self' | 'office';
    location: string | null;
    customer_name: string | null;
    customer_phone: string | null;
    property_address: string | null;
    property_value: number | null;
    bank_name: string | null;
    branch_name: string | null;
    source_name: string | null;
    fees: number | null;
    report_status: string | null;
    report_status_date: string | null;
    payment_mode_name: string | null;
    payment_status: string | null;
    payment_status_date: string | null;
    amount: number | null;
    paid_to_office: string | null;
    paid_to_office_date: string | null;
    office_amount: number | null;
    commission: number | null;
    extra_amount: number | null;
    gross_amount: number | null;
    commission_pending: string | null;
    received_account_name: string | null;
    notes: string | null;
}

interface Props {
    fileId: number;
    onClose: () => void;
}

function fmt(val: string | null | undefined) {
    return val ?? '—';
}
function fmtMoney(val: number | null | undefined) {
    if (val == null) return '—';
    return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}
function fmtDate(val: string | null | undefined) {
    if (!val) return '—';
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}-${mm}-${yy}`;
}
function fmtLabel(val: string | null | undefined) {
    if (!val) return '—';
    return val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const lbl = 'text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block mb-1';
const val = 'text-sm text-white font-body';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <span className={lbl}>{label}</span>
            <span className={val}>{children}</span>
        </div>
    );
}

const reportStatusColors: Record<string, string> = {
    draft: 'bg-white/5 text-slate-400 border-white/10',
    final_soft: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    final_hard: 'bg-tertiary/10 text-tertiary border-tertiary/20',
};
const paymentStatusColors: Record<string, string> = {
    due: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    paid: 'bg-tertiary/10 text-tertiary border-tertiary/20',
    partially: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export default function ViewInspectionFileModal({ fileId, onClose }: Props) {
    const [file, setFile] = useState<FileDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/admin/inspection/files/${fileId}`, { signal: AbortSignal.timeout(15_000) })
            .then(r => {
                if (!r.ok) throw new Error('Failed to load file');
                return r.json() as Promise<FileDetail>;
            })
            .then(data => { setFile(data); setLoading(false); })
            .catch(e => { setError(e.message ?? 'Error'); setLoading(false); });
    }, [fileId]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                <div className="text-center text-slate-400 space-y-3">
                    <span className="material-symbols-outlined text-4xl animate-spin block">progress_activity</span>
                    <p className="text-sm font-body">Loading file...</p>
                </div>
            </div>
        );
    }

    if (error || !file) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                <div className="text-center text-rose-400 bg-[#0f172a] border border-rose-500/20 rounded-xl p-8 max-w-sm">
                    <span className="material-symbols-outlined text-4xl block mb-3">error</span>
                    <p className="text-sm font-body mb-6">{error || 'File not found.'}</p>
                    <button onClick={onClose} className="px-6 py-2.5 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-all font-headline text-xs uppercase tracking-wider">Close</button>
                </div>
            </div>
        );
    }

    const isSelf = file.file_type === 'self';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md overflow-y-auto py-6">
            <div className="relative w-full max-w-5xl mx-4 bg-[#0f172a]/95 backdrop-blur-[16px] shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden flex flex-col max-h-[92vh] border border-white/[0.08]">

                {/* Header */}
                <header className="p-6 md:p-8 border-b border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f172a]/40 shrink-0">
                    <div>
                        <nav className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Inspection</span>
                            <span className="material-symbols-outlined text-[10px] text-slate-500">chevron_right</span>
                            <span className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Files</span>
                            <span className="material-symbols-outlined text-[10px] text-slate-500">chevron_right</span>
                            <span className="text-[10px] font-headline uppercase tracking-widest text-secondary">{file.file_number}</span>
                        </nav>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl md:text-3xl font-headline font-bold text-white tracking-tighter">{file.file_number}</h2>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                file.file_type === 'self'
                                    ? 'bg-primary/10 text-primary border-primary/20'
                                    : 'bg-secondary/10 text-secondary border-secondary/20'
                            }`}>
                                {file.file_type}
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs font-body mt-1">{fmtDate(file.file_date)}</p>
                    </div>
                    <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white shrink-0">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                        {/* Left (2/3) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* General Information */}
                            <section className="bg-[#1e293b]/40 border border-white/5 p-6 rounded-xl border-l-4 border-l-primary/40">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    <h3 className="font-headline font-bold uppercase tracking-widest text-sm text-white">General Information</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                    <Field label="File Date">{fmtDate(file.file_date)}</Field>
                                    <Field label="File Type"><span className="capitalize">{file.file_type}</span></Field>
                                    {!isSelf && <Field label="Location">{fmtLabel(file.location)}</Field>}
                                    <Field label="Customer Name">{fmt(file.customer_name)}</Field>
                                    <Field label="Customer Phone">{fmt(file.customer_phone)}</Field>
                                </div>
                            </section>

                            {/* Inspection Subject */}
                            <section className="bg-[#1e293b]/40 border border-white/5 p-6 rounded-xl border-l-4 border-l-secondary/40">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-secondary">domain</span>
                                    <h3 className="font-headline font-bold uppercase tracking-widest text-sm text-white">Inspection Subject</h3>
                                </div>
                                <div className="space-y-5">
                                    {file.property_address && (
                                        <div>
                                            <span className={lbl}>Property Address</span>
                                            <p className="text-sm text-white font-body whitespace-pre-wrap">{file.property_address}</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                        <Field label="Property Value">{fmtMoney(file.property_value)}</Field>
                                        <Field label="Source">{fmt(file.source_name)}</Field>
                                        <Field label="Bank">{fmt(file.bank_name)}</Field>
                                        <Field label="Branch">{fmt(file.branch_name)}</Field>
                                    </div>
                                    {file.notes && (
                                        <div>
                                            <span className={lbl}>Notes</span>
                                            <p className="text-sm text-slate-300 font-body whitespace-pre-wrap">{file.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right (1/3) */}
                        <div>
                            <section className="bg-[#1e293b]/40 border border-white/5 p-6 rounded-xl border-l-4 border-l-tertiary/40 space-y-5">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="material-symbols-outlined text-tertiary">payments</span>
                                    <h3 className="font-headline font-bold uppercase tracking-widest text-sm text-white">Financial &amp; Processing</h3>
                                </div>

                                {isSelf && <Field label="Fees">{fmtMoney(file.fees)}</Field>}

                                {isSelf && (
                                    <div>
                                        <span className={lbl}>Report Status</span>
                                        {file.report_status ? (
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${reportStatusColors[file.report_status] ?? 'bg-white/5 text-slate-400 border-white/10'}`}>
                                                {fmtLabel(file.report_status)}
                                            </span>
                                        ) : <span className={val}>—</span>}
                                        {file.report_status_date && (
                                            <span className="ml-2 text-xs text-slate-500">{fmtDate(file.report_status_date)}</span>
                                        )}
                                    </div>
                                )}

                                {isSelf && <Field label="Payment Mode">{fmt(file.payment_mode_name)}</Field>}

                                {isSelf && (
                                    <div>
                                        <span className={lbl}>Payment Status</span>
                                        {file.payment_status ? (
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${paymentStatusColors[file.payment_status] ?? 'bg-white/5 text-slate-400 border-white/10'}`}>
                                                {fmtLabel(file.payment_status)}
                                            </span>
                                        ) : <span className={val}>—</span>}
                                        {file.payment_status_date && (
                                            <span className="ml-2 text-xs text-slate-500">{fmtDate(file.payment_status_date)}</span>
                                        )}
                                    </div>
                                )}

                                {isSelf && file.amount != null && (
                                    <Field label="Amount Received">{fmtMoney(file.amount)}</Field>
                                )}

                                {isSelf && (
                                    <div>
                                        <span className={lbl}>Paid to Office</span>
                                        <span className={`text-sm font-body capitalize ${file.paid_to_office === 'paid' ? 'text-tertiary' : 'text-amber-400'}`}>
                                            {fmt(file.paid_to_office)}
                                        </span>
                                        {file.paid_to_office_date && (
                                            <span className="ml-2 text-xs text-slate-500">{fmtDate(file.paid_to_office_date)}</span>
                                        )}
                                    </div>
                                )}

                                {file.commission_pending != null && (
                                    <Field label="Commission Pending">
                                        <span className={file.commission_pending === 'yes' ? 'text-rose-400' : 'text-tertiary'}>
                                            {file.commission_pending.toUpperCase()}
                                        </span>
                                    </Field>
                                )}

                                <div className="border-t border-white/5 pt-5 space-y-4">
                                    <p className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-600">Calculated</p>
                                    {isSelf && <Field label="Office Amount (70%)">{fmtMoney(file.office_amount)}</Field>}
                                    <Field label="Commission">{fmtMoney(file.commission)}</Field>
                                    <Field label="Extra Amount">{fmtMoney(file.extra_amount)}</Field>
                                    <div>
                                        <span className={lbl}>Gross Amount</span>
                                        <span className="text-lg font-headline font-bold text-tertiary">{fmtMoney(file.gross_amount)}</span>
                                    </div>
                                    <Field label="Received In">{fmt(file.received_account_name)}</Field>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="p-4 md:p-6 bg-[#1e293b]/90 border-t border-white/[0.08] flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-3 border border-white/10 text-white font-headline uppercase text-[11px] tracking-[0.1em] hover:bg-[#1e293b] transition-all rounded-lg"
                    >
                        Close
                    </button>
                </footer>

                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary/5 blur-[120px] -z-10 pointer-events-none" />
            </div>
        </div>
    );
}
