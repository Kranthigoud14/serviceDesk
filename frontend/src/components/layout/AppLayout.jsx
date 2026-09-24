import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BackgroundAmbient from '../common/BackgroundAmbient';
import Toast from '../common/Toast';
import { socketService } from '../../socket/socket';
import { useNotificationStore } from '../../store/notificationStore';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addRealtimeNotification } = useNotificationStore();
  const location = useLocation();

  useEffect(() => {
    // Listen for real-time notifications
    const unsub = socketService.onNotification((notification) => {
      addRealtimeNotification(notification);
    });

    return () => unsub();
  }, [addRealtimeNotification]);

  const getVariant = () => {
    if (location.pathname.startsWith('/workforce')) return 'workforce';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Dynamic Ambient Background */}
      <BackgroundAmbient variant={getVariant()} />

      {/* Global Toast System */}
      <Toast />

      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 z-10">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

