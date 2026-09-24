import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTicketStore } from '../../store/ticketStore';
import { useAuthStore } from '../../store/authStore';
import TicketTable from '../../components/tickets/TicketTable';
import TicketCard from '../../components/tickets/TicketCard';
import TicketCreateModal from '../../components/tickets/TicketCreateModal';
import TicketAssignModal from '../../components/tickets/TicketAssignModal';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import {
  Ticket,
  PlusCircle,
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';

export default function TicketsListPage() {
  const { tickets, fetchTickets, loading } = useTicketStore();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [assignTicket, setAssignTicket] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'ALL';
  const priorityFilter = searchParams.get('priority') || 'ALL';

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Role scope: if employee, filter to tickets created by employee unless admin/manager
      if (user?.role === 'Employee') {
        const isCreator = t.createdBy?._id === user?.id || t.createdBy === user?.id;
        if (!isCreator) return false;
      }
      // If technician, default to tickets assigned to them or unassigned
      if (user?.role === 'Technician' && searchParams.get('scope') === 'assigned') {
        const isAssigned = t.assignedTo?._id === user?.id || t.assignedTo === user?.id;
        if (!isAssigned) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title?.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesId = t._id?.toLowerCase().includes(q);
        const matchesTech = t.assignedTo?.name?.toLowerCase().includes(q);
        const matchesCreator = t.createdBy?.name?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesId && !matchesTech && !matchesCreator) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'ALL' && t.status !== statusFilter) {
        return false;
      }

      // Priority
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [tickets, user, searchQuery, statusFilter, priorityFilter, searchParams]);

  const updateFilter = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'ALL' || !val) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Create Modal */}
      <TicketCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchTickets()}
      />

      {/* Assign Modal */}
      {assignTicket && (
        <TicketAssignModal
          isOpen={!!assignTicket}
          ticket={assignTicket}
          onClose={() => setAssignTicket(null)}
          onSuccess={() => fetchTickets()}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-cyan-400" />
            Service Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            {user?.role === 'Employee' ? 'My Support Inquiries' : 'Incident & Ticket Registry'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time tracking, SLA countdowns, workforce assignments, and OTP verification.
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate('/tickets/new')}
        >
          Create Ticket
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter title, ID, author..."
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved (Pending OTP)</option>
            <option value="Closed">Closed (Verified)</option>
            <option value="Reopened">Reopened</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="Low">Low (72h SLA)</option>
            <option value="Medium">Medium (24h SLA)</option>
            <option value="High">High (8h SLA)</option>
            <option value="Critical">Critical (4h SLA)</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "table" ? "bg-slate-800 text-cyan-400 shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "cards" ? "bg-slate-800 text-cyan-400 shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            title="Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No tickets found"
          description="No incident reports match your current filter parameters."
          actionLabel="Create New Ticket"
          onAction={() => navigate('/tickets/new')}
        />
      ) : viewMode === 'table' ? (
        <TicketTable
          tickets={filteredTickets}
          userRole={user?.role}
          onAssign={(t) => setAssignTicket(t)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

