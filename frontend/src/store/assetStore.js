import { create } from 'zustand';
import { assetApi } from '../api/assetApi';
import { useToastStore } from './toastStore';

export const useAssetStore = create((set, get) => ({
  assets: [],
  selectedAsset: null,
  loading: false,
  actionLoading: false,
  error: null,

  fetchAssets: async () => {
    set({ loading: true, error: null });
    try {
      const data = await assetApi.getAssets();
      set({ assets: data, loading: false });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch assets';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  fetchAssetById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await assetApi.getAssetById(id);
      set({ selectedAsset: data, loading: false });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch asset';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  createAsset: async (assetData) => {
    set({ actionLoading: true });
    try {
      const response = await assetApi.createAsset(assetData);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Asset Created',
        message: 'Asset added successfully.',
      });
      get().fetchAssets();
      set({ actionLoading: false });
      return { success: true, asset: response.asset };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create asset';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Creation Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  updateAsset: async (id, assetData) => {
    set({ actionLoading: true });
    try {
      const response = await assetApi.updateAsset(id, assetData);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Asset Updated',
        message: 'Asset details updated.',
      });
      get().fetchAssets();
      set({ actionLoading: false });
      return { success: true, asset: response.asset };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update asset';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Update Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  assignAsset: async (id, userId) => {
    set({ actionLoading: true });
    try {
      const response = await assetApi.assignAsset(id, userId);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Asset Assigned',
        message: 'Asset has been assigned to employee.',
      });
      get().fetchAssets();
      set({ actionLoading: false });
      return { success: true, asset: response.asset };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to assign asset';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Assignment Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  unassignAsset: async (id) => {
    set({ actionLoading: true });
    try {
      const response = await assetApi.unassignAsset(id);
      useToastStore.getState().addToast({
        type: 'info',
        title: 'Asset Unassigned',
        message: 'Asset status set back to Available.',
      });
      get().fetchAssets();
      set({ actionLoading: false });
      return { success: true, asset: response.asset };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to unassign asset';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Action Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  deleteAsset: async (id) => {
    set({ actionLoading: true });
    try {
      await assetApi.deleteAsset(id);
      useToastStore.getState().addToast({
        type: 'info',
        title: 'Asset Deleted',
        message: 'Asset has been deleted.',
      });
      set((state) => ({
        assets: state.assets.filter((a) => a._id !== id),
        actionLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete asset';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Delete Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },
}));
