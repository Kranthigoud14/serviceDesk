import { create } from 'zustand';
import { technicianApi } from '../api/technicianApi';
import { useToastStore } from './toastStore';

export const useTechnicianStore = create((set, get) => ({
  technicians: [],
  selectedTechnician: null,
  loading: false,
  error: null,

  fetchTechnicians: async () => {
    set({ loading: true, error: null });
    try {
      const data = await technicianApi.getTechnicians();
      set({ technicians: data, loading: false });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch technicians';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  fetchTechnicianById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await technicianApi.getTechnicianById(id);
      set({ selectedTechnician: data, loading: false });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch technician details';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  updateOwnSkills: async (skills) => {
    try {
      const data = await technicianApi.updateOwnSkills(skills);
      useToastStore.getState().addToast({
        type: 'info',
        title: 'Skills Submitted',
        message: 'Your skills have been submitted for IT Manager verification.',
      });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update skills';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Failed',
        message: msg,
      });
      return { success: false, error: msg };
    }
  },

  verifySkills: async (id) => {
    try {
      const data = await technicianApi.verifySkills(id);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Skills Verified',
        message: 'Technician skills have been verified.',
      });
      get().fetchTechnicians();
      if (get().selectedTechnician?._id === id) {
        get().fetchTechnicianById(id);
      }
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to verify skills';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Failed',
        message: msg,
      });
      return { success: false, error: msg };
    }
  },

  updateAvailability: async (id, availability) => {
    try {
      const data = await technicianApi.updateAvailability(id, availability);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Availability set to ${availability}.`,
      });
      get().fetchTechnicians();
      if (get().selectedTechnician?._id === id) {
        get().fetchTechnicianById(id);
      }
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update availability';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Failed',
        message: msg,
      });
      return { success: false, error: msg };
    }
  },

  updateCapacity: async (id, maxActiveTickets) => {
    try {
      const data = await technicianApi.updateCapacity(id, maxActiveTickets);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Capacity Updated',
        message: `Maximum active tickets set to ${maxActiveTickets}.`,
      });
      get().fetchTechnicians();
      if (get().selectedTechnician?._id === id) {
        get().fetchTechnicianById(id);
      }
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update capacity';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Failed',
        message: msg,
      });
      return { success: false, error: msg };
    }
  },
}));
