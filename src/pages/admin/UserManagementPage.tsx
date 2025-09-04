import React, { useEffect, useState } from 'react';
import { getAllUsers, registerUser } from '../../services/users.service';
import { User } from '../../services/users.service';

// Interface cho user với status
interface UserWithStatus extends User {
  status: 'active' | 'blocked';
}

// Interface cho form data
interface UserFormData {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

// Interface cho modal
interface UserModalProps {
  user: UserWithStatus | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'create';
  onSubmit?: (data: UserFormData) => void;
}

// Component Modal hiển thị thông tin chi tiết user
const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, mode, onSubmit }) => {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'Care Seeker'
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  // Reset form khi modal mở
  useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        setFormData({
          fullName: '',
          email: '',
          password: '',
          role: 'Care Seeker'
        });
      } else if (user) {
        setFormData({
          fullName: user.fullName,
          email: user.email,
          password: '', // Không hiển thị password khi edit
          role: user.role
        });
      }
      setErrors({});
    }
  }, [isOpen, user, mode]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (mode === 'create' && !formData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (mode === 'create' && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.role) {
      newErrors.role = 'Vui lòng chọn vai trò';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof UserFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {isCreateMode ? 'Thêm người dùng mới' : 
             isEditMode ? 'Chỉnh sửa người dùng' : 'Thông tin chi tiết'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {isViewMode ? (
          // View mode - chỉ hiển thị thông tin
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Họ tên:</label>
              <p className="text-gray-900">{user?.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email:</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Vai trò:</label>
              <p className="text-gray-900">{user?.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Trạng thái:</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user?.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user?.status === 'active' ? 'Hoạt động' : 'Đã khoá'}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ngày tạo:</label>
              <p className="text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : ''}</p>
            </div>
          </div>
        ) : (
          // Edit/Create mode - hiển thị form
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ tên */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập họ tên"
                disabled={isViewMode}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
                disabled={isViewMode}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Mật khẩu - chỉ hiển thị khi tạo mới */}
            {isCreateMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}

            {/* Vai trò */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isViewMode}
              >
                <option value="">Chọn vai trò</option>
                <option value="Care Seeker">Care Seeker</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
          </form>
        )}
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            {isViewMode ? 'Đóng' : 'Hủy'}
          </button>
          {!isViewMode && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isCreateMode ? 'Thêm' : 'Lưu'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Component chính UserManagementPage
const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');

  // Fetch users từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        
        // Thêm status ngẫu nhiên cho mỗi user
        const usersWithStatus: UserWithStatus[] = usersData.map(user => ({
          ...user,
          status: Math.random() > 0.3 ? 'active' : 'blocked' // 70% active, 30% blocked
        }));
        
        setUsers(usersWithStatus);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Toggle trạng thái user
  const toggleUserStatus = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
          : user
      )
    );
  };

  // Mở modal xem chi tiết
  const openUserModal = (user: UserWithStatus, mode: 'view' | 'edit' = 'view') => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  // Mở modal tạo mới
  const openCreateModal = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle submit form
  const handleSubmitForm = async (formData: UserFormData) => {
    try {
      if (modalMode === 'create') {
        // Tạo user mới
        const newUser = await registerUser(formData);
        const userWithStatus: UserWithStatus = {
          ...newUser,
          status: 'active'
        };
        setUsers(prev => [...prev, userWithStatus]);
        closeModal();
      } else if (modalMode === 'edit' && selectedUser) {
        // Cập nhật user (tạm thời chỉ update local state)
        setUsers(prev => 
          prev.map(user => 
            user.id === selectedUser.id 
              ? { ...user, ...formData }
              : user
          )
        );
        closeModal();
      }
    } catch (error) {
      console.error('Lỗi khi xử lý form:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="mt-2 text-gray-600">Quản lý và theo dõi tất cả người dùng trong hệ thống</p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm người dùng
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Đã khoá'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openUserModal(user, 'view')}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md transition-colors"
                        >
                          Xem
                        </button>
                        <button
                          onClick={() => openUserModal(user, 'edit')}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-3 py-1 rounded-md transition-colors ${
                            user.status === 'active'
                              ? 'text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200'
                              : 'text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200'
                          }`}
                        >
                          {user.status === 'active' ? 'Khoá' : 'Mở khoá'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty state */}
        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có người dùng</h3>
            <p className="mt-1 text-sm text-gray-500">Chưa có người dùng nào trong hệ thống.</p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Thêm người dùng đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <UserModal 
        user={selectedUser} 
        isOpen={isModalOpen} 
        onClose={closeModal}
        mode={modalMode}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};

export default UserManagementPage;
