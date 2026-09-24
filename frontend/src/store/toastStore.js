import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: ({ type = 'info', title, message, relatedTicket = null, duration = 5000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, type, title, message, relatedTicket, duration };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
