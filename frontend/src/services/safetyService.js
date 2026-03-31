import api from './api.js';

export const safetyService = {
  async getGuides(filters = {}) {
    const response = await api.get('/safety/guides', { params: filters });
    return response.data || [];
  },

  async createGuide(guideData) {
    return await api.post('/safety/guides', guideData);
  },

  async updateGuide(id, guideData) {
    return await api.put(`/safety/guides/${id}`, guideData);
  },

  async deleteGuide(id) {
    return await api.delete(`/safety/guides/${id}`);
  },

  async getSafeZones(filters = {}) {
    const response = await api.get('/safety/safe-zones', { params: filters });
    return response.data || [];
  },

  async createSafeZone(zoneData) {
    return await api.post('/safety/safe-zones', zoneData);
  },

  async updateSafeZone(id, zoneData) {
    return await api.put(`/safety/safe-zones/${id}`, zoneData);
  },

  async deleteSafeZone(id) {
    return await api.delete(`/safety/safe-zones/${id}`);
  },

  async getContacts(filters = {}) {
    const response = await api.get('/safety/contacts', { params: filters });
    return response.data || [];
  },

  async createContact(contactData) {
    return await api.post('/safety/contacts', contactData);
  },

  async updateContact(id, contactData) {
    return await api.put(`/safety/contacts/${id}`, contactData);
  },

  async deleteContact(id) {
    return await api.delete(`/safety/contacts/${id}`);
  }
};
