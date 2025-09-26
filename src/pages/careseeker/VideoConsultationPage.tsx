import React, { useState } from 'react';
import { FiVideo, FiCalendar, FiClock, FiUser, FiStar, FiPhone, FiMail, FiMapPin, FiX, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiSettings } from 'react-icons/fi';

// Mock data types
interface VideoConsultation {
  id: number;
  title: string;
  description: string;
  caregiver: {
    name: string;
    avatar: string;
    specialty: string;
    rating: number;
    experience: string;
  };
  elderlyPerson: {
    name: string;
    age: number;
    relationship: string;
    avatar: string;
  };
  scheduledTime: string;
  duration: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  meetingId: string;
  meetingPassword?: string;
  notes?: string;
  recordingUrl?: string;
}

interface ConsultationHistory {
  id: number;
  title: string;
  caregiver: {
    name: string;
    avatar: string;
    specialty: string;
  };
  elderlyPerson: {
    name: string;
    avatar: string;
  };
  completedTime: string;
  duration: number;
  rating: number;
  review?: string;
  recordingUrl: string;
}

const VideoConsultationPage: React.FC = () => {
  const [selectedConsultation, setSelectedConsultation] = useState<VideoConsultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedHistoryConsultation, setSelectedHistoryConsultation] = useState<ConsultationHistory | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Mock data
  const upcomingConsultations: VideoConsultation[] = [
    {
      id: 1,
      title: 'Tư vấn sức khỏe định kỳ',
      description: 'Kiểm tra tình trạng sức khỏe tổng thể và tư vấn chế độ dinh dưỡng',
      caregiver: {
        name: 'Trần Thị Mai',
        avatar: '👩‍⚕️',
        specialty: 'Chăm sóc người cao tuổi',
        rating: 4.9,
        experience: '6 năm kinh nghiệm'
      },
      elderlyPerson: {
        name: 'Nguyễn Văn Bố',
        age: 72,
        relationship: 'Bố',
        avatar: '👨‍🦳'
      },
      scheduledTime: '2024-01-25T14:00:00',
      duration: 30,
      status: 'upcoming',
      meetingId: '123-456-789',
      meetingPassword: 'health123',
      notes: 'Chuẩn bị kết quả xét nghiệm máu và huyết áp'
    },
    {
      id: 2,
      title: 'Tư vấn vật lý trị liệu',
      description: 'Hướng dẫn các bài tập phục hồi chức năng cho người cao tuổi',
      caregiver: {
        name: 'Lê Văn Hùng',
        avatar: '👨‍⚕️',
        specialty: 'Vật lý trị liệu',
        rating: 4.7,
        experience: '4 năm kinh nghiệm'
      },
      elderlyPerson: {
        name: 'Trần Thị Mẹ',
        age: 68,
        relationship: 'Mẹ',
        avatar: '👩‍🦳'
      },
      scheduledTime: '2024-01-26T10:00:00',
      duration: 45,
      status: 'upcoming',
      meetingId: '987-654-321',
      meetingPassword: 'therapy456',
      notes: 'Chuẩn bị không gian rộng rãi để tập luyện'
    }
  ];

  const liveConsultations: VideoConsultation[] = [
    {
      id: 3,
      title: 'Tư vấn dinh dưỡng',
      description: 'Tư vấn chế độ ăn uống phù hợp cho người tiểu đường',
      caregiver: {
        name: 'Phạm Thu Hà',
        avatar: '👩‍⚕️',
        specialty: 'Chuyên gia dinh dưỡng',
        rating: 4.8,
        experience: '5 năm kinh nghiệm'
      },
      elderlyPerson: {
        name: 'Nguyễn Văn Bố',
        age: 72,
        relationship: 'Bố',
        avatar: '👨‍🦳'
      },
      scheduledTime: '2024-01-24T15:30:00',
      duration: 30,
      status: 'live',
      meetingId: '555-666-777',
      meetingPassword: 'nutrition789'
    }
  ];

  const consultationHistory: ConsultationHistory[] = [
    {
      id: 1,
      title: 'Tư vấn sức khỏe tim mạch',
      caregiver: {
        name: 'Trần Thị Mai',
        avatar: '👩‍⚕️',
        specialty: 'Chăm sóc người cao tuổi'
      },
      elderlyPerson: {
        name: 'Nguyễn Văn Bố',
        avatar: '👨‍🦳'
      },
      completedTime: '2024-01-20T14:00:00',
      duration: 25,
      rating: 5,
      review: 'Rất hài lòng với buổi tư vấn, bác sĩ rất tận tâm',
      recordingUrl: 'https://example.com/recording1'
    },
    {
      id: 2,
      title: 'Tư vấn vật lý trị liệu',
      caregiver: {
        name: 'Lê Văn Hùng',
        avatar: '👨‍⚕️',
        specialty: 'Vật lý trị liệu'
      },
      elderlyPerson: {
        name: 'Trần Thị Mẹ',
        avatar: '👩‍🦳'
      },
      completedTime: '2024-01-18T10:00:00',
      duration: 40,
      rating: 4,
      review: 'Hướng dẫn rất chi tiết và dễ hiểu',
      recordingUrl: 'https://example.com/recording2'
    }
  ];

  const handleJoinConsultation = (consultation: VideoConsultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConsultation(null);
    setIsVideoPlaying(false);
  };

  const handleViewHistory = (consultation: ConsultationHistory) => {
    setSelectedHistoryConsultation(consultation);
    setIsHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setSelectedHistoryConsultation(null);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp tới';
      case 'live':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FiVideo className="h-8 w-8 mr-3 text-blue-600" />
          Video Tư vấn
        </h1>
        <p className="text-lg text-gray-600">
          Kết nối trực tiếp với chuyên gia chăm sóc sức khỏe qua video call
        </p>
      </div>

      {/* Live Consultations */}
      {liveConsultations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            Đang diễn ra
          </h2>
          <div className="space-y-4">
            {liveConsultations.map((consultation) => (
              <div key={consultation.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{consultation.elderlyPerson.avatar}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{consultation.title}</h3>
                        <p className="text-sm text-gray-600">{consultation.elderlyPerson.name} ({consultation.elderlyPerson.age} tuổi)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FiUser className="h-4 w-4 mr-1" />
                        {consultation.caregiver.name}
                      </span>
                      <span className="flex items-center">
                        <FiClock className="h-4 w-4 mr-1" />
                        {consultation.duration} phút
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinConsultation(consultation)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <FiPlay className="h-4 w-4 mr-2" />
                    Tham gia ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Consultations - Compact */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiCalendar className="h-5 w-5 mr-2 text-blue-600" />
            Lịch tư vấn sắp tới
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xem tất cả →
          </button>
        </div>
        
        <div className="space-y-3">
          {upcomingConsultations.slice(0, 2).map((consultation) => {
            const { date, time } = formatDateTime(consultation.scheduledTime);
            return (
              <div key={consultation.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{consultation.elderlyPerson.avatar}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{consultation.title}</h3>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{consultation.elderlyPerson.name}</span>
                      <span>•</span>
                      <span>{date} {time}</span>
                      <span>•</span>
                      <span>{consultation.duration} phút</span>
                      <div className="flex items-center">
                        <span className="text-xs">{consultation.caregiver.avatar}</span>
                        <span className="ml-1">{consultation.caregiver.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinConsultation(consultation)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Tham gia
                </button>
              </div>
            );
          })}
        </div>
        
        {upcomingConsultations.length > 2 && (
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              Và {upcomingConsultations.length - 2} cuộc tư vấn khác
            </span>
          </div>
        )}
      </div>

      {/* Consultation History - Compact */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiClock className="h-5 w-5 mr-2 text-gray-600" />
            Lịch sử tư vấn
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xem tất cả →
          </button>
        </div>
        
        {/* Compact list - chỉ hiển thị 2 item gần nhất */}
        <div className="space-y-3">
          {consultationHistory.slice(0, 2).map((consultation) => (
            <div key={consultation.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{consultation.elderlyPerson.avatar}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{consultation.title}</h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>{consultation.elderlyPerson.name}</span>
                    <span>•</span>
                    <span>{formatDateTime(consultation.completedTime).date}</span>
                    <span>•</span>
                    <span>{consultation.duration} phút</span>
                    <div className="flex items-center">
                      {renderStars(consultation.rating)}
                      <span className="ml-1">{consultation.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleViewHistory(consultation)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
        
        {consultationHistory.length > 2 && (
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              Và {consultationHistory.length - 2} cuộc tư vấn khác
            </span>
          </div>
        )}
      </div>

      {/* Video Call Modal */}
      {isModalOpen && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold">{selectedConsultation.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {isMuted ? <FiVolumeX className="h-5 w-5" /> : <FiVolume2 className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiMaximize className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Video Area */}
            <div className="relative bg-gray-900 aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">{selectedConsultation.caregiver.avatar}</div>
                  <h4 className="text-xl font-semibold">{selectedConsultation.caregiver.name}</h4>
                  <p className="text-gray-300">{selectedConsultation.caregiver.specialty}</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  {isVideoPlaying ? <FiPause className="h-6 w-6" /> : <FiPlay className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Meeting Info */}
            <div className="p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Meeting ID</p>
                  <p className="font-mono text-lg">{selectedConsultation.meetingId}</p>
                </div>
                {selectedConsultation.meetingPassword && (
                  <div>
                    <p className="text-sm text-gray-600">Mật khẩu</p>
                    <p className="font-mono text-lg">{selectedConsultation.meetingPassword}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết lịch sử tư vấn */}
      {isHistoryModalOpen && selectedHistoryConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết cuộc tư vấn</h2>
              <button
                onClick={handleCloseHistoryModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 space-y-6">
              {/* Thông tin cuộc tư vấn */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedHistoryConsultation.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Người được tư vấn</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-2xl">{selectedHistoryConsultation.elderlyPerson.avatar}</span>
                      <span className="font-medium text-gray-900">{selectedHistoryConsultation.elderlyPerson.name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Chuyên gia tư vấn</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xl">{selectedHistoryConsultation.caregiver.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-900">{selectedHistoryConsultation.caregiver.name}</p>
                        <p className="text-sm text-gray-600">{selectedHistoryConsultation.caregiver.specialty}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin thời gian */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ngày hoàn thành</p>
                  <p className="font-medium text-gray-900">{formatDateTime(selectedHistoryConsultation.completedTime).date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời lượng</p>
                  <p className="font-medium text-gray-900">{selectedHistoryConsultation.duration} phút</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Đánh giá</p>
                  <div className="flex items-center">
                    {renderStars(selectedHistoryConsultation.rating)}
                    <span className="ml-2 font-medium text-gray-900">{selectedHistoryConsultation.rating}/5</span>
                  </div>
                </div>
              </div>

              {/* Nhận xét */}
              {selectedHistoryConsultation.review && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Nhận xét của bạn</p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700 italic">"{selectedHistoryConsultation.review}"</p>
                  </div>
                </div>
              )}

              {/* Recording */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Bản ghi cuộc tư vấn</p>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <FiVideo className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Bản ghi video đã được lưu trữ</p>
                  <p className="text-sm text-gray-500 mt-1">Thời lượng: {selectedHistoryConsultation.duration} phút</p>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseHistoryModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
                Xem lại video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultationPage;
