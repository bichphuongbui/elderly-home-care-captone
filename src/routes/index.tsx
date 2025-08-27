import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import BlogListPage from '../pages/BlogListPage';
import BlogDetailPage from '../pages/BlogDetailPage';
import { User } from '../services/users.service';

// Types cho user role
type UserRole = 'Care Seeker' | 'Caregiver' | 'Admin' | 'Guest';

// Hook để lấy thông tin user hiện tại
const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('current_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing current user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading };
};

// Placeholder components cho các trang chưa có
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

// Dashboard components cho từng role
const CareSeekerDashboard: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Care Seeker Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Chào mừng bạn đến với bảng điều khiển dành cho người cần chăm sóc
        </p>
        <p className="mt-2 text-center text-sm text-gray-500">
          Tại đây bạn có thể tìm kiếm và đặt lịch với người chăm sóc
        </p>
      </div>
    </div>
  </div>
);

const CaregiverDashboard: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Caregiver Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Chào mừng bạn đến với bảng điều khiển dành cho người chăm sóc
        </p>
        <p className="mt-2 text-center text-sm text-gray-500">
          Tại đây bạn có thể quản lý lịch làm việc và khách hàng của mình
        </p>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Chào mừng bạn đến với bảng điều khiển quản trị
        </p>
        <p className="mt-2 text-center text-sm text-gray-500">
          Tại đây bạn có thể quản lý toàn bộ hệ thống
        </p>
      </div>
    </div>
  </div>
);

// Component redirect cho dashboard chung
const DashboardRedirect: React.FC<{ user: User | null }> = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'Care Seeker':
      return <Navigate to="/careseeker-dashboard" replace />;
    case 'Caregiver':
      return <Navigate to="/caregiver-dashboard" replace />;
    case 'Admin':
      return <Navigate to="/admin-dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

// Component bảo vệ route
interface ProtectedRouteProps {
  children: React.ReactNode;
  user: User | null;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  user, 
  allowedRoles = [],
  requireAuth = true 
}) => {
  // Nếu yêu cầu đăng nhập nhưng không có user
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có user nhưng không có quyền truy cập
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/" replace />;
  }

  // Nếu không yêu cầu đăng nhập hoặc user đã có quyền
  return <>{children}</>;
};

// Component chính quản lý routing
const AppRoutes: React.FC = () => {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes công khai */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/register" 
          element={
            <ProtectedRoute user={user} requireAuth={false}>
              <RegisterPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <ProtectedRoute user={user} requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />

       
        <Route 
          path="/dashboard" 
          element={<DashboardRedirect user={user} />} 
        />

        {/* Dashboard routes theo role */}
        <Route 
          path="/careseeker-dashboard" 
          element={
            <ProtectedRoute user={user} allowedRoles={['Care Seeker']}>
              <CareSeekerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/caregiver-dashboard" 
          element={
            <ProtectedRoute user={user} allowedRoles={['Caregiver']}>
              <CaregiverDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute user={user} allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;