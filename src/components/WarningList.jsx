import React from 'react';
import { List, Tag, Typography, Button } from 'antd';
import { Bell, AlertTriangle, Info } from 'lucide-react';

const { Text, Paragraph } = Typography;

const WarningList = ({ warnings }) => {
  
  // Hàm chọn icon và màu sắc dựa theo mức độ
  const getLevelStyle = (level) => {
    switch (level) {
      case 'urgent':
        return { color: 'red', icon: <AlertTriangle size={18} className="text-red-500" />, label: 'Khẩn cấp' };
      case 'warning':
        return { color: 'orange', icon: <Bell size={18} className="text-orange-500" />, label: 'Cảnh báo' };
      default:
        return { color: 'blue', icon: <Info size={18} className="text-blue-500" />, label: 'Thông tin' };
    }
  };

  return (
    <div className="p-4">
      <List
        itemLayout="vertical"
        dataSource={warnings}
        renderItem={(item) => {
          const style = getLevelStyle(item.level);
          return (
            <List.Item className="bg-white rounded-lg shadow-sm mb-3 border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <List.Item.Meta
                avatar={<div className="mt-1">{style.icon}</div>}
                title={
                  <div className="flex justify-between items-start">
                    <Text strong className="text-base">{item.title}</Text>
                    <Tag color={style.color}>{style.label}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div className="text-xs text-gray-400 mb-2">{item.timestamp} • {item.location}</div>
                    <Paragraph className="text-gray-600 mb-0 text-justify">
                      {item.content}
                    </Paragraph>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className="text-center mt-4">
        <Button type="link">Xem tất cả cảnh báo cũ hơn</Button>
      </div>
    </div>
  );
};

export default WarningList;