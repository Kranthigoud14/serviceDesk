import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Sparkles, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white font-mono">404</h1>
          <h2 className="text-lg font-semibold text-slate-200">Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The telemetry endpoint or route you requested does not exist or has been relocated.
          </p>
        </div>
        <Button variant="primary" icon={Home} onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}

