# Kiến trúc Clean Architecture - Hệ thống Quản lý Sạt lở

## Tổng quan

Dự án được xây dựng theo kiến trúc Clean Architecture, tách biệt rõ ràng giữa các layers để dễ bảo trì, test và mở rộng.

## Cấu trúc Backend

### 1. Domain Layer (`src/domain/`)
**Mục đích**: Chứa business logic và entities độc lập với framework

- **entities/**: Domain models (User, LandslidePoint, Warning, Report, etc.)
- **repositories/**: Repository interfaces (IUserRepository, ILandslideRepository, etc.)

**Đặc điểm**:
- Không phụ thuộc vào framework (Express, Mongoose)
- Chứa business rules và validation logic
- Có thể test độc lập

### 2. Application Layer (`src/application/`)
**Mục đích**: Chứa use cases và orchestration logic

- **usecases/**: Các use case cụ thể
  - `auth/`: LoginUseCase, RegisterUseCase
  - `landslide/`: CreateLandslideUseCase, UpdateLandslideUseCase, etc.
  - `warning/`: CreateWarningUseCase, GetWarningsUseCase
  - `report/`: SubmitReportUseCase, UpdateReportStatusUseCase
  - `user/`: User management use cases
  - `safety/`: Safety information use cases

**Đặc điểm**:
- Sử dụng repository interfaces (không phụ thuộc implementation)
- Chứa business logic phức tạp
- Có thể test với mock repositories

### 3. Infrastructure Layer (`src/infrastructure/`)
**Mục đích**: Implementation của các interfaces và external services

- **database/**:
  - `mongoose/models/`: Mongoose schemas và models
  - `repositories/`: Repository implementations (UserRepository, LandslideRepository, etc.)
  - `connection.js`: MongoDB connection

- **http/**:
  - `controllers/`: Express controllers
  - `routes/`: API routes
  - `middleware/`: Authentication, validation, error handling

- **config/**: Configuration files (JWT, database, env)

**Đặc điểm**:
- Phụ thuộc vào framework (Express, Mongoose)
- Implement các interfaces từ Domain layer
- Xử lý I/O (database, HTTP)

### 4. Shared (`src/shared/`)
**Mục đích**: Utilities và constants dùng chung

- **utils/**: Password hashing, response helpers
- **errors/**: Custom error classes
- **constants/**: Roles, statuses, etc.

## Luồng xử lý request

```
HTTP Request
    ↓
Routes (infrastructure/http/routes)
    ↓
Middleware (authentication, validation)
    ↓
Controller (infrastructure/http/controllers)
    ↓
Use Case (application/usecases)
    ↓
Repository Interface (domain/repositories)
    ↓
Repository Implementation (infrastructure/database/repositories)
    ↓
Database (MongoDB via Mongoose)
```

## Dependency Rule

- **Domain** ← không phụ thuộc layer nào
- **Application** ← chỉ phụ thuộc Domain
- **Infrastructure** ← phụ thuộc Domain và Application
- **HTTP/Controllers** ← phụ thuộc Application (use cases)

## Ví dụ: Tạo điểm sạt lở

1. **Route** (`landslide.routes.js`):
   ```javascript
   router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
     landslideController.create.bind(landslideController));
   ```

2. **Controller** (`LandslideController.js`):
   ```javascript
   async create(req, res, next) {
     const createUseCase = new CreateLandslideUseCase();
     const landslide = await createUseCase.execute(req.body);
     return successResponse(res, landslide, 'Created successfully', 201);
   }
   ```

3. **Use Case** (`CreateLandslideUseCase.js`):
   ```javascript
   async execute(landslideData) {
     // Business logic validation
     if (level < 1 || level > 5) {
       throw new AppError('Level must be between 1 and 5', 400);
     }
     // Use repository interface
     return await this.landslideRepository.create(landslideData);
   }
   ```

4. **Repository Implementation** (`LandslideRepository.js`):
   ```javascript
   async create(landslideData) {
     const landslide = await LandslidePointModel.create(landslideData);
     return this._toEntity(landslide);
   }
   ```

## Lợi ích của Clean Architecture

1. **Testability**: Có thể test use cases với mock repositories
2. **Maintainability**: Thay đổi database không ảnh hưởng business logic
3. **Scalability**: Dễ thêm features mới
4. **Separation of Concerns**: Mỗi layer có trách nhiệm rõ ràng

