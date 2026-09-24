import React, { useEffect, useState, useMemo } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { useAuthStore } from '../../store/authStore';
import AssetTable from '../../components/assets/AssetTable';
import AssetModal from '../../components/assets/AssetModal';
import AssetAssignModal from '../../components/assets/AssetAssignModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import {
  Boxes,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

export default function AssetsPage() {
  const { assets, fetchAssets, unassignAsset, deleteAsset, loading } = useAssetStore();
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assigningAsset, setAssigningAsset] = useState(null);
  const [deletingAsset, setDeletingAsset] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const canManage =
    user?.role === 'Asset Manager' || user?.role === 'IT Manager' || user?.role === 'System Admin';

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = a.name?.toLowerCase().includes(q);
        const matchesTag = a.assetTag?.toLowerCase().includes(q);
        const matchesSerial = a.serialNumber?.toLowerCase().includes(q);
        const matchesBrand = a.brand?.toLowerCase().includes(q);
        const matchesAssignee = a.assignedTo?.name?.toLowerCase().includes(q);
        if (!matchesName && !matchesTag && !matchesSerial && !matchesBrand && !matchesAssignee) {
          return false;
        }
      }

      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (typeFilter !== 'ALL' && a.type !== typeFilter) return false;

      return true;
    });
  }, [assets, search, statusFilter, typeFilter]);

  const handleUnassign = async (asset) => {
    await unassignAsset(asset._id);
    fetchAssets();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAsset) return;
    await deleteAsset(deletingAsset._id);
    setDeletingAsset(null);
    fetchAssets();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Modal */}
      <AssetModal
        isOpen={isModalOpen}
        asset={editingAsset}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAsset(null);
        }}
        onSuccess={() => fetchAssets()}
      />

      {assigningAsset && (
        <AssetAssignModal
          isOpen={!!assigningAsset}
          asset={assigningAsset}
          onClose={() => setAssigningAsset(null)}
          onSuccess={() => fetchAssets()}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingAsset}
        onClose={() => setDeletingAsset(null)}
        onConfirm={handleDeleteConfirm}
        title="Retire / Delete Hardware Asset"
        message="Are you sure you want to permanently delete asset ?"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-amber-400" />
            IT Infrastructure
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Hardware Asset Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Laptops, workstations, server units, and enterprise peripherals.
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingAsset(null);
              setIsModalOpen(true);
            }}
          >
            Add Hardware Asset
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tag, serial, model, employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Retired">Retired</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          <option value="Laptop">Laptop</option>
          <option value="Desktop">Desktop Workstation</option>
          <option value="Monitor">Monitor</option>
          <option value="Printer">Printer</option>
          <option value="Server">Server</option>
          <option value="Network Device">Network Device</option>
          <option value="Mobile">Mobile</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Asset Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredAssets.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No Assets Found"
          description="No equipment matches your current search criteria."
          actionLabel={canManage ? 'Add Asset' : undefined}
          onAction={() => {
            setEditingAsset(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <AssetTable
          assets={filteredAssets}
          canManage={canManage}
          onEdit={(a) => {
            setEditingAsset(a);
            setIsModalOpen(true);
          }}
          onAssign={(a) => setAssigningAsset(a)}
          onUnassign={handleUnassign}
          onDelete={user?.role === 'System Admin' ? (a) => setDeletingAsset(a) : undefined}
        />
      )}
    </div>
  );
}

