import React, { useEffect, useState, useMemo } from 'react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import UserTable from '../../components/users/UserTable';
import UserEditModal from '../../components/users/UserEditModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import {
  Users,
  Search,
  Filter,
} from 'lucide-react';

export default function UsersPage() {
  const { users, fetchUsers, deleteUser, loading } = useUserStore();
  const { user: currentUser } = useAuthStore();

  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const isAdmin = currentUser?.role === 'System Admin';

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = u.name?.toLowerCase().includes(q);
        const matchesEmail = u.email?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail) return false;
      }

      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;

      return true;
    });
  }, [users, search, roleFilter]);

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    await deleteUser(deletingUser._id);
    setDeletingUser(null);
    fetchUsers();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Edit Modal */}
      {editingUser && (
        <UserEditModal
          isOpen={!!editingUser}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => fetchUsers()}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        message="Are you sure you want to permanently delete account for?"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-rose-400" />
            Identity & Authorization
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            User Account Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enterprise staff directory, role assignments, and account authorization matrix.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
        >
          <option value="ALL">All Roles</option>
          <option value="System Admin">System Admin</option>
          <option value="IT Manager">IT Manager</option>
          <option value="Technician">Technician</option>
          <option value="Employee">Employee</option>
          <option value="Asset Manager">Asset Manager</option>
        </select>
      </div>

      {/* User Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Users Found"
          description="No users match your query."
        />
      ) : (
        <UserTable
          users={filteredUsers}
          currentUserId={currentUser?.id}
          onEdit={isAdmin ? (u) => setEditingUser(u) : undefined}
          onDelete={isAdmin ? (u) => setDeletingUser(u) : undefined}
        />
      )}
    </div>
  );
}

