# TÀI LIỆU CHI TIẾT: KIẾN TRÚC MÃ NGUỒN VÀ LUỒNG HOẠT ĐỘNG (STORM RESCUE)

Tài liệu này giải thích chi tiết cấu trúc thư mục, chức năng của từng file/thành phần chính trong hệ thống và luồng hoạt động cụ thể của từng nghiệp vụ.

---

## 1. Cấu trúc tổng quan của dự án

Dự án được xây dựng dựa trên nguyên lý kiến trúc sạch (Clean Architecture) cho backend và React (Vite) cho frontend.

### 1.1. Backend (Node.js/Express)
Thư mục gốc: `backend/`

* **`server.js`**: Điểm khởi đầu (Entry point). Khởi chạy máy chủ Express, cấu hình middleware toàn cục (CORS, JSON parser), kết nối với cơ sở dữ liệu MongoDB và định tuyển (route routing).
* **`src/domain/`**: Chứa các thực thể (Entities/Models). Nhìn chung, bạn sẽ khai báo các Data Model sử dụng Mongoose tại đây (như `User`, `RescueRequest`, `Warning`).
* **`src/application/usecases/`**: Tầng chứa logic nghiệp vụ cốt lõi. Controllers sau khi lấy tham số sẽ gọi Use Case để xử lý dữ liệu thay vì xử lý trực tiếp.
* **`src/infrastructure/`**: Tầng kết nối với bên ngoài (Database, Network, v.v.).
  * **`database/`**: Các Repositories và logic truy vấn MongoDB, bao gồm cả file cấu hình `seed.js` để khởi tạo dữ liệu mẫu, mock data.
  * **`http/controllers/`**: Nhận Request từ người dùng, làm sạch Input, gọi Business Logic (Use Case), và trả kết quả HTTP Response (thường là định dạng JSON).
  * **`http/routes/`**: Nơi gắn kết giữa các đường dẫn (`/api/auth/login`, `/api/rescues`,...) tới đúng Controller tương ứng.
  * **`http/middleware/`**: Chứa các hàm kiểm duyệt trung gian (chẳng hạn như `auth.js` để kiểm tra JWT token, và kiểm tra quyền `Role`).
  * **`config/`**: Các thiết lập môi trường, tích hợp biến từ file `.env` (ví dụ: Database URL, JWT Secrets, SMTP config).
* **`src/shared/`**: Các hằng số (Constants), tiện ích mở rộng (Utils) và hàm xử lý chuẩn hóa đối tượng báo lỗi.

### 1.2. Frontend (React/Vite)
Thư mục gốc: `frontend/`

* **`src/App.jsx`**: Tệp gốc chứa hệ thống Router. Quản lý Điều hướng (Routing) bao gồm cả những Private Route (kiểm tra trạng thái đăng nhập để chặn người không có quyền bẻ khóa truy cập URL bảo mật).
* **`src/context/AuthContext.jsx`**: Trạng thái toàn cục React Context API quản lý thông tin phiên làm việc, tự động lưu và lấy (JWT) token để thực hiện Authentication.
* **`src/services/`**: Chứa các thư viện và cấu hình API client (như `axios`), đóng gói các lệnh POST/GET/PUT gọi lên backend theo từng file chuyên biệt (vd: `api.js`, `rescueService.js`).
* **`src/pages/`**: Tất cả các trang giao diện nguyên khối. Xem thêm tại mục 2 để biết chi tiết.
* **`src/components/`**: Mã nguồn UI component tái sử dụng (như Hệ thống Chatbot AI, Bản đồ số MapComponent, hay Bảng thông báo Cảnh báo khẩn - WarningList).

---

## 2. Chi tiết các luồng hoạt động (Workflows) cho từng chức năng

### 2.1 Chức năng Đăng nhập & Điều hướng theo phân quyền (Authorization)
* **Các file tham gia**:
  * Frontend: `Login.jsx` (Giao diện), `AuthContext.jsx` (Trạng thái)
  * Backend: `AuthController.js` (Controller), Route `/api/auth/login`
* **Luồng hoạt động**:
  1. Người dùng truy cập trang Đăng nhập và nhập `Email` & `Mật khẩu`. Bấm submit -> Gọi hàm API đăng nhập từ Frontend.
  2. Controller `AuthController.js` tiếp nhận. Nó tra cứu Email trong MongoDB (Collection Users). Nếu thấy, thực hiện kiểm tra đối chiếu mật khẩu mã hoá (Bcrypt).
  3. Nếu khớp, Backend sinh ra một chuỗi JSON Web Token (JWT) bên trong mã hóa `User_ID` và `Role`, sau đó tạo HTTP Response JSON gửi về Frontend.
  4. Tại Frontend, AuthContext nhận được `token` và thông tin `user`. Token được lưu vào memory/localStorage.
  5. Context cập nhật state chung. Hệ thống đánh giá quyền (Role) của User để đẩy (`Navigate`) họ về Dashboard phù hợp: Admin -> `/admin`, Coordinator -> `/coordinator`, Officer -> `/officer`.

### 2.2 Chức năng Gửi Yêu Cầu Cứu Hộ từ Người dân (Citizen Report)
* **Các file tham gia**:
  * Frontend: `CitizenReport.jsx` (Trang điền Form), `MapComponent.jsx` (Lấy tọa độ)
  * Backend: `RescueRequestController.js` (Controller xử lý), Route `POST /api/rescues`
* **Luồng hoạt động**:
  1. Người dân (đã đăng nhập hoặc form công khai) truy cập trang báo cáo khẩn cấp.
  2. Người báo cáo điền các trường: Tên, SĐT, Số lượng người mặc kẹt, Mức độ khẩn cấp, Mô tả tình trạng, và đánh dấu mốc trên Bản đồ số (để lấy kinh độ, vĩ độ).
  3. Bấm Submit -> Gửi gói dữ liệu lên Backend `POST /api/rescues`.
  4. Backend (Controller) nhận Input, kiểm tra (validate) nếu đầy đủ và hợp lệ sẽ gọi MongoDB lưu thành 1 Record (bản ghi) trong danh sách `RescueRequests` với trạng thái mặc định như là `Pending`.
  5. Một phản hồi "Tạo yêu cầu thành công" được gửi lại trình duyệt, trang web hiển thị Modal thông báo chấn an người dân.

### 2.3 Chức năng Điều Phối và Cứu Hộ (Dành cho Điều phối viên & Sự vụ)
* **Các file tham gia**:
  * Frontend: `CoordinatorDashboard.jsx` (Bảng điều khiển cho Coordinator)
  * Backend: `RescueRequestController.js` (Cập nhật, Lấy list), Middleware Auth
* **Luồng hoạt động**:
  1. Điều phối viên ở tại tỉnh/khu vực A truy cập hệ thống.
  2. Frontend đẩy Request dạng `GET /api/rescues` kèm JWT Token. Backend Middleware nhận diện role là 'Coordinator', áp dụng bộ lọc (filter theo Location/Province).
  3. Controller query dữ liệu, trả về danh sách các Yêu cầu cấp cứu dành riêng cho khu vực của họ báo về giao diện.
  4. Bảng điều khiển hiển thị dưới dạng Bảng & Bản đồ. Coordinator có thể ấn "Nắm bắt" -> gửi API cập nhật trạng thái (`PUT /api/rescues/:id`), chuyển `status: 'assigned'`, đổi `coordinator_id` thành ID của bản thân. Tiếp tục phân công Đội cấp cứu (`Officer`) đi ứng phó.

### 2.4 Chức năng Cập Nhật Trạng Thái Hiện Trường (Officer)
* **Các file tham gia**:
  * Frontend: `OfficerDashboard.jsx`
* **Luồng hoạt động**:
  1. Đội hỗ trợ hiện trường đăng nhập hiển thị giao diện báo cáo. Cập nhật được những nhiệm vụ trong trạng thái `assigned`.
  2. Khi đội cứu hộ đến vị trí, họ cập nhật trong Dashboard (`PUT`), backend lưu `status: 'in_progress'` hoặc `resolved` khi cứu hộ hoàn thành.

### 2.5 Chức năng Quản lý Dữ Liệu Nền và Cảnh Báo An Toàn (Từ Admin)
* **Các file tham gia**:
  * Frontend: `AdminDashboard.jsx`, `WarningList.jsx`
  * Backend: `WarningController.js` (Tin cảnh báo), `SafetyController.js` (Liên hệ & Khu vực)
* **Luồng hoạt động**:
  1. **Tạo Cảnh báo bão**: Admin vào tab Cảnh báo, nhập nội dung "Bão đổ bộ..." lên API khẩn `POST /api/warnings`. Lưu trữ trong CSDL.
  2. Tính năng hiển thị ở diện rộng cho tất cả user (Dải chạy đỏ WarningList trên website) gọi `GET /api/warnings` để hiện thụ trực tiếp cảnh báo mới nhất.
  3. **Quản lý danh bạ khẩn cấp (Emergency Contacts)**: Admin và Coordinator tại tỉnh thành có thể truy cập tab Safety, nhập danh sách Số điện thoại Bệnh viện, Công An. Dữ liệu được POST gửi lên `SafetyController.js` lưu trữ kèm thuộc tính `ProvinceID` để lọc và giới hạn quyền (như đã thiết lập theo logic Restriction by Province).

### 2.6 Khôi phục mật khẩu / Quên mật khẩu
* **Các file tham gia**: `ForgotPassword.jsx`, `ResetPassword.jsx`
* **Luồng hoạt động**:
  1. Nếu Admin hoặc Coordinator quên Pass, gõ vào email. Gửi API.
  2. Hệ thống mã hoá/ sinh ra một random Code hoặc thư gửi SMTP về Email bằng thư viện `nodemailer`.
  3. Người nhận bấm link mang token gửi về form `ResetPassword.jsx`.
  4. Backend đối chiếu Token. Nếu hợp lệ, lưu Password mới hoàn tất.

---
Tài liệu trên hệ thống hóa logic kết nối giữa UI, Mạng, Tầng nghiệp vụ và Cơ sở dữ liệu theo từng chức năng lớn của Hệ thống Cứu Hộ Sau Bão.
