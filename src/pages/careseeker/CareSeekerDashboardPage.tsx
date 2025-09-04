import React from 'react';
import { FiCalendar, FiUsers, FiClock, FiVideo, FiStar, FiAlertTriangle, FiPackage, FiActivity } from 'react-icons/fi';

// Mock data types
interface Caregiver {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  experience: string;
}

interface Alert {
  id: number;
  time: string;
  content: string;
  type: 'warning' | 'info' | 'success';
}

interface Reminder {
  id: number;
  title: string;
  time: string;
  type: 'medication' | 'appointment';
  description: string;
}

const CareSeekerDashboardPage: React.FC = () => {
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
  const userName = currentUser?.fullName || currentUser?.name || currentUser?.username || "Người dùng";

  // Mock statistics data
  const stats = [
    { label: 'Lượt đặt lịch', value: '12', icon: FiCalendar, color: 'blue' },
    { label: 'Người chăm sóc', value: '5', icon: FiUsers, color: 'green' },
    { label: 'Lịch hẹn sắp tới', value: '3', icon: FiClock, color: 'orange' },
    { label: 'Tư vấn video', value: '8', icon: FiVideo, color: 'purple' },
  ];

  // Mock caregivers data
  const caregivers: Caregiver[] = [
    {
      id: 1,
      name: 'Trần Thị Mai',
      avatar: '👩‍⚕️',
      specialty: 'Chăm sóc người cao tuổi',
      rating: 4.8,
      experience: '5 năm kinh nghiệm'
    },
    {
      id: 2,
      name: 'Lê Văn Hùng',
      avatar: '👨‍⚕️',
      specialty: 'Vật lý trị liệu',
      rating: 4.9,
      experience: '8 năm kinh nghiệm'
    },
    {
      id: 3,
      name: 'Phạm Thu Hà',
      avatar: '👩‍⚕️',
      specialty: 'Dinh dưỡng & Chăm sóc',
      rating: 4.7,
      experience: '6 năm kinh nghiệm'
    }
  ];

  // Mock alerts data
  const alerts: Alert[] = [
    {
      id: 1,
      time: '14:32 hôm qua',
      content: 'Huyết áp cao bất thường',
      type: 'warning'
    },
    {
      id: 2,
      time: '09:15 hôm nay',
      content: 'Nhắc nhở uống thuốc buổi sáng',
      type: 'info'
    },
    {
      id: 3,
      time: '16:45 hôm qua',
      content: 'Lịch khám bệnh đã được xác nhận',
      type: 'success'
    }
  ];

  // Mock reminders data
  const reminders: Reminder[] = [
    {
      id: 1,
      title: 'Uống thuốc huyết áp',
      time: '08:00',
      type: 'medication',
      description: 'Thuốc hạ huyết áp - 1 viên'
    },
    {
      id: 2,
      title: 'Khám bệnh định kỳ',
      time: '14:30',
      type: 'appointment',
      description: 'Bệnh viện Đa khoa TP.HCM - Phòng 302'
    },
    {
      id: 3,
      title: 'Uống thuốc tiểu đường',
      time: '19:00',
      type: 'medication',
      description: 'Thuốc kiểm soát đường huyết - 1 viên'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };
    return colorMap[color] || colorMap.blue;
  };

  const getAlertColor = (type: string) => {
    const colorMap: Record<string, string> = {
      warning: 'bg-red-50 text-red-600 border-red-200',
      info: 'bg-blue-50 text-blue-600 border-blue-200',
      success: 'bg-green-50 text-green-600 border-green-200',
    };
    return colorMap[type] || colorMap.info;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng, {userName}!
        </h1>
        <p className="text-lg text-gray-600">
          Dưới đây là thông tin tổng quan về tình trạng chăm sóc của bạn
        </p>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suggested Caregivers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiUsers className="h-5 w-5 mr-2 text-blue-600" />
            Gợi ý người chăm sóc phù hợp
          </h2>
          <div className="space-y-4">
            {caregivers.map((caregiver) => (
              <div key={caregiver.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-3xl">{caregiver.avatar}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{caregiver.name}</h3>
                  <p className="text-sm text-gray-600">{caregiver.specialty}</p>
                  <p className="text-xs text-gray-500">{caregiver.experience}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(caregiver.rating)}
                    <span className="ml-2 text-sm text-gray-600">{caregiver.rating}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiAlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Cảnh báo gần đây
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alert.content}</p>
                    <p className="text-sm text-gray-600 mt-1">{alert.time}</p>
                  </div>
                  <div className="ml-3">
                    <FiAlertTriangle className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reminders & Care Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FiActivity className="h-5 w-5 mr-2 text-green-600" />
          Nhắc nhở & Lịch chăm sóc
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${reminder.type === 'medication' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                  {reminder.type === 'medication' ? <FiPackage className="h-5 w-5" /> : <FiCalendar className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                  <p className="text-sm font-medium text-gray-500 mt-2">{reminder.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareSeekerDashboardPage;
