import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function RoleRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Verifying permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // System Admin always bypasses role restrictions
  if (user?.role === 'System Admin') {
    return children;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

