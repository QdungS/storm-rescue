import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const result = await login(values.email, values.password);
    setLoading(false);

    if (result.success) {
      message.success({ content: 'Đăng nhập thành công!', duration: 2 });
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 300);
    } else {
      message.error({ content: result.message || 'Lỗi đăng nhập, vui lòng thử lại', duration: 3 });
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex justify-center items-center py-10 px-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-500/20 blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/20 blur-[90px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 p-6 sm:p-8 relative z-10 transition-all duration-300 hover:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.6)]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg mb-4 transform transition-transform hover:scale-105 duration-300">
            <SafetyCertificateOutlined className="text-2xl" />
          </div>
          <Title level={3} className="!mb-1 !text-slate-800 tracking-tight font-bold">Đăng Nhập Hệ Thống</Title>

        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          className="login-form mt-4"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-slate-400 mr-2" />}
              placeholder="Email của bạn"
              className="rounded-lg px-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 shadow-sm transition-all duration-300 hover:border-blue-400 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            className="!mb-4"
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400 mr-2" />}
              placeholder="Mật khẩu"
              className="rounded-lg px-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 shadow-sm transition-all duration-300 hover:border-blue-400 focus:border-blue-500"
            />
          </Form.Item>

          <div className="flex justify-end mb-6 mt-1">
            <Link to="/forgot-password" title="Khôi phục mật khẩu" className="text-blue-600 font-medium hover:text-blue-500 transition-colors text-xs hover:underline decoration-blue-500/30 underline-offset-4">
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item className="!mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-0 shadow-sm hover:shadow-md text-sm font-semibold tracking-wide transition-all duration-300"
            >
              Đăng nhập ngay
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
