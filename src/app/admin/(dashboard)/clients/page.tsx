'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  gst_number: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  bill_count: number;
  total_paid: number;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  gst_number: string;
  address: string;
  status: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(v: string | null): string {
  if (!v) return '—';
  const datePart = v.split('T')[0];
  const parts = datePart.split('-').map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return v;
  return `${MONTHS[m - 1]} ${String(d).padStart(2, '0')}, ${y}`;
}

function fmtMoney(v: number): string {
  return `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const inp = 'w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition placeholder:text-slate-600';
const sel = `${inp} appearance-none cursor-pointer`;
const lbl = 'block text-[10px] font-bold font-label uppercase tracking-widest text-slate-500 mb-1.5';

// ── Modals ────────────────────────────────────────────────────────────────────
function AddClientModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', phone: '', company: '', gst_number: '', address: '', status: 'active',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    if (!form.name.trim()) { setErr('Client name is required.'); return; }
    setSaving(true); setErr('');
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Failed to add client.'); return; }
      onSaved();
    } catch {
      setErr('Network error.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Add Client</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-5">
          {err && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{err}</p>
          )}
          <div>
            <label className={lbl}>Client Name *</label>
            <input className={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Client name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Email</label>
              <input type="email" className={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="client@example.com (optional)" />
            </div>
            <div>
              <label className={lbl}>Phone</label>
              <input className={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Company</label>
              <input className={inp} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
            </div>
            <div>
              <label className={lbl}>GST Number</label>
              <input className={inp} value={form.gst_number} onChange={e => setForm({ ...form, gst_number: e.target.value })} placeholder="GST number (optional)" />
            </div>
          </div>
          <div>
            <label className={lbl}>Address</label>
            <textarea className={inp} rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Client address" />
          </div>
          <div>
            <label className={lbl}>Status</label>
            <select className={sel} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white transition">Cancel</button>
          <button onClick={save} disabled={saving} className="bg-primary px-5 py-2.5 rounded-lg text-sm font-bold text-slate-950 shadow-lg shadow-primary/20 hover:scale-[1.02] transition disabled:opacity-60">
            {saving ? 'Saving...' : 'Add Client'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditClientModal({ client, onClose, onSaved }: { client: Client; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<FormState>({
    name: client.name,
    email: client.email ?? '',
    phone: client.phone ?? '',
    company: client.company ?? '',
    gst_number: client.gst_number ?? '',
    address: client.address ?? '',
    status: client.status,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    if (!form.name.trim()) { setErr('Client name is required.'); return; }
    setSaving(true); setErr('');
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Failed to update client.'); return; }
      onSaved();
    } catch {
      setErr('Network error.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Edit Client</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-5">
          {err && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{err}</p>
          )}
          <div>
            <label className={lbl}>Client Name *</label>
            <input className={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Client name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Email</label>
              <input type="email" className={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="client@example.com (optional)" />
            </div>
            <div>
              <label className={lbl}>Phone</label>
              <input className={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Company</label>
              <input className={inp} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
            </div>
            <div>
              <label className={lbl}>GST Number</label>
              <input className={inp} value={form.gst_number} onChange={e => setForm({ ...form, gst_number: e.target.value })} placeholder="GST number (optional)" />
            </div>
          </div>
          <div>
            <label className={lbl}>Address</label>
            <textarea className={inp} rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Client address" />
          </div>
          <div>
            <label className={lbl}>Status</label>
            <select className={sel} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white transition">Cancel</button>
          <button onClick={save} disabled={saving} className="bg-primary px-5 py-2.5 rounded-lg text-sm font-bold text-slate-950 shadow-lg shadow-primary/20 hover:scale-[1.02] transition disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteClientModal({ client, onClose, onDeleted }: { client: Client; onClose: () => void; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState('');

  async function handleDelete() {
    setDeleting(true); setErr('');
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Failed to delete client.'); return; }
      onDeleted();
    } catch {
      setErr('Network error.');
    } finally {
      setDeleting(false);
    }
  }

  const hasBills = client.bill_count > 0;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Delete Client</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-slate-300 text-sm">
            Are you sure you want to delete <strong className="text-white">{client.name}</strong>?
          </p>
          {hasBills && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-sm text-amber-200">
              This client has {client.bill_count} bill(s). You must delete or reassign them first.
            </div>
          )}
          {err && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{err}</p>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white transition">Cancel</button>
          <button
            onClick={handleDelete}
            disabled={deleting || hasBills}
            className="bg-red-600 px-5 py-2.5 rounded-lg text-sm font-bold text-white hover:bg-red-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, total, limit, onPage }: { page: number; total: number; limit: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
      <span className="text-xs text-slate-500">{total} total · page {page} of {pages}</span>
      <div className="flex gap-2">
        <button onClick={() => onPage(page - 1)} disabled={page <= 1} className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 border border-white/10 hover:text-white hover:border-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed">
          Prev
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          let p: number;
          if (pages <= 5) p = i + 1;
          else if (page <= 3) p = i + 1;
          else if (page >= pages - 2) p = pages - 4 + i;
          else p = page - 2 + i;
          return (
            <button key={p} onClick={() => onPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition ${p === page ? 'bg-primary text-slate-950' : 'text-slate-400 border border-white/10 hover:text-white hover:border-white/20'}`}>
              {p}
            </button>
          );
        })}
        <button onClick={() => onPage(page + 1)} disabled={page >= pages} className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 border border-white/10 hover:text-white hover:border-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
    </div>
  );
}

// ── Inner component (uses useSearchParams) ────────────────────────────────────
function ClientsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '');

  const [showAdd, setShowAdd] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const limit = 20;

  const fetchClients = useCallback(async (p: number, s: string, st: string) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set('page', String(p));
      if (s) qs.set('search', s);
      if (st) qs.set('status', st);
      const res = await fetch(`/api/admin/clients?${qs.toString()}`);
      const data = await res.json();
      setClients(data.records ?? []);
      setTotal(data.total ?? 0);
      setPage(data.page ?? 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const s = searchParams.get('search') ?? '';
    const st = searchParams.get('status') ?? '';
    setSearch(s);
    setStatusFilter(st);
    fetchClients(1, s, st);
  }, [searchParams, fetchClients]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    if (statusFilter) qs.set('status', statusFilter);
    router.push(`/admin/clients?${qs.toString()}`);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    const qs = new URLSearchParams();
    if (val) qs.set('status', val);
    if (search) qs.set('search', search);
    router.push(`/admin/clients?${qs.toString()}`);
  }

  function handleReset() {
    router.push('/admin/clients');
  }

  function handleSaved() {
    setShowAdd(false);
    setEditClient(null);
    setSuccessMsg(editClient ? 'Client updated successfully!' : 'Client added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    const s = searchParams.get('search') ?? '';
    const st = searchParams.get('status') ?? '';
    fetchClients(1, s, st);
  }

  function handleDeleted() {
    setDeleteClient(null);
    setSuccessMsg('Client deleted successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    const s = searchParams.get('search') ?? '';
    const st = searchParams.get('status') ?? '';
    fetchClients(1, s, st);
  }

  return (
    <>
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-20 right-6 z-[80] bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 text-sm text-emerald-200 shadow-lg">
          {successMsg}
        </div>
      )}

      {/* Page Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients Management</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your client database</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-primary px-5 py-2.5 rounded-lg text-sm font-bold text-slate-950 shadow-lg shadow-primary/20 hover:scale-[1.02] transition flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Client
        </button>
      </header>

      {/* Main Content Card */}
      <div className="bg-[#0f172a]/60 border border-white/5 rounded-xl overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 border-b border-white/5">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-5 flex gap-2">
              <input
                className={inp}
                placeholder="Search name, email, company, phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearchSubmit(e); }}
              />
              <button type="submit" className="bg-primary px-4 py-2.5 rounded-lg text-sm font-bold text-slate-950 hover:scale-[1.02] transition shrink-0">
                <span className="material-symbols-outlined text-sm">search</span>
              </button>
            </div>
            <div className="col-span-12 md:col-span-3">
              <select className={sel} value={statusFilter} onChange={handleStatusChange}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-span-6 md:col-span-2">
              <button type="button" onClick={handleReset} className="w-full border border-white/10 px-4 py-2.5 rounded-lg text-sm font-bold text-slate-300 hover:border-white/20 hover:text-white transition">
                Reset
              </button>
            </div>
            <div className="col-span-6 md:col-span-2">
              <Link href="/admin/bills" className="w-full block text-center border border-primary/40 px-4 py-2.5 rounded-lg text-sm font-bold text-primary hover:bg-primary/10 transition">
                View Bills
              </Link>
            </div>
          </form>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
            Loading...
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-3">group_off</span>
            <p className="text-sm">No clients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-bold font-label uppercase tracking-widest text-slate-500 border-b border-white/5">
                  <th className="text-left px-6 py-3">Name</th>
                  <th className="text-left px-6 py-3">Contact</th>
                  <th className="text-left px-6 py-3">Company</th>
                  <th className="text-center px-6 py-3">Bills</th>
                  <th className="text-right px-6 py-3">Total Paid</th>
                  <th className="text-center px-6 py-3">Status</th>
                  <th className="text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-white/5 hover:bg-white/[0.02] group transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white text-sm">{client.name}</div>
                      {client.gst_number && (
                        <div className="text-[10px] text-slate-500 mt-0.5">GST: {client.gst_number}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {client.email || client.phone ? (
                        <div className="space-y-0.5">
                          {client.email && (
                            <a href={`mailto:${client.email}`} className="text-primary/80 hover:text-primary transition block truncate">{client.email}</a>
                          )}
                          {client.phone && (
                            <a href={`tel:${client.phone.replace(/\D/g, '')}`} className="text-slate-400 hover:text-white transition block">{client.phone}</a>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {client.company || <span className="text-slate-600">-</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/bills?client_id=${client.id}`}
                        className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition"
                      >
                        {client.bill_count}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-white">
                      {fmtMoney(Number(client.total_paid))}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                        client.status === 'active'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => setEditClient(client)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <Link
                          href={`/admin/bills?action=new&client_id=${client.id}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition"
                          title="Create Bill"
                        >
                          <span className="material-symbols-outlined text-sm">receipt_long</span>
                        </Link>
                        <button
                          onClick={() => setDeleteClient(client)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && clients.length > 0 && (
          <Pagination page={page} total={total} limit={limit} onPage={(p) => {
            const qs = new URLSearchParams();
            if (search) qs.set('search', search);
            if (statusFilter) qs.set('status', statusFilter);
            qs.set('page', String(p));
            router.push(`/admin/clients?${qs.toString()}`);
          }} />
        )}
      </div>

      {/* Modals */}
      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} onSaved={handleSaved} />}
      {editClient && <EditClientModal client={editClient} onClose={() => setEditClient(null)} onSaved={handleSaved} />}
      {deleteClient && <DeleteClientModal client={deleteClient} onClose={() => setDeleteClient(null)} onDeleted={handleDeleted} />}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ClientsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 text-slate-500">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
        Loading...
      </div>
    }>
      <ClientsInner />
    </Suspense>
  );
}
