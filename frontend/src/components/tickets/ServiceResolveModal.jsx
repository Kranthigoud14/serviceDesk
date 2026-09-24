import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useTicketStore } from '../../store/ticketStore';
import { Wrench, Upload, Image, CheckCircle } from 'lucide-react';

export default function ServiceResolveModal({ isOpen, onClose, ticket, onSuccess }) {
  const { resolveTicket, actionLoading } = useTicketStore();
  const [resolution, setResolution] = useState('');
  const [proofPhoto, setProofPhoto] = useState('');
  const [error, setError] = useState('');

  if (!ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resolution.trim()) {
      setError('Resolution explanation is required.');
      return;
    }
    if (!proofPhoto.trim()) {
      setError('Proof photo link or image URL is required for service verification.');
      return;
    }

    setError('');
    const res = await resolveTicket(ticket._id, {
      resolution: resolution.trim(),
      proofPhoto: proofPhoto.trim(),
    });

    if (res.success) {
      if (onSuccess) onSuccess(res.data);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Service & Submit Proof"
      subtitle={`Ticket #${ticket._id?.slice(-6).toUpperCase()} ? Requester: ${ticket.createdBy?.name || "Employee"}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {error}
          </div>
        )}

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-medium text-slate-300">
            Detailed Resolution Notes
          </label>
          <textarea
            rows={3}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Describe how the issue was fixed, components replaced, or troubleshooting performed..."
            className="w-full rounded-lg bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm px-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            required
          />
        </div>

        <div className="space-y-2 text-left">
          <Input
            label="Proof Photo (Image URL or Hosted Asset)"
            placeholder="https://example.com/proof/repaired-hardware.jpg"
            icon={Image}
            value={proofPhoto}
            onChange={(e) => setProofPhoto(e.target.value)}
            helperText="Provide a photo showcasing the resolved state, test result, or signed delivery receipt."
            required
          />

          {proofPhoto.trim() && (
            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/50 p-2 text-center">
              <p className="text-[11px] text-slate-400 mb-1">Proof Preview:</p>
              <img
                src={proofPhoto}
                alt="Proof preview"
                className="max-h-36 mx-auto rounded-lg object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x200/1e293b/94a3b8?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-800/30 text-xs text-slate-300 space-y-1">
          <p className="font-medium text-violet-300 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-violet-400" />
            Next Step: OTP Employee Verification
          </p>
          <p className="text-slate-400 text-[11px]">
            Submitting resolution marks this ticket as Resolved and sends a 6-digit OTP to the employee to inspect work and verify closure.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="violet"
            icon={Wrench}
            loading={actionLoading}
          >
            Submit Resolution
          </Button>
        </div>
      </form>
    </Modal>
  );
}

