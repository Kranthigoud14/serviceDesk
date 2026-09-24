import { create } from 'zustand';
import { knowledgeApi } from '../api/knowledgeApi';
import { useToastStore } from './toastStore';

export const useKnowledgeStore = create((set, get) => ({
  articles: [],
  categories: [],
  selectedArticle: null,
  loading: false,
  actionLoading: false,
  error: null,
  selectedCategory: 'All',
  searchQuery: '',

  fetchArticles: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await knowledgeApi.getArticles(params);
      set({ articles: data.articles || [], loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch knowledge articles';
      set({ error: msg, loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const data = await knowledgeApi.getCategories();
      set({ categories: data.categories || [] });
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  },

  fetchArticleById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await knowledgeApi.getArticleById(id);
      set({ selectedArticle: data.article, loading: false });
      return { success: true, article: data.article };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch article details';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  createArticle: async (articleData) => {
    set({ actionLoading: true });
    try {
      const data = await knowledgeApi.createArticle(articleData);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Article Published',
        message: 'Knowledge article created successfully.',
      });
      get().fetchArticles();
      get().fetchCategories();
      set({ actionLoading: false });
      return { success: true, article: data.article };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create article';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Creation Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  updateArticle: async (id, articleData) => {
    set({ actionLoading: true });
    try {
      const data = await knowledgeApi.updateArticle(id, articleData);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Article Updated',
        message: 'Knowledge article saved.',
      });
      get().fetchArticles();
      set({ actionLoading: false, selectedArticle: data.article });
      return { success: true, article: data.article };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update article';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Update Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  deleteArticle: async (id) => {
    set({ actionLoading: true });
    try {
      await knowledgeApi.deleteArticle(id);
      useToastStore.getState().addToast({
        type: 'info',
        title: 'Article Deleted',
        message: 'Article removed from knowledge base.',
      });
      set((state) => ({
        articles: state.articles.filter((a) => a._id !== id),
        actionLoading: false,
      }));
      get().fetchCategories();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete article';
      useToastStore.getState().addToast({
        type: 'error',
        title: 'Delete Failed',
        message: msg,
      });
      set({ actionLoading: false });
      return { success: false, error: msg };
    }
  },

  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearSelectedArticle: () => set({ selectedArticle: null }),
}));
