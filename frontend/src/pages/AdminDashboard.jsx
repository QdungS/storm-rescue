import React, { useState, useEffect, useMemo } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, message, Tabs, Popconfirm, Card, Row, Col, Statistic, Progress } from 'antd';
import { Edit, Trash2, Plus, MapPin, Bell, BookOpen, Users, Lock, Unlock, Shield, Phone, BarChart3 } from 'lucide-react';
import { landslideService } from '../services/landslideService';
import { warningService } from '../services/warningService';
import { safetyService } from '../services/safetyService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const { TabPane } = Tabs;
const { TextArea } = Input;

const LANDSLIDE_TYPES = [
  'Sạt lở đất',
  'Sạt lở đá',
  'Lũ quét',
  'Sạt lở ven sông',
  'Sụt lún/Hố sụt',
  'Trượt taluy đường',
  'Dòng bùn đá'
];

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

const AdminDashboard = () => {
  const { user, refreshUser } = useAuth();
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [landslides, setLandslides] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [guides, setGuides] = useState([]);
  const [users, setUsers] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Fetch data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [landslidesData, warningsData, guidesData, usersData, safeZonesData, contactsData] = await Promise.all([
          landslideService.getAll(),
          warningService.getAll(),
          safetyService.getGuides(),
          userService.getAll(),
          safetyService.getSafeZones(),
          safetyService.getContacts()
        ]);
        setLandslides(landslidesData);
        setWarnings(warningsData);
        setGuides(guidesData);
        setUsers(usersData);
        setSafeZones(safeZonesData);
        setContacts(contactsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Không thể tải dữ liệu');
      }
    };
    fetchData();
  }, []);

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'landslide' | 'warning' | 'guide' | 'user' | 'safeZone' | 'contact'
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // --- HÀM MỞ MODAL ---
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
      if(type === 'user') form.setFieldsValue({ status: 'active', role: 'citizen' }); // Mặc định cho user mới
      if(type === 'landslide' && user?.role === 'officer') {
        form.setFieldsValue({ province: user.province, district: user.district });
      }
    }
  };

  // --- HÀM LƯU DỮ LIỆU (CHUNG) ---
  const handleSave = async (values) => {
    const isEditing = !!editingItem;

    try {
      // 1. Logic lưu USER
      if (modalType === 'user') {
        if (isEditing) {
          await userService.update(editingItem.id, values);
          const updated = await userService.getAll();
          setUsers(updated);
          // Nếu user đang đăng nhập được update, refresh user info
          if (editingItem.id === user?.id) {
            await refreshUser();
            message.success('Cập nhật tài khoản thành công! Vui lòng đăng nhập lại để áp dụng thay đổi.');
          } else {
            message.success('Cập nhật tài khoản thành công!');
          }
        } else {
          await userService.create(values);
          const updated = await userService.getAll();
          setUsers(updated);
          message.success('Tạo tài khoản mới thành công!');
        }
      }
      // 2. Logic lưu ĐIỂM SẠT LỞ
      else if (modalType === 'landslide') {
        if (isEditing) {
          await landslideService.update(editingItem.id, values);
          const updated = await landslideService.getAll();
          setLandslides(updated);
        } else {
          await landslideService.create(values);
          const updated = await landslideService.getAll();
          setLandslides(updated);
        }
        message.success('Lưu điểm sạt lở thành công!');
      } 
      // 3. Logic lưu CẢNH BÁO
      else if (modalType === 'warning') {
        if (isEditing) {
          await warningService.update(editingItem.id, values);
          const updated = await warningService.getAll();
          setWarnings(updated);
        } else {
          await warningService.create(values);
          const updated = await warningService.getAll();
          setWarnings(updated);
        }
        message.success('Lưu cảnh báo thành công!');
      }
      // 4. Logic lưu HƯỚNG DẪN
      else if (modalType === 'guide') {
        if (isEditing) {
          await safetyService.updateGuide(editingItem.id, values);
          const updated = await safetyService.getGuides();
          setGuides(updated);
        } else {
          await safetyService.createGuide(values);
          const updated = await safetyService.getGuides();
          setGuides(updated);
        }
        message.success('Lưu hướng dẫn thành công!');
      }
      // 5. Logic lưu KHU VỰC AN TOÀN
      else if (modalType === 'safeZone') {
        if (isEditing) {
          await safetyService.updateSafeZone(editingItem.id, values);
          const updated = await safetyService.getSafeZones();
          setSafeZones(updated);
        } else {
          await safetyService.createSafeZone(values);
          const updated = await safetyService.getSafeZones();
          setSafeZones(updated);
        }
        message.success('Lưu khu vực an toàn thành công!');
      }
      // 6. Logic lưu LIÊN HỆ KHẨN CẤP
      else if (modalType === 'contact') {
        if (isEditing) {
          await safetyService.updateContact(editingItem.id, values);
          const updated = await safetyService.getContacts();
          setContacts(updated);
        } else {
          await safetyService.createContact(values);
          const updated = await safetyService.getContacts();
          setContacts(updated);
        }
        message.success('Lưu liên hệ khẩn cấp thành công!');
      }

      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  // --- HÀM XÓA ---
  const handleDelete = async (type, id) => {
    try {
      if (type === 'landslide') {
        await landslideService.delete(id);
        const updated = await landslideService.getAll();
        setLandslides(updated);
      }
      if (type === 'warning') {
        await warningService.delete(id);
        const updated = await warningService.getAll();
        setWarnings(updated);
      }
      if (type === 'guide') {
        await safetyService.deleteGuide(id);
        const updated = await safetyService.getGuides();
        setGuides(updated);
      }
      if (type === 'user') {
        await userService.delete(id);
        const updated = await userService.getAll();
        setUsers(updated);
      }
      if (type === 'safeZone') {
        await safetyService.deleteSafeZone(id);
        const updated = await safetyService.getSafeZones();
        setSafeZones(updated);
      }
      if (type === 'contact') {
        await safetyService.deleteContact(id);
        const updated = await safetyService.getContacts();
        setContacts(updated);
      }
      message.success('Đã xóa thành công');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi xóa');
    }
  };

  // --- HÀM KHÓA/MỞ KHÓA TÀI KHOẢN ---
  const toggleUserLock = async (user) => {
    try {
      await userService.toggleLock(user.id);
      const updated = await userService.getAll();
      setUsers(updated);
      const newStatus = user.status === 'active' ? 'locked' : 'active';
      message.info(`Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản ${user.name}`);
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra');
    }
  };

  // ================= CẤU HÌNH CỘT BẢNG =================

  // 1. Cột USER (Mới)
  const userColumns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name', render: t => <b>{t}</b> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'CCCD', dataIndex: 'cccd', key: 'cccd', render: c => c || '-' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Xã/Phường', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', render: p => p || '-' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role', render: r => {
        let color = r==='admin'?'red':r==='officer'?'blue':'green';
        let label = r==='admin'?'Quản trị viên':r==='officer'?'Cán bộ':'Người dân';
        return <Tag color={color}>{label}</Tag>;
    }},
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => (
        <Tag color={s==='active'?'success':'default'} icon={s==='active'?null:<Lock size={12}/>}>
            {s==='active'?'Hoạt động':'Đã khóa'}
        </Tag>
    )},
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space>
        {/* Nút Sửa */}
        <Button size="small" icon={<Edit size={14}/>} onClick={() => openModal('user', r)} />
        
        {/* Nút Khóa/Mở khóa */}
        <Button 
            size="small" 
            icon={r.status==='active' ? <Lock size={14}/> : <Unlock size={14}/>} 
            danger={r.status==='active'} // Đỏ nếu đang active (để khóa), mặc định nếu đang locked
            onClick={() => toggleUserLock(r)} 
            title={r.status==='active' ? "Khóa tài khoản" : "Mở khóa"}
        />

        {/* Nút Xóa */}
        <Popconfirm title="Xóa tài khoản này?" onConfirm={() => handleDelete('user', r.id)}>
             <Button size="small" danger icon={<Trash2 size={14}/>} />
        </Popconfirm>
      </Space>
    )}
  ];

  // 2. Cột Điểm sạt lở (Cũ)
  const landslideColumns = [
    { title: 'Tên điểm', dataIndex: 'name', key: 'name' },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: t => <Tag color="geekblue">{t || '-'}</Tag> },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Xã/Phường', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'Mức độ', dataIndex: 'level', key: 'level', render: l => {
        let color;
        if (l === 5) color = 'default';
        else if (l === 4) color = 'red';
        else if (l === 3) color = 'orange';
        else if (l === 2) color = 'gold';
        else color = 'green';
        return <Tag color={color} style={l === 5 ? {backgroundColor: '#000', color: '#fff', border: 'none'} : {}}>{l}/5</Tag>;
      }},
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space><Button icon={<Edit size={14}/>} onClick={() => openModal('landslide', r)} /><Button danger icon={<Trash2 size={14}/>} onClick={() => handleDelete('landslide', r.id)} /></Space>
    )}
  ];

  // 3. Cột Cảnh báo
  const warningColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Xã/Phường', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'Mức độ', dataIndex: 'level', key: 'level', render: l => <Tag color={l==='urgent'?'red':'orange'}>{l}</Tag> },
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space><Button icon={<Edit size={14}/>} onClick={() => openModal('warning', r)} /><Button danger icon={<Trash2 size={14}/>} onClick={() => handleDelete('warning', r.id)} /></Space>
    )}
  ];

  // 4. Cột Hướng dẫn (Cũ)
  const guideColumns = [
    { title: 'Tên', dataIndex: 'title', key: 'title' },
    { title: 'Loại', dataIndex: 'category', key: 'category', render: c => <Tag color="blue">{c}</Tag> },
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space><Button icon={<Edit size={14}/>} onClick={() => openModal('guide', r)} /><Button danger icon={<Trash2 size={14}/>} onClick={() => handleDelete('guide', r.id)} /></Space>
    )}
  ];

  // 5. Cột Khu vực an toàn
  const safeZoneColumns = [
    { title: 'Tên khu vực', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Xã/Phường', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'Sức chứa', dataIndex: 'capacity', key: 'capacity', render: c => c || '-' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => <Tag color={s==='Sẵn sàng'?'green':'orange'}>{s || '-'}</Tag> },
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space><Button icon={<Edit size={14}/>} onClick={() => openModal('safeZone', r)} /><Button danger icon={<Trash2 size={14}/>} onClick={() => handleDelete('safeZone', r.id)} /></Space>
    )}
  ];

  // 6. Cột Liên hệ khẩn cấp
  const contactColumns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Xã/Phường', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space><Button icon={<Edit size={14}/>} onClick={() => openModal('contact', r)} /><Button danger icon={<Trash2 size={14}/>} onClick={() => handleDelete('contact', r.id)} /></Space>
    )}
  ];

  // --- THỐNG KÊ ĐIỂM SẠT LỞ ---
  const landslideStats = useMemo(() => {
    const total = landslides.length;
    const byType = {};
    const byProvince = {};
    const byLevel = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const byStatus = {};

    landslides.forEach(ls => {
      // Theo loại
      if (ls.type) {
        byType[ls.type] = (byType[ls.type] || 0) + 1;
      }
      // Theo tỉnh
      if (ls.province) {
        byProvince[ls.province] = (byProvince[ls.province] || 0) + 1;
      }
      // Theo mức độ
      if (ls.level) {
        byLevel[ls.level] = (byLevel[ls.level] || 0) + 1;
      }
      // Theo trạng thái
      if (ls.status) {
        byStatus[ls.status] = (byStatus[ls.status] || 0) + 1;
      }
    });

    return {
      total,
      byType: Object.entries(byType).map(([type, count]) => ({ type, count })),
      byProvince: Object.entries(byProvince).map(([province, count]) => ({ province, count })).sort((a, b) => b.count - a.count),
      byLevel,
      byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count }))
    };
  }, [landslides]);

  // --- THỐNG KÊ TÀI KHOẢN NGƯỜI DÙNG ---
  const userStats = useMemo(() => {
    const total = users.length;
    const byRole = {};
    const byStatus = {};
    const byProvince = {};

    users.forEach(u => {
      // Theo vai trò
      if (u.role) {
        byRole[u.role] = (byRole[u.role] || 0) + 1;
      }
      // Theo trạng thái
      if (u.status) {
        byStatus[u.status] = (byStatus[u.status] || 0) + 1;
      }
      // Theo tỉnh
      if (u.province) {
        byProvince[u.province] = (byProvince[u.province] || 0) + 1;
      }
    });

    return {
      total,
      byRole: Object.entries(byRole).map(([role, count]) => ({ 
        role, 
        count,
        label: role === 'admin' ? 'Quản trị viên' : role === 'officer' ? 'Cán bộ' : role === 'citizen' ? 'Người dân' : 'Khách'
      })),
      byStatus: Object.entries(byStatus).map(([status, count]) => ({ 
        status, 
        count,
        label: status === 'active' ? 'Hoạt động' : 'Đã khóa'
      })),
      byProvince: Object.entries(byProvince).map(([province, count]) => ({ province, count })).sort((a, b) => b.count - a.count)
    };
  }, [users]);

  return (
    <div className="bg-white p-6 rounded shadow-md h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Trung tâm quản trị hệ thống</h2>
      
      <Tabs defaultActiveKey="1" type="card">
        
        {/* TAB 1: QUẢN LÝ ĐIỂM SẠT LỞ */}
        <TabPane tab={<span><MapPin size={16} className="inline mr-1"/> Điểm sạt lở</span>} key="1">
          <Button type="primary" className="mb-4 bg-blue-600" icon={<Plus size={16}/>} onClick={() => openModal('landslide')}>Thêm điểm mới</Button>
          <Table columns={landslideColumns} dataSource={landslides} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        {/* TAB 2: QUẢN LÝ CẢNH BÁO */}
        <TabPane tab={<span><Bell size={16} className="inline mr-1"/> Cảnh báo mới</span>} key="2">
          <Button type="primary" className="mb-4 bg-red-600" icon={<Plus size={16}/>} onClick={() => openModal('warning')}>Tạo cảnh báo mới</Button>
          <Table columns={warningColumns} dataSource={warnings} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        {/* TAB 3: QUẢN LÝ THÔNG TIN AN TOÀN */}
        <TabPane tab={<span><BookOpen size={16} className="inline mr-1"/> Hướng dẫn an toàn</span>} key="3">
          <Button type="primary" className="mb-4 bg-green-600" icon={<Plus size={16}/>} onClick={() => openModal('guide')}>Thêm tài liệu</Button>
          <Table columns={guideColumns} dataSource={guides} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        {/* TAB 4: QUẢN LÝ TÀI KHOẢN (MỚI) */}
        <TabPane tab={<span><Users size={16} className="inline mr-1"/> Tài khoản người dùng</span>} key="4">
          <Button type="primary" className="mb-4 bg-purple-600" icon={<Plus size={16}/>} onClick={() => openModal('user')}>Tạo tài khoản mới</Button>
          <Table columns={userColumns} dataSource={users} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        {/* TAB 5: QUẢN LÝ KHU VỰC AN TOÀN */}
        <TabPane tab={<span><Shield size={16} className="inline mr-1"/> Khu vực an toàn</span>} key="5">
          <Button type="primary" className="mb-4 bg-cyan-600" icon={<Plus size={16}/>} onClick={() => openModal('safeZone')}>Thêm khu vực mới</Button>
          <Table columns={safeZoneColumns} dataSource={safeZones} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        {/* TAB 6: QUẢN LÝ LIÊN HỆ KHẨN CẤP */}
        <TabPane tab={<span><Phone size={16} className="inline mr-1"/> Liên hệ khẩn cấp</span>} key="6">
          <Button type="primary" className="mb-4 bg-orange-600" icon={<Plus size={16}/>} onClick={() => openModal('contact')}>Thêm liên hệ mới</Button>
          <Table columns={contactColumns} dataSource={contacts} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        {/* TAB 7: BÁO CÁO & THỐNG KÊ */}
        <TabPane tab={<span><BarChart3 size={16} className="inline mr-1"/> Báo cáo & Thống kê</span>} key="7">
          <div className="space-y-6">
            {/* THỐNG KÊ ĐIỂM SẠT LỞ */}
            <Card title="Thống kê Điểm sạt lở" className="shadow-sm">
              <Row gutter={16} className="mb-6">
                <Col span={6}>
                  <Statistic title="Tổng số điểm" value={landslideStats.total} />
                </Col>
                <Col span={6}>
                  <Statistic title="Mức độ cao (4-5)" value={landslideStats.byLevel[4] + landslideStats.byLevel[5]} />
                </Col>
                <Col span={6}>
                  <Statistic title="Mức độ trung bình (3)" value={landslideStats.byLevel[3]} />
                </Col>
                <Col span={6}>
                  <Statistic title="Mức độ thấp (1-2)" value={landslideStats.byLevel[1] + landslideStats.byLevel[2]} />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Biểu đồ theo loại sạt lở" size="small">
                    <div style={{ height: 300, padding: '10px 0' }}>
                      {landslideStats.byType.map((item, index) => {
                        const maxCount = Math.max(...landslideStats.byType.map(i => i.count), 1);
                        const percent = (item.count / maxCount) * 100;
                        return (
                          <div key={index} style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span>{item.type}</span>
                              <span style={{ fontWeight: 'bold' }}>{item.count}</span>
                            </div>
                            <Progress 
                              percent={percent} 
                              strokeColor={['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2', '#eb2f96'][index % 7]}
                              showInfo={false}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Biểu đồ theo mức độ" size="small">
                    <div style={{ height: 300, padding: '10px 0' }}>
                      {[
                        { level: 'Mức 1', count: landslideStats.byLevel[1], color: '#52c41a' },
                        { level: 'Mức 2', count: landslideStats.byLevel[2], color: '#fadb14' },
                        { level: 'Mức 3', count: landslideStats.byLevel[3], color: '#fa8c16' },
                        { level: 'Mức 4', count: landslideStats.byLevel[4], color: '#ff4d4f' },
                        { level: 'Mức 5', count: landslideStats.byLevel[5], color: '#000000' }
                      ].map((item, index) => {
                        const maxCount = Math.max(
                          landslideStats.byLevel[1],
                          landslideStats.byLevel[2],
                          landslideStats.byLevel[3],
                          landslideStats.byLevel[4],
                          landslideStats.byLevel[5],
                          1
                        );
                        const percent = (item.count / maxCount) * 100;
                        return (
                          <div key={index} style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span>{item.level}</span>
                              <span style={{ fontWeight: 'bold' }}>{item.count}</span>
                            </div>
                            <Progress 
                              percent={percent} 
                              strokeColor={item.color}
                              showInfo={false}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </Col>
              </Row>

              <Row gutter={16} className="mt-4">
                <Col span={12}>
                  <Card title="Biểu đồ tròn theo trạng thái" size="small">
                    <div style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
                        {landslideStats.byStatus.map((item, index) => {
                          const total = landslideStats.byStatus.reduce((sum, i) => sum + i.count, 0);
                          const percent = total > 0 ? (item.count / total) * 100 : 0;
                          const colors = ['#52c41a', '#faad14', '#ff4d4f', '#1890ff'];
                          return (
                            <div key={index} style={{ textAlign: 'center', minWidth: 100 }}>
                              <Progress
                                type="circle"
                                percent={percent}
                                strokeColor={colors[index % 4]}
                                format={() => `${item.count}`}
                                size={120}
                              />
                              <div style={{ marginTop: 8, fontWeight: 'bold' }}>{item.status}</div>
                              <div style={{ fontSize: 12, color: '#666' }}>{percent.toFixed(1)}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Top 10 tỉnh có nhiều điểm sạt lở nhất" size="small">
                    <div style={{ height: 300, padding: '10px 0', overflowY: 'auto' }}>
                      {landslideStats.byProvince.slice(0, 10).map((item, index) => {
                        const maxCount = Math.max(...landslideStats.byProvince.slice(0, 10).map(i => i.count), 1);
                        const percent = (item.count / maxCount) * 100;
                        return (
                          <div key={index} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 12 }}>{item.province}</span>
                              <span style={{ fontWeight: 'bold' }}>{item.count}</span>
                            </div>
                            <Progress 
                              percent={percent} 
                              strokeColor="#722ed1"
                              showInfo={false}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* THỐNG KÊ TÀI KHOẢN NGƯỜI DÙNG */}
            <Card title="Thống kê Tài khoản người dùng" className="shadow-sm">
              <Row gutter={16} className="mb-6">
                <Col span={6}>
                  <Statistic title="Tổng số tài khoản" value={userStats.total} />
                </Col>
                <Col span={6}>
                  <Statistic title="Đang hoạt động" value={userStats.byStatus.find(s => s.status === 'active')?.count || 0} />
                </Col>
                <Col span={6}>
                  <Statistic title="Đã khóa" value={userStats.byStatus.find(s => s.status === 'locked')?.count || 0} />
                </Col>
                <Col span={6}>
                  <Statistic title="Cán bộ" value={userStats.byRole.find(r => r.role === 'officer')?.count || 0} />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Biểu đồ tròn theo vai trò" size="small">
                    <div style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
                        {userStats.byRole.map((item, index) => {
                          const total = userStats.byRole.reduce((sum, i) => sum + i.count, 0);
                          const percent = total > 0 ? (item.count / total) * 100 : 0;
                          const colors = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f'];
                          return (
                            <div key={index} style={{ textAlign: 'center', minWidth: 100 }}>
                              <Progress
                                type="circle"
                                percent={percent}
                                strokeColor={colors[index % 4]}
                                format={() => `${item.count}`}
                                size={120}
                              />
                              <div style={{ marginTop: 8, fontWeight: 'bold' }}>{item.label}</div>
                              <div style={{ fontSize: 12, color: '#666' }}>{percent.toFixed(1)}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Biểu đồ cột theo trạng thái" size="small">
                    <div style={{ height: 300, padding: '10px 0' }}>
                      {userStats.byStatus.map((item, index) => {
                        const maxCount = Math.max(...userStats.byStatus.map(i => i.count), 1);
                        const percent = (item.count / maxCount) * 100;
                        const colors = ['#52c41a', '#ff4d4f'];
                        return (
                          <div key={index} style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span>{item.label}</span>
                              <span style={{ fontWeight: 'bold' }}>{item.count}</span>
                            </div>
                            <Progress 
                              percent={percent} 
                              strokeColor={colors[index % 2]}
                              showInfo={false}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </div>
        </TabPane>

      </Tabs>

      {/* ================= MODAL CHUNG ================= */}
      <Modal 
        title={editingItem ? "Chỉnh sửa thông tin" : "Thêm mới dữ liệu"} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          
          {/* FORM CHO USER (Mới) */}
          {modalType === 'user' && (
            <>
              <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
                <Input placeholder="example@email.com" />
              </Form.Item>
              {!editingItem && (
                 <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                   <Input.Password placeholder="Nhập mật khẩu..." />
                 </Form.Item>
              )}
              <Form.Item 
                name="cccd" 
                label="Căn cước công dân" 
                rules={[
                  { required: true, message: 'Vui lòng nhập số CCCD' },
                  { pattern: /^[0-9]{12}$/, message: 'CCCD phải có đúng 12 chữ số' }
                ]}
              >
                <Input placeholder="Nhập 12 chữ số CCCD" maxLength={12} />
              </Form.Item>
              <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}>
                <Select showSearch placeholder="Chọn Tỉnh/Thành phố" optionFilterProp="label" filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }>
                  {PROVINCES.map(p => <Select.Option key={p} value={p} label={p}>{p}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="district" label="Xã/Phường" rules={[{ required: true, message: 'Vui lòng nhập xã/phường' }]}>
                <Input placeholder="Ví dụ: Xã A" />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }]}>
                <Input placeholder="Nhập số điện thoại (không bắt buộc)" />
              </Form.Item>
              <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                <Select placeholder="Chọn vai trò">
                  <Select.Option value="citizen">Người dân</Select.Option>
                  <Select.Option value="officer">Cán bộ địa phương</Select.Option>
                  <Select.Option value="admin">Quản trị viên</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Select.Option value="active">Hoạt động</Select.Option>
                  <Select.Option value="locked">Đã khóa</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {/* FORM CHO ĐIỂM SẠT LỞ */}
          {modalType === 'landslide' && (
            <>
              <Form.Item name="name" label="Tên điểm" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="type" label="Loại sạt lở" rules={[{ required: true, message: 'Vui lòng chọn loại sạt lở' }]}>
                <Select placeholder="Chọn loại">
                  {LANDSLIDE_TYPES.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                <TextArea rows={3} placeholder="Mô tả tình trạng điểm sạt lở" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="lat" label="Vĩ độ" rules={[{ required: true, message: 'Vui lòng nhập vĩ độ' }]}>
                  <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item name="lng" label="Kinh độ" rules={[{ required: true, message: 'Vui lòng nhập kinh độ' }]}>
                  <InputNumber className="w-full" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}>
                  <Select 
                    showSearch 
                    placeholder="Chọn Tỉnh/Thành phố" 
                    optionFilterProp="label" 
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    disabled={user?.role === 'officer'}
                  >
                    {PROVINCES.map(p => <Select.Option key={p} value={p} label={p}>{p}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="district" label="Xã/Phường" rules={[{ required: true, message: 'Vui lòng nhập xã/phường' }]}>
                  <Input placeholder="Ví dụ: Xã A" disabled={user?.role === 'officer'} />
                </Form.Item>
              </div>
              <Form.Item name="level" label="Mức độ" rules={[{ required: true }]}>
                <InputNumber min={1} max={5} className="w-full" />
              </Form.Item>
            </>
          )}

          {/* FORM CHO CẢNH BÁO */}
          {modalType === 'warning' && (
            <>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <Input placeholder="Nhập tiêu đề cảnh báo" />
              </Form.Item>
              <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                <Input.TextArea rows={4} placeholder="Nhập nội dung cảnh báo chi tiết" />
              </Form.Item>
              <Form.Item name="level" label="Mức độ" rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}>
                <Select placeholder="Chọn mức độ">
                  <Select.Option value="urgent">Khẩn cấp</Select.Option>
                  <Select.Option value="warning">Cảnh báo</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="location" label="Vị trí">
                <Input placeholder="Ví dụ: Dốc Cun - Hòa Bình" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}>
                  <Select showSearch placeholder="Chọn Tỉnh/Thành phố" optionFilterProp="label">
                    {PROVINCES.map(p => <Select.Option key={p} value={p} label={p}>{p}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="district" label="Xã/Phường">
                  <Input placeholder="Ví dụ: Xã A" />
                </Form.Item>
              </div>
            </>
          )}

          {/* FORM CHO HƯỚNG DẪN */}
          {modalType === 'guide' && (
            <>
              <Form.Item name="title" label="Tên bài" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="category" label="Danh mục"><Select><Select.Option value="Kỹ năng">Kỹ năng</Select.Option><Select.Option value="Tài liệu">Tài liệu</Select.Option></Select></Form.Item>
              <Form.Item name="content" label="Nội dung"><Input.TextArea /></Form.Item>
            </>
          )}

          {/* FORM CHO KHU VỰC AN TOÀN */}
          {modalType === 'safeZone' && (
            <>
              <Form.Item name="name" label="Tên khu vực" rules={[{ required: true, message: 'Vui lòng nhập tên khu vực' }]}>
                <Input placeholder="Ví dụ: Trường THPT Hòa Bình" />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                <Input placeholder="Ví dụ: Số 10, Đường Lê Lợi, TP. Hòa Bình" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh/Thành phố">
                  <Select showSearch placeholder="Chọn Tỉnh/Thành phố" optionFilterProp="label">
                    {PROVINCES.map(p => <Select.Option key={p} value={p} label={p}>{p}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="district" label="Xã/Phường">
                  <Input placeholder="Ví dụ: Xã A" />
                </Form.Item>
              </div>
              <Form.Item name="capacity" label="Sức chứa">
                <Input placeholder="Ví dụ: 500 người" />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái">
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="Sẵn sàng">Sẵn sàng</Select.Option>
                  <Select.Option value="Đang sửa chữa">Đang sửa chữa</Select.Option>
                  <Select.Option value="Tạm đóng">Tạm đóng</Select.Option>
                </Select>
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="lat" label="Vĩ độ">
                  <InputNumber className="w-full" placeholder="Ví dụ: 20.8133" />
                </Form.Item>
                <Form.Item name="lng" label="Kinh độ">
                  <InputNumber className="w-full" placeholder="Ví dụ: 105.3383" />
                </Form.Item>
              </div>
            </>
          )}

          {/* FORM CHO LIÊN HỆ KHẨN CẤP */}
          {modalType === 'contact' && (
            <>
              <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input placeholder="Ví dụ: Cứu hộ cứu nạn tỉnh" />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                <Input placeholder="Ví dụ: 114 hoặc 0218 385 1234" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh/Thành phố">
                  <Select showSearch placeholder="Chọn Tỉnh/Thành phố" optionFilterProp="label">
                    {PROVINCES.map(p => <Select.Option key={p} value={p} label={p}>{p}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="district" label="Xã/Phường">
                  <Input placeholder="Ví dụ: Xã A" />
                </Form.Item>
              </div>
            </>
          )}

          <Button type="primary" htmlType="submit" className="w-full mt-2">
            {editingItem ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;