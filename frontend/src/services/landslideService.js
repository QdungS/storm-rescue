import api from './api.js';

export const landslideService = {
  async getAll(filters = {}) {
    const response = await api.get('/landslides', { params: filters });
    return response.data || [];
  },

  async create(landslideData) {
    return await api.post('/landslides', landslideData);
  },

  async update(id, landslideData) {
    return await api.put(`/landslides/${id}`, landslideData);
  },

  async delete(id) {
    return await api.delete(`/landslides/${id}`);
  }
};

