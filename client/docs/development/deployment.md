# Quy trình triển khai (Deployment)

Tài liệu này hướng dẫn cách build và triển khai ứng dụng cho các môi trường khác nhau.

## 1. Frontend trên Vercel

Repo này là monorepo, vì vậy khi tạo project trên Vercel cần đặt:

- **Root Directory**: `client`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Biến môi trường cần khai báo trên Vercel:

- `VITE_API_BASE_URL=https://your-backend-domain.example.com`

Đã có sẵn file `client/vercel.json` để rewrite mọi route của SPA về `index.html`.

## 2. Backend trên Vercel

Nếu vẫn muốn deploy cả backend lên Vercel, hãy tạo project thứ hai từ cùng repo với:

- **Root Directory**: `backend`
- **Framework Preset**: `Other`

Repo đã có sẵn:

- `backend/api/index.py` để expose Django như Python Function
- `backend/vercel.json` để route mọi request vào Django

Biến môi trường tối thiểu cho backend project:

- `DEBUG=False`
- `DJANGO_SECRET_KEY=...`
- `ALLOWED_HOSTS=your-backend-domain.vercel.app`
- `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`
- `CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.vercel.app`
- `USE_SQLITE_DEFAULT=1`
- `LOCAL_AUTHZ_DB_PATH=/tmp/teacher_service_authz.sqlite3`

Giới hạn cần chấp nhận:

- SQLite trên Vercel là tạm thời, dữ liệu có thể mất giữa các lần deploy hoặc cold start.
- Không phù hợp cho dữ liệu bền vững hoặc tác vụ dài.
- Nếu cần production ổn định, chuyển `default` và `local_authz` sang database ngoài.

## 3. Backend production

`backend` nên deploy ở VPS, Railway, Render, Fly.io hoặc một máy chủ có hỗ trợ Django lâu dài. Các biến môi trường production tối thiểu:

- `DEBUG=False`
- `DJANGO_SECRET_KEY=...`
- `ALLOWED_HOSTS=your-backend-domain.example.com`
- `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`
- `CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.vercel.app`

Nếu backend vẫn cần `local_authz`, không dùng filesystem tạm thời của Vercel cho SQLite này.

## 4. Môi trường Production (Sản phẩm)

Trên máy chủ thực tế (Cloud VPS / FTP), thực hiện:

### Bước 1: Build mã nguồn
```bash
npm run build
```

### Bước 2: Deploy mã nguồn
Tải toàn bộ nội dung trong thư mục `dist/` lên máy chủ web của VietElite. Đảm bảo server được cấu hình để hỗ trợ **Single Page Application (SPA)** (redirect all 404s to `index.html`).

Ví dụ cấu hình Nginx:
```nginx
server {
    listen 80;
    server_name schedule.vietelite.edu.vn;
    root /var/www/vietelite/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 5. Kiểm tra trước khi bàn giao (Pre-flight Check)

1. [ ] Chạy `npm run lint` - Không còn lỗi cảnh báo.
2. [ ] Build thử nghiệm và chạy `npm run preview`.
3. [ ] Kiểm tra responsive trên các thiết bị Mobile (Rất quan trọng).
4. [ ] Kiểm tra tốc độ load trang và Optimize assets.
