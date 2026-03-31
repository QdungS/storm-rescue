import React, { useState, useEffect, useMemo } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, message, Tabs, Popconfirm, Card, Row, Col, Statistic, Progress } from 'antd';
import { Edit, Trash2, Plus, MapPin, Bell, BookOpen, Users, Lock, Unlock, Shield, Phone, BarChart3, AlertTriangle, UserPlus, CheckCircle } from 'lucide-react';
import { rescueService } from '../services/rescueService';
import { warningService } from '../services/warningService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const { TabPane } = Tabs;
const { TextArea } = Input;

const DATA_SOURCES = [
  { label: 'Người dân gửi trực tiếp', value: 'user', color: 'blue' },
  { label: 'Mạng xã hội (Social)', value: 'social', color: 'purple' },
  { label: 'Báo chí & Tin tức', value: 'news', color: 'orange' }
];

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

const CoordinatorDashboard = () => {
  const { user, refreshUser } = useAuth();

  const [rescueRequests, setRescueRequests] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rescuesData, warningsData, usersData] = await Promise.all([
        rescueService.getAll(),
        warningService.getAll(),
        userService.getAll()
      ]);
      setRescueRequests(rescuesData);
      setWarnings(warningsData);
      setUsers(usersData);
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

  const [filterProvince, setFilterProvince] = useState(null);
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [historyFilterAddress, setHistoryFilterAddress] = useState('');

  const filteredRescueRequests = useMemo(() => {
    return rescueRequests.filter(req => {
      const matchProv = filterProvince ? req.province === filterProvince : true;
      const matchDist = filterDistrict ? (req.district || '').toLowerCase().includes(filterDistrict.toLowerCase()) : true;
      const matchStat = filterStatus ? req.status === filterStatus : true;
      return matchProv && matchDist && matchStat;
    });
  }, [rescueRequests, filterProvince, filterDistrict, filterStatus]);

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
      if (type === 'warning' && user?.role === 'coordinator') {
        form.setFieldsValue({ province: user.province });
      }
    }
  };

  const handleSave = async (values) => {
    const isEditing = !!editingItem;
    try {
      if (modalType === 'rescue') {
        const payload = {
          status: values.status,
          notes: values.notes,
          priority: values.priority
        };

        if (values.assignedTo) {
          payload.assignedTo = values.assignedTo;
        }
        await rescueService.updateRequest(editingItem.id, payload);
        message.success('Cập nhật Yêu cầu cứu hộ thành công!');
        fetchData();
        window.dispatchEvent(new Event('rescueDataUpdated'));
      }
      else if (modalType === 'warning') {
        if (isEditing) await warningService.update(editingItem.id, values);
        else await warningService.create(values);
        setWarnings(await warningService.getAll());
        message.success('Lưu cảnh báo thành công!');
        window.dispatchEvent(new Event('warningDataUpdated'));
      }

      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'rescue') {
        await rescueService.deleteRequest(id);
        fetchData();
        window.dispatchEvent(new Event('rescueDataUpdated'));
      }
      if (type === 'warning') {
        await warningService.delete(id);
        setWarnings(await warningService.getAll());
        window.dispatchEvent(new Event('warningDataUpdated'));
      }
      message.success('Đã xóa thành công');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi xóa');
    }
  };

  const toggleUserLock = async (u) => {

  };

  const rescueColumns = [
    {
      title: 'Nguồn', dataIndex: 'source', key: 'source', width: 100, render: s => {
        const src = DATA_SOURCES.find(ds => ds.value === s) || DATA_SOURCES[0];
        return <Tag color={src.color}>{src.label.split(' ')[0]}</Tag>;
      }
    },
    { title: 'Tỉnh/TP', dataIndex: 'province', key: 'province' },
    { title: 'Địa chỉ', dataIndex: 'district', key: 'district' },
    { title: 'Người liên hệ', key: 'contact', render: (_, r) => <div><b>{r.contactName}</b><br />{r.contactPhone}</div> },
    {
      title: 'Mức độ', dataIndex: 'priority', key: 'priority', render: p => {
        let color = p === 'Rất khẩn cấp' ? 'red' : p === 'Khẩn cấp' ? 'orange' : 'blue';
        return <Tag color={color}>{p}</Tag>;
      }
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => (
        <Tag color={s === 'Đã được cứu' ? 'green' : s === 'Từ chối' ? 'red' : s === 'Đang xử lý' ? 'blue' : 'orange'}>{s}</Tag>
      )
    },
    {
      title: 'Trùng lặp', key: 'priority', render: (_, r) => (
        <Space direction="vertical" size={0}>
          {r.isDuplicate && <Tag color="default" className="text-[9px]">TRÙNG LẶP</Tag>}
        </Space>
      )
    },
    {
      title: 'Đội cứu hộ', dataIndex: 'assignedTo', key: 'assignedTo', render: a => {
        if (!a) return <span className="text-gray-400 italic">Chưa giao</span>;
        const officer = users.find(u => u.id === a);
        return <Tag color="purple">{officer ? officer.name : a}</Tag>;
      }
    },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Space>
          <Button size="small" type="primary" icon={<UserPlus size={14} />} onClick={() => openModal('rescue', r)}>Giao đội</Button>
          <Popconfirm title="Xóa yêu cầu cứu hộ này?" onConfirm={() => handleDelete('rescue', r.id)}>
            <Button size="small" danger icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const warningColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: '25%' },
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
          <Popconfirm title="Xóa cảnh báo này?" description="Hành động này không thể hoàn tác." onConfirm={() => handleDelete('warning', r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button danger icon={<Trash2 size={14} />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const historyColumns = [
    { title: 'Người liên hệ', key: 'contact', render: (_, r) => <div><b>{r.contactName}</b><br />{r.contactPhone}</div> },
    { title: 'Địa Chỉ', key: 'location', render: (_, r) => <div>{r.district}, {r.province}</div> },
    {
      title: 'Đội cứu hộ', dataIndex: 'assignedTo', key: 'assignedTo', render: a => {
        if (!a) return <span className="text-gray-400 italic">Chưa xác định</span>;
        const officer = users.find(u => u.id === a);
        return <Tag color="green">{officer ? officer.name : a}</Tag>;
      }
    },
    { title: 'Hoàn tất lúc', dataIndex: 'updatedAt', key: 'updatedAt', render: d => new Date(d).toLocaleString() },
  ];

  const historyRequests = useMemo(() => {
    return rescueRequests
      .filter(r => r.status === 'Đã được cứu' || r.status === 'Hoàn tất')
      .filter(r => {
        if (!historyFilterAddress) return true;
        const address = `${r.district || ''} ${r.province || ''}`.toLowerCase();
        return address.includes(historyFilterAddress.toLowerCase());
      });
  }, [rescueRequests, historyFilterAddress]);

  const rescueStats = useMemo(() => {
    const total = rescueRequests.length;
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let rejected = 0;
    let trappedCount = 0;
    let duplicateCount = 0;
    const sourceStats = { user: 0, social: 0, news: 0 };

    rescueRequests.forEach(r => {
      if (r.status === 'Chờ tiếp nhận') pending++;
      else if (r.status === 'Đang xử lý') inProgress++;
      else if (r.status === 'Đã được cứu') completed++;
      else if (r.status === 'Từ chối') rejected++;

      if (r.isDuplicate) duplicateCount++;
      if (sourceStats[r.source] !== undefined) sourceStats[r.source]++;
    });

    return { total, pending, inProgress, completed, rejected, duplicateCount, sourceStats };
  }, [rescueRequests]);

  const officerList = users.filter(u => u.role === 'officer' && u.status === 'active');

  return (
    <div className="bg-gray-50 p-6 shadow-inner h-full overflow-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 uppercase tracking-wide">Trung tâm Điều phối & Quản trị</h2>

      <Tabs defaultActiveKey="1" type="card">

        { }
        <TabPane tab={<span><AlertTriangle size={16} className="inline mr-1 text-red-500" /> Quản lý Yêu cầu Cứu hộ</span>} key="1">
          <div className="mb-4 flex flex-col md:flex-row gap-4 bg-white p-4 rounded shadow-sm border border-gray-200">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 font-semibold">Lọc theo Địa chỉ</label>
              <Input
                placeholder="Nhập tên khu vực..."
                value={filterDistrict}
                onChange={e => setFilterDistrict(e.target.value)}
                allowClear
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 font-semibold">Trạng thái</label>
              <Select
                allowClear
                placeholder="Tất cả trạng thái"
                className="w-full"
                value={filterStatus}
                onChange={setFilterStatus}
              >
                <Select.Option value="Chờ tiếp nhận">Chờ tiếp nhận</Select.Option>
                <Select.Option value="Đang xử lý">Đang xử lý</Select.Option>
                <Select.Option value="Đã được cứu">Đã được cứu</Select.Option>
                <Select.Option value="Từ chối">Từ chối</Select.Option>
              </Select>
            </div>
          </div>
          <Table columns={rescueColumns} dataSource={filteredRescueRequests} rowKey="id" loading={loading} pagination={{ pageSize: 15 }} />
        </TabPane>

        { }
        <TabPane tab={<span><Bell size={16} className="inline mr-1" /> Cảnh báo</span>} key="4">
          <Button type="primary" className="mb-4 bg-red-600" icon={<Plus size={16} />} onClick={() => openModal('warning')}>Tạo cảnh báo mới</Button>
          <Table columns={warningColumns} dataSource={warnings} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        { }
        <TabPane tab={<span><BarChart3 size={16} className="inline mr-1" /> Thống kê tổng quan</span>} key="8">
          <div className="space-y-6">
            <Card title="Khái quát Nhiệm vụ Cứu hộ" className="shadow-sm border-t-4 border-t-red-500">
              <Row gutter={16} className="mb-6">
                <Col span={4}>
                  <Statistic title="Tổng Yêu cầu" value={rescueStats.total} />
                </Col>
                <Col span={4}>
                  <Statistic title="Chờ tiếp nhận" value={rescueStats.pending} valueStyle={{ color: '#fa8c16' }} />
                </Col>
                <Col span={4}>
                  <Statistic title="Đang xử lý" value={rescueStats.inProgress} valueStyle={{ color: '#1890ff' }} />
                </Col>
                <Col span={4}>
                  <Statistic title="Từ chối (Hủy/Spam)" value={rescueStats.rejected} valueStyle={{ color: '#ff4d4f' }} />
                </Col>
                <Col span={4}>
                  <Statistic title="Đã được giúp" value={rescueStats.completed} valueStyle={{ color: '#52c41a' }} />
                </Col>
              </Row>
              <Row gutter={16} className="border-t pt-4">
                <Col span={6}>
                  <Statistic title="Nguồn Mạng xã hội" value={rescueStats.sourceStats.social} suffix={`/ ${rescueStats.total}`} />
                </Col>
                <Col span={6}>
                  <Statistic title="Nguồn Báo chí" value={rescueStats.sourceStats.news} suffix={`/ ${rescueStats.total}`} />
                </Col>
                <Col span={6}>
                  <Statistic title="Nguồn Người dân" value={rescueStats.sourceStats.user} suffix={`/ ${rescueStats.total}`} />
                </Col>
                <Col span={6}>
                  <Statistic title="Phát hiện Trùng lặp" value={rescueStats.duplicateCount} valueStyle={{ color: '#8c8c8c' }} />
                </Col>
              </Row>
            </Card>

            <Card 
              title="Lịch sử Cứu hộ" 
              className="shadow-sm border-t-4 border-t-green-500"
              extra={
                <Input
                  placeholder="Lọc theo địa chỉ..."
                  style={{ width: 250 }}
                  value={historyFilterAddress}
                  onChange={e => setHistoryFilterAddress(e.target.value)}
                  allowClear
                />
              }
            >
              <Table columns={historyColumns} dataSource={historyRequests} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>
          </div>
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
          {modalType === 'rescue' && (
            <>
              <div className="bg-red-50 p-4 rounded mb-4 border border-red-200">
                <p><strong>Người liên hệ:</strong> {editingItem?.contactName} - {editingItem?.contactPhone}</p>
                <p><strong>Địa Chỉ:</strong> {editingItem?.district}, {editingItem?.province}</p>
                <p><strong>Nguồn:</strong> <Tag color={DATA_SOURCES.find(ds => ds.value === editingItem?.source)?.color}>{editingItem?.source}</Tag></p>
                {editingItem?.isDuplicate && <Tag color="orange" className="mb-2">CẢNH BÁO: CÓ THỂ BỊ TRÙNG LẶP</Tag>}
                <p><strong>Người mắc kẹt:</strong> {editingItem?.trappedCount} người ({editingItem?.demographics?.children} trẻ em, {editingItem?.demographics?.women} phụ nữ, {editingItem?.demographics?.elderly} người già).</p>
                <p><strong>Mô tả:</strong> {editingItem?.description}</p>
                {editingItem?.previousContact?.contactName && (
                  <div className="mt-2 bg-yellow-50 p-2 border border-yellow-200">
                    <strong>Đã từng có lực lượng qua:</strong><br />
                    Tên: {editingItem.previousContact.contactName} - Đơn vị: {editingItem.previousContact.sourceLine}<br />
                    Lúc: {editingItem.previousContact.time} - SĐT: {editingItem.previousContact.phone}
                  </div>
                )}
              </div>

              <Form.Item name="status" label="Kiểm duyệt & Trạng thái" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Chờ tiếp nhận">Chờ tiếp nhận</Select.Option>
                  <Select.Option value="Từ chối">Từ chối (Tin giả / Hủy)</Select.Option>
                  <Select.Option value="Đang xử lý">Đang xử lý (Chuyển cho đội cứu hộ)</Select.Option>
                  <Select.Option value="Đã được cứu">Đã được cứu</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="priority" label="Mức độ ưu tiên">
                <Select>
                  <Select.Option value="Bình thường">Bình thường</Select.Option>
                  <Select.Option value="Khẩn cấp">Khẩn cấp</Select.Option>
                  <Select.Option value="Rất khẩn cấp">Rất khẩn cấp</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="assignedTo" label="Giao chỉ định cho Đội (Tùy chọn)">
                <Select placeholder="Chọn thành viên cán bộ cứu hộ..." allowClear>
                  {officerList.map(o => (
                    <Select.Option key={o.id} value={o.id}>{o.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="notes" label="Ghi chú thêm">
                <TextArea rows={3} placeholder="Ghi chú nội bộ cho ban điều hành..." />
              </Form.Item>
            </>
          )}

          {modalType === 'warning' && (
            <>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}><TextArea rows={3} /></Form.Item>
              <Form.Item name="level" label="Mức độ" initialValue="warning">
                <Select>
                  <Select.Option value="urgent">Khẩn cấp (Urgent)</Select.Option>
                  <Select.Option value="warning">Cảnh báo (Warning)</Select.Option>
                  <Select.Option value="info">Thông tin (Info)</Select.Option>
                </Select>
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh">
                  <Select showSearch disabled={user?.role === 'coordinator'}>
                    {PROVINCES.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}
                  </Select>
                </Form.Item>
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

export default CoordinatorDashboard;
