import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { registerUser, RegisterUserPayload, checkEmailExists } from '../services/users.service';

// Interface cho form data
interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

// Interface cho validation errors
interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}



// Trang đăng ký với form validation và giao diện thân thiện người lớn tuổi
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string>('');

  // Clear old localStorage data khi component mount
  useEffect(() => {
    // Xóa dữ liệu cũ từ localStorage nếu có
    localStorage.removeItem('mock_users');
    localStorage.removeItem('registered_users');
  }, []);



  // Danh sách vai trò
  const roleOptions = [
    { value: '', label: 'Chọn vai trò của bạn' },
    { value: 'Care Seeker', label: 'Người cần chăm sóc (Care Seeker)' },
    { value: 'Caregiver', label: 'Người chăm sóc (Caregiver)' }
  ];

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form cơ bản (không bao gồm check email trùng lặp)
  const validateFormBasic = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Kiểm tra họ và tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    // Kiểm tra email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Kiểm tra xác nhận mật khẩu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Kiểm tra vai trò
    if (!formData.role) {
      newErrors.role = 'Vui lòng chọn vai trò';
    }

    return newErrors;
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form cơ bản trước
    const basicErrors = validateFormBasic();
    if (Object.keys(basicErrors).length > 0) {
      setErrors(basicErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Kiểm tra email đã tồn tại từ API
      const emailExists = await checkEmailExists(formData.email.toLowerCase().trim());
      if (emailExists) {
        setErrors({ email: 'Email đã được sử dụng' });
        setIsSubmitting(false);
        return;
      }

      // Tạo payload để gửi đến API
      const payload: RegisterUserPayload = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role
      };

      // Gọi API để đăng ký user
      const newUser = await registerUser(payload);
      
      // Lưu thông tin user hiện tại vào localStorage
      localStorage.setItem('current_user', JSON.stringify(newUser));
      
      // Hiển thị thông báo thành công
      setSuccessMessage('Đăng ký thành công');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
      });
      setErrors({});
      
      // Điều hướng đến dashboard sau 2 giây
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng ký tài khoản
          </h1>
          <p className="text-lg text-gray-600">
            Tham gia cộng đồng chăm sóc người cao tuổi
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Họ và tên */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập họ và tên đầy đủ"
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Vai trò */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600">{errors.role}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Chọn vai trò phù hợp để chúng tôi có thể hỗ trợ bạn tốt nhất
              </p>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200'
                } text-white`}
              >
                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
              </button>
            </div>
          </form>

          {/* Navigation links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate('/')}
                type="button"
                className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay về trang chủ
              </button>
              
              <div className="text-center">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Đăng nhập ngay
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Chính sách bảo mật
            </a>{' '}
            của chúng tôi.
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
