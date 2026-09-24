import { create } from 'zustand';
import { analyticsApi } from '../api/analyticsApi';

export const useAnalyticsStore = create((set) => ({
  overview: null,
  trends: null,
  technicianStats: [],
  assetStats: null,
  loading: false,
  error: null,
  timeframe: '30',

  fetchOverview: async (timeframe = '30') => {
    set({ loading: true, error: null, timeframe });
    try {
      const data = await analyticsApi.getOverview(timeframe);
      set({ overview: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load analytics', loading: false });
    }
  },

  fetchTrends: async (days = 14) => {
    try {
      const data = await analyticsApi.getTrends(days);
      set({ trends: data });
    } catch (err) {
      console.error('Fetch trends error:', err);
    }
  },

  fetchTechnicianStats: async () => {
    try {
      const data = await analyticsApi.getTechnicianAnalytics();
      set({ technicianStats: data.technicians || [] });
    } catch (err) {
      console.error('Fetch technician stats error:', err);
    }
  },

  fetchAssetStats: async () => {
    try {
      const data = await analyticsApi.getAssetAnalytics();
      set({ assetStats: data });
    } catch (err) {
      console.error('Fetch asset stats error:', err);
    }
  },
}));
