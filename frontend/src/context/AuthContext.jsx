import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'Đăng nhập thất bại' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Email hoặc mật khẩu không đúng!'
      };
    }
  };

const logout = () => {
    authService.logout();
    setUser(null);
  };

const refreshUser = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        return;
      }
      const userData = await authService.getMe();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);

      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
