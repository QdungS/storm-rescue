import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, message, Tabs, Popconfirm } from 'antd';
import { Edit, Trash2, Plus, MapPin, Bell, BookOpen, Users, Lock, Unlock } from 'lucide-react';
import { MOCK_LANDSLIDES, MOCK_WARNINGS, MOCK_SAFETY_INFO, MOCK_USERS_LIST } from '../mockData';

const { TabPane } = Tabs;

const AdminDashboard = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [landslides, setLandslides] = useState(MOCK_LANDSLIDES || []);
  const [warnings, setWarnings] = useState(MOCK_WARNINGS || []);
  const [guides, setGuides] = useState(MOCK_SAFETY_INFO?.guides || []);
  const [users, setUsers] = useState(MOCK_USERS_LIST || []); // <--- STATE MỚI CHO USER

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'landslide' | 'warning' | 'guide' | 'user'
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
    }
  };

  // --- HÀM LƯU DỮ LIỆU (CHUNG) ---
  const handleSave = (values) => {
    const isEditing = !!editingItem;
    const timestamp = new Date().toISOString().split('T')[0];

    // 1. Logic lưu USER
    if (modalType === 'user') {
      if (isEditing) {
        setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...values } : u));
        message.success('Cập nhật tài khoản thành công!');
      } else {
        // Giả lập ID mới và mật khẩu mặc định
        setUsers([...users, { id: Date.now(), ...values }]);
        message.success('Tạo tài khoản mới thành công! Mật khẩu mặc định: 123456');
      }
    }
    // 2. Logic lưu ĐIỂM SẠT LỞ
    else if (modalType === 'landslide') {
      if (isEditing) {
        setLandslides(landslides.map(item => item.id === editingItem.id ? { ...item, ...values } : item));
      } else {
        setLandslides([...landslides, { id: Date.now(), ...values, updatedAt: timestamp }]);
      }
      message.success('Lưu điểm sạt lở thành công!');
    } 
    // 3. Logic lưu CẢNH BÁO
    else if (modalType === 'warning') {
      if (isEditing) {
        setWarnings(warnings.map(item => item.id === editingItem.id ? { ...item, ...values } : item));
      } else {
        setWarnings([...warnings, { id: Date.now(), ...values, timestamp: 'Vừa xong' }]);
      }
      message.success('Lưu cảnh báo thành công!');
    }
    // 4. Logic lưu HƯỚNG DẪN
    else if (modalType === 'guide') {
      if (isEditing) {
        setGuides(guides.map(item => item.id === editingItem.id ? { ...item, ...values } : item));
      } else {
        setGuides([...guides, { id: Date.now(), ...values, updatedAt: timestamp }]);
      }
      message.success('Lưu hướng dẫn thành công!');
    }

    setIsModalOpen(false);
  };

  // --- HÀM XÓA ---
  const handleDelete = (type, id) => {
    if (type === 'landslide') setLandslides(landslides.filter(i => i.id !== id));
    if (type === 'warning') setWarnings(warnings.filter(i => i.id !== id));
    if (type === 'guide') setGuides(guides.filter(i => i.id !== id));
    if (type === 'user') setUsers(users.filter(i => i.id !== id));
    message.success('Đã xóa thành công');
  };

  // --- HÀM KHÓA/MỞ KHÓA TÀI KHOẢN ---
  const toggleUserLock = (user) => {
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    message.info(`Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản ${user.name}`);
  };

  // ================= CẤU HÌNH CỘT BẢNG =================

  // 1. Cột USER (Mới)
  const userColumns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name', render: t => <b>{t}</b> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
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
    { title: 'Mức độ', dataIndex: 'level', key: 'level', render: l => <Tag color={l>=4?'red':l===3?'orange':'green'}>{l}/5</Tag> },
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space><Button icon={<Edit size={14}/>} onClick={() => openModal('landslide', r)} /><Button danger icon={<Trash2 size={14}/>} onClick={() => handleDelete('landslide', r.id)} /></Space>
    )}
  ];

  // 3. Cột Cảnh báo (Cũ)
  const warningColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
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
              <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
              {!editingItem && (
                 <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}><Input.Password placeholder="Nhập mật khẩu..." /></Form.Item>
              )}
              <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                <Select>
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
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="lat" label="Vĩ độ"><InputNumber className="w-full" /></Form.Item>
                <Form.Item name="lng" label="Kinh độ"><InputNumber className="w-full" /></Form.Item>
              </div>
              <Form.Item name="level" label="Mức độ"><InputNumber min={1} max={5}/></Form.Item>
            </>
          )}

          {/* FORM CHO CẢNH BÁO */}
          {modalType === 'warning' && (
            <>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="content" label="Nội dung"><Input.TextArea /></Form.Item>
              <Form.Item name="level" label="Mức độ"><Select><Select.Option value="urgent">Khẩn cấp</Select.Option><Select.Option value="warning">Cảnh báo</Select.Option></Select></Form.Item>
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

          <Button type="primary" htmlType="submit" className="w-full mt-2">
            {editingItem ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;