import React from 'react';
import { Tabs, Card, List, Typography, Tag, Button, Collapse } from 'antd';
import { BookOpen, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { MOCK_SAFETY_INFO } from '../mockData';

const { Title, Paragraph, Text } = Typography;

const SafetyInfo = () => {
  
  // --- Tab 1: Hướng dẫn & Tài liệu ---
  const GuidesTab = () => (
    <div className="max-w-3xl mx-auto">
      <Collapse accordion defaultActiveKey={['1']}>
        {MOCK_SAFETY_INFO.guides.map((guide) => (
          <Collapse.Panel 
            header={<span className="font-semibold text-base">{guide.title}</span>} 
            key={guide.id}
            extra={<Tag color="blue">{guide.category}</Tag>}
          >
            <Paragraph className="text-gray-700 whitespace-pre-line">{guide.content}</Paragraph>
            <div className="text-xs text-gray-400 text-right">Cập nhật: {guide.updatedAt}</div>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );

  // --- Tab 2: Khu vực an toàn ---
  const SafeZonesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {MOCK_SAFETY_INFO.safeZones.map((zone) => (
        <Card key={zone.id} className="shadow-sm hover:shadow-md border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <Title level={5} className="m-0 flex items-center">
                <ShieldCheck size={18} className="mr-2 text-green-600"/> {zone.name}
              </Title>
              <Text type="secondary" className="block mt-1">{zone.address}</Text>
            </div>
            <Tag color={zone.status === 'Sẵn sàng' ? 'success' : 'warning'}>{zone.status}</Tag>
          </div>
          <div className="mt-3 text-sm bg-gray-50 p-2 rounded">
            <strong>Sức chứa:</strong> {zone.capacity}
          </div>
          <Button type="primary" ghost className="mt-3 w-full">Xem chỉ đường</Button>
        </Card>
      ))}
    </div>
  );

  // --- Tab 3: Liên hệ khẩn cấp ---
  const ContactsTab = () => (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={MOCK_SAFETY_INFO.contacts}
      renderItem={(item) => (
        <List.Item>
          <Card className="flex items-center justify-between shadow-sm bg-red-50 border-red-100">
            <div className="flex items-center justify-between w-full">
              <div>
                <Title level={4} className="m-0 text-red-700">{item.phone}</Title>
                <Text>{item.name}</Text>
              </div>
              <Button type="primary" danger shape="round" icon={<Phone size={16} />} size="large">
                Gọi ngay
              </Button>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );

  // Cấu hình Tabs
  const items = [
    {
      key: '1',
      label: <span className="flex items-center"><BookOpen size={16} className="mr-2"/> Hướng dẫn & Tài liệu</span>,
      children: <GuidesTab />,
    },
    {
      key: '2',
      label: <span className="flex items-center"><MapPin size={16} className="mr-2"/> Khu vực an toàn</span>,
      children: <SafeZonesTab />,
    },
    {
      key: '3',
      label: <span className="flex items-center"><Phone size={16} className="mr-2"/> Liên hệ khẩn cấp</span>,
      children: <ContactsTab />,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full overflow-auto">
      <div className="text-center mb-6">
        <Title level={2}>Tra cứu thông tin an toàn</Title>
        <Text type="secondary">Cẩm nang phòng chống thiên tai và danh bạ hỗ trợ khẩn cấp</Text>
      </div>
      <Tabs defaultActiveKey="1" items={items} size="large" centered />
    </div>
  );
};

export default SafetyInfo;