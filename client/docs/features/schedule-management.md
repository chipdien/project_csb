# Quản lý lịch dạy (Schedule Management)

Đây là tính năng cốt lõi của ứng dụng, hỗ trợ hiển thị và quản lý lịch giảng dạy của giáo viên theo dạng lưới (Grid) hàng tuần.

## 1. Thành phần giao diện (UI Grid)

Lưới lịch dạy được thiết kế để hiển thị thông tin tối ưu nhất cho người dùng:

- **Hàng (Rows)**: Đại diện cho các **Khối lớp** hoặc **Cấp độ** giảng dạy (Grade Levels, ví dụ: Gr. 10, Gr. 11, Gr. 12).
- **Cột (Columns)**: Đại diện cho các **Ngày trong tuần** từ Thứ Hai (Monday) đến Chủ Nhật (Sunday).
- **Ô dữ liệu (Cells)**: Chứa thông tin về ca dạy cụ thể.

### Chi tiết một ca dạy (Session Card):
Mỗi thẻ trong ô chứa:
1. **Tên môn học/nội dung**: (ví dụ: Advanced Calc I, Quantum Mechanics).
2. **Thời gian**: (ví dụ: 8:00 - 10:00).
3. **Phòng học**: (ví dụ: R. 402, Lab 4).
4. **Trạng thái**: Hiển thị qua màu sắc của viền bên trái (Border-left).

## 2. Tìm kiếm và Lọc (Search & Filtering)

Người dùng có thể nhanh chóng tìm lịch dạy thông qua thanh tìm kiếm ở đầu trang:
- Tìm theo **Mã lớp**.
- Tìm theo **Tên giáo viên**.

Các bộ lọc nhanh theo **Tuần**, **Tháng**, **Ngày** giúp thay đổi chế độ hiển thị linh hoạt.

## 3. Thống kê nhanh (Stats Row)

Phía trên lưới lịch dạy là các chỉ số thống kê quan trọng (KPIs):
- **Tổng lớp học**: Tỷ lệ lớp đã lên lịch so với tổng số lớp.
- **Tổng giờ dạy**: Tổng số giờ giảng dạy tích lũy.
- **Giáo viên**: Số lượng giáo viên đang hoạt động trong tuần.
- **Phòng học**: Tỷ lệ sử dụng phòng học thực tế.

## 4. Hành động chính (Primary Actions)

- **Thêm ca dạy mới**: Sử dụng Floating Action Button (FAB) hoặc nút "Add Session" trên Sidebar.
- **Chỉnh sửa ca dạy**: Nhấp trực tiếp vào một ô trong lưới để thay đổi thông tin.
- **Chuyển đổi tuần**: Sử dụng trình chọn ngày (Date Range Picker) để xem lịch của các tuần trước hoặc sau.
