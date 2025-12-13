# Hướng dẫn Nhanh - Chạy Hệ thống

## ⚡ Bước nhanh (5 phút)

### 1. Kiểm tra MongoDB đang chạy

```bash
# Kiểm tra MongoDB
mongod --version

# Nếu chưa chạy, khởi động:
# Windows: net start MongoDB
# Hoặc: mongod --dbpath "C:\data\db"
```

### 2. Setup Backend

```bash
cd backend

# Cài đặt
npm install

# Tạo file .env (copy từ .env.example và chỉnh sửa)
# MONGODB_URI=mongodb://localhost:27017/landslide-system

# Tạo thư mục uploads
mkdir uploads

# Chạy backend
npm run dev
```

**Kiểm tra**: Mở `http://localhost:5000/health` → Phải thấy `{"status":"OK"}`

### 3. Setup Frontend

```bash
# Terminal mới
cd frontend

# Cài đặt
npm install

# Tạo file .env
# VITE_API_URL=http://localhost:5000/api

# Chạy frontend
npm run dev
```

**Kiểm tra**: Mở `http://localhost:5173` → Phải thấy bản đồ

### 4. Seed dữ liệu mẫu (Tùy chọn)

```bash
cd backend
npm run seed
```

Sẽ tạo:
- 3 tài khoản: admin, officer, citizen
- 2 điểm sạt lở
- 2 cảnh báo
- 2 hướng dẫn an toàn
- 2 khu vực an toàn
- 3 liên hệ khẩn cấp

## 🔑 Tài khoản mẫu

Sau khi seed:
- **Admin**: admin@tlu.edu.vn / 123456
- **Officer**: canbo@tlu.edu.vn / 123456
- **Citizen**: dan@gmail.com / 123456

## 📝 File .env cần tạo

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

## 🚀 Chạy đồng thời

**Terminal 1** (Backend):
```bash
cd backend && npm run dev
```

**Terminal 2** (Frontend):
```bash
cd frontend && npm run dev
```

## ✅ Kiểm tra hoạt động

1. Backend: `http://localhost:5000/health` → `{"status":"OK"}`
2. Frontend: `http://localhost:5173` → Hiển thị bản đồ
3. Đăng nhập: Dùng tài khoản mẫu ở trên

## 🐛 Xử lý lỗi

**MongoDB không kết nối được:**
- Kiểm tra MongoDB đang chạy: `mongod --version`
- Kiểm tra port 27017 không bị chiếm
- Kiểm tra `MONGODB_URI` trong `.env`

**Port đã được sử dụng:**
- Đổi PORT trong backend `.env`
- Hoặc tắt ứng dụng đang dùng port đó

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Tài liệu chi tiết

Xem `SETUP_GUIDE.md` để biết thêm chi tiết.

