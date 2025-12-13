import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Drawer, Badge } from 'antd';
import { 
  AlertTriangle, 
  Map as MapIcon, 
  User, 
  ShieldAlert, 
  LogOut, 
  BellRing, 
  BookOpen,
  Settings,
  Briefcase 
} from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import MapComponent from './components/MapComponent';
import CitizenReport from './pages/CitizenReport';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SafetyInfo from './pages/SafetyInfo'; 
import WarningList from './components/WarningList'; 
import UserProfile from './pages/UserProfile'; 
import { MOCK_LANDSLIDES, MOCK_WARNINGS } from './mockData';

const { Header, Content, Footer } = Layout;

// --- COMPONENT HEADER ---
const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openWarnings, setOpenWarnings] = useState(false);

  // --- SỬA LỖI TẠI ĐÂY: VIẾT LẠI CÁCH TẠO MENU DROPDOWN ---
  // Thay vì dùng dấu "...", ta dùng điều kiện ? : null và lọc bỏ null sau cùng
  const userDropdownItems = [
    // 1. Mục Hồ sơ (Chỉ hiện nếu là Citizen)
    (user?.role === 'citizen') ? { 
      key: 'profile', 
      label: 'Hồ sơ & Địa điểm', 
      icon: <Settings size={14}/>, 
      onClick: () => navigate('/profile') 
    } : null,

    // 2. Mục Đăng xuất (Luôn hiện)
    { 
      key: 'logout', 
      label: 'Đăng xuất', 
      icon: <LogOut size={14}/>, 
      danger: true,
      onClick: () => { 
        logout(); 
        navigate('/login'); 
      } 
    }
  ].filter(Boolean); // <--- Lệnh này sẽ xóa sạch các giá trị null, tránh lỗi cú pháp

  // Menu chính
  const mainMenuItems = [
    { key: '1', icon: <MapIcon size={16}/>, label: <Link to="/">Bản đồ</Link> },
    { key: 'safety', icon: <BookOpen size={16}/>, label: <Link to="/safety">Thông tin an toàn</Link> }, 
    
    // Logic ẩn hiện menu theo quyền
    (user && user.role === 'citizen') ? { key: 'report', icon: <User size={16}/>, label: <Link to="/report">Gửi báo cáo</Link> } : null,
    (user?.role === 'admin') ? { key: 'admin', icon: <ShieldAlert size={16}/>, label: <Link to="/admin">Quản trị</Link> } : null,
    (user?.role === 'officer') ? { key: 'officer', icon: <Briefcase size={16}/>, label: <Link to="/officer">Công tác</Link> } : null,
  ].filter(Boolean);

  return (
    <>
      <Header className="w-full flex items-center justify-between bg-blue-900 px-6 h-16 shadow-md z-50">
        <div className="flex items-center flex-1">
          <div className="text-white text-lg font-bold mr-8 flex items-center shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <AlertTriangle className="mr-2" /> HỆ THỐNG CẢNH BÁO
          </div>
          <Menu 
            theme="dark" 
            mode="horizontal" 
            defaultSelectedKeys={['1']} 
            className="bg-transparent border-none flex-1 min-w-0"
            items={mainMenuItems} 
          />
        </div>

        <div className="flex items-center gap-5">
          <div 
            className="cursor-pointer text-white hover:text-yellow-400 transition flex items-center"
            onClick={() => setOpenWarnings(true)}
          >
            <Badge count={MOCK_WARNINGS.length} size="small" offset={[2, -2]}>
              <BellRing size={20} className="text-white" />
            </Badge>
            <span className="ml-2 text-sm font-medium hidden md:block">Cảnh báo</span>
          </div>

          {user ? (
            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
              <div className="flex items-center text-white cursor-pointer hover:bg-blue-800 px-3 py-1 rounded transition">
                <Avatar style={{ backgroundColor: '#f56a00', marginRight: 8 }}>
                  {user.name ? user.name.charAt(0) : 'U'}
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>
            </Dropdown>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button type="text" className="text-white hover:text-blue-200 font-medium">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button type="primary" className="bg-blue-600 font-medium border-none shadow">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </Header>

      <Drawer
        title={
          <div className="flex items-center text-red-600 font-bold">
            <AlertTriangle className="mr-2" size={20}/> TIN CẢNH BÁO MỚI
          </div>
        }
        placement="right"
        onClose={() => setOpenWarnings(false)}
        open={openWarnings}
        width={400}
        styles={{ body: { padding: 0, backgroundColor: '#f3f4f6' } }}
      >
        <WarningList warnings={MOCK_WARNINGS} />
      </Drawer>
    </>
  );
};

// --- APP CHÍNH ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout className="min-h-screen w-full flex flex-col">
          <AppHeader />

          <Content className="w-full flex-1 relative bg-gray-50">
            <Routes>
              <Route path="/" element={
                 <div className="w-full h-[calc(100vh-64px)] relative"> 
                    <MapComponent points={MOCK_LANDSLIDES} />
                 </div>
              } />
              
              <Route path="/login" element={<div className="h-full pt-10 flex justify-center"><Login /></div>} />
              <Route path="/register" element={<div className="h-full pt-10 flex justify-center"><Register /></div>} />

              <Route path="/report" element={
                <div className="w-full h-full p-6 flex justify-center overflow-auto">
                    <div className="w-full max-w-4xl pb-10"><CitizenReport /></div>
                </div>
              } />

              <Route path="/profile" element={
                <div className="w-full h-full p-6 flex justify-center overflow-auto">
                    <div className="w-full max-w-4xl pb-10"><UserProfile /></div>
                </div>
              } />

              <Route path="/admin" element={
                <div className="w-full h-full p-6 overflow-auto"><AdminDashboard /></div>
              } />

              <Route path="/officer" element={
                <div className="w-full h-full p-6 overflow-auto"><OfficerDashboard /></div>
              } />

              <Route path="/safety" element={
                <div className="w-full h-full p-6 flex justify-center overflow-auto">
                    <div className="w-full max-w-5xl pb-10"><SafetyInfo /></div>
                </div>
              } />
            </Routes>
          </Content>
          
          <Footer className="w-full text-center p-4 bg-white border-t border-gray-200 text-gray-500 text-sm">
            Hệ thống cảnh báo sạt lở &copy; 2025 - Thang Long University Project
          </Footer>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;