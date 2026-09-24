import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { socketService } from '../../socket/socket';
import { getInitials } from '../../utils/formatters';
import NotificationDropdown from './NotificationDropdown';
import {
  Menu,
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Activity,
  ShieldAlert,
} from 'lucide-react';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuthStore();
  const { unreadCount, fetchUnread } = useNotificationStore();
  const [socketStatus, setSocketStatus] = useState(socketService.getStatus());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUnread();
    const unsub = socketService.onStatusChange((status) => {
      setSocketStatus(status);
    });
    return () => unsub();
  }, [fetchUnread]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/tickets?search=' + encodeURIComponent(searchQuery.trim()));
    }
  };

  const roleColors = {
    'System Admin': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'IT Manager': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Technician: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Employee: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    'Asset Manager': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile menu & Context search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, titles, IDs..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Connection Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px]">
          {socketStatus === 'connected' ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-cyan-400 font-medium">Live</span>
            </>
          ) : socketStatus === 'connecting' ? (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 font-medium">Connecting</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              <span className="text-slate-400 font-medium">Offline</span>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold ring-2 ring-slate-950 animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-blue-500/20">
              {getInitials(user?.name)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.name || 'User'}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${roleColors[user?.role] || "bg-slate-800 text-slate-300"}`}
                >
                  {user?.role}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl glass-panel border border-slate-700/80 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <div className="px-3.5 py-2 border-b border-slate-800/80">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigate('/profile');
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Profile Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-800/80 mt-1"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

