# Landslide Management System - Backend API

Backend API cho hệ thống quản lý cảnh báo sạt lở, được xây dựng với MERN Stack và Clean Architecture.

## Cấu trúc dự án

```
backend/
├── src/
│   ├── domain/              # Business Logic Layer
│   │   ├── entities/       # Domain Models
│   │   └── repositories/   # Repository Interfaces
│   ├── application/        # Application Layer
│   │   └── usecases/       # Use Cases
│   ├── infrastructure/     # Infrastructure Layer
│   │   ├── database/       # MongoDB & Repositories
│   │   ├── http/           # Express (Controllers, Routes, Middleware)
│   │   └── config/         # Configuration
│   └── shared/             # Shared Utilities
├── server.js               # Entry point
└── package.json
```

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cấu hình MongoDB trong file `.env`:
```
MONGODB_URI=mongodb://localhost:27017/landslide-system
```

4. Chạy server:
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Landslides
- `GET /api/landslides` - Lấy danh sách điểm sạt lở (public)
- `POST /api/landslides` - Tạo điểm mới (admin, officer)
- `PUT /api/landslides/:id` - Cập nhật (admin, officer)
- `DELETE /api/landslides/:id` - Xóa (admin)

### Warnings
- `GET /api/warnings` - Lấy danh sách cảnh báo (public)
- `POST /api/warnings` - Tạo cảnh báo (admin, officer)

### Reports
- `POST /api/reports` - Gửi báo cáo (citizen)
- `GET /api/reports/my` - Báo cáo của tôi (citizen)
- `GET /api/reports` - Tất cả báo cáo (officer, admin)
- `PUT /api/reports/:id/status` - Cập nhật trạng thái (officer, admin)

## Authentication

Sử dụng JWT Bearer token:
```
Authorization: Bearer <token>
```

## Kiến trúc Clean Architecture

- **Domain Layer**: Chứa business logic và entities
- **Application Layer**: Chứa use cases và business rules
- **Infrastructure Layer**: Chứa implementation (database, HTTP, external services)
- **Shared**: Utilities và constants dùng chung

"# landslide-system" 
