'use client';

import { useState } from 'react';

export default function MyProfile() {
    const [currentPassword, setCurrentPassword] = useState('********');
    const [newPassword, setNewPassword] = useState('');
    const [notifCritical, setNotifCritical] = useState(true);
    const [notifAudit, setNotifAudit] = useState(true);
    const [notifBilling, setNotifBilling] = useState(false);
    const [notifWebhooks, setNotifWebhooks] = useState(true);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-white tracking-tight">Security & Profile</h1>
                    <p className="mt-2 text-slate-400 max-w-md">Manage your digital identity, security protocols, and system-wide notification preferences from a centralized architect hub.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => alert('Changes discarded')} className="px-6 py-2 bg-[#192540]/40 hover:bg-[#192540]/60 transition-all text-primary font-label uppercase text-[10px] tracking-widest rounded-sm border border-primary/10">Discard</button>
                    <button onClick={() => alert('Profile saved successfully')} className="px-6 py-2 bg-gradient-to-r from-primary to-cyan-500 hover:brightness-110 transition-all text-slate-950 font-label uppercase text-[10px] tracking-widest font-bold rounded-sm shadow-lg shadow-primary/20 active:scale-95 duration-200">Save Architecture</button>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
                {/* Profile Overview Card (Large) */}
                <div className="col-span-12 lg:col-span-8 bg-[#192540]/40 backdrop-blur-[16px] p-8 rounded-lg relative overflow-hidden shadow-[0_0_20px_rgba(143,245,255,0.05)] border border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-9xl text-white">fingerprint</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        <div className="relative group shrink-0">
                            <div className="h-32 w-32 rounded-lg overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD40OW2POncopYD5DFAqWK0WGTbXth8lhR9Z4XCtyGKH6wbuiTBLxdI61PttAdFOv3O-Y2IxqwFwlQs78NxQEC0yZx74K4c-0CXIzgUz1vOIueVlH3-3YNc96SAUAsp49vP8H9mCujA8eIG_rdXT5DApg49rRgGIHkLSiVrk_J1CHJBuUCJDW4SqQzBexXfonGGch7ahLinqObw7R6dtuQOjtWIh4BV7FKuRAue-GelBsO1rfku2XG6OGxJ6Vm03pPcPqjEvxVVnHLx"
                                    alt="Sukanta Saha Profile"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <button onClick={() => alert('Upload profile photo')} className="absolute -bottom-2 -right-2 bg-primary text-slate-950 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-sm font-bold">edit</span>
                            </button>
                        </div>

                        <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold font-headline text-white">Sukanta Saha</h2>
                                    <p className="text-primary font-label uppercase tracking-[0.2em] text-xs mt-1">Lead Systems Architect</p>
                                </div>
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-label uppercase tracking-widest border border-primary/20 shrink-0">Active Session</span>
                            </div>

                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                                <div>
                                    <label className="block font-label uppercase text-[10px] tracking-widest text-slate-500 mb-2">Primary Email</label>
                                    <p className="text-white font-medium">sukanta.saha@biznexa.enterprise</p>
                                </div>
                                <div>
                                    <label className="block font-label uppercase text-[10px] tracking-widest text-slate-500 mb-2">Direct Line</label>
                                    <p className="text-white font-medium">+1 (555) 892-0402</p>
                                </div>
                                <div>
                                    <label className="block font-label uppercase text-[10px] tracking-widest text-slate-500 mb-2">Organization</label>
                                    <p className="text-white font-medium">Global Infrastructure Division</p>
                                </div>
                                <div>
                                    <label className="block font-label uppercase text-[10px] tracking-widest text-slate-500 mb-2">Location</label>
                                    <p className="text-white font-medium">Remote Hub / Node 7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Management (Medium) */}
                <div className="col-span-12 lg:col-span-4 bg-[#0f1930] p-8 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-primary">lock_reset</span>
                        <h3 className="font-headline font-bold text-lg text-white">Authentication</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-label uppercase text-[10px] tracking-widest text-slate-500 mb-1.5">Current Cipher</label>
                            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-[#192540] border-none rounded-sm px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary/30 outline-none" />
                        </div>
                        <div>
                            <label className="block font-label uppercase text-[10px] tracking-widest text-slate-500 mb-1.5">New Protocol</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 16 characters" className="w-full bg-[#192540] border-none rounded-sm px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary/30 outline-none" />
                        </div>

                        <div className="pt-4 space-y-3">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">Two-Factor Auth</span>
                                <span className="text-emerald-400">ENABLED</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">Recovery Keys</span>
                                <span onClick={() => alert('Generating new recovery keys...')} className="text-primary hover:underline cursor-pointer">GENERATE</span>
                            </div>
                        </div>

                        <button onClick={() => alert('Security settings updated')} className="w-full mt-2 py-2.5 bg-[#192540]/40 hover:bg-[#192540]/60 text-primary font-label uppercase text-[10px] tracking-widest rounded-sm border border-primary/10 transition-all">Update Security</button>
                    </div>
                </div>

                {/* Session Monitoring (Medium) */}
                <div className="col-span-12 lg:col-span-6 bg-[#192540]/40 backdrop-blur-[16px] p-8 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary">monitor_heart</span>
                            <h3 className="font-headline font-bold text-lg text-white">Active Sessions</h3>
                        </div>
                        <button onClick={() => { if (confirm('Are you sure you want to terminate all sessions?')) alert('All sessions terminated'); }} className="text-[10px] font-label uppercase tracking-widest text-rose-400 hover:opacity-80 transition-opacity">Terminate All</button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="h-10 w-10 shrink-0 rounded bg-secondary/10 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined">laptop_mac</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-sm font-medium text-white truncate">MacBook Pro M3 Max</p>
                                    <span className="text-[10px] text-emerald-400 font-bold tracking-widest shrink-0">CURRENT</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">San Francisco, USA • 192.168.1.12</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                            <div className="h-10 w-10 shrink-0 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">smartphone</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-sm font-medium text-white truncate">iPhone 15 Pro</p>
                                    <button onClick={() => alert('Session terminated: iPhone 15 Pro')} className="material-symbols-outlined text-sm text-slate-500 hover:text-rose-400 transition-colors shrink-0">close</button>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">London, UK • 84.22.105.16 • 2h ago</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                            <div className="h-10 w-10 shrink-0 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">terminal</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-sm font-medium text-white truncate">CLI Node Interface</p>
                                    <button onClick={() => alert('Session terminated: CLI Node Interface')} className="material-symbols-outlined text-sm text-slate-500 hover:text-rose-400 transition-colors shrink-0">close</button>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">AWS US-East • 54.120.45.2 • 1d ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Preferences (Medium) */}
                <div className="col-span-12 lg:col-span-6 bg-[#0f1930] p-8 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-emerald-400">tune</span>
                        <h3 className="font-headline font-bold text-lg text-white">Transmission Rules</h3>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between p-3 rounded-sm hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5" onClick={() => setNotifCritical(!notifCritical)}>
                            <div>
                                <p className="text-sm font-medium text-white">System Critical Alerts</p>
                                <p className="text-xs text-slate-500">Real-time push for architecture failures</p>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${notifCritical ? 'bg-primary/20 border border-primary/30' : 'bg-slate-800 border border-white/10'}`}>
                                <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${notifCritical ? 'right-1 bg-primary' : 'left-1 bg-slate-500'}`}></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-sm hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5" onClick={() => setNotifAudit(!notifAudit)}>
                            <div>
                                <p className="text-sm font-medium text-white">Weekly Audit Summary</p>
                                <p className="text-xs text-slate-500">Encrypted digest of division activity</p>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${notifAudit ? 'bg-primary/20 border border-primary/30' : 'bg-slate-800 border border-white/10'}`}>
                                <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${notifAudit ? 'right-1 bg-primary' : 'left-1 bg-slate-500'}`}></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-sm hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5" onClick={() => setNotifBilling(!notifBilling)}>
                            <div>
                                <p className="text-sm font-medium text-white">Billing & Usage Reports</p>
                                <p className="text-xs text-slate-500">Monthly breakdown of resource tokens</p>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${notifBilling ? 'bg-primary/20 border border-primary/30' : 'bg-slate-800 border border-white/10'}`}>
                                <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${notifBilling ? 'right-1 bg-primary' : 'left-1 bg-slate-500'}`}></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-sm hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5" onClick={() => setNotifWebhooks(!notifWebhooks)}>
                            <div>
                                <p className="text-sm font-medium text-white">Third-party Webhooks</p>
                                <p className="text-xs text-slate-500">External API synchronization events</p>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${notifWebhooks ? 'bg-primary/20 border border-primary/30' : 'bg-slate-800 border border-white/10'}`}>
                                <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${notifWebhooks ? 'right-1 bg-primary' : 'left-1 bg-slate-500'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Meta */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50 text-[10px] font-label uppercase tracking-widest text-white">
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-primary cursor-pointer transition-colors">Service Terms</span>
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>System Status: Optimal</span>
                </div>
                <div>
                    <span>Ref: BZN-892-SYS-ARCH</span>
                </div>
            </div>
        </div>
    );
}
