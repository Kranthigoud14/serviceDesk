import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAssetStore } from '../../store/assetStore';
import { useUserStore } from '../../store/userStore';
import { UserCheck, Search } from 'lucide-react';

export default function AssetAssignModal({ isOpen, onClose, asset, onSuccess }) {
  const { assignAsset, actionLoading } = useAssetStore();
  const { users, fetchUsers } = useUserStore();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setSelectedUserId(asset?.assignedTo?._id || '');
    }
  }, [isOpen, asset, fetchUsers]);

  if (!asset) return null;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedUserId) return;
    const res = await assignAsset(asset._id, selectedUserId);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Hardware Asset"
      subtitle={`Asset: ${asset.name} (${asset.serialNumber || "No S/N"})`}
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees by name, email, or role..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* User List */}
        <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 rounded-xl border border-slate-800 bg-slate-900/40 p-1">
          {filteredUsers.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-500">No matching users</p>
          ) : (
            filteredUsers.map((u) => {
              const isSelected = selectedUserId === u._id;
              return (
                <div
                  key={u._id}
                  onClick={() => setSelectedUserId(u._id)}
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${isSelected ? "bg-cyan-950/30 border border-cyan-500/30" : "hover:bg-slate-800/40"}`}
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-100">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email} • {u.role}</p>
                  </div>
                  <input
                    type="radio"
                    name="asset-user"
                    checked={isSelected}
                    onChange={() => setSelectedUserId(u._id)}
                    className="w-4 h-4 text-cyan-500 border-slate-700 cursor-pointer"
                  />
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            icon={UserCheck}
            loading={actionLoading}
            disabled={!selectedUserId}
            onClick={handleAssign}
          >
            Assign Asset
          </Button>
        </div>
      </div>
    </Modal>
  );
}

