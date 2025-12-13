# ✅ Deployment Checklist

Checklist để đảm bảo deploy thành công.

## 📋 Trước khi deploy

- [ ] Code đã được commit và push lên GitHub
- [ ] Đã test local và hoạt động tốt
- [ ] Đã build frontend thành công: `cd frontend && npm run build`

## 🗄️ MongoDB Atlas

- [ ] Đã tạo tài khoản MongoDB Atlas
- [ ] Đã tạo cluster FREE (M0)
- [ ] Đã tạo database user với password
- [ ] Đã whitelist IP: `0.0.0.0/0` (Allow from anywhere)
- [ ] Đã copy connection string và thay `<password>`
- [ ] Đã thêm tên database vào connection string: `/landslide-system`

## 🖥️ Render (Backend)

- [ ] Đã tạo tài khoản Render
- [ ] Đã connect GitHub repository
- [ ] Đã tạo Web Service
- [ ] **Root Directory**: `backend` ✅
- [ ] **Build Command**: `npm install` ✅
- [ ] **Start Command**: `npm start` ✅
- [ ] **Plan**: Free ✅
- [ ] Đã thêm tất cả Environment Variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `MONGODB_URI` (từ Atlas)
  - [ ] `JWT_SECRET` (random string)
  - [ ] `JWT_REFRESH_SECRET` (random string)
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `JWT_REFRESH_EXPIRE=30d`
  - [ ] `FRONTEND_URL` (sẽ cập nhật sau)
  - [ ] `UPLOAD_PATH=./uploads`
  - [ ] `MAX_FILE_SIZE=5242880`
- [ ] Đã deploy và có URL backend
- [ ] Đã test: `https://your-backend.onrender.com/health`

## 🌐 Vercel (Frontend)

- [ ] Đã tạo tài khoản Vercel
- [ ] Đã import GitHub repository
- [ ] **Root Directory**: `frontend` ✅
- [ ] **Framework**: Vite (tự động)
- [ ] Đã thêm Environment Variable:
  - [ ] `VITE_API_URL=https://your-backend.onrender.com/api`
- [ ] Đã deploy và có URL frontend
- [ ] Đã test mở frontend URL

## 🔄 Cập nhật Backend

- [ ] Đã cập nhật `FRONTEND_URL` trên Render = URL Vercel
- [ ] Render đã tự động redeploy
- [ ] Đã test lại backend health check

## ✅ Kiểm tra cuối cùng

- [ ] Backend health: `https://your-backend.onrender.com/health` → `{"status":"OK"}`
- [ ] Frontend mở được: `https://your-frontend.vercel.app`
- [ ] Có thể đăng ký tài khoản mới
- [ ] Có thể đăng nhập
- [ ] API calls hoạt động (mở F12 → Network tab)
- [ ] Không có lỗi CORS
- [ ] Upload file hoạt động (nếu có)

## 🐛 Xử lý lỗi thường gặp

### Backend không kết nối MongoDB
- [ ] Kiểm tra `MONGODB_URI` đúng format
- [ ] Kiểm tra password đã thay `<password>` chưa
- [ ] Kiểm tra IP whitelist trên Atlas

### Frontend không gọi được API
- [ ] Kiểm tra `VITE_API_URL` trên Vercel
- [ ] Kiểm tra `FRONTEND_URL` trên Render
- [ ] Kiểm tra CORS error trong browser console

### Build failed
- [ ] Kiểm tra Root Directory đúng chưa
- [ ] Kiểm tra logs trên Render/Vercel
- [ ] Kiểm tra `package.json` có script `start`/`build`

---

## 📝 URLs cần lưu

Sau khi deploy, lưu các URLs này:

- **Backend**: `https://____________________.onrender.com`
- **Frontend**: `https://____________________.vercel.app`
- **MongoDB Atlas**: Dashboard tại https://cloud.mongodb.com

---

## 🎉 Hoàn thành!

Nếu tất cả checklist đều ✅, dự án của bạn đã được deploy thành công!

---

**Xem hướng dẫn chi tiết**: `DEPLOY_FREE.md`
**Xem hướng dẫn nhanh**: `QUICK_DEPLOY.md`

