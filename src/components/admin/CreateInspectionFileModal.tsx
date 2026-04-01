'use client';

import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MasterItem { id: number; name: string; }
interface BranchItem { id: number; branch_name: string; bank_id: number; }

interface ColumnFlags {
    report_status_date: boolean;
    payment_status_date: boolean;
    paid_to_office_date: boolean;
    commission_pending: boolean;
}

interface InitData {
    banks: MasterItem[];
    sources: MasterItem[];
    paymentModes: MasterItem[];
    accounts: MasterItem[];
    columns: ColumnFlags;
}

interface Props {
    onClose: () => void;
    onSaved: (fileNumber: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

// ─── CSS class constants ──────────────────────────────────────────────────────

const iBase = 'w-full rounded-lg border bg-slate-950/70 px-3 py-3 text-sm outline-none transition font-body';
const iP = `${iBase} border-white/10 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20`;
const iS = `${iBase} border-white/10 text-white focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20`;
const iT = `${iBase} border-white/10 text-white focus:border-tertiary/50 focus:ring-2 focus:ring-tertiary/20`;
const iOff = `${iBase} border-white/5 text-slate-600 cursor-not-allowed`;
const iRo = `${iBase} border-white/5 text-primary/70 cursor-not-allowed font-mono`;
const lbl = 'text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block mb-2';
const optTxt = <span className="ml-1 normal-case text-slate-600 font-normal">(optional)</span>;

function Sel({ value, onChange, disabled, color, children }: {
    value: string; onChange: (v: string) => void; disabled?: boolean; color?: 'p' | 's' | 't'; children: React.ReactNode;
}) {
    const cls = disabled ? iOff : color === 's' ? iS : color === 't' ? iT : iP;
    return (
        <div className="relative">
            <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled} className={`${cls} appearance-none pr-10`}>
                {children}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateInspectionFileModal({ onClose, onSaved }: Props) {
    // Init data
    const [initData, setInitData] = useState<InitData | null>(null);
    const [initLoading, setInitLoading] = useState(true);
    const [initError, setInitError] = useState('');

    // Branches (AJAX)
    const [branches, setBranches] = useState<BranchItem[]>([]);
    const [branchesLoading, setBranchesLoading] = useState(false);

    // Form state
    const [fileDate, setFileDate] = useState(todayStr());
    const [fileType, setFileType] = useState<'office' | 'self'>('office');
    const [location, setLocation] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [propertyAddress, setPropertyAddress] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [bankId, setBankId] = useState('');
    const [branchId, setBranchId] = useState('');
    const [sourceId, setSourceId] = useState('');
    const [fees, setFees] = useState('');
    const [reportStatus, setReportStatus] = useState('');
    const [reportStatusDate, setReportStatusDate] = useState('');
    const [paymentModeId, setPaymentModeId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('due');
    const [paymentStatusDate, setPaymentStatusDate] = useState('');
    const [partialAmount, setPartialAmount] = useState('');
    const [paidToOffice, setPaidToOffice] = useState('');
    const [paidToOfficeDate, setPaidToOfficeDate] = useState('');
    const [commissionPending, setCommissionPending] = useState('');
    const [extraAmount, setExtraAmount] = useState('0');
    const [receivedAccountId, setReceivedAccountId] = useState('');
    const [notes, setNotes] = useState('');

    // Submit state
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [savedMsg, setSavedMsg] = useState('');

    // ── Load init data ─────────────────────────────────────────────────────────
    useEffect(() => {
        fetch('/api/admin/inspection/files/init', { signal: AbortSignal.timeout(15_000) })
            .then(r => r.json())
            .then((d: InitData) => { setInitData(d); setInitLoading(false); })
            .catch(() => { setInitError('Failed to load form data. Please close and retry.'); setInitLoading(false); });
    }, []);

    // ── Load branches when bank changes ────────────────────────────────────────
    useEffect(() => {
        if (!bankId) { setBranches([]); setBranchId(''); return; }
        setBranchesLoading(true);
        setBranchId('');
        fetch(`/api/admin/inspection/files/branches?bank_id=${bankId}`, { signal: AbortSignal.timeout(10_000) })
            .then(r => r.json())
            .then((d: { branches: BranchItem[] }) => setBranches(d.branches ?? []))
            .catch(() => setBranches([]))
            .finally(() => setBranchesLoading(false));
    }, [bankId]);

    // ── FileType change: clear disabled fields ─────────────────────────────────
    useEffect(() => {
        if (fileType === 'office') {
            setFees(''); setReportStatus(''); setReportStatusDate('');
            setPaymentModeId(''); setPaymentStatus('due'); setPaymentStatusDate('');
            setPartialAmount(''); setPaidToOffice(''); setPaidToOfficeDate('');
            setCommissionPending('');
        } else {
            setLocation('');
        }
    }, [fileType]);

    // ── Payment status changes ─────────────────────────────────────────────────
    useEffect(() => {
        if (fileType !== 'self') return;
        if (paymentStatus === 'due') {
            setPaymentStatusDate('');
            setPartialAmount('');
        } else if (paymentStatus === 'paid') {
            setPartialAmount('');
            if (!paymentStatusDate) setPaymentStatusDate(todayStr());
        } else {
            // partially
            if (!paymentStatusDate) setPaymentStatusDate(todayStr());
        }
    }, [paymentStatus]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Paid to office changes ─────────────────────────────────────────────────
    useEffect(() => {
        if (paidToOffice === 'paid') {
            if (!paidToOfficeDate) setPaidToOfficeDate(todayStr());
        } else {
            setPaidToOfficeDate('');
        }
    }, [paidToOffice]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Commission pending visibility ──────────────────────────────────────────
    const selectedModeName = initData?.paymentModes.find(m => String(m.id) === paymentModeId)?.name ?? '';
    const showCommissionPending =
        !!initData?.columns.commission_pending &&
        fileType === 'self' &&
        selectedModeName.toLowerCase().includes('gst') &&
        paidToOffice === 'paid';

    useEffect(() => {
        if (!showCommissionPending) setCommissionPending('');
    }, [showCommissionPending]);

    // ── Calculated preview values ──────────────────────────────────────────────
    const feesNum = parseFloat(fees) || 0;
    const extraNum = parseFloat(extraAmount) || 0;

    const commissionCalc = fileType === 'self'
        ? Math.round(feesNum * 0.30 * 100) / 100
        : location === 'kolkata' ? 300 : location === 'out_of_kolkata' ? 350 : 0;

    const officeAmountCalc = fileType === 'self'
        ? Math.round(feesNum * 0.70 * 100) / 100
        : null;

    const grossAmountCalc = Math.round((commissionCalc + extraNum) * 100) / 100;

    // Amount display in field
    const amountDisplayValue = fileType === 'self'
        ? paymentStatus === 'paid' ? fees
            : paymentStatus === 'partially' ? partialAmount
                : ''
        : '';

    // ── Reset form ─────────────────────────────────────────────────────────────
    function resetForm() {
        setFileDate(todayStr());
        setFileType('office');
        setLocation('');
        setCustomerName(''); setCustomerPhone('');
        setPropertyAddress(''); setPropertyValue('');
        setBankId(''); setBranchId(''); setSourceId('');
        setFees(''); setReportStatus(''); setReportStatusDate('');
        setPaymentModeId(''); setPaymentStatus('due'); setPaymentStatusDate('');
        setPartialAmount(''); setPaidToOffice(''); setPaidToOfficeDate('');
        setCommissionPending(''); setExtraAmount('0');
        setReceivedAccountId(''); setNotes('');
        setError('');
    }

    // ── Save ──────────────────────────────────────────────────────────────────
    async function handleSave(andAnother: boolean) {
        setSaving(true);
        setError('');
        setSavedMsg('');

        const payload = {
            file_date: fileDate,
            file_type: fileType,
            location: fileType === 'office' ? location || null : null,
            customer_name: customerName || null,
            customer_phone: customerPhone || null,
            property_address: propertyAddress || null,
            property_value: propertyValue ? parseFloat(propertyValue) : null,
            bank_id: bankId || null,
            branch_id: branchId || null,
            source_id: sourceId || null,
            fees: fileType === 'self' ? (fees ? parseFloat(fees) : null) : null,
            report_status: fileType === 'self' ? reportStatus || null : null,
            report_status_date: fileType === 'self' ? reportStatusDate || null : null,
            payment_mode_id: fileType === 'self' ? paymentModeId || null : null,
            payment_status: fileType === 'self' ? paymentStatus : null,
            payment_status_date: fileType === 'self' ? paymentStatusDate || null : null,
            amount: fileType === 'self' && paymentStatus === 'partially' ? (parseFloat(partialAmount) || null) : null,
            paid_to_office: fileType === 'self' ? paidToOffice || null : null,
            paid_to_office_date: fileType === 'self' ? paidToOfficeDate || null : null,
            commission_pending: showCommissionPending ? commissionPending || null : null,
            extra_amount: parseFloat(extraAmount) || 0,
            received_account_id: receivedAccountId || null,
            notes: notes || null,
        };

        try {
            const res = await fetch('/api/admin/inspection/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(20_000),
            });
            const json = await res.json() as { id?: number; file_number?: string; error?: string };
            if (!res.ok) throw new Error(json.error ?? 'Save failed');

            if (andAnother) {
                setSavedMsg(`Saved as ${json.file_number}. Form ready for next entry.`);
                resetForm();
            } else {
                onSaved(json.file_number ?? '');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSaving(false);
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    if (initLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                <div className="text-center text-slate-400 space-y-3">
                    <span className="material-symbols-outlined text-4xl animate-spin block">progress_activity</span>
                    <p className="text-sm font-body">Loading form data...</p>
                </div>
            </div>
        );
    }

    if (initError) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                <div className="text-center text-rose-400 bg-[#0f172a] border border-rose-500/20 rounded-xl p-8 max-w-sm">
                    <span className="material-symbols-outlined text-4xl block mb-3">error</span>
                    <p className="text-sm font-body mb-6">{initError}</p>
                    <button onClick={onClose} className="px-6 py-2.5 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-all font-headline text-xs uppercase tracking-wider">Close</button>
                </div>
            </div>
        );
    }

    const isSelf = fileType === 'self';
    const isOffice = fileType === 'office';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md overflow-y-auto py-6">
            <div className="relative w-full max-w-6xl mx-4 bg-[#0f172a]/95 backdrop-blur-[16px] shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden flex flex-col max-h-[92vh] border border-white/[0.08]">

                {/* ── Header ────────────────────────────────────────────────── */}
                <header className="p-6 md:p-8 border-b border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f172a]/40 shrink-0">
                    <div>
                        <nav className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Inspection</span>
                            <span className="material-symbols-outlined text-[10px] text-slate-500">chevron_right</span>
                            <span className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Files</span>
                            <span className="material-symbols-outlined text-[10px] text-slate-500">chevron_right</span>
                            <span className="text-[10px] font-headline uppercase tracking-widest text-primary">Create New</span>
                        </nav>
                        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white tracking-tighter">Create New Inspection File</h2>
                    </div>
                    <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white shrink-0">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                {/* ── Scrollable Content ────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                        {/* ── Left Column (2/3) ──────────────────────────────── */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Card 1: General Information */}
                            <section className="bg-[#1e293b]/40 border border-white/5 hover:border-primary/30 transition-all p-6 rounded-xl border-l-4 border-l-primary/40">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    <h3 className="font-headline font-bold uppercase tracking-widest text-sm text-white">General Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* Date */}
                                    <div>
                                        <label className={lbl}>Date</label>
                                        <input type="date" value={fileDate} onChange={e => setFileDate(e.target.value)} required className={`${iP} [color-scheme:dark]`} />
                                    </div>

                                    {/* File Type */}
                                    <div>
                                        <label className={lbl}>File Type</label>
                                        <Sel value={fileType} onChange={v => setFileType(v as 'office' | 'self')}>
                                            <option value="office">Office</option>
                                            <option value="self">Self</option>
                                        </Sel>
                                    </div>

                                    {/* Location — Office only */}
                                    <div>
                                        <label className={lbl}>Location {!isOffice && <span className="ml-1 normal-case text-slate-600 font-normal">(Office only)</span>}</label>
                                        <Sel value={location} onChange={setLocation} disabled={!isOffice}>
                                            <option value="">Select location...</option>
                                            <option value="kolkata">Kolkata</option>
                                            <option value="out_of_kolkata">Out of Kolkata</option>
                                        </Sel>
                                    </div>

                                    {/* Customer Name */}
                                    <div>
                                        <label className={lbl}>Customer Name {optTxt}</label>
                                        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Ramesh Gupta" className={iP} />
                                    </div>

                                    {/* Customer Phone */}
                                    <div>
                                        <label className={lbl}>Customer Phone {optTxt}</label>
                                        <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+91 98765 43210" className={iP} />
                                    </div>
                                </div>
                            </section>

                            {/* Card 2: Inspection Subject */}
                            <section className="bg-[#1e293b]/40 border border-white/5 hover:border-secondary/30 transition-all p-6 rounded-xl border-l-4 border-l-secondary/40">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-secondary">domain</span>
                                    <h3 className="font-headline font-bold uppercase tracking-widest text-sm text-white">Inspection Subject</h3>
                                </div>
                                <div className="space-y-5">

                                    {/* Property Address */}
                                    <div>
                                        <label className={lbl}>Property Address {optTxt}</label>
                                        <textarea value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Full property address..." rows={3} className={`${iS} resize-none`} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        {/* Property Value */}
                                        <div>
                                            <label className={lbl}>Property Value (₹) {optTxt}</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                                                <input type="number" min="0" step="0.01" value={propertyValue} onChange={e => setPropertyValue(e.target.value)} placeholder="0.00" className={`${iS} pl-8`} />
                                            </div>
                                        </div>

                                        {/* Source */}
                                        <div>
                                            <label className={lbl}>Source</label>
                                            <Sel value={sourceId} onChange={setSourceId} color="s">
                                                <option value="">Select source...</option>
                                                {initData?.sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </Sel>
                                        </div>

                                        {/* Bank */}
                                        <div>
                                            <label className={lbl}>Bank</label>
                                            <Sel value={bankId} onChange={setBankId} color="s">
                                                <option value="">Select bank...</option>
                                                {initData?.banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </Sel>
                                        </div>

                                        {/* Branch — AJAX */}
                                        <div>
                                            <label className={lbl}>Branch</label>
                                            <div className="relative">
                                                <select
                                                    value={branchId}
                                                    onChange={e => setBranchId(e.target.value)}
                                                    disabled={!bankId || branchesLoading}
                                                    className={`${!bankId ? iOff : iS} appearance-none pr-10`}
                                                >
                                                    <option value="">
                                                        {branchesLoading ? 'Loading...' : !bankId ? 'Select bank first' : 'Select branch...'}
                                                    </option>
                                                    {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                                                </select>
                                                <span className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm ${branchesLoading ? 'animate-spin' : ''}`}>
                                                    {branchesLoading ? 'progress_activity' : 'expand_more'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className={lbl}>Notes {optTxt}</label>
                                        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes or remarks..." rows={3} className={`${iS} resize-none`} />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* ── Right Column (1/3) ─────────────────────────────── */}
                        <div>
                            <section className="bg-[#1e293b]/40 border border-white/5 hover:border-tertiary/30 transition-all p-6 rounded-xl border-l-4 border-l-tertiary/40">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-tertiary">payments</span>
                                    <h3 className="font-headline font-bold uppercase tracking-widest text-sm text-white">Financial &amp; Processing</h3>
                                </div>

                                <div className="space-y-5">

                                    {/* Fees — Self only */}
                                    <div>
                                        <label className={lbl}>Fees (₹) {!isSelf && <span className="ml-1 normal-case text-slate-600 font-normal">(Self only)</span>}</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                                            <input type="number" min="0" step="0.01" value={fees} onChange={e => setFees(e.target.value)} disabled={!isSelf} placeholder="0.00" className={`${!isSelf ? iOff : iT} pl-8`} />
                                        </div>
                                    </div>

                                    {/* Report Status — Self only */}
                                    <div>
                                        <label className={lbl}>Report Status {!isSelf && <span className="ml-1 normal-case text-slate-600 font-normal">(Self only)</span>}</label>
                                        <Sel value={reportStatus} onChange={setReportStatus} disabled={!isSelf} color="t">
                                            <option value="">Select status...</option>
                                            <option value="draft">Draft</option>
                                            <option value="final_soft">Final Soft Copy</option>
                                            <option value="final_hard">Final Hard Copy</option>
                                        </Sel>
                                    </div>

                                    {/* Report Status Date — optional column, Self only */}
                                    {initData?.columns.report_status_date && (
                                        <div>
                                            <label className={lbl}>Report Status Date</label>
                                            <input type="date" value={reportStatusDate} onChange={e => setReportStatusDate(e.target.value)} disabled={!isSelf} className={`${!isSelf ? iOff : iT} [color-scheme:dark]`} />
                                        </div>
                                    )}

                                    {/* Payment Mode — Self only */}
                                    <div>
                                        <label className={lbl}>Payment Mode {!isSelf && <span className="ml-1 normal-case text-slate-600 font-normal">(Self only)</span>}</label>
                                        <Sel value={paymentModeId} onChange={setPaymentModeId} disabled={!isSelf} color="t">
                                            <option value="">Select mode...</option>
                                            {initData?.paymentModes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </Sel>
                                    </div>

                                    {/* Payment Status — Self only */}
                                    <div>
                                        <label className={lbl}>Payment Status {!isSelf && <span className="ml-1 normal-case text-slate-600 font-normal">(Self only)</span>}</label>
                                        <Sel value={paymentStatus} onChange={setPaymentStatus} disabled={!isSelf} color="t">
                                            <option value="due">Due</option>
                                            <option value="paid">Paid</option>
                                            <option value="partially">Partially</option>
                                        </Sel>
                                    </div>

                                    {/* Payment Status Date — optional column */}
                                    {initData?.columns.payment_status_date && (
                                        <div>
                                            <label className={lbl}>Payment Status Date</label>
                                            <input
                                                type="date"
                                                value={paymentStatusDate}
                                                onChange={e => setPaymentStatusDate(e.target.value)}
                                                disabled={!isSelf || paymentStatus === 'due'}
                                                className={`${!isSelf || paymentStatus === 'due' ? iOff : iT} [color-scheme:dark]`}
                                            />
                                        </div>
                                    )}

                                    {/* Amount Received — Self only */}
                                    <div>
                                        <label className={lbl}>
                                            Amount Received (₹) {!isSelf && <span className="ml-1 normal-case text-slate-600 font-normal">(Self only)</span>}
                                            {isSelf && paymentStatus === 'paid' && <span className="ml-1 normal-case text-tertiary/60 font-normal">(auto-filled)</span>}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                                            <input
                                                type="number" min="0" step="0.01"
                                                value={amountDisplayValue}
                                                onChange={e => setPartialAmount(e.target.value)}
                                                disabled={!isSelf || paymentStatus === 'due' || paymentStatus === 'paid'}
                                                readOnly={paymentStatus === 'paid'}
                                                placeholder={paymentStatus === 'due' ? '—' : '0.00'}
                                                className={`${
                                                    !isSelf || paymentStatus === 'due' ? iOff
                                                    : paymentStatus === 'paid' ? iRo
                                                    : iT
                                                } pl-8`}
                                            />
                                        </div>
                                    </div>

                                    {/* Paid to Office — Self only */}
                                    <div>
                                        <label className={lbl}>Paid to Office {!isSelf && <span className="ml-1 normal-case text-slate-600 font-normal">(Self only)</span>}</label>
                                        <Sel value={paidToOffice} onChange={setPaidToOffice} disabled={!isSelf} color="t">
                                            <option value="">Select...</option>
                                            <option value="paid">Paid</option>
                                            <option value="due">Due</option>
                                        </Sel>
                                    </div>

                                    {/* Paid to Office Date — optional column */}
                                    {initData?.columns.paid_to_office_date && (
                                        <div>
                                            <label className={lbl}>Paid to Office Date</label>
                                            <input
                                                type="date"
                                                value={paidToOfficeDate}
                                                onChange={e => setPaidToOfficeDate(e.target.value)}
                                                disabled={!isSelf || paidToOffice !== 'paid'}
                                                className={`${!isSelf || paidToOffice !== 'paid' ? iOff : iT} [color-scheme:dark]`}
                                            />
                                        </div>
                                    )}

                                    {/* Commission Pending — optional column, conditional */}
                                    {showCommissionPending && (
                                        <div>
                                            <label className={lbl}>Commission Pending <span className="text-rose-400">*</span></label>
                                            <div className="flex gap-3">
                                                {(['yes', 'no'] as const).map(v => (
                                                    <button
                                                        key={v}
                                                        type="button"
                                                        onClick={() => setCommissionPending(v)}
                                                        className={`flex-1 py-3 rounded-lg border text-xs font-headline font-bold uppercase tracking-wider transition-all ${
                                                            commissionPending === v
                                                                ? v === 'yes' ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-tertiary/50 bg-tertiary/10 text-tertiary'
                                                                : 'border-white/10 text-slate-500 hover:border-white/20'
                                                        }`}
                                                    >
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Calculated Fields ────────────────────── */}
                                    <div className="border-t border-white/5 pt-5 space-y-4">
                                        <p className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-600">Calculated (server-side)</p>

                                        {/* Office Amount */}
                                        <div>
                                            <label className={lbl}>Office Amount (₹)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                                                <input type="text" readOnly value={isSelf && officeAmountCalc !== null ? officeAmountCalc.toFixed(2) : '—'} className={`${iRo} pl-8`} />
                                            </div>
                                        </div>

                                        {/* Commission */}
                                        <div>
                                            <label className={lbl}>Commission (₹)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                                                <input type="text" readOnly value={commissionCalc > 0 ? commissionCalc.toFixed(2) : '—'} className={`${iRo} pl-8`} />
                                            </div>
                                        </div>

                                        {/* Extra Amount */}
                                        <div>
                                            <label className={lbl}>Extra Amount (₹)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                                                <input type="number" min="0" step="0.01" value={extraAmount} onChange={e => setExtraAmount(e.target.value)} placeholder="0.00" className={`${iT} pl-8`} />
                                            </div>
                                        </div>

                                        {/* Gross Amount */}
                                        <div>
                                            <label className={lbl}>Gross Amount (₹)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                                                <input type="text" readOnly value={grossAmountCalc.toFixed(2)} className={`${iRo} pl-8`} />
                                            </div>
                                        </div>

                                        {/* Received In */}
                                        <div>
                                            <label className={lbl}>Received In</label>
                                            <Sel value={receivedAccountId} onChange={setReceivedAccountId} color="t">
                                                <option value="">Select account...</option>
                                                {initData?.accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                            </Sel>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Error / Success */}
                    {error && (
                        <div className="mt-6 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3 flex items-start gap-3">
                            <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
                            {error}
                        </div>
                    )}
                    {savedMsg && (
                        <div className="mt-6 text-sm text-tertiary bg-tertiary/10 border border-tertiary/20 rounded-lg px-4 py-3 flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg shrink-0">check_circle</span>
                            {savedMsg}
                        </div>
                    )}
                </div>

                {/* ── Sticky Footer ─────────────────────────────────────────── */}
                <footer className="p-4 md:p-6 bg-[#1e293b]/90 border-t border-white/[0.08] flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 border border-white/10 text-white font-headline uppercase text-[11px] tracking-[0.1em] hover:bg-[#1e293b] transition-all rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSave(true)}
                        className="px-6 py-3 border border-white/10 text-white font-headline uppercase text-[11px] tracking-[0.1em] hover:bg-[#1e293b] transition-all rounded-lg disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save & Add Another'}
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSave(false)}
                        className="px-8 py-3 bg-tertiary text-[#00452d] font-headline font-bold uppercase text-[11px] tracking-[0.2em] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-lg flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                Save &amp; View File
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </>
                        )}
                    </button>
                </footer>

                {/* Decals */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[120px] -z-10 pointer-events-none" />
            </div>
        </div>
    );
}
