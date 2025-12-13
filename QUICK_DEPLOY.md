# ⚡ Deploy Nhanh - 3 Bước

## 🎯 Tóm tắt nhanh

1. **MongoDB Atlas** → Tạo database miễn phí
2. **Render.com** → Deploy backend (free)
3. **Vercel** → Deploy frontend (free)

---

## 📝 Checklist nhanh

### Bước 1: MongoDB Atlas (5 phút)
- [ ] Đăng ký: https://www.mongodb.com/cloud/atlas/register
- [ ] Tạo cluster FREE
- [ ] Tạo database user
- [ ] Whitelist IP: `0.0.0.0/0`
- [ ] Copy connection string

### Bước 2: Render Backend (10 phút)
- [ ] Đăng ký: https://render.com
- [ ] Push code lên GitHub
- [ ] Tạo Web Service trên Render
- [ ] Root Directory: `backend`
- [ ] Build: `npm install`
- [ ] Start: `npm start`
- [ ] Thêm Environment Variables (xem bên dưới)
- [ ] Lưu URL backend

### Bước 3: Vercel Frontend (5 phút)
- [ ] Đăng ký: https://vercel.com
- [ ] Import GitHub repo
- [ ] Root Directory: `frontend`
- [ ] Environment Variable: `VITE_API_URL = https://your-backend.onrender.com/api`
- [ ] Deploy
- [ ] Cập nhật `FRONTEND_URL` trên Render

---

## 🔑 Environment Variables

### Render (Backend)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/landslide-system?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-random-refresh-secret-here
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=https://your-frontend.vercel.app
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📚 Hướng dẫn chi tiết

Xem file **`DEPLOY_FREE.md`** để có hướng dẫn từng bước chi tiết!

---

## ⚠️ Lưu ý

1. **Render free tier sẽ sleep** sau 15 phút không dùng
2. **Request đầu tiên** sau khi sleep sẽ mất 30-60 giây
3. Dùng **UptimeRobot** (free) để ping backend mỗi 5 phút

---

**Thời gian deploy: ~20 phút** ⏱️

