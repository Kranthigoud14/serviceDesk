import React, { useEffect, useState } from 'react';
import { useAnalyticsStore } from '../../store/analyticsStore';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  Cpu,
  Boxes,
  Users,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Activity,
  Star
} from 'lucide-react';
import { TableSkeleton } from '../../components/common/Skeleton';

export default function AnalyticsPage() {
  const {
    overview,
    trends,
    technicianStats,
    assetStats,
    loading,
    fetchOverview,
    fetchTrends,
    fetchTechnicianStats,
    fetchAssetStats,
    timeframe,
  } = useAnalyticsStore();

  const [activeTab, setActiveTab] = useState('overview'); // overview, technicians, assets, trends

  useEffect(() => {
    fetchOverview(timeframe);
    fetchTrends(14);
    fetchTechnicianStats();
    fetchAssetStats();
  }, [timeframe]);

  const summary = overview?.summary || {};
  const statusMap = overview?.statusBreakdown || {};
  const priorityList = overview?.priorityBreakdown || [];
  const categoryList = overview?.categoryBreakdown || [];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            Operational Intelligence & Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Analytics & SLA Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry aggregated directly from production database records.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {['7', '30', '90'].map((tf) => (
            <button
              key={tf}
              onClick={() => fetchOverview(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf} Days
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Volume</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-100">
            {summary.totalTickets || 0}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">{summary.resolvedTickets || 0} Resolved</span>
            <span>?</span>
            <span className="text-cyan-400 font-semibold">{summary.activeTickets || 0} Active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">SLA Compliance</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {summary.slaComplianceRate || 100}%
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-rose-400 font-semibold">{summary.slaBreachedCount || 0} Breached</span>
            <span>?</span>
            <span className="text-amber-400 font-semibold">{summary.slaAtRiskCount || 0} At Risk</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Workforce Roster</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-blue-400">
            {summary.availableTechnicians || 0} <span className="text-lg text-slate-500 font-normal">/ {summary.totalTechnicians || 0}</span>
          </div>
          <p className="text-[11px] text-slate-400">Available for instant dispatch</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Service Quality</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400">
            {summary.avgRating ? `${summary.avgRating} / 5` : '5.0 / 5'}
          </div>
          <p className="text-[11px] text-slate-400">Across {summary.totalRatings || 0} customer ratings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Ticket & SLA Breakdown' },
          { id: 'technicians', label: 'Workforce Performance' },
          { id: 'assets', label: 'Asset Utilization' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview Breakdown */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown */}
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Lifecycle Status Breakdown</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Open / Unassigned', key: 'Open', color: 'bg-cyan-500' },
                { label: 'Assigned', key: 'Assigned', color: 'bg-blue-500' },
                { label: 'In Progress', key: 'In Progress', color: 'bg-amber-500' },
                { label: 'Resolved (Pending OTP)', key: 'Resolved', color: 'bg-violet-500' },
                { label: 'Verified & Closed', key: 'Closed', color: 'bg-emerald-500' },
                { label: 'Reopened', key: 'Reopened', color: 'bg-rose-500' },
              ].map((st) => {
                const count = statusMap[st.key] || 0;
                const pct = summary.totalTickets > 0 ? Math.round((count / summary.totalTickets) * 100) : 0;
                return (
                  <div key={st.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{st.label}</span>
                      <span className="font-mono text-slate-400">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full ${st.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Priority Volume</h3>
            <div className="space-y-3">
              {['Critical', 'High', 'Medium', 'Low'].map((prio) => {
                const match = priorityList.find((p) => p._id === prio);
                const count = match ? match.count : 0;
                const pct = summary.totalTickets > 0 ? Math.round((count / summary.totalTickets) * 100) : 0;
                const color =
                  prio === 'Critical' ? 'bg-rose-500 text-rose-400' :
                  prio === 'High' ? 'bg-amber-500 text-amber-400' :
                  prio === 'Medium' ? 'bg-blue-500 text-blue-400' : 'bg-slate-500 text-slate-400';

                return (
                  <div key={prio} className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${color.split(' ')[0]}`} />
                      <span className="text-xs font-semibold text-slate-200">{prio} Priority</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-100">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Categories */}
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Top Problem Categories</h3>
            <div className="space-y-2">
              {categoryList.map((cat) => {
                const pct = summary.totalTickets > 0 ? Math.round((cat.count / summary.totalTickets) * 100) : 0;
                return (
                  <div key={cat._id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 text-xs">
                    <span className="font-medium text-slate-300">{cat._id}</span>
                    <span className="font-mono text-cyan-400 font-bold">{cat.count} tickets ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Workforce Performance */}
      {activeTab === 'technicians' && (
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Technician Capacity & Rating Leaderboard</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Active / Max Capacity</th>
                  <th className="py-3 px-4">Utilization</th>
                  <th className="py-3 px-4">Resolved Count</th>
                  <th className="py-3 px-4">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {technicianStats.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/80">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{t.name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.availability === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {t.availability}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{t.activeTickets} / {t.maxCapacity}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${t.utilization}%` }} />
                        </div>
                        <span className="font-mono text-slate-400">{t.utilization}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{t.resolvedTickets}</td>
                    <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">
                      {t.averageRating ? `? ${t.averageRating}` : '?'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Asset Utilization */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Hardware Asset Distribution</h3>
            <div className="space-y-2.5">
              {assetStats?.byType?.map((t) => (
                <div key={t._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">{t._id}</span>
                  <span className="font-mono text-xs text-cyan-400 font-bold">{t.count} units</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Warranty Coverage</h3>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Active Warranty:</span>
                <span className="font-mono text-emerald-400 font-bold">{assetStats?.warranty?.active || 0} Assets</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Expired Warranty:</span>
                <span className="font-mono text-rose-400 font-bold">{assetStats?.warranty?.expired || 0} Assets</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                Asset Manager should review expired warranty hardware for enterprise service contract renewals.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
