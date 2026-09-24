import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useTicketStore } from '../../store/ticketStore';
import { useWorkforceStore } from '../../store/workforceStore';
import { useTechnicianStore } from '../../store/technicianStore';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Star,
  Gauge,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export default function TicketAssignModal({ isOpen, onClose, ticket, onSuccess }) {
  const { assignTicket, actionLoading } = useTicketStore();
  const { recommendations, fetchRecommendations, loading: recLoading, error: recError } =
    useWorkforceStore();
  const { technicians, fetchTechnicians } = useTechnicianStore();

  const [selectedTechId, setSelectedTechId] = useState('');
  const [activeTab, setActiveTab] = useState('intelligence'); // 'intelligence' | 'all'

  useEffect(() => {
    if (isOpen && ticket) {
      setSelectedTechId(ticket.assignedTo?._id || '');
      fetchRecommendations(ticket._id);
      fetchTechnicians();
    }
  }, [isOpen, ticket, fetchRecommendations, fetchTechnicians]);

  if (!ticket) return null;

  const handleAssign = async () => {
    if (!selectedTechId) return;
    const res = await assignTicket(ticket._id, selectedTechId);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Workforce Dispatch & Assignment"
      subtitle={`Ticket #${ticket._id?.slice(-6).toUpperCase()} ? Category: ${ticket.category}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Mode Tabs */}
        <div className="flex border-b border-slate-800 pb-2 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('intelligence')}
            className={`text-xs font-semibold pb-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === "intelligence" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            Workforce Intelligence ({recommendations.length} Recommended)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`text-xs font-semibold pb-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === "all" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          >
            <UserCheck className="w-4 h-4" />
            All Active Technicians ({technicians.length})
          </button>
        </div>

        {/* Tab 1: AI Workforce Intelligence Recommendations */}
        {activeTab === 'intelligence' && (
          <div className="space-y-3">
            {recLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
                <p>Computing workforce capacity, verified skills & SLA alignment...</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-xs text-slate-400">
                <p className="font-medium text-slate-300 mb-1">
                  No optimal recommendations found for {ticket.category}
                </p>
                <p className="text-slate-500 mb-4">
                  Available technicians may have full capacity or unverified skills.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setActiveTab('all')}
                >
                  Browse All Technicians
                </Button>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {recommendations.map((rec) => {
                  const tech = rec.technician;
                  const isSelected = selectedTechId === tech.id;

                  return (
                    <div
                      key={tech.id}
                      onClick={() => setSelectedTechId(tech.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${isSelected ? "border-cyan-500 bg-cyan-950/20" : "border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100">{tech.name}</span>
                          <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                            Score: {rec.score}/100
                          </span>
                          {rec.skillMatch && (
                            <Badge variant="success" size="xs">
                              Skill Match
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-slate-500" />
                            Active: {rec.activeTickets} / {tech.maxActiveTickets} (Cap: {rec.availableCapacity} left)
                          </span>
                          {rec.averageRating && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {rec.averageRating} ({rec.totalRatings})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        <input
                          type="radio"
                          name="technician-recommendation"
                          checked={isSelected}
                          onChange={() => setSelectedTechId(tech.id)}
                          className="w-4 h-4 text-cyan-500 border-slate-700 focus:ring-cyan-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: All Technicians */}
        {activeTab === 'all' && (
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {technicians.map((tech) => {
              const isSelected = selectedTechId === tech._id;
              return (
                <div
                  key={tech._id}
                  onClick={() => setSelectedTechId(tech._id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${isSelected ? "border-blue-500 bg-blue-950/20" : "border-slate-800 bg-slate-900/60 hover:border-slate-700"}`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-100">{tech.name}</span>
                      <Badge
                        variant={tech.availability === 'Available' ? 'success' : 'warning'}
                        size="xs"
                      >
                        {tech.availability}
                      </Badge>
                      {tech.skillsVerified && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      Skills: {tech.skills?.join(', ') || 'No skills listed'}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="technician-all"
                    checked={isSelected}
                    onChange={() => setSelectedTechId(tech._id)}
                    className="w-4 h-4 text-blue-500 border-slate-700 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400">
            {selectedTechId ? '1 Technician selected' : 'Select a technician to assign'}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={UserCheck}
              loading={actionLoading}
              disabled={!selectedTechId}
              onClick={handleAssign}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

