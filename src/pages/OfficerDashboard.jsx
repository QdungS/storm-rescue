import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, Select, message, Tabs, InputNumber } from 'antd';
import { FileText, MapPin, Bell, Edit, CheckCircle } from 'lucide-react';
import { MOCK_ALL_REPORTS, MOCK_LANDSLIDES, MOCK_WARNINGS } from '../mockData';

const { TabPane } = Tabs;
const { Option } = Select;

const OfficerDashboard = () => {
  // --- STATE DỮ LIỆU ---
  const [reports, setReports] = useState(MOCK_ALL_REPORTS);
  const [landslides, setLandslides] = useState(MOCK_LANDSLIDES);
  const [warnings, setWarnings] = useState(MOCK_WARNINGS);

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'report' | 'landslide' | 'warning'
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // --- HÀM MỞ MODAL ---
  const openModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    form.setFieldsValue(item);
  };

  // --- HÀM XỬ LÝ LƯU ---
  const handleSave = (values) => {
    if (modalType === 'report') {
      // Cập nhật trạng thái báo cáo
      setReports(reports.map(r => r.id === editingItem.id ? { ...r, ...values } : r));
      message.success('Đã cập nhật tiến độ xử lý!');
    } 
    else if (modalType === 'landslide') {
      // Logic thêm/sửa điểm sạt lở (giống Admin)
      if (editingItem) {
        setLandslides(landslides.map(l => l.id === editingItem.id ? { ...l, ...values } : l));
      } else {
        setLandslides([...landslides, { id: Date.now(), ...values, updatedAt: 'Vừa xong' }]);
      }
      message.success('Cập nhật điểm sạt lở thành công!');
    }
    else if (modalType === 'warning') {
      // Logic thêm/sửa cảnh báo (giống Admin)
      if (editingItem) {
        setWarnings(warnings.map(w => w.id === editingItem.id ? { ...w, ...values } : w));
      } else {
        setWarnings([...warnings, { id: Date.now(), ...values, timestamp: 'Vừa xong' }]);
      }
      message.success('Đã gửi cảnh báo!');
    }
    setIsModalOpen(false);
  };

  // --- CỘT BẢNG BÁO CÁO (Dành riêng cho Officer) ---
  const reportColumns = [
    { title: 'Người gửi', dataIndex: 'sender', key: 'sender' },
    { title: 'Sự cố', dataIndex: 'title', key: 'title', render: t => <b>{t}</b> },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => {
        let color = s === 'Hoàn tất' ? 'green' : s === 'Đang xử lý' ? 'blue' : 'orange';
        return <Tag color={color}>{s}</Tag>;
    }},
    { title: 'Phản hồi', dataIndex: 'feedback', key: 'feedback', ellipsis: true },
    { title: 'Xử lý', key: 'action', render: (_, r) => (
      <Button type="primary" size="small" icon={<CheckCircle size={14}/>} onClick={() => openModal('report', r)}>Cập nhật</Button>
    )}
  ];

  // --- CỘT BẢNG ĐIỂM SẠT LỞ (Tái sử dụng) ---
  const landslideColumns = [
    { title: 'Tên điểm', dataIndex: 'name', key: 'name' },
    { title: 'Mức độ', dataIndex: 'level', key: 'level', render: l => <Tag color={l>=4?'red':l===3?'orange':'green'}>{l}/5</Tag> },
    { title: 'Hành động', key: 'action', render: (_, r) => <Button icon={<Edit size={14}/>} onClick={() => openModal('landslide', r)}>Sửa</Button> }
  ];

  // --- CỘT BẢNG CẢNH BÁO (Tái sử dụng) ---
  const warningColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Mức độ', dataIndex: 'level', key: 'level', render: l => <Tag color={l==='urgent'?'red':'orange'}>{l}</Tag> },
    { title: 'Hành động', key: 'action', render: (_, r) => <Button icon={<Edit size={14}/>} onClick={() => openModal('warning', r)}>Sửa</Button> }
  ];

  return (
    <div className="bg-white p-6 rounded shadow-md h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Bàn làm việc Cán bộ địa phương</h2>
      
      <Tabs defaultActiveKey="1" type="card">
        {/* TAB 1: XỬ LÝ BÁO CÁO CỦA DÂN (Quan trọng nhất với Officer) */}
        <TabPane tab={<span><FileText size={16} className="inline mr-1"/> Xử lý báo cáo dân</span>} key="1">
           <Table columns={reportColumns} dataSource={reports} rowKey="id" />
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
              <div className="grid grid-cols-2 gap-2">
                <Form.Item name="lat" label="Vĩ độ"><InputNumber className="w-full"/></Form.Item>
                <Form.Item name="lng" label="Kinh độ"><InputNumber className="w-full"/></Form.Item>
              </div>
              <Form.Item name="level" label="Mức độ"><InputNumber min={1} max={5}/></Form.Item>
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

          <Button type="primary" htmlType="submit" className="w-full mt-2">Lưu lại</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficerDashboard;