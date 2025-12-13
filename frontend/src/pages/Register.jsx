import React from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined, PhoneOutlined, LockOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = (values) => {
    // Loại bỏ trường confirm khỏi dữ liệu gửi lên
    const { confirm, ...registerData } = values;
    register(registerData);
    message.success('Đăng ký thành công! Vui lòng đăng nhập.');
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-100 py-8">
      <Card title="Đăng ký tài khoản" className="w-full max-w-2xl shadow-lg">
        <Form name="register" onFinish={onFinish} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              name="name" 
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
            </Form.Item>
            
            <Form.Item 
              name="email" 
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@email.com" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              name="cccd" 
              label="Căn cước công dân (CCCD)"
              rules={[
                { required: true, message: 'Vui lòng nhập số CCCD' },
                { pattern: /^[0-9]{12}$/, message: 'CCCD phải có đúng 12 chữ số' }
              ]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="Nhập 12 chữ số CCCD" maxLength={12} />
            </Form.Item>

            <Form.Item 
              name="phone" 
              label="Số điện thoại (Tùy chọn)"
            >
              <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              name="province" 
              label="Tỉnh/Thành phố"
              rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
            >
              <Select 
                showSearch 
                placeholder="Chọn Tỉnh/Thành phố" 
                optionFilterProp="label"
              >
                {PROVINCES.map(p => <Select.Option key={p} value={p} label={p}>{p}</Select.Option>)}
              </Select>
            </Form.Item>

            <Form.Item 
              name="district" 
              label="Xã/Phường"
              rules={[{ required: true, message: 'Vui lòng nhập xã/phường' }]}
            >
              <Input prefix={<EnvironmentOutlined />} placeholder="Ví dụ: Xã A" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              name="password" 
              label="Mật khẩu"
              rules={[{ required: true, min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item 
              name="confirm" 
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng nhập lại mật khẩu' },
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
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
            </Form.Item>
          </div>

          <Form.Item className="mt-2">
            <Button type="primary" htmlType="submit" className="w-full bg-blue-600">
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