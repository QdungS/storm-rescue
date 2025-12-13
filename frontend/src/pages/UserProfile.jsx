import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Form, Modal, Tag, Select, message, Card, Space } from 'antd';
import { HomeOutlined, ShopOutlined, EnvironmentOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

// Component con: Xử lý sự kiện click vào bản đồ để lấy tọa độ [cite: 509]
const LocationPicker = ({ setPos }) => {
  useMapEvents({
    click(e) {
      setPos(e.latlng); // Cập nhật tọa độ khi click
    },
  });
  return null;
};

const UserProfile = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPos, setNewPos] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await userService.getMyLocations();
        setLocations(data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    if (user) {
      fetchLocations();
    }
  }, [user]);

  // Hàm lưu địa điểm mới
  const handleAddLocation = async (values) => {
    if (!newPos) {
      message.error("Vui lòng chấm một điểm trên bản đồ!");
      return;
    }
    try {
      await userService.addLocation({
        ...values,
        lat: newPos.lat,
        lng: newPos.lng,
      });
      const updated = await userService.getMyLocations();
      setLocations(updated);
      setIsModalOpen(false);
      setNewPos(null);
      form.resetFields();
      message.success("Đã lưu địa điểm mới thành công!");
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa địa điểm?',
      content: 'Bạn sẽ không nhận được cảnh báo chính xác tại vị trí này nữa.',
      onOk: async () => {
        try {
          await userService.removeLocation(id);
          const updated = await userService.getMyLocations();
          setLocations(updated);
          message.success('Đã xóa địa điểm.');
        } catch (error) {
          message.error(error.message || 'Có lỗi xảy ra');
        }
      }
    });
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        if (type === 'home') return <Tag icon={<HomeOutlined />} color="blue">Nhà ở</Tag>;
        if (type === 'work') return <Tag icon={<ShopOutlined />} color="orange">Nơi làm việc</Tag>;
        return <Tag icon={<EnvironmentOutlined />} color="green">Thường lui tới</Tag>;
      }
    },
    { title: 'Tên gợi nhớ', dataIndex: 'name', key: 'name', render: t => <b>{t}</b> },
    { title: 'Tọa độ', key: 'coords', render: (_, r) => <span className="text-gray-500 text-xs">{r.lat.toFixed(4)}, {r.lng.toFixed(4)}</span> },
    { 
      title: 'Hành động', 
      key: 'action', 
      render: (_, r) => <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(r.id)}>Xóa</Button>
    }
  ];

  return (
    <div className="bg-white p-6 rounded shadow-md h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-2">Quản lý địa điểm cá nhân</h2>
      <p className="text-gray-500 mb-6">Hệ thống sẽ gửi cảnh báo sớm nếu phát hiện nguy cơ sạt lở gần các vị trí này.</p>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Danh sách đã lưu</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Thêm địa điểm mới</Button>
      </div>

      <Table columns={columns} dataSource={locations} rowKey="id" pagination={false} />

      {/* MODAL THÊM ĐỊA ĐIỂM */}
      <Modal
        title="Thêm địa điểm quan trọng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cột Trái: Form nhập liệu */}
          <div>
            <Form form={form} layout="vertical" onFinish={handleAddLocation}>
              <Form.Item name="name" label="Tên gợi nhớ" rules={[{ required: true, message: 'Ví dụ: Nhà bà ngoại' }]}>
                <Input placeholder="Nhập tên..." />
              </Form.Item>
              
              <Form.Item name="type" label="Phân loại" initialValue="other">
                <Select>
                  <Select.Option value="home"><HomeOutlined/> Nhà riêng</Select.Option>
                  <Select.Option value="work"><ShopOutlined/> Nơi làm việc</Select.Option>
                  <Select.Option value="other"><EnvironmentOutlined/> Nơi thường lui tới</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Vị trí đã chọn">
                <Input value={newPos ? `${newPos.lat.toFixed(4)}, ${newPos.lng.toFixed(4)}` : "Chưa chọn trên bản đồ"} disabled />
              </Form.Item>

              <Button type="primary" htmlType="submit" className="w-full bg-blue-600">Lưu lại</Button>
            </Form>
            <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-2 rounded">
              * Hãy click chuột vào bản đồ bên cạnh để lấy vị trí chính xác.
            </div>
          </div>

          {/* Cột Phải: Bản đồ chọn vị trí */}
          <div className="h-[300px] rounded overflow-hidden border">
            <MapContainer center={[20.7833, 105.3833]} zoom={9} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker setPos={setNewPos} />
              {newPos && <Marker position={newPos} />}
            </MapContainer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;