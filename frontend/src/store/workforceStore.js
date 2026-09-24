import { create } from 'zustand';
import { workforceApi } from '../api/workforceApi';

export const useWorkforceStore = create((set) => ({
  recommendations: [],
  ticketInfo: null,
  scoringInfo: null,
  loading: false,
  error: null,

  fetchRecommendations: async (ticketId) => {
    set({ loading: true, error: null, recommendations: [] });
    try {
      const data = await workforceApi.recommendTechnicians(ticketId);
      set({
        recommendations: data.recommendations || [],
        ticketInfo: data.ticket || null,
        scoringInfo: data.scoring || null,
        loading: false,
      });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'No recommended technicians available for this ticket';
      set({
        loading: false,
        error: msg,
        recommendations: [],
      });
      return { success: false, error: msg };
    }
  },

  clearRecommendations: () => {
    set({
      recommendations: [],
      ticketInfo: null,
      scoringInfo: null,
      loading: false,
      error: null,
    });
  },
}));
