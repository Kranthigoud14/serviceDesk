import { create } from 'zustand';
import { notificationApi } from '../api/notificationApi';
import { useToastStore } from './toastStore';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await notificationApi.getMyNotifications();
      const list = data.notifications || [];
      const unread = list.filter((n) => !n.isRead).length;
      set({
        notifications: list,
        unreadCount: unread,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch notifications',
      });
    }
  },

  fetchUnread: async () => {
    try {
      const data = await notificationApi.getUnreadNotifications();
      const list = data.notifications || [];
      set({ unreadCount: list.length });
    } catch (e) {
      console.error('Failed to fetch unread count', e);
    }
  },

  addRealtimeNotification: (notification) => {
    set((state) => {
      // Avoid duplicate by _id
      const exists = state.notifications.some((n) => n._id === notification._id);
      if (exists) return state;

      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });

    // Fire toast
    useToastStore.getState().addToast({
      type: 'realtime',
      title: notification.title || 'New Notification',
      message: notification.message || '',
      relatedTicket: notification.relatedTicket?._id || notification.relatedTicket || null,
      duration: 6000,
    });
  },

  markAsRead: async (id) => {
    try {
      await notificationApi.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error('Failed to mark all notifications read', err);
    }
  },

  reset: () => {
    set({
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
    });
  },
}));
