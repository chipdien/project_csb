# Quy trình triển khai (Deployment)

Tài liệu này hướng dẫn cách build và triển khai ứng dụng cho các môi trường khác nhau.

## 1. Môi trường Staging (Thử nghiệm)

Triển khai nhanh bằng **Vercel** hoặc **Netlify** thông qua các nền tảng CI/CD (GitHub/GitLab).

- **Tự động build**: Khi có commit mới vào nhánh `main` hoặc `develop`.
- **Lệnh build**: `npm run build`
- **Output directory**: `dist/`

## 2. Môi trường Production (Sản phẩm)

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

## 3. Kiểm tra trước khi bàn giao (Pre-flight Check)

1. [ ] Chạy `npm run lint` - Không còn lỗi cảnh báo.
2. [ ] Build thử nghiệm và chạy `npm run preview`.
3. [ ] Kiểm tra responsive trên các thiết bị Mobile (Rất quan trọng).
4. [ ] Kiểm tra tốc độ load trang và Optimize assets.
