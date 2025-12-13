import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Drawer, Badge, Select } from 'antd';
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
import { landslideService } from './services/landslideService';
import { warningService } from './services/warningService';

const PROVINCES = [
  'An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh',
  'Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cần Thơ',
  'Cao Bằng','Đà Nẵng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp',
  'Gia Lai','Hà Giang','Hà Nam','Hà Nội','Hà Tĩnh','Hải Dương','Hải Phòng','Hậu Giang',
  'Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn',
  'Lào Cai','Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Phú Yên',
  'Quảng Bình','Quảng Nam','Quảng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La',
  'Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa','Thừa Thiên Huế','Tiền Giang',
  'TP Hồ Chí Minh','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái','Bình Giang'
];

const stripDiacritics = (val = '') => val.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const { Header, Content, Footer } = Layout;

// --- COMPONENT HEADER ---
const AppHeader = ({ warnings, openWarnings, setOpenWarnings }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            <Badge count={warnings.length} size="small" offset={[2, -2]}>
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
        size={400}
        styles={{ body: { padding: 0, backgroundColor: '#f3f4f6' } }}
      >
        <WarningList warnings={warnings} />
      </Drawer>
    </>
  );
};

// --- APP CHÍNH ---
const AppContent = () => {
  const { user } = useAuth();
  const [landslides, setLandslides] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [openWarnings, setOpenWarnings] = useState(false);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const normalizeProvince = (val) => stripDiacritics((val || '').trim()).toLowerCase();

  const isScopedRole = user && ['guest', 'citizen', 'officer', 'admin'].includes(user.role);

  // Lọc điểm sạt lở cho danh sách (cho guest/citizen/officer/admin)
  const provincePoints = React.useMemo(() => {
    if (isScopedRole) {
      if (user.role === 'admin') {
        if (!selectedProvinces.length) return landslides; // admin chọn "tất cả"
        const targets = selectedProvinces.map(normalizeProvince);
        return landslides.filter(p => targets.includes(normalizeProvince(p.province)));
      }
      if (!selectedProvinces.length) return [];
      const target = normalizeProvince(selectedProvinces[0]);
      return landslides.filter(p => normalizeProvince(p.province) === target);
    }
    return [];
  }, [landslides, isScopedRole, user, selectedProvinces]);

  // Lọc điểm sạt lở cho bản đồ (hiển thị theo tỉnh chọn)
  const filteredLandslidesForMap = React.useMemo(() => {
    if (isScopedRole) {
      if (user.role === 'admin') {
        if (!selectedProvinces.length) return landslides;
        const targets = selectedProvinces.map(normalizeProvince);
        return landslides.filter(p => targets.includes(normalizeProvince(p.province)));
      }
      if (selectedProvinces.length) {
        const target = normalizeProvince(selectedProvinces[0]);
        return landslides.filter(p => normalizeProvince(p.province) === target);
      }
    }
    return landslides;
  }, [landslides, isScopedRole, user, selectedProvinces]);

  useEffect(() => {
    const fetchLandslides = async () => {
      try {
        // Luôn fetch TẤT CẢ điểm sạt lở để hiển thị trên bản đồ
        const data = await landslideService.getAll();
        setLandslides(data);
      } catch (error) {
        console.error('Failed to fetch landslides:', error);
      }
    };
    fetchLandslides();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin' && !selectedProvinces.length && user.province) {
      setSelectedProvinces([user.province]);
    }
  }, [user, selectedProvinces]);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const data = await warningService.getAll();
        setWarnings(data);
      } catch (error) {
        console.error('Failed to fetch warnings:', error);
      }
    };
    fetchWarnings();
  }, [user]);

  const filteredWarnings = React.useMemo(() => {
    if (isScopedRole) {
      if (user.role === 'admin') {
        if (!selectedProvinces.length) return warnings;
        const targets = selectedProvinces.map(normalizeProvince);
        return warnings.filter(w => targets.includes(normalizeProvince(w.province)));
      }
      if (selectedProvinces.length) {
        const target = normalizeProvince(selectedProvinces[0]);
        return warnings.filter(w => normalizeProvince(w.province) === target);
      }
    }
    return warnings;
  }, [warnings, isScopedRole, user, selectedProvinces]);

  return (
    <Router>
      <Layout className="min-h-screen w-full flex flex-col">
        <AppHeader warnings={filteredWarnings} openWarnings={openWarnings} setOpenWarnings={setOpenWarnings} />

        <Content className="w-full flex-1 relative bg-gray-50">
          <Routes>
            <Route path="/" element={
               <div className="w-full h-[calc(100vh-64px)] relative flex">
                  <div className="flex-1 relative">
                    <MapComponent points={filteredLandslidesForMap} />
                  </div>
                  {user && (user.role === 'guest' || user.role === 'citizen' || user.role === 'officer' || user.role === 'admin') && (
                    <div className="w-80 max-w-xs h-full overflow-hidden bg-white border-l border-gray-200 shadow-sm hidden lg:flex flex-col">
                      <div className="p-4 border-b bg-gray-50">
                        <h3 className="text-base font-semibold text-gray-800">Danh sách điểm sạt lở</h3>
                        <div className="mt-2 space-y-2">
                          <Select
                            mode={user.role === 'admin' ? 'multiple' : undefined}
                            showSearch
                            allowClear
                            placeholder="Chọn Tỉnh/Thành phố"
                            className="w-full"
                            value={selectedProvinces.length ? (user.role === 'admin' ? selectedProvinces : selectedProvinces[0]) : undefined}
                            onChange={(v) => {
                              if (user.role === 'admin') {
                                setSelectedProvinces(v || []);
                              } else {
                                setSelectedProvinces(v ? [v] : []);
                              }
                            }}
                            options={PROVINCES.map(p => ({ label: p, value: p }))}
                            optionFilterProp="label"
                            filterOption={(input, option) => {
                              const label = option?.label || '';
                              return stripDiacritics(label).toLowerCase().includes(stripDiacritics(input).toLowerCase());
                            }}
                          />
                          {user.role === 'admin' && (
                            <Button size="small" className="w-full" onClick={() => setSelectedProvinces([])}>
                              Hiển thị tất cả điểm
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto">
                        {provincePoints.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">Chưa có điểm sạt lở nào cho bộ lọc.</div>
                        ) : (
                          <ul className="divide-y">
                            {provincePoints.map(p => (
                              <li key={p.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-semibold text-gray-800">{p.name}</div>
                                    <div className="text-xs text-gray-500">{p.district || 'Chưa rõ xã/phường'}</div>
                                    {p.type && <div className="text-xs text-blue-600 mt-1">{p.type}</div>}
                                  </div>
                                  <span className={`text-xs font-semibold ${
                                    p.level === 5 ? 'text-black' :
                                    p.level === 4 ? 'text-red-600' :
                                    p.level === 3 ? 'text-orange-500' :
                                    p.level === 2 ? 'text-yellow-600' :
                                    'text-green-600'
                                  }`}>
                                    Mức {p.level}/5
                                  </span>
                                </div>
                                {p.description && <div className="text-xs text-gray-600 mt-2 line-clamp-2">{p.description}</div>}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
               </div>
            } />
            
            <Route path="/login" element={<div className="h-full pt-10 flex justify-center"><Login /></div>} />
            <Route path="/register" element={<div className="h-full pt-10 flex justify-center"><Register /></div>} />

            <Route path="/report" element={
              user?.role === 'guest'
                ? <div className="w-full h-full p-6 flex justify-center overflow-auto">
                    <div className="max-w-3xl w-full bg-white p-6 rounded shadow border border-dashed border-yellow-400 text-center">
                      <h3 className="text-xl font-bold text-yellow-700 mb-3">Chức năng chỉ dành cho người dùng đăng nhập</h3>
                      <p className="text-gray-600">Khách chỉ có thể xem điểm sạt lở, cảnh báo, hướng dẫn an toàn và liên hệ khẩn cấp. Vui lòng đăng nhập để gửi báo cáo.</p>
                      <div className="mt-4 flex justify-center gap-3">
                        <Link to="/login"><Button type="primary">Đăng nhập</Button></Link>
                        <Link to="/register"><Button>Đăng ký</Button></Link>
                      </div>
                    </div>
                  </div>
                : <div className="w-full h-full p-6 flex justify-center overflow-auto">
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
                  <div className="w-full max-w-5xl pb-10"><SafetyInfo selectedProvinces={selectedProvinces} userRole={user?.role} /></div>
              </div>
            } />
            
            {/* Catch-all route - redirect to home if route not found */}
            <Route path="*" element={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Trang không tồn tại</p>
                  <Link to="/">
                    <Button type="primary">Về trang chủ</Button>
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </Content>
        
        <Footer className="w-full text-center p-4 bg-white border-t border-gray-200 text-gray-500 text-sm">
          Hệ thống cảnh báo sạt lở &copy; 2025 - Thang Long University Project
        </Footer>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;