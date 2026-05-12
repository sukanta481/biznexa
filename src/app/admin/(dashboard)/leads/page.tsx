'use client';

import { useEffect, useMemo, useState } from 'react';

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

export default function LeadsCRM() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td className="p-6 text-sm text-slate-400" colSpan={7}>Loading leads...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="p-6 text-sm text-rose-300" colSpan={7}>{error}</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td className="p-6 text-sm text-slate-400" colSpan={7}>No leads found yet.</td>
                </tr>
              ) : (
                records.map((lead) => (
                  <tr key={lead.id} className="hover:bg-primary/5 transition-colors group align-top">
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-on-surface">{lead.name}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 max-w-xs">{lead.message}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{lead.company || '—'}</td>
                    <td className="p-4 text-sm">
                      <a href={`mailto:${lead.email}`} className="text-primary/80 hover:text-primary transition">{lead.email}</a>
                    </td>
                    <td className="p-4 text-sm text-slate-300">{lead.service_type || 'General'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusToneMap[lead.status]}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">{lead.source}</td>
                    <td className="p-4 text-sm text-slate-400">{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
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
    </div>
  );
}
