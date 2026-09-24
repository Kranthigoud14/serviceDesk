import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { useTechnicianStore } from '../../store/technicianStore';
import TicketTable from '../../components/tickets/TicketTable';
import ServiceResolveModal from '../../components/tickets/ServiceResolveModal';
import CapacityIndicator from '../../components/technicians/CapacityIndicator';
import SkillBadge from '../../components/technicians/SkillBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/Skeleton';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';

export default function TechnicianDashboard() {
  const { user } = useAuthStore();
  const { tickets, fetchTickets, loading: ticketLoading } = useTicketStore();
  const {
    selectedTechnician,
    fetchTechnicianById,
    updateAvailability,
    updateOwnSkills,
    loading: techLoading,
  } = useTechnicianStore();

  const [selectedTicketForResolve, setSelectedTicketForResolve] = useState(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
    if (user?.id) {
      fetchTechnicianById(user.id);
    }
  }, [user, fetchTickets, fetchTechnicianById]);

  // Filter tickets assigned to logged-in technician
  const myTickets = tickets.filter(
    (t) => (t.assignedTo?._id === user?.id || t.assignedTo === user?.id)
  );

  const pendingWork = myTickets.filter(
    (t) => t.status === 'Assigned' || t.status === 'In Progress' || t.status === 'Reopened'
  );

  const resolvedWork = myTickets.filter(
    (t) => t.status === 'Resolved' || t.status === 'Closed'
  );

  const criticalUrgent = pendingWork.filter(
    (t) => t.priority === 'Critical' || t.priority === 'High' || t.slaStatus === 'Overdue'
  );

  const currentAvailability = selectedTechnician?.availability || 'Available';
  const currentSkills = selectedTechnician?.skills || [];
  const skillsVerified = selectedTechnician?.skillsVerified || false;

  const handleAvailabilityChange = async (newStatus) => {
    if (!user?.id) return;
    await updateAvailability(user.id, newStatus);
    fetchTechnicianById(user.id);
  };

  const handleSkillsSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillsArray.length === 0) return;

    const res = await updateOwnSkills(skillsArray);
    if (res.success) {
      setIsSkillsModalOpen(false);
      fetchTechnicianById(user.id);
    }
  };

  const isLoading = ticketLoading || techLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Resolve Modal */}
      {selectedTicketForResolve && (
        <ServiceResolveModal
          isOpen={!!selectedTicketForResolve}
          ticket={selectedTicketForResolve}
          onClose={() => setSelectedTicketForResolve(null)}
          onSuccess={() => fetchTickets()}
        />
      )}

      {/* Skills Update Modal */}
      <Modal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        title="Update Technical Skills"
        subtitle="Submitted skills will be routed to IT Manager for verified status."
      >
        <form onSubmit={handleSkillsSubmit} className="space-y-4">
          <Input
            label="Skills & Certifications (Comma-separated)"
            placeholder="Hardware, Network, Mac OS, VPN, Cloud Access"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            helperText="Separate each specialty with a comma. Once submitted, status will show pending verification."
            required
          />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
            <Button
              variant="secondary"
              onClick={() => setIsSkillsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Send}>
              Submit for Verification
            </Button>
          </div>
        </form>
      </Modal>

      {/* Header & Live Status Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            Field Engineering Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Technician Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Assigned ticket fulfillment, resolution proof capture, and workload controls.
          </p>
        </div>

        {/* Live Availability Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          {['Available', 'Busy', 'Offline'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => handleAvailabilityChange(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${currentAvailability === st ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Queue</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {pendingWork.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Tickets assigned to you
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical / High</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-400">
            {criticalUrgent.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Urgent SLA attention required
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved & Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {resolvedWork.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Successfully closed incidents
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Skills Status</span>
            <ShieldCheck className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-base font-bold text-slate-100 flex items-center gap-1.5 pt-1">
            {skillsVerified ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> IT Manager Verified
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Pending Approval
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {currentSkills.length} specializations registered
          </p>
        </div>
      </div>

      {/* Workload Capacity & Skills Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Capacity */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 space-y-3">
          <h3 className="text-sm font-semibold text-slate-100">Current Workload Capacity</h3>
          <p className="text-xs text-slate-400">
            Your maximum ticket threshold is configured by the IT Manager.
          </p>
          <div className="pt-2">
            <CapacityIndicator
              active={selectedTechnician?.activeTickets || pendingWork.length}
              max={selectedTechnician?.maxActiveTickets || 5}
            />
          </div>
        </div>

        {/* Skills Registry */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-100">My Specializations</h3>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setSkillsInput(currentSkills.join(', '));
                  setIsSkillsModalOpen(true);
                }}
              >
                Update Skills
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentSkills.length > 0 ? (
                currentSkills.map((s, idx) => (
                  <SkillBadge key={idx} skill={s} isVerified={skillsVerified} />
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">
                  No skills submitted yet. Click Update Skills to add your domains.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Assigned Work Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Assigned Ticket Queue ({pendingWork.length})
            </h3>
            <p className="text-xs text-slate-400">
              Tickets assigned to you awaiting diagnosis, repair, and proof submission.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/tickets')}
          >
            All Tickets ({myTickets.length})
          </Button>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : pendingWork.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No pending tickets in your queue! You are fully caught up.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingWork.map((ticket) => (
              <div
                key={ticket._id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      #{ticket._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {ticket.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({ticket.category})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {ticket.description}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Requester: {ticket.createdBy?.name || 'Employee'} • Priority: {ticket.priority}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="violet"
                    size="sm"
                    icon={Wrench}
                    onClick={() => setSelectedTicketForResolve(ticket)}
                  >
                    Resolve & Proof
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

