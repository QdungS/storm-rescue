import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = (values) => {
    register(values);
    message.success('Đăng ký thành công! Vui lòng đăng nhập.');
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-100">
      <Card title="Đăng ký tài khoản dân cư" className="w-96 shadow-lg">
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item name="name" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input placeholder="Họ và tên" />
          </Form.Item>
          
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item 
            name="confirm" 
            dependencies={['password']}
            rules={[
              { required: true, message: 'Nhập lại mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-green-600">
              Đăng ký
            </Button>
          </Form.Item>
          
          <div className="text-center">
            Đã có tài khoản? <Link to="/login" className="text-blue-500">Đăng nhập</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;