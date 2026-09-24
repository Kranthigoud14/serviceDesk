import React from 'react';
import { useNavigate } from 'react-router-dom';
import AvailabilityBadge from './AvailabilityBadge';
import CapacityIndicator from './CapacityIndicator';
import SkillBadge from './SkillBadge';
import { getInitials } from '../../utils/formatters';
import { ShieldCheck, Mail, ChevronRight, Wrench } from 'lucide-react';

export default function TechnicianCard({ technician, onVerifySkills }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/technicians/${technician._id}`)}
      className="p-5 rounded-2xl glass-panel glass-panel-hover border border-slate-800/80 cursor-pointer flex flex-col justify-between gap-4 transition-all duration-200 group"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-emerald-600/20">
              {getInitials(technician.name)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {technician.name}
                </h4>
                {technician.skillsVerified && (
                  <span title="Skills Verified">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" />
                {technician.email}
              </p>
            </div>
          </div>

          <AvailabilityBadge availability={technician.availability} />
        </div>

        {/* Capacity Bar */}
        <div className="pt-1">
          <CapacityIndicator
            active={technician.activeTickets || 0}
            max={technician.maxActiveTickets || 5}
          />
        </div>

        {/* Skills */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-medium text-slate-400 block">
            Specializations ({technician.skills?.length || 0}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {technician.skills?.length > 0 ? (
              technician.skills.map((s, idx) => (
                <SkillBadge
                  key={idx}
                  skill={s}
                  isVerified={technician.skillsVerified}
                />
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No skills entered yet</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <span>View Operational Profile</span>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
      </div>
    </div>
  );
}

