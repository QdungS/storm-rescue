import api from './api.js';

export const userService = {
  async getAll(filters = {}) {
    const response = await api.get('/users', { params: filters });
    return response.data || [];
  },

  async create(userData) {
    return await api.post('/users', userData);
  },

  async update(id, userData) {
    return await api.put(`/users/${id}`, userData);
  },

  async delete(id) {
    return await api.delete(`/users/${id}`);
  },

  async toggleLock(id) {
    return await api.put(`/users/${id}/toggle-lock`);
  }
};
