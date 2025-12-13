import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Card, Tabs, List, Tag, Steps, Modal, Typography } from 'antd';
import { 
  UploadOutlined, 
  EnvironmentOutlined, 
  HistoryOutlined, 
  SendOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  SyncOutlined 
} from '@ant-design/icons';
import { reportService } from '../services/reportService';

const { Text, Paragraph } = Typography;

const CitizenReport = () => {
  // --- TAB 1: GỬI BÁO CÁO ---
  const SubmitReportTab = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleGetLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          form.setFieldsValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          message.success("Đã lấy được tọa độ hiện tại!");
        }, () => message.error("Không thể lấy vị trí."));
      }
    };

    const onFinish = async (values) => {
      setLoading(true);
      try {
        const fileList = form.getFieldValue('images')?.fileList || [];
        const images = fileList.map(file => file.originFileObj).filter(Boolean);
        
        await reportService.submit({
          description: values.description,
          latitude: values.latitude,
          longitude: values.longitude,
          location: ''
        }, images);
        
        message.success('Gửi báo cáo thành công!');
        form.resetFields();
      } catch (error) {
        message.error(error.message || 'Có lỗi xảy ra khi gửi báo cáo');
      } finally {
        setLoading(false);
      }
    };

    return (
      <Form form={form} layout="vertical" onFinish={onFinish} className="max-w-xl mx-auto py-4">
        <Form.Item name="description" label="Mô tả sự cố" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="Mô tả chi tiết hiện trạng..." />
        </Form.Item>
        <Form.Item name="images" label="Hình ảnh/Video minh chứng">
          <Upload listType="picture" maxCount={3} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="latitude" label="Vĩ độ"><Input disabled /></Form.Item>
          <Form.Item name="longitude" label="Kinh độ"><Input disabled /></Form.Item>
        </div>
        <Button type="dashed" icon={<EnvironmentOutlined />} onClick={handleGetLocation} className="w-full mb-4">
          Lấy vị trí hiện tại
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} className="w-full bg-blue-600 h-10 font-bold">
          GỬI BÁO CÁO
        </Button>
      </Form>
    );
  };

  // --- TAB 2: THEO DÕI TRẠNG THÁI ---
  const HistoryTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [reports, setReports] = useState([]);

    useEffect(() => {
      const fetchReports = async () => {
        try {
          const data = await reportService.getMyReports();
          // Transform data để match với format cũ
          const transformed = data.map(r => ({
            id: r.id,
            title: r.title,
            location: r.location || '',
            date: new Date(r.createdAt).toLocaleDateString('vi-VN'),
            status: r.status,
            feedback: r.feedback || 'Chưa có phản hồi'
          }));
          setReports(transformed);
        } catch (error) {
          console.error('Failed to fetch reports:', error);
        }
      };
      fetchReports();
    }, []);

    const getStepCurrent = (status) => {
      switch (status) {
        case 'Đang tiếp nhận': return 0;
        case 'Đang xử lý': return 1;
        case 'Đã xác minh': return 2;
        case 'Hoàn tất': return 3;
        default: return 0;
      }
    };

    const getStatusTag = (status) => {
      const color = status === 'Hoàn tất' ? 'green' : status === 'Đang xử lý' ? 'blue' : 'orange';
      return <Tag color={color}>{status}</Tag>;
    };

    const handleViewDetail = (item) => {
      setSelectedReport(item);
      setIsModalOpen(true);
    };

    return (
      <>
        <List
          itemLayout="horizontal"
          dataSource={reports}
          renderItem={(item) => (
            <List.Item 
              className="cursor-pointer hover:bg-gray-50 transition p-3 rounded border mb-2 bg-white"
              onClick={() => handleViewDetail(item)}
              extra={<Button type="link">Chi tiết</Button>}
            >
              <List.Item.Meta
                avatar={<HistoryOutlined className="text-blue-500 text-xl mt-2"/>} // Sửa icon
                title={<span className="font-semibold">{item.title}</span>}
                description={
                  <div>
                    <div className="text-xs text-gray-500">{item.date} • {item.location}</div>
                    <div className="mt-1">{getStatusTag(item.status)}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />

        <Modal 
          title="Chi tiết tiến độ xử lý" 
          open={isModalOpen} 
          onCancel={() => setIsModalOpen(false)} 
          footer={[<Button key="close" onClick={() => setIsModalOpen(false)}>Đóng</Button>]}
        >
          {selectedReport && (
            <div className="pt-4">
              <h3 className="font-bold text-lg mb-2">{selectedReport.title}</h3>
              <p className="text-gray-500 mb-6">Mã báo cáo: #{selectedReport.id} | Ngày gửi: {selectedReport.date}</p>
              
              <Steps 
                direction="vertical" 
                current={getStepCurrent(selectedReport.status)} 
                items={[
                  { 
                    title: 'Đang tiếp nhận', 
                    description: 'Hệ thống đã nhận được báo cáo.',
                    icon: <ClockCircleOutlined /> // Sửa icon
                  },
                  { 
                    title: 'Đang xử lý', 
                    description: 'Cán bộ đang phân tích và lên phương án.',
                    icon: <SyncOutlined spin={selectedReport.status === 'Đang xử lý'} /> // Sửa icon
                  },
                  { 
                    title: 'Đã xác minh', 
                    description: 'Đã kiểm tra thực tế tại hiện trường.',
                    icon: <EnvironmentOutlined /> 
                  },
                  { 
                    title: 'Hoàn tất', 
                    description: 'Sự cố đã được khắc phục xong.',
                    icon: <CheckCircleOutlined /> // Sửa icon
                  },
                ]}
              />

              <div className="mt-6 bg-gray-50 p-3 rounded border border-gray-200">
                <Text strong>Phản hồi từ cơ quan chức năng:</Text>
                <Paragraph className="mb-0 mt-1 text-gray-700 italic">
                  "{selectedReport.feedback}"
                </Paragraph>
              </div>
            </div>
          )}
        </Modal>
      </>
    );
  };

  const items = [
    {
      key: '1',
      label: <span className="font-bold"><SendOutlined className="mr-2"/> Gửi báo cáo mới</span>, // Sửa icon
      children: <SubmitReportTab />,
    },
    {
      key: '2',
      label: <span className="font-bold"><HistoryOutlined className="mr-2"/> Lịch sử & Theo dõi</span>, // Sửa icon
      children: <HistoryTab />,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">Kênh Báo Cáo Sự Cố</h2>
      <Tabs defaultActiveKey="1" items={items} centered size="large" />
    </div>
  );
};

export default CitizenReport;