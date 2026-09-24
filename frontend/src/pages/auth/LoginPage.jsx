import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import BackgroundAmbient from '../../components/common/BackgroundAmbient';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle,
} from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading, error: authError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    const res = await login({ email, password });
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundAmbient variant="auth" />

      <div className="w-full max-w-md z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Logo and Brand Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 text-white shadow-xl shadow-blue-500/25 border border-cyan-400/30 mb-2">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ServiceDesk <span className="text-cyan-400">PRO</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Verified IT Service Management with Workforce Intelligence
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Sign in to workspace</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your enterprise credentials to access your operations dashboard.
            </p>
          </div>

          {(error || authError) && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {error || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="name@company.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={LogIn}
              loading={isLoading}
              className="w-full font-semibold"
            >
              Sign In
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-1">
            Need a new account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium underline">
              Register here
            </Link>
          </div>
        </div>

        {/* Footer Feature Badges */}
        <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> OTP Verified Service
          </span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-violet-400" /> Workforce Intelligence
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Realtime Socket.IO
          </span>
        </div>
      </div>
    </div>
  );
}

