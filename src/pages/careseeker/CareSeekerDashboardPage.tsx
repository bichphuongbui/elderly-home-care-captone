import React, { useState } from 'react';
import { FiCalendar, FiUsers, FiClock, FiVideo, FiStar, FiAlertTriangle, FiX, FiMapPin, FiPhone, FiMail, FiAward, FiClock as FiTimeIcon } from 'react-icons/fi';

// Mock data types
interface Caregiver {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  phone: string;
  email: string;
  certifications: string[];
  languages: string[];
  hourlyRate: number;
  description: string;
  availability: string;
}

interface Alert {
  id: number;
  time: string;
  content: string;
  type: 'warning' | 'info' | 'success' | 'normal';
  reportedBy: {
    name: string;
    role: string;
    avatar: string;
  };
  elderlyPerson: {
    name: string;
    age: number;
    relationship: string;
    avatar: string;
  };
  details: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'acknowledged' | 'resolved';
}

interface Booking {
  id: number;
  caregiver: {
    name: string;
    avatar: string;
    specialty: string;
  };
  elderlyPerson: {
    name: string;
    age: number;
    relationship: string;
    avatar: string;
  };
  date: string;
  time: string;
  duration: string;
  status: 'completed' | 'active' | 'upcoming';
  type: string;
  notes?: string;
  rating?: number;
  review?: string;
  canReview?: boolean;
  completedDate?: string;
}


const CareSeekerDashboardPage: React.FC = () => {
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedBookingType, setSelectedBookingType] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingCaregiver, setSelectedBookingCaregiver] = useState<Caregiver | null>(null);
  const [selectedBookingFamilyMember, setSelectedBookingFamilyMember] = useState<any>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCaregiverForChat, setSelectedCaregiverForChat] = useState<any>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: number, sender: 'user' | 'caregiver', message: string, timestamp: string}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [readAlerts, setReadAlerts] = useState<Set<number>>(new Set());
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    duration: '4',
    type: '',
    notes: '',
    paymentMethod: 'cash'
  });

  // Lấy thông tin user từ localStorage
  const getCurrentUser = () => {
    if (typeof window === 'undefined') return null;
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

  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState("Người dùng");

  // Load user data after component mounts
  React.useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setUserName(user?.fullName || user?.name || user?.username || "Người dùng");
  }, []);

  // Mock statistics data
  const stats = [
    { label: 'Đã hoàn thành', value: '10', icon: FiCalendar, color: 'green', description: 'Lịch sử đặt lịch', type: 'completed' },
    { label: 'Đang diễn ra', value: '1', icon: FiClock, color: 'blue', description: 'Booking hiện tại', type: 'active' },
    { label: 'Sắp tới', value: '2', icon: FiVideo, color: 'orange', description: 'Booking sắp tới', type: 'upcoming' },
  ];

  // Mock bookings data - sắp xếp từ mới nhất đến cũ nhất
  const bookings: Booking[] = [
    // Completed bookings - chưa đánh giá (có thể đánh giá) - MỚI NHẤT
    {
      id: 6,
      caregiver: { name: 'Phạm Thu Hà', avatar: '👩‍⚕️', specialty: 'Chăm sóc sức khỏe' },
      elderlyPerson: { name: 'Nguyễn Văn Bố', age: 72, relationship: 'Bố', avatar: '👨‍🦳' },
      date: '22/01/2024',
      time: '09:00 - 13:00',
      duration: '4 giờ',
      status: 'completed',
      type: 'Chăm sóc sức khỏe',
      notes: 'Theo dõi huyết áp và đường huyết',
      canReview: true,
      completedDate: '22/01/2024'
    },
    {
      id: 7,
      caregiver: { name: 'Nguyễn Thị Lan', avatar: '👩‍⚕️', specialty: 'Dinh dưỡng' },
      elderlyPerson: { name: 'Trần Thị Mẹ', age: 68, relationship: 'Mẹ', avatar: '👩‍🦳' },
      date: '21/01/2024',
      time: '10:00 - 12:00',
      duration: '2 giờ',
      status: 'completed',
      type: 'Tư vấn dinh dưỡng',
      notes: 'Hướng dẫn chế độ ăn uống phù hợp',
      canReview: true,
      completedDate: '21/01/2024'
    },
    {
      id: 8,
      caregiver: { name: 'Võ Minh Tuấn', avatar: '👨‍⚕️', specialty: 'Vật lý trị liệu' },
      elderlyPerson: { name: 'Nguyễn Văn Bố', age: 72, relationship: 'Bố', avatar: '👨‍🦳' },
      date: '20/01/2024',
      time: '15:00 - 17:00',
      duration: '2 giờ',
      status: 'completed',
      type: 'Phục hồi chức năng',
      notes: 'Tập luyện phục hồi sau tai biến',
      canReview: true,
      completedDate: '20/01/2024'
    },
    // Completed bookings - đã đánh giá - CŨ HƠN
    {
      id: 1,
      caregiver: { name: 'Trần Thị Mai', avatar: '👩‍⚕️', specialty: 'Chăm sóc người cao tuổi' },
      elderlyPerson: { name: 'Nguyễn Văn Bố', age: 72, relationship: 'Bố', avatar: '👨‍🦳' },
      date: '15/01/2024',
      time: '08:00 - 12:00',
      duration: '4 giờ',
      status: 'completed',
      type: 'Chăm sóc tại nhà',
      notes: 'Bệnh nhân hợp tác tốt, uống thuốc đúng giờ',
      rating: 5,
      review: 'Rất hài lòng với dịch vụ chăm sóc',
      canReview: false,
      completedDate: '15/01/2024'
    },
    {
      id: 2,
      caregiver: { name: 'Lê Văn Hùng', avatar: '👨‍⚕️', specialty: 'Vật lý trị liệu' },
      elderlyPerson: { name: 'Trần Thị Mẹ', age: 68, relationship: 'Mẹ', avatar: '👩‍🦳' },
      date: '12/01/2024',
      time: '14:00 - 16:00',
      duration: '2 giờ',
      status: 'completed',
      type: 'Vật lý trị liệu',
      notes: 'Tập luyện nhẹ nhàng, cải thiện vận động',
      rating: 4,
      review: 'Chuyên nghiệp và tận tâm',
      canReview: false,
      completedDate: '12/01/2024'
    },
    {
      id: 9,
      caregiver: { name: 'Lê Thị Hoa', avatar: '👩‍⚕️', specialty: 'Chăm sóc người cao tuổi' },
      elderlyPerson: { name: 'Trần Thị Mẹ', age: 68, relationship: 'Mẹ', avatar: '👩‍🦳' },
      date: '10/01/2024',
      time: '08:00 - 12:00',
      duration: '4 giờ',
      status: 'completed',
      type: 'Chăm sóc tại nhà',
      notes: 'Chăm sóc toàn diện, theo dõi sức khỏe',
      rating: 5,
      review: 'Rất tận tâm và chuyên nghiệp',
      canReview: false,
      completedDate: '10/01/2024'
    },
    {
      id: 10,
      caregiver: { name: 'Phạm Văn Đức', avatar: '👨‍⚕️', specialty: 'Vật lý trị liệu' },
      elderlyPerson: { name: 'Nguyễn Văn Bố', age: 72, relationship: 'Bố', avatar: '👨‍🦳' },
      date: '08/01/2024',
      time: '14:00 - 16:00',
      duration: '2 giờ',
      status: 'completed',
      type: 'Phục hồi chức năng',
      notes: 'Tập luyện phục hồi sau phẫu thuật',
      rating: 4,
      review: 'Hướng dẫn rất chi tiết và dễ hiểu',
      canReview: false,
      completedDate: '08/01/2024'
    },
    // Active bookings
    {
      id: 3,
      caregiver: { name: 'Phạm Thu Hà', avatar: '👩‍⚕️', specialty: 'Chăm sóc sức khỏe' },
      elderlyPerson: { name: 'Nguyễn Văn Bố', age: 72, relationship: 'Bố', avatar: '👨‍🦳' },
      date: 'Hôm nay',
      time: '09:00 - 17:00',
      duration: '8 giờ',
      status: 'active',
      type: 'Chăm sóc toàn diện',
      notes: 'Đang theo dõi huyết áp và đường huyết'
    },
    // Upcoming bookings
    {
      id: 4,
      caregiver: { name: 'Trần Thị Mai', avatar: '👩‍⚕️', specialty: 'Chăm sóc người cao tuổi' },
      elderlyPerson: { name: 'Trần Thị Mẹ', age: 68, relationship: 'Mẹ', avatar: '👩‍🦳' },
      date: '25/01/2024',
      time: '10:00 - 14:00',
      duration: '4 giờ',
      status: 'upcoming',
      type: 'Khám sức khỏe định kỳ',
      notes: 'Chuẩn bị cho lịch khám bệnh'
    },
    {
      id: 5,
      caregiver: { name: 'Lê Văn Hùng', avatar: '👨‍⚕️', specialty: 'Vật lý trị liệu' },
      elderlyPerson: { name: 'Nguyễn Văn Bố', age: 72, relationship: 'Bố', avatar: '👨‍🦳' },
      date: '28/01/2024',
      time: '15:00 - 17:00',
      duration: '2 giờ',
      status: 'upcoming',
      type: 'Tập luyện phục hồi',
      notes: 'Tập luyện sau phẫu thuật'
    }
  ];

  // Mock caregivers data
  const caregivers: Caregiver[] = [
    {
      id: 1,
      name: 'Trần Thị Mai',
      avatar: '👩‍⚕️',
      specialty: 'Chăm sóc người cao tuổi',
      rating: 4.8,
      experience: '5 năm kinh nghiệm',
      location: 'Quận 1, TP.HCM',
      phone: '0901 234 567',
      email: 'tranthimai@example.com',
      certifications: ['Chứng chỉ Y tá', 'Chứng chỉ Chăm sóc người cao tuổi', 'CPR'],
      languages: ['Tiếng Việt', 'Tiếng Anh'],
      hourlyRate: 150000,
      description: 'Chuyên gia chăm sóc người cao tuổi với 5 năm kinh nghiệm. Tôi có khả năng chăm sóc toàn diện cho người già, bao gồm hỗ trợ sinh hoạt hàng ngày, quản lý thuốc men và theo dõi sức khỏe.',
      availability: 'Thứ 2 - Thứ 6: 8:00 - 17:00'
    },
    {
      id: 2,
      name: 'Lê Văn Hùng',
      avatar: '👨‍⚕️',
      specialty: 'Vật lý trị liệu',
      rating: 4.9,
      experience: '8 năm kinh nghiệm',
      location: 'Quận 3, TP.HCM',
      phone: '0902 345 678',
      email: 'levanhung@example.com',
      certifications: ['Bằng Vật lý trị liệu', 'Chứng chỉ Massage trị liệu', 'Chứng chỉ Phục hồi chức năng'],
      languages: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Pháp'],
      hourlyRate: 200000,
      description: 'Chuyên gia vật lý trị liệu với 8 năm kinh nghiệm. Tôi chuyên về phục hồi chức năng cho người cao tuổi, giúp cải thiện khả năng vận động và giảm đau nhức.',
      availability: 'Thứ 2 - Chủ nhật: 7:00 - 19:00'
    },
    {
      id: 3,
      name: 'Phạm Thu Hà',
      avatar: '👩‍⚕️',
      specialty: 'Dinh dưỡng & Chăm sóc',
      rating: 4.7,
      experience: '6 năm kinh nghiệm',
      location: 'Quận 7, TP.HCM',
      phone: '0903 456 789',
      email: 'phamthuha@example.com',
      certifications: ['Bằng Dinh dưỡng học', 'Chứng chỉ Chăm sóc bệnh nhân', 'Chứng chỉ An toàn thực phẩm'],
      languages: ['Tiếng Việt', 'Tiếng Anh'],
      hourlyRate: 180000,
      description: 'Chuyên gia dinh dưỡng và chăm sóc với 6 năm kinh nghiệm. Tôi chuyên về lập kế hoạch dinh dưỡng phù hợp cho người cao tuổi và hỗ trợ chăm sóc sức khỏe tổng thể.',
      availability: 'Thứ 2 - Thứ 6: 9:00 - 18:00'
    }
  ];

  // Mock family members data
  const familyMembers = [
    { id: 1, name: 'Nguyễn Văn Bố', age: 72, relationship: 'Bố', avatar: '👨‍🦳', conditions: ['Huyết áp cao', 'Tiểu đường'] },
    { id: 2, name: 'Trần Thị Mẹ', age: 68, relationship: 'Mẹ', avatar: '👩‍🦳', conditions: ['Viêm khớp', 'Loãng xương'] }
  ];

  // Mock caregiver suggestions for each family member
  const caregiverSuggestions = [
    {
      familyMember: familyMembers[0], // Bố
      suggestedCaregivers: [
        { caregiver: caregivers[0], reason: 'Chuyên về chăm sóc người cao tuổi, phù hợp với tình trạng huyết áp cao và tiểu đường', matchScore: 95 },
        { caregiver: caregivers[2], reason: 'Có kinh nghiệm theo dõi sức khỏe, đặc biệt là các bệnh mãn tính', matchScore: 88 }
      ]
    },
    {
      familyMember: familyMembers[1], // Mẹ
      suggestedCaregivers: [
        { caregiver: caregivers[1], reason: 'Chuyên về vật lý trị liệu, rất phù hợp với tình trạng viêm khớp và loãng xương', matchScore: 92 },
        { caregiver: caregivers[0], reason: 'Có kinh nghiệm chăm sóc người cao tuổi với các vấn đề về xương khớp', matchScore: 85 }
      ]
    }
  ];

  // Mock alerts data
  const alerts: Alert[] = [
    {
      id: 1,
      time: '14:32 hôm nay',
      content: 'Huyết áp cao bất thường - CẦN XỬ LÝ NGAY',
      type: 'warning',
      reportedBy: {
        name: 'Trần Thị Mai',
        role: 'Care Giver',
        avatar: '👩‍⚕️'
      },
      elderlyPerson: {
        name: 'Nguyễn Văn Bố',
        age: 72,
        relationship: 'Bố',
        avatar: '👨‍🦳'
      },
      details: 'Huyết áp đo được là 160/95 mmHg, cao hơn bình thường. Bệnh nhân có biểu hiện đau đầu nhẹ. Đã cho uống thuốc hạ huyết áp theo chỉ định và theo dõi thêm.',
      priority: 'high',
      status: 'new'
    },
    {
      id: 2,
      time: '09:15 hôm nay',
      content: 'Nhắc nhở uống thuốc buổi sáng',
      type: 'info',
      reportedBy: {
        name: 'Lê Văn Hùng',
        role: 'Care Giver',
        avatar: '👨‍⚕️'
      },
      elderlyPerson: {
        name: 'Trần Thị Mẹ',
        age: 68,
        relationship: 'Mẹ',
        avatar: '👩‍🦳'
      },
      details: 'Đã nhắc nhở và giám sát bệnh nhân uống đầy đủ thuốc buổi sáng: Calcium 1 viên, Vitamin D 1 viên. Bệnh nhân hợp tác tốt.',
      priority: 'medium',
      status: 'acknowledged'
    },
    {
      id: 3,
      time: '16:45 hôm qua',
      content: 'Lịch khám bệnh đã được xác nhận',
      type: 'success',
      reportedBy: {
        name: 'Trần Thị Mai',
        role: 'Care Giver',
        avatar: '👩‍⚕️'
      },
      elderlyPerson: {
        name: 'Nguyễn Văn Bố',
        age: 72,
        relationship: 'Bố',
        avatar: '👨‍🦳'
      },
      details: 'Đã xác nhận lịch khám bệnh định kỳ tại Bệnh viện Đa khoa TP.HCM vào ngày 25/01/2024 lúc 9:00. Bệnh nhân đã được chuẩn bị đầy đủ giấy tờ cần thiết.',
      priority: 'low',
      status: 'resolved'
    },
    {
      id: 4,
      time: '11:30 hôm nay',
      content: 'Tình trạng sức khỏe ổn định',
      type: 'normal',
      reportedBy: {
        name: 'Phạm Thu Hà',
        role: 'Care Giver',
        avatar: '👩‍⚕️'
      },
      elderlyPerson: {
        name: 'Trần Thị Mẹ',
        age: 68,
        relationship: 'Mẹ',
        avatar: '👩‍🦳'
      },
      details: 'Bệnh nhân có tinh thần tốt, ăn uống đầy đủ, vận động nhẹ nhàng. Các chỉ số sức khỏe trong giới hạn bình thường.',
      priority: 'low',
      status: 'resolved'
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
      warning: 'bg-red-50 text-red-600 border-red-200',      // Đỏ - Nghiêm trọng nhất
      info: 'bg-yellow-50 text-yellow-600 border-yellow-200', // Vàng - Cảnh báo
      success: 'bg-orange-50 text-orange-600 border-orange-200', // Cam - Thông báo
      normal: 'bg-green-50 text-green-600 border-green-200',   // Xanh - Bình thường
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

  // Hàm mở modal chi tiết caregiver
  const handleViewDetails = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCaregiver(null);
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Hàm mở modal chi tiết alert
  const handleViewAlertDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
  };

  // Hàm đóng modal alert
  const handleCloseAlertModal = () => {
    setIsAlertModalOpen(false);
    setSelectedAlert(null);
  };

  const handleViewBookings = (bookingType: string) => {
    setSelectedBookingType(bookingType);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedBookingType(null);
  };

  const handleBookCaregiver = (caregiver: Caregiver, familyMember: any) => {
    setSelectedBookingCaregiver(caregiver);
    setSelectedBookingFamilyMember(familyMember);
    setBookingForm({
      date: '',
      time: '',
      duration: '4',
      type: caregiver.specialty,
      notes: '',
      paymentMethod: 'cash'
    });
    setIsBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormOpen(false);
    setSelectedBookingCaregiver(null);
    setSelectedBookingFamilyMember(null);
    setBookingForm({
      date: '',
      time: '',
      duration: '4',
      type: '',
      notes: '',
      paymentMethod: 'cash'
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual booking submission
    const paymentMethodText = bookingForm.paymentMethod === 'cash' ? 'Tiền mặt (thanh toán khi hoàn thành)' : 'Chuyển khoản (thanh toán trước)';
    const totalAmount = selectedBookingCaregiver ? (selectedBookingCaregiver.hourlyRate * parseInt(bookingForm.duration)).toLocaleString('vi-VN') : '0';
    
    alert(`Đặt lịch thành công!\n\nCaregiver: ${selectedBookingCaregiver?.name}\nThành viên: ${selectedBookingFamilyMember?.name}\nNgày: ${bookingForm.date}\nGiờ: ${bookingForm.time}\nThời lượng: ${bookingForm.duration} giờ\nTổng tiền: ${totalAmount} VNĐ\nPhương thức: ${paymentMethodText}`);
    handleCloseBookingForm();
  };

  const handleOpenReview = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setReviewForm({
      rating: booking.rating || 5,
      review: booking.review || ''
    });
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedBookingForReview(null);
    setReviewForm({
      rating: 5,
      review: ''
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call with random success/failure
    const isSuccess = Math.random() > 0.2; // 80% success rate for demo
    
    if (isSuccess) {
      // Success case
      setShowSuccessPopup(true);
      handleCloseReviewModal();
      
      // Auto hide success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } else {
      // Error case - simulate server errors
      const errorMessages = [
        'Lỗi kết nối server. Vui lòng thử lại sau.',
        'Timeout. Server không phản hồi.',
        'Lỗi xác thực. Vui lòng đăng nhập lại.',
        'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
        'Server đang bảo trì. Vui lòng thử lại sau ít phút.'
      ];
      
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      setErrorMessage(randomError);
      setShowErrorPopup(true);
      
      // Auto hide error popup after 5 seconds
      setTimeout(() => {
        setShowErrorPopup(false);
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleOpenChat = (caregiver: any) => {
    setSelectedCaregiverForChat(caregiver);
    // Mock messages for demo
    setChatMessages([
      {
        id: 1,
        sender: 'caregiver',
        message: 'Chào anh/chị! Tôi đã đến nhà và bắt đầu chăm sóc bác.',
        timestamp: '09:00'
      },
      {
        id: 2,
        sender: 'user',
        message: 'Cảm ơn cô! Bác hôm nay thế nào ạ?',
        timestamp: '09:05'
      },
      {
        id: 3,
        sender: 'caregiver',
        message: 'Bác khỏe mạnh, đã uống thuốc đúng giờ. Huyết áp 120/80.',
        timestamp: '09:10'
      }
    ]);
    setIsChatModalOpen(true);
  };

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
    setSelectedCaregiverForChat(null);
    setChatMessages([]);
    setNewMessage('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'user' as const,
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
      
      // Simulate caregiver response after 2 seconds
      setTimeout(() => {
        const responses = [
          'Tôi hiểu rồi ạ. Sẽ chú ý điều đó.',
          'Vâng, tôi sẽ báo cáo lại tình hình.',
          'Cảm ơn anh/chị đã thông báo.',
          'Tôi sẽ ghi nhận và thực hiện ngay.',
          'Được rồi ạ, tôi sẽ cập nhật tình hình sau.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const caregiverMessage = {
          id: Date.now() + 1,
          sender: 'caregiver' as const,
          message: randomResponse,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, caregiverMessage]);
      }, 2000);
    }
  };

  const handleCallCaregiver = (caregiver: any) => {
    // Simulate call action
    alert(`Đang gọi ${caregiver.name}...\n\nSố điện thoại: 0901234567\n\n(Tính năng gọi video sẽ được tích hợp sau)`);
  };

  const handleMarkAlertAsRead = (alertId: number) => {
    setReadAlerts(prev => new Set([...prev, alertId]));
    setIsAlertModalOpen(false);
    setSelectedAlert(null);
  };

  // Hàm lấy màu priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy text priority
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy màu status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy text status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Mới';
      case 'acknowledged':
        return 'Đã xác nhận';
      case 'resolved':
        return 'Đã giải quyết';
      default:
        return 'Không xác định';
    }
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

      {/* Critical Alerts - Nổi bật ở đầu trang - chỉ hiện cảnh báo trong ngày hôm đó chưa đọc */}
      {alerts.filter(alert => alert.priority === 'high' && alert.time.includes('Hôm nay') && !readAlerts.has(alert.id)).length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">⚠️ Cảnh báo khẩn cấp</h3>
                <p className="text-sm text-red-700">Có {alerts.filter(alert => alert.priority === 'high' && alert.time.includes('Hôm nay') && !readAlerts.has(alert.id)).length} cảnh báo nghiêm trọng cần xử lý ngay</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAlert(alerts.filter(alert => alert.priority === 'high' && alert.time.includes('Hôm nay'))[0]);
                setIsAlertModalOpen(true);
              }}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Xem chi tiết
            </button>
          </div>
          
          <div className="space-y-3">
            {alerts
              .filter(alert => alert.priority === 'high' && alert.time.includes('Hôm nay') && !readAlerts.has(alert.id))
              .slice(0, 2)
              .map((alert) => (
                <div key={alert.id} className={`rounded-lg p-4 border hover:shadow-md transition-shadow ${
                  readAlerts.has(alert.id) 
                    ? 'bg-gray-50 border-gray-300' 
                    : 'bg-white border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{alert.elderlyPerson.avatar}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-semibold ${
                            readAlerts.has(alert.id) ? 'text-gray-500' : 'text-gray-900'
                          }`}>{alert.elderlyPerson.name}</h4>
                          {readAlerts.has(alert.id) && (
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-xs text-green-600 font-medium">Đã đọc</span>
                            </div>
                          )}
                        </div>
                        <p className={`text-sm ${
                          readAlerts.has(alert.id) ? 'text-gray-400' : 'text-gray-600'
                        }`}>{alert.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        readAlerts.has(alert.id) 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {readAlerts.has(alert.id) ? 'Đã xử lý' : 'Nghiêm trọng'}
                      </span>
                      <button
                        onClick={() => handleOpenChat(alert.reportedBy)}
                        className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
                        title="Nhắn tin với caregiver"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
            onClick={() => handleViewBookings(stat.type)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              <div>
                  <h3 className="text-sm font-semibold text-gray-900">{stat.label}</h3>
                  <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-blue-600 font-medium">Chi tiết →</p>
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
          <div className="space-y-6">
            {caregiverSuggestions.map((suggestion, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                {/* Thông tin thành viên gia đình */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">{suggestion.familyMember.avatar}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{suggestion.familyMember.name}</h3>
                    <p className="text-sm text-gray-600">{suggestion.familyMember.age} tuổi - {suggestion.familyMember.relationship}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {suggestion.familyMember.conditions.map((condition, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gợi ý caregiver */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Gợi ý phù hợp:</h4>
                  {suggestion.suggestedCaregivers.map((suggestionItem, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-2xl">{suggestionItem.caregiver.avatar}</div>
                <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-gray-900">{suggestionItem.caregiver.name}</h5>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-green-600">{suggestionItem.matchScore}% phù hợp</span>
                            <div className="flex items-center">
                              {renderStars(suggestionItem.caregiver.rating)}
                              <span className="ml-1 text-sm text-gray-600">{suggestionItem.caregiver.rating}</span>
                  </div>
                </div>
                        </div>
                        <p className="text-sm text-gray-600">{suggestionItem.caregiver.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">{suggestionItem.reason}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(suggestionItem.caregiver)}
                          className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
                        >
                  Xem chi tiết
                </button>
                        <button 
                          onClick={() => handleBookCaregiver(suggestionItem.caregiver, suggestion.familyMember)}
                          className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Đặt lịch ngay
                </button>
                      </div>
                    </div>
                  ))}
                </div>
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
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)} hover:shadow-md transition-shadow cursor-pointer`} onClick={() => handleViewAlertDetails(alert)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Thông tin người già (ưu tiên) */}
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{alert.elderlyPerson.avatar}</span>
                        <div>
                          <span className="text-lg font-semibold text-gray-900">{alert.elderlyPerson.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({alert.elderlyPerson.age} tuổi - {alert.elderlyPerson.relationship})</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Nội dung cảnh báo */}
                    <p className="font-medium text-gray-900 mb-2">{alert.content}</p>
                    
                    {/* Thông tin người báo (nhỏ) và thời gian */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Báo bởi:</span>
                        <span className="text-xs">{alert.reportedBy.avatar}</span>
                        <span className="text-xs font-medium text-gray-600">{alert.reportedBy.name}</span>
                        <span className="text-xs text-gray-500">({alert.reportedBy.role})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600">{alert.time}</p>
                        {/* Nút chat cho caregiver báo cáo */}
                        <button
                          onClick={() => handleOpenChat(alert.reportedBy)}
                          className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
                          title="Nhắn tin với caregiver"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Trạng thái */}
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                        {getPriorityText(alert.priority)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {getStatusText(alert.status)}
                      </span>
                    </div>
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


      {/* Modal chi tiết Caregiver */}
      {isModalOpen && selectedCaregiver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin chi tiết</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
                </div>

            {/* Content Modal */}
            <div className="p-6 space-y-6">
              {/* Thông tin cơ bản */}
              <div className="flex items-start space-x-4">
                <div className="text-6xl">{selectedCaregiver.avatar}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCaregiver.name}</h3>
                  <p className="text-lg text-blue-600 font-medium mb-2">{selectedCaregiver.specialty}</p>
                  <div className="flex items-center mb-2">
                    {renderStars(selectedCaregiver.rating)}
                    <span className="ml-2 text-lg font-medium text-gray-700">{selectedCaregiver.rating}</span>
                    <span className="ml-2 text-sm text-gray-500">({selectedCaregiver.experience})</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCaregiver.hourlyRate)}/giờ</p>
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{selectedCaregiver.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{selectedCaregiver.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{selectedCaregiver.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiTimeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{selectedCaregiver.availability}</span>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Giới thiệu</h4>
                <p className="text-gray-700 leading-relaxed">{selectedCaregiver.description}</p>
              </div>

              {/* Chứng chỉ */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FiAward className="h-5 w-5 mr-2 text-yellow-500" />
                  Chứng chỉ & Bằng cấp
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCaregiver.certifications.map((cert, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ngôn ngữ */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ngôn ngữ</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCaregiver.languages.map((lang, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết Alert */}
      {isAlertModalOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết cảnh báo</h2>
              <button
                onClick={handleCloseAlertModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 space-y-6">
              {/* Thông tin người báo và người già */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl mb-1">{selectedAlert.reportedBy.avatar}</div>
                    <h3 className="font-semibold text-gray-900">{selectedAlert.reportedBy.name}</h3>
                    <p className="text-sm text-gray-600">{selectedAlert.reportedBy.role}</p>
                  </div>
                  <div className="text-2xl text-gray-400">→</div>
                  <div className="text-center">
                    <div className="text-3xl mb-1">{selectedAlert.elderlyPerson.avatar}</div>
                    <h3 className="font-semibold text-gray-900">{selectedAlert.elderlyPerson.name}</h3>
                    <p className="text-sm text-gray-600">{selectedAlert.elderlyPerson.age} tuổi - {selectedAlert.elderlyPerson.relationship}</p>
                  </div>
                </div>
              </div>

              {/* Nội dung cảnh báo */}
              <div className={`p-4 rounded-lg border ${getAlertColor(selectedAlert.type)}`}>
                <h4 className="font-semibold text-gray-900 mb-2">Nội dung cảnh báo</h4>
                <p className="text-gray-700">{selectedAlert.content}</p>
              </div>

              {/* Chi tiết */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Chi tiết</h4>
                <p className="text-gray-700 leading-relaxed">{selectedAlert.details}</p>
              </div>

              {/* Thông tin bổ sung */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mức độ ưu tiên</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedAlert.priority)}`}>
                    {getPriorityText(selectedAlert.priority)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Trạng thái</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAlert.status)}`}>
                    {getStatusText(selectedAlert.status)}
                  </span>
                </div>
              </div>

              {/* Thời gian */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Thời gian báo cáo</h4>
                <p className="text-gray-700">{selectedAlert.time}</p>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseAlertModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              {selectedAlert.status === 'new' && !readAlerts.has(selectedAlert.id) && (
                <button 
                  onClick={() => handleMarkAlertAsRead(selectedAlert.id)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Xác nhận đã đọc</span>
                </button>
              )}
              {readAlerts.has(selectedAlert.id) && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Đã xác nhận đọc</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết Bookings */}
      {isBookingModalOpen && selectedBookingType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedBookingType === 'completed' && 'Lịch sử đặt lịch'}
                {selectedBookingType === 'active' && 'Booking đang diễn ra'}
                {selectedBookingType === 'upcoming' && 'Booking sắp tới'}
        </h2>
              <button
                onClick={handleCloseBookingModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
                </div>

            {/* Content Modal */}
            <div className="p-6">
              <div className="space-y-4">
                {bookings
                  .filter(booking => booking.status === selectedBookingType)
                  .map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                <div className="flex-1">
                          {/* Thông tin người già */}
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">{booking.elderlyPerson.avatar}</span>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{booking.elderlyPerson.name}</h3>
                              <p className="text-sm text-gray-600">{booking.elderlyPerson.age} tuổi - {booking.elderlyPerson.relationship}</p>
                </div>
              </div>

                          {/* Thông tin caregiver */}
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-xl">{booking.caregiver.avatar}</span>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{booking.caregiver.name}</h4>
                                {booking.canReview && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full animate-pulse">
                                    ⭐ Có thể đánh giá
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{booking.caregiver.specialty}</p>
                            </div>
                            {/* Nút chat tròn */}
                            <button
                              onClick={() => handleOpenChat(booking.caregiver)}
                              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                              title="Nhắn tin"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </button>
                          </div>

                          {/* Chi tiết booking */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-500">Ngày</p>
                              <p className="font-medium text-gray-900">{booking.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Thời gian</p>
                              <p className="font-medium text-gray-900">{booking.time}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Loại dịch vụ</p>
                              <p className="font-medium text-gray-900">{booking.type}</p>
                            </div>
                          </div>

                          {/* Ghi chú */}
                          {booking.notes && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-500">Ghi chú</p>
                              <p className="text-sm text-gray-700">{booking.notes}</p>
                            </div>
                          )}

                          {/* Đánh giá (chỉ cho completed) */}
                          {booking.status === 'completed' && booking.rating && (
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-500">Đánh giá:</p>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < booking.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm font-medium text-gray-700">{booking.rating}/5</span>
        </div>
      </div>
                          )}

                          {/* Review (chỉ cho completed) */}
                          {booking.status === 'completed' && booking.review && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">Nhận xét</p>
                              <p className="text-sm text-gray-700 italic">"{booking.review}"</p>
                            </div>
                          )}

                          {/* Nút đánh giá cho booking có thể đánh giá */}
                          {booking.status === 'completed' && booking.canReview && (
                            <div className="mt-3">
                              <button
                                onClick={() => handleOpenReview(booking)}
                                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                              >
                                ⭐ Đánh giá ngay
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Status badge */}
                        <div className="ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {booking.status === 'completed' ? 'Hoàn thành' :
                             booking.status === 'active' ? 'Đang diễn ra' :
                             'Sắp tới'}
                          </span>
                </div>
              </div>
            </div>
          ))}
              </div>

              {bookings.filter(booking => booking.status === selectedBookingType).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không có booking nào</p>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseBookingModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
        </div>
        </div>
      )}

      {/* Modal đặt lịch */}
      {isBookingFormOpen && selectedBookingCaregiver && selectedBookingFamilyMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Đặt lịch chăm sóc</h2>
              <button
                onClick={handleCloseBookingForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6">
              {/* Thông tin booking */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{selectedBookingCaregiver.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedBookingCaregiver.name}</h3>
                    <p className="text-sm text-gray-600">{selectedBookingCaregiver.specialty}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(selectedBookingCaregiver.rating)}
                      <span className="ml-2 text-sm text-gray-600">{selectedBookingCaregiver.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-4">
                  <div className="text-2xl">{selectedBookingFamilyMember.avatar}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedBookingFamilyMember.name}</h4>
                    <p className="text-sm text-gray-600">{selectedBookingFamilyMember.age} tuổi - {selectedBookingFamilyMember.relationship}</p>
                  </div>
                </div>
              </div>

              {/* Form đặt lịch */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày chăm sóc</label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ bắt đầu</label>
                    <input
                      type="time"
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng (giờ)</label>
                    <select
                      value={bookingForm.duration}
                      onChange={(e) => setBookingForm({...bookingForm, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="2">2 giờ</option>
                      <option value="4">4 giờ</option>
                      <option value="6">6 giờ</option>
                      <option value="8">8 giờ</option>
                      <option value="12">12 giờ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại dịch vụ</label>
                    <input
                      type="text"
                      value={bookingForm.type}
                      onChange={(e) => setBookingForm({...bookingForm, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ví dụ: Chăm sóc tại nhà, Vật lý trị liệu..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú thêm</label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Mô tả chi tiết về nhu cầu chăm sóc..."
                  />
                </div>

                {/* Phương thức thanh toán */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Phương thức thanh toán</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      bookingForm.paymentMethod === 'cash' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={bookingForm.paymentMethod === 'cash'}
                        onChange={(e) => setBookingForm({...bookingForm, paymentMethod: e.target.value})}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center">
                          {bookingForm.paymentMethod === 'cash' && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Tiền mặt</div>
                          <div className="text-sm text-gray-500">Thanh toán khi hoàn thành</div>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      bookingForm.paymentMethod === 'transfer' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={bookingForm.paymentMethod === 'transfer'}
                        onChange={(e) => setBookingForm({...bookingForm, paymentMethod: e.target.value})}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center">
                          {bookingForm.paymentMethod === 'transfer' && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Chuyển khoản</div>
                          <div className="text-sm text-gray-500">Thanh toán trước khi bắt đầu</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Thông tin giá */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giá dịch vụ:</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {selectedBookingCaregiver.hourlyRate.toLocaleString('vi-VN')} VNĐ/giờ
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Tổng cộng ({bookingForm.duration} giờ):</span>
                    <span className="text-xl font-bold text-blue-600">
                      {(selectedBookingCaregiver.hourlyRate * parseInt(bookingForm.duration)).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  {bookingForm.paymentMethod === 'transfer' && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm text-yellow-800 font-medium">Thanh toán chuyển khoản</span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        Số tài khoản: 1234567890 - Ngân hàng ABC
                      </p>
                      <p className="text-xs text-yellow-700">
                        Nội dung: Booking {selectedBookingFamilyMember?.name} - {bookingForm.date}
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseBookingForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleBookingSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Xác nhận đặt lịch
              </button>
            </div>
        </div>
        </div>
      )}

      {/* Modal đánh giá */}
      {isReviewModalOpen && selectedBookingForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Đánh giá dịch vụ</h2>
              <button
                onClick={handleCloseReviewModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6">
              {/* Thông tin booking */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{selectedBookingForReview.caregiver.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedBookingForReview.caregiver.name}</h3>
                    <p className="text-sm text-gray-600">{selectedBookingForReview.caregiver.specialty}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-4">
                  <div className="text-2xl">{selectedBookingForReview.elderlyPerson.avatar}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedBookingForReview.elderlyPerson.name}</h4>
                    <p className="text-sm text-gray-600">{selectedBookingForReview.elderlyPerson.age} tuổi - {selectedBookingForReview.elderlyPerson.relationship}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Ngày hoàn thành</p>
                    <p className="font-medium text-gray-900">{selectedBookingForReview.completedDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Thời lượng</p>
                    <p className="font-medium text-gray-900">{selectedBookingForReview.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Loại dịch vụ</p>
                    <p className="font-medium text-gray-900">{selectedBookingForReview.type}</p>
                  </div>
                </div>
              </div>

              {/* Form đánh giá */}
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Đánh giá sao</label>
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: i + 1})}
                        className="text-3xl transition-colors"
                      >
                        <FiStar
                          className={`${
                            i < reviewForm.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-lg font-medium text-gray-700">
                      {reviewForm.rating}/5 sao
                    </span>
                  </div>
                </div>

                {/* Review text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét chi tiết</label>
                  <textarea
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={4}
                    placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ chăm sóc..."
                  />
                </div>

                {/* Rating descriptions */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Gợi ý đánh giá:</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>⭐ Rất tệ - Không hài lòng</p>
                    <p>⭐⭐ Tệ - Cần cải thiện nhiều</p>
                    <p>⭐⭐⭐ Bình thường - Ổn</p>
                    <p>⭐⭐⭐⭐ Tốt - Hài lòng</p>
                    <p>⭐⭐⭐⭐⭐ Xuất sắc - Rất hài lòng</p>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseReviewModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Đánh giá thành công!</h4>
              <p className="text-sm opacity-90">Cảm ơn bạn đã đánh giá dịch vụ chăm sóc.</p>
            </div>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="flex-shrink-0 ml-2 text-white hover:text-green-200 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
              <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                </div>
                <div className="flex-1">
                <h4 className="font-semibold mb-1">Đánh giá thất bại!</h4>
                <p className="text-sm opacity-90 mb-3">{errorMessage}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowErrorPopup(false);
                      setErrorMessage('');
                      // Thử lại đánh giá
                      handleReviewSubmit(new Event('submit') as any);
                    }}
                    className="px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-medium rounded hover:bg-opacity-30 transition-colors"
                  >
                    Thử lại
                  </button>
                  <button
                    onClick={() => setShowErrorPopup(false)}
                    className="px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-medium rounded hover:bg-opacity-30 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowErrorPopup(false)}
                className="flex-shrink-0 text-white hover:text-red-200 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatModalOpen && selectedCaregiverForChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full h-[600px] flex flex-col">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{selectedCaregiverForChat.avatar}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedCaregiverForChat.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCaregiverForChat.specialty}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Nút gọi */}
                <button
                  onClick={() => handleCallCaregiver(selectedCaregiverForChat)}
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                  title="Gọi video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button
                  onClick={handleCloseChatModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
              </div>
            </div>
          ))}
        </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
      </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareSeekerDashboardPage;