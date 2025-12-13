# 🚀 Hướng dẫn Deploy Hệ thống Quản lý Sạt lở

Hướng dẫn chi tiết để deploy dự án lên môi trường production.

## 📋 Mục lục

1. [Chuẩn bị](#chuẩn-bị)
2. [Deploy lên VPS/Server](#deploy-lên-vpsserver)
3. [Deploy lên Cloud Platforms](#deploy-lên-cloud-platforms)
4. [Cấu hình Production](#cấu-hình-production)
5. [Kiểm tra và Bảo mật](#kiểm-tra-và-bảo-mật)

---

## 🎯 Chuẩn bị

### Yêu cầu hệ thống

- **Node.js**: 18.x trở lên
- **MongoDB**: 5.x trở lên (hoặc MongoDB Atlas)
- **Nginx**: (khuyến nghị cho VPS)
- **PM2**: Process manager cho Node.js
- **Domain name**: (tùy chọn)

### Build Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Build production
npm run build
```

Sau khi build, thư mục `frontend/dist` sẽ chứa các file tĩnh đã được tối ưu.

---

## 🖥️ Deploy lên VPS/Server

### Bước 1: Chuẩn bị Server

#### Cài đặt Node.js và MongoDB

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Khởi động MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Cài đặt Nginx và PM2

```bash
# Nginx
sudo apt-get install -y nginx

# PM2
sudo npm install -g pm2
```

### Bước 2: Upload Code lên Server

```bash
# Sử dụng Git
git clone <your-repo-url> /var/www/landslide-system
cd /var/www/landslide-system

# Hoặc upload qua SCP/SFTP
scp -r ./landslide-system user@your-server:/var/www/
```

### Bước 3: Cấu hình Backend

```bash
cd /var/www/landslide-system/backend

# Cài đặt dependencies
npm install --production

# Tạo file .env
nano .env
```

**Nội dung `backend/.env` cho production:**

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database - MongoDB Atlas hoặc MongoDB local
MONGODB_URI=mongodb://localhost:27017/landslide-system
# Hoặc MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/landslide-system?retryWrites=true&w=majority

# JWT Secrets - QUAN TRỌNG: Thay đổi các giá trị này!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRE=30d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS - URL frontend production
FRONTEND_URL=https://yourdomain.com
# Hoặc nếu dùng IP:
# FRONTEND_URL=http://your-server-ip
```

```bash
# Tạo thư mục uploads
mkdir -p uploads

# Chạy seed data (nếu cần)
npm run seed
```

### Bước 4: Cấu hình Frontend

```bash
cd /var/www/landslide-system/frontend

# Cài đặt dependencies
npm install

# Tạo file .env.production
nano .env.production
```

**Nội dung `frontend/.env.production`:**

```env
VITE_API_URL=https://yourdomain.com/api
# Hoặc nếu dùng IP:
# VITE_API_URL=http://your-server-ip:5000/api
```

```bash
# Build frontend
npm run build
```

### Bước 5: Chạy Backend với PM2

```bash
cd /var/www/landslide-system/backend

# Khởi động với PM2
pm2 start server.js --name landslide-backend

# Lưu cấu hình PM2
pm2 save
pm2 startup

# Kiểm tra status
pm2 status
pm2 logs landslide-backend
```

### Bước 6: Cấu hình Nginx

Tạo file cấu hình Nginx:

```bash
sudo nano /etc/nginx/sites-available/landslide-system
```

**Nội dung cấu hình:**

```nginx
# Backend API - Reverse Proxy
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (nếu có SSL)
    # return 301 https://$server_name$request_uri;

    # Frontend - Serve static files
    location / {
        root /var/www/landslide-system/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads - Serve uploaded files
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000;
    }
}
```

```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/landslide-system /etc/nginx/sites-enabled/

# Kiểm tra cấu hình
sudo nginx -t

# Khởi động lại Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Bước 7: Cấu hình SSL với Let's Encrypt (Khuyến nghị)

```bash
# Cài đặt Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Lấy SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Tự động gia hạn
sudo certbot renew --dry-run
```

Sau khi có SSL, cập nhật lại file Nginx để redirect HTTP sang HTTPS.

---

## ☁️ Deploy lên Cloud Platforms

### Option 1: Deploy lên Heroku

#### Backend

```bash
cd backend

# Cài đặt Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Tạo app
heroku create landslide-backend

# Thêm MongoDB Atlas addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
heroku config:set FRONTEND_URL=https://your-frontend-url.com

# Deploy
git push heroku main

# Kiểm tra logs
heroku logs --tail
```

#### Frontend (Vercel/Netlify)

**Vercel:**

```bash
cd frontend

# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL production
# Nhập: https://landslide-backend.herokuapp.com/api
```

**Netlify:**

1. Kéo thả thư mục `frontend/dist` lên Netlify
2. Hoặc kết nối Git repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variable: `VITE_API_URL=https://landslide-backend.herokuapp.com/api`

### Option 2: Deploy lên Railway

#### Backend

1. Tạo tài khoản Railway
2. Tạo project mới
3. Connect GitHub repository
4. Add MongoDB service
5. Set environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI` (từ MongoDB service)
   - `JWT_SECRET`, `JWT_REFRESH_SECRET`
   - `FRONTEND_URL`
6. Deploy tự động

#### Frontend

1. Tạo service mới trong Railway
2. Connect frontend folder
3. Build command: `npm run build`
4. Start command: `npx serve -s dist`
5. Set environment variable: `VITE_API_URL`

### Option 3: Deploy lên DigitalOcean App Platform

1. Tạo App mới
2. Connect GitHub repository
3. Backend:
   - Root directory: `backend`
   - Build command: `npm install`
   - Run command: `npm start`
   - Add MongoDB database
   - Set environment variables
4. Frontend:
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Output directory: `dist`
   - Set environment variable: `VITE_API_URL`

---

## ⚙️ Cấu hình Production

### Backend Production Checklist

- [ ] Đổi tất cả JWT secrets
- [ ] Set `NODE_ENV=production`
- [ ] Cấu hình MongoDB Atlas hoặc MongoDB production
- [ ] Cập nhật `FRONTEND_URL` với domain thực tế
- [ ] Cấu hình CORS đúng domain
- [ ] Bật rate limiting
- [ ] Cấu hình logging
- [ ] Backup database định kỳ

### Frontend Production Checklist

- [ ] Build với `npm run build`
- [ ] Set `VITE_API_URL` đúng với backend URL
- [ ] Kiểm tra tất cả API calls hoạt động
- [ ] Test trên nhiều trình duyệt
- [ ] Optimize images và assets

### MongoDB Atlas Setup (Khuyến nghị cho Production)

1. Tạo tài khoản MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Tạo cluster mới
3. Tạo database user
4. Whitelist IP server của bạn
5. Lấy connection string và cập nhật vào `MONGODB_URI`

**Connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/landslide-system?retryWrites=true&w=majority
```

---

## 🔒 Kiểm tra và Bảo mật

### Kiểm tra Deployment

```bash
# Kiểm tra backend
curl https://yourdomain.com/health

# Kiểm tra frontend
curl https://yourdomain.com

# Kiểm tra PM2
pm2 status
pm2 logs

# Kiểm tra Nginx
sudo nginx -t
sudo systemctl status nginx

# Kiểm tra MongoDB
sudo systemctl status mongod
```

### Bảo mật

1. **Firewall:**
```bash
# Chỉ mở port 80, 443, 22
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Environment Variables:**
   - Không commit file `.env` lên Git
   - Sử dụng secrets management của platform
   - Rotate JWT secrets định kỳ

3. **HTTPS:**
   - Luôn sử dụng HTTPS trong production
   - Cấu hình HSTS headers

4. **Rate Limiting:**
   - Backend đã có `express-rate-limit`
   - Cấu hình Nginx rate limiting nếu cần

5. **Backup:**
```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/landslide-system" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://localhost:27017/landslide-system" /backup/20250101
```

---

## 🔄 Cập nhật Deployment

### Cập nhật Code

```bash
# Trên server
cd /var/www/landslide-system

# Pull code mới
git pull origin main

# Backend
cd backend
npm install --production
pm2 restart landslide-backend

# Frontend
cd ../frontend
npm install
npm run build
# Nginx sẽ tự động serve file mới
```

### PM2 Commands

```bash
# Xem logs
pm2 logs landslide-backend

# Restart
pm2 restart landslide-backend

# Stop
pm2 stop landslide-backend

# Xem monitoring
pm2 monit
```

---

## 📞 Xử lý sự cố

### Backend không chạy

```bash
# Kiểm tra logs
pm2 logs landslide-backend

# Kiểm tra port
sudo netstat -tulpn | grep 5000

# Kiểm tra .env
cat backend/.env

# Test kết nối MongoDB
mongosh mongodb://localhost:27017/landslide-system
```

### Frontend không load

```bash
# Kiểm tra Nginx
sudo nginx -t
sudo systemctl status nginx

# Kiểm tra file dist
ls -la frontend/dist

# Kiểm tra permissions
sudo chown -R www-data:www-data frontend/dist
```

### Database connection error

- Kiểm tra MongoDB đang chạy
- Kiểm tra `MONGODB_URI` trong `.env`
- Kiểm tra firewall nếu dùng MongoDB Atlas
- Whitelist IP server trên MongoDB Atlas

---

## 📚 Tài liệu tham khảo

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Let's Encrypt](https://letsencrypt.org/)

---

## ✅ Checklist Deployment

- [ ] Build frontend thành công
- [ ] Cấu hình backend `.env` production
- [ ] Cấu hình frontend `.env.production`
- [ ] Deploy backend và chạy với PM2
- [ ] Cấu hình Nginx reverse proxy
- [ ] Cấu hình SSL/HTTPS
- [ ] Test tất cả API endpoints
- [ ] Test frontend trên production
- [ ] Cấu hình backup database
- [ ] Cấu hình monitoring và logging
- [ ] Test performance và load

---

**Chúc bạn deploy thành công! 🎉**

