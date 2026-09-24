import React from 'react';
import { formatDate } from '../../utils/formatters';
import {
  PlusCircle,
  UserCheck,
  Wrench,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function TicketTimeline({ ticket }) {
  if (!ticket) return null;

  const events = [];

  // 1. Created
  events.push({
    title: 'Ticket Created',
    desc: `Created by ${ticket.createdBy?.name || 'Employee'} (${ticket.category} - ${ticket.priority} Priority)`,
    time: ticket.createdAt,
    icon: PlusCircle,
    color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
    done: true,
  });

  // 2. Assigned
  if (ticket.assignedTo) {
    events.push({
      title: 'Technician Assigned',
      desc: `Assigned to ${ticket.assignedTo.name} (${ticket.assignedTo.email})`,
      time: ticket.updatedAt,
      icon: UserCheck,
      color: 'text-blue-400 bg-blue-950/60 border-blue-500/30',
      done: true,
    });
  } else {
    events.push({
      title: 'Assignment Pending',
      desc: 'Waiting for IT Manager dispatch via Workforce Intelligence',
      time: null,
      icon: Clock,
      color: 'text-slate-500 bg-slate-900 border-slate-800',
      done: false,
    });
  }

  // 3. Resolved
  if (ticket.resolvedAt) {
    events.push({
      title: 'Service Resolved',
      desc: ticket.resolution ? `Resolution: "${ticket.resolution}"` : 'Resolved by technician',
      time: ticket.resolvedAt,
      icon: Wrench,
      color: 'text-violet-400 bg-violet-950/60 border-violet-500/30',
      done: true,
      hasProof: !!ticket.proofPhoto,
      proofPhoto: ticket.proofPhoto,
    });
  }

  // 4. Service Verification or Rejection
  if (ticket.serviceVerifiedAt) {
    events.push({
      title: 'Service Verified (OTP Confirmed)',
      desc: `Verified by ${ticket.createdBy?.name || 'Employee'}. Ticket successfully closed.`,
      time: ticket.serviceVerifiedAt,
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
      done: true,
    });
  } else if (ticket.serviceRejectedAt) {
    events.push({
      title: 'Service Rejected',
      desc: `Rejected: "${ticket.rejectionReason}". Ticket reopened.`,
      time: ticket.serviceRejectedAt,
      icon: XCircle,
      color: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
      done: true,
    });
  } else if (ticket.status === 'Resolved') {
    events.push({
      title: 'Verification Pending',
      desc: 'Awaiting Employee OTP confirmation to verify and close ticket.',
      time: null,
      icon: Clock,
      color: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
      done: false,
    });
  }

  // 5. Rating
  if (ticket.rating) {
    events.push({
      title: `Technician Rated: ${ticket.rating} / 5 Stars`,
      desc: ticket.ratingComment ? `Comment: "${ticket.ratingComment}"` : 'Rated by employee',
      time: ticket.ratedAt,
      icon: Star,
      color: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
      done: true,
    });
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8 space-y-6">
        {events.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <li key={idx} className="relative flex items-start gap-4 pb-6">
              {idx !== events.length - 1 && (
                <span
                  className="absolute left-4 top-8 -bottom-2 w-0.5 bg-slate-800"
                  aria-hidden="true"
                />
              )}
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-xl border shrink-0 ${evt.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs font-semibold ${evt.done ? "text-slate-200" : "text-slate-400"}`}
                  >
                    {evt.title}
                  </p>
                  {evt.time && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDate(evt.time)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{evt.desc}</p>

                {evt.hasProof && evt.proofPhoto && (
                  <div className="mt-2.5">
                    <p className="text-[11px] font-medium text-slate-400 mb-1">Service Proof:</p>
                    <a
                      href={evt.proofPhoto}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block overflow-hidden rounded-lg border border-slate-700 hover:border-cyan-500 transition-colors"
                    >
                      <img
                        src={evt.proofPhoto}
                        alt="Proof"
                        className="h-24 w-auto object-cover max-w-xs rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </a>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

