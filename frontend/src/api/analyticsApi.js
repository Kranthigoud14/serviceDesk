import api from './client';

export const analyticsApi = {
  getOverview: async (timeframe = '30') => {
    const response = await api.get(`/analytics/overview?timeframe=${timeframe}`);
    return response.data;
  },

  getTrends: async (days = 14) => {
    const response = await api.get(`/analytics/trends?days=${days}`);
    return response.data;
  },

  getTechnicianAnalytics: async () => {
    const response = await api.get('/analytics/technicians');
    return response.data;
  },

  getAssetAnalytics: async () => {
    const response = await api.get('/analytics/assets');
    return response.data;
  },
};
