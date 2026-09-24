import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useTicketStore } from '../../store/ticketStore';
import { useAiStore } from '../../store/aiStore';
import { PlusCircle, Sparkles, ArrowLeft, Ticket } from 'lucide-react';

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

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const { createTicket, actionLoading } = useTicketStore();
  const { classify, loading: aiLoading } = useAiStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Hardware',
    priority: 'Medium',
  });
  const [errors, setErrors] = useState({});
  const [aiNotice, setAiNotice] = useState('');

  const handleAiClassify = async () => {
    if (!formData.title.trim() && !formData.description.trim()) {
      setErrors({ description: 'Enter title or description first to run AI classification.' });
      return;
    }
    const res = await classify({ title: formData.title, description: formData.description });
    if (res.success && res.data) {
      setFormData((prev) => ({
        ...prev,
        category: res.data.suggestedCategory || prev.category,
        priority: res.data.suggestedPriority || prev.priority,
      }));
      setAiNotice(`AI Suggested: ${res.data.suggestedCategory} with ${res.data.suggestedPriority} Priority (${res.data.confidence}% confidence)`);
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

    if (res.success && res.ticket?._id) {
      navigate(`/tickets/${res.ticket._id}`);
    } else if (res.success) {
      navigate('/tickets');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button
          type="button"
          onClick={() => navigate('/tickets')}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </button>
        <span>/</span>
        <span className="font-mono font-semibold text-slate-200">New Service Request</span>
      </div>

      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest">
          <Ticket className="w-4 h-4" />
          <span>New Incident or Service Request</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Create Service Ticket</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Submit your issue for automatic workforce triage, verified skill matching, and SLA enforcement.
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Ticket Subject / Title"
            placeholder="e.g. MacBook Pro display flickering or VPN failing to authenticate"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />

          {/* AI Assistance Strip */}
          <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-violet-300 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>AI Auto-Classification & SLA Suggestion</span>
              </div>
              <p className="text-xs text-slate-400">
                {aiNotice || 'Fill in a title or description, then run AI to auto-select category & priority.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAiClassify}
              disabled={aiLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {aiLoading ? 'Analyzing...' : 'Run AI Suggest'}
            </button>
          </div>

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
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the incident in detail: what occurred, when it started, error messages shown, and affected hardware/software..."
              className={`w-full rounded-xl bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm px-4 py-3 focus:outline-none focus:ring-1 transition-colors ${errors.description ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-400/20'}`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <Button
              variant="secondary"
              onClick={() => navigate('/tickets')}
              disabled={actionLoading}
            >
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
      </div>
    </div>
  );
}