import React from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiDollarSign, FiUser, FiPlay, FiBookOpen, FiTarget } from 'react-icons/fi';

const CareGiverDashboardPage: React.FC = () => {
  // Lấy thông tin user từ localStorage
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem('current_user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error parsing current user:', error);
    }
    return null;
  };

  const currentUser = getCurrentUser();
  const caregiverName = currentUser?.fullName || currentUser?.name || currentUser?.username || "Người chăm sóc";
  
  const todayBookings = [
    {
      id: 1,
      patientName: "Bà Nguyễn Thị B",
      time: "08:00 - 10:00",
      service: "Chăm sóc cá nhân",
      status: "pending"
    },
    {
      id: 2,
      patientName: "Ông Trần Văn C",
      time: "14:00 - 16:00",
      service: "Vận động trị liệu",
      status: "pending"
    },
    {
      id: 3,
      patientName: "Bà Lê Thị D",
      time: "18:00 - 20:00",
      service: "Chăm sóc buổi tối",
      status: "pending"
    }
  ];

  const tasks = [
    {
      id: 1,
      description: "Cập nhật hồ sơ bệnh nhân Bà Nguyễn Thị B",
      deadline: "Hôm nay",
      status: "pending"
    },
    {
      id: 2,
      description: "Hoàn thành báo cáo tuần",
      deadline: "Ngày mai",
      status: "in-progress"
    },
    {
      id: 3,
      description: "Tham gia khóa đào tạo mới",
      deadline: "Tuần sau",
      status: "pending"
    }
  ];

  const trainingCourses = [
    {
      id: 1,
      name: "Kỹ năng chăm sóc người cao tuổi",
      duration: "2 giờ",
      level: "Cơ bản"
    },
    {
      id: 2,
      name: "Xử lý tình huống khẩn cấp",
      duration: "1.5 giờ",
      level: "Nâng cao"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng, {caregiverName}!
        </h1>
        <p className="text-gray-600 text-lg">
          Dưới đây là tổng quan về hoạt động chăm sóc của bạn
        </p>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiCalendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Booking sắp tới</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiClock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang thực hiện</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiDollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Có thể rút</p>
              <p className="text-2xl font-bold text-gray-900">2.4M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FiCalendar className="h-5 w-5 mr-2 text-blue-600" />
          Lịch làm việc hôm nay
        </h2>
        <div className="space-y-4">
          {todayBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiUser className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{booking.patientName}</h3>
                  <p className="text-sm text-gray-600">{booking.time} • {booking.service}</p>
                </div>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiPlay className="h-4 w-4 mr-1" />
                Bắt đầu
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FiTarget className="h-5 w-5 mr-2 text-green-600" />
          Nhiệm vụ được giao
        </h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiTarget className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{task.description}</h3>
                  <p className="text-sm text-gray-600">Hạn: {task.deadline}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status === 'pending' ? 'Chờ xử lý' : 
                 task.status === 'in-progress' ? 'Đang thực hiện' : 'Hoàn thành'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Training Suggestions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FiBookOpen className="h-5 w-5 mr-2 text-purple-600" />
          Gợi ý đào tạo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainingCourses.map((course) => (
            <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.duration} • {course.level}</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Xem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareGiverDashboardPage;
