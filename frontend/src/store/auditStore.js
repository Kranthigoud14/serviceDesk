import { create } from 'zustand';
import { auditApi } from '../api/auditApi';

export const useAuditStore = create((set) => ({
  logs: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
  filters: {
    search: '',
    entityType: '',
    action: '',
    actor: '',
  },

  fetchLogs: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await auditApi.getLogs(params);
      set({
        logs: data.logs || [],
        total: data.total || 0,
        page: data.page || 1,
        pages: data.pages || 1,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load audit logs', loading: false });
    }
  },

  setFilter: (key, val) =>
    set((state) => ({
      filters: { ...state.filters, [key]: val },
    })),

  resetFilters: () =>
    set({
      filters: { search: '', entityType: '', action: '', actor: '' },
    }),
}));
