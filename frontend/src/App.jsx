import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';

export default function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

