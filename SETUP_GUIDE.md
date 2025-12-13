# Hướng dẫn Setup và Chạy Hệ thống Quản lý Sạt lở

## Yêu cầu hệ thống

- **Node.js**: phiên bản 18.x trở lên
- **MongoDB**: phiên bản 5.x trở lên (đang chạy thủ công)
- **npm**: phiên bản 9.x trở lên

## Bước 1: Kiểm tra MongoDB

### Kiểm tra MongoDB đang chạy

Mở terminal/command prompt và kiểm tra:

```bash
# Windows
mongod --version

# Hoặc kiểm tra service đang chạy
sc query MongoDB
```

### Khởi động MongoDB (nếu chưa chạy)

```bash
# Windows - Nếu cài đặt như service
net start MongoDB

# Hoặc chạy thủ công
mongod --dbpath "C:\data\db"
```

**Lưu ý**: Đảm bảo MongoDB đang chạy trên port mặc định `27017`

## Bước 2: Setup Backend

### 2.1. Vào thư mục backend

```bash
cd backend
```

### 2.2. Cài đặt dependencies

```bash
npm install
```

### 2.3. Tạo file .env

Tạo file `.env` trong thư mục `backend/` với nội dung:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Kết nối MongoDB đang chạy thủ công
MONGODB_URI=mongodb://localhost:27017/landslide-system

# JWT Secrets (Thay đổi trong production!)
JWT_SECRET=landslide-system-secret-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=landslide-refresh-secret-change-in-production
JWT_REFRESH_EXPIRE=30d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS - URL frontend
FRONTEND_URL=http://localhost:5173
```

### 2.4. Tạo thư mục uploads

```bash
# Windows
mkdir uploads

# Linux/Mac
mkdir -p uploads
```

### 2.5. Chạy backend

```bash
# Development mode (với auto-reload)
npm run dev

# Hoặc production mode
npm start
```

**Kiểm tra**: Mở trình duyệt và truy cập `http://localhost:5000/health`

Bạn sẽ thấy:
```json
{
  "status": "OK",
  "timestamp": "2025-01-XX..."
}
```

## Bước 3: Setup Frontend

### 3.1. Vào thư mục frontend

Mở terminal mới và chạy:

```bash
cd frontend
```

### 3.2. Cài đặt dependencies

```bash
npm install
```

### 3.3. Tạo file .env

Tạo file `.env` trong thư mục `frontend/` với nội dung:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3.4. Chạy frontend

```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

## Bước 4: Kiểm tra kết nối

### 4.1. Kiểm tra Backend

1. Mở trình duyệt: `http://localhost:5000/health`
2. Phải thấy response: `{"status":"OK",...}`

### 4.2. Kiểm tra Frontend

1. Mở trình duyệt: `http://localhost:5173`
2. Trang chủ phải hiển thị bản đồ

### 4.3. Kiểm tra kết nối Database

Backend sẽ tự động kết nối MongoDB khi khởi động. Kiểm tra console log:

```
✓ MongoDB Connected: localhost:27017
✓ Server running on port 5000
```

## Bước 5: Tạo tài khoản đầu tiên

### Cách 1: Qua API (Postman/Thunder Client)

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Quản Trị Viên",
  "email": "admin@tlu.edu.vn",
  "password": "123456",
  "role": "admin"
}
```

### Cách 2: Qua Frontend

1. Truy cập `http://localhost:5173/register`
2. Đăng ký tài khoản mới
3. Đăng nhập với tài khoản vừa tạo

## Tài khoản mẫu (nếu đã seed data)

- **Admin**: admin@tlu.edu.vn / 123456
- **Officer**: canbo@tlu.edu.vn / 123456
- **Citizen**: dan@gmail.com / 123456

## Xử lý lỗi thường gặp

### Lỗi: "MongoDB connection error"

**Nguyên nhân**: MongoDB chưa chạy hoặc URI sai

**Giải pháp**:
1. Kiểm tra MongoDB đang chạy: `mongod --version`
2. Kiểm tra port 27017 không bị chiếm
3. Kiểm tra file `.env` có `MONGODB_URI` đúng

### Lỗi: "Port 5000 already in use"

**Giải pháp**:
1. Đổi PORT trong file `.env` backend
2. Hoặc tắt ứng dụng đang dùng port 5000

### Lỗi: "Cannot find module"

**Giải pháp**:
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: CORS error

**Giải pháp**:
1. Kiểm tra `FRONTEND_URL` trong backend `.env`
2. Đảm bảo frontend `.env` có `VITE_API_URL` đúng

## Cấu trúc thư mục sau khi setup

```
landslide-system/
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Chạy đồng thời Backend và Frontend

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Production Build

### Backend:
```bash
cd backend
npm start
```

### Frontend:
```bash
cd frontend
npm run build
# Files sẽ được build vào thư mục dist/
```

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. MongoDB đang chạy
2. Port 5000 và 5173 không bị chiếm
3. File `.env` đã được tạo và cấu hình đúng
4. Dependencies đã được cài đặt đầy đủ

