import api from './client';

export const technicianApi = {
  getTechnicians: async () => {
    const response = await api.get('/technicians');
    return response.data;
  },

  getTechnicianById: async (id) => {
    const response = await api.get(`/technicians/${id}`);
    return response.data;
  },

  updateOwnSkills: async (skills) => {
    const response = await api.put('/technicians/me/skills', { skills });
    return response.data;
  },

  verifySkills: async (id) => {
    const response = await api.put(`/technicians/${id}/skills/verify`);
    return response.data;
  },

  updateAvailability: async (id, availability) => {
    const response = await api.put(`/technicians/${id}/availability`, { availability });
    return response.data;
  },

  updateCapacity: async (id, maxActiveTickets) => {
    const response = await api.put(`/technicians/${id}/capacity`, { maxActiveTickets });
    return response.data;
  },
};
