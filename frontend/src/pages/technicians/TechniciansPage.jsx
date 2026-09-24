import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTechnicianStore } from '../../store/technicianStore';
import { useAuthStore } from '../../store/authStore';
import TechnicianCard from '../../components/technicians/TechnicianCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/Skeleton';
import {
  Wrench,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  Users,
} from 'lucide-react';

export default function TechniciansPage() {
  const { technicians, fetchTechnicians, verifySkills, loading } = useTechnicianStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [verifiedFilter, setVerifiedFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((tech) => {
      // Search by name, email, skills
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = tech.name?.toLowerCase().includes(q);
        const matchesEmail = tech.email?.toLowerCase().includes(q);
        const matchesSkill = tech.skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesSkill) return false;
      }

      // Availability
      if (availabilityFilter !== 'ALL' && tech.availability !== availabilityFilter) {
        return false;
      }

      // Verified
      if (verifiedFilter === 'verified' && !tech.skillsVerified) return false;
      if (verifiedFilter === 'unverified' && tech.skillsVerified) return false;

      return true;
    });
  }, [technicians, search, availabilityFilter, verifiedFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            Engineering Workforce
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Technician Directory & Capacity
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live technician availability, capacity monitoring, and verified skillset registry.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, skill, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="Available">Available Only</option>
          <option value="Busy">Busy Only</option>
          <option value="Offline">Offline Only</option>
        </select>

        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
        >
          <option value="ALL">All Skill Statuses</option>
          <option value="verified">Verified Skills</option>
          <option value="unverified">Pending Verification</option>
        </select>
      </div>

      {/* Technicians Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTechnicians.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Technicians Found"
          description="No technicians match the current availability or specialization filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechnicians.map((tech) => (
            <TechnicianCard
              key={tech._id}
              technician={tech}
              onVerifySkills={(id) => verifySkills(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

