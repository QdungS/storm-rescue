import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, Select, message, Tabs, InputNumber } from 'antd';
import { FileText, MapPin, Bell, Edit, CheckCircle, Shield, Phone, Trash2, Plus, History } from 'lucide-react';
import { reportService } from '../services/reportService';
import { landslideService } from '../services/landslideService';
import { warningService } from '../services/warningService';
import { safetyService } from '../services/safetyService';
import { useAuth } from '../context/AuthContext';

const { TabPane } = Tabs;
const { Option } = Select;
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

const OfficerDashboard = () => {
  const { user } = useAuth();
  // --- STATE DỮ LIỆU ---
  const [reports, setReports] = useState([]);
  const [completedReports, setCompletedReports] = useState([]);
  const [landslides, setLandslides] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsData, landslidesData, warningsData, safeZonesData, contactsData] = await Promise.all([
          reportService.getAll(),
          landslideService.getAll(),
          warningService.getAll(),
          safetyService.getSafeZones(),
          safetyService.getContacts()
        ]);
        // Transform reports để match format
        const transformedReports = reportsData.map(r => ({
          id: r.id,
          sender: r.sender?.name || 'N/A',
          title: r.title,
          location: r.location || '',
          status: r.status,
          feedback: r.feedback || '',
          createdAt: r.createdAt,
          completedAt: r.completedAt
        }));
        // Tách báo cáo chưa hoàn tất và đã hoàn tất
        const pendingReports = transformedReports.filter(r => r.status !== 'Hoàn tất');
        const completed = transformedReports.filter(r => r.status === 'Hoàn tất');
        setReports(pendingReports);
        setCompletedReports(completed);
        setLandslides(landslidesData);
        setWarnings(warningsData);
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
  const [modalType, setModalType] = useState(''); // 'report' | 'landslide' | 'warning' | 'safeZone' | 'contact'
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // --- HÀM MỞ MODAL ---
  const openModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);

    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
      if ((type === 'landslide' || type === 'safeZone' || type === 'contact') && user) {
        form.setFieldsValue({ province: user.province, district: user.district });
      }
    }
  };

  // --- HÀM XỬ LÝ LƯU ---
  const handleSave = async (values) => {
    try {
      if (modalType === 'report') {
        await reportService.updateStatus(editingItem.id, values.status, values.feedback);
        const updated = await reportService.getAll();
        const transformed = updated.map(r => ({
          id: r.id,
          sender: r.sender?.name || 'N/A',
          title: r.title,
          location: r.location || '',
          status: r.status,
          feedback: r.feedback || '',
          createdAt: r.createdAt,
          completedAt: r.completedAt
        }));
        // Tách báo cáo chưa hoàn tất và đã hoàn tất
        const pendingReports = transformed.filter(r => r.status !== 'Hoàn tất');
        const completed = transformed.filter(r => r.status === 'Hoàn tất');
        setReports(pendingReports);
        setCompletedReports(completed);
        message.success('Đã cập nhật tiến độ xử lý!');
      } 
      else if (modalType === 'landslide') {
        if (editingItem) {
          await landslideService.update(editingItem.id, values);
        } else {
          await landslideService.create(values);
        }
        const updated = await landslideService.getAll();
        setLandslides(updated);
        message.success('Cập nhật điểm sạt lở thành công!');
      }
      else if (modalType === 'warning') {
        if (editingItem) {
          await warningService.update(editingItem.id, values);
        } else {
          await warningService.create(values);
        }
        const updated = await warningService.getAll();
        setWarnings(updated);
        message.success('Đã gửi cảnh báo!');
      }
      else if (modalType === 'safeZone') {
        if (editingItem) {
          await safetyService.updateSafeZone(editingItem.id, values);
        } else {
          await safetyService.createSafeZone(values);
        }
        const updated = await safetyService.getSafeZones();
        setSafeZones(updated);
        message.success('Lưu khu vực an toàn thành công!');
      }
      else if (modalType === 'contact') {
        if (editingItem) {
          await safetyService.updateContact(editingItem.id, values);
        } else {
          await safetyService.createContact(values);
        }
        const updated = await safetyService.getContacts();
        setContacts(updated);
        message.success('Lưu liên hệ khẩn cấp thành công!');
      }
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra');
    }
  };

  // --- CỘT BẢNG BÁO CÁO (Dành riêng cho Officer) ---
  const reportColumns = [
    { title: 'Người gửi', dataIndex: 'sender', key: 'sender' },
    { title: 'Sự cố', dataIndex: 'title', key: 'title', render: t => <b>{t}</b> },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    { 
      title: 'Thời gian gửi', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      sorter: (a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(a.createdAt) - new Date(b.createdAt);
      },
      defaultSortOrder: 'descend'
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => {
        let color = s === 'Hoàn tất' ? 'green' : s === 'Đang xử lý' ? 'blue' : 'orange';
        return <Tag color={color}>{s}</Tag>;
    }},
    { title: 'Phản hồi', dataIndex: 'feedback', key: 'feedback', ellipsis: true },
    { title: 'Xử lý', key: 'action', render: (_, r) => (
      <Button type="primary" size="small" icon={<CheckCircle size={14}/>} onClick={() => openModal('report', r)}>Cập nhật</Button>
    )}
  ];

  // --- CỘT BẢNG LỊCH SỬ BÁO CÁO (Chỉ xem, không có nút cập nhật) ---
  const completedReportColumns = [
    { title: 'Người gửi', dataIndex: 'sender', key: 'sender' },
    { title: 'Sự cố', dataIndex: 'title', key: 'title', render: t => <b>{t}</b> },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    { 
      title: 'Thời gian gửi', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      sorter: (a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    },
    { 
      title: 'Thời gian hoàn tất', 
      dataIndex: 'completedAt', 
      key: 'completedAt',
      render: (date) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      sorter: (a, b) => {
        if (!a.completedAt || !b.completedAt) return 0;
        return new Date(a.completedAt) - new Date(b.completedAt);
      },
      defaultSortOrder: 'descend'
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => <Tag color="green">{s}</Tag> },
    { title: 'Phản hồi', dataIndex: 'feedback', key: 'feedback', ellipsis: true }
  ];

  // --- CỘT BẢNG ĐIỂM SẠT LỞ (Tái sử dụng) ---
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
    { title: 'Hành động', key: 'action', render: (_, r) => <Button icon={<Edit size={14}/>} onClick={() => openModal('landslide', r)}>Sửa</Button> }
  ];

  // --- CỘT BẢNG CẢNH BÁO ---
  const warningColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Xã/Phường', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'Mức độ', dataIndex: 'level', key: 'level', render: l => <Tag color={l==='urgent'?'red':'orange'}>{l}</Tag> },
    { title: 'Hành động', key: 'action', render: (_, r) => <Button icon={<Edit size={14}/>} onClick={() => openModal('warning', r)}>Sửa</Button> }
  ];

  // --- CỘT BẢNG KHU VỰC AN TOÀN ---
  const safeZoneColumns = [
    { title: 'Tên khu vực', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Xã/Phường', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'Sức chứa', dataIndex: 'capacity', key: 'capacity', render: c => c || '-' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => <Tag color={s==='Sẵn sàng'?'green':'orange'}>{s || '-'}</Tag> },
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space>
        <Button icon={<Edit size={14}/>} onClick={() => openModal('safeZone', r)}>Sửa</Button>
        <Button danger icon={<Trash2 size={14}/>} onClick={() => handleDelete('safeZone', r.id)}>Xóa</Button>
      </Space>
    )}
  ];

  // --- CỘT BẢNG LIÊN HỆ KHẨN CẤP ---
  const contactColumns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Tỉnh/Thành phố', dataIndex: 'province', key: 'province', render: p => p || '-' },
    { title: 'Xã/Phường', dataIndex: 'district', key: 'district', render: d => d || '-' },
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space>
        <Button icon={<Edit size={14}/>} onClick={() => openModal('contact', r)}>Sửa</Button>
        <Button danger icon={<Trash2 size={14}/>} onClick={() => handleDelete('contact', r.id)}>Xóa</Button>
      </Space>
    )}
  ];

  // --- HÀM XÓA ---
  const handleDelete = async (type, id) => {
    try {
      if (type === 'safeZone') {
        await safetyService.deleteSafeZone(id);
        const updated = await safetyService.getSafeZones();
        setSafeZones(updated);
      } else if (type === 'contact') {
        await safetyService.deleteContact(id);
        const updated = await safetyService.getContacts();
        setContacts(updated);
      }
      message.success('Đã xóa thành công');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi xóa');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Bàn làm việc Cán bộ địa phương</h2>
      
      <Tabs defaultActiveKey="1" type="card">
        {/* TAB 1: XỬ LÝ BÁO CÁO CỦA DÂN (Quan trọng nhất với Officer) - Chỉ hiển thị chưa hoàn tất */}
        <TabPane tab={<span><FileText size={16} className="inline mr-1"/> Xử lý báo cáo dân</span>} key="1">
           <Table columns={reportColumns} dataSource={reports} rowKey="id" />
        </TabPane>

        {/* TAB 1b: LỊCH SỬ BÁO CÁO (Các báo cáo đã hoàn tất) */}
        <TabPane tab={<span><History size={16} className="inline mr-1"/> Lịch sử báo cáo</span>} key="1b">
           <Table columns={completedReportColumns} dataSource={completedReports} rowKey="id" pagination={{ pageSize: 10 }} />
        </TabPane>

        {/* TAB 2: QUẢN LÝ ĐIỂM SẠT LỞ */}
        <TabPane tab={<span><MapPin size={16} className="inline mr-1"/> Điểm sạt lở</span>} key="2">
           <Button type="primary" className="mb-4" onClick={() => { openModal('landslide', null) }}>+ Thêm điểm mới</Button>
           <Table columns={landslideColumns} dataSource={landslides} rowKey="id" />
        </TabPane>

        {/* TAB 3: QUẢN LÝ CẢNH BÁO */}
        <TabPane tab={<span><Bell size={16} className="inline mr-1"/> Cảnh báo</span>} key="3">
           <Button type="primary" danger className="mb-4" onClick={() => { openModal('warning', null) }}>+ Tạo cảnh báo</Button>
           <Table columns={warningColumns} dataSource={warnings} rowKey="id" />
        </TabPane>

        {/* TAB 4: QUẢN LÝ KHU VỰC AN TOÀN */}
        <TabPane tab={<span><Shield size={16} className="inline mr-1"/> Khu vực an toàn</span>} key="4">
          <Button type="primary" className="mb-4 bg-cyan-600" icon={<Plus size={16}/>} onClick={() => openModal('safeZone')}>Thêm khu vực mới</Button>
          <Table columns={safeZoneColumns} dataSource={safeZones} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>

        {/* TAB 5: QUẢN LÝ LIÊN HỆ KHẨN CẤP */}
        <TabPane tab={<span><Phone size={16} className="inline mr-1"/> Liên hệ khẩn cấp</span>} key="5">
          <Button type="primary" className="mb-4 bg-orange-600" icon={<Plus size={16}/>} onClick={() => openModal('contact')}>Thêm liên hệ mới</Button>
          <Table columns={contactColumns} dataSource={contacts} rowKey="id" pagination={{ pageSize: 5 }} />
        </TabPane>
      </Tabs>

      {/* --- MODAL CHUNG --- */}
      <Modal 
        title={modalType === 'report' ? "Cập nhật tiến độ xử lý" : "Quản lý thông tin"} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          
          {/* Form xử lý báo cáo */}
          {modalType === 'report' && (
            <>
              <Form.Item label="Sự cố" name="title"><Input disabled /></Form.Item>
              <Form.Item label="Trạng thái xử lý" name="status" rules={[{ required: true }]}>
                <Select>
                  <Option value="Đang tiếp nhận">Đang tiếp nhận</Option>
                  <Option value="Đang xử lý">Đang xử lý (Điều phối máy móc/nhân lực)</Option>
                  <Option value="Đã xác minh">Đã xác minh (Đến hiện trường)</Option>
                  <Option value="Hoàn tất">Hoàn tất (Đã khắc phục xong)</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Phản hồi cho người dân" name="feedback" rules={[{ required: true }]}>
                <Input.TextArea rows={3} placeholder="Nhập nội dung phản hồi..." />
              </Form.Item>
            </>
          )}

          {/* Form Điểm sạt lở (Rút gọn) */}
          {modalType === 'landslide' && (
            <>
              <Form.Item name="name" label="Tên điểm" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="type" label="Loại sạt lở" rules={[{ required: true, message: 'Vui lòng chọn loại sạt lở' }]}>
                <Select placeholder="Chọn loại">
                  {LANDSLIDE_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                <TextArea rows={3} placeholder="Mô tả tình trạng điểm sạt lở" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="lat" label="Vĩ độ" rules={[{ required: true, message: 'Vui lòng nhập vĩ độ' }]}>
                  <InputNumber className="w-full"/>
                </Form.Item>
                <Form.Item name="lng" label="Kinh độ" rules={[{ required: true, message: 'Vui lòng nhập kinh độ' }]}>
                  <InputNumber className="w-full"/>
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố' }]}>
                  <Input placeholder="Ví dụ: Hòa Bình" disabled />
                </Form.Item>
                <Form.Item name="district" label="Xã/Phường" rules={[{ required: true, message: 'Vui lòng nhập xã/phường' }]}>
                  <Input placeholder="Ví dụ: Xã A" disabled />
                </Form.Item>
              </div>
              <Form.Item name="level" label="Mức độ" rules={[{ required: true }]}>
                <InputNumber min={1} max={5} className="w-full"/>
              </Form.Item>
            </>
          )}

          {/* Form Cảnh báo (Rút gọn) */}
          {modalType === 'warning' && (
            <>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="content" label="Nội dung"><Input.TextArea /></Form.Item>
              <Form.Item name="level" label="Mức độ">
                 <Select><Option value="urgent">Khẩn cấp</Option><Option value="warning">Cảnh báo</Option></Select>
              </Form.Item>
            </>
          )}

          {/* Form Khu vực an toàn */}
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
                  <Input placeholder="Ví dụ: Hòa Bình" disabled />
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
                  <Option value="Sẵn sàng">Sẵn sàng</Option>
                  <Option value="Đang sửa chữa">Đang sửa chữa</Option>
                  <Option value="Tạm đóng">Tạm đóng</Option>
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

          {/* Form Liên hệ khẩn cấp */}
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
                  <Input placeholder="Ví dụ: Hòa Bình" disabled />
                </Form.Item>
                <Form.Item name="district" label="Xã/Phường">
                  <Input placeholder="Ví dụ: Xã A" />
                </Form.Item>
              </div>
            </>
          )}

          <Button type="primary" htmlType="submit" className="w-full mt-2">Lưu lại</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficerDashboard;