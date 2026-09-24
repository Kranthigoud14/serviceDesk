import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import BackgroundAmbient from '../../components/common/BackgroundAmbient';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';

const ROLES = [
  { value: 'Employee', label: 'Employee (Standard User)' },
  { value: 'Technician', label: 'Technician (Field Engineer)' },
  { value: 'IT Manager', label: 'IT Manager (Supervisor)' },
  { value: 'Asset Manager', label: 'Asset Manager (Hardware Ops)' },
];

export default function RegisterPage() {
  const { register, login, isLoading, error: authError } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please provide name, email, and password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    const res = await register(formData);
    if (res.success) {
      setRegisteredSuccess(true);
      // Auto login
      setTimeout(async () => {
        const loginRes = await login({
          email: formData.email,
          password: formData.password,
        });
        if (loginRes.success) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundAmbient variant="auth" />

      <div className="w-full max-w-md z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 text-white shadow-xl shadow-blue-500/25 border border-cyan-400/30 mb-2">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ServiceDesk <span className="text-cyan-400">PRO</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Register Enterprise Profile
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Create new account</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your role in the organization to provision access.
            </p>
          </div>

          {registeredSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-sm font-semibold text-emerald-300">Registration Successful!</h4>
              <p className="text-xs text-slate-300">
                Signing you in automatically to your new dashboard...
              </p>
            </div>
          ) : (
            <>
              {(error || authError) && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                  {error || authError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  icon={User}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Input
                  label="Work Email"
                  type="email"
                  placeholder="john@company.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <div className="relative">
                  <Input
                    label="Password (min 6 characters)"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    icon={Lock}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <Select
                  label="Organizational Role"
                  options={ROLES}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={UserPlus}
                  loading={isLoading}
                  className="w-full font-semibold"
                >
                  Create Account
                </Button>
              </form>
            </>
          )}

          <div className="text-center text-xs text-slate-400 pt-1">
            Already registered?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

