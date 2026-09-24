import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { socketService } from '../socket/socket';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initAuth: () => {
    try {
      const token = localStorage.getItem('sd_token');
      const userStr = localStorage.getItem('sd_user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        // Connect socket for authenticated user
        socketService.connect(user.id);
      } else {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (e) {
      localStorage.removeItem('sd_token');
      localStorage.removeItem('sd_user');
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(credentials);
      const { token, user } = data;

      localStorage.setItem('sd_token', token);
      localStorage.setItem('sd_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Connect socket
      socketService.connect(user.id);
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      set({
        isLoading: false,
        error: message,
      });
      return { success: false, error: message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.register(userData);
      set({ isLoading: false, error: null });
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      set({
        isLoading: false,
        error: message,
      });
      return { success: false, error: message };
    }
  },

  updateUserProfile: (updatedUser) => {
    set((state) => {
      const newUser = { ...state.user, ...updatedUser };
      localStorage.setItem('sd_user', JSON.stringify(newUser));
      return { user: newUser };
    });
  },

  logout: () => {
    localStorage.removeItem('sd_token');
    localStorage.removeItem('sd_user');
    socketService.disconnect();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));
