import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, List, Tag, Steps, Modal, Typography, Tabs, Select, InputNumber } from 'antd';
import {
  EnvironmentOutlined,
  HistoryOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  AlertOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { rescueService } from '../services/rescueService';

const { Text, Paragraph } = Typography;
const { Option } = Select;

const PROVINCES = [
  'An Giang', 'Bắc Ninh', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng',
  'Đắk Lắk', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Nội',
  'Hà Tĩnh', 'Hải Phòng', 'Huế', 'Hưng Yên', 'Khánh Hòa', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Nghệ An', 'Ninh Bình', 'Phú Thọ',
  'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sơn La', 'Tây Ninh',
  'Thái Nguyên', 'Thanh Hóa', 'TP Hồ Chí Minh', 'Tuyên Quang', 'Vĩnh Long'
];

const CitizenReport = () => {

  const SubmitRescueTab = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleGetLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          form.setFieldsValue({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          message.success("Đã lấy được tọa độ hiện tại!");
        }, () => message.error("Không thể lấy vị trí."));
      }
    };

    const onFinish = async (values) => {
      setLoading(true);
      try {
        await rescueService.createRequest({
          contactName: values.contactName,
          contactPhone: values.contactPhone,
          contactEmail: values.contactEmail,
          province: values.province,
          district: values.district,
          lat: values.lat,
          lng: values.lng,
          demographics: values.demographics,
          trappedCount: values.trappedCount,
          previousContact: {
            contactName: values.previousContact?.contactName,
            time: values.previousContact?.time,
            phone: values.previousContact?.phone
          },
          description: values.description
        });

        message.success({
          content: 'Gửi yêu cầu thành công! Vui lòng kiểm tra Email để nhận Mã Cứu Hộ và theo dõi tiến độ.',
          duration: 5
        });
        form.resetFields();
      } catch (error) {
        message.error(error.message || 'Có lỗi xảy ra khi gửi yêu cầu');
      } finally {
        setLoading(false);
      }
    };

    return (
      <Form form={form} layout="vertical" onFinish={onFinish} className="max-w-2xl mx-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item name="contactName" label="Họ tên người liên hệ" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item name="contactPhone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
            <Input placeholder="0912345678" />
          </Form.Item>
          <Form.Item name="contactEmail" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập Email hợp lệ' }]}>
            <Input placeholder="email@example.com" />
          </Form.Item>
        </div>

        <div className="bg-gray-50 p-4 border rounded mb-4">
          <h3 className="font-semibold mb-2">Số người mắc kẹt:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Form.Item name="trappedCount" label="Tổng số người" initialValue={1} rules={[{ required: true, message: 'Nhập tổng số người' }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item name={['demographics', 'children']} label="Trẻ em" initialValue={0}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name={['demographics', 'women']} label="Phụ nữ" initialValue={0}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name={['demographics', 'elderly']} label="Người cao tuổi" initialValue={0}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
        </div>

        <div className="bg-gray-50 p-4 border rounded mb-4">
          <h3 className="font-semibold mb-2">Đã từng có lực lượng tiếp cận? (Không bắt buộc)</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name={['previousContact', 'contactName']} label="Tên người tiếp cận">
              <Input placeholder="Ví dụ: Nguyễn Văn B" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name={['previousContact', 'time']} label="Thời gian tiếp cận">
              <Input placeholder="VD: 14h chiều hôm qua" />
            </Form.Item>
            <Form.Item name={['previousContact', 'phone']} label="Số điện thoại liên hệ">
              <Input placeholder="0912..." />
            </Form.Item>
          </div>
        </div>

        <Form.Item name="description" label="Mô tả chi tiết tình huống" rules={[{ required: true, message: 'Vui lòng mô tả tình huống chi tiết' }]}>
          <Input.TextArea rows={4} placeholder="Mô tả chi tiết (Thông tin chi tiết nếu gửi yêu cầu cứu hộ cho người khác) để đội cứu hộ nắm bắt tình hình..." />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố' }]}>
            <Select placeholder="Chọn tỉnh" showSearch filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}>
              {PROVINCES.map(p => (
                <Option key={p} value={p}>{p}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="district" label="Địa Chỉ" rules={[{ required: true, message: 'Vui lòng điền địa chỉ' }]}>
            <Input placeholder="Số nhà, Phường" />
          </Form.Item>
        </div>
        <div className="-mt-5 mb-4">
          <span className="text-gray-400 font-normal text-sm">(Vị trí người cần cứu hộ nếu gửi yêu cầu cứu hộ cho người khác)</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="lat" label="Vĩ độ" rules={[{ required: true, message: 'Vui lòng lấy vị trí' }]}><Input disabled /></Form.Item>
          <Form.Item name="lng" label="Kinh độ" rules={[{ required: true, message: 'Vui lòng lấy vị trí' }]}><Input disabled /></Form.Item>
        </div>

        <Button type="dashed" icon={<EnvironmentOutlined />} onClick={handleGetLocation} className="w-full mb-4 border-blue-500 text-blue-600">
          Lấy vị trí hiện tại của thiết bị
        </Button>

        <Button type="primary" htmlType="submit" loading={loading} danger className="w-full h-12 text-lg font-bold uppercase tracking-wider">
          GỬI YÊU CẦU CỨU HỘ KHẨN CẤP
        </Button>
      </Form>
    );
  };

  const HistoryTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchCode, setSearchCode] = useState('');
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
      if (!searchCode.trim()) {
        message.warning('Vui lòng nhập mã cứu hộ');
        return;
      }
      setSearching(true);
      try {

        const response = await fetch(`${import.meta.env.VITE_API_URL}/rescues/code/${searchCode.trim().toUpperCase()}`);
        const data = await response.json();
        if (data.success) {
          handleViewDetail(data.data);
        } else {
          message.error(data.message || 'Không tìm thấy yêu cầu nào với mã này');
        }
      } catch (error) {
        message.error('Lỗi khi tra cứu mã cứu hộ');
      } finally {
        setSearching(false);
      }
    };

    const formatTime = (dateStr) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return d.toLocaleString('vi-VN');
    };

    const getStepCurrent = (status) => {
      switch (status) {
        case 'Chờ tiếp nhận': return 0;
        case 'Đang xử lý': return 1;
        case 'Đã giải quyết': return 2;
        case 'Từ chối': return -1;
        default: return 0;
      }
    };

    const getStatusTag = (status) => {
      const color = status === 'Đã giải quyết' ? 'green' :
        status === 'Đang xử lý' ? 'blue' :
          status === 'Từ chối' ? 'red' : 'orange';
      return <Tag color={color}>{status}</Tag>;
    };

    const handleViewDetail = (item) => {
      setSelectedRequest(item);
      setIsModalOpen(true);
    };

    return (
      <>
        <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-100 flex flex-col md:flex-row gap-4 items-end shadow-sm">
          <div className="flex-1 w-full">
            <label className="block text-base font-bold text-blue-800 mb-2">Tra cứu bằng Mã Cứu Hộ từ Email:</label>
            <Input
              placeholder="Nhập mã cứu hộ (Ví dụ: RS1A2B)"
              size="large"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined className="text-gray-400" />}
            />
          </div>
          <Button type="primary" size="large" onClick={handleSearch} loading={searching} className="px-8 font-semibold">
            Tra cứu Tiến độ
          </Button>
        </div>

        <Modal
          title="Tiến độ Cứu hộ"
          open={isModalOpen}
          width={600}
          onCancel={() => setIsModalOpen(false)}
          footer={[<Button key="close" type="primary" onClick={() => setIsModalOpen(false)}>Đóng</Button>]}
        >
          {selectedRequest && (
            <div className="pt-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                <h3 className="font-bold text-lg mb-3 text-blue-800 border-b border-blue-200 pb-2">Thông tin người yêu cầu</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Họ và tên:</span> <span className="font-semibold">{selectedRequest.contactName}</span></div>
                  <div><span className="text-gray-500">Số điện thoại:</span> <span className="font-semibold">{selectedRequest.contactPhone}</span></div>
                  <div className="col-span-2"><span className="text-gray-500">Khu vực:</span> <span>{selectedRequest.district}, {selectedRequest.province}</span></div>
                  {selectedRequest.trappedCount > 0 && (
                    <div className="col-span-2"><span className="text-gray-500">Người mắc kẹt:</span> <span className="text-red-600 font-bold">{selectedRequest.trappedCount} người</span></div>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 text-blue-800">Thông tin tình huống</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded mb-6 border whitespace-pre-wrap">
                {selectedRequest.description}
              </p>

              <Steps
                direction="vertical"
                current={getStepCurrent(selectedRequest.status)}
                status={selectedRequest.status === 'Từ chối' ? 'error' : 'process'}
                items={[
                  {
                    title: 'Chờ tiếp nhận',
                    description: (
                      <>
                        Hệ thống đã ghi nhận tình trạng của bạn.
                        {selectedRequest.createdAt && <div className="text-gray-400 text-xs mt-1">{formatTime(selectedRequest.createdAt)}</div>}
                      </>
                    ),
                    icon: <ClockCircleOutlined />
                  },
                  {
                    title: 'Đang xử lý (Đã có Lực lượng cứu hộ nhận)',
                    description: (
                      <>
                        Lực lượng cứu hộ đang trên đường tiếp cận.
                        {selectedRequest.processingAt && <div className="text-gray-400 text-xs mt-1">{formatTime(selectedRequest.processingAt)}</div>}
                      </>
                    ),
                    icon: <SyncOutlined spin={selectedRequest.status === 'Đang xử lý'} />
                  },
                  {
                    title: 'Đã giải quyết',
                    description: (
                      <>
                        Nhiệm vụ cứu hộ hoàn tất an toàn.
                        {selectedRequest.rescuedAt && <div className="text-gray-400 text-xs mt-1">{formatTime(selectedRequest.rescuedAt)}</div>}
                      </>
                    ),
                    icon: <CheckCircleOutlined />
                  },
                ]}
              />

              {selectedRequest.notes && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Text strong className="text-blue-800">Ghi chú từ Đội cứu hộ/Admin:</Text>
                  <Paragraph className="mb-0 mt-2 text-gray-800 italic">
                    {selectedRequest.notes}
                  </Paragraph>
                </div>
              )}
            </div>
          )}
        </Modal>
      </>
    );
  };

  const items = [
    {
      key: '1',
      label: <span className="font-bold text-base"><AlertOutlined className="mr-1" /> Gửi Yêu cầu Cứu hộ</span>,
      children: <SubmitRescueTab />,
    },
    {
      key: '2',
      label: <span className="font-bold text-base"><HistoryOutlined className="mr-1" /> Theo dõi Tiến độ</span>,
      children: <HistoryTab />,
    },
  ];

  return (
    <div className="bg-white p-2 md:p-6 rounded-lg shadow-md h-full overflow-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-red-700 uppercase tracking-wide">
        Trung tâm Cứu hộ Khẩn cấp
      </h2>
      <Tabs defaultActiveKey="1" items={items} centered size="large" />
    </div>
  );
};

export default CitizenReport;
