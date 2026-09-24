import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useTicketStore } from '../../store/ticketStore';
import { Star, Send } from 'lucide-react';

export default function TechnicianRateModal({ isOpen, onClose, ticket, onSuccess }) {
  const { rateTechnician, actionLoading } = useTicketStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    setError('');
    const res = await rateTechnician(ticket._id, {
      rating,
      comment: comment.trim(),
    });

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate Technician Performance"
      subtitle={`Ticket #${ticket._id?.slice(-6).toUpperCase()} ? Technician: ${ticket.assignedTo?.name || "Technician"}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-center">
        <div>
          <p className="text-xs text-slate-400 mb-3">
            How satisfied were you with the speed, communication, and technical expertise?
          </p>

          {/* Interactive Stars */}
          <div className="flex justify-center items-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer transform hover:scale-110 active:scale-95 duration-150"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${active ? "text-amber-400 fill-amber-400" : "text-slate-600"}`}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mt-1">
            {['Poor', 'Fair', 'Good', 'Very Good', 'Exceptional'][rating - 1]}
          </span>
        </div>

        {error && <p className="text-xs text-rose-400">{error}</p>}

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-medium text-slate-300">
            Additional Feedback (Optional)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share any notable comments about the technician's professionalism..."
            className="w-full rounded-lg bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm px-3.5 py-2.5 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Send}
            loading={actionLoading}
          >
            Submit Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
}

