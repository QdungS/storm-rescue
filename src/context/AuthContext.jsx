import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. Kiểm tra trạng thái đăng nhập khi tải lại trang (F5)
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // 2. Hàm Đăng nhập với API
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

  // 3. Hàm Đăng ký với API
  const register = async (data) => {
    try {
      const response = await authService.register(data);
      if (response.success) {
        return { success: true, message: 'Đăng ký thành công!' };
      }
      return { success: false, message: response.message || 'Đăng ký thất bại' };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Đăng ký thất bại' 
      };
    }
  };

  // 4. Hàm Đăng xuất
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);