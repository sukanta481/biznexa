'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Bill {
  id: number;
  bill_number: string;
  client_id: number;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  client_gst: string | null;
  bill_date: string;
  due_date: string | null;
  subtotal: number;
  tax_percent: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  notes: string | null;
  terms: string | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_status: 'unpaid' | 'partial' | 'paid';
  paid_amount: number;
  payment_date: string | null;
  payment_method: string | null;
  payment_bank_id: number | null;
  payment_upi_id: number | null;
  payment_reference: string | null;
  payment_notes: string | null;
  bank_payment_method_id: number | null;
  upi_payment_method_id: number | null;
  created_at: string;
  items?: LineItem[];
}

interface LineItem {
  id?: number;
  description: string;
  quantity: string;
  unit_price: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
}

interface PaymentMethod {
  id: number;
  type: 'bank' | 'upi';
  name: string;
  is_default: number;
}

interface Stats {
  total_bills: number;
  total_amount: number;
  paid_amount: number;
  unpaid_amount: number;
}

interface FormState {
  client_id: string;
  bill_date: string;
  due_date: string;
  status: string;
  payment_status: string;
  paid_amount: string;
  payment_date: string;
  notes: string;
  terms: string;
  tax_enabled: boolean;
  tax_percent: string;
  discount_amount: string;
  bank_payment_method_id: string;
  upi_payment_method_id: string;
}

interface PayFormState {
  amount: string;
  method: string;
  bank_id: string;
  upi_id: string;
  payment_date: string;
  reference: string;
  notes: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(v: string | null): string {
  if (!v) return '—';
  const [y, m, d] = v.split('T')[0].split('-').map(Number);
  return `${MONTHS[m - 1]} ${String(d).padStart(2,'0')}, ${y}`;
}

function fmtMoney(v: number): string {
  return `₹${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function today(): string { return new Date().toISOString().split('T')[0]; }

function plusDays(n: number): string {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function computeTotals(items: LineItem[], taxEnabled: boolean, taxPct: string, discount: string) {
  const subtotal = items.reduce((s, i) => s + (parseFloat(i.quantity) || 0) * (parseFloat(i.unit_price) || 0), 0);
  const taxAmount = taxEnabled ? (subtotal * (parseFloat(taxPct) || 0)) / 100 : 0;
  const discAmt   = parseFloat(discount) || 0;
  return { subtotal, taxAmount, total: subtotal + taxAmount - discAmt };
}

function emptyItem(): LineItem { return { description: '', quantity: '1', unit_price: '' }; }

function blankForm(defaultTerms: string, preClientId = ''): FormState {
  return {
    client_id: preClientId,
    bill_date: today(),
    due_date: plusDays(15),
    status: 'draft',
    payment_status: 'unpaid',
    paid_amount: '',
    payment_date: '',
    notes: '',
    terms: defaultTerms,
    tax_enabled: false,
    tax_percent: '18',
    discount_amount: '0',
    bank_payment_method_id: '',
    upi_payment_method_id: '',
  };
}

// ── CSS class helpers ─────────────────────────────────────────────────────────
const inp = 'w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition';
const sel = `${inp} appearance-none cursor-pointer`;
const lbl = 'block text-[10px] font-bold font-label uppercase tracking-widest text-slate-500 mb-1.5';

// ── Badge Components ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft:     'bg-slate-500/10 text-slate-400 border-slate-500/20',
    sent:      'bg-primary/10 text-primary border-primary/20',
    paid:      'bg-green-500/10 text-green-400 border-green-500/20',
    overdue:   'bg-red-500/10 text-red-400 border-red-500/20',
    cancelled: 'bg-slate-700/20 text-slate-500 border-slate-700/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${map[status] ?? map.draft}`}>
      {status}
    </span>
  );
}

function PayBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid:    'bg-green-500/10 text-green-400 border-green-500/20',
    partial: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    unpaid:  'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${map[status] ?? map.unpaid}`}>
      {status}
    </span>
  );
}

// ── Line Items Editor ─────────────────────────────────────────────────────────
function LineItemsEditor({
  items, setItems,
}: {
  items: LineItem[];
  setItems: (fn: (prev: LineItem[]) => LineItem[]) => void;
}) {
  function update(idx: number, field: keyof LineItem, value: string) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
  }
  return (
    <div className="space-y-2">
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 text-[9px] font-bold font-label uppercase tracking-widest text-slate-600 px-1">
        <span>Description</span><span>Qty</span><span>Unit Price ₹</span><span>Total</span><span></span>
      </div>
      {items.map((item, idx) => {
        const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
        return (
          <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-center">
            <input type="text" value={item.description}
              onChange={e => update(idx, 'description', e.target.value)}
              placeholder="Service / item description"
              className={`${inp} text-xs`} />
            <input type="number" value={item.quantity} min="0.01" step="0.01"
              onChange={e => update(idx, 'quantity', e.target.value)}
              className={`${inp} text-xs`} />
            <input type="number" value={item.unit_price} min="0" step="0.01" placeholder="0.00"
              onChange={e => update(idx, 'unit_price', e.target.value)}
              className={`${inp} text-xs`} />
            <div className="rounded-lg border border-white/5 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-400 text-right">
              {lineTotal > 0 ? fmtMoney(lineTotal) : '—'}
            </div>
            <button type="button"
              onClick={() => { if (items.length > 1) setItems(prev => prev.filter((_, i) => i !== idx)); }}
              className="w-8 h-9 flex items-center justify-center text-slate-600 hover:text-red-400 transition disabled:opacity-30"
              disabled={items.length === 1}>
              <span className="material-symbols-outlined text-base">remove_circle</span>
            </button>
          </div>
        );
      })}
      <button type="button"
        onClick={() => setItems(prev => [...prev, emptyItem()])}
        className="w-full mt-1 py-2 rounded-lg border border-dashed border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:border-primary/30 hover:text-primary transition flex items-center justify-center gap-1.5">
        <span className="material-symbols-outlined text-sm">add</span> Add Item
      </button>
    </div>
  );
}

// ── Totals Summary ────────────────────────────────────────────────────────────
function TotalsSummary({ items, form, setForm }: { items: LineItem[]; form: FormState; setForm: (f: FormState) => void }) {
  const { subtotal, taxAmount, total } = computeTotals(items, form.tax_enabled, form.tax_percent, form.discount_amount);
  return (
    <div className="bg-slate-900/50 rounded-lg border border-white/5 p-4 space-y-2.5 text-sm">
      <div className="flex justify-between text-slate-400">
        <span>Subtotal</span><span className="font-semibold text-white">{fmtMoney(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 cursor-pointer shrink-0">
          <div onClick={() => setForm({ ...form, tax_enabled: !form.tax_enabled })}
            className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${form.tax_enabled ? 'bg-primary/70' : 'bg-slate-700'}`}>
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.tax_enabled ? 'translate-x-4' : ''}`}></div>
          </div>
          <span className="text-slate-400 text-xs">GST</span>
        </label>
        {form.tax_enabled ? (
          <>
            <div className="flex items-center gap-1 ml-auto">
              <input type="number" min="0" max="100" step="0.01" value={form.tax_percent}
                onChange={e => setForm({ ...form, tax_percent: e.target.value })}
                className="w-16 rounded border border-white/10 bg-slate-950/70 px-2 py-1 text-xs text-white outline-none focus:border-primary/50 text-right" />
              <span className="text-slate-500 text-xs">%</span>
            </div>
            <span className="text-slate-400 text-xs">{fmtMoney(taxAmount)}</span>
          </>
        ) : <span className="text-slate-600 text-xs ml-auto">Off</span>}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-slate-400 text-xs shrink-0">Discount ₹</span>
        <input type="number" min="0" step="0.01" value={form.discount_amount}
          onChange={e => setForm({ ...form, discount_amount: e.target.value })}
          className="w-28 ml-auto rounded border border-white/10 bg-slate-950/70 px-2 py-1 text-xs text-white outline-none focus:border-primary/50 text-right" />
      </div>
      <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/10">
        <span>Total</span>
        <span className="text-primary">{fmtMoney(total)}</span>
      </div>
    </div>
  );
}

// ── Bill Modal (Add / Edit) ───────────────────────────────────────────────────
function BillModal({
  mode, bill, clients, banks, upis, defaultTerms, preClientId, onClose, onSaved,
}: {
  mode: 'add' | 'edit';
  bill: Bill | null;
  clients: Client[];
  banks: PaymentMethod[];
  upis: PaymentMethod[];
  defaultTerms: string;
  preClientId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const defaultBank = banks.find(b => b.is_default) ?? banks[0];
  const defaultUpi  = upis.find(u => u.is_default) ?? upis[0];

  const [form, setForm] = useState<FormState>(() => {
    if (mode === 'edit' && bill) {
      return {
        client_id: String(bill.client_id),
        bill_date: bill.bill_date.split('T')[0],
        due_date: bill.due_date ? bill.due_date.split('T')[0] : '',
        status: bill.status,
        payment_status: bill.payment_status,
        paid_amount: String(bill.paid_amount),
        payment_date: bill.payment_date ? bill.payment_date.split('T')[0] : '',
        notes: bill.notes ?? '',
        terms: bill.terms ?? defaultTerms,
        tax_enabled: Number(bill.tax_percent) > 0,
        tax_percent: String(bill.tax_percent || 18),
        discount_amount: String(bill.discount_amount || 0),
        bank_payment_method_id: bill.bank_payment_method_id ? String(bill.bank_payment_method_id) : (defaultBank ? String(defaultBank.id) : ''),
        upi_payment_method_id:  bill.upi_payment_method_id  ? String(bill.upi_payment_method_id)  : (defaultUpi  ? String(defaultUpi.id)  : ''),
      };
    }
    return {
      ...blankForm(defaultTerms, preClientId ?? ''),
      bank_payment_method_id: defaultBank ? String(defaultBank.id) : '',
      upi_payment_method_id:  defaultUpi  ? String(defaultUpi.id)  : '',
    };
  });

  const [items, setItems] = useState<LineItem[]>(() => {
    if (mode === 'edit' && bill?.items?.length) {
      return bill.items.map(i => ({ description: i.description, quantity: String(i.quantity), unit_price: String(i.unit_price) }));
    }
    return [emptyItem()];
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    if (!form.client_id) { setErr('Please select a client.'); return; }
    const validItems = items.filter(i => i.description.trim());
    if (!validItems.length) { setErr('At least one line item with a description is required.'); return; }
    setSaving(true); setErr('');
    try {
      const payload = {
        ...form,
        items: validItems.map(i => ({ description: i.description, quantity: parseFloat(i.quantity) || 1, unit_price: parseFloat(i.unit_price) || 0 })),
        tax_percent: parseFloat(form.tax_percent) || 0,
        discount_amount: parseFloat(form.discount_amount) || 0,
        client_id: parseInt(form.client_id),
        bank_payment_method_id: form.bank_payment_method_id ? parseInt(form.bank_payment_method_id) : null,
        upi_payment_method_id:  form.upi_payment_method_id  ? parseInt(form.upi_payment_method_id)  : null,
      };
      const url    = mode === 'edit' && bill ? `/api/admin/bills/${bill.id}` : '/api/admin/bills';
      const method = mode === 'edit' ? 'PATCH' : 'POST';
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Save failed.'); return; }
      onSaved();
    } catch { setErr('Network error.'); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70] flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#0f172a] z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            <h3 className="font-headline font-bold text-lg text-white">
              {mode === 'add' ? 'New Bill' : `Edit — ${bill?.bill_number}`}
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {err && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{err}</p>}

          {/* Client + Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className={lbl}>Client *</label>
              <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} className={sel}>
                <option value="">— Select client —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
              </select>
              <div className="mt-1.5">
                <Link href="/admin/clients" className="text-[10px] text-primary/60 hover:text-primary transition">+ Add new client</Link>
              </div>
            </div>
            <div>
              <label className={lbl}>Bill Date *</label>
              <input type="date" value={form.bill_date} onChange={e => setForm({ ...form, bill_date: e.target.value })} className={inp} />
            </div>
            <div>
              <label className={lbl}>Due Date</label>
              <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className={inp} />
            </div>
          </div>

          {/* Status row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={lbl}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={sel}>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                {mode === 'edit' && <option value="paid">Paid</option>}
                {mode === 'edit' && <option value="overdue">Overdue</option>}
                {mode === 'edit' && <option value="cancelled">Cancelled</option>}
              </select>
            </div>
            {mode === 'edit' && <>
              <div>
                <label className={lbl}>Payment Status</label>
                <select value={form.payment_status} onChange={e => setForm({ ...form, payment_status: e.target.value })} className={sel}>
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Paid Amount ₹</label>
                <input type="number" min="0" step="0.01" value={form.paid_amount}
                  onChange={e => setForm({ ...form, paid_amount: e.target.value })} className={inp} />
              </div>
              <div>
                <label className={lbl}>Payment Date</label>
                <input type="date" value={form.payment_date}
                  onChange={e => setForm({ ...form, payment_date: e.target.value })} className={inp} />
              </div>
            </>}
          </div>

          {/* Line Items */}
          <div>
            <p className={`${lbl} mb-3`}>Line Items</p>
            <LineItemsEditor items={items} setItems={setItems} />
          </div>

          {/* Totals */}
          <TotalsSummary items={items} form={form} setForm={setForm} />

          {/* Payment Methods on Invoice */}
          <div>
            <p className={`${lbl} mb-3`}>Payment Methods on Invoice (shown in PDF)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Bank Account</label>
                <select value={form.bank_payment_method_id}
                  onChange={e => setForm({ ...form, bank_payment_method_id: e.target.value })} className={sel}>
                  <option value="">No Bank Account</option>
                  {banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>UPI</label>
                <select value={form.upi_payment_method_id}
                  onChange={e => setForm({ ...form, upi_payment_method_id: e.target.value })} className={sel}>
                  <option value="">No UPI</option>
                  {upis.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
            {banks.length === 0 && upis.length === 0 && (
              <p className="text-[11px] text-slate-600 mt-2">
                No payment methods configured. <Link href="/admin/profile" className="text-primary/60 hover:text-primary transition">Add one in profile →</Link>
              </p>
            )}
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Notes (client-facing)</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className={`${inp} resize-y`} />
            </div>
            <div>
              <label className={lbl}>Terms &amp; Conditions</label>
              <textarea value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })} rows={3} className={`${inp} resize-y`} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 sticky bottom-0 bg-[#0f172a] rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition">Cancel</button>
          <button onClick={save} disabled={saving}
            className="px-8 py-2.5 rounded-lg text-sm font-bold text-slate-950 bg-primary hover:bg-primary/90 transition disabled:opacity-60 shadow-lg shadow-primary/20">
            {saving ? 'Saving…' : mode === 'add' ? 'Create Bill' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Record Payment Modal ──────────────────────────────────────────────────────
function PaymentModal({ bill, banks, upis, onClose, onSaved }: { bill: Bill; banks: PaymentMethod[]; upis: PaymentMethod[]; onClose: () => void; onSaved: () => void }) {
  const remaining = Math.max(0, Number(bill.total_amount) - Number(bill.paid_amount));
  const [form, setForm] = useState<PayFormState>({ amount: remaining.toFixed(2), method: 'cash', bank_id: '', upi_id: '', payment_date: today(), reference: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    setSaving(true); setErr('');
    try {
      const res = await fetch(`/api/admin/bills/${bill.id}/payment`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(form.amount) || 0, method: form.method, bank_id: form.bank_id ? parseInt(form.bank_id) : null, upi_id: form.upi_id ? parseInt(form.upi_id) : null, payment_date: form.payment_date, reference: form.reference, notes: form.notes }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Failed.'); return; }
      onSaved();
    } catch { setErr('Network error.'); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-400">payments</span>
            <h3 className="font-headline font-bold text-lg text-white">Record Payment</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-slate-900/60 rounded-lg border border-white/5 p-4 grid grid-cols-3 gap-3 text-center text-xs">
            <div><div className="text-slate-500 mb-1">Bill Total</div><div className="font-bold text-white">{fmtMoney(Number(bill.total_amount))}</div></div>
            <div><div className="text-slate-500 mb-1">Already Paid</div><div className="font-bold text-green-400">{fmtMoney(Number(bill.paid_amount))}</div></div>
            <div><div className="text-slate-500 mb-1">Remaining</div><div className="font-bold text-red-400">{fmtMoney(remaining)}</div></div>
          </div>
          {err && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{err}</p>}
          <div>
            <label className={lbl}>Amount Received *</label>
            <input type="number" min="0.01" step="0.01" max={remaining} value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className={`${inp} text-lg font-bold text-green-400`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Payment Method *</label>
              <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value, bank_id: '', upi_id: '' })} className={sel}>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Payment Date *</label>
              <input type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} className={inp} />
            </div>
          </div>
          {form.method === 'bank' && banks.length > 0 && (
            <div>
              <label className={lbl}>Bank Account</label>
              <select value={form.bank_id} onChange={e => setForm({ ...form, bank_id: e.target.value })} className={sel}>
                <option value="">— Select account —</option>
                {banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}
          {form.method === 'upi' && upis.length > 0 && (
            <div>
              <label className={lbl}>UPI Account</label>
              <select value={form.upi_id} onChange={e => setForm({ ...form, upi_id: e.target.value })} className={sel}>
                <option value="">— Select UPI —</option>
                {upis.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className={lbl}>Transaction Reference</label>
            <input type="text" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })}
              placeholder="UTR / cheque no. / transaction ID" className={inp} />
          </div>
          <div>
            <label className={lbl}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className={`${inp} resize-none`} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition border border-white/10">Cancel</button>
          <button onClick={save} disabled={saving}
            className="px-8 py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-500 transition disabled:opacity-60 shadow-lg shadow-green-600/20">
            {saving ? 'Recording…' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ bill, onClose, onDeleted }: { bill: Bill; onClose: () => void; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  async function confirm() {
    setDeleting(true);
    await fetch(`/api/admin/bills/${bill.id}`, { method: 'DELETE' });
    onDeleted();
  }
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-400">delete_forever</span>
        </div>
        <h3 className="font-headline font-bold text-lg text-white mb-2">Delete Bill</h3>
        <p className="text-slate-400 text-sm mb-6">
          Are you sure you want to delete bill <strong className="text-white">{bill.bill_number}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-400 border border-white/10 hover:text-white hover:bg-white/5 transition">Cancel</button>
          <button onClick={confirm} disabled={deleting}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition disabled:opacity-60">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Email Modal ───────────────────────────────────────────────────────────────
function EmailModal({ billId, billNumber, onClose, onSent }: { billId: number; billNumber: string; onClose: () => void; onSent: () => void }) {
  const [status, setStatus] = useState<'sending' | 'success' | 'error'>('sending');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`/api/admin/bills/${billId}/email`, { method: 'POST' })
      .then(r => r.json())
      .then(d => {
        if (d.success) { setStatus('success'); setMsg(d.message ?? 'Email sent!'); setTimeout(onSent, 2000); }
        else { setStatus('error'); setMsg(d.error ?? 'Failed to send.'); }
      })
      .catch(() => { setStatus('error'); setMsg('Network error.'); });
  }, [billId, onSent]);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
        {status === 'sending' && (
          <>
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto mb-4"></div>
            <p className="text-white font-bold font-headline">Sending {billNumber}…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-400 text-2xl">check_circle</span>
            </div>
            <p className="text-green-400 font-bold">{msg}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-400 text-2xl">error</span>
            </div>
            <p className="text-red-400 font-bold mb-5">{msg}</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-400 border border-white/10 hover:text-white hover:bg-white/5 transition">Close</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, total, limit, onPage }: { page: number; total: number; limit: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  const start = Math.max(1, page - 2);
  const end   = Math.min(pages, start + 4);
  const btn = (active: boolean) =>
    `w-9 h-9 rounded-lg text-xs font-bold transition ${active ? 'bg-primary text-slate-950' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-white/5'}`;
  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/5">
      <p className="text-xs text-slate-500">{total} total · page {page} of {pages}</p>
      <div className="flex gap-1.5">
        <button onClick={() => onPage(page - 1)} disabled={page === 1} className={btn(false)}>‹</button>
        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(p => (
          <button key={p} onClick={() => onPage(p)} className={btn(p === page)}>{p}</button>
        ))}
        <button onClick={() => onPage(page + 1)} disabled={page === pages} className={btn(false)}>›</button>
      </div>
    </div>
  );
}

// ── Inner component (needs useSearchParams → must be inside Suspense) ─────────
function BillsInner() {
  const searchParams = useSearchParams();

  const [bills, setBills]     = useState<Bill[]>([]);
  const [stats, setStats]     = useState<Stats>({ total_bills: 0, total_amount: 0, paid_amount: 0, unpaid_amount: 0 });
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  const [clients, setClients]           = useState<Client[]>([]);
  const [banks, setBanks]               = useState<PaymentMethod[]>([]);
  const [upis, setUpis]                 = useState<PaymentMethod[]>([]);
  const [defaultTerms, setDefaultTerms] = useState('');

  const [search, setSearch]               = useState('');
  const [filterClient, setFilterClient]   = useState(searchParams.get('client_id') ?? '');
  const [filterStatus, setFilterStatus]   = useState('');
  const [filterPay, setFilterPay]         = useState('');
  const [dateFrom, setDateFrom]           = useState('');
  const [dateTo, setDateTo]               = useState('');
  const [amtMin, setAmtMin]               = useState('');
  const [amtMax, setAmtMax]               = useState('');

  const [showAdd, setShowAdd]             = useState(() => searchParams.get('action') === 'new');
  const [editBill, setEditBill]           = useState<Bill | null>(null);
  const [deleteBill, setDeleteBill]       = useState<Bill | null>(null);
  const [paymentBill, setPaymentBill]     = useState<Bill | null>(null);
  const [emailState, setEmailState]       = useState<{ id: number; number: string } | null>(null);
  const [loadingEdit, setLoadingEdit]     = useState<number | null>(null);

  const preClientId = searchParams.get('client_id') ?? '';

  useEffect(() => {
    fetch('/api/admin/bills/init').then(r => r.json()).then(d => {
      setClients(d.clients ?? []);
      setBanks(d.banks ?? []);
      setUpis(d.upis ?? []);
      setDefaultTerms(d.bill_terms ?? '');
    });
  }, []);

  const fetchBills = useCallback(async (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)        params.set('search', search);
    if (filterClient)  params.set('client_id', filterClient);
    if (filterStatus)  params.set('status', filterStatus);
    if (filterPay)     params.set('payment_status', filterPay);
    if (dateFrom)      params.set('date_from', dateFrom);
    if (dateTo)        params.set('date_to', dateTo);
    if (amtMin)        params.set('amount_min', amtMin);
    if (amtMax)        params.set('amount_max', amtMax);
    params.set('page', String(p));
    const r = await fetch(`/api/admin/bills?${params}`);
    const d = await r.json();
    setBills(d.records ?? []);
    setStats(d.stats ?? { total_bills: 0, total_amount: 0, paid_amount: 0, unpaid_amount: 0 });
    setTotal(d.total ?? 0);
    setPage(p);
    setLoading(false);
  }, [search, filterClient, filterStatus, filterPay, dateFrom, dateTo, amtMin, amtMax]);

  useEffect(() => { fetchBills(1); }, [fetchBills]);

  async function openEdit(bill: Bill) {
    setLoadingEdit(bill.id);
    const r = await fetch(`/api/admin/bills/${bill.id}`);
    const d = await r.json();
    setEditBill({
      ...d,
      items: (d.items ?? []).map((i: { description: string; quantity: number; unit_price: number }) => ({
        description: i.description, quantity: String(i.quantity), unit_price: String(i.unit_price),
      })),
    });
    setLoadingEdit(null);
  }

  function buildWaUrl(bill: Bill): string {
    const phone = bill.client_phone?.replace(/\D/g, '') ?? '';
    const pdfUrl = `${window.location.origin}/admin/bills/${bill.id}/pdf`;
    const msg = encodeURIComponent(`Hi ${bill.client_name},\n\nPlease find your invoice ${bill.bill_number} for ${fmtMoney(Number(bill.total_amount))} dated ${fmtDate(bill.bill_date)}.\n\nView Invoice: ${pdfUrl}\n\nThank you!`);
    return `https://wa.me/${phone}?text=${msg}`;
  }

  function isOverdue(bill: Bill): boolean {
    if (!bill.due_date || bill.payment_status === 'paid') return false;
    return new Date(bill.due_date.split('T')[0]) < new Date(today());
  }

  return (
    <section className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold tracking-tight cyber-glow-cyan text-primary">Billing Management</h2>
          <p className="text-slate-400 mt-1 text-sm">Create and manage invoices for your clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/clients"
            className="flex items-center gap-2 border border-white/10 px-4 py-2.5 rounded-lg text-sm font-bold text-slate-300 hover:border-white/20 hover:text-white transition">
            <span className="material-symbols-outlined text-sm">group</span> Clients
          </Link>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-primary px-5 py-2.5 rounded-lg text-sm font-bold text-slate-950 shadow-lg shadow-primary/20 hover:scale-[1.02] transition">
            <span className="material-symbols-outlined text-sm">add</span> New Bill
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: 'Total Bills',   value: stats.total_bills,   display: String(stats.total_bills),   color: 'border-primary',   icon: 'receipt_long'    },
          { label: 'Total Amount',  value: stats.total_amount,  display: fmtMoney(stats.total_amount),  color: 'border-[#00f2ff]', icon: 'currency_rupee'  },
          { label: 'Paid Amount',   value: stats.paid_amount,   display: fmtMoney(stats.paid_amount),   color: 'border-green-500', icon: 'check_circle'    },
          { label: 'Unpaid Amount', value: stats.unpaid_amount, display: fmtMoney(stats.unpaid_amount), color: 'border-red-500',   icon: 'pending_actions' },
        ] as const).map(card => (
          <div key={card.label} className={`bg-[#0f172a]/60 border border-white/5 border-l-2 ${card.color} rounded-xl p-5`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] font-bold font-label uppercase tracking-widest text-slate-500">{card.label}</span>
              <span className="material-symbols-outlined text-slate-700 text-xl">{card.icon}</span>
            </div>
            <div className="text-2xl font-headline font-bold text-white">{card.display}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0f172a]/60 border border-white/5 rounded-xl p-5 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchBills(1)}
            placeholder="Search bill #, client…" className={inp} />
          <select value={filterClient} onChange={e => setFilterClient(e.target.value)} className={sel}>
            <option value="">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={sel}>
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={filterPay} onChange={e => setFilterPay(e.target.value)} className={sel}>
            <option value="">All Payments</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={inp} title="Date from" />
          <input type="date" value={dateTo}   onChange={e => setDateTo(e.target.value)}   className={inp} title="Date to" />
          <input type="number" value={amtMin} onChange={e => setAmtMin(e.target.value)} placeholder="Min ₹" className={inp} />
          <input type="number" value={amtMax} onChange={e => setAmtMax(e.target.value)} placeholder="Max ₹" className={inp} />
          <button onClick={() => fetchBills(1)}
            className="py-2.5 rounded-lg bg-primary text-slate-950 text-sm font-bold hover:bg-primary/90 transition">
            Filter
          </button>
          <button onClick={() => { setSearch(''); setFilterClient(''); setFilterStatus(''); setFilterPay(''); setDateFrom(''); setDateTo(''); setAmtMin(''); setAmtMax(''); }}
            className="py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm font-bold hover:text-white transition">
            Reset
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-[#0f172a]/60 border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-500 text-sm">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            Loading bills…
          </div>
        ) : bills.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-3 block text-slate-700">receipt_long</span>
            No bills found.{' '}
            <button onClick={() => setShowAdd(true)} className="text-primary hover:underline">Create one</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-white/5">
                  {['Bill #','Client','Date','Due Date','Amount','Status','Payment','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold font-label uppercase tracking-widest text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.id} className="border-b border-white/5 hover:bg-white/[0.02] group transition">
                    <td className="px-4 py-3 font-bold text-white whitespace-nowrap">{bill.bill_number}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{bill.client_name}</div>
                      <div className="text-[11px] text-slate-500">{bill.client_email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{fmtDate(bill.bill_date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={isOverdue(bill) ? 'font-bold text-red-400' : 'text-slate-400'}>
                        {fmtDate(bill.due_date)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-white">{fmtMoney(Number(bill.total_amount))}</div>
                      {Number(bill.paid_amount) > 0 && bill.payment_status !== 'paid' && (
                        <div className="text-[11px] text-green-400">Paid: {fmtMoney(Number(bill.paid_amount))}</div>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={bill.status} /></td>
                    <td className="px-4 py-3"><PayBadge status={bill.payment_status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        {/* View PDF */}
                        <a href={`/admin/bills/${bill.id}/pdf`} target="_blank" rel="noreferrer" title="View Invoice PDF"
                          className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition">
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </a>
                        {/* Download PDF */}
                        <a href={`/admin/bills/${bill.id}/pdf`} target="_blank" rel="noreferrer" title="Print / Download PDF"
                          className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition">
                          <span className="material-symbols-outlined text-base">download</span>
                        </a>
                        {/* Send Email */}
                        <button onClick={() => setEmailState({ id: bill.id, number: bill.bill_number })} title="Send via Email"
                          className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-[#9093ff] hover:bg-[#9093ff]/10 transition">
                          <span className="material-symbols-outlined text-base">mail</span>
                        </button>
                        {/* WhatsApp */}
                        {bill.client_phone && (
                          <a href={buildWaUrl(bill)} target="_blank" rel="noreferrer" title="Send via WhatsApp"
                            className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-green-400 hover:bg-green-400/10 transition">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </a>
                        )}
                        {/* Edit */}
                        <button onClick={() => openEdit(bill)} title="Edit Bill"
                          className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition">
                          {loadingEdit === bill.id
                            ? <div className="w-3.5 h-3.5 border border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
                            : <span className="material-symbols-outlined text-base">edit</span>}
                        </button>
                        {/* Record Payment */}
                        {bill.payment_status !== 'paid' && (
                          <button onClick={() => setPaymentBill(bill)} title="Record Payment"
                            className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-green-400 hover:bg-green-400/10 transition">
                            <span className="material-symbols-outlined text-base">payments</span>
                          </button>
                        )}
                        {/* Delete */}
                        <button onClick={() => setDeleteBill(bill)} title="Delete Bill"
                          className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && bills.length > 0 && (
          <div className="px-4 py-3">
            <Pagination page={page} total={total} limit={20} onPage={p => fetchBills(p)} />
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdd && (
        <BillModal mode="add" bill={null} clients={clients} banks={banks} upis={upis}
          defaultTerms={defaultTerms} preClientId={preClientId}
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); fetchBills(1); }} />
      )}
      {editBill && (
        <BillModal mode="edit" bill={editBill} clients={clients} banks={banks} upis={upis}
          defaultTerms={defaultTerms}
          onClose={() => setEditBill(null)}
          onSaved={() => { setEditBill(null); fetchBills(page); }} />
      )}
      {deleteBill && (
        <DeleteModal bill={deleteBill}
          onClose={() => setDeleteBill(null)}
          onDeleted={() => { setDeleteBill(null); fetchBills(1); }} />
      )}
      {paymentBill && (
        <PaymentModal bill={paymentBill} banks={banks} upis={upis}
          onClose={() => setPaymentBill(null)}
          onSaved={() => { setPaymentBill(null); fetchBills(page); }} />
      )}
      {emailState && (
        <EmailModal billId={emailState.id} billNumber={emailState.number}
          onClose={() => setEmailState(null)}
          onSent={() => { setEmailState(null); fetchBills(page); }} />
      )}
    </section>
  );
}

// ── Page export with Suspense boundary ────────────────────────────────────────
export default function BillsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    }>
      <BillsInner />
    </Suspense>
  );
}
