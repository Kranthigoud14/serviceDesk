import React from 'react';
import Badge from '../common/Badge';
import { getInitials } from '../../utils/formatters';
import { formatDate } from '../../utils/formatters';
import { Edit, Trash2, ShieldCheck, Mail } from 'lucide-react';

export default function UserTable({ users = [], onEdit, onDelete, currentUserId }) {
  const roleColors = {
    'System Admin': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'IT Manager': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Technician: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Employee: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    'Asset Manager': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  if (users.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md shadow-xl">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">User Name</th>
            <th className="py-3.5 px-4">Email Address</th>
            <th className="py-3.5 px-4">Role</th>
            <th className="py-3.5 px-4">Availability</th>
            <th className="py-3.5 px-4">Skills / Verification</th>
            <th className="py-3.5 px-4">Max Capacity</th>
            <th className="py-3.5 px-4">Registered</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {users.map((u) => {
            const isSelf = u._id === currentUserId;

            return (
              <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                {/* Name */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400">
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <span className="font-medium text-slate-100">{u.name}</span>
                      {isSelf && (
                        <span className="ml-2 text-[10px] text-cyan-400 font-semibold">(You)</span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{u.email}</td>

                {/* Role */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${roleColors[u.role] || 'bg-slate-800 text-slate-300'}`}
                  >
                    {u.role}
                  </span>
                </td>

                {/* Availability */}
                <td className="py-3.5 px-4">
                  {u.role === 'Technician' ? (
                    <Badge
                      variant={
                        u.availability === 'Available'
                          ? 'success'
                          : u.availability === 'Busy'
                          ? 'warning'
                          : 'default'
                      }
                      size="xs"
                      dot
                    >
                      {u.availability}
                    </Badge>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>

                {/* Skills */}
                <td className="py-3.5 px-4">
                  {u.role === 'Technician' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300">
                        {u.skills?.length > 0 ? u.skills.slice(0, 2).join(', ') : 'None'}
                        {u.skills?.length > 2 ? `+${u.skills.length - 2}` : ""}
                      </span>
                      {u.skillsVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>

                {/* Capacity */}
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  {u.role === 'Technician' ? `${u.maxActiveTickets || 5} tickets` : '—'}
                </td>

                {/* Registered */}
                <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                  {formatDate(u.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button
                        type="button"
                        title="Edit User Name"
                        onClick={() => onEdit(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-300 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}

                    {onDelete && !isSelf && (
                      <button
                        type="button"
                        title="Delete User"
                        onClick={() => onDelete(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

