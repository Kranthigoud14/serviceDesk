import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { getInitials } from '../../utils/formatters';
import { User, Mail, ShieldCheck, Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuthStore();
  const { updateProfile } = useUserStore();

  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const res = await updateProfile(name.trim());
    setLoading(false);

    if (res.success) {
      updateUserProfile({ name: res.user.name });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res.error || 'Failed to update profile name');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
          User Profile & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your organizational contact name and review your system access level.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-blue-500/25 border border-cyan-400/30 shrink-0">
          {getInitials(user?.name)}
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100">{user?.name}</h2>
          <p className="text-xs text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            {user?.email}
          </p>
          <div className="pt-1">
            <Badge variant="primary" size="sm">
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl space-y-6">
        <h3 className="text-base font-semibold text-slate-100">Personal Information</h3>

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Profile name updated successfully.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Work Email (Assigned by IT Admin)"
            icon={Mail}
            value={user?.email || ''}
            disabled
            helperText="Your enterprise email address is managed centrally and cannot be changed here."
          />

          <Input
            label="Assigned Role"
            icon={ShieldCheck}
            value={user?.role || ''}
            disabled
            helperText="Role permissions and access scopes are provisioned by your system administrator."
          />

          <div className="pt-3 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={loading}
              disabled={name === user?.name}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

