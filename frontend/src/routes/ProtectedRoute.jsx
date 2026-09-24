import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

