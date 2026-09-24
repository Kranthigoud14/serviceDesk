import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useTicketStore } from '../../store/ticketStore';
import { PlusCircle, Sparkles } from 'lucide-react';
import { useAiStore } from '../../store/aiStore';

const CATEGORIES = [
  { value: 'Hardware', label: 'Hardware (Laptops, Desktops, Monitors)' },
  { value: 'Software', label: 'Software & OS Installation' },
  { value: 'Network', label: 'Network & Connectivity (VPN, Wi-Fi)' },
  { value: 'Access', label: 'Access, Permissions & Passwords' },
  { value: 'Email', label: 'Email, Outlook & Communication' },
  { value: 'Other', label: 'Other Inquiries' },
];

const PRIORITIES = [
  { value: 'Low', label: 'Low (72-hour SLA window)' },
  { value: 'Medium', label: 'Medium (24-hour SLA window)' },
  { value: 'High', label: 'High (8-hour SLA window)' },
  { value: 'Critical', label: 'Critical (4-hour SLA window)' },
];

export default function TicketCreateModal({ isOpen, onClose, onSuccess }) {
  const { createTicket, actionLoading } = useTicketStore();
  const { classify, loading: aiLoading } = useAiStore();
  const [aiNotice, setAiNotice] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Hardware',
    priority: 'Medium',
  });
  const [errors, setErrors] = useState({});

  const handleAiClassify = async () => {
    if (!formData.title && !formData.description) {
      setErrors({ description: 'Enter title or description to run AI classification.' });
      return;
    }
    const res = await classify({ title: formData.title, description: formData.description });
    if (res.success && res.data) {
      setFormData((prev) => ({
        ...prev,
        category: res.data.suggestedCategory || prev.category,
        priority: res.data.suggestedPriority || prev.priority,
      }));
      setAiNotice(`✨ AI Suggested: ${res.data.suggestedCategory} • ${res.data.suggestedPriority} Priority (${res.data.confidence}% confidence)`);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.category) errs.category = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await createTicket({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
    });

    if (res.success) {
      setFormData({
        title: '',
        description: '',
        category: 'Hardware',
        priority: 'Medium',
      });
      if (onSuccess) onSuccess(res.ticket);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Service Request"
      subtitle="Submit a new IT incident or request for workforce triage."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Ticket Title"
          placeholder="e.g. MacBook Pro display flickering or VPN failing"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-slate-300">
            Classification & Urgency
          </label>
          <button
            type="button"
            onClick={handleAiClassify}
            disabled={aiLoading}
            className="text-[11px] font-semibold text-violet-300 hover:text-violet-200 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-violet-400" />
            {aiLoading ? 'Analyzing...' : 'AI Auto-Suggest'}
          </button>
        </div>

        {aiNotice && (
          <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>{aiNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Issue Category"
            options={CATEGORIES}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            error={errors.category}
          />

          <Select
            label="Priority & SLA Level"
            options={PRIORITIES}
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-medium text-slate-300">
            Detailed Problem Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide step-by-step details, error messages, and equipment involved..."
            className={`w-full rounded-lg bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-1 transition-colors ${errors.description ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-400/20'}`}
          />
          {errors.description && (
            <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={PlusCircle}
            loading={actionLoading}
          >
            Create Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}

