import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicketStore } from '../../store/ticketStore';
import { useAuthStore } from '../../store/authStore';
import TicketStatusBadge from '../../components/tickets/TicketStatusBadge';
import PriorityBadge from '../../components/tickets/PriorityBadge';
import SLABadge from '../../components/tickets/SLABadge';
import TicketTimeline from '../../components/tickets/TicketTimeline';
import TicketAssignModal from '../../components/tickets/TicketAssignModal';
import ServiceResolveModal from '../../components/tickets/ServiceResolveModal';
import ServiceVerifyModal from '../../components/tickets/ServiceVerifyModal';
import ServiceRejectModal from '../../components/tickets/ServiceRejectModal';
import TechnicianRateModal from '../../components/tickets/TechnicianRateModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import AIAssistWidget from '../../components/ai/AIAssistWidget';
import { formatDate, getInitials } from '../../utils/formatters';
import {
  ArrowLeft,
  User,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Trash2,
  Cpu,
  Layers,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentTicket: ticket,
    fetchTicketById,
    updateTicket,
    deleteTicket,
    detailLoading,
    error,
  } = useTicketStore();
  const { user } = useAuthStore();

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isRateOpen, setIsRateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTicketById(id);
    }
  }, [id, fetchTicketById]);

  if (detailLoading) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading incident telemetry and service records...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Ticket Not Found"
          message={error || 'The requested ticket could not be loaded or you do not have permission to view it.'}
          onRetry={() => fetchTicketById(id)}
        />
        <div className="text-center mt-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/tickets')}>
            Back to Ticket List
          </Button>
        </div>
      </div>
    );
  }

  const isCreator = ticket.createdBy?._id === user?.id || ticket.createdBy === user?.id;
  const isAssignedTech = ticket.assignedTo?._id === user?.id || ticket.assignedTo === user?.id;
  const isManager = user?.role === 'IT Manager' || user?.role === 'System Admin';
  const isAdmin = user?.role === 'System Admin';

  const handleStartWork = async () => {
    await updateTicket(ticket._id, { status: 'In Progress' });
  };

  const handleDeleteTicket = async () => {
    const res = await deleteTicket(ticket._id);
    if (res.success) {
      navigate('/tickets');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Modals */}
      <TicketAssignModal
        isOpen={isAssignOpen}
        ticket={ticket}
        onClose={() => setIsAssignOpen(false)}
        onSuccess={() => fetchTicketById(ticket._id)}
      />

      <ServiceResolveModal
        isOpen={isResolveOpen}
        ticket={ticket}
        onClose={() => setIsResolveOpen(false)}
        onSuccess={() => fetchTicketById(ticket._id)}
      />

      <ServiceVerifyModal
        isOpen={isVerifyOpen}
        ticket={ticket}
        onClose={() => setIsVerifyOpen(false)}
        onSuccess={() => fetchTicketById(ticket._id)}
      />

      <ServiceRejectModal
        isOpen={isRejectOpen}
        ticket={ticket}
        onClose={() => setIsRejectOpen(false)}
        onSuccess={() => fetchTicketById(ticket._id)}
      />

      <TechnicianRateModal
        isOpen={isRateOpen}
        ticket={ticket}
        onClose={() => setIsRateOpen(false)}
        onSuccess={() => fetchTicketById(ticket._id)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTicket}
        title="Delete Incident Ticket"
        message="Are you sure you want to permanently delete ticket #? This action is irreversible."
      />

      {/* Navigation Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button
          type="button"
          onClick={() => navigate('/tickets')}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </button>
        <span>/</span>
        <span className="font-mono font-semibold text-slate-200">
          #{ticket._id.slice(-6).toUpperCase()}
        </span>
      </div>

      {/* Ticket Header & Action Bar */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono font-bold text-cyan-400 text-sm bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                #{ticket._id.slice(-6).toUpperCase()}
              </span>
              <TicketStatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <SLABadge
                slaDueAt={ticket.slaDueAt}
                slaStatus={ticket.slaStatus}
                status={ticket.status}
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 pt-1">
              {ticket.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                Category: <strong className="text-slate-200">{ticket.category}</strong>
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Opened {formatDate(ticket.createdAt)}
              </span>
            </div>
          </div>

          {/* Contextual Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* IT Manager Dispatch */}
            {isManager && ticket.status !== 'Closed' && (
              <Button
                variant="primary"
                size="sm"
                icon={Cpu}
                onClick={() => setIsAssignOpen(true)}
              >
                {ticket.assignedTo ? 'Reassign Tech' : 'Assign via Workforce AI'}
              </Button>
            )}

            {/* Technician Start Work */}
            {isAssignedTech && ticket.status === 'Assigned' && (
              <Button
                variant="secondary"
                size="sm"
                icon={Wrench}
                onClick={handleStartWork}
              >
                Mark In Progress
              </Button>
            )}

            {/* Technician Resolve */}
            {isAssignedTech && (ticket.status === 'Assigned' || ticket.status === 'In Progress' || ticket.status === 'Reopened') && (
              <Button
                variant="violet"
                size="sm"
                icon={Wrench}
                onClick={() => setIsResolveOpen(true)}
              >
                Resolve & Upload Proof
              </Button>
            )}

            {/* Employee Verify OTP & Reject */}
            {isCreator && ticket.status === 'Resolved' && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  icon={XCircle}
                  onClick={() => setIsRejectOpen(true)}
                >
                  Reject Service
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  icon={CheckCircle2}
                  onClick={() => setIsVerifyOpen(true)}
                >
                  Enter Verification OTP
                </Button>
              </>
            )}

            {/* Employee Rate Technician */}
            {isCreator && ticket.status === 'Closed' && ticket.rating === null && ticket.assignedTo && (
              <Button
                variant="primary"
                size="sm"
                icon={Star}
                onClick={() => setIsRateOpen(true)}
              >
                Rate Technician
              </Button>
            )}

            {/* Admin Delete */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                icon={Trash2}
                onClick={() => setIsDeleteOpen(true)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Verification OTP Alert Banner (If resolved) */}
        {ticket.status === 'Resolved' && (
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Service Resolution Ready for Employee Verification</span>
              </div>
              <p className="text-xs text-slate-300">
                {isCreator
                  ? 'A 6-digit confirmation code was sent to your notifications. Enter it to confirm resolution and close this ticket.'
                  : 'Awaiting Employee OTP confirmation to verify and close ticket.'}
              </p>
            </div>
            {isCreator && (
              <Button
                variant="success"
                size="sm"
                onClick={() => setIsVerifyOpen(true)}
              >
                Verify Now
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Details + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
              Incident Description
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
              {ticket.description}
            </p>
          </div>

          {/* AI Copilot & Workforce Assist Insights */}
          <AIAssistWidget ticket={ticket} />

          {/* Resolution Proof Card (if available) */}
          {ticket.resolution && (
            <div className="p-6 rounded-3xl glass-panel border border-violet-500/20 bg-violet-950/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-violet-300 uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-violet-400" />
                  Technician Resolution & Field Notes
                </h3>
                {ticket.resolvedAt && (
                  <span className="text-xs text-slate-500 font-mono">
                    {formatDate(ticket.resolvedAt)}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {ticket.resolution}
              </p>

              {ticket.proofPhoto && (
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-medium text-slate-400 block">
                    Field Verification Photo:
                  </span>
                  <a
                    href={ticket.proofPhoto}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-xl overflow-hidden border border-slate-700/80 hover:border-cyan-500 transition-colors shadow-lg"
                  >
                    <img
                      src={ticket.proofPhoto}
                      alt="Service Resolution Proof"
                      className="max-h-64 w-auto object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Rating / Review Card (if rated) */}
          {ticket.rating && (
            <div className="p-6 rounded-3xl glass-panel border border-amber-500/20 bg-amber-950/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Employee Service Rating ({ticket.rating} / 5 Stars)
                </h3>
                {ticket.ratedAt && (
                  <span className="text-xs text-slate-500 font-mono">
                    {formatDate(ticket.ratedAt)}
                  </span>
                )}
              </div>
              <div className="flex gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4"
                  />
                ))}
              </div>
              {ticket.ratingComment && (
                <p className="text-xs text-slate-300 italic pt-1">
                  "{ticket.ratingComment}"
                </p>
              )}
            </div>
          )}

          {/* Service Rejection Details (if reopened) */}
          {ticket.status === 'Reopened' && ticket.rejectionReason && (
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Service Rejection Reason:</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                "{ticket.rejectionReason}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: User Cards & Visual Timeline */}
        <div className="space-y-6">
          {/* Stakeholders Card */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Assigned Personnel
            </h3>

            {/* Requester */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0">
                {getInitials(ticket.createdBy?.name)}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-500 block uppercase">Requester</span>
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {ticket.createdBy?.name || 'Employee'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {ticket.createdBy?.email}
                </p>
              </div>
            </div>

            {/* Technician */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                {getInitials(ticket.assignedTo?.name || 'U')}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-500 block uppercase">Assigned Tech</span>
                {ticket.assignedTo ? (
                  <>
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {ticket.assignedTo.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {ticket.assignedTo.email}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 italic">Unassigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Operational Timeline */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Lifecycle History & Telemetry
            </h3>
            <TicketTimeline ticket={ticket} />
          </div>
        </div>
      </div>
    </div>
  );
}

