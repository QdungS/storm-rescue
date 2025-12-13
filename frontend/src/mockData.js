// src/mockData.js

// 1. Dữ liệu Điểm sạt lở
export const MOCK_LANDSLIDES = [
  {
    id: 1,
    name: "Dốc Cun - Hòa Bình",
    lat: 20.7833,
    lng: 105.3833,
    level: 5,
    description: "Khu vực đất yếu, thường xuyên sạt lở khi mưa lớn.",
    updatedAt: "2024-12-08",
    status: "Nguy hiểm cao"
  },
  {
    id: 2,
    name: "Đèo Thung Khe",
    lat: 20.6953,
    lng: 105.2394,
    level: 2,
    description: "Đã gia cố kè đá, đang theo dõi.",
    updatedAt: "2024-12-01",
    status: "An toàn"
  }
];

// 2. Dữ liệu Người dùng (Đã cập nhật thêm địa điểm lưu)
export const MOCK_USER = {
  id: 1,
  name: "Nguyễn Văn Dân",
  email: "dan@gmail.com",
  role: "citizen",
  // Danh sách vị trí đã lưu
  savedLocations: [
    { id: 1, name: "Nhà riêng", type: "home", lat: 20.7833, lng: 105.3833, address: "Xã A, Huyện Cao Phong" },
    { id: 2, name: "Cơ quan", type: "work", lat: 20.95, lng: 105.6, address: "TP. Hòa Bình" }
  ]
};

// 3. Dữ liệu Cảnh báo
export const MOCK_WARNINGS = [
  {
    id: 1,
    title: "CẢNH BÁO KHẨN CẤP: Dốc Cun",
    content: "Mưa lớn kéo dài, nguy cơ sạt lở đất đá rất cao tại Km 78+500. Người dân tuyệt đối không di chuyển qua khu vực này.",
    level: "urgent", 
    timestamp: "10 phút trước",
    location: "Dốc Cun - Hòa Bình"
  },
  {
    id: 2,
    title: "Lưu ý di chuyển: Đèo Thung Khe",
    content: "Sương mù dày đặc kèm mưa nhỏ, đường trơn trượt. Các phương tiện chú ý giảm tốc độ.",
    level: "warning",
    timestamp: "1 giờ trước",
    location: "Đèo Thung Khe"
  },
  {
    id: 3,
    title: "Dự báo thời tiết 24h tới",
    content: "Khu vực Hòa Bình tiếp tục có mưa vừa đến mưa to. Đề phòng lũ quét tại các suối nhỏ.",
    level: "info",
    timestamp: "3 giờ trước",
    location: "Toàn tỉnh"
  }
];

// 4. Dữ liệu Thông tin an toàn
export const MOCK_SAFETY_INFO = {
  guides: [
    {
      id: 1,
      title: "Kỹ năng sinh tồn khi xảy ra sạt lở đất",
      category: "Kỹ năng",
      content: "Khi nghe tiếng nổ lớn hoặc thấy cây cối nghiêng, hãy chạy ngay ra khỏi khu vực nguy hiểm theo hướng vuông góc với hướng sạt lở. Tuyệt đối không trú ẩn dưới gầm cầu thang hoặc các công trình yếu.",
      updatedAt: "2024-12-01"
    },
    {
      id: 2,
      title: "Bộ quy tắc ứng phó trước mùa mưa bão",
      category: "Tài liệu",
      content: "1. Gia cố nhà cửa. 2. Chuẩn bị túi cứu thương. 3. Lưu số điện thoại khẩn cấp. 4. Theo dõi bản đồ cảnh báo thường xuyên.",
      updatedAt: "2024-11-20"
    }
  ],
  safeZones: [
    {
      id: 1,
      name: "Trường THPT Hòa Bình",
      address: "Số 10, Đường Lê Lợi, TP. Hòa Bình",
      capacity: "500 người",
      status: "Sẵn sàng"
    },
    {
      id: 2,
      name: "Nhà văn hóa Xã A",
      address: "Thôn 2, Xã A, Huyện Cao Phong",
      capacity: "200 người",
      status: "Đang sửa chữa"
    }
  ],
  contacts: [
    { id: 1, name: "Cứu hộ cứu nạn tỉnh", phone: "114" },
    { id: 2, name: "Y tế khẩn cấp", phone: "115" },
    { id: 3, name: "Ban chỉ huy phòng chống thiên tai", phone: "0218 385 1234" }
  ]
};

// 5. Dữ liệu Lịch sử báo cáo của tôi
export const MOCK_MY_REPORTS = [
  {
    id: 1,
    title: "Sạt lở nhẹ tại đường liên xã",
    location: "Xã A, Huyện Cao Phong",
    date: "2024-12-07",
    status: "Hoàn tất",
    feedback: "Đã cử đội công binh xuống dọn dẹp xong."
  },
  {
    id: 2,
    title: "Vết nứt lớn sau nhà văn hóa",
    location: "Thị trấn Đà Bắc",
    date: "2024-12-08",
    status: "Đang xử lý",
    feedback: "Đang điều máy xúc tới hiện trường."
  },
  {
    id: 3,
    title: "Đất đá lăn xuống đường 6",
    location: "Dốc Cun",
    date: "2024-12-09",
    status: "Đang tiếp nhận",
    feedback: "Hệ thống đã ghi nhận, đang chờ duyệt."
  }
];

// 1. Thêm danh sách toàn bộ báo cáo từ dân (để Officer xử lý)
export const MOCK_ALL_REPORTS = [
  {
    id: 1,
    sender: "Nguyễn Văn Dân",
    title: "Sạt lở nhẹ tại đường liên xã",
    location: "Xã A, Huyện Cao Phong",
    date: "2024-12-07",
    status: "Hoàn tất",
    feedback: "Đã cử đội công binh xuống dọn dẹp xong."
  },
  {
    id: 2,
    sender: "Trần Thị B",
    title: "Vết nứt lớn sau nhà văn hóa",
    location: "Thị trấn Đà Bắc",
    date: "2024-12-08",
    status: "Đang xử lý",
    feedback: "Đang điều máy xúc tới hiện trường."
  },
  {
    id: 3,
    sender: "Lê Văn C",
    title: "Đất đá lăn xuống đường 6",
    location: "Dốc Cun",
    date: "2024-12-09",
    status: "Đang tiếp nhận",
    feedback: "Chưa có phản hồi."
  }
];

// 6. Danh sách người dùng hệ thống (Cho Admin quản lý)
export const MOCK_USERS_LIST = [
  { id: 1, name: "Nguyễn Văn Dân", email: "dan@gmail.com", role: "citizen", status: "active" },
  { id: 2, name: "Cán Bộ Xã A", email: "canbo@tlu.edu.vn", role: "officer", status: "active" },
  { id: 3, name: "Trần Thị B", email: "b@gmail.com", role: "citizen", status: "locked" }, // Tài khoản bị khóa
  { id: 99, name: "Quản Trị Viên", email: "admin@tlu.edu.vn", role: "admin", status: "active" },
];