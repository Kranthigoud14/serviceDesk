import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssetStore } from '../../store/assetStore';
import { useAuthStore } from '../../store/authStore';
import AssetModal from '../../components/assets/AssetModal';
import AssetAssignModal from '../../components/assets/AssetAssignModal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import { formatDate } from '../../utils/formatters';
import {
  ArrowLeft,
  Boxes,
  User,
  Calendar,
  ShieldCheck,
  Edit,
  UserPlus,
  UserMinus,
} from 'lucide-react';

export default function AssetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedAsset: asset, fetchAssetById, unassignAsset, loading, error } = useAssetStore();
  const { user } = useAuthStore();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAssetById(id);
    }
  }, [id, fetchAssetById]);

  if (loading && !asset) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading asset specification telemetry...</p>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Asset Not Found"
          message={error || 'Hardware record could not be loaded.'}
          onRetry={() => fetchAssetById(id)}
        />
        <div className="text-center mt-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/assets')}>
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  const canManage =
    user?.role === 'Asset Manager' || user?.role === 'IT Manager' || user?.role === 'System Admin';

  const isWarrantyExpired = asset.warrantyExpiry && new Date(asset.warrantyExpiry) < new Date();

  const handleUnassign = async () => {
    await unassignAsset(asset._id);
    fetchAssetById(asset._id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <AssetModal
        isOpen={isEditOpen}
        asset={asset}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => fetchAssetById(asset._id)}
      />

      {isAssignOpen && (
        <AssetAssignModal
          isOpen={isAssignOpen}
          asset={asset}
          onClose={() => setIsAssignOpen(false)}
          onSuccess={() => fetchAssetById(asset._id)}
        />
      )}

      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/assets')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Asset Registry
      </button>

      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
            <Boxes className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{asset.name}</h1>
              <Badge variant={asset.status === 'Available' ? 'success' : 'primary'} size="sm" dot>
                {asset.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Tag: <span className="text-cyan-400 font-bold">{asset.assetTag}</span> • Type: {asset.type}
            </p>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2.5">
            {asset.status === 'Assigned' ? (
              <Button variant="secondary" size="sm" icon={UserMinus} onClick={handleUnassign}>
                Unassign
              </Button>
            ) : (
              <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setIsAssignOpen(true)}>
                Assign to Staff
              </Button>
            )}
            <Button variant="outline" size="sm" icon={Edit} onClick={() => setIsEditOpen(true)}>
              Edit
            </Button>
          </div>
        )}
      </div>

      {/* Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware Details */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Technical Specifications
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Brand / Manufacturer</span>
              <strong className="text-slate-200">{asset.brand || '—'}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Model</span>
              <strong className="text-slate-200">{asset.model || '—'}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Serial Number</span>
              <strong className="text-slate-200 font-mono">{asset.serialNumber || '—'}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Procurement Date</span>
              <strong className="text-slate-200 font-mono">{formatDate(asset.purchaseDate)}</strong>
            </div>
          </div>

          {asset.description && (
            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-1">Notes & Configuration:</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                {asset.description}
              </p>
            </div>
          )}
        </div>

        {/* Assignment & Warranty */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Custody & Warranty Telemetry
            </h3>

            {/* Custody Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 block uppercase">Currently Assigned Employee</span>
              {asset.assignedTo ? (
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{asset.assignedTo.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{asset.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  In warehouse inventory — not assigned to any personnel.
                </p>
              )}
            </div>

            {/* Warranty Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 block uppercase">OEM Warranty Status</span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-300 font-mono">
                  Expires: {formatDate(asset.warrantyExpiry)}
                </span>
                {isWarrantyExpired ? (
                  <Badge variant="danger" size="xs">
                    Warranty Expired
                  </Badge>
                ) : asset.warrantyExpiry ? (
                  <Badge variant="success" size="xs">
                    Active Warranty
                  </Badge>
                ) : (
                  <span className="text-xs text-slate-500">No warranty date</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-3">
            Registered {formatDate(asset.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}

