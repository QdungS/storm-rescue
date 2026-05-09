import React, { useState, useEffect } from 'react';
import { Tabs, Card, List, Typography, Tag, Button, Collapse, Select } from 'antd';
import { BookOpen, MapPin, Phone, ShieldCheck, Filter } from 'lucide-react';
import { safetyService } from '../services/safetyService';
import { useAuth } from '../context/AuthContext';

const PROVINCES = [
  'An Giang', 'Bắc Ninh', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng',
  'Đắk Lắk', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Nội',
  'Hà Tĩnh', 'Hải Phòng', 'Huế', 'Hưng Yên', 'Khánh Hòa', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Nghệ An', 'Ninh Bình', 'Phú Thọ',
  'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sơn La', 'Tây Ninh',
  'Thái Nguyên', 'Thanh Hóa', 'TP Hồ Chí Minh', 'Tuyên Quang', 'Vĩnh Long'
];

const { Title, Paragraph, Text } = Typography;

const SafetyInfo = () => {
  const { user } = useAuth();
  const [guides, setGuides] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedZoneProvince, setSelectedZoneProvince] = useState(null);
  const [selectedContactProvince, setSelectedContactProvince] = useState(null);

  useEffect(() => {
    if (user?.province) {
      if (!selectedZoneProvince) setSelectedZoneProvince(user.province);
      if (!selectedContactProvince) setSelectedContactProvince(user.province);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guidesData, zonesData, contactsData] = await Promise.all([
          safetyService.getGuides(),
          safetyService.getSafeZones(),
          safetyService.getContacts()
        ]);

        setGuides(guidesData || []);
        setSafeZones(zonesData || []);
        setContacts(contactsData || []);
      } catch (error) {
        console.error('Failed to fetch safety info:', error);
        setGuides([]);
        setSafeZones([]);
        setContacts([]);
      }
    };
    fetchData();
  }, []);

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

  const SafeZonesTab = () => {
    const filteredZones = safeZones.filter(z => !selectedZoneProvince || z.province === selectedZoneProvince);
    return (
      <div>
        <div className="mb-6 bg-white-50 p-4 rounded-lg flex items-center gap-4">
          <div className="flex items-center text-blue-700 font-medium">
            <Filter size={18} className="mr-2" />
            Lọc theo tỉnh:
          </div>
          <Select
            showSearch
            allowClear
            className="w-64"
            placeholder="Chọn tỉnh/thành phố..."
            value={selectedZoneProvince}
            onChange={v => setSelectedZoneProvince(v)}
            options={PROVINCES.map(p => ({ label: p, value: p }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredZones.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-8">Chưa có khu vực an toàn nào ở khu vực này.</div>
          ) : (
            filteredZones.map((zone) => (
              <Card key={zone.id} className="shadow-sm hover:shadow-md border-l-4 border-l-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <Title level={5} className="m-0 flex items-center">
                      <ShieldCheck size={18} className="mr-2 text-green-600" /> {zone.name}
                    </Title>
                    <Text type="secondary" className="block mt-1">{zone.address}</Text>
                    {(zone.province || zone.district) && <Text type="secondary" className="block text-xs">{zone.province}{zone.district ? ` - ${zone.district}` : ''}</Text>}
                  </div>
                  <Tag color={zone.status === 'Sẵn sàng' ? 'success' : 'warning'}>{zone.status}</Tag>
                </div>
                <div className="mt-3 text-sm bg-gray-50 p-2 rounded">
                  <strong>Sức chứa:</strong> {zone.capacity}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  const ContactsTab = () => {
    const filteredContacts = contacts.filter(c => !selectedContactProvince || c.province === selectedContactProvince);
    return (
      <div>
        <div className="mb-6 bg-white-50 p-4 rounded-lg flex items-center gap-4">
          <div className="flex items-center text-red-700 font-medium">
            <Filter size={18} className="mr-2" />
            Lọc theo tỉnh:
          </div>
          <Select
            showSearch
            allowClear
            className="w-64"
            placeholder="Chọn tỉnh/thành phố..."
            value={selectedContactProvince}
            onChange={v => setSelectedContactProvince(v)}
            options={PROVINCES.map(p => ({ label: p, value: p }))}
          />
        </div>

        {filteredContacts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Chưa có liên hệ khẩn cấp nào ở khu vực này.</div>
        ) : (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={filteredContacts}
            renderItem={(item) => (
              <List.Item>
                <Card className="shadow-sm bg-red-50 border-red-100">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <Title level={4} className="m-0 text-red-700 mb-1">{item.phone}</Title>
                      <Text className="text-gray-600">{item.name}</Text>
                      {item.province && <Text type="secondary" className="block text-xs mt-1">{item.province}{item.district ? ` - ${item.district}` : ''}</Text>}
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
        )}
      </div>
    );
  };

const items = [
    {
      key: '1',
      label: <span className="flex items-center"><BookOpen size={16} className="mr-2" /> Hướng dẫn & Tài liệu</span>,
      children: <GuidesTab />,
    },
    {
      key: '2',
      label: <span className="flex items-center"><MapPin size={16} className="mr-2" /> Khu vực an toàn</span>,
      children: <SafeZonesTab />,
    },
    {
      key: '3',
      label: <span className="flex items-center"><Phone size={16} className="mr-2" /> Liên hệ khẩn cấp</span>,
      children: <ContactsTab />,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full overflow-auto">
      <div className="text-center mb-6">
        <Title level={2}>Tra cứu thông tin an toàn</Title>
        <Text type="secondary">
          Cẩm nang phòng chống thiên tai và danh bạ hỗ trợ khẩn cấp
        </Text>
      </div>
      <Tabs defaultActiveKey="1" items={items} size="large" centered />
    </div>
  );
};

export default SafetyInfo;
