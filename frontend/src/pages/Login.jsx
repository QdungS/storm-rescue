import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login, loginGuest } = useAuth();
  const navigate = useNavigate();
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  const onFinish = async (values) => {
    const result = await login(values.email, values.password);
    if (result.success) {
      message.success('Đăng nhập thành công!');
      // Use replace: true to avoid adding to history stack
      // This prevents 404 issues with Vercel routing
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } else {
      message.error(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-100">
      <Card title="Đăng nhập hệ thống" className="w-96 shadow-lg">
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email (admin@tlu.edu.vn)" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu (123456)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-blue-600">
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="default" className="w-full" onClick={() => setGuestModalOpen(true)}>
              Truy cập nhanh (Khách)
            </Button>
          </Form.Item>
          
          <div className="text-center">
            Chưa có tài khoản? <Link to="/register" className="text-blue-500">Đăng ký ngay</Link>
          </div>
        </Form>
      </Card>

      <Modal
        title="Truy cập nhanh với tư cách Khách"
        open={guestModalOpen}
        onCancel={() => setGuestModalOpen(false)}
        onOk={() => {
          const result = loginGuest({});
          if (result.success) {
            message.success('Đã vào chế độ Khách');
            setGuestModalOpen(false);
            navigate('/');
          } else {
            message.error(result.message || 'Không thể vào chế độ Khách');
          }
        }}
        okText="Vào hệ thống"
      >
        <div className="py-4">
          <p className="text-base text-gray-700 mb-4">
            Với tư cách <strong>Khách</strong>, bạn có thể:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-2">
            <li>Xem tất cả điểm sạt lở trên bản đồ</li>
            <li>Xem cảnh báo theo tỉnh/thành phố (chọn từ danh sách thả xuống)</li>
            <li>Xem hướng dẫn an toàn và liên hệ khẩn cấp</li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Để gửi báo cáo về điểm sạt lở, bạn cần{' '}
              <Link 
                to="/register" 
                className="text-blue-600 font-semibold underline"
                onClick={() => setGuestModalOpen(false)}
              >
                đăng ký tài khoản
              </Link>
              {' '}hoặc đăng nhập với tài khoản đã có.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;