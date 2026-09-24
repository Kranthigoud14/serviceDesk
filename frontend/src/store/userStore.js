import { create } from 'zustand';
import { userApi } from '../api/userApi';
import { useToastStore } from './toastStore';

export const useUserStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userApi.getUsers();
      set({ users: data, loading: false });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch users';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  updateUser: async (id, name) => {
    try {
      const response = await userApi.updateUser(id, name);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'User Updated',
        message: 'User details updated.',
      });
      get().fetchUsers();
      return { success: true, user: response.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Update Failed',
        message: msg,
      });
      return { success: false, error: msg };
    }
  },

  updateProfile: async (name) => {
    try {
      const response = await userApi.updateProfile(name);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your name has been updated.',
      });
      return { success: true, user: response.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Update Failed',
        message: msg,
      });
      return { success: false, error: msg };
    }
  },

  deleteUser: async (id) => {
    try {
      await userApi.deleteUser(id);
      useToastStore.getState().addToast({
        type: 'info',
        title: 'User Deleted',
        message: 'User has been removed from system.',
      });
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Delete Failed',
        message: msg,
      });
      return { success: false, error: msg };
    }
  },
}));
