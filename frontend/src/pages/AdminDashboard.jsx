import React, { useState, useEffect, useMemo } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, message, Tabs, Popconfirm, Card, Row, Col, Statistic, Progress } from 'antd';
import { Edit, Trash2, Plus, MapPin, Bell, BookOpen, Users, Lock, Unlock, Shield, Phone, BarChart3, AlertTriangle, UserPlus } from 'lucide-react';
import { warningService } from '../services/warningService';
import { safetyService } from '../services/safetyService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const { TabPane } = Tabs;
const { TextArea } = Input;

const PROVINCES = [
  'An Giang', 'Bắc Ninh', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng',
  'Đắk Lắk', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Nội',
  'Hà Tĩnh', 'Hải Phòng', 'Huế', 'Hưng Yên', 'Khánh Hòa', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Nghệ An', 'Ninh Bình', 'Phú Thọ',
  'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sơn La', 'Tây Ninh',
  'Thái Nguyên', 'Thanh Hóa', 'TP Hồ Chí Minh', 'Tuyên Quang', 'Vĩnh Long'
];

const AdminDashboard = () => {
  const { user, refreshUser } = useAuth();

  const [warnings, setWarnings] = useState([]);
  const [guides, setGuides] = useState([]);
  const [users, setUsers] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [userFilterProvince, setUserFilterProvince] = useState('');
  const [userFilterAddress, setUserFilterAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [warningsData, guidesData, usersData, safeZonesData, contactsData] = await Promise.all([
        warningService.getAll(),
        safetyService.getGuides(),
        userService.getAll(),
        safetyService.getSafeZones(),
        safetyService.getContacts()
      ]);
      setWarnings(warningsData);
      setGuides(guidesData);
      setUsers(usersData);
      setSafeZones(safeZonesData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (u.role === 'citizen') return false;

      const matchProvince = !userFilterProvince || u.province === userFilterProvince;
      const matchAddress = !userFilterAddress ||
        (u.district && u.district.toLowerCase().includes(userFilterAddress.toLowerCase()));

      return matchProvince && matchAddress;
    });
  }, [users, userFilterProvince, userFilterAddress]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
      if (type === 'user') form.setFieldsValue({ status: 'active', role: 'officer' });
    }
  };

  const handleSave = async (values) => {
    const isEditing = !!editingItem;
    try {
      if (modalType === 'user') {
        if (isEditing) {
          await userService.update(editingItem.id, values);
          if (editingItem.id === user?.id) {
            await refreshUser();
            message.success('Cập nhật tài khoản thành công! Vui lòng đăng nhập lại để áp dụng thay đổi.');
          } else {
            message.success('Cập nhật tài khoản thành công!');
          }
        } else {
          await userService.create(values);
          message.success('Tạo tài khoản mới thành công!');
        }
        const updated = await userService.getAll();
        setUsers(updated);
      }
      else if (modalType === 'warning') {
        if (isEditing) await warningService.update(editingItem.id, values);
        else await warningService.create(values);
        setWarnings(await warningService.getAll());
        message.success('Lưu cảnh báo thành công!');
        window.dispatchEvent(new Event('warningDataUpdated'));
      }
      else if (modalType === 'guide') {
        if (isEditing) await safetyService.updateGuide(editingItem.id, values);
        else await safetyService.createGuide(values);
        setGuides(await safetyService.getGuides());
        message.success('Lưu hướng dẫn thành công!');
      }
      else if (modalType === 'safeZone') {
        if (isEditing) await safetyService.updateSafeZone(editingItem.id, values);
        else await safetyService.createSafeZone(values);
        setSafeZones(await safetyService.getSafeZones());
        message.success('Lưu khu vực an toàn thành công!');
      }
      else if (modalType === 'contact') {
        if (isEditing) await safetyService.updateContact(editingItem.id, values);
        else await safetyService.createContact(values);
        setContacts(await safetyService.getContacts());
        message.success('Lưu liên hệ khẩn cấp thành công!');
      }

      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'warning') {
        await warningService.delete(id);
        setWarnings(await warningService.getAll());
        window.dispatchEvent(new Event('warningDataUpdated'));
      }
      if (type === 'guide') {
        await safetyService.deleteGuide(id);
        setGuides(await safetyService.getGuides());
      }
      if (type === 'user') {
        await userService.delete(id);
        setUsers(await userService.getAll());
      }
      if (type === 'safeZone') {
        await safetyService.deleteSafeZone(id);
        setSafeZones(await safetyService.getSafeZones());
      }
      if (type === 'contact') {
        await safetyService.deleteContact(id);
        setContacts(await safetyService.getContacts());
      }
      message.success('Đã xóa thành công');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi xóa');
    }
  };

  const toggleUserLock = async (u) => {
    try {
      await userService.toggleLock(u.id);
      setUsers(await userService.getAll());
      message.info(`Đã ${u.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản ${u.name}`);
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const userColumns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name', render: t => <b>{t}</b> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Địa chỉ', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', render: p => p || '-' },
    {
      title: 'Vai trò', dataIndex: 'role', key: 'role', render: r => {
        let color = r === 'admin' ? 'red' : r === 'coordinator' ? 'purple' : r === 'officer' ? 'blue' : 'green';
        let label = r === 'admin' ? 'Quản trị viên' : r === 'coordinator' ? 'Điều phối viên' : r === 'officer' ? 'Đội cứu hộ' : r;
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => (
        <Tag color={s === 'active' ? 'success' : 'default'} icon={s === 'active' ? null : <Lock size={12} />}>
          {s === 'active' ? 'Hoạt động' : 'Đã khóa'}
        </Tag>
      )
    },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Space>
          <Button size="small" icon={<Edit size={14} />} onClick={() => openModal('user', r)} />
          <Popconfirm
            title={r.status === 'active' ? "Khóa tài khoản này?" : "Mở khóa tài khoản này?"}
            description={r.status === 'active' ? "Người dùng này sẽ không thể đăng nhập vào hệ thống." : "Người dùng này sẽ có thể đăng nhập trở lại."}
            onConfirm={() => toggleUserLock(r)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button
              size="small"
              icon={r.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
              danger={r.status === 'active'}
              title={r.status === 'active' ? "Khóa tài khoản" : "Mở khóa"}
            />
          </Popconfirm>
          <Popconfirm
            title="Xóa tài khoản này?"
            description="Hành động này không thể hoàn tác. Mọi dữ liệu liên quan đến người dùng này sẽ bị xóa."
            onConfirm={() => handleDelete('user', r.id)}
            okText="Xác nhận xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const warningColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Địa chỉ', dataIndex: 'district', key: 'district', render: d => d || '-' },
    {
      title: 'Mức độ', dataIndex: 'level', key: 'level', render: l => {
        const levels = {
          'urgent': { label: 'Khẩn cấp', color: 'red' },
          'warning': { label: 'Cảnh báo', color: 'orange' },
          'info': { label: 'Thông tin', color: 'blue' },
          'Khẩn cấp': { label: 'Khẩn cấp', color: 'red' },
          'Cảnh báo': { label: 'Cảnh báo', color: 'orange' }
        };
        const cfg = levels[l] || { label: l, color: 'default' };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      }
    },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Space>
          <Button icon={<Edit size={14} />} onClick={() => openModal('warning', r)} />
          <Popconfirm
            title="Xóa cảnh báo này?"
            description="Hành động này không thể hoàn tác. Bản tin cảnh báo sẽ bị gỡ bỏ."
            onConfirm={() => handleDelete('warning', r.id)}
            okText="Xác nhận xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const guideColumns = [
    { title: 'Tên', dataIndex: 'title', key: 'title' },
    { title: 'Loại', dataIndex: 'category', key: 'category', render: c => <Tag color="blue">{c}</Tag> },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Space>
          <Button icon={<Edit size={14} />} onClick={() => openModal('guide', r)} />
          <Popconfirm
            title="Xóa hướng dẫn này?"
            description="Hành động này không thể hoàn tác. Tài liệu hướng dẫn sẽ bị xóa."
            onConfirm={() => handleDelete('guide', r.id)}
            okText="Xác nhận xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const safeZoneColumns = [
    { title: 'Tên khu vực', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Phường/Xã', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'Sức chứa', dataIndex: 'capacity', key: 'capacity', render: c => c || '-' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => <Tag color={s === 'Sẵn sàng' ? 'green' : 'orange'}>{s || '-'}</Tag> },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Space>
          <Button icon={<Edit size={14} />} onClick={() => openModal('safeZone', r)} />
          <Popconfirm
            title="Xóa khu vực an toàn này?"
            description="Hành động này không thể hoàn tác. Thông tin điểm an toàn sẽ bị xóa."
            onConfirm={() => handleDelete('safeZone', r.id)}
            okText="Xác nhận xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const contactColumns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Địa chỉ', dataIndex: 'district', key: 'district', render: d => d || '-' },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Space>
          <Button icon={<Edit size={14} />} onClick={() => openModal('contact', r)} />
          <Popconfirm
            title="Xóa liên hệ khẩn cấp này?"
            description="Hành động này không thể hoàn tác. Số điện thoại này sẽ bị xóa khỏi danh sách."
            onConfirm={() => handleDelete('contact', r.id)}
            okText="Xác nhận xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const userStats = useMemo(() => {
    const total = users.length;
    let active = 0, locked = 0, admin = 0, officer = 0, coordinator = 0;

    users.forEach(u => {
      if (u.status === 'active') active++; else locked++;
      if (u.role === 'admin') admin++;
      else if (u.role === 'coordinator') coordinator++;
      else if (u.role === 'officer') officer++;
    });

    return { total, active, locked, admin, officer, coordinator };
  }, [users]);

  const officerList = users.filter(u => u.role === 'officer' && u.status === 'active');

  return (
    <div className="bg-gray-50 p-6 shadow-inner h-full overflow-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 uppercase tracking-wide">Trung tâm Quản trị hệ thống</h2>

      <Tabs defaultActiveKey="1" type="card">

        { }

        { }
        <TabPane tab={<span><Users size={16} className="inline mr-1" /> Tài khoản</span>} key="2">
          <Card size="small" className="shadow-sm border-t-4 border-t-purple-500 mb-4">
            <Row gutter={16} justify="start">
              <Col span={6} md={3}><Statistic title={<span className="text-xs">Đội cứu hộ</span>} value={userStats.officer} valueStyle={{ fontSize: '20px' }} /></Col>
              <Col span={6} md={3}><Statistic title={<span className="text-xs">Điều phối viên</span>} value={userStats.coordinator} valueStyle={{ fontSize: '20px' }} /></Col>
              <Col span={6} md={3}><Statistic title={<span className="text-xs">Quản trị viên</span>} value={userStats.admin} valueStyle={{ fontSize: '20px' }} /></Col>
              <Col span={6} md={3}><Statistic title={<span className="text-xs">Bị khóa</span>} value={userStats.locked} valueStyle={{ fontSize: '20px', color: '#cf1322' }} /></Col>
            </Row>
          </Card>
          <div className="flex gap-4 mb-4 items-center flex-wrap">
            <Button type="primary" className="bg-purple-600" icon={<Plus size={16} />} onClick={() => openModal('user')}>Tạo tài khoản mới</Button>
            <Select
              showSearch
              optionFilterProp="children"
              style={{ width: 200 }}
              placeholder="Lọc theo tỉnh..."
              allowClear
              value={userFilterProvince || undefined}
              onChange={setUserFilterProvince}
            >
              {PROVINCES.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}
            </Select>
            <Input
              style={{ width: 250 }}
              placeholder="Lọc theo địa chỉ..."
              allowClear
              value={userFilterAddress}
              onChange={e => setUserFilterAddress(e.target.value)}
            />
          </div>
          <Table columns={userColumns} dataSource={filteredUsers} rowKey="id" pagination={{ pageSize: 10 }} />
        </TabPane>

        { }
        <TabPane tab={<span><Bell size={16} className="inline mr-1" /> Cảnh báo</span>} key="4">
          <Button type="primary" className="mb-4 bg-red-600" icon={<Plus size={16} />} onClick={() => openModal('warning')}>Tạo cảnh báo mới</Button>
          <Table columns={warningColumns} dataSource={warnings} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        { }
        <TabPane tab={<span><Shield size={16} className="inline mr-1" /> Khu vực an toàn</span>} key="5">
          <Button type="primary" className="mb-4 bg-cyan-600" icon={<Plus size={16} />} onClick={() => openModal('safeZone')}>Thêm khu vực mới</Button>
          <Table columns={safeZoneColumns} dataSource={safeZones} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        { }
        <TabPane tab={<span><Phone size={16} className="inline mr-1" /> Liên hệ khẩn cấp</span>} key="6">
          <Button type="primary" className="mb-4 bg-orange-600" icon={<Plus size={16} />} onClick={() => openModal('contact')}>Thêm liên hệ mới</Button>
          <Table columns={contactColumns} dataSource={contacts} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        { }
        <TabPane tab={<span><BookOpen size={16} className="inline mr-1" /> Hướng dẫn</span>} key="7">
          <Button type="primary" className="mb-4 bg-green-600" icon={<Plus size={16} />} onClick={() => openModal('guide')}>Thêm tài liệu</Button>
          <Table columns={guideColumns} dataSource={guides} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>


      </Tabs>

      { }
      <Modal
        title={
          modalType === 'rescue' ? "Cập nhật / Điều phối Cứu hộ" :
            editingItem ? "Chỉnh sửa thông tin" : "Thêm mới dữ liệu"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={modalType === 'rescue' ? 600 : 500}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>

          { }

          { }
          {modalType === 'user' && (
            <>
              <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}><Input /></Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email' }]}><Input /></Form.Item>
              {!editingItem && (
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}><Input.Password /></Form.Item>
              )}
              <Form.Item name="province" label="Tỉnh/Thành phố"><Select showSearch>{PROVINCES.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}</Select></Form.Item>
              <Form.Item name="district" label="Địa chỉ"><Input /></Form.Item>
              <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
              <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                <Select>
                  <Select.Option value="officer">Đội cứu hộ</Select.Option>
                  <Select.Option value="coordinator">Điều phối viên</Select.Option>
                  <Select.Option value="admin">Quản trị viên</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="status" label="Trạng thái">
                <Select><Select.Option value="active">Hoạt động</Select.Option><Select.Option value="locked">Đã khóa</Select.Option></Select>
              </Form.Item>
            </>
          )}

          {modalType === 'warning' && (
            <>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng điền tiêu đề' }]}><Input /></Form.Item>
              <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng điền nội dung' }]}><TextArea rows={3} /></Form.Item>
              <Form.Item name="level" label="Mức độ" initialValue="warning">
                <Select>
                  <Select.Option value="urgent">Khẩn cấp (Urgent)</Select.Option>
                  <Select.Option value="warning">Cảnh báo (Warning)</Select.Option>
                  <Select.Option value="info">Thông tin (Info)</Select.Option>
                </Select>
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố' }]}>
                  <Select showSearch>
                    {PROVINCES.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="district" label="Địa chỉ"><Input /></Form.Item>
              </div>
            </>
          )}
          {modalType === 'guide' && (
            <>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}><Input /></Form.Item>
              <Form.Item name="category" label="Thể loại"><Select><Select.Option value="Kỹ năng">Kỹ năng</Select.Option><Select.Option value="Tài liệu">Tài liệu</Select.Option></Select></Form.Item>
              <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}><TextArea rows={4} /></Form.Item>
            </>
          )}

          {modalType === 'safeZone' && (
            <>
              <Form.Item name="name" label="Tên khu vực" rules={[{ required: true, message: 'Vui lòng nhập tên khu vực' }]}><Input /></Form.Item>
              <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}><Input /></Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh"><Select showSearch>{PROVINCES.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}</Select></Form.Item>
                <Form.Item name="district" label="Phường/Xã"><Input /></Form.Item>
              </div>
              <Form.Item name="capacity" label="Sức chứa"><Input /></Form.Item>
              <Form.Item name="status" label="Trạng thái"><Select><Select.Option value="Sẵn sàng">Sẵn sàng</Select.Option><Select.Option value="Tạm đóng">Tạm đóng</Select.Option></Select></Form.Item>
            </>
          )}

          {modalType === 'contact' && (
            <>
              <Form.Item name="name" label="Tên liên hệ" rules={[{ required: true, message: 'Vui lòng nhập tên liên hệ' }]}><Input /></Form.Item>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập sđt' }]}><Input /></Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh"><Select showSearch>{PROVINCES.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}</Select></Form.Item>
                <Form.Item name="district" label="Địa chỉ"><Input /></Form.Item>
              </div>
            </>
          )}

          <Button type="primary" htmlType="submit" className="w-full mt-4">
            {editingItem ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
