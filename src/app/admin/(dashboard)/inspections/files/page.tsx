'use client';

import { useState } from 'react';

const sampleFiles = [
    { id: 1, ref: 'INS-2024-001', client: 'Nexus Core Inc.', type: 'Self', date: '2024-03-15', status: 'Completed', fee: '$4,200' },
    { id: 2, ref: 'INS-2024-002', client: 'Solaris Energy', type: 'Company', date: '2024-03-12', status: 'Pending', fee: '$1,850' },
    { id: 3, ref: 'INS-2024-003', client: 'Zenith Capital Partners', type: 'Self', date: '2024-03-10', status: 'Draft', fee: '$3,600' },
    { id: 4, ref: 'INS-2024-004', client: 'Apex Dynamics Ltd.', type: 'Company', date: '2024-03-08', status: 'Completed', fee: '$2,750' },
    { id: 5, ref: 'INS-2024-005', client: 'Nova Holdings', type: 'Self', date: '2024-03-05', status: 'Pending', fee: '$5,100' },
];

const statusStyles: Record<string, string> = {
    Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Completed: 'bg-tertiary/10 text-tertiary border border-tertiary/20',
    Draft: 'bg-white/5 text-slate-400 border border-white/10',
};

export default function InspectionFiles() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);

    // Modal form state
    const [fileRef, setFileRef] = useState('');
    const [inspectionType, setInspectionType] = useState('Self');
    const [inspectionDate, setInspectionDate] = useState('');
    const [linkedClient, setLinkedClient] = useState('');
    const [assetName, setAssetName] = useState('');
    const [locationAddress, setLocationAddress] = useState('');
    const [notesRemarks, setNotesRemarks] = useState('');
    const [bank, setBank] = useState('');
    const [branch, setBranch] = useState('');
    const [totalFee, setTotalFee] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [paymentMode, setPaymentMode] = useState('Wire Transfer');

    const totalPages = 3;

    const filteredFiles = sampleFiles.filter((file) => {
        const matchesSearch =
            file.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || file.status === statusFilter;
        const matchesType = typeFilter === 'All' || file.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const resetModal = () => {
        setFileRef('');
        setInspectionType('Self');
        setInspectionDate('');
        setLinkedClient('');
        setAssetName('');
        setLocationAddress('');
        setNotesRemarks('');
        setBank('');
        setBranch('');
        setTotalFee('');
        setPaymentStatus('pending');
        setPaymentMode('Wire Transfer');
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-headline font-bold text-white tracking-tight">
                        Inspection Files
                        <span className="ml-3 inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                            {sampleFiles.length}
                        </span>
                    </h2>
                    <p className="text-slate-400 text-sm font-body">Management and tracking of property inspection reports.</p>
                </div>
                <button
                    onClick={() => { resetModal(); setShowModal(true); }}
                    className="bg-tertiary px-6 py-3 rounded-lg flex items-center gap-2 font-headline font-bold text-[#00452d] text-xs uppercase tracking-widest shadow-[0_8px_24px_rgba(16,185,129,0.2)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.4)] transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    + Add New File
                </button>
            </div>

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
                        <option value="All">Status: All</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Draft">Draft</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                </div>
                <div className="relative">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 appearance-none pr-10 font-body min-w-[140px]"
                    >
                        <option value="All">Type: All</option>
                        <option value="Self">Self</option>
                        <option value="Company">Company</option>
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
                            {filteredFiles.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">search_off</span>
                                        No files found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredFiles.map((file) => (
                                    <tr key={file.id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                                        <td className="px-6 py-5">
                                            <span className="font-headline font-bold text-sm text-white">{file.ref}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-300 font-body">{file.client}</td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs text-slate-400 font-body">{file.type}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-400 font-body">{file.date}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[file.status]}`}>
                                                {file.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-headline font-bold text-white">{file.fee}</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => alert(`Edit: ${file.ref}`)}
                                                    className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-500 hover:text-primary transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => alert(`View: ${file.ref}`)}
                                                    className="p-2 hover:bg-[#1e293b] rounded-lg text-slate-500 hover:text-secondary transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Delete "${file.ref}"?`)) alert(`Deleted: ${file.ref}`);
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
                <div className="px-6 py-4 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5">
                    <p className="text-[11px] text-slate-500 font-headline font-bold uppercase tracking-widest">
                        Showing {filteredFiles.length} of {sampleFiles.length} files
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 hover:text-primary disabled:opacity-30 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        {[1, 2, 3].map((page) => (
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
                        ))}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md overflow-y-auto py-10">
                    <div className="relative w-full max-w-6xl mx-4 bg-[#0f172a]/95 backdrop-blur-[16px] shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden flex flex-col max-h-[90vh] border border-white/[0.08]">
                        {/* Modal Header */}
                        <header className="p-6 md:p-8 border-b border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f172a]/40">
                            <div>
                                <nav className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Admin</span>
                                    <span className="material-symbols-outlined text-[10px] text-slate-500">chevron_right</span>
                                    <span className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Inspection</span>
                                    <span className="material-symbols-outlined text-[10px] text-slate-500">chevron_right</span>
                                    <span className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Files</span>
                                    <span className="material-symbols-outlined text-[10px] text-slate-500">chevron_right</span>
                                    <span className="text-[10px] font-headline uppercase tracking-widest text-primary">Create New</span>
                                </nav>
                                <h2 className="text-2xl md:text-3xl font-headline font-bold text-white tracking-tighter">Create New Inspection File</h2>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 bg-[#1e293b] text-white font-headline uppercase text-xs tracking-widest hover:bg-[#334155] transition-colors rounded-lg border border-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { alert('File saved!'); setShowModal(false); }}
                                    className="px-5 py-2.5 bg-tertiary text-[#00452d] font-headline font-bold uppercase text-xs tracking-widest hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all rounded-lg flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">save</span>
                                    Save File
                                </button>
                            </div>
                        </header>

                        {/* Modal Content (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                {/* Left Column (2/3 width) */}
                                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                                    {/* Card 1: General Information */}
                                    <section className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 hover:border-primary/30 transition-all p-6 rounded-xl border-l-4 border-l-primary/40">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="material-symbols-outlined text-primary">info</span>
                                            <h3 className="font-headline font-bold uppercase tracking-widest text-sm text-white">General Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">File Reference Number</label>
                                                <input
                                                    type="text"
                                                    value={fileRef}
                                                    onChange={(e) => setFileRef(e.target.value)}
                                                    placeholder="Auto-generated or enter manually"
                                                    className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-body"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Inspection Type</label>
                                                <div className="relative">
                                                    <select
                                                        value={inspectionType}
                                                        onChange={(e) => setInspectionType(e.target.value)}
                                                        className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-body appearance-none"
                                                    >
                                                        <option>Self</option>
                                                        <option>Company</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Date of Inspection</label>
                                                <input
                                                    type="date"
                                                    value={inspectionDate}
                                                    onChange={(e) => setInspectionDate(e.target.value)}
                                                    className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-body [color-scheme:dark]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Linked Client</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={linkedClient}
                                                        onChange={(e) => setLinkedClient(e.target.value)}
                                                        placeholder="Search client database..."
                                                        className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-body"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-sm">search</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Card 2: Inspection Subject */}
                                    <section className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 hover:border-secondary/30 transition-all p-6 rounded-xl border-l-4 border-l-secondary/40">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="material-symbols-outlined text-secondary">domain</span>
                                            <h3 className="font-headline font-bold uppercase tracking-widest text-sm text-white">Inspection Subject</h3>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Asset / Property Name</label>
                                                <input
                                                    type="text"
                                                    value={assetName}
                                                    onChange={(e) => setAssetName(e.target.value)}
                                                    placeholder="e.g. Skyline Tower B"
                                                    className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20 font-body"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Location / Address</label>
                                                <textarea
                                                    value={locationAddress}
                                                    onChange={(e) => setLocationAddress(e.target.value)}
                                                    placeholder="Enter full geographic details..."
                                                    rows={3}
                                                    className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-secondary/50 focus:ring-2 focus:ring-secondary/20 font-body resize-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Notes / Remarks</label>
                                                <div className="rounded-lg border border-white/10 bg-slate-950/70 overflow-hidden">
                                                    <div className="flex gap-1 p-2 border-b border-white/5 bg-white/[0.02]">
                                                        <button className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
                                                            <span className="material-symbols-outlined text-sm">format_bold</span>
                                                        </button>
                                                        <button className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
                                                            <span className="material-symbols-outlined text-sm">format_italic</span>
                                                        </button>
                                                        <button className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
                                                            <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        value={notesRemarks}
                                                        onChange={(e) => setNotesRemarks(e.target.value)}
                                                        placeholder="Technical observations..."
                                                        rows={4}
                                                        className="w-full bg-transparent border-none px-3 py-3 text-sm text-white outline-none focus:ring-0 font-body resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column (1/3 width) */}
                                <div className="space-y-6 md:space-y-8">
                                    {/* Card 3: Financial & Processing */}
                                    <section className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 hover:border-tertiary/30 transition-all p-6 rounded-xl border-l-4 border-l-tertiary/40 h-full">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="material-symbols-outlined text-tertiary">payments</span>
                                            <h3 className="font-headline font-bold uppercase tracking-widest text-sm text-white">Financial &amp; Processing</h3>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Bank / Institution</label>
                                                <input
                                                    type="text"
                                                    value={bank}
                                                    onChange={(e) => setBank(e.target.value)}
                                                    placeholder="Select institution"
                                                    className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-tertiary/50 focus:ring-2 focus:ring-tertiary/20 font-body"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Branch</label>
                                                <input
                                                    type="text"
                                                    value={branch}
                                                    onChange={(e) => setBranch(e.target.value)}
                                                    placeholder="Branch location"
                                                    className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-tertiary/50 focus:ring-2 focus:ring-tertiary/20 font-body"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Total Fee</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-headline text-xs">$</span>
                                                    <input
                                                        type="number"
                                                        value={totalFee}
                                                        onChange={(e) => setTotalFee(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full rounded-lg border border-white/10 bg-slate-950/70 pl-8 pr-3 py-3 text-sm text-white outline-none transition focus:border-tertiary/50 focus:ring-2 focus:ring-tertiary/20 font-body"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Payment Status</label>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-3 p-3 bg-slate-950/40 hover:bg-slate-950/70 cursor-pointer rounded-lg group transition-colors border border-white/5">
                                                        <input
                                                            type="radio"
                                                            name="pay_status"
                                                            value="pending"
                                                            checked={paymentStatus === 'pending'}
                                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                                            className="w-3 h-3 text-secondary bg-transparent border-slate-500 focus:ring-0"
                                                        />
                                                        <span className="text-xs text-white font-body flex-1">Pending / Due</span>
                                                        <span className="w-2 h-2 rounded-full bg-yellow-400 group-hover:shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
                                                    </label>
                                                    <label className="flex items-center gap-3 p-3 bg-slate-950/40 hover:bg-slate-950/70 cursor-pointer rounded-lg group transition-colors border border-white/5">
                                                        <input
                                                            type="radio"
                                                            name="pay_status"
                                                            value="partial"
                                                            checked={paymentStatus === 'partial'}
                                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                                            className="w-3 h-3 text-secondary bg-transparent border-slate-500 focus:ring-0"
                                                        />
                                                        <span className="text-xs text-white font-body flex-1">Partial Payment</span>
                                                        <span className="w-2 h-2 rounded-full bg-orange-500 group-hover:shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                                                    </label>
                                                    <label className="flex items-center gap-3 p-3 bg-slate-950/40 hover:bg-slate-950/70 cursor-pointer rounded-lg group transition-colors border border-white/5">
                                                        <input
                                                            type="radio"
                                                            name="pay_status"
                                                            value="paid"
                                                            checked={paymentStatus === 'paid'}
                                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                                            className="w-3 h-3 text-secondary bg-transparent border-slate-500 focus:ring-0"
                                                        />
                                                        <span className="text-xs text-white font-body flex-1">Fully Paid</span>
                                                        <span className="w-2 h-2 rounded-full bg-tertiary group-hover:shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-2 pt-2">
                                                <label className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-slate-500 block">Payment Mode</label>
                                                <div className="relative">
                                                    <select
                                                        value={paymentMode}
                                                        onChange={(e) => setPaymentMode(e.target.value)}
                                                        className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-tertiary/50 focus:ring-2 focus:ring-tertiary/20 font-body appearance-none"
                                                    >
                                                        <option>Wire Transfer</option>
                                                        <option>Credit Card</option>
                                                        <option>NEFT / RTGS</option>
                                                        <option>Cheque Deposit</option>
                                                        <option>Escrow Account</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <footer className="p-4 md:p-6 bg-[#1e293b]/90 border-t border-white/[0.08] flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => { alert('File saved! Ready to add another.'); resetModal(); }}
                                className="px-6 py-3 border border-white/10 text-white font-headline uppercase text-[11px] tracking-[0.1em] hover:bg-[#1e293b] transition-all rounded-lg"
                            >
                                Save &amp; Add Another
                            </button>
                            <button
                                onClick={() => { alert('File saved! Redirecting to view...'); setShowModal(false); }}
                                className="px-8 py-3 bg-tertiary text-[#00452d] font-headline font-bold uppercase text-[11px] tracking-[0.2em] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-lg flex items-center justify-center gap-3"
                            >
                                Save &amp; View File
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                        </footer>

                        {/* Background decals */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -z-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[120px] -z-10 pointer-events-none"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
