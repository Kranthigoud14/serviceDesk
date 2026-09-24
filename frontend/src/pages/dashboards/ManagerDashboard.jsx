import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicketStore } from '../../store/ticketStore';
import { useTechnicianStore } from '../../store/technicianStore';
import TicketTable from '../../components/tickets/TicketTable';
import TicketAssignModal from '../../components/tickets/TicketAssignModal';
import CapacityIndicator from '../../components/technicians/CapacityIndicator';
import AvailabilityBadge from '../../components/technicians/AvailabilityBadge';
import SkillBadge from '../../components/technicians/SkillBadge';
import Button from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/Skeleton';
import {
  Activity,
  AlertTriangle,
  UserCheck,
  Wrench,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export default function ManagerDashboard() {
  const { tickets, fetchTickets, loading: ticketLoading } = useTicketStore();
  const { technicians, fetchTechnicians, verifySkills, loading: techLoading } = useTechnicianStore();
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
    fetchTechnicians();
  }, [fetchTickets, fetchTechnicians]);

  // Derived metrics
  const unassignedTickets = tickets.filter((t) => !t.assignedTo && t.status !== 'Closed');
  const slaWarningTickets = tickets.filter(
    (t) => (t.slaStatus === 'Due Soon' || t.slaStatus === 'Overdue') && t.status !== 'Closed'
  );
  const activeTechnicians = technicians.filter((t) => t.availability === 'Available');
  const pendingSkillVerification = technicians.filter((t) => t.skills?.length > 0 && !t.skillsVerified);

  const isLoading = ticketLoading || techLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Assign Modal */}
      {selectedTicketForAssign && (
        <TicketAssignModal
          isOpen={!!selectedTicketForAssign}
          ticket={selectedTicketForAssign}
          onClose={() => setSelectedTicketForAssign(null)}
          onSuccess={() => {
            fetchTickets();
            fetchTechnicians();
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            IT Service Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Workforce allocation, SLA risk mitigation, and technician skill verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="violet"
            size="sm"
            icon={Cpu}
            onClick={() => navigate('/workforce')}
          >
            Workforce Intelligence
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Wrench}
            onClick={() => navigate('/technicians')}
          >
            Technicians
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unassigned */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Unassigned Queue</span>
            <UserCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {unassignedTickets.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Awaiting technician assignment
          </p>
        </div>

        {/* SLA Risks */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">SLA At Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400">
            {slaWarningTickets.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Breached or due within 2 hours
          </p>
        </div>

        {/* Available Techs */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Available Staff</span>
            <Wrench className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {activeTechnicians.length} <span className="text-sm text-slate-500 font-normal">/ {technicians.length}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Ready for instant dispatch
          </p>
        </div>

        {/* Unverified Skills */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Skill Verifications</span>
            <ShieldCheck className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-violet-400">
            {pendingSkillVerification.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Technician skill submissions pending
          </p>
        </div>
      </div>

      {/* Unassigned Tickets Section (High Action) */}
      {unassignedTickets.length > 0 && (
        <div className="space-y-4 p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Unassigned Incident Dispatch Queue ({unassignedTickets.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Select any ticket to trigger AI Workforce Intelligence recommendations.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unassignedTickets.slice(0, 6).map((ticket) => (
              <div
                key={ticket._id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-cyan-400">
                      #{ticket._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400">{ticket.category}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {ticket.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {ticket.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {ticket.priority} Priority
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Cpu}
                    onClick={() => setSelectedTicketForAssign(ticket)}
                  >
                    Assign Tech
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technician Workload & Skill Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Technician Capacity & Verification Status
            </h3>
            <p className="text-xs text-slate-400">
              Live technician availability, capacity allocation, and IT Manager skill approvals.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/technicians')}
          >
            All Technicians
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.slice(0, 6).map((tech) => (
            <div
              key={tech._id}
              className="p-4 rounded-2xl glass-panel border border-slate-800/80 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">{tech.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{tech.email}</p>
                </div>
                <AvailabilityBadge availability={tech.availability} />
              </div>

              <CapacityIndicator
                active={tech.activeTickets || 0}
                max={tech.maxActiveTickets || 5}
              />

              <div className="pt-1 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Skills:</span>
                  {!tech.skillsVerified && tech.skills?.length > 0 ? (
                    <button
                      type="button"
                      onClick={async () => {
                        await verifySkills(tech._id);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Verify Skills
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {tech.skills?.map((s, idx) => (
                    <SkillBadge key={idx} skill={s} isVerified={tech.skillsVerified} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Operations Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Service Incidents & SLA Monitor</h3>
            <p className="text-xs text-slate-400">Active operations pipeline</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/tickets')}
          >
            View All ({tickets.length})
          </Button>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <TicketTable tickets={tickets.slice(0, 8)} />
        )}
      </div>
    </div>
  );
}

