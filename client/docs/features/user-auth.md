# Quản lý người dùng và Phân quyền (User Auth)

Dự án sử dụng hệ thống phân quyền để quản lý mức độ truy cập thông tin khác nhau cho các đối tượng trong VietElite.

## 1. Các loại tài khoản (Roles)

Hệ thống được thiết kế với 3 nhóm người dùng chính:

| Vai trò | Mô tả quyền hạn |
| :--- | :--- |
| **Admin** | Quyền cao nhất. Quản lý toàn bộ lịch dạy, thêm/xóa giáo viên, chỉnh sửa thông tin lớp học và cài đặt hệ thống. |
| **Manager** | Quyền quản lý cấp trung. Có thể xem toàn bộ lịch dạy, xuất báo cáo nhưng không thể thay đổi các cài đặt hệ thống quan trọng. |
| **Teacher** | Chỉ có thể xem lịch giảng dạy của cá nhân mình và thông báo liên quan. |

## 2. Giao diện đăng nhập

Giao diện đăng nhập được tối ưu hóa sự chuyên nghiệp, hỗ trợ:
- Xác thực qua Email/Mật khẩu.
- (Dự kiến) Đăng nhập nhanh qua Google Workspace.

## 3. Chính sách bảo mật

- **Phiên làm việc (Sessions)**: Sử dụng JWT (JSON Web Token) để xác thực. Token sẽ được lưu trong `HttpOnly Cookie` để đảm bảo an toàn.
- **Bảo vệ Routes**: Các trang quản trị được bảo vệ bởi **Middleware/Auth Guards**, nếu chưa đăng nhập hoặc không đủ quyền sẽ bị Redirect về trang Login.
