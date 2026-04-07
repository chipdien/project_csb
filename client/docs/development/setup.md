# Hướng dẫn thiết lập môi trường (Setup)

Tài liệu này hỗ trợ lập trình viên mới bắt đầu dự án trên máy tính cá nhân.

## 1. Yêu cầu hệ thống (Prerequisites)

- **Node.js**: Phiên bản 20+ (Khuyến nghị 22 LTS).
- **Trình quản lý gói**: `npm` (mặc định đi kèm Node.js).
- **IDE**: [VS Code](https://code.visualstudio.com/) với các Extension:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## 2. Các bước cài đặt nhanh (Quick Start)

Mở terminal tại thư mục gốc của dự án (`client/`) và chạy các lệnh sau:

### Bước 1: Cài đặt các thư viện phụ thuộc
```bash
npm install
```

### Bước 2: Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```

Sau khi chạy lệnh trên, ứng dụng sẽ khả dụng tại: `http://localhost:5173/` (mặc định của Vite).

## 3. Các lệnh hữu ích khác

- `npm run build`: Đóng gói ứng dụng cho môi trường Production (trong thư mục `dist/`).
- `npm run lint`: Kiểm tra lỗi cú pháp và định dạng code theo cấu hình ESLint.
- `npm run preview`: Xem trước bản build thực tế sau khi đã đóng gói.

## 4. Cấu hình môi trường (`.env`)

Hiện tại dự án chưa yêu cầu file `.env` đặc thù. Tuy nhiên, khi tích hợp Backend API, bạn sẽ cần tạo file `.env` với các biến sau:
```env
VITE_API_BASE_URL=https://api.vietelite.edu.vn
```
