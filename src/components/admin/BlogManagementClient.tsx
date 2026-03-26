'use client';

import { useState } from 'react';

import type { AdminBlogCategoryStat, AdminBlogDashboardData } from '@/lib/blog';

interface BlogManagementClientProps {
  dashboard: AdminBlogDashboardData;
}

function formatCompactNumber(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return `${value}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getCategoryColorClass(index: number) {
  const classes = [
    'bg-primary shadow-[0_0_5px_rgba(0,242,255,0.5)]',
    'bg-secondary shadow-[0_0_5px_rgba(99,102,241,0.5)]',
    'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]',
  ];

  return classes[index % classes.length];
}

function CategoryLegend({ categoryStats }: { categoryStats: AdminBlogCategoryStat[] }) {
  return (
    <div className="w-full space-y-4">
      {categoryStats.length > 0 ? (
        categoryStats.map((category, index) => (
          <div key={category.name} className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${getCategoryColorClass(index)}`}></div>
              <span className="text-slate-400 font-medium">{category.name}</span>
            </div>
            <span className="font-bold text-white">{category.percentage}%</span>
          </div>
        ))
      ) : (
        <div className="text-xs text-slate-400">No categories yet.</div>
      )}
    </div>
  );
}

export default function BlogManagementClient({ dashboard }: BlogManagementClientProps) {
    const [realTimeActive, setRealTimeActive] = useState(true);
    const [dateDropdown, setDateDropdown] = useState(false);
    const [serviceDropdown, setServiceDropdown] = useState(false);
    const [regionDropdown, setRegionDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState('Last 30 Days');
    const [selectedService, setSelectedService] = useState('All');
    const [selectedRegion, setSelectedRegion] = useState('EMEA');

    const { metrics, recentArticles, categoryStats } = dashboard;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-white tracking-tight cyber-glow-cyan uppercase">Article Repository</h1>
                    <p className="text-slate-400 text-sm mt-1">Editorial precision and content architecture. Growth is <span className="text-emerald-500 font-bold">+8.2%</span> this cycle.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => { setDateDropdown(!dateDropdown); setServiceDropdown(false); setRegionDropdown(false); }}
                            className="bg-[#1e293b]/40 backdrop-blur-[8px] px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:border-primary/30 transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                            <span className="text-slate-300">{selectedDate}</span>
                        </button>
                        {dateDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl z-50 min-w-[160px] py-1">
                                {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'All Time'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSelectedDate(opt); setDateDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-primary/10 transition-colors ${selectedDate === opt ? 'text-primary font-bold' : 'text-slate-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => { setServiceDropdown(!serviceDropdown); setDateDropdown(false); setRegionDropdown(false); }}
                            className="bg-[#1e293b]/40 backdrop-blur-[8px] px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:border-primary/30 transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">filter_list</span>
                            <span className="text-slate-300">Service: {selectedService}</span>
                        </button>
                        {serviceDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl z-50 min-w-[160px] py-1">
                                {['All', 'Web Dev', 'AI Solutions', 'Marketing', 'Cloud'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSelectedService(opt); setServiceDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-primary/10 transition-colors ${selectedService === opt ? 'text-primary font-bold' : 'text-slate-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => { setRegionDropdown(!regionDropdown); setDateDropdown(false); setServiceDropdown(false); }}
                            className="bg-[#1e293b]/40 backdrop-blur-[8px] px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:border-primary/30 transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">public</span>
                            <span className="text-slate-300">Region: {selectedRegion}</span>
                        </button>
                        {regionDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl z-50 min-w-[160px] py-1">
                                {['EMEA', 'APAC', 'Americas', 'Global'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSelectedRegion(opt); setRegionDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-primary/10 transition-colors ${selectedRegion === opt ? 'text-primary font-bold' : 'text-slate-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => alert('Connect this button to your editor flow when you are ready to create posts from the CMS.')}
                        className="bg-emerald-500 text-slate-950 px-5 py-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Create New Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl text-white">description</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Total Articles</div>
                    <div className="text-3xl font-headline font-bold text-white">{metrics.totalArticles}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-emerald-500">+{metrics.publishedArticles}</span>
                        <span className="text-slate-500 uppercase tracking-tighter">vs last month</span>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl text-emerald-500">visibility</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Total Views</div>
                    <div className="text-3xl font-headline font-bold text-white">{formatCompactNumber(metrics.totalViews)}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-emerald-500">+15.4%</span>
                        <span className="text-slate-500 uppercase tracking-tighter">organic reach</span>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl text-secondary">bar_chart</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">Engagement Rate</div>
                    <div className="text-3xl font-headline font-bold text-white">{metrics.totalArticles > 0 ? `${Math.max(1, Math.round((metrics.publishedArticles / metrics.totalArticles) * 48) / 10).toFixed(1)}%` : "4.8%"}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-emerald-500">+0.2%</span>
                        <span className="text-slate-500 uppercase tracking-tighter">industry benchmark</span>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-[8px] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-5xl text-rose-500">forum</span>
                    </div>
                    <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-1">New Comments</div>
                    <div className="text-3xl font-headline font-bold text-white">{metrics.draftArticles}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
                        <span className="text-secondary">PENDING</span>
                        <span className="text-slate-500 uppercase tracking-tighter">review required</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl p-8 relative shadow-lg">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-lg font-headline font-bold text-white">Content Performance</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-tighter mt-1">Database-driven article inventory and visibility telemetry</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setRealTimeActive(!realTimeActive)}
                                className={`text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest transition-all ${
                                    realTimeActive
                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,242,255,0.2)]'
                                        : 'bg-white/5 text-slate-500 border border-white/10 hover:text-slate-300'
                                }`}
                            >
                                REAL-TIME
                            </button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[35%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[45%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[55%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[65%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[75%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[85%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                        <div className="flex-1 bg-gradient-to-t from-primary/20 to-transparent relative group h-[95%] rounded-t-sm"><div className="absolute top-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00f2ff]"></div></div>
                    </div>
                    <div className="flex justify-between mt-6 px-2 text-[10px] font-headline font-bold text-slate-500 uppercase tracking-widest">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl p-8 flex flex-col items-center shadow-lg">
                    <h3 className="text-lg font-headline font-bold text-white self-start mb-8">Category Distribution</h3>
                    <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(30, 41, 59, 1)" strokeWidth="12"></circle>
                            <circle className="drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]" cx="50" cy="50" fill="transparent" r="40" stroke="#00f2ff" strokeDasharray="251.2" strokeDashoffset="125.6" strokeWidth="12"></circle>
                            <circle className="transform rotate-[180deg] origin-center" cx="50" cy="50" fill="transparent" r="40" stroke="#6366f1" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="12"></circle>
                            <circle className="transform rotate-[270deg] origin-center" cx="50" cy="50" fill="transparent" r="40" stroke="#10b981" strokeDasharray="251.2" strokeDashoffset="200.96" strokeWidth="12"></circle>
                        </svg>
                        <div className="absolute text-center">
                            <span className="block text-2xl font-headline font-bold text-white">{categoryStats.length}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Topics</span>
                        </div>
                    </div>

                    <CategoryLegend categoryStats={categoryStats} />
                </div>
            </div>

            <div className="bg-[#192540]/60 backdrop-blur-[16px] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h3 className="text-lg font-headline font-bold text-white">Recent Articles</h3>
                    <span className="material-symbols-outlined text-slate-500 cursor-pointer">more_vert</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[10px] font-headline font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="px-8 py-5">Title</th>
                                <th className="px-6 py-5">Author</th>
                                <th className="px-6 py-5">Category</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentArticles.length > 0 ? (
                                recentArticles.map((article, index) => (
                                    <tr key={article.slug} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-bold text-white block mb-0.5">{article.title}</span>
                                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{article.slug}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${index % 2 === 0 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>{getInitials(article.author)}</div>
                                                <span className="text-xs text-slate-300">{article.author}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-300">{article.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${article.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>{article.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-300">{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        <td className="px-8 py-4 text-right">
                                            <button onClick={() => alert(`Editing: ${article.title}`)} className="material-symbols-outlined text-slate-500 hover:text-primary transition-colors text-xl">edit_note</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-10 text-center text-slate-400 text-sm">
                                        No articles available yet. Add rows to `blog_posts` and they will appear here automatically.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-white/5 flex justify-center">
                    <button
                        onClick={() => alert('Connect this action to your full article manager when you are ready.')}
                        className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-primary hover:text-white transition-colors"
                    >
                        View All Articles
                    </button>
                </div>
            </div>
        </div>
    );
}
