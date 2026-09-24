import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssetStore } from '../../store/assetStore';
import AssetTable from '../../components/assets/AssetTable';
import AssetModal from '../../components/assets/AssetModal';
import AssetAssignModal from '../../components/assets/AssetAssignModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/Skeleton';
import {
  Boxes,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function AssetManagerDashboard() {
  const { assets, fetchAssets, unassignAsset, deleteAsset, loading } = useAssetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assigningAsset, setAssigningAsset] = useState(null);
  const [deletingAsset, setDeletingAsset] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const availableAssets = assets.filter((a) => a.status === 'Available');
  const assignedAssets = assets.filter((a) => a.status === 'Assigned');
  const maintenanceAssets = assets.filter((a) => a.status === 'Under Maintenance');

  // Warranty status
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const warrantyExpiringSoon = assets.filter((a) => {
    if (!a.warrantyExpiry) return false;
    const exp = new Date(a.warrantyExpiry);
    return exp >= now && exp <= thirtyDaysFromNow;
  });

  const warrantyExpired = assets.filter((a) => {
    if (!a.warrantyExpiry) return false;
    return new Date(a.warrantyExpiry) < now;
  });

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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Create / Edit Modal */}
      <AssetModal
        isOpen={isModalOpen}
        asset={editingAsset}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAsset(null);
        }}
        onSuccess={() => fetchAssets()}
      />

      {/* Assign Modal */}
      {assigningAsset && (
        <AssetAssignModal
          isOpen={!!assigningAsset}
          asset={assigningAsset}
          onClose={() => setAssigningAsset(null)}
          onSuccess={() => fetchAssets()}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingAsset}
        onClose={() => setDeletingAsset(null)}
        onConfirm={handleDeleteConfirm}
        title="Retire / Delete Hardware Asset"
        message={`Are you sure you want to permanently delete asset "${deletingAsset?.name || ""}"? This action cannot be undone.`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-amber-400" />
            IT Asset Lifecycle Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Asset Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track enterprise hardware inventory, employee assignments, and warranty expirations.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingAsset(null);
            setIsModalOpen(true);
          }}
        >
          Register New Asset
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Inventory
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-100">
            {assets.length}
          </div>
          <p className="text-[11px] text-slate-400">Registered devices</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Available Stock
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            {availableAssets.length}
          </div>
          <p className="text-[11px] text-slate-400">Ready to be deployed</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Assigned to Staff
          </span>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {assignedAssets.length}
          </div>
          <p className="text-[11px] text-slate-400">In active employee use</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Warranty Risks
          </span>
          <div className="text-3xl font-extrabold font-mono text-amber-400">
            {warrantyExpiringSoon.length + warrantyExpired.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {warrantyExpired.length} Expired • {warrantyExpiringSoon.length} Expiring soon
          </p>
        </div>
      </div>

      {/* Warranty Alert Banner */}
      {(warrantyExpiringSoon.length > 0 || warrantyExpired.length > 0) && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <p className="font-semibold text-amber-300">Warranty Alert Notification</p>
            <p className="text-slate-400 mt-0.5">
              You have {warrantyExpired.length} assets with expired OEM warranties and {warrantyExpiringSoon.length} assets expiring in the next 30 days. Consider service renewal or procurement replacement.
            </p>
          </div>
        </div>
      )}

      {/* Assets Inventory Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Registered Hardware Equipment</h3>
            <p className="text-xs text-slate-400">Full IT asset register with assignment controls</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/assets')}
          >
            All Assets ({assets.length})
          </Button>
        </div>

        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <AssetTable
            assets={assets.slice(0, 8)}
            canManage={true}
            onEdit={(asset) => {
              setEditingAsset(asset);
              setIsModalOpen(true);
            }}
            onAssign={(asset) => setAssigningAsset(asset)}
            onUnassign={handleUnassign}
          />
        )}
      </div>
    </div>
  );
}

