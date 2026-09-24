import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useTicketStore } from '../../store/ticketStore';
import confetti from 'canvas-confetti';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ServiceVerifyModal({ isOpen, onClose, ticket, onSuccess }) {
  const { verifyService, actionLoading } = useTicketStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);

  if (!ticket) return null;

  const handleChange = (index, value) => {
    // Only accept numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last digit
    setOtp(newOtp);

    // Auto advance focus
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setError('');
    const res = await verifyService(ticket._id, fullOtp);
    if (res.success) {
      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(res.error || 'Failed to verify OTP. It may be incorrect or expired.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify IT Service Completion"
      subtitle="Enter the 6-digit confirmation code provided upon resolution."
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-100">
            Ticket #{ticket._id.slice(-6).toUpperCase()}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            By entering the OTP, you certify that the technician resolved the incident to your satisfaction.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 6 Digit OTP Inputs */}
        <div className="flex justify-center gap-2.5 sm:gap-3 py-2" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            icon={CheckCircle2}
            loading={actionLoading}
            disabled={otp.join('').length !== 6}
          >
            Verify & Close Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}

