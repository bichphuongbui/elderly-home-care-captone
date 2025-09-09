import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const UploadCredentialsPage: React.FC = () => {
  const [credentials, setCredentials] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      navigate('/login');
      return;
    }

    if (!credentials.trim()) {
      alert('Vui lòng nhập mô tả chứng chỉ và kinh nghiệm.');
      return;
    }

    // Chuẩn bị dữ liệu ảnh (nếu có)
    let credentialImage: string | undefined = undefined;
    if (imageFile) {
      // Chuyển ảnh sang Data URL để lưu cùng payload
      credentialImage = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    }

    setIsSubmitting(true);
    try {
      await axios.put(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${userId}`, {
        credentials: credentials.trim(),
        credentialImage,
        status: 'pending'
      });
      alert('Đã gửi yêu cầu xét duyệt. Vui lòng chờ quản trị viên duyệt.');
      navigate('/login');
    } catch (error) {
      console.error('Cập nhật chứng chỉ thất bại:', error);
      alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tải lên chứng chỉ chuyên môn</h1>
          <p className="text-gray-600 mb-6">
            Vui lòng cung cấp các chứng chỉ và thông tin hành nghề để quản trị viên xét duyệt.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="credentials" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chứng chỉ, bằng cấp, kinh nghiệm
              </label>
              <textarea
                id="credentials"
                name="credentials"
                value={credentials}
                onChange={(e) => setCredentials(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-gray-300"
                placeholder="Ví dụ: Chứng chỉ điều dưỡng, 3 năm kinh nghiệm chăm sóc người cao tuổi..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh chứng chỉ (tùy chọn)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) {
                    alert('Ảnh quá lớn (tối đa 5MB).');
                    return;
                  }
                  setImageFile(file);
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setImagePreview(previewUrl);
                  } else {
                    setImagePreview('');
                  }
                }}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Xem trước ảnh chứng chỉ" className="max-h-56 rounded-md border" />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 text-lg font-semibold rounded-lg text-white transition-colors ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu xét duyệt'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UploadCredentialsPage;


