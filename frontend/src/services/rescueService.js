import api from './api.js';

export const rescueService = {
    async getAll(filters = {}) {
        const response = await api.get('/rescues', { params: filters });
        return response.data || [];
    },

    async createRequest(requestData) {
        return await api.post('/rescues', requestData);
    },

    async updateRequest(id, requestData) {
        return await api.put(`/rescues/${id}`, requestData);
    },

    async deleteRequest(id) {
        return await api.delete(`/rescues/${id}`);
    },

    async acceptTask(id) {
        return await api.post(`/rescues/${id}/accept-task`);
    },

    async reportFake(id) {
        return await api.post(`/rescues/${id}/report-fake`);
    }
};
