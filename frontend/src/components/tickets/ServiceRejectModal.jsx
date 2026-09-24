import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useTicketStore } from '../../store/ticketStore';
import { XCircle } from 'lucide-react';

export default function ServiceRejectModal({ isOpen, onClose, ticket, onSuccess }) {
  const { rejectService, actionLoading } = useTicketStore();
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  if (!ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejecting the service.');
      return;
    }

    setError('');
    const res = await rejectService(ticket._id, rejectionReason.trim());

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Service Resolution"
      subtitle={`Ticket #${ticket._id?.slice(-6).toUpperCase()} ? Technician: ${ticket.assignedTo?.name || 'Unassigned'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <p className="text-xs text-slate-300">
          If the reported issue is not fully resolved or equipment is still malfunctioning, state what remains broken so the technician can address it.
        </p>

        {error && <p className="text-xs text-rose-400">{error}</p>}

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Rejection Feedback & Remaining Issues
          </label>
          <textarea
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain what is still not working properly..."
            className="w-full rounded-lg bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm px-3.5 py-2.5 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            icon={XCircle}
            loading={actionLoading}
          >
            Reject & Reopen Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}
