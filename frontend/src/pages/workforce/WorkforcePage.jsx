import React, { useEffect, useState } from 'react';
import { useWorkforceStore } from '../../store/workforceStore';
import { useTicketStore } from '../../store/ticketStore';
import { useTechnicianStore } from '../../store/technicianStore';
import TicketAssignModal from '../../components/tickets/TicketAssignModal';
import SkillBadge from '../../components/technicians/SkillBadge';
import CapacityIndicator from '../../components/technicians/CapacityIndicator';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Cpu,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  Star,
  Gauge,
  UserCheck,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export default function WorkforcePage() {
  const { tickets, fetchTickets } = useTicketStore();
  const { technicians, fetchTechnicians } = useTechnicianStore();
  const {
    recommendations,
    ticketInfo,
    scoringInfo,
    fetchRecommendations,
    loading: recLoading,
    error: recError,
  } = useWorkforceStore();

  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [assigningTicket, setAssigningTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
    fetchTechnicians();
  }, [fetchTickets, fetchTechnicians]);

  // Tickets available for recommendation testing
  const unassignedOrOpen = tickets.filter(
    (t) => t.status !== 'Closed' && t.status !== 'Resolved'
  );

  useEffect(() => {
    if (unassignedOrOpen.length > 0 && !selectedTicketId) {
      setSelectedTicketId(unassignedOrOpen[0]._id);
      fetchRecommendations(unassignedOrOpen[0]._id);
    }
  }, [unassignedOrOpen, selectedTicketId, fetchRecommendations]);

  const handleSelectTicket = (id) => {
    setSelectedTicketId(id);
    fetchRecommendations(id);
  };

  const currentTicket = tickets.find((t) => t._id === selectedTicketId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Assign Modal */}
      {assigningTicket && (
        <TicketAssignModal
          isOpen={!!assigningTicket}
          ticket={assigningTicket}
          onClose={() => setAssigningTicket(null)}
          onSuccess={() => {
            fetchTickets();
            fetchTechnicians();
            if (selectedTicketId) fetchRecommendations(selectedTicketId);
          }}
        />
      )}

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-950/40 via-blue-950/30 to-slate-900 border border-violet-500/20 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-violet-400" />
              Algorithmic Resource Allocation
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Workforce Intelligence Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Multi-signal recommendation matrix pairing verified technical competence, real-time workload capacity, SLA windows, and customer satisfaction ratings.
            </p>
          </div>

          <div className="shrink-0 p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-center font-mono">
            <span className="text-[11px] text-violet-300 block uppercase font-sans">Active Pool</span>
            <span className="text-2xl font-bold text-violet-300">
              {technicians.filter((t) => t.availability === 'Available').length} / {technicians.length}
            </span>
            <span className="text-[10px] text-slate-400 block font-sans">Techs Available</span>
          </div>
        </div>

        {/* Algorithm Scoring Factors Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Skill Match</span>
              <strong className="text-slate-200">50 Points</strong>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Availability</span>
              <strong className="text-slate-200">20 Points</strong>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Capacity</span>
              <strong className="text-slate-200">20 Points</strong>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Low Workload</span>
              <strong className="text-slate-200">10 Points</strong>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Customer Rating</span>
              <strong className="text-slate-200">10 Points</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Recommendation Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Ticket Selector Queue */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Select Incident to Triage ({unassignedOrOpen.length})
            </h3>
            <p className="text-xs text-slate-400">Choose a ticket to simulate recommendation scoring</p>
          </div>

          <div className="space-y-2.5 max-h-[34rem] overflow-y-auto pr-1">
            {unassignedOrOpen.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                No active tickets requiring triage
              </div>
            ) : (
              unassignedOrOpen.map((t) => {
                const isSelected = selectedTicketId === t._id;
                return (
                  <div
                    key={t._id}
                    onClick={() => handleSelectTicket(t._id)}
                    className="p-3.5 rounded-2xl border transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-cyan-400">
                        #{t._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {t.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {t.title}
                    </h4>
                    <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 font-mono">
                      <span>Priority: {t.priority}</span>
                      <span>{t.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: AI Match Results & Scoring Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Workforce Intelligence Ranking
              </h3>
              {currentTicket && (
                <p className="text-xs text-slate-400">
                  Evaluating candidates for <strong>{currentTicket.title}</strong> ({currentTicket.category})
                </p>
              )}
            </div>

            {currentTicket && (
              <Button
                variant="primary"
                size="sm"
                icon={UserCheck}
                onClick={() => setAssigningTicket(currentTicket)}
              >
                Dispatch Technician
              </Button>
            )}
          </div>

          {recLoading ? (
            <div className="py-20 text-center rounded-3xl glass-panel border border-slate-800/80 space-y-3">
              <Cpu className="w-8 h-8 text-violet-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">
                Calculating skill weights, current queue load, and SLA urgency...
              </p>
            </div>
          ) : recError || recommendations.length === 0 ? (
            <div className="p-8 text-center rounded-3xl glass-panel border border-dashed border-slate-800 space-y-2">
              <p className="text-sm font-medium text-slate-300">
                {recError || 'No eligible technicians found for this incident.'}
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Technicians must be Available, have verified skills, and retain active capacity. Check the Technician Directory to verify pending skills.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec, index) => {
                const tech = rec.technician;
                const isTopPick = index === 0;

                return (
                  <div
                    key={tech.id}
                    className="p-5 rounded-2xl glass-panel border transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-bold text-slate-100">
                            {tech.name}
                          </span>
                          {isTopPick && (
                            <Badge variant="violet" size="xs">
                              Top Recommendation
                            </Badge>
                          )}
                          {rec.skillMatch && (
                            <Badge variant="success" size="xs">
                              Exact Skill Match
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-slate-400">
                          {tech.email} • Skills: {tech.skills?.join(', ') || 'None'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                          <span>
                            Active Tickets: <strong className="text-slate-200">{rec.activeTickets}</strong> / {tech.maxActiveTickets}
                          </span>
                          <span>
                            Remaining Capacity: <strong className="text-emerald-400">{rec.availableCapacity}</strong>
                          </span>
                          {rec.averageRating && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {rec.averageRating} ({rec.totalRatings} ratings)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-2xl font-black font-mono text-cyan-400 leading-none">
                            {rec.score}
                          </div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            Match Score
                          </span>
                        </div>

                        <Button
                          variant={isTopPick ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setAssigningTicket(currentTicket)}
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

