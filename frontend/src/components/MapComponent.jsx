import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Icon cho điểm sạt lở - Màu sắc theo mức độ
const getLandslideIcon = (level) => {
  let color;
  switch(level) {
    case 1: color = '#52c41a'; break; // Xanh lá - Rủi ro thấp
    case 2: color = '#fadb14'; break; // Vàng - Rủi ro trung bình
    case 3: color = '#fa8c16'; break; // Cam - Rủi ro lớn
    case 4: color = '#ff4d4f'; break; // Đỏ - Rủi ro rất lớn
    case 5: color = '#000000'; break; // Đen - Rủi ro cấp thảm họa
    default: color = '#52c41a'; break;
  }
  
  // Đối với mức 5 (màu đen), cần border màu trắng rõ hơn để nhìn thấy
  const borderColor = level === 5 ? '#ffffff' : 'white';
  const borderWidth = level === 5 ? '3px' : '2px';
  
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: ${borderWidth} solid ${borderColor}; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  });
};

const MapComponent = ({ points }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <MapContainer 
        center={[15.5, 110.0]} // Tâm bản đồ ở giữa biển Đông
        zoom={6}               // Mức zoom bao quát
        minZoom={5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        {/* --- THAY ĐỔI LỚP BẢN ĐỒ TẠI ĐÂY --- */}
        {/* Sử dụng Google Maps Hybrid (Vệ tinh + Tên đường/Địa danh) */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution='&copy; Google Maps'
        />
        
        {/* Chỉ hiển thị các điểm sạt lở, KHÔNG CẦN code thủ công Hoàng Sa/Trường Sa nữa */}
        {points.map((point) => (
          <Marker 
            key={point.id} 
            position={[point.lat, point.lng]}
            icon={getLandslideIcon(point.level)}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold">{point.name}</h3>
                <p>Mức độ: <span className={
                  point.level === 5 ? "text-black font-bold" :
                  point.level === 4 ? "text-red-500 font-bold" :
                  point.level === 3 ? "text-orange-500 font-bold" :
                  point.level === 2 ? "text-yellow-500 font-bold" :
                  "text-green-500 font-bold"
                }>{point.level}/5</span></p>
                <p className="text-sm">{point.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Tiêu đề nổi */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 px-4 py-2 rounded shadow-md border-l-4 border-blue-600 backdrop-blur-sm">
        <h2 className="font-bold text-gray-800 text-sm uppercase">Bản đồ vệ tinh giám sát</h2>
      </div>

      {/* Chú thích */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 p-3 rounded shadow-md backdrop-blur-sm">
        <div className="text-xs font-bold mb-2">Mức độ nguy hiểm</div>
        <div className="flex items-center text-xs mb-1">
          <span className="w-3 h-3 rounded-full mr-2 border-2 border-white" style={{backgroundColor: '#000000', width: '12px', height: '12px', display: 'inline-block'}}></span>
          Rủi ro cấp thảm họa
        </div>
        <div className="flex items-center text-xs mb-1">
          <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#ff4d4f', width: '12px', height: '12px', display: 'inline-block'}}></span>
          Rủi ro rất lớn
        </div>
        <div className="flex items-center text-xs mb-1">
          <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#fa8c16', width: '12px', height: '12px', display: 'inline-block'}}></span>
          Rủi ro lớn
        </div>
        <div className="flex items-center text-xs mb-1">
          <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#fadb14', width: '12px', height: '12px', display: 'inline-block'}}></span>
          Rủi ro trung bình
        </div>
        <div className="flex items-center text-xs">
          <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#52c41a', width: '12px', height: '12px', display: 'inline-block'}}></span>
          Rủi ro thấp
        </div>
      </div>
    </div>
  );
};

export default MapComponent;