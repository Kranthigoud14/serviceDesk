import React from 'react';
import { getRemainingTimeText, getSlaColorClass } from '../../utils/slaHelper';
import { Clock, CheckCircle2, AlertOctagon, AlertTriangle } from 'lucide-react';

export default function SLABadge({ slaDueAt, slaStatus, status, className = '' }) {
  const isTicketClosed = status === 'Closed' || status === 'Resolved';
  const info = getRemainingTimeText(slaDueAt, status);
  const colorClass = getSlaColorClass(slaStatus, isTicketClosed);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      {info.isDone ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : info.isOverdue ? (
        <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
      ) : info.isWarning ? (
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
      )}
      <span>{info.text}</span>
    </span>
  );
}

