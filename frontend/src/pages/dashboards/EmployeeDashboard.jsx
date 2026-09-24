import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import TicketTable from '../../components/tickets/TicketTable';
import TicketCreateModal from '../../components/tickets/TicketCreateModal';
import ServiceVerifyModal from '../../components/tickets/ServiceVerifyModal';
import ServiceRejectModal from '../../components/tickets/ServiceRejectModal';
import TechnicianRateModal from '../../components/tickets/TechnicianRateModal';
import Button from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/Skeleton';
import {
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Star,
  Sparkles,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react';

export default function EmployeeDashboard() {
  const { user } = useAuthStore();
  const { tickets, fetchTickets, loading } = useTicketStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [verifyTicket, setVerifyTicket] = useState(null);
  const [rejectTicket, setRejectTicket] = useState(null);
  const [rateTicket, setRateTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Tickets created by the logged in employee
  const myTickets = tickets.filter(
    (t) => t.createdBy?._id === user?.id || t.createdBy === user?.id
  );

  // Tickets requiring OTP verification
  const pendingVerification = myTickets.filter((t) => t.status === 'Resolved');

  // Closed tickets that haven't been rated yet
  const pendingRating = myTickets.filter(
    (t) => t.status === 'Closed' && t.rating === null && t.assignedTo
  );

  const activeTickets = myTickets.filter(
    (t) => t.status === 'Open' || t.status === 'Assigned' || t.status === 'In Progress' || t.status === 'Reopened'
  );

  const resolvedTickets = myTickets.filter((t) => t.status === 'Closed');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Modals */}
      <TicketCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchTickets()}
      />

      {verifyTicket && (
        <ServiceVerifyModal
          isOpen={!!verifyTicket}
          ticket={verifyTicket}
          onClose={() => setVerifyTicket(null)}
          onSuccess={() => fetchTickets()}
        />
      )}

      {rejectTicket && (
        <ServiceRejectModal
          isOpen={!!rejectTicket}
          ticket={rejectTicket}
          onClose={() => setRejectTicket(null)}
          onSuccess={() => fetchTickets()}
        />
      )}

      {rateTicket && (
        <TechnicianRateModal
          isOpen={!!rateTicket}
          ticket={rateTicket}
          onClose={() => setRateTicket(null)}
          onSuccess={() => fetchTickets()}
        />
      )}

      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-cyan-950/30 to-slate-900/50 border border-cyan-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <LifeBuoy className="w-4 h-4 text-cyan-400" />
            IT Support & Service Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Employee'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need hardware repair, software permissions, or network assistance? Our verified engineering team is standing by.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Button
            size="lg"
            variant="primary"
            icon={PlusCircle}
            onClick={() => navigate('/tickets/new')}
            className="shadow-xl shadow-blue-500/30 font-semibold"
          >
            Create New Service Request
          </Button>
        </div>
      </div>

      {/* Critical Action Banner: Pending OTP Verification */}
      {pendingVerification.length > 0 && (
        <div className="p-5 rounded-2xl bg-violet-950/40 border border-violet-500/40 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-violet-400 animate-pulse" />
            <span>Service Resolution Requires Your Verification ({pendingVerification.length})</span>
          </div>
          <p className="text-xs text-slate-300">
            The technician completed work and uploaded proof. Please review and confirm your 6-digit OTP code to verify completion.
          </p>

          <div className="space-y-2 pt-1">
            {pendingVerification.map((ticket) => (
              <div
                key={ticket._id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">
                    Ticket #{ticket._id.slice(-6).toUpperCase()}: {ticket.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Resolved by {ticket.resolvedBy?.name || 'Technician'} • Notes: "{ticket.resolution}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setRejectTicket(ticket)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    icon={CheckCircle2}
                    onClick={() => setVerifyTicket(ticket)}
                  >
                    Enter Verification OTP
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Rating Prompt */}
      {pendingRating.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-100">
                Rate Your Technician's Performance
              </h4>
              <p className="text-[11px] text-slate-400">
                Help us maintain elite service quality by sharing feedback for recently resolved tickets.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            icon={Star}
            onClick={() => setRateTicket(pendingRating[0])}
          >
            Leave Review
          </Button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Requests
          </span>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {activeTickets.length}
          </div>
          <p className="text-[11px] text-slate-500">In progress with IT support</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Awaiting My OTP
          </span>
          <div className="text-3xl font-extrabold font-mono text-violet-400">
            {pendingVerification.length}
          </div>
          <p className="text-[11px] text-slate-500">Resolved services requiring verification</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Closed & Verified
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {resolvedTickets.length}
          </div>
          <p className="text-[11px] text-slate-500">Completed service history</p>
        </div>
      </div>

      {/* Active Service Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">My Ticket History</h3>
            <p className="text-xs text-slate-400">All support inquiries filed by your account</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/tickets')}
          >
            View All ({myTickets.length})
          </Button>
        </div>

        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : myTickets.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-200">No support requests active</h4>
            <p className="text-xs text-slate-400 mt-1 mb-5 max-w-sm mx-auto">
              Everything is running smoothly! If you ever need help with equipment, network, or software, file a ticket anytime.
            </p>
            <Button
              size="sm"
              variant="primary"
              icon={PlusCircle}
              onClick={() => setIsCreateOpen(true)}
            >
              Submit Ticket
            </Button>
          </div>
        ) : (
          <TicketTable tickets={myTickets.slice(0, 6)} />
        )}
      </div>
    </div>
  );
}

