import api from './client';

export const auditApi = {
  getLogs: async (params = {}) => {
    const response = await api.get('/audit-logs', { params });
    return response.data;
  },
};
