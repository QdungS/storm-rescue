# GIẢI THÍCH CHI TIẾT CÁC FILE BACKEND VÀ CÁCH HOẠT ĐỘNG

Dự án Storm Rescue phần backend được thiết kế theo nguyên lý **Clean Architecture** (Kiến trúc Sạch). Điều này giúp phân tách rõ ràng trách nhiệm của từng thành phần, đảm bảo tính dễ bảo trì và dễ mở rộng. Dưới đây là phân tích chi tiết về từng file và thư mục.

---

## 1. Mức Cơ Sở (Root Level)

- **`server.js`**: 
  - **Chức năng**: Đây là file "entry point" (điểm khởi đầu) của toàn bộ hệ thống backend. 
  - **Cách hoạt động**: Khi chạy (`npm start`), file này sẽ khởi tạo một instance của Express, cấu hình middleware toàn cục (CORS, parser body JSON), định nghĩa thư mục tĩnh (nếu có), thiết lập kết nối tới CSDL MongoDB (thông qua hàm connect) và cuối cùng là khai báo các URL Endpoints chính (`/api/auth`, `/api/rescues`,...) để gắn với hệ thống Routes.

- **`.env`** và **`env.js`** (trong `infrastructure/config/`):
  - **Chức năng**: Lưu trữ và tải các biến môi trường cấu hình (Environment Variables). 
  - **Cách hoạt động**: Chứa MONGODB_URI, PORT, JWT_SECRET,... Các dữ liệu nhạy cảm không được lưu trực tiếp vào code mà được ứng dụng đọc từ file `.env` qua thư viện `dotenv`.

---

## 2. Tầng Domain (Lõi trung tâm của ứng dụng)
Thư mục: `src/domain/`

Tầng này độc lập hoàn toàn với Framework, Database hay UI, chứa các quy tắc nghiệp vụ cốt lõi nhất.

- **`entities/` (Ví dụ: `User.js`, `RescueRequest.js`, `Warning.js`)**:
  - **Chức năng**: Định nghĩa cấu trúc đối tượng dữ liệu ở khía cạnh khái niệm (OOP classes/objects). 
  - **Cách hoạt động**: Ở tầng này, chúng không biết MongoDB là gì. Nó chỉ là những bản phác thảo xác định một `RescueRequest` phải có những trường cơ bản nào (id, location, status...).

- **`repositories/` (Ví dụ: `IUserRepository.js`, `IRescueRequestRepository.js`)**:
  - **Chức năng**: Định nghĩa các Interface (Hợp đồng/Giao diện).
  - **Cách hoạt động**: Do JS không hỗ trợ interface mạnh, các file này thường đóng vai trò "hướng dẫn" hoặc định nghĩa sẵn các phương thức mà bất kỳ database (ví dụ MongoDB, MySQL) nào cũng phải triển khai (vd: `findById`, `save`, `delete`). Điều này đảm bảo tính "đảo ngược phụ thuộc" (Dependency Inversion).

---

## 3. Tầng Application (Ứng dụng)
Thư mục: `src/application/usecases/`

Tầng này chứa logic nghiệp vụ đặc thù (Use Case / Business Logic) của ứng dụng.

- **Các Use Case được phân nhóm theo tính năng**: 
  - `auth/`: `LoginUseCase.js`, `ForgotPasswordUseCase.js`, `ResetPasswordUseCase.js`
  - `rescue/`: `CreateRescueRequestUseCase.js`, `GetRescueRequestsUseCase.js`, `UpdateRescueRequestUseCase.js`
  ...
- **Cách hoạt động**:
  1. Khi một Use Case được gọi, nó sẽ nhận dữ liệu đầu vào.
  2. Nó xử lý logic kinh doanh (ví dụ: `CreateRescueRequestUseCase` sẽ kiểm tra tính hợp lệ, tự động gán mã tracking cho yêu cầu giải cứu, gửi email...).
  3. Nó tương tác với Interface ở tầng `domain/repositories` để lưu thay đổi. Hoàn toàn không dính líu trực tiếp với HTTP request/response ở đây.

---

## 4. Tầng Infrastructure (Hạ tầng công nghệ và Giao tiếp mạng)
Thư mục: `src/infrastructure/`

Thư mục quan trọng và đồ sộ nhất, kết nối "lõi" của ứng dụng với thế giới bên ngoài (MongoDB, HTTP Server, Express, Email).

### a. `database/` (Tương tác cơ sở dữ liệu)
- **`mongoose/connection.js`**: Kết nối backend với MongoDB.
- **`mongoose/models/` (`UserModel.js`, `RescueRequestModel.js`...)**: Khai báo các Schema mapping trực tiếp với MongoDB, định dạng các cột, kiểu dữ liệu, các hàm pre-save (ví dụ băm mật khẩu trước khi lưu DB).
- **`repositories/` (`UserRepository.js`, `RescueRequestRepository.js`...)**: Triển khai các "Interface" ở tầng Domain. Chứa code thực thi việc truy vấn `UserModel.findOne()`, `save()`, `update()`.

### b. `http/routes/` (Định tuyến)
- **`auth.routes.js`**, **`rescue.routes.js`**...: Khai báo các đường dẫn cụ thể. Ví dụ: `router.post('/login', controller.login)`. Định tuyến điều phối các request chuyển đến đúng `Controller` xử lý.

### c. `http/middleware/` (Thành phần Trung gian)
- **`auth.middleware.js`**: Chặn request để kiểm tra Access Toke (JWT Token). Nếu hợp lệ (người dùng đã đăng nhập), request mới được qua. Nó cũng kiểm tra Role (ví dụ: Chặn User thường gọi API của Admin).
- **`error.middleware.js` / `notFound.middleware.js`**: Bắt tất cả lỗi phát sinh trong hệ thống. Đóng gói mã lỗi (404, 500, 400) trả về giao diện theo cấu trúc chuẩn.
- **`validation.middleware.js`**: Kiểm tra, làm sạch thông tin (Params hoặc Body) trước khi chuyển vào để Controller xử lý.

### d. `http/controllers/` (Bộ điều khiển)
- **`AuthController.js`**, **`RescueRequestController.js`**...
- **Cách hoạt động**:
  1. Lấy dữ liệu từ Request do Client (Frontend React) gửi sang (`req.params`, `req.body`).
  2. Instantiate (khởi tạo) Repositories hoặc Services liên quan.
  3. Truyền dữ liệu vào gọi đúng `UseCase` ở tầng Application.
  4. Lấy kết quả (`data` hoặc `error`) từ UseCase, biến đổi nó thành Response chuẩn (`res.status(200).json(...)`) và gửi về Frontend.

### e. `services/` 
- **`MailService.js`**: Cấu hình SMTP (Nodemailer) để gửi email đi khi có yêu cầu (Ví dụ: quên mật khẩu, hoặc thông báo email có cập nhật trạng thái cứu hộ).

---

## 5. Tầng Shared (Tiện ích dùng chung)
Thư mục: `src/shared/`

- **`constants/roles.js`**: Lưu trữ các chuỗi hằng số về Role để tái sử dụng toàn bộ hệ thống (`ADMIN`, `COORDINATOR`, `OFFICER`, `USER`), giúp tránh việc gõ sai chuỗi chữ.
- **`errors/AppError.js`**: Một class mở rộng kế thừa từ `Error` chung của JS, giúp đính kèm các thuộc tính như `statusCode` (Ví dụ tạo một AppError lỗi 403 Forbidden).
- **`utils/password.js`**: Gói các hàm dùng mã hoá bcrypt (`hashPassword`, `comparePassword`) lại một nơi để quản lý.
- **`utils/response.js`**: Hàm hỗ trợ tạo khuôn JSON trả về chuẩn, đảm bảo tính nhất quán (ví dụ: format luôn có dạng `{ success: true, message: "...", data: {...} }`).

---

## Bức tranh Tổng thể (Luồng chạy của một yêu cầu API)

Giả sử người dùng gửi Request **tạo yêu cầu cứu hộ mới**: 
1. `server.js` nhận HTTP POST, gọi xuống thư mục `http/routes/`.
2. `rescue.routes.js` gắn middlewares xác thực và sau đó ném tới `RescueRequestController.js`.
3. `RescueRequestController` bóc tách dữ liệu JSON (tên, toạ độ, số người mắc kẹt), đồng thời khởi tạo `RescueRequestRepository`.
4. Controller gọi xuống `src/application/usecases/rescue/CreateRescueRequestUseCase.js` truyền thông số vào.
5. UseCase sẽ chứa logic tính toán (tạo code tự động), gọi repository: `RescueRequestRepository.save()`.
6. Tại `RescueRequestRepository`, code lệnh `RescueRequestModel.create()` được gọi trực tiếp xuống MongoDB để lưu dữ liệu.
7. MongoDB lưu thành công. Repository trả Data lên UseCase. UseCase trả Data lên Controller.
8. Cuối cùng Controller dùng `shared/utils/response.js` để trả về cho Frontend trạng thái `HTTP 201 Created` cùng dữ liệu Request vừa được tạo.
