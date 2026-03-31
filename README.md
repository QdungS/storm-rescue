# 🌊 HỆ THỐNG CỨU HỘ SAU BÃO (Storm Rescue Platform)

Hệ thống quản lý cứu hộ sau bão — Đồ án Đại học Thăng Long.

## 📋 Yêu cầu hệ thống

| Phần mềm | Phiên bản tối thiểu |
|-----------|---------------------|
| Node.js | v18+ |
| MongoDB | v6+ (hoặc MongoDB Atlas) |
| npm | v9+ |

---

## 🚀 Hướng dẫn cài đặt & chạy dự án

### 1. Clone dự án

```bash
git clone <repository-url>
cd storm-rescue
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cấu hình file `.env` (Backend)

Tạo hoặc chỉnh sửa file `backend/.env`:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/storm-rescue
JWT_SECRET=storm-rescue-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=storm-rescue-refresh-secret
JWT_REFRESH_EXPIRE=30d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173

# Cấu hình Email (SMTP - Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Storm Rescue <your-email@gmail.com>
```

> **Lưu ý:** Nếu dùng MongoDB Atlas (cloud), đổi `MONGODB_URI` thành connection string của Atlas:
> ```
> MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/storm-rescue
> ```

### 4. Cài đặt Frontend

```bash
cd frontend
npm install
```

### 5. Chạy dự án

Mở **2 terminal** riêng biệt:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Kết quả mong đợi:
```
✓ MongoDB Connected: localhost
✓ Server running on port 5001
✓ Environment: development
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Kết quả mong đợi:
```
VITE v7.x.x ready
➜ Local: http://localhost:5173/
```

### 6. Truy cập ứng dụng

Mở trình duyệt tại: **http://localhost:5173**

---

## 🗄️ Kiểm tra kết nối MongoDB

### Cách 1: Xem log khi khởi động Backend

Khi chạy `npm run dev` trong thư mục `backend`, nếu kết nối thành công sẽ thấy:

```
✓ MongoDB Connected: localhost
```

Nếu kết nối thất bại sẽ thấy:

```
✗ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
✗ Failed to start server: ...
```

### Cách 2: Kiểm tra MongoDB có đang chạy không

**Windows (Service):**
```bash
sc query MongoDB
```
Hoặc mở **Services** (services.msc) → tìm "MongoDB Server" → kiểm tra trạng thái **Running**.

**Khởi động MongoDB thủ công (nếu chưa chạy):**
```bash
mongod --dbpath "C:\data\db"
```

### Cách 3: Kết nối trực tiếp bằng mongosh

```bash
mongosh "mongodb://localhost:27017/storm-rescue"
```

Nếu kết nối thành công, chạy các lệnh sau để kiểm tra dữ liệu:

```javascript
// Xem tất cả collections
show collections

// Đếm số tài khoản
db.users.countDocuments()

// Đếm số yêu cầu cứu hộ
db.rescuerequests.countDocuments()

// Xem danh sách tài khoản
db.users.find({}, { name: 1, email: 1, role: 1 }).pretty()
```

### Cách 4: Gọi API Health Check

```bash
curl http://localhost:5001/health
```

Kết quả mong đợi:
```json
{ "status": "OK", "timestamp": "2026-03-29T..." }
```

---

## 🌱 Khởi tạo dữ liệu mẫu (Seed)

Chạy lệnh sau để tạo dữ liệu mẫu ban đầu (sẽ **xóa toàn bộ dữ liệu cũ**):

```bash
cd backend
npm run seed
```

### Tài khoản mặc định sau khi seed

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Quản trị viên | admin@gmail.com | 123456 |
| Điều phối viên | dieuphoi@gmail.com | 123456 |
| Đội cứu hộ 1 | cuuho1@gmail.com | 123456 |
| Đội cứu hộ 2 | cuuho2@gmail.com | 123456 |


---

## 📁 Cấu trúc dự án

```
storm-rescue/
├── backend/
│   ├── server.js                    # Entry point
│   ├── .env                         # Cấu hình môi trường
│   ├── package.json
│   └── src/
│       ├── application/usecases/    # Business logic
│       ├── domain/                  # Entities & Interfaces
│       ├── infrastructure/
│       │   ├── config/              # Cấu hình (env, jwt)
│       │   ├── database/            # MongoDB models, repos, seed
│       │   └── http/                # Controllers, Routes, Middleware
│       └── shared/                  # Utils, Constants, Errors
│
├── frontend/
│   ├── package.json
│   └── src/
│       ├── App.jsx                  # Main app + Routing
│       ├── components/              # MapComponent, WarningList
│       ├── context/                 # AuthContext
│       ├── pages/                   # Dashboards, Login, SafetyInfo
│       └── services/               # API service files
│
└── README.md
```

---

## 🔧 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/rescues` | Lấy danh sách yêu cầu cứu hộ |
| POST | `/api/rescues` | Tạo yêu cầu cứu hộ mới |
| PUT | `/api/rescues/:id` | Cập nhật yêu cầu cứu hộ |
| GET | `/api/warnings` | Lấy danh sách cảnh báo |
| POST | `/api/warnings` | Tạo cảnh báo mới |
| GET | `/api/users` | Lấy danh sách người dùng |
| GET | `/api/safety/zones` | Lấy khu vực an toàn |
| GET | `/api/safety/contacts` | Lấy liên hệ khẩn cấp |
| GET | `/api/safety/guides` | Lấy hướng dẫn an toàn |
| GET | `/health` | Kiểm tra trạng thái server |

---

## 🛡️ Phân quyền hệ thống

| Vai trò | Quyền hạn |
|---------|-----------|
| **Quản trị viên** (Admin) | Quản lý tài khoản, cảnh báo, khu vực an toàn, hướng dẫn, liên hệ khẩn cấp, thống kê |
| **Điều phối viên** (Coordinator) | Tiếp nhận/điều phối yêu cầu cứu hộ, quản lý cảnh báo — giới hạn theo tỉnh |
| **Đội cứu hộ** (Officer) | Nhận/xử lý nhiệm vụ cứu hộ, quản lý cảnh báo & khu vực an toàn — giới hạn theo tỉnh |
| **Người dân** (Citizen) | Gửi yêu cầu cứu hộ, xem bản đồ, tra cứu thông tin an toàn |

---

## ❗ Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB chưa chạy | Khởi động MongoDB service |
| `MODULE_NOT_FOUND` | Chưa cài dependencies | Chạy `npm install` trong cả backend & frontend |
| `CORS error` trên trình duyệt | Frontend URL không khớp | Kiểm tra `FRONTEND_URL` trong `.env` |
| Không gửi được email | Sai cấu hình SMTP | Kiểm tra `SMTP_USER` và `SMTP_PASS` (dùng App Password của Gmail) |

---

**Storm Rescue 2026 — Thang Long University Project**
