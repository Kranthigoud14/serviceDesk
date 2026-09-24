import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import {
  Bell,
  CheckCheck,
  Clock,
  ArrowRight,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Star,
} from 'lucide-react';

export default function NotificationsPage() {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    loading,
    unreadCount,
  } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TICKET_ASSIGNED':
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case 'TICKET_RESOLVED':
        return <ShieldCheck className="w-4 h-4 text-violet-400" />;
      case 'VERIFICATION_REQUESTED':
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      case 'VERIFICATION_COMPLETED':
        return <CheckCheck className="w-4 h-4 text-emerald-400" />;
      case 'SLA_WARNING':
      case 'SLA_BREACHED':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'RATING_SUBMITTED':
        return <Star className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            Realtime Audit Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live incident events, SLA warnings, and verification requests delivered via WebSockets.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={CheckCheck}
            onClick={() => markAllAsRead()}
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <TableSkeleton rows={6} cols={3} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Inbox is Clear"
          description="You have no incoming notifications or SLA alerts right now."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => {
                if (!n.isRead) markAsRead(n._id);
                if (n.relatedTicket) {
                  navigate(`/tickets/${n.relatedTicket}`);
                }
              }}
              className="p-4 sm:p-5 rounded-2xl glass-panel border transition-all cursor-pointer flex items-start gap-4"
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                {getNotificationIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">{n.title}</h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {formatDate(n.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>

                {n.relatedTicket && (
                  <span className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium pt-1">
                    Open Related Ticket
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

