import api from './client';

export const ticketApi = {
  getTickets: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  updateTicket: async (id, updateData) => {
    const response = await api.put(`/tickets/${id}`, updateData);
    return response.data;
  },

  assignTicket: async (id, technicianId) => {
    const response = await api.put(`/tickets/${id}/assign`, { technicianId });
    return response.data;
  },

  resolveTicket: async (id, { resolution, proofPhoto }) => {
    const response = await api.put(`/tickets/${id}/resolve`, { resolution, proofPhoto });
    return response.data;
  },

  verifyService: async (id, otp) => {
    const response = await api.put(`/tickets/${id}/verify-service`, { otp });
    return response.data;
  },

  rejectService: async (id, rejectionReason) => {
    const response = await api.put(`/tickets/${id}/reject-service`, { rejectionReason });
    return response.data;
  },

  rateTechnician: async (id, { rating, comment }) => {
    const response = await api.put(`/tickets/${id}/rate`, { rating, comment });
    return response.data;
  },

  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
};
