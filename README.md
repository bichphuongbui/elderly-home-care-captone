# Nền tảng Chăm sóc Người cao tuổi ứng dụng AI

Dự án React + TypeScript tạo trang homepage cho nền tảng chăm sóc người cao tuổi sử dụng công nghệ AI.

## 🚀 Tính năng

- **Header**: Navigation menu responsive với logo và auth buttons
- **Register Page**: Trang đăng ký với form validation và giao diện thân thiện người lớn tuổi
- **Hero Section**: Tiêu đề chính và call-to-action
- **Giới thiệu hệ thống**: Thông tin tổng quan về dịch vụ
- **Tính năng chính**: 6 tính năng nổi bật với icon minh họa
- **Blog Preview**: Hiển thị 3 bài blog mới nhất
- **Bảng giá**: 3 gói dịch vụ với giá cả chi tiết
- **FAQ**: Câu hỏi thường gặp với giao diện mở/đóng
- **Footer**: Thông tin liên hệ và đường dây nóng khẩn cấp

## 🛠️ Công nghệ sử dụng

- **React 18** với Functional Components
- **TypeScript** cho type safety
- **TailwindCSS** cho styling
- **Vite** cho build tool
- **Responsive Design** tương thích mobile

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Navigation header responsive
│   │   └── HeaderDemo.tsx       # Demo page cho Header
│   └── home/
│       ├── HeroSection.tsx      # Hero section với tiêu đề chính
│       ├── Introduction.tsx     # Giới thiệu hệ thống
│       ├── Features.tsx         # Tính năng chính
│       ├── BlogPreview.tsx      # Preview blog
│       ├── Pricing.tsx          # Bảng giá dịch vụ
│       ├── FAQ.tsx              # Câu hỏi thường gặp
│       └── Footer.tsx           # Footer với liên hệ
├── pages/
│   ├── HomePage.tsx             # Trang chủ tổng hợp
│   └── RegisterPage.tsx         # Trang đăng ký
├── main.tsx                     # Entry point
└── index.css                    # Global styles với Tailwind
```

## 🚀 Hướng dẫn chạy dự án

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

### 3. Build cho production
```bash
npm run build
```

### 4. Preview build
```bash
npm run preview
```

## 📱 Responsive Design

Trang web được thiết kế responsive với các breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎨 Design System

### Màu sắc chính
- **Primary**: Blue (#3b82f6, #2563eb, #1d4ed8)
- **Secondary**: Gray (#64748b, #475569)
- **Background**: White, Gray-50, Gray-100

### Typography
- **Font**: Inter (system fallback)
- **Headings**: Font-bold với các kích thước responsive
- **Body**: Font-normal với line-height tối ưu

## 📋 Tính năng chi tiết

### Hero Section
- Tiêu đề: "Nền tảng Chăm sóc Người cao tuổi ứng dụng AI"
- Mô tả ngắn gọn về dịch vụ
- 2 CTA buttons: "Khám phá ngay" và "Xem demo"
- 3 số liệu nổi bật: 24/7, AI, 99.9%

### Tính năng chính (6 tính năng)
1. 🩺 Giám sát sức khỏe thông minh
2. 🚨 Cảnh báo khẩn cấp tức thời
3. 💊 Quản lý thuốc thông minh
4. 📊 Báo cáo sức khỏe chi tiết
5. 👥 Kết nối gia đình
6. 🎯 Chăm sóc cá nhân hóa

### Bảng giá (3 gói)
- **Cơ Bản**: 299.000đ/tháng
- **Tiêu Chuẩn**: 599.000đ/tháng (Popular)
- **Cao Cấp**: 999.000đ/tháng

### Blog (3 bài mẫu)
1. "5 Bài tập thể dục nhẹ nhàng cho người cao tuổi"
2. "Dinh dưỡng cân bằng: Chìa khóa cho tuổi già khỏe mạnh"
3. "Công nghệ AI trong chăm sóc sức khỏe: Tương lai đã đến"

### FAQ (3 câu hỏi)
1. Bảo mật thông tin cá nhân
2. Tính dễ sử dụng của thiết bị
3. Chi phí và phí phát sinh

## 📞 Thông tin liên hệ (Mock data)

- **Email**: support@eldercare-ai.vn
- **Hotline**: 1900 123 456
- **Khẩn cấp**: 1900 911 911
- **Địa chỉ**: 123 Đường Công Nghệ, Quận 1, TP.HCM

## 🔧 Customization

Để tùy chỉnh màu sắc, chỉnh sửa file `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Thay đổi màu primary tại đây
      }
    }
  }
}
```

## 📝 Header Component Chi tiết

### Tính năng Header:
- **Logo**: Text "AI Elderly Care" ở góc trái với hover effect
- **Navigation Menu**: 6 mục chính với underline animation
  - Trang chủ (/)
  - Giới thiệu (/about)
  - Blog (/blog)
  - Bảng giá (/pricing)
  - FAQ (/faq)
  - Liên hệ (/contact)
- **Auth Buttons**: Đăng nhập và Đăng ký ở góc phải
- **Responsive Design**: 
  - Desktop: Full navigation menu
  - Mobile: Hamburger menu với smooth animation
- **Sticky Header**: Luôn hiển thị khi scroll
- **Smooth Transitions**: Hover effects và animations

### Demo Header:
Để test riêng Header component, import `HeaderDemo`:
```tsx
import HeaderDemo from './components/layout/HeaderDemo';
// Sử dụng <HeaderDemo /> thay vì <HomePage />
```

## 📝 Register Page Chi tiết

### Tính năng Register Page:
- **Form Fields**: 5 trường bắt buộc với validation
  - Họ và tên (text input)
  - Email (email validation)
  - Mật khẩu (min 6 ký tự)
  - Xác nhận mật khẩu (phải khớp)
  - Vai trò (select: Guest | Care Seeker | Caregiver)
- **Validation**: 
  - Kiểm tra trường trống
  - Email format validation
  - Password confirmation matching
  - Real-time error clearing
- **Form Handling**:
  - TypeScript interfaces cho type safety
  - Console.log dữ liệu khi submit thành công
  - Loading state khi submit
  - Form reset sau khi thành công
- **Elderly-Friendly Design**:
  - Font size lớn (text-lg)
  - Spacing rộng rãi
  - Màu sắc tương phản cao
  - Labels rõ ràng với required indicators
  - Error messages dễ đọc

### Demo Register Page:
Để test RegisterPage, thay đổi import trong `main.tsx`:
```tsx
import RegisterPage from './pages/RegisterPage';
// Hoặc sử dụng file RegisterDemo.tsx có sẵn
```

### Role Options:
- **Guest**: Khách thăm quan
- **Care Seeker**: Người cần chăm sóc (người cao tuổi hoặc gia đình)
- **Caregiver**: Người chăm sóc chuyên nghiệp

## 📝 Ghi chú

- Tất cả dữ liệu đều là mock data để demo
- Components được tách riêng để dễ maintain và reuse
- Code có comment tiếng Việt để dễ hiểu
- Tuân thủ best practices của React và TypeScript
- Header component hoàn toàn responsive và accessible
