import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useKnowledgeStore } from '../../store/knowledgeStore';
import { BookOpen, Save, Trash2, Eye } from 'lucide-react';

const CATEGORIES = [
  { value: 'Hardware', label: 'Hardware' },
  { value: 'Software', label: 'Software' },
  { value: 'Network', label: 'Network' },
  { value: 'Access', label: 'Access & Identity' },
  { value: 'Email', label: 'Email & Messaging' },
  { value: 'Security', label: 'Security' },
  { value: 'General', label: 'General' },
  { value: 'Other', label: 'Other' },
];

const STATUSES = [
  { value: 'Published', label: 'Published (Visible to all)' },
  { value: 'Draft', label: 'Draft (Internal only)' },
  { value: 'Archived', label: 'Archived' },
];

export default function ArticleModal({ isOpen, onClose, article, isEditing = false }) {
  const { createArticle, updateArticle, deleteArticle, actionLoading } = useKnowledgeStore();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: '',
    status: 'Published',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (article && isEditing) {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        category: article.category || 'General',
        tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
        status: article.status || 'Published',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'General',
        tags: '',
        status: 'Published',
      });
    }
    setError('');
  }, [article, isEditing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: formData.status,
    };

    let res;
    if (isEditing && article?._id) {
      res = await updateArticle(article._id, payload);
    } else {
      res = await createArticle(payload);
    }

    if (res.success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const res = await deleteArticle(article._id);
      if (res.success) {
        onClose();
      }
    }
  };

  // If viewing only
  if (!isEditing && article) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={article.title}
        subtitle={`Category: ${article.category} ? Author: ${article.author?.name || 'Staff'}`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> {article.views || 0} views
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              {article.category}
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-slate-200 text-sm whitespace-pre-wrap leading-relaxed py-2">
            {article.content}
          </div>

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Knowledge Article' : 'Create Knowledge Article'}
      subtitle="Publish IT troubleshooting guides, setup procedures, and solutions."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {error}
          </div>
        )}

        <Input
          label="Article Title"
          placeholder="e.g., How to resolve corporate VPN connection timeout"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={CATEGORIES}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <Select
            label="Visibility Status"
            options={STATUSES}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </div>

        <Input
          label="Search Tags (comma-separated)"
          placeholder="vpn, network, credentials, remote"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Article Content / Procedure Details
          </label>
          <textarea
            rows={8}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write clear, step-by-step instructions with headers and troubleshooting actions..."
            className="w-full rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm px-3.5 py-2.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 font-mono"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {isEditing && article?._id ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleDelete}
              disabled={actionLoading}
            >
              Delete
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={actionLoading}
            >
              {isEditing ? 'Save Changes' : 'Publish Article'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
