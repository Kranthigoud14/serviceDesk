import api from './client';

export const knowledgeApi = {
  getArticles: async (params = {}) => {
    const response = await api.get('/knowledge-base', { params });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/knowledge-base/categories');
    return response.data;
  },

  getArticleById: async (id) => {
    const response = await api.get(`/knowledge-base/${id}`);
    return response.data;
  },

  createArticle: async (articleData) => {
    const response = await api.post('/knowledge-base', articleData);
    return response.data;
  },

  updateArticle: async (id, articleData) => {
    const response = await api.put(`/knowledge-base/${id}`, articleData);
    return response.data;
  },

  deleteArticle: async (id) => {
    const response = await api.delete(`/knowledge-base/${id}`);
    return response.data;
  },
};
