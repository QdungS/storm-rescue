import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const result = login(values.email, values.password);
    if (result.success) {
      message.success('Đăng nhập thành công!');
      navigate('/'); // Chuyển về trang chủ
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
          
          <div className="text-center">
            Chưa có tài khoản? <Link to="/register" className="text-blue-500">Đăng ký ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;