import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  confirmVariant = 'danger',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" title="">
      <div className="flex flex-col items-center text-center p-2">
        <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
        <p className="text-sm text-slate-400 mb-6">{message}</p>

        <div className="flex items-center gap-3 w-full justify-end">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

