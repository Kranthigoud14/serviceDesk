import { create } from 'zustand';
import { ticketApi } from '../api/ticketApi';
import { useToastStore } from './toastStore';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  currentTicket: null,
  loading: false,
  detailLoading: false,
  actionLoading: false,
  error: null,

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ticketApi.getTickets();
      set({ tickets: data, loading: false });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch tickets';
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  fetchTicketById: async (id) => {
    set({ detailLoading: true, error: null });
    try {
      const data = await ticketApi.getTicketById(id);
      set({ currentTicket: data, detailLoading: false });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load ticket details';
      set({ detailLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  createTicket: async (ticketData) => {
    set({ actionLoading: true });
    try {
      const response = await ticketApi.createTicket(ticketData);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Ticket Created',
        message: `Ticket #${response.ticket?._id?.slice(-6).toUpperCase() || ''} created successfully.`,
      });
      // Refetch
      get().fetchTickets();
      set({ actionLoading: false });
      return { success: true, ticket: response.ticket };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create ticket';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Creation Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  updateTicket: async (id, updateData) => {
    set({ actionLoading: true });
    try {
      const response = await ticketApi.updateTicket(id, updateData);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Ticket Updated',
        message: 'Ticket details updated successfully.',
      });
      get().fetchTicketById(id);
      get().fetchTickets();
      set({ actionLoading: false });
      return { success: true, ticket: response.ticket };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update ticket';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Update Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  assignTicket: async (id, technicianId) => {
    set({ actionLoading: true });
    try {
      const response = await ticketApi.assignTicket(id, technicianId);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Ticket Assigned',
        message: 'Technician has been assigned to ticket.',
      });
      get().fetchTicketById(id);
      get().fetchTickets();
      set({ actionLoading: false });
      return { success: true, ticket: response.ticket };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to assign ticket';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Assignment Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  resolveTicket: async (id, { resolution, proofPhoto }) => {
    set({ actionLoading: true });
    try {
      const response = await ticketApi.resolveTicket(id, { resolution, proofPhoto });
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Ticket Resolved',
        message: response.verificationOtp 
          ? `Service resolved. Verification OTP: ${response.verificationOtp}` 
          : 'Service resolved. OTP sent to employee.',
      });
      get().fetchTicketById(id);
      get().fetchTickets();
      set({ actionLoading: false });
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resolve ticket';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Resolution Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  verifyService: async (id, otp) => {
    set({ actionLoading: true });
    try {
      const response = await ticketApi.verifyService(id, otp);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Service Verified',
        message: 'Service verified successfully. Ticket closed.',
      });
      get().fetchTicketById(id);
      get().fetchTickets();
      set({ actionLoading: false });
      return { success: true, ticket: response.ticket };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to verify service';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Verification Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  rejectService: async (id, rejectionReason) => {
    set({ actionLoading: true });
    try {
      const response = await ticketApi.rejectService(id, rejectionReason);
      useToastStore.getState().addToast({
        type: 'warning',
        title: 'Service Rejected',
        message: 'Ticket has been reopened with rejection feedback.',
      });
      get().fetchTicketById(id);
      get().fetchTickets();
      set({ actionLoading: false });
      return { success: true, ticket: response.ticket };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reject service';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Action Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  rateTechnician: async (id, { rating, comment }) => {
    set({ actionLoading: true });
    try {
      const response = await ticketApi.rateTechnician(id, { rating, comment });
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Rating Submitted',
        message: 'Thank you for your feedback!',
      });
      get().fetchTicketById(id);
      get().fetchTickets();
      set({ actionLoading: false });
      return { success: true, rating: response.rating };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit rating';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Rating Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  deleteTicket: async (id) => {
    set({ actionLoading: true });
    try {
      await ticketApi.deleteTicket(id);
      useToastStore.getState().addToast({
        type: 'info',
        title: 'Ticket Deleted',
        message: 'Ticket has been deleted.',
      });
      set((state) => ({
        tickets: state.tickets.filter((t) => t._id !== id),
        actionLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete ticket';
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
