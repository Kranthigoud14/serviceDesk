import React from 'react';
import { useNavigate } from 'react-router-dom';
import TicketStatusBadge from './TicketStatusBadge';
import PriorityBadge from './PriorityBadge';
import SLABadge from './SLABadge';
import { formatRelativeTime } from '../../utils/formatters';
import { User, Wrench, ChevronRight } from 'lucide-react';

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket._id}`)}
      className="p-5 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 cursor-pointer flex flex-col justify-between gap-4 transition-all duration-200 group"
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold text-slate-400">
            #{ticket._id.slice(-6).toUpperCase()}
          </span>
          <span className="text-[11px] text-slate-500">
            {formatRelativeTime(ticket.createdAt)}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
          {ticket.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {ticket.description}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-800/60">
        <div className="flex flex-wrap items-center gap-2">
          <TicketStatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <SLABadge
            slaDueAt={ticket.slaDueAt}
            slaStatus={ticket.slaStatus}
            status={ticket.status}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1.5 truncate max-w-[50%]">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{ticket.createdBy?.name || 'Employee'}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate max-w-[50%]">
            <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate text-slate-300">
              {ticket.assignedTo?.name || 'Unassigned'}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

