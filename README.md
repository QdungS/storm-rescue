# Hệ thống Quản lý Cảnh báo Sạt lở

Hệ thống hỗ trợ cảnh báo thiên tai bão lũ, sạt lở do lũ lụt gây ra, được xây dựng với MERN Stack và Clean Architecture.

## 🚀 Bắt đầu nhanh

Xem file **[START_HERE.md](START_HERE.md)** để bắt đầu ngay!

Hoặc xem **[QUICK_START.md](QUICK_START.md)** cho hướng dẫn nhanh 5 phút.

## Cấu trúc dự án

```
landslide-system/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
└── README.md
```

## Cài đặt và chạy

### Backend

1. Vào thư mục backend:
```bash
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example` và cấu hình MongoDB

4. Chạy server:
```bash
npm run dev
```

Backend sẽ chạy tại `http://localhost:5000`

### Frontend

1. Vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

4. Chạy development server:
```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

## Tính năng

- **Authentication**: Đăng ký, đăng nhập với JWT
- **Quản lý điểm sạt lở**: CRUD điểm sạt lở trên bản đồ
- **Cảnh báo**: Tạo và quản lý cảnh báo thiên tai
- **Báo cáo từ dân**: Người dân gửi báo cáo sự cố, cán bộ xử lý
- **Quản lý người dùng**: Admin quản lý tài khoản
- **Thông tin an toàn**: Hướng dẫn, khu vực an toàn, liên hệ khẩn cấp

## Kiến trúc

### Backend - Clean Architecture
- **Domain Layer**: Business logic và entities
- **Application Layer**: Use cases
- **Infrastructure Layer**: Database, HTTP, external services
- **Shared**: Utilities và constants

### Frontend
- React với Vite
- React Router cho routing
- Ant Design cho UI components
- Leaflet cho bản đồ
- Axios cho API calls

## Tài khoản mẫu

- **Admin**: admin@tlu.edu.vn / 123456
- **Officer**: canbo@tlu.edu.vn / 123456
- **Citizen**: dan@gmail.com / 123456
