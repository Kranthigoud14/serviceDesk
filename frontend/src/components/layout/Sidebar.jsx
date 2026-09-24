import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import {
  LayoutDashboard,
  Ticket,
  Users,
  Cpu,
  Boxes,
  Bell,
  User,
  LogOut,
  PlusCircle,
  CheckCircle,
  Wrench,
  Gauge,
  Sparkles,
  X,
  ShieldCheck,
  BookOpen,
  BarChart3,
  History,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  // Navigation schema configured by role
  const getNavItems = (role) => {
    switch (role) {
      case 'System Admin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'User Management', path: '/users', icon: Users },
          { name: 'All Tickets', path: '/tickets', icon: Ticket },
          { name: 'IT Assets', path: '/assets', icon: Boxes },
          { name: 'Workforce Intel', path: '/workforce', icon: Cpu, badge: 'AI' },
          { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
          { name: 'Analytics', path: '/analytics', icon: BarChart3 },
          { name: 'Audit Logs', path: '/audit-logs', icon: History },
          { name: 'Notifications', path: '/notifications', icon: Bell, count: unreadCount },
          { name: 'My Profile', path: '/profile', icon: User },
        ];
      case 'IT Manager':
        return [
          { name: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Service Tickets', path: '/tickets', icon: Ticket },
          { name: 'Technicians', path: '/technicians', icon: Wrench },
          { name: 'Workforce Intel', path: '/workforce', icon: Cpu, badge: 'AI' },
          { name: 'IT Assets', path: '/assets', icon: Boxes },
          { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
          { name: 'Analytics', path: '/analytics', icon: BarChart3 },
          { name: 'Notifications', path: '/notifications', icon: Bell, count: unreadCount },
          { name: 'My Profile', path: '/profile', icon: User },
        ];
      case 'Technician':
        return [
          { name: 'Technician Hub', path: '/dashboard', icon: LayoutDashboard },
          { name: 'My Tickets', path: '/tickets', icon: Ticket },
          { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
          { name: 'Skills & Verification', path: '/technicians/me/skills', icon: ShieldCheck },
          { name: 'Availability & Workload', path: '/technicians/me/availability', icon: Gauge },
          { name: 'Notifications', path: '/notifications', icon: Bell, count: unreadCount },
          { name: 'My Profile', path: '/profile', icon: User },
        ];
      case 'Employee':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'My Tickets', path: '/tickets', icon: Ticket },
          { name: 'Create Ticket', path: '/tickets/new', icon: PlusCircle, highlight: true },
          { name: 'Verification', path: '/tickets?filter=pending-verification', icon: CheckCircle },
          { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
          { name: 'Notifications', path: '/notifications', icon: Bell, count: unreadCount },
          { name: 'My Profile', path: '/profile', icon: User },
        ];
      case 'Asset Manager':
        return [
          { name: 'Asset Hub', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Hardware & Assets', path: '/assets', icon: Boxes },
          { name: 'Service Tickets', path: '/tickets', icon: Ticket },
          { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
          { name: 'Analytics', path: '/analytics', icon: BarChart3 },
          { name: 'Notifications', path: '/notifications', icon: Bell, count: unreadCount },
          { name: 'My Profile', path: '/profile', icon: User },
        ];
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Tickets', path: '/tickets', icon: Ticket },
          { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
          { name: 'Notifications', path: '/notifications', icon: Bell, count: unreadCount },
          { name: 'Profile', path: '/profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col justify-between`}
      >
        {/* Top: Logo & Nav */}
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5">
          {/* Logo Header */}
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-cyan-400/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white block leading-none">
                  ServiceDesk<span className="text-cyan-400 font-extrabold">PRO</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-1 block">
                  Workforce Intel
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            <div className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) => `group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${isActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"}`}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"}`}
                        />
                        <span>{item.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase">
                            {item.badge}
                          </span>
                        )}
                        {item.count > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950">
                            {item.count}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Logout & Status */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

