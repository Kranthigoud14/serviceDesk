import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTechnicianStore } from '../../store/technicianStore';
import { useTicketStore } from '../../store/ticketStore';
import { useAuthStore } from '../../store/authStore';
import AvailabilityBadge from '../../components/technicians/AvailabilityBadge';
import CapacityIndicator from '../../components/technicians/CapacityIndicator';
import SkillBadge from '../../components/technicians/SkillBadge';
import TicketTable from '../../components/tickets/TicketTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';
import { getInitials } from '../../utils/formatters';
import {
  ArrowLeft,
  Wrench,
  ShieldCheck,
  Mail,
  Gauge,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export default function TechnicianDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    selectedTechnician: tech,
    fetchTechnicianById,
    verifySkills,
    updateCapacity,
    updateAvailability,
    loading,
    error,
  } = useTechnicianStore();

  const { tickets, fetchTickets } = useTicketStore();
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  const [newCapacity, setNewCapacity] = useState(5);

  useEffect(() => {
    if (id) {
      fetchTechnicianById(id);
      fetchTickets();
    }
  }, [id, fetchTechnicianById, fetchTickets]);

  useEffect(() => {
    if (tech) {
      setNewCapacity(tech.maxActiveTickets || 5);
    }
  }, [tech]);

  if (loading && !tech) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading technician profile & telemetry...</p>
      </div>
    );
  }

  if (error || !tech) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Technician Not Found"
          message={error || 'The technician profile could not be loaded.'}
          onRetry={() => fetchTechnicianById(id)}
        />
        <div className="text-center mt-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/technicians')}>
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  const isManager = user?.role === 'IT Manager' || user?.role === 'System Admin';
  const isSelf = user?.id === tech._id;

  // Tickets assigned to this technician
  const assignedTickets = tickets.filter(
    (t) => (t.assignedTo?._id === tech._id || t.assignedTo === tech._id)
  );

  const handleCapacitySubmit = async (e) => {
    e.preventDefault();
    const cap = parseInt(newCapacity, 10);
    if (isNaN(cap) || cap < 1) return;
    await updateCapacity(tech._id, cap);
    setIsCapacityModalOpen(false);
    fetchTechnicianById(tech._id);
  };

  const handleAvailabilityToggle = async (status) => {
    await updateAvailability(tech._id, status);
    fetchTechnicianById(tech._id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Capacity Modal */}
      <Modal
        isOpen={isCapacityModalOpen}
        onClose={() => setIsCapacityModalOpen(false)}
        title="Adjust Maximum Workload Capacity"
        subtitle="Set threshold limit for"
      >
        <form onSubmit={handleCapacitySubmit} className="space-y-4">
          <Input
            label="Maximum Concurrent Active Tickets"
            type="number"
            min="1"
            max="20"
            value={newCapacity}
            onChange={(e) => setNewCapacity(e.target.value)}
            helperText="Controls eligibility threshold in Workforce Intelligence recommendations."
            required
          />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
            <Button variant="secondary" onClick={() => setIsCapacityModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Threshold
            </Button>
          </div>
        </form>
      </Modal>

      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile Header */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-emerald-500/20">
            {getInitials(tech.name)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{tech.name}</h1>
              <AvailabilityBadge availability={tech.availability} />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {tech.email}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {(isSelf || isManager) && (
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {['Available', 'Busy', 'Offline'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleAvailabilityToggle(st)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          {isManager && (
            <Button
              variant="secondary"
              size="sm"
              icon={Sliders}
              onClick={() => setIsCapacityModalOpen(true)}
            >
              Adjust Capacity
            </Button>
          )}

          {isManager && !tech.skillsVerified && tech.skills?.length > 0 && (
            <Button
              variant="success"
              size="sm"
              icon={ShieldCheck}
              onClick={async () => {
                await verifySkills(tech._id);
                fetchTechnicianById(tech._id);
              }}
            >
              Verify Skills
            </Button>
          )}
        </div>
      </div>

      {/* Metrics & Skills Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Telemetry */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Workload & Capacity Limits
          </h3>

          <div className="pt-2">
            <CapacityIndicator
              active={tech.activeTickets || 0}
              max={tech.maxActiveTickets || 5}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Active Tickets</span>
              <strong className="text-lg text-slate-100 font-mono">
                {tech.activeTickets || 0}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Available Capacity</span>
              <strong className="text-lg text-emerald-400 font-mono">
                {tech.availableCapacity ?? Math.max((tech.maxActiveTickets || 5) - (tech.activeTickets || 0), 0)}
              </strong>
            </div>
          </div>
        </div>

        {/* Skills Verification Card */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Technical Competencies
              </h3>
              {tech.skillsVerified ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified by IT Manager
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-400">
                  Pending IT Manager Approval
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {tech.skills?.length > 0 ? (
                tech.skills.map((s, idx) => (
                  <SkillBadge key={idx} skill={s} isVerified={tech.skillsVerified} />
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No technical skills registered on this profile.
                </p>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-3">
            Verified skills grant a +50 score advantage during automated Workforce Intelligence matching.
          </p>
        </div>
      </div>

      {/* Tickets assigned to this technician */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Assigned Tickets History ({assignedTickets.length})
            </h3>
            <p className="text-xs text-slate-400">
              Incidents currently or historically handled by {tech.name}
            </p>
          </div>
        </div>

        <TicketTable tickets={assignedTickets} />
      </div>
    </div>
  );
}

