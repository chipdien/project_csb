# Xác thực và Phân quyền (Authentication & Authorization)

Hệ thống sử dụng cơ chế bảo mật nghiêm ngặt để đảm bảo dữ liệu lịch dạy chỉ được truy cập bởi nhân viên hợp lệ của VietElite.

## 1. Cơ chế xác thực (Authentication)

Ứng dụng sử dụng **JSON Web Token (JWT)** cho quá trình xác thực không trạng thái (stateless):

- **Access Token**: Có thời hạn ngắn, dùng để gửi kèm trong `Authorization` header của mỗi request API.
- **Refresh Token**: Sử dụng để lấy Access Token mới khi cái cũ hết hạn mà không yêu cầu người dùng đăng nhập lại.
- **Lưu trữ**: Token được quản lý an toàn trong `LocalStorage` (hoặc `SessionStorage` tùy cấu hình) thông qua `AuthContext`.

---

## 2. Bảo vệ ứng dụng (Route Protection)

Mọi trang chức năng bên trong Dashboard đều được bảo vệ bởi thành phần `ProtectedRoute`:

- **Nếu chưa đăng nhập**: Hệ thống tự động chuyển hướng người dùng về trang `/login`.
- **Nếu đã đăng nhập**: Người dùng có thể truy cập các tính năng tương ứng với quyền hạn của mình.
- **Đăng xuất (Logout)**: Khi người dùng chọn đăng xuất, hệ thống sẽ xóa sạch token và reset trạng thái của ứng dụng.

---

## 3. Phân quyền người dùng (Authorization)

Dựa trên cấu trúc Backend Django, hệ thống áp dụng các quy tắc phân quyền sau:

| Quyền hạn | Khả năng truy cập |
| :--- | :--- |
| **Admin/Staff** | Có toàn quyền: Xem, Thêm, Sửa, Xóa các thực thể (Giáo viên, Lớp, Lịch dạy). |
| **Viewer/Authenticated** | Chỉ có quyền Xem (Read-only) dữ liệu lịch học, không thể thực hiện các hành động thay đổi dữ liệu. |

> [!IMPORTANT]
> Toàn bộ logic kiểm tra quyền được thực hiện ở cả 2 phía:
> 1. **Frontend**: Ẩn/Hiện các nút chức năng (ví dụ: nút "Add Session").
> 2. **Backend**: Kiểm tra qua `permission_classes` (ví dụ: `IsAdminOrStaffWrite`) để đảm bảo bảo mật tuyệt đối.

---

## 4. Giao diện Đăng nhập (Login UI)

Trang đăng nhập được thiết kế tối giản, tập trung vào trải nghiệm người dùng với các thông báo lỗi rõ ràng khi nhập sai thông tin tài khoản hoặc mật khẩu.
