import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/notificationStore';
import { formatRelativeTime } from '../../utils/formatters';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

export default function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } =
    useNotificationStore();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl z-50 overflow-hidden"
    >
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-semibold text-slate-100">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllAsRead()}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No notifications yet
          </div>
        ) : (
          notifications.slice(0, 8).map((n) => (
            <div
              key={n._id}
              onClick={() => {
                if (!n.isRead) markAsRead(n._id);
                if (n.relatedTicket) {
                  navigate('/tickets/' + n.relatedTicket);
                  onClose();
                }
              }}
              className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${!n.isRead ? "bg-cyan-950/20 hover:bg-cyan-950/30" : "hover:bg-slate-900/60"}`}
            >
              <span
                className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? "bg-cyan-400 animate-pulse" : "bg-transparent"}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-medium text-slate-200 truncate">{n.title}</p>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-slate-900/60 border-t border-slate-800/80 text-center">
        <button
          type="button"
          onClick={() => {
            navigate('/notifications');
            onClose();
          }}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          View all notifications
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

