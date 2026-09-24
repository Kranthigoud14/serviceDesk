import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

