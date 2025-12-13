import api from './api.js';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response;
  },

  async register(userData) {
    return await api.post('/auth/register', userData);
  },

  loginGuest(guestInfo = {}) {
    // guestInfo: không cần thiết nữa, guest không cần khai báo Tỉnh/Xã
    const guestUser = {
      name: guestInfo.name || 'Khách',
      role: 'guest'
    };
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    return { success: true, data: { user: guestUser } };
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('accessToken');
  },

  async getMe() {
    const response = await api.get('/auth/me');
    if (response.success && response.data) {
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      return response.data;
    }
    return null;
  }
};

