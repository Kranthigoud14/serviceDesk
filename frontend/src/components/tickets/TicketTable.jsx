import React from 'react';
import { useNavigate } from 'react-router-dom';
import TicketStatusBadge from './TicketStatusBadge';
import PriorityBadge from './PriorityBadge';
import SLABadge from './SLABadge';
import { formatDate } from '../../utils/formatters';
import { ChevronRight, User, Wrench, Eye } from 'lucide-react';

export default function TicketTable({ tickets = [], onAssign, userRole }) {
  const navigate = useNavigate();

  if (tickets.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md shadow-xl">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">Ticket ID</th>
            <th className="py-3.5 px-4">Title & Category</th>
            <th className="py-3.5 px-4">Priority</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">SLA Window</th>
            <th className="py-3.5 px-4">Requester</th>
            <th className="py-3.5 px-4">Technician</th>
            <th className="py-3.5 px-4">Created</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {tickets.map((t) => (
            <tr
              key={t._id}
              onClick={() => navigate(`/tickets/${t._id}`)}
              className="hover:bg-slate-900/50 transition-colors cursor-pointer group"
            >
              {/* ID */}
              <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                #{t._id.slice(-6).toUpperCase()}
              </td>

              {/* Title & Category */}
              <td className="py-3.5 px-4 max-w-xs">
                <div className="font-medium text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                  {t.title}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{t.category}</div>
              </td>

              {/* Priority */}
              <td className="py-3.5 px-4">
                <PriorityBadge priority={t.priority} />
              </td>

              {/* Status */}
              <td className="py-3.5 px-4">
                <TicketStatusBadge status={t.status} />
              </td>

              {/* SLA */}
              <td className="py-3.5 px-4">
                <SLABadge
                  slaDueAt={t.slaDueAt}
                  slaStatus={t.slaStatus}
                  status={t.status}
                />
              </td>

              {/* Requester */}
              <td className="py-3.5 px-4 text-slate-300">
                <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                  <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{t.createdBy?.name || 'Employee'}</span>
                </div>
              </td>

              {/* Technician */}
              <td className="py-3.5 px-4 text-slate-300">
                <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                  <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">
                    {t.assignedTo?.name || 'Unassigned'}
                  </span>
                </div>
              </td>

              {/* Created Date */}
              <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                {formatDate(t.createdAt)}
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => navigate(`/tickets/${t._id}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

