import api from './api.js';

export const warningService = {
  async getAll(filters = {}) {
    const response = await api.get('/warnings', { params: filters });
    return response.data || [];
  },

  async create(warningData) {
    return await api.post('/warnings', warningData);
  },

  async update(id, warningData) {
    return await api.put(`/warnings/${id}`, warningData);
  },

  async delete(id) {
    return await api.delete(`/warnings/${id}`);
  }
};
