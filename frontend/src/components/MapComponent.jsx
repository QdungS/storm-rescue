import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const getRescueIcon = (priority, status) => {
  let bgColor = '#ef4444';

  if (status === 'Chờ tiếp nhận') {
    bgColor = '#7c3aed';
  } else {
    if (priority === 'Khẩn cấp') bgColor = '#f97316';
    if (priority === 'Bình thường') bgColor = '#22c55e';
  }

  return L.divIcon({
    className: `custom-icon ${(priority === 'Rất khẩn cấp' && status !== 'Chờ tiếp nhận') ? 'animate-pulse' : ''}`,
    html: `<div style="background-color: ${bgColor}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${bgColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">SOS</div>`,
    iconAnchor: [15, 15]
  });
};

const MapComponent = ({ rescues = [] }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <MapContainer
        center={[15.5, 105.0]}
        zoom={6}
        minZoom={5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution='&copy; Google Maps'
        />

        {}
        {rescues.map((rescue) => {
          if (rescue.lat && rescue.lng) {
            return (
              <Marker
                key={`rs-${rescue.id}`}
                position={[rescue.lat, rescue.lng]}
                icon={getRescueIcon(rescue.priority, rescue.status)}
              >
                <Popup>
                  <div className="font-sans">
                    <h3 className="font-bold text-red-600 flex items-center gap-1">YÊU CẦU CỨU HỘ</h3>
                    <p className="text-sm my-1"><strong>Liên hệ:</strong> {rescue.contactName} ({rescue.contactPhone})</p>
                    <p className="text-sm my-1"><strong>Số người kẹt:</strong> {rescue.trappedCount}</p>
                    <p className="text-sm my-1"><strong>Ưu tiên:</strong>
                      <span style={{
                        color: rescue.status === 'Chờ tiếp nhận' ? '#7c3aed' : (rescue.priority === 'Rất khẩn cấp' ? '#ef4444' : rescue.priority === 'Khẩn cấp' ? '#f97316' : '#22c55e'),
                        fontWeight: 'bold',
                      }}> {rescue.status === 'Chờ tiếp nhận' ? 'Chờ tiếp nhận' : rescue.priority}</span>
                    </p>
                    <p className="text-sm mt-2 pt-2 border-t">{rescue.description}</p>
                  </div>
                </Popup>
              </Marker>
            )
          }
          return null;
        })}

      </MapContainer>

      {}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 px-4 py-2 rounded shadow-md border-l-4 border-blue-600 backdrop-blur-sm">
        <h2 className="font-bold text-gray-800 text-sm uppercase">Bản đồ Điều phối Cứu hộ</h2>
      </div>

      {}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 p-3 rounded shadow-md backdrop-blur-sm">
        <div className="text-xs font-bold mb-2 text-center border-b pb-1">Chú thích</div>
        <div className="flex items-center text-xs mb-2">
          <span className="w-5 h-5 rounded-full mr-2 bg-[#ef4444] flex items-center justify-center text-white font-bold animate-pulse" style={{ fontSize: '8px', border: '1px solid white' }}>SOS</span>
          <span className="font-bold text-[#ef4444]">Rất khẩn cấp</span>
        </div>
        <div className="flex items-center text-xs mb-2">
          <span className="w-5 h-5 rounded-full mr-2 bg-[#f97316] flex items-center justify-center text-white font-bold" style={{ fontSize: '8px', border: '1px solid white' }}>SOS</span>
          <span className="font-bold text-[#f97316]">Khẩn cấp</span>
        </div>
        <div className="flex items-center text-xs mb-1">
          <span className="w-5 h-5 rounded-full mr-2 bg-[#22c55e] flex items-center justify-center text-white font-bold" style={{ fontSize: '8px', border: '1px solid white' }}>SOS</span>
          <span className="text-[#22c55e]">Bình thường</span>
        </div>
        <div className="flex items-center text-xs mt-2 pt-2 border-t">
          <span className="w-5 h-5 rounded-full mr-2 bg-[#7c3aed] flex items-center justify-center text-white font-bold" style={{ fontSize: '8px', border: '1px solid white' }}>SOS</span>
          <span className="font-bold text-purple-600 ">Chờ tiếp nhận</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
