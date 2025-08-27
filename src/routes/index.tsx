import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';

// Placeholder components cho các trang chưa có
const LoginPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Trang Đăng nhập
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Trang này sẽ được phát triển sau
        </p>
      </div>
    </div>
  </div>
);

const BlogPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Trang Blog
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Trang này sẽ được phát triển sau
        </p>
      </div>
    </div>
  </div>
);

const PricingPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bảng Giá
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Trang này sẽ được phát triển sau
        </p>
      </div>
    </div>
  </div>
);

const FAQPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Câu hỏi thường gặp
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Trang này sẽ được phát triển sau
        </p>
      </div>
    </div>
  </div>
);

const ContactPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Liên hệ
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Trang này sẽ được phát triển sau
        </p>
      </div>
    </div>
  </div>
);

// Component chính quản lý routing
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
