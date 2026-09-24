import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useAssetStore } from '../../store/assetStore';
import { Boxes } from 'lucide-react';

const ASSET_TYPES = [
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Desktop', label: 'Desktop Workstation' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Printer', label: 'Printer / Scanner' },
  { value: 'Keyboard', label: 'Keyboard' },
  { value: 'Mouse', label: 'Mouse' },
  { value: 'Mobile', label: 'Mobile Device' },
  { value: 'Server', label: 'Server Infrastructure' },
  { value: 'Network Device', label: 'Network Device (Switch, Router)' },
  { value: 'Other', label: 'Other Asset' },
];

const ASSET_STATUSES = [
  { value: 'Available', label: 'Available for Assignment' },
  { value: 'Assigned', label: 'Assigned to Employee' },
  { value: 'Under Maintenance', label: 'Under Maintenance' },
  { value: 'Retired', label: 'Retired / Decommissioned' },
];

export default function AssetModal({ isOpen, onClose, asset = null, onSuccess }) {
  const { createAsset, updateAsset, actionLoading } = useAssetStore();
  const isEdit = !!asset;

  const [formData, setFormData] = useState({
    name: '',
    type: 'Laptop',
    assetTag: '',
    serialNumber: '',
    brand: '',
    model: '',
    status: 'Available',
    purchaseDate: '',
    warrantyExpiry: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        type: asset.type || 'Laptop',
        assetTag: asset.assetTag || '',
        serialNumber: asset.serialNumber || '',
        brand: asset.brand || '',
        model: asset.model || '',
        status: asset.status || 'Available',
        purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
        warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.split('T')[0] : '',
        description: asset.description || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'Laptop',
        assetTag: '',
        serialNumber: '',
        brand: '',
        model: '',
        status: 'Available',
        purchaseDate: '',
        warrantyExpiry: '',
        description: '',
      });
    }
    setErrors({});
  }, [asset, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Asset Name is required';
    if (!formData.assetTag.trim()) errs.assetTag = 'Asset Tag is required';
    if (!formData.type) errs.type = 'Asset Type is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      serialNumber: formData.serialNumber.trim() || undefined,
      description: formData.description.trim(),
      purchaseDate: formData.purchaseDate || null,
      warrantyExpiry: formData.warrantyExpiry || null,
    };

    let res;
    if (isEdit) {
      payload.status = formData.status;
      res = await updateAsset(asset._id, payload);
    } else {
      payload.assetTag = formData.assetTag.trim();
      res = await createAsset(payload);
    }

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Update Asset Details' : 'Register New IT Asset'}
      subtitle="Manage hardware registry and lifecycle specifications."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Asset Name"
            placeholder="e.g. Dell XPS 15 or MacBook M3"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Select
            label="Asset Type"
            options={ASSET_TYPES}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            error={errors.type}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Asset Tag (Unique ID)"
            placeholder="e.g. AST-1002"
            value={formData.assetTag}
            onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
            error={errors.assetTag}
            disabled={isEdit}
            required
          />

          <Input
            label="Serial Number"
            placeholder="e.g. SN-89472910"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Brand / Manufacturer"
            placeholder="e.g. Apple, Dell, HP"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />

          <Input
            label="Model Specification"
            placeholder="e.g. Precision 5570"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          />
        </div>

        {isEdit && (
          <Select
            label="Status"
            options={ASSET_STATUSES}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Purchase Date"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          />

          <Input
            label="Warranty Expiry Date"
            type="date"
            value={formData.warrantyExpiry}
            onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-medium text-slate-300">
            Notes & Configuration
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="RAM, Storage, OS details or procurement notes..."
            className="w-full rounded-lg bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm px-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Boxes}
            loading={actionLoading}
          >
            {isEdit ? 'Save Changes' : 'Register Asset'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

