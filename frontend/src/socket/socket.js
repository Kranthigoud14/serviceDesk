import { io } from 'socket.io-client';

const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL;
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const isLocalSocketUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(configuredSocketUrl || '');
const SOCKET_URL = configuredSocketUrl && (isLocalHost || !isLocalSocketUrl)
  ? configuredSocketUrl
  : 'https://servicedesk-dn8q.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
    this.currentUserId = null;
    this.statusListeners = new Set();
    this.notificationListeners = new Set();
    this.status = 'disconnected'; // 'connected' | 'connecting' | 'disconnected'
  }

  connect(userId) {
    if (!userId) return;

    // If already connected with same user, do not reconnect
    if (this.socket && this.socket.connected && this.currentUserId === userId) {
      return;
    }

    if (this.socket) {
      this.disconnect();
    }

    this.currentUserId = userId;
    this.setStatus('connecting');

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      this.setStatus('connected');
      // Join user-specific notification room
      this.socket.emit('join', userId);
    });

    this.socket.on('disconnect', (reason) => {
      this.setStatus('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      this.setStatus('disconnected');
    });

    this.socket.on('notification', (notification) => {
      this.notificationListeners.forEach((listener) => {
        try {
          listener(notification);
        } catch (e) {
          console.error('Error in notification listener:', e);
        }
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentUserId = null;
    this.setStatus('disconnected');
  }

  setStatus(status) {
    this.status = status;
    this.statusListeners.forEach((listener) => {
      try {
        listener(status);
      } catch (e) {
        console.error('Error in status listener:', e);
      }
    });
  }

  onNotification(listener) {
    this.notificationListeners.add(listener);
    return () => {
      this.notificationListeners.delete(listener);
    };
  }

  onStatusChange(listener) {
    this.statusListeners.add(listener);
    // Immediately notify current status
    listener(this.status);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  getStatus() {
    return this.status;
  }
}

export const socketService = new SocketService();
