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
  Briefcase,
  Activity,
  Siren,
  LifeBuoy
} from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import MapComponent from './components/MapComponent';
import CitizenReport from './pages/CitizenReport';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import Login from './pages/Login';
import SafetyInfo from './pages/SafetyInfo';
import WarningList from './components/WarningList';
import Chatbot from './components/Chatbot';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { warningService } from './services/warningService';
import { rescueService } from './services/rescueService';

const PROVINCES = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh',
  'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cần Thơ',
  'Cao Bằng', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
  'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang',
  'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn',
  'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
  'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La',
  'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang',
  'TP Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái', 'Bình Giang'
];

const stripDiacritics = (val = '') => val.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const { Header, Content, Footer } = Layout;

const AppHeader = ({ warnings, openWarnings, setOpenWarnings }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userDropdownItems = [

    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogOut size={14} />,
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      }
    }
  ].filter(Boolean);

  const mainMenuItems = [
    { key: '1', icon: <MapIcon size={16} />, label: <Link to="/">Bản đồ</Link> },
    { key: 'safety', icon: <BookOpen size={16} />, label: <Link to="/safety">Thông tin an toàn</Link> },

    // Logic ẩn hiện menu theo quyền
    (!user || user.role === 'citizen') ? {
      key: 'report',
      label: (
        <Link to="/report" className="flex items-center h-full">
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-5 rounded-full shadow-[0_4px_15px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_25px_rgba(239,68,68,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 font-bold tracking-wide h-[40px] leading-none mb-1">
            <AlertTriangle size={18} strokeWidth={2.5} className="animate-pulse" />
            <span>GỬI YÊU CẦU CỨU HỘ</span>
          </div>
        </Link>
      ),
      className: '!px-2 !bg-transparent hover:!bg-transparent'
    } : null,
    (user?.role === 'admin') ? { key: 'admin', icon: <ShieldAlert size={16} />, label: <Link to="/admin">Quản trị</Link> } : null,
    (user?.role === 'coordinator') ? { key: 'coordinator', icon: <ShieldAlert size={16} />, label: <Link to="/coordinator">Điều phối</Link> } : null,
    (user?.role === 'officer') ? { key: 'officer', icon: <Briefcase size={16} />, label: <Link to="/officer">Công tác</Link> } : null,
  ].filter(Boolean);

  return (
    <>
      <Header className="w-full flex items-center justify-between bg-blue-950/95 backdrop-blur-xl border-b border-blue-900/50 px-6 h-[72px] shadow-[0_4px_30px_rgba(0,0,0,0.4)] z-50 sticky top-0">
        <div className="flex items-center flex-1">
          <div
            className="mr-10 flex items-center shrink-0 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 mr-3 group-hover:scale-110 transition-transform duration-300">
              <Siren className="text-white group-hover:animate-bounce" size={24} strokeWidth={2.5} />
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-cyan-200 text-[17px] font-black tracking-wider uppercase drop-shadow-sm group-hover:from-white group-hover:to-cyan-100 transition-all">
              Hệ Thống Cứu Hộ Bão
            </span>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            className="bg-transparent border-none flex-1 min-w-0 font-medium tracking-wide text-[15px]"
            items={mainMenuItems}
          />
        </div>

        <div className="flex items-center gap-6">
          <div
            className="group cursor-pointer flex items-center bg-white/5 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full transition-all duration-300 shadow-sm"
            onClick={() => setOpenWarnings(true)}
          >
            <Badge count={warnings.length} size="small" offset={[4, -4]} color="#ef4444">
              <BellRing size={18} className="text-blue-200 group-hover:text-yellow-400 transition-colors drop-shadow-md" />
            </Badge>
            <span className="ml-3 text-sm font-semibold text-blue-100 group-hover:text-white transition-colors hidden md:block">Cảnh báo</span>
          </div>

          {user ? (
            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center text-blue-50 cursor-pointer hover:bg-white/10 border border-white/5 hover:border-white/20 pl-4 py-1.5 pr-1.5 rounded-full transition-all duration-300 shadow-sm group">
                <span className="font-semibold text-sm tracking-wide mr-3 group-hover:text-white transition-colors">{user.name}</span>
                <Avatar
                  size={36}
                  className="bg-gradient-to-tr from-orange-400 to-pink-500 shadow-inner flex items-center justify-center font-bold text-white border-2 border-white/20 group-hover:border-white/40 transition-colors"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </div>
            </Dropdown>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button type="primary" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-0 shadow-lg shadow-blue-500/30 rounded-full h-10 px-6 font-semibold tracking-wide flex items-center transition-all duration-300">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Header>

      <Drawer
        title={
          <div className="flex items-center text-red-600 font-bold">
            <AlertTriangle className="mr-2" size={20} /> TIN CẢNH BÁO MỚI
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

const AppContent = () => {
  const { user } = useAuth();
  const [rescueRequests, setRescueRequests] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [openWarnings, setOpenWarnings] = useState(false);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const normalizeProvince = (val) => stripDiacritics((val || '').trim()).toLowerCase();

  const isScopedRole = user && ['guest', 'citizen', 'officer', 'admin', 'coordinator'].includes(user.role);

  // Lọc yêu cầu cứu hộ cho bản đồ và danh sách
  const filteredRescuesForMap = React.useMemo(() => {
    if (!rescueRequests) return [];

    // Loại bỏ các yêu cầu đã được cứu hoặc bị từ chối — không hiển thị trên bản đồ
    const activeRescues = rescueRequests.filter(
      r => r.status !== 'Đã được cứu' && r.status !== 'Từ chối'
    );

    // Nếu có chọn tỉnh để lọc
    if (selectedProvinces.length > 0) {
      const targets = selectedProvinces.map(normalizeProvince);
      return activeRescues.filter(r => targets.includes(normalizeProvince(r.province)));
    }

    // Nếu không lọc, hiển thị tất cả yêu cầu đang hoạt động
    return activeRescues;
  }, [rescueRequests, selectedProvinces]);

  const fetchMapData = async () => {
    try {
      const rsData = await rescueService.getAll();
      setRescueRequests(rsData);
    } catch (error) {
      console.error('Failed to fetch map data:', error);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [user]);

  // Lắng nghe sự kiện cập nhật từ các Dashboard để đồng bộ bản đồ real-time
  useEffect(() => {
    const handleRescueUpdated = () => {
      fetchMapData();
    };
    window.addEventListener('rescueDataUpdated', handleRescueUpdated);
    return () => window.removeEventListener('rescueDataUpdated', handleRescueUpdated);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin' && !selectedProvinces.length && user.province) {
      setSelectedProvinces([user.province]);
    }
  }, [user, selectedProvinces]);

  const fetchWarnings = async () => {
    try {
      const data = await warningService.getAll();
      setWarnings(data);
    } catch (error) {
      console.error('Failed to fetch warnings:', error);
    }
  };

  useEffect(() => {
    fetchWarnings();
  }, [user]);

  // Lắng nghe sự kiện cập nhật cảnh báo từ các Dashboard để đồng bộ real-time
  useEffect(() => {
    const handleWarningUpdated = () => {
      fetchWarnings();
    };
    window.addEventListener('warningDataUpdated', handleWarningUpdated);
    return () => window.removeEventListener('warningDataUpdated', handleWarningUpdated);
  }, []);

  const filteredWarnings = React.useMemo(() => {
    // Nếu là điều phối viên hoặc đội cứu hộ, backend đã lọc tuyệt đối chuẩn, trả thẳng luôn
    if (user && ['coordinator', 'officer'].includes(user.role)) {
      return warnings;
    }

    // Cảnh báo luôn hiển thị tất cả cho Admin và Người dân
    // Chỉ lọc khi người dùng chủ động chọn tỉnh trên bộ lọc
    if (selectedProvinces.length > 0) {
      const targets = selectedProvinces.map(normalizeProvince);
      return warnings.filter(w => {
        const wp = normalizeProvince(w.province);
        // Hiện cảnh báo không có province (cảnh báo chung) + cảnh báo theo tỉnh đã chọn
        return !wp || targets.includes(wp);
      });
    }
    return warnings;
  }, [warnings, selectedProvinces, user]);

  return (
    <Router>
      <Layout className="min-h-screen w-full flex flex-col">
        <AppHeader warnings={filteredWarnings} openWarnings={openWarnings} setOpenWarnings={setOpenWarnings} />

        <Content className="w-full flex-1 relative bg-gray-50">
          <Routes>
            <Route path="/" element={
              <div className="w-full h-[calc(100vh-64px)] relative flex">
                <div className="flex-1 relative">
                  <MapComponent rescues={filteredRescuesForMap} />
                </div>
                <div className="rescue-sidebar w-80 h-full overflow-hidden hidden lg:flex flex-col">
                  <div className="sidebar-header">
                    <h3><MapIcon size={20} className="text-blue-600" /> Cứu hộ khu vực</h3>
                    <div className="mt-4">
                      <Select
                        mode={user?.role === 'admin' ? 'multiple' : undefined}
                        showSearch
                        allowClear
                        placeholder="Chọn Tỉnh/Thành phố"
                        className="w-full custom-select"
                        value={selectedProvinces.length ? (user?.role === 'admin' ? selectedProvinces : selectedProvinces[0]) : undefined}
                        onChange={(v) => {
                          if (user?.role === 'admin') {
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
                      <Button
                        type="link"
                        size="small"
                        className="mt-2 p-0 text-blue-600 font-medium"
                        onClick={() => setSelectedProvinces([])}
                      >
                        Hiển thị tất cả khu vực
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto custom-scrollbar">
                    {filteredRescuesForMap.length === 0 ? (
                      <div className="p-12 text-sm text-gray-400 text-center flex flex-col items-center">
                        <AlertTriangle size={32} className="mb-3 opacity-20" />
                        <p>Chưa có yêu cầu cứu hộ nào tại khu vực này.</p>
                      </div>
                    ) : (
                      <div className="rescue-list">
                        {filteredRescuesForMap.map(r => (
                          <div key={r.id} className="rescue-card">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 text-sm leading-tight mb-1">{r.contactName}</div>
                                <div className="text-[11px] text-gray-500 font-medium">{r.district}, {r.province}</div>
                              </div>
                              <span className={`priority-badge ${r.priority === 'Rất khẩn cấp' ? 'critical' : r.priority === 'Khẩn cấp' ? 'urgent' : 'normal'}`}>
                                {r.priority}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 mb-3">
                              <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">Người kẹt</div>
                                <div className="text-sm font-bold text-blue-900">{r.trappedCount} người</div>
                              </div>
                            </div>

                            <div className="text-[12px] text-gray-600 mb-3 line-clamp-2 leading-relaxed italic border-l-2 border-gray-100 pl-3">
                              "{r.description || 'Không có mô tả chi tiết từ hiện trường'}"
                            </div>

                            <div className="mt-2 status-indicator">
                              <span className={`status-dot ${r.status === 'Chờ tiếp nhận' ? 'pending' : r.status === 'Đang xử lý' ? 'processing' : 'rescued'}`}></span>
                              <span className={`${r.status === 'Chờ tiếp nhận' ? 'text-gray-500' : r.status === 'Đang xử lý' ? 'text-blue-600' : 'text-emerald-600'}`}>
                                {r.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            } />

            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/report" element={
              <div className="w-full h-full p-6 flex justify-center overflow-auto">
                <div className="w-full max-w-4xl pb-10"><CitizenReport /></div>
              </div>
            } />

            <Route path="/admin" element={
              <div className="w-full h-full p-6 overflow-auto"><AdminDashboard /></div>
            } />

            <Route path="/coordinator" element={
              <div className="w-full h-full p-6 overflow-auto"><CoordinatorDashboard /></div>
            } />

            <Route path="/officer" element={
              <div className="w-full h-full p-6 overflow-auto"><OfficerDashboard /></div>
            } />

            <Route path="/safety" element={
              <div className="w-full h-full p-6 flex justify-center overflow-auto">
                <div className="w-full max-w-5xl pb-10"><SafetyInfo /></div>
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

        <Footer className="app-footer w-full text-center">
          Storm Rescue 2026 — Thang Long University Project
        </Footer>
      </Layout>
      <Chatbot />
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
