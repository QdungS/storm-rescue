import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Icon cho điểm sạt lở (Giữ nguyên)
const getLandslideIcon = (level) => {
  const color = level >= 4 ? 'red' : level >= 3 ? 'orange' : 'green';
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
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
                <p>Mức độ: <span className={point.level >=4 ? "text-red-500 font-bold" : "text-green-600"}>{point.level}/5</span></p>
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
        <div className="flex items-center text-xs mb-1"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span> Nguy hiểm cao</div>
        <div className="flex items-center text-xs mb-1"><span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span> Cảnh báo</div>
        <div className="flex items-center text-xs"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> An toàn</div>
      </div>
    </div>
  );
};

export default MapComponent;