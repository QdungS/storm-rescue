# 🚀 Hướng dẫn Deploy MIỄN PHÍ - Từng bước chi tiết

Hướng dẫn deploy dự án lên các nền tảng **HOÀN TOÀN MIỄN PHÍ**:
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel (Free tier)  
- **Database**: MongoDB Atlas (Free tier)

---

## 📋 Bước 1: Chuẩn bị MongoDB Atlas (Database)

### 1.1. Tạo tài khoản MongoDB Atlas

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký tài khoản miễn phí (Free tier M0)
3. Xác thực email

### 1.2. Tạo Cluster

1. Sau khi đăng nhập, chọn **"Build a Database"**
2. Chọn **FREE** (M0 Sandbox)
3. Chọn Cloud Provider và Region (gần Việt Nam: Singapore hoặc Mumbai)
4. Đặt tên cluster (ví dụ: `landslide-cluster`)
5. Click **"Create"** (mất khoảng 3-5 phút)

### 1.3. Tạo Database User

1. Vào **"Database Access"** (menu bên trái)
2. Click **"Add New Database User"**
3. Chọn **"Password"** authentication
4. Tạo username và password (LƯU LẠI!)
   - Username: `landslide-user`
   - Password: Tạo mật khẩu mạnh (LƯU LẠI!)
5. Database User Privileges: **"Read and write to any database"**
6. Click **"Add User"**

### 1.4. Whitelist IP Address

1. Vào **"Network Access"** (menu bên trái)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0) - cho phép từ mọi nơi
4. Click **"Confirm"**

### 1.5. Lấy Connection String

1. Vào **"Database"** (menu bên trái)
2. Click **"Connect"** trên cluster của bạn
3. Chọn **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy connection string, ví dụ:
   ```
   mongodb+srv://landslide-user:<password>@landslide-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **THAY `<password>` bằng password bạn đã tạo**
7. **THÊM tên database vào cuối**: `/landslide-system`
8. Connection string cuối cùng sẽ là:
   ```
   mongodb+srv://landslide-user:YOUR_PASSWORD@landslide-cluster.xxxxx.mongodb.net/landslide-system?retryWrites=true&w=majority
   ```
9. **LƯU LẠI connection string này!**

---

## 📋 Bước 2: Deploy Backend lên Render.com

### 2.1. Tạo tài khoản Render

1. Truy cập: https://render.com
2. Click **"Get Started for Free"**
3. Đăng ký bằng GitHub (khuyến nghị) hoặc email
4. Xác thực email

### 2.2. Push code lên GitHub

**Nếu chưa có Git repository:**

```bash
# Trong thư mục dự án
git init
git add .
git commit -m "Initial commit"
```

**Tạo repository trên GitHub:**

1. Truy cập: https://github.com/new
2. Đặt tên repository (ví dụ: `landslide-system`)
3. Click **"Create repository"**
4. Làm theo hướng dẫn để push code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/landslide-system.git
git branch -M main
git push -u origin main
```

### 2.3. Deploy trên Render

1. Vào dashboard Render: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository của bạn
4. Chọn repository `landslide-system`
5. Điền thông tin:
   - **Name**: `landslide-backend`
   - **Region**: Singapore (gần nhất)
   - **Branch**: `main`
   - **Root Directory**: `backend` (QUAN TRỌNG!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

6. Click **"Advanced"** để thêm Environment Variables:

   Thêm các biến sau (click "Add Environment Variable" cho mỗi biến):

   ```
   NODE_ENV = production
   PORT = 10000
   MONGODB_URI = mongodb+srv://landslide-user:YOUR_PASSWORD@landslide-cluster.xxxxx.mongodb.net/landslide-system?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-jwt-key-change-this-123456789
   JWT_EXPIRE = 7d
   JWT_REFRESH_SECRET = your-super-secret-refresh-key-change-this-987654321
   JWT_REFRESH_EXPIRE = 30d
   FRONTEND_URL = https://your-frontend-url.vercel.app
   UPLOAD_PATH = ./uploads
   MAX_FILE_SIZE = 5242880
   ```

   **LƯU Ý**: 
   - Thay `YOUR_PASSWORD` bằng password MongoDB Atlas
   - Thay `your-frontend-url.vercel.app` bằng URL frontend (sẽ có sau bước 3)
   - Tạo JWT_SECRET và JWT_REFRESH_SECRET ngẫu nhiên (có thể dùng: https://randomkeygen.com/)

7. Click **"Create Web Service"**
8. Render sẽ tự động build và deploy (mất 5-10 phút)
9. Sau khi deploy xong, bạn sẽ có URL backend, ví dụ:
   ```
   https://landslide-backend.onrender.com
   ```
10. **LƯU LẠI URL này!**

### 2.4. Kiểm tra Backend

1. Mở URL backend + `/health`:
   ```
   https://landslide-backend.onrender.com/health
   ```
2. Phải thấy: `{"status":"OK","timestamp":"..."}`

---

## 📋 Bước 3: Deploy Frontend lên Vercel

### 3.1. Tạo tài khoản Vercel

1. Truy cập: https://vercel.com
2. Click **"Sign Up"**
3. Đăng ký bằng GitHub (khuyến nghị)
4. Xác thực email

### 3.2. Deploy Frontend

1. Vào dashboard Vercel: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import GitHub repository `landslide-system`
4. Cấu hình:
   - **Project Name**: `landslide-frontend` (hoặc tên khác)
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (QUAN TRỌNG!)
   - **Build Command**: `npm run build` (tự động)
   - **Output Directory**: `dist` (tự động)

5. Click **"Environment Variables"** và thêm:
   ```
   VITE_API_URL = https://landslide-backend.onrender.com/api
   ```
   (Thay bằng URL backend của bạn từ bước 2)

6. Click **"Deploy"**
7. Vercel sẽ tự động build và deploy (mất 2-5 phút)
8. Sau khi deploy xong, bạn sẽ có URL frontend, ví dụ:
   ```
   https://landslide-frontend.vercel.app
   ```
9. **LƯU LẠI URL này!**

### 3.3. Cập nhật Backend với Frontend URL

1. Quay lại Render dashboard
2. Vào service `landslide-backend`
3. Vào tab **"Environment"**
4. Tìm biến `FRONTEND_URL`
5. Click **"Edit"** và cập nhật thành URL Vercel của bạn:
   ```
   https://landslide-frontend.vercel.app
   ```
6. Click **"Save Changes"**
7. Render sẽ tự động redeploy

---

## 📋 Bước 4: Seed dữ liệu mẫu (Tùy chọn)

### 4.1. Chạy seed script

Bạn có thể chạy seed script từ local để tạo dữ liệu mẫu:

```bash
cd backend

# Tạo file .env với MONGODB_URI từ Atlas
echo "MONGODB_URI=mongodb+srv://landslide-user:YOUR_PASSWORD@landslide-cluster.xxxxx.mongodb.net/landslide-system?retryWrites=true&w=majority" > .env

# Chạy seed
npm run seed
```

Hoặc bạn có thể tạo tài khoản admin thủ công qua API:

```bash
# Đăng ký admin
curl -X POST https://landslide-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tlu.edu.vn",
    "password": "123456",
    "fullName": "Admin User",
    "role": "admin",
    "area": {
      "province": "Hà Nội",
      "district": "Quận 1",
      "commune": "Phường 1"
    }
  }'
```

---

## ✅ Kiểm tra Deployment

### 4.1. Kiểm tra Backend

```bash
# Health check
curl https://landslide-backend.onrender.com/health

# Phải trả về: {"status":"OK","timestamp":"..."}
```

### 4.2. Kiểm tra Frontend

1. Mở trình duyệt
2. Truy cập: `https://landslide-frontend.vercel.app`
3. Phải thấy trang đăng nhập/bản đồ

### 4.3. Test đăng nhập

1. Đăng ký tài khoản mới hoặc dùng tài khoản đã seed
2. Đăng nhập
3. Kiểm tra các tính năng hoạt động

---

## 🔧 Xử lý sự cố

### Backend không kết nối được MongoDB

- Kiểm tra `MONGODB_URI` trong Render Environment Variables
- Kiểm tra IP whitelist trên MongoDB Atlas (phải có 0.0.0.0/0)
- Kiểm tra username/password đúng chưa

### Frontend không gọi được API

- Kiểm tra `VITE_API_URL` trong Vercel Environment Variables
- Kiểm tra CORS trên backend (`FRONTEND_URL` phải đúng)
- Mở Developer Tools (F12) → Console để xem lỗi

### Render service bị sleep (Free tier)

- Free tier của Render sẽ sleep sau 15 phút không có request
- Request đầu tiên sau khi sleep sẽ mất 30-60 giây để wake up
- Để tránh sleep, có thể dùng:
  - UptimeRobot (miễn phí): https://uptimerobot.com
  - Cron-job.org: ping URL backend mỗi 5 phút

### Build failed trên Render

- Kiểm tra logs trên Render dashboard
- Đảm bảo `Root Directory` là `backend`
- Kiểm tra `package.json` có script `start`

### Build failed trên Vercel

- Kiểm tra logs trên Vercel dashboard
- Đảm bảo `Root Directory` là `frontend`
- Kiểm tra `VITE_API_URL` đã set chưa

---

## 📝 Tóm tắt URLs

Sau khi deploy xong, bạn sẽ có:

- **Backend URL**: `https://landslide-backend.onrender.com`
- **Frontend URL**: `https://landslide-frontend.vercel.app`
- **MongoDB Atlas**: Dashboard tại https://cloud.mongodb.com

---

## 🎉 Hoàn thành!

Bây giờ dự án của bạn đã được deploy hoàn toàn miễn phí và có thể truy cập từ bất kỳ đâu!

### Lưu ý quan trọng:

1. **Free tier có giới hạn**:
   - Render: Service sẽ sleep sau 15 phút không dùng
   - Vercel: 100GB bandwidth/tháng
   - MongoDB Atlas: 512MB storage

2. **Bảo mật**:
   - Đổi JWT_SECRET và JWT_REFRESH_SECRET thành giá trị ngẫu nhiên mạnh
   - Không commit file `.env` lên GitHub
   - Sử dụng password mạnh cho MongoDB

3. **Monitoring**:
   - Kiểm tra logs trên Render và Vercel dashboard
   - Setup UptimeRobot để monitor backend

---

**Chúc bạn deploy thành công! 🚀**

