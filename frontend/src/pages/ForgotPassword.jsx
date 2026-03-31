import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword(values.email);
      if (response.success) {
        message.success({ content: 'Mã xác nhận đã được gửi đến email của bạn.', duration: 3 });
        navigate('/reset-password', { state: { email: values.email } });
      } else {
        message.error({ content: response.message || 'Có lỗi xảy ra, vui lòng thử lại.', duration: 3 });
      }
    } catch (error) {
      message.error({ content: error.message || 'Không thể gửi yêu cầu', duration: 3 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex justify-center items-center py-10 px-4 relative overflow-hidden font-sans">
      {/* Background decorations */}
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
          <Title level={3} className="!mb-1 !text-slate-800 tracking-tight font-bold">Khôi Phục Mật Khẩu</Title>
          <Text className="text-slate-500 text-sm">Nhập email để nhận mã xác nhận</Text>
        </div>

        <Form 
          name="forgot-password" 
          onFinish={onFinish} 
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-slate-400 mr-2" />} 
              placeholder="Email của bạn" 
              className="rounded-lg px-3 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 shadow-sm transition-all duration-300 hover:border-blue-400 focus:border-blue-500"
            />
          </Form.Item>
          
          <Form.Item className="mt-8 mb-6">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-0 shadow-sm hover:shadow-md text-sm font-semibold tracking-wide transition-all duration-300"
            >
              Gửi mã xác nhận
            </Button>
          </Form.Item>

          <div className="text-center">
            <Link to="/login" className="text-slate-500 font-medium hover:text-blue-600 transition-colors text-sm hover:underline decoration-blue-500/30 underline-offset-4">
              Quay lại đăng nhập
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
