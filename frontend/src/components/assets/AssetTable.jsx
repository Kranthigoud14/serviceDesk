import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { User, Eye, Edit, UserPlus, UserMinus, Trash2 } from 'lucide-react';

export default function AssetTable({ assets = [], onEdit, onAssign, onUnassign, onDelete, canManage = false }) {
  const navigate = useNavigate();

  const statusVariants = {
    Available: 'success',
    Assigned: 'primary',
    'Under Maintenance': 'warning',
    Retired: 'default',
  };

  if (assets.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md shadow-xl">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">Asset Tag</th>
            <th className="py-3.5 px-4">Equipment & Model</th>
            <th className="py-3.5 px-4">Type</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Assigned Employee</th>
            <th className="py-3.5 px-4">Warranty Expiry</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {assets.map((a) => {
            const isWarrantyExpired = a.warrantyExpiry && new Date(a.warrantyExpiry) < new Date();

            return (
              <tr
                key={a._id}
                onClick={() => navigate(`/assets/${a._id}`)}
                className="hover:bg-slate-900/50 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                  {a.assetTag}
                </td>

                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {a.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {a.brand} {a.model ? `• ${a.model}` : ''}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-slate-300">{a.type}</td>

                <td className="py-3.5 px-4">
                  <Badge variant={statusVariants[a.status] || 'default'} size="xs" dot>
                    {a.status}
                  </Badge>
                </td>

                <td className="py-3.5 px-4 text-slate-300">
                  {a.assignedTo ? (
                    <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{a.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">Unassigned</span>
                  )}
                </td>

                <td className="py-3.5 px-4 font-mono text-[11px]">
                  {a.warrantyExpiry ? (
                    <span className={isWarrantyExpired ? 'text-rose-400 font-medium' : 'text-slate-400'}>
                      {formatDate(a.warrantyExpiry)}
                      {isWarrantyExpired && ' (Expired)'}
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    {canManage && (
                      <>
                        {a.status === 'Assigned' ? (
                          <button
                            type="button"
                            title="Unassign Asset"
                            onClick={() => onUnassign(a)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Assign to Employee"
                            onClick={() => onAssign(a)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          title="Edit Asset"
                          onClick={() => onEdit(a)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-300 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {onDelete && (
                          <button
                            type="button"
                            title="Delete Asset"
                            onClick={() => onDelete(a)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}

                    <button
                      type="button"
                      title="View Details"
                      onClick={() => navigate(`/assets/${a._id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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

