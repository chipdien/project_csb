# Quản lý lịch dạy (Schedule Management)

Tính năng này cho phép quản trị viên và giáo viên theo dõi, điều phối lịch giảng dạy tại các cơ sở của VietElite một cách trực quan qua giao diện Dashboard.

## 1. Giao diện Lịch dạy (Schedule Grid)

Dữ liệu lịch dạy được tổ chức theo mô hình ma trận giúp tối ưu hóa việc quan sát:

- **Trục ngang (Cột)**: Hiển thị các ngày trong tuần (Thứ Hai đến Chủ Nhật) theo khoảng ngày đã chọn.
- **Trục dọc (Hàng)**: Phân nhóm theo **Khối lớp** (từ Khối 6 đến Khối 12).
- **Thẻ ca học (Session Cards)**: Hiển thị thông tin mã lớp, thời gian bắt đầu - kết thúc, và giáo viên phụ trách.

### Tính năng tương tác:
- **Click header**: Mở rộng hoặc thu gọn danh sách ca học của từng ngày để tối ưu không gian hiển thị.
- **Hover**: Xem chi tiết thông tin ca học và các ghi chú liên quan.

---

## 2. Hệ thống Tìm kiếm và Bộ lọc (Filtering)

Để quản lý hàng trăm ca học, hệ thống cung cấp các bộ lọc mạnh mẽ:

| Bộ lọc | Mô tả |
| :--- | :--- |
| **Cơ sở đào tạo** | Lọc toàn bộ lịch của một cơ sở cụ thể (Văn Quán, Đỗ Quang, v.v.) |
| **Khối lớp** | Lọc nhanh các ca học theo khối (ví dụ: chỉ xem khối 12 để điều phối ôn thi) |
| **Điều hướng thời gian** | Chọn tuần hiện tại, tuần trước hoặc tuần tiếp theo |

> [!NOTE]
> Mặc định khi vào Dashboard, hệ thống sẽ tự động hiển thị lịch của **Tuần hiện tại** dựa trên thời gian thực tế của máy chủ.

---

## 3. Quy trình thêm ca dạy mới (Add Session)

Quản trị viên có thể thêm ca dạy thông qua Modal thông minh:

1. **Chọn khối**: Hệ thống tự động fetch danh sách lớp học tương ứng với khối đó.
2. **Chọn lớp & Giáo viên**: Danh sách được đồng bộ hóa từ Database Backend.
3. **Chọn thời gian & Cơ sở**: Kiểm tra tính hợp lệ của thời gian bắt đầu/kết thúc.
4. **Xác nhận (Confirmation Flow)**: Trước khi lưu, hệ thống hiển thị bản tóm tắt các thông tin đã chọn để tránh sai sót dữ liệu.

---

## 4. Đồng bộ hóa dữ liệu (Data Sync)

- **Backend**: API RESTful trả về dữ liệu lịch dạy đã được sắp xếp theo Khối và Ngày.
- **Frontend**: Sử dụng Custom Hook `useSchedule` để quản lý trạng thái loading và cập nhật UI ngay lập tức khi thêm thành công ca dạy mới.
