import React, { useState, useEffect } from 'react';
import { Tabs, Card, List, Typography, Tag, Button, Collapse } from 'antd';
import { BookOpen, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { safetyService } from '../services/safetyService';

const { Title, Paragraph, Text } = Typography;

const SafetyInfo = ({ selectedProvinces = [], userRole }) => {
  const [guides, setGuides] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tất cả dữ liệu, sau đó lọc ở frontend
        const [guidesData, zonesData, contactsData] = await Promise.all([
          safetyService.getGuides(),
          safetyService.getSafeZones(),
          safetyService.getContacts()
        ]);
        
        // Lọc theo tỉnh nếu có chọn (chỉ áp dụng cho SafeZones và Contacts)
        const filterByProvinces = (items) => {
          if (!items || !Array.isArray(items)) return [];
          // Nếu chưa chọn tỉnh, hiển thị tất cả
          if (!selectedProvinces || selectedProvinces.length === 0) {
            return items;
          }
          // Nếu đã chọn tỉnh, lọc theo tỉnh đã chọn
          const normalizeProvince = (val) => (val || '').trim().toLowerCase();
          const targets = selectedProvinces.map(normalizeProvince);
          return items.filter(item => {
            if (!item) return false;
            const itemProvince = normalizeProvince(item.province);
            // Nếu item không có province, bỏ qua (chỉ hiển thị items có province)
            if (!itemProvince) return false;
            return targets.includes(itemProvince);
          });
        };
        
        // Guides (Hướng dẫn & Tài liệu) luôn hiển thị tất cả, không lọc theo tỉnh
        setGuides(guidesData || []);
        // SafeZones và Contacts lọc theo tỉnh nếu có chọn
        setSafeZones(filterByProvinces(zonesData || []));
        setContacts(filterByProvinces(contactsData || []));
      } catch (error) {
        console.error('Failed to fetch safety info:', error);
        // Đặt giá trị mặc định để tránh crash
        setGuides([]);
        setSafeZones([]);
        setContacts([]);
      }
    };
    fetchData();
  }, [selectedProvinces, userRole]);
  
  // --- Tab 1: Hướng dẫn & Tài liệu ---
  const GuidesTab = () => (
    <div className="max-w-3xl mx-auto">
      {guides.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Chưa có hướng dẫn nào.</div>
      ) : (
        <Collapse accordion defaultActiveKey={['1']}>
          {guides.map((guide) => (
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
      )}
    </div>
  );

  // --- Tab 2: Khu vực an toàn ---
  const SafeZonesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {safeZones.length === 0 ? (
        <div className="col-span-2 text-center text-gray-500 py-8">Chưa có khu vực an toàn nào.</div>
      ) : (
        safeZones.map((zone) => (
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
        ))
      )}
    </div>
  );

  // --- Tab 3: Liên hệ khẩn cấp ---
  const ContactsTab = () => (
    contacts.length === 0 ? (
      <div className="text-center text-gray-500 py-8">Chưa có liên hệ khẩn cấp nào.</div>
    ) : (
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={contacts}
        renderItem={(item) => (
          <List.Item>
            <Card className="shadow-sm bg-red-50 border-red-100">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <Title level={4} className="m-0 text-red-700 mb-1">{item.phone}</Title>
                  <Text className="text-gray-600">{item.name}</Text>
                </div>
                <div className="flex-shrink-0">
                  <Button type="primary" danger shape="round" icon={<Phone size={16} />} size="large">
                    Gọi ngay
                  </Button>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    )
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
        <Text type="secondary">
          {selectedProvinces && selectedProvinces.length > 0 
            ? `Hiển thị theo ${selectedProvinces.length === 1 ? 'tỉnh' : 'các tỉnh'}: ${selectedProvinces.join(', ')}` 
            : 'Cẩm nang phòng chống thiên tai và danh bạ hỗ trợ khẩn cấp'}
        </Text>
      </div>
      <Tabs defaultActiveKey="1" items={items} size="large" centered />
    </div>
  );
};

export default SafetyInfo;