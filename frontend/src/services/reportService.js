import api from './api.js';

export const reportService = {
  async submit(reportData, images = []) {
    const formData = new FormData();
    formData.append('title', reportData.title || 'Báo cáo sự cố');
    formData.append('description', reportData.description);
    formData.append('location', reportData.location || '');
    formData.append('latitude', reportData.latitude);
    formData.append('longitude', reportData.longitude);
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    return await api.post('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  async getMyReports() {
    const response = await api.get('/reports/my');
    return response.data || [];
  },

  async getAll() {
    const response = await api.get('/reports');
    return response.data || [];
  },

  async updateStatus(reportId, status, feedback) {
    return await api.put(`/reports/${reportId}/status`, { status, feedback });
  }
};

