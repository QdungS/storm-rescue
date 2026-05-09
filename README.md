# 🌊 HỆ THỐNG HỖ TRỢ CỨU HỘ BÃO (Storm Rescue)

> Hệ thống quản lý và điều phối cứu hộ bão — Đồ án tốt nghiệp Đại học Thăng Long.

## 📖 Giới thiệu

**Storm Rescue** là nền tảng web hỗ trợ công tác cứu hộ thiên tai bão lũ. Hệ thống cho phép người dân gửi yêu cầu cứu hộ khẩn cấp, điều phối viên tiếp nhận và phân công nhiệm vụ, lực lượng cứu hộ xử lý và báo cáo tiến độ — tất cả được hiển thị trực quan trên bản đồ thời gian thực.

### Tính năng chính

- 🗺️ **Bản đồ cứu hộ thời gian thực** — Hiển thị các điểm cứu hộ, khu vực an toàn trên bản đồ Leaflet
- 🆘 **Gửi yêu cầu cứu hộ** — Người dân tự gửi yêu cầu (có hoặc không cần đăng nhập)
- 📋 **Điều phối & quản lý** — Điều phối viên tiếp nhận, phân công nhiệm vụ cho đội cứu hộ
- 👷 **Quản lý nhiệm vụ** — Đội cứu hộ nhận nhiệm vụ, cập nhật trạng thái xử lý
- 📧 **Thông báo email tự động** — Gửi mã theo dõi và cập nhật tiến độ cứu hộ qua email
- ⚠️ **Hệ thống cảnh báo** — Phát cảnh báo thiên tai theo khu vực và mức độ
- 🛡️ **Thông tin an toàn** — Khu vực an toàn, liên hệ khẩn cấp, hướng dẫn phòng tránh
- 🤖 **Chatbot AI** — Trợ lý AI hỗ trợ người dân tra cứu thông tin trong tình huống khẩn cấp
- 🔐 **Phân quyền đa vai trò** — Admin, Điều phối viên, Đội cứu hộ, Người dân
- 🔍 **Tra cứu bằng mã cứu hộ** — Người dân tra cứu tiến độ xử lý yêu cầu

---

## 🏗️ Kiến trúc hệ thống

### Tổng quan

```
┌─────────────────┐      HTTP/REST       ┌─────────────────┐      Mongoose       ┌──────────────┐
│    Frontend     │  ◄──────────────────► │    Backend      │  ◄────────────────► │   MongoDB    │
│  React + Vite   │                      │  Express.js     │                     │   Database   │
│  Ant Design     │                      │  Clean Arch     │                     │              │
│  Leaflet Map    │                      │  JWT Auth       │                     │              │
└─────────────────┘                      └─────────────────┘                     └──────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │  Nodemailer  │
                                         │  (SMTP/Gmail)│
                                         └──────────────┘
```

### Kiến trúc Backend (Clean Architecture)

```
backend/src/
├── application/              # Tầng Application — Business Logic
│   └── usecases/
│       ├── auth/             # Đăng nhập, quên/đổi mật khẩu
│       ├── rescue/           # Tạo, cập nhật, xóa yêu cầu cứu hộ
│       ├── safety/           # Quản lý khu vực an toàn, liên hệ, hướng dẫn
│       ├── user/             # Quản lý tài khoản người dùng
│       └── warning/          # Quản lý cảnh báo thiên tai
│
├── domain/                   # Tầng Domain — Entities & Interfaces
│   ├── entities/             # Đối tượng nghiệp vụ (User, RescueRequest)
│   └── repositories/        # Interface repository (abstraction)
│
├── infrastructure/           # Tầng Infrastructure — Triển khai cụ thể
│   ├── config/               # Cấu hình (env, JWT)
│   ├── database/
│   │   ├── mongoose/
│   │   │   ├── connection.js # Kết nối MongoDB
│   │   │   └── models/       # Mongoose Schema (User, RescueRequest, Warning,...)
│   │   └── repositories/    # Triển khai Repository cụ thể
│   ├── http/
│   │   ├── controllers/      # Xử lý request/response
│   │   ├── middleware/       # Auth, Error, Validation middleware
│   │   └── routes/           # Định tuyến API
│   └── services/             # Dịch vụ ngoài (MailService)
│
└── shared/                   # Tầng Shared — Dùng chung
    ├── constants/            # Hằng số (Roles, Status)
    ├── errors/               # Custom error classes
    └── utils/                # Tiện ích dùng chung
```

### Cấu trúc Frontend

```
frontend/src/
├── App.jsx                   # Root component, Routing, Layout chính
├── main.jsx                  # Entry point
├── components/
│   ├── MapComponent.jsx      # Bản đồ Leaflet hiển thị điểm cứu hộ
│   ├── Chatbot.jsx           # Chatbot AI trợ lý khẩn cấp
│   └── WarningList.jsx       # Danh sách cảnh báo thiên tai
├── context/
│   └── AuthContext.jsx       # Quản lý trạng thái đăng nhập (React Context)
├── pages/
│   ├── AdminDashboard.jsx    # Trang quản trị (Admin)
│   ├── CoordinatorDashboard.jsx  # Trang điều phối viên
│   ├── OfficerDashboard.jsx  # Trang đội cứu hộ
│   ├── CitizenReport.jsx     # Gửi & tra cứu yêu cầu cứu hộ
│   ├── SafetyInfo.jsx        # Thông tin an toàn
│   ├── Login.jsx             # Đăng nhập
│   ├── ForgotPassword.jsx    # Quên mật khẩu
│   └── ResetPassword.jsx     # Đặt lại mật khẩu
└── services/
    ├── api.js                # Axios instance + interceptors
    ├── authService.js        # API xác thực
    ├── rescueService.js      # API cứu hộ
    ├── warningService.js     # API cảnh báo
    ├── safetyService.js      # API thông tin an toàn
    └── userService.js        # API quản lý người dùng
```

---

## 🛠️ Công nghệ sử dụng

### Backend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Node.js** | v18+ | Runtime |
| **Express.js** | ^4.18 | Web framework |
| **MongoDB** | v6+ | Cơ sở dữ liệu NoSQL |
| **Mongoose** | ^8.0 | ODM cho MongoDB |
| **JWT** | ^9.0 | Xác thực token |
| **bcryptjs** | ^2.4 | Mã hóa mật khẩu |
| **Nodemailer** | ^8.0 | Gửi email thông báo |
| **Helmet** | ^7.1 | Bảo mật HTTP headers |
| **express-rate-limit** | ^7.1 | Giới hạn request |
| **express-validator** | ^7.0 | Validate dữ liệu đầu vào |

### Frontend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **React** | ^19.2 | UI Library |
| **Vite** | 7.x | Build tool |
| **Ant Design** | ^6.1 | UI Component Library |
| **React Router** | ^7.10 | Định tuyến SPA |
| **Leaflet** | ^1.9 | Bản đồ tương tác |
| **React-Leaflet** | ^5.0 | Tích hợp Leaflet vào React |
| **Axios** | ^1.13 | HTTP Client |
| **Lucide React** | ^0.556 | Bộ icon |
| **TailwindCSS** | ^3.4 | CSS utility framework |

---

## 📋 Yêu cầu hệ thống

| Phần mềm | Phiên bản tối thiểu |
|---|---|
| Node.js | v18+ |
| MongoDB | v6+ (hoặc MongoDB Atlas) |
| npm | v9+ |
| Trình duyệt | Chrome/Firefox/Edge (bản mới nhất) |

---

## 🚀 Hướng dẫn cài đặt & chạy dự án

### 1. Clone dự án

```bash
git clone https://github.com/QdungS/storm-rescue.git
cd storm-rescue
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cấu hình file `.env` (Backend)

Tạo file `backend/.env` với nội dung:

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

> **Lưu ý về SMTP_PASS:**
> - Truy cập [Google App Passwords](https://myaccount.google.com/apppasswords)
> - Tạo App Password mới → sao chép mật khẩu 16 ký tự → dán vào `SMTP_PASS`
> - Yêu cầu bật xác minh 2 bước trên tài khoản Google

> **Sử dụng MongoDB Atlas (cloud):**
> ```
> MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/storm-rescue
> ```

### 4. Cài đặt Frontend

```bash
cd frontend
npm install
```

### 5. Cấu hình file `.env` (Frontend)

Tạo file `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001
```

### 6. Chạy dự án

Mở **2 terminal** riêng biệt:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

Kết quả mong đợi:
```
✓ Database connected
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

### 7. Truy cập ứng dụng

Mở trình duyệt tại: **http://localhost:5173**

---

## 🌱 Khởi tạo dữ liệu mẫu (Seed)

> **⚠️ Lưu ý:** Lệnh seed sẽ **xóa toàn bộ dữ liệu cũ** và tạo dữ liệu mẫu mới.

```bash
cd backend
npm run seed
```

### Tài khoản mặc định sau khi seed

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Quản trị viên (Admin) | admin@gmail.com | 123456 |
| Điều phối viên (Coordinator) | dieuphoi@gmail.com | 123456 |
| Đội cứu hộ 1 (Officer) | cuuho1@gmail.com | 123456 |
| Đội cứu hộ 2 (Officer) | cuuho2@gmail.com | 123456 |

---

## 🛡️ Phân quyền hệ thống

| Vai trò | Mã vai trò | Quyền hạn |
|---|---|---|
| **Quản trị viên** | `admin` | Quản lý tài khoản, cảnh báo, khu vực an toàn, hướng dẫn an toàn, liên hệ khẩn cấp, thống kê toàn hệ thống |
| **Điều phối viên** | `coordinator` | Tiếp nhận & điều phối yêu cầu cứu hộ, phân công đội cứu hộ, quản lý cảnh báo — **giới hạn theo tỉnh** |
| **Đội cứu hộ** | `officer` | Nhận & xử lý nhiệm vụ cứu hộ, cập nhật tiến độ, quản lý cảnh báo & khu vực an toàn — **giới hạn theo tỉnh** |
| **Người dân** | `citizen` | Gửi yêu cầu cứu hộ, xem bản đồ, tra cứu tiến độ bằng mã cứu hộ, xem thông tin an toàn |
| **Khách** | (không đăng nhập) | Xem bản đồ, gửi yêu cầu cứu hộ, tra cứu bằng mã cứu hộ |

---

## 🔧 API Endpoints

### Xác thực (`/api/auth`)

| Method | Endpoint | Mô tả | Xác thực |
|---|---|---|---|
| POST | `/api/auth/login` | Đăng nhập | Không |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | ✅ JWT |
| POST | `/api/auth/forgot-password` | Gửi mã khôi phục mật khẩu | Không |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu | Không |

### Yêu cầu cứu hộ (`/api/rescues`)

| Method | Endpoint | Mô tả | Xác thực |
|---|---|---|---|
| GET | `/api/rescues` | Lấy danh sách yêu cầu cứu hộ | Tùy chọn |
| GET | `/api/rescues/code/:code` | Tra cứu theo mã cứu hộ | Tùy chọn |
| POST | `/api/rescues` | Tạo yêu cầu cứu hộ mới | Tùy chọn |
| PUT | `/api/rescues/:id` | Cập nhật yêu cầu cứu hộ | ✅ citizen/officer/coordinator |
| DELETE | `/api/rescues/:id` | Xóa yêu cầu cứu hộ | ✅ coordinator/officer |
| POST | `/api/rescues/:id/accept-task` | Nhận nhiệm vụ cứu hộ | ✅ officer/coordinator |
| POST | `/api/rescues/:id/report-fake` | Báo cáo yêu cầu giả mạo | ✅ officer/coordinator |

### Cảnh báo (`/api/warnings`)

| Method | Endpoint | Mô tả | Xác thực |
|---|---|---|---|
| GET | `/api/warnings` | Lấy danh sách cảnh báo | Tùy chọn |
| POST | `/api/warnings` | Tạo cảnh báo mới | ✅ admin/officer/coordinator |
| PUT | `/api/warnings/:id` | Cập nhật cảnh báo | ✅ admin/officer/coordinator |
| DELETE | `/api/warnings/:id` | Xóa cảnh báo | ✅ admin/officer/coordinator |

### Thông tin an toàn (`/api/safety`)

| Method | Endpoint | Mô tả | Xác thực |
|---|---|---|---|
| GET | `/api/safety/guides` | Lấy hướng dẫn an toàn | Không |
| POST | `/api/safety/guides` | Tạo hướng dẫn | ✅ admin |
| PUT | `/api/safety/guides/:id` | Sửa hướng dẫn | ✅ admin |
| DELETE | `/api/safety/guides/:id` | Xóa hướng dẫn | ✅ admin |
| GET | `/api/safety/safe-zones` | Lấy khu vực an toàn | Tùy chọn |
| POST | `/api/safety/safe-zones` | Tạo khu vực an toàn | ✅ admin/officer |
| PUT | `/api/safety/safe-zones/:id` | Sửa khu vực an toàn | ✅ admin/officer |
| DELETE | `/api/safety/safe-zones/:id` | Xóa khu vực an toàn | ✅ admin/officer |
| GET | `/api/safety/contacts` | Lấy liên hệ khẩn cấp | Tùy chọn |
| POST | `/api/safety/contacts` | Tạo liên hệ khẩn cấp | ✅ admin/officer |
| PUT | `/api/safety/contacts/:id` | Sửa liên hệ khẩn cấp | ✅ admin/officer |
| DELETE | `/api/safety/contacts/:id` | Xóa liên hệ khẩn cấp | ✅ admin/officer |

### Quản lý người dùng (`/api/users`)

| Method | Endpoint | Mô tả | Xác thực |
|---|---|---|---|
| GET | `/api/users` | Lấy danh sách người dùng | ✅ admin/coordinator |
| POST | `/api/users` | Tạo tài khoản mới | ✅ admin |
| PUT | `/api/users/:id` | Cập nhật tài khoản | ✅ admin |
| DELETE | `/api/users/:id` | Xóa tài khoản | ✅ admin |
| PUT | `/api/users/:id/toggle-lock` | Khóa/Mở khóa tài khoản | ✅ admin |

### Chatbot AI (`/api/chat`)

| Method | Endpoint | Mô tả | Xác thực |
|---|---|---|---|
| POST | `/api/chat` | Gửi tin nhắn, nhận phản hồi AI | Không |

### Hệ thống

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/` | Thông tin API |
| GET | `/health` | Kiểm tra trạng thái server |

---

## 📊 Luồng xử lý chính

### Luồng gửi yêu cầu cứu hộ

```
Người dân gửi yêu cầu
        │
        ▼
  Hệ thống tạo mã cứu hộ (VD: RES-XXXXXX)
        │
        ▼
  Gửi email xác nhận + mã theo dõi ──► Email người dân
        │
        ▼
  Trạng thái: "Chờ tiếp nhận"
        │
        ▼
  Điều phối viên tiếp nhận & phân công
        │
        ▼
  Trạng thái: "Đang xử lý" ──► Email thông báo
        │
        ▼
  Đội cứu hộ xử lý & báo cáo hoàn tất
        │
        ▼
  Trạng thái: "Đã giải quyết" ──► Email thông báo
```

### Trạng thái yêu cầu cứu hộ

| Trạng thái | Mô tả |
|---|---|
| `Chờ tiếp nhận` | Yêu cầu mới, chưa có ai xử lý |
| `Đang xử lý` | Đã phân công, đội cứu hộ đang tiếp cận |
| `Đã giải quyết` | Nhiệm vụ hoàn tất, đã cứu hộ thành công |
| `Từ chối` | Yêu cầu bị từ chối (giả mạo, trùng lặp,...) |

---

## 🗄️ Cơ sở dữ liệu

### Collections

| Collection | Model | Mô tả |
|---|---|---|
| `users` | UserModel | Tài khoản người dùng |
| `rescuerequests` | RescueRequestModel | Yêu cầu cứu hộ |
| `warnings` | WarningModel | Cảnh báo thiên tai |
| `safezones` | SafeZoneModel | Khu vực an toàn |
| `safetyguides` | SafetyGuideModel | Hướng dẫn an toàn |
| `emergencycontacts` | EmergencyContactModel | Liên hệ khẩn cấp |

### Kiểm tra kết nối MongoDB

**Cách 1 — Xem log backend:**
```
✓ Database connected       → Thành công
✗ MongoDB connection error → Thất bại
```

**Cách 2 — Kiểm tra MongoDB service (Windows):**
```bash
sc query MongoDB
```

**Cách 3 — Kết nối trực tiếp:**
```bash
mongosh "mongodb://localhost:27017/storm-rescue"
show collections
db.users.countDocuments()
db.rescuerequests.countDocuments()
```

**Cách 4 — Health check API:**
```bash
curl http://localhost:5001/health
# Kết quả: { "status": "OK", "timestamp": "..." }
```

---

## ❗ Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB chưa chạy | Khởi động MongoDB service hoặc chạy `mongod` |
| `MODULE_NOT_FOUND` | Chưa cài dependencies | Chạy `npm install` trong cả `backend/` và `frontend/` |
| `CORS error` trên trình duyệt | Frontend URL không khớp | Kiểm tra `FRONTEND_URL` trong `backend/.env` |
| Không gửi được email | Sai cấu hình SMTP | Kiểm tra `SMTP_USER`, `SMTP_PASS` (dùng App Password) |
| `JWT malformed` | Token hết hạn hoặc sai | Đăng nhập lại để lấy token mới |
| Bản đồ không hiển thị | Lỗi Leaflet CSS | Kiểm tra import CSS Leaflet trong `index.css` |
| `EADDRINUSE :5001` | Cổng đã bị chiếm | Đổi `PORT` trong `.env` hoặc tắt process cũ |

---

## 📜 Scripts

### Backend

```bash
npm run dev      # Chạy development mode (auto-reload)
npm start        # Chạy production mode
npm run seed     # Khởi tạo dữ liệu mẫu
```

### Frontend

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run preview  # Preview bản build
npm run lint     # Kiểm tra code style
```

---

## 🌐 Deploy

### Frontend — Vercel

Dự án đã được cấu hình sẵn file `vercel.json` trong thư mục `frontend/`.

### Backend — Render / Railway / VPS

Đảm bảo cấu hình các biến môi trường (Environment Variables) tương tự file `.env` trên hosting.

---

## 👨‍💻 Tác giả

**Storm Rescue 2026** — Đồ án tốt nghiệp Đại học Thăng Long (Thang Long University)
