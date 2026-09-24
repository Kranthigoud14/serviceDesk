import api from './client';

export const workforceApi = {
  recommendTechnicians: async (ticketId) => {
    const response = await api.get(`/workforce/recommend/${ticketId}`);
    return response.data;
  },
};
