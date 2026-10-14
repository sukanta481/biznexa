'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type LeadRecord = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_type: string | null;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
};

type LeadsResponse = {
  records: LeadRecord[];
  total: number;
  page: number;
  limit: number;
  metrics: {
    totalLeads: number;
    qualifiedLeads: number;
    newLeads: number;
    conversionRate: number;
    closedLeads: number;
  };
};

const statusToneMap: Record<LeadRecord["status"], string> = {
  new: 'bg-rose-500/10 text-rose-400',
  contacted: 'bg-secondary/10 text-secondary',
  qualified: 'bg-tertiary/10 text-tertiary',
  proposal_sent: 'bg-amber-500/10 text-amber-300',
  won: 'bg-primary/10 text-primary',
  lost: 'bg-slate-500/10 text-slate-300',
};

const statusLabels: Record<LeadRecord["status"], string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal_sent: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
};

const priorityToneMap: Record<LeadRecord["priority"], string> = {
  high: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  medium: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  low: 'bg-slate-500/10 text-slate-300 border-white/10',
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="text-sm text-slate-200 font-body break-words">{children}</div>
    </div>
  );
}

function LeadDetailModal({ lead, onClose }: { lead: LeadRecord; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const whatsappNumber = lead.phone?.replace(/\D/g, '') ?? '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f172a] shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 p-6 border-b border-white/[0.08] shrink-0">
          <div className="space-y-2 min-w-0">
            <span className="text-[10px] font-headline uppercase tracking-widest text-primary">Lead</span>
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white tracking-tight break-words">{lead.name}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusToneMap[lead.status]}`}>
                {statusLabels[lead.status]}
              </span>
              <span className={`px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${priorityToneMap[lead.priority]}`}>
                {lead.priority} priority
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Detail label="Email">
              <a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a>
            </Detail>
            <Detail label="Phone">
              {lead.phone ? (
                <span className="flex flex-wrap items-center gap-3">
                  <a href={`tel:${lead.phone}`} className="text-primary hover:underline">{lead.phone}</a>
                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-tertiary hover:underline"
                    >
                      <span className="material-symbols-outlined text-[14px]">chat</span>
                      WhatsApp
                    </a>
                  )}
                </span>
              ) : '—'}
            </Detail>
            <Detail label="Company">{lead.company || '—'}</Detail>
            <Detail label="Service">{lead.service_type || 'General'}</Detail>
            <Detail label="Source">{lead.source || '—'}</Detail>
            <Detail label="Received">{formatDateTime(lead.created_at)}</Detail>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500">Message</p>
            <div className="rounded-lg border border-white/[0.06] bg-slate-950/40 p-4">
              <p className="text-sm leading-relaxed text-slate-200 font-body whitespace-pre-wrap break-words">
                {lead.message?.trim() ? lead.message : 'No message was sent with this enquiry.'}
              </p>
            </div>
          </div>
        </div>

        <footer className="p-4 md:p-6 bg-[#1e293b]/90 border-t border-white/[0.08] flex flex-col sm:flex-row justify-end gap-3 shrink-0">
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: your enquiry to Biznexa`)}`}
            className="px-6 py-3 border border-primary/30 bg-primary/10 text-primary font-headline font-bold uppercase text-[11px] tracking-[0.12em] hover:bg-primary/15 transition-all rounded-lg flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            Reply by email
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 border border-white/10 text-white font-headline uppercase text-[11px] tracking-[0.1em] hover:bg-[#1e293b] transition-all rounded-lg"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function LeadsCRM() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  const closeLead = useCallback(() => setSelectedLead(null), []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeads() {
      setIsLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          page: String(currentPage),
        });

        if (searchQuery.trim()) params.set('search', searchQuery.trim());
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (serviceFilter !== 'all') params.set('service', serviceFilter);

        const response = await fetch(`/api/admin/leads?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load leads.');
        }

        const result = (await response.json()) as LeadsResponse;
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load leads.');
      } finally {
        setIsLoading(false);
      }
    }

    loadLeads();
    return () => controller.abort();
  }, [currentPage, searchQuery, serviceFilter, statusFilter]);

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.limit));
  }, [data]);

  const records = data?.records ?? [];
  const metrics = data?.metrics ?? {
    totalLeads: 0,
    qualifiedLeads: 0,
    newLeads: 0,
    conversionRate: 0,
    closedLeads: 0,
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-headline font-bold tracking-tight text-on-surface cyber-glow-cyan uppercase">Leads Management</h2>
          <p className="text-slate-400 text-sm font-body">Live website inquiries flowing into your CRM.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
        <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl">
          <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Total Leads</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">{metrics.totalLeads}</h3>
        </div>
        <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl">
          <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">New Leads</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">{metrics.newLeads}</h3>
        </div>
        <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl">
          <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Qualified Leads</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">{metrics.qualifiedLeads}</h3>
        </div>
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
          <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary mb-1">Conversion Rate</p>
          <h3 className="text-3xl font-headline font-bold text-primary cyber-glow-cyan">{metrics.conversionRate}%</h3>
        </div>
      </div>

      <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 p-4 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
          <input
            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-10 text-sm focus:ring-1 focus:ring-primary/30 outline-none transition-all text-on-surface"
            placeholder="Search leads..."
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        <select
          className="bg-white/5 border border-white/5 text-slate-300 text-sm rounded-lg py-2 px-4 focus:ring-1 focus:ring-primary/30 outline-none"
          value={statusFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="all">Status: All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal_sent">Proposal Sent</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
        <select
          className="bg-white/5 border border-white/5 text-slate-300 text-sm rounded-lg py-2 px-4 focus:ring-1 focus:ring-primary/30 outline-none"
          value={serviceFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setServiceFilter(e.target.value);
          }}
        >
          <option value="all">Service: All</option>
          <option value="general">General</option>
          <option value="web-development">Web Development</option>
          <option value="ai-automation">AI Automation</option>
          <option value="ui-ux-design">UI/UX Design</option>
          <option value="digital-marketing">Digital Marketing</option>
        </select>
      </div>

      <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Lead</th>
                <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Company</th>
                <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Email</th>
                <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Service</th>
                <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Status</th>
                <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Source</th>
                <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">Created</th>
                <th className="p-4 font-headline text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td className="p-6 text-sm text-slate-400" colSpan={8}>Loading leads...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="p-6 text-sm text-rose-300" colSpan={8}>{error}</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td className="p-6 text-sm text-slate-400" colSpan={8}>No leads found yet.</td>
                </tr>
              ) : (
                records.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-primary/5 transition-colors group align-top cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-on-surface">{lead.name}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 max-w-xs">{lead.message}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{lead.company || '—'}</td>
                    <td className="p-4 text-sm">
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(event) => event.stopPropagation()}
                        className="text-primary/80 hover:text-primary transition"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="p-4 text-sm text-slate-300">{lead.service_type || 'General'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusToneMap[lead.status]}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{lead.source}</td>
                    <td className="p-4 text-sm text-slate-400">{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-white/5 transition-all"
                        title={`View ${lead.name}'s enquiry`}
                      >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex items-center justify-between bg-white/5 border-t border-white/5">
          <p className="text-xs text-slate-500 font-bold uppercase">
            Showing {records.length === 0 ? 0 : (currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, data?.total ?? 0)} of {data?.total ?? 0} leads
          </p>
          <div className="flex items-center gap-4">
            <button
              className="text-slate-500 hover:text-on-surface transition-colors disabled:opacity-30"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-xs font-headline font-bold text-primary tracking-widest uppercase">Page {currentPage}</span>
            <button
              className="text-slate-500 hover:text-on-surface transition-colors disabled:opacity-30"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={closeLead} />}
    </div>
  );
}
