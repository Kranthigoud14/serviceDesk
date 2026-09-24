import { create } from 'zustand';
import { aiApi } from '../api/aiApi';

export const useAiStore = create((set) => ({
  loading: false,
  error: null,
  activeResult: null,

  summarize: async ({ title, description, category }) => {
    set({ loading: true, error: null });
    try {
      const res = await aiApi.summarize({ title, description, category });
      set({ loading: false, activeResult: res.data });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'AI service temporarily unavailable';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  classify: async ({ title, description }) => {
    set({ loading: true, error: null });
    try {
      const res = await aiApi.classify({ title, description });
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Classification unavailable';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  suggestResolution: async ({ title, description, category }) => {
    set({ loading: true, error: null });
    try {
      const res = await aiApi.suggestResolution({ title, description, category });
      set({ loading: false, activeResult: res.data });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Resolution suggestions unavailable';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  getInsights: async (ticketId) => {
    set({ loading: true, error: null });
    try {
      const res = await aiApi.getInsights(ticketId);
      set({ loading: false, activeResult: res.data });
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Insights unavailable';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },
}));
