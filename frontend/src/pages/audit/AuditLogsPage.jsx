import React, { useEffect, useState } from 'react';
import { useAuditStore } from '../../store/auditStore';
import {
  ShieldAlert,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Activity,
  Lock
} from 'lucide-react';
import { TableSkeleton } from '../../components/common/Skeleton';
import { formatDate } from '../../utils/formatters';

const ENTITY_TYPES = ['ALL', 'AUTH', 'USER', 'TICKET', 'TECHNICIAN', 'ASSET', 'KNOWLEDGE', 'SYSTEM'];

export default function AuditLogsPage() {
  const { logs, total, page, pages, loading, fetchLogs, filters, setFilter, resetFilters } = useAuditStore();
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs({
      page,
      search: filters.search.trim() || undefined,
      entityType: filters.entityType && filters.entityType !== 'ALL' ? filters.entityType : undefined,
    });
  }, [page, filters.entityType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs({
      page: 1,
      search: filters.search.trim() || undefined,
      entityType: filters.entityType && filters.entityType !== 'ALL' ? filters.entityType : undefined,
    });
  };

  const getEntityBadge = (type) => {
    const colors = {
      AUTH: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      TICKET: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      USER: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      TECHNICIAN: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      ASSET: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      KNOWLEDGE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      SYSTEM: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    };
    return colors[type] || 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            Security & Compliance Audit Trail
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            System Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable log of all administrative actions, ticket transitions, authentication events, and data mutations.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block font-mono">Total Recorded Events</span>
          <span className="text-2xl font-bold font-mono text-cyan-400">{total}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Search action descriptions..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {ENTITY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setFilter('entityType', type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                (filters.entityType || 'ALL') === type
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : logs.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-xs text-slate-400">
          No audit logs recorded for the selected filter.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Module</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200 block">{log.actor?.name || 'System'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.actor?.role || 'Automation'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getEntityBadge(log.entityType)}`}>
                        {log.entityType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 font-semibold">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-md truncate">
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Page {page} of {pages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => fetchLogs({ page: page - 1 })}
                  className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= pages}
                  onClick={() => fetchLogs({ page: page + 1 })}
                  className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
