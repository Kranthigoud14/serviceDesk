import api from './client';

export const aiApi = {
  summarize: async ({ title, description, category }) => {
    const response = await api.post('/ai/summarize', { title, description, category });
    return response.data;
  },

  classify: async ({ title, description }) => {
    const response = await api.post('/ai/classify', { title, description });
    return response.data;
  },

  suggestResolution: async ({ title, description, category }) => {
    const response = await api.post('/ai/suggest-resolution', { title, description, category });
    return response.data;
  },

  getInsights: async (ticketId) => {
    const response = await api.get(`/ai/insights/${ticketId}`);
    return response.data;
  },
};
