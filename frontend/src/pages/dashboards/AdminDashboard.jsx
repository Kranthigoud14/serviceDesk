import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useTicketStore } from '../../store/ticketStore';
import { useAssetStore } from '../../store/assetStore';
import { TableSkeleton } from '../../components/common/Skeleton';
import TicketTable from '../../components/tickets/TicketTable';
import Button from '../../components/common/Button';
import {
  Users,
  Ticket,
  Boxes,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  Cpu,
} from 'lucide-react';

export default function AdminDashboard() {
  const { users, fetchUsers, loading: userLoading } = useUserStore();
  const { tickets, fetchTickets, loading: ticketLoading } = useTicketStore();
  const { assets, fetchAssets } = useAssetStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchTickets();
    fetchAssets();
  }, [fetchUsers, fetchTickets, fetchAssets]);

  const technicians = users.filter((u) => u.role === 'Technician');
  const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'Assigned' || t.status === 'In Progress');
  const resolvedTickets = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed');
  const overdueTickets = tickets.filter((t) => t.slaStatus === 'Overdue');
  const availableAssets = assets.filter((a) => a.status === 'Available');

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const isLoading = userLoading || ticketLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Platform Operations & Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time infrastructure health, user authorization matrix, and ticket flow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Users}
            onClick={() => navigate('/users')}
          >
            Manage Users
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Cpu}
            onClick={() => navigate('/workforce')}
          >
            Workforce Intel
          </Button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Accounts</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-100">
            {users.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {technicians.length} Technicians • {roleCounts['IT Manager'] || 0} Managers
          </p>
        </div>

        {/* Tickets */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Tickets</span>
            <Ticket className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {openTickets.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {resolvedTickets.length} Resolved • {tickets.length} Total
          </p>
        </div>

        {/* SLA Health */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">SLA Breaches</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-400">
            {overdueTickets.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Requires supervisor intervention
          </p>
        </div>

        {/* Assets */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Hardware Assets</span>
            <Boxes className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {assets.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {availableAssets.length} Available in stock
          </p>
        </div>
      </div>

      {/* Role Breakdown Distribution */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Workforce Role Distribution
          </h3>
          <span className="text-xs text-slate-400 font-mono">5 Roles Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {['System Admin', 'IT Manager', 'Technician', 'Employee', 'Asset Manager'].map((role) => (
            <div
              key={role}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center space-y-1"
            >
              <span className="text-[11px] font-medium text-slate-400 block truncate">
                {role}
              </span>
              <span className="text-xl font-bold font-mono text-slate-100 block">
                {roleCounts[role] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent High Priority & Breached Tickets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Critical Incident Queue</h3>
            <p className="text-xs text-slate-400">Recent tickets requiring administrative visibility</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/tickets')}
          >
            All Tickets
          </Button>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : (
          <TicketTable tickets={tickets.slice(0, 6)} />
        )}
      </div>
    </div>
  );
}

