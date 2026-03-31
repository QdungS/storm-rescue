import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, Select, message, Tabs, InputNumber, Popconfirm } from 'antd';
import { FileText, MapPin, Bell, Edit, CheckCircle, Shield, Phone, Trash2, Plus, History, UserPlus } from 'lucide-react';
import { rescueService } from '../services/rescueService';
import { warningService } from '../services/warningService';
import { safetyService } from '../services/safetyService';
import { useAuth } from '../context/AuthContext';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

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

const OfficerDashboard = () => {
  const { user } = useAuth();

  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [myTasks, setMyTasks] = useState([]);

  const [warnings, setWarnings] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchHeroData = async () => {
    setLoading(true);
    try {
      const [rescuesData, warningsData, safeZonesData, contactsData] = await Promise.all([
        rescueService.getAll(),
        warningService.getAll(),
        safetyService.getSafeZones(),
        safetyService.getContacts()
      ]);

      const pending = rescuesData.filter(r => r.status === 'Chờ tiếp nhận');
      const mine = rescuesData.filter(r => r.status === 'Đang xử lý' && r.assignedTo === user?.id);
      const completed = rescuesData.filter(r => r.status === 'Đã được cứu' && r.assignedTo === user?.id);

      setPendingRequests(pending);
      setMyTasks(mine);
      setCompletedRequests(completed);

      setWarnings(warningsData);
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
    fetchHeroData();
  }, [user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const openModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);

    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
      if ((type === 'safeZone' || type === 'contact') && user) {
        form.setFieldsValue({ province: user.province, district: user.district });
      }
    }
  };

  const handleAssignTask = async (id) => {
    try {
      await rescueService.acceptTask(id);
      message.success('Nhận nhiệm vụ thành công!');
      fetchHeroData();
      window.dispatchEvent(new Event('rescueDataUpdated'));
    } catch (error) {
      message.error(error.message || 'Không thể nhận nhiệm vụ');
    }
  };

  const handleReportFake = async (id) => {
    try {
      await rescueService.reportFake(id);
      message.success('Đã báo cáo tin giả!');
      fetchHeroData();
      window.dispatchEvent(new Event('rescueDataUpdated'));
    } catch (error) {
      message.error(error.message || 'Lỗi khi báo cáo');
    }
  };

  const handleSave = async (values) => {
    try {
      if (modalType === 'rescue') {
        await rescueService.updateRequest(editingItem.id, {
          status: values.status,
          notes: values.notes
        });
        message.success('Đã cập nhật trạng thái nhiệm vụ!');
        fetchHeroData();
        window.dispatchEvent(new Event('rescueDataUpdated'));
      }
      else if (modalType === 'warning') {
        if (editingItem) await warningService.update(editingItem.id, values);
        else await warningService.create(values);
        const updated = await warningService.getAll();
        setWarnings(updated);
        message.success('Đã gửi cảnh báo!');
        window.dispatchEvent(new Event('warningDataUpdated'));
      }
      else if (modalType === 'safeZone') {
        if (editingItem) await safetyService.updateSafeZone(editingItem.id, values);
        else await safetyService.createSafeZone(values);
        const updated = await safetyService.getSafeZones();
        setSafeZones(updated);
        message.success('Lưu khu vực an toàn thành công!');
      }
      else if (modalType === 'contact') {
        if (editingItem) await safetyService.updateContact(editingItem.id, values);
        else await safetyService.createContact(values);
        const updated = await safetyService.getContacts();
        setContacts(updated);
        message.success('Lưu liên hệ khẩn cấp thành công!');
      }
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'safeZone') {
        await safetyService.deleteSafeZone(id);
        setSafeZones(await safetyService.getSafeZones());
      } else if (type === 'contact') {
        await safetyService.deleteContact(id);
        setContacts(await safetyService.getContacts());
      } else if (type === 'warning') {
        await warningService.delete(id);
        setWarnings(await warningService.getAll());
        window.dispatchEvent(new Event('warningDataUpdated'));
      }
      message.success('Đã xóa thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa');
    }
  };

  const pendingColumns = [
    { title: 'Nguồn', dataIndex: 'source', key: 'source', render: s => <Tag color={s === 'user' ? 'blue' : s === 'social' ? 'purple' : 'orange'}>{s}</Tag> },
    { title: 'Người liên hệ', key: 'contact', render: (_, r) => <div><b>{r.contactName}</b><br />{r.contactPhone}</div> },
    { title: 'Tỉnh/TP', dataIndex: 'province', key: 'province' },
    { title: 'Địa chỉ', dataIndex: 'district', key: 'district' },
    {
      title: 'Mức độ', dataIndex: 'priority', key: 'priority', render: p => {
        let color = p === 'Rất khẩn cấp' ? 'red' : p === 'Khẩn cấp' ? 'orange' : 'blue';
        return <Tag color={color}>{p || 'Bình thường'}</Tag>;
      }
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => (
        <Tag color={s === 'Đã được cứu' ? 'green' : s === 'Từ chối' ? 'red' : s === 'Đang xử lý' ? 'blue' : 'orange'}>{s}</Tag>
      )
    },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Button type="primary" icon={<UserPlus size={14} />} onClick={() => handleAssignTask(r.id)}>Nhận nhiệm vụ</Button>
      )
    }
  ];

  const myTasksColumns = [
    { title: 'Người liên hệ', key: 'contact', render: (_, r) => <div><b>{r.contactName}</b><br />{r.contactPhone}</div> },
    { title: 'Địa Chỉ', key: 'location', render: (_, r) => <div>{r.district}, {r.province}</div> },
    { title: 'Nguồn', dataIndex: 'source', key: 'source', render: s => <Tag color="gray">{s}</Tag> },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Space>
          <Button type="primary" className="bg-green-600" icon={<CheckCircle size={14} />} onClick={() => openModal('rescue', r)}>Cập nhật</Button>
        </Space>
      )
    }
  ];

  const genericColumns = [
    { title: 'Người liên hệ', key: 'contact', render: (_, r) => <div><b>{r.contactName}</b><br />{r.contactPhone}</div> },
    { title: 'Địa Chỉ', key: 'location', render: (_, r) => <div>{r.district}, {r.province}</div> },
    { title: 'Hoàn tất lúc', dataIndex: 'updatedAt', key: 'updatedAt', render: d => new Date(d).toLocaleString() },
  ];

  const warningColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province' },
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
          <Button icon={<Edit size={14} />} onClick={() => openModal('warning', r)}>Sửa</Button>
          <Popconfirm title="Xóa cảnh báo này?" onConfirm={() => handleDelete('warning', r.id)}>
            <Button danger icon={<Trash2 size={14} />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const safeZoneColumns = [
    { title: 'Tên khu vực', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Quận/Huyện', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => <Tag color={s === 'Sẵn sàng' ? 'green' : 'orange'}>{s}</Tag> },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Space>
          <Button icon={<Edit size={14} />} onClick={() => openModal('safeZone', r)}>Sửa</Button>
          <Popconfirm
            title="Xóa khu vực an toàn này?"
            description="Hành động không thể hoàn tác"
            onConfirm={() => handleDelete('safeZone', r.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash2 size={14} />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const contactColumns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Hành động', key: 'action', render: (_, r) => (
        <Space>
          <Button icon={<Edit size={14} />} onClick={() => openModal('contact', r)}>Sửa</Button>
          <Popconfirm
            title="Xóa liên hệ này?"
            description="Hành động không thể hoàn tác"
            onConfirm={() => handleDelete('contact', r.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash2 size={14} />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded shadow-md h-full overflow-auto">
      <h2 className="text-3xl font-bold mb-6 text-red-700 uppercase tracking-wide">Bàn làm việc Đội cứu hộ</h2>

      <Tabs defaultActiveKey="1" type="card">
        { }
        <TabPane tab={<span><Bell size={16} className="inline mr-1" /> Tin chờ cứu hộ ({pendingRequests.length})</span>} key="1">
          <Table columns={pendingColumns} dataSource={pendingRequests} rowKey="id" loading={loading} />
        </TabPane>

        { }
        <TabPane tab={<span><FileText size={16} className="inline mr-1" /> Đang thực hiện ({myTasks.length})</span>} key="2">
          <Table columns={myTasksColumns} dataSource={myTasks} rowKey="id" loading={loading} />
        </TabPane>

        { }
        <TabPane tab={<span><CheckCircle size={16} className="inline mr-1" /> Đã hoàn thành ({completedRequests.length})</span>} key="3">
          <Table columns={genericColumns} dataSource={completedRequests} rowKey="id" loading={loading} />
        </TabPane>

        { }
        <TabPane tab={<span><Bell size={16} className="inline mr-1" /> Cảnh báo</span>} key="5">
          <Button type="primary" danger className="mb-4" onClick={() => openModal('warning', null)}>+ Tạo cảnh báo mới</Button>
          <Table columns={warningColumns} dataSource={warnings} rowKey="id" loading={loading} />
        </TabPane>

        { }
        <TabPane tab={<span><Shield size={16} className="inline mr-1" /> Khu vực an toàn</span>} key="6">
          <Button type="primary" className="mb-4 bg-cyan-600" onClick={() => openModal('safeZone')}>Thêm khu vực</Button>
          <Table columns={safeZoneColumns} dataSource={safeZones} rowKey="id" loading={loading} />
        </TabPane>

        { }
        <TabPane tab={<span><Phone size={16} className="inline mr-1" /> Liên hệ khẩn cấp</span>} key="7">
          <Button type="primary" className="mb-4 bg-orange-600" onClick={() => openModal('contact')}>Thêm liên hệ khẩn cấp</Button>
          <Table columns={contactColumns} dataSource={contacts} rowKey="id" loading={loading} />
        </TabPane>
      </Tabs>

      { }
      <Modal
        title={modalType === 'rescue' ? "Cập nhật tiến độ cứu hộ" : "Quản lý thông tin"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>

          {modalType === 'rescue' && (
            <>
              <div className="bg-red-50 p-4 rounded mb-4 border border-red-200 text-sm">
                <p><strong>Người liên hệ:</strong> {editingItem?.contactName} - {editingItem?.contactPhone}</p>
                <p><strong>Địa Chỉ:</strong> {editingItem?.district}, {editingItem?.province}</p>
                <p><strong>Mô tả:</strong> {editingItem?.description}</p>
                <p><strong>Người mắc kẹt:</strong> {editingItem?.trappedCount} người ({editingItem?.demographics?.children} trẻ em, {editingItem?.demographics?.women} phụ nữ, {editingItem?.demographics?.elderly} người già).</p>
                {editingItem?.previousContact?.contactName && (
                  <div className="mt-2 bg-yellow-50 p-2 border border-yellow-200">
                    <strong>Đã từng có lực lượng qua:</strong><br />
                    Tên: {editingItem.previousContact.contactName} - Đơn vị: {editingItem.previousContact.sourceLine}<br />
                    Lúc: {editingItem.previousContact.time} - SĐT: {editingItem.previousContact.phone}
                  </div>
                )}
              </div>

              <Form.Item label="Trạng thái xử lý" name="status" rules={[{ required: true }]}>
                <Select>
                  <Option value="Đang xử lý">Đang xử lý (Đang tiếp cận)</Option>
                  <Option value="Đã được cứu">Hoàn tất (Đã cứu xong, an toàn)</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Ghi chú cứu hộ" name="notes">
                <TextArea rows={3} placeholder="Nhập ghi chú sau khi cứu hộ (ví dụ: đã đưa về trạm y tế, sức khỏe còn yếu...)" />
              </Form.Item>
            </>
          )}

          { }
          {modalType === 'warning' && (
            <>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}><TextArea rows={3} /></Form.Item>
              <Form.Item name="level" label="Mức độ" initialValue="warning">
                <Select>
                  <Option value="urgent">Khẩn cấp (Urgent)</Option>
                  <Option value="warning">Cảnh báo (Warning)</Option>
                  <Option value="info">Thông tin (Info)</Option>
                </Select>
              </Form.Item>
            </>
          )}

          {modalType === 'safeZone' && (
            <>
              <Form.Item name="name" label="Tên khu vực" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}><Input /></Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh">
                  <Select showSearch disabled>
                    {PROVINCES.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="district" label="Quận/Huyện"><Input /></Form.Item>
              </div>
              <Form.Item name="status" label="Trạng thái"><Select><Option value="Sẵn sàng">Sẵn sàng</Option><Option value="Tạm đóng">Tạm đóng</Option></Select></Form.Item>
              <Form.Item name="capacity" label="Sức chứa"><Input /></Form.Item>
            </>
          )}

          {modalType === 'contact' && (
            <>
              <Form.Item name="name" label="Tên liên hệ" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="phone" label="SĐT" rules={[{ required: true }]}><Input /></Form.Item>
            </>
          )}

          <Button type="primary" htmlType="submit" className="w-full mt-4">Lưu cập nhật</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficerDashboard;
