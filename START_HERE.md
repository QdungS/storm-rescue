# 🚀 Bắt đầu tại đây!

## ✅ Đã hoàn thành

Hệ thống đã được cấu hình đầy đủ với:
- ✅ Backend MERN Stack với Clean Architecture
- ✅ Frontend React + Vite
- ✅ Tất cả API endpoints
- ✅ Authentication & Authorization
- ✅ File upload cho báo cáo
- ✅ Seed data script

## 📋 Các bước chạy ứng dụng

### Bước 1: Kiểm tra MongoDB

Đảm bảo MongoDB đang chạy trên port 27017:

```bash
# Kiểm tra
mongod --version

# Nếu chưa chạy, khởi động:
# Windows: net start MongoDB
# Hoặc: mongod --dbpath "C:\data\db"
```

### Bước 2: Setup Backend

```bash
cd backend

# 1. Cài đặt dependencies
npm install

# 2. Tạo file .env (copy từ .env.example)
# Chỉnh sửa MONGODB_URI nếu cần

# 3. Tạo thư mục uploads
mkdir uploads

# 4. Chạy backend
npm run dev
```

**Kiểm tra**: Mở `http://localhost:5000/health` → Phải thấy `{"status":"OK"}`

### Bước 3: Seed dữ liệu mẫu (Khuyến nghị)

```bash
cd backend
npm run seed
```

Sẽ tạo:
- 3 tài khoản test (admin, officer, citizen)
- Dữ liệu mẫu cho tất cả modules

### Bước 4: Setup Frontend

```bash
# Terminal mới
cd frontend

# 1. Cài đặt dependencies
npm install

# 2. Tạo file .env (copy từ .env.example)
# VITE_API_URL=http://localhost:5000/api

# 3. Chạy frontend
npm run dev
```

**Kiểm tra**: Mở `http://localhost:5173` → Phải thấy bản đồ

## 🔑 Tài khoản test (sau khi seed)

- **Admin**: admin@tlu.edu.vn / 123456
- **Officer**: canbo@tlu.edu.vn / 123456  
- **Citizen**: dan@gmail.com / 123456

## 📁 Cấu trúc file .env

### backend/.env
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/landslide-system
JWT_SECRET=landslide-system-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=landslide-refresh-secret
JWT_REFRESH_EXPIRE=30d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

### frontend/.env
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Chạy đồng thời

**Terminal 1** (Backend):
```bash
cd backend
npm run dev
```

**Terminal 2** (Frontend):
```bash
cd frontend
npm run dev
```

## 📚 Tài liệu tham khảo

- **QUICK_START.md**: Hướng dẫn nhanh (5 phút)
- **SETUP_GUIDE.md**: Hướng dẫn chi tiết đầy đủ
- **ARCHITECTURE.md**: Giải thích kiến trúc Clean Architecture
- **README.md**: Tổng quan dự án

## 🐛 Xử lý lỗi

### MongoDB không kết nối
- Kiểm tra MongoDB đang chạy
- Kiểm tra `MONGODB_URI` trong `.env`

### Port đã được sử dụng
- Đổi PORT trong backend `.env`
- Hoặc tắt ứng dụng đang dùng port

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

## ✨ Tính năng đã implement

### Backend APIs
- ✅ Authentication (Login, Register)
- ✅ Landslide Points (CRUD)
- ✅ Warnings (CRUD)
- ✅ Reports (Submit, Update status)
- ✅ User Management (CRUD, Lock/Unlock)
- ✅ Saved Locations
- ✅ Safety Guides, Safe Zones, Emergency Contacts

### Frontend
- ✅ Authentication flow
- ✅ Map với Leaflet
- ✅ Admin Dashboard
- ✅ Officer Dashboard
- ✅ Citizen Report
- ✅ User Profile với saved locations
- ✅ Safety Info page

## 🎉 Sẵn sàng sử dụng!

Sau khi hoàn thành các bước trên, hệ thống đã sẵn sàng để sử dụng!

