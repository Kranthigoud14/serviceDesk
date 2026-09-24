import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useUserStore } from '../../store/userStore';
import { UserCheck } from 'lucide-react';

export default function UserEditModal({ isOpen, onClose, user, onSuccess }) {
  const { updateUser } = useUserStore();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setError('');
    }
  }, [user, isOpen]);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    const res = await updateUser(user._id, name.trim());
    setLoading(false);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Profile"
      subtitle={`Email: ${user?.email} • Role: ${user?.role}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          required
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={UserCheck} loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

