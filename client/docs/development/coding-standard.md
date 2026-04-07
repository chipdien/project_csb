# Quy định về lập trình (Coding Standard)

Tài liệu này xác định các nguyên tắc và tiêu chuẩn lập trình cho dự án nhằm đảm bảo tính nhất quán và dễ bảo trì.

## 1. Quy tắc đặt tên (Naming Conventions)

- **Biến và Hàm (Variable & Function)**: Sử dụng `camelCase` (ví dụ: `userName`, `calculateTotal`).
- **Thành phần (Component)**: Sử dụng `PascalCase` cho tên file và tên component (ví dụ: `Sidebar.tsx`, `TeachingGrid.tsx`).
- **Hằng số (Constants)**: Sử dụng `UPPER_SNAKE_CASE` (ví dụ: `API_BASE_URL`).
- **File Styles**: Sử dụng `kebab-case` cho tên file CSS (ví dụ: `global-styles.css`).

## 2. Cấu trúc Component

Mỗi component nên được cấu trúc theo mẫu sau:

```tsx
import React from 'react';
// Styles & Hooks
// Utils

interface ComponentProps {
  // Types defined here
}

export const MyComponent: React.FC<ComponentProps> = ({ prop1 }) => {
  // Logic hooks
  
  return (
    <div className="tailwind-classes">
      {/* UI structure */}
    </div>
  );
};
```

- **Mỗi file nên chỉ chứa 1 component chính.**
- **Ưu tiên sử dụng Functional Components và Hooks.**
- **Kiểm soát kiểu dữ liệu nghiêm ngặt** với TypeScript (Tránh sử dụng `any`).

## 3. Styling & Tailwind CSS

- **Hạn chế viết CSS thuần**, tận dụng tối đa các lớp tiện ích (Utility classes) của Tailwind v4.
- **Biến thiết kế**: Sử dụng các biến được định nghĩa trong `@theme` tại `index.css` (ví dụ: `--color-primary`).
- **Sắp xếp class**: Theo thứ tự (Layout -> Box sizing -> Typography -> Visual).

## 4. Kiểm soát lỗi & Linting

- **Chạy `npm run lint` trước khi commit code.**
- **Không để lại console.log trong mã nguồn Production.**
- **Sử dụng Error Boundaries** cho các thành phần lớn để tránh crash toàn bộ ứng dụng.
