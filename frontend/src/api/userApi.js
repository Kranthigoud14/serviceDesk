import api from './client';

export const userApi = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (name) => {
    const response = await api.put('/users/profile', { name });
    return response.data;
  },

  updateUser: async (id, name) => {
    const response = await api.put(`/users/${id}`, { name });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
