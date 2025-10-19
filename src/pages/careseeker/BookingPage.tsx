import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiStar, FiSearch, FiFilter, FiPlus, FiX, FiEye } from 'react-icons/fi';
import { 
  getCaregivers, 
  createCareSeekerBooking, 
  getCareSeekerBookings,
  Caregiver, 
  CareSeekerBooking,
  formatDateTime,
  getStatusColor,
  getStatusText,
  getServiceTypeText,
  getServiceTypeIcon
} from '../../services/careseeker-booking.service';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings'>('book');
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [myBookings, setMyBookings] = useState<CareSeekerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  // Form states for booking
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    serviceType: 'home-care' as 'home-care' | 'video-call',
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 2,
    address: '',
    notes: '',
    elderlyPersonName: '',
    elderlyPersonAge: '',
    elderlyPersonRelationship: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [caregiversData, bookingsData] = await Promise.all([
        getCaregivers(),
        getCareSeekerBookings('current-user-id') // Replace with actual user ID
      ]);
      setCaregivers(caregiversData);
      setMyBookings(bookingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCaregivers = caregivers.filter(caregiver => {
    const matchesSearch = caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caregiver.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || caregiver.specialty === selectedSpecialty;
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'low' && caregiver.pricePerHour <= 200000) ||
      (priceRange === 'medium' && caregiver.pricePerHour > 200000 && caregiver.pricePerHour <= 300000) ||
      (priceRange === 'high' && caregiver.pricePerHour > 300000);
    
    return matchesSearch && matchesSpecialty && matchesPrice;
  });

  const specialties = Array.from(new Set(caregivers.map(cg => cg.specialty)));

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaregiver) return;

    try {
      const scheduledDateTime = `${bookingForm.scheduledDate}T${bookingForm.scheduledTime}:00`;
      const totalPrice = selectedCaregiver.pricePerHour * bookingForm.duration;

      await createCareSeekerBooking({
        careSeekerId: 'current-user-id', // Replace with actual user ID
        caregiverId: selectedCaregiver.id,
        serviceType: bookingForm.serviceType,
        title: bookingForm.title,
        description: bookingForm.description,
        scheduledDateTime,
        duration: bookingForm.duration * 60, // Convert to minutes
        address: bookingForm.serviceType === 'home-care' ? bookingForm.address : undefined,
        notes: bookingForm.notes,
        price: totalPrice,
        elderlyPersonName: bookingForm.elderlyPersonName,
        elderlyPersonAge: parseInt(bookingForm.elderlyPersonAge),
        elderlyPersonRelationship: bookingForm.elderlyPersonRelationship
      });

      alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      setShowBookingForm(false);
      setSelectedCaregiver(null);
      setBookingForm({
        serviceType: 'home-care',
        title: '',
        description: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: 2,
        address: '',
        notes: '',
        elderlyPersonName: '',
        elderlyPersonAge: '',
        elderlyPersonRelationship: ''
      });
      loadData(); // Reload bookings
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Đặt lịch chăm sóc</h1>
          <p className="mt-1 text-gray-600">Tìm và đặt lịch với các chuyên gia chăm sóc sức khỏe</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('book')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'book'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiCalendar className="inline mr-2" />
                Đặt lịch mới
              </button>
              <button
                onClick={() => setActiveTab('my-bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiClock className="inline mr-2" />
                Lịch của tôi ({myBookings.length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'book' ? (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tên chuyên gia hoặc chuyên môn..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên môn</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tất cả chuyên môn</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mức giá</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tất cả mức giá</option>
                    <option value="low">Dưới 200k/giờ</option>
                    <option value="medium">200k - 300k/giờ</option>
                    <option value="high">Trên 300k/giờ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Caregivers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCaregivers.map(caregiver => (
                <div key={caregiver.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                        {caregiver.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{caregiver.name}</h3>
                        <p className="text-sm text-gray-600">{caregiver.specialty}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(caregiver.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {caregiver.rating} ({caregiver.reviewCount} đánh giá)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiClock className="mr-2" />
                        {caregiver.experience}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMapPin className="mr-2" />
                        Có sẵn: {caregiver.availableTimes.join(', ')}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(caregiver.pricePerHour)}/giờ
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/care-seeker/caregiver/${caregiver.id}`)}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                            title="Xem profile"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCaregiver(caregiver);
                              setShowBookingForm(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Đặt lịch
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCaregivers.length === 0 && (
              <div className="text-center py-12">
                <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy chuyên gia</h3>
                <p className="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc để tìm thêm kết quả.</p>
              </div>
            )}
          </div>
        ) : (
          /* My Bookings Tab */
          <div className="space-y-4">
            {myBookings.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có lịch đặt nào</h3>
                <p className="mt-1 text-sm text-gray-500">Bắt đầu đặt lịch với các chuyên gia chăm sóc.</p>
                <button
                  onClick={() => setActiveTab('book')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đặt lịch ngay
                </button>
              </div>
            ) : (
              myBookings.map(booking => {
                const { date, time } = formatDateTime(booking.scheduledDateTime);
                return (
                  <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getServiceTypeIcon(booking.serviceType)}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                            <p className="text-sm text-gray-600">{getServiceTypeText(booking.serviceType)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <FiUser className="mr-2" />
                            <span>Chuyên gia: {booking.caregiverName || 'Đang cập nhật'}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FiCalendar className="mr-2" />
                            <span>Ngày: {date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FiClock className="mr-2" />
                            <span>Giờ: {time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <span>Thời lượng: {booking.duration / 60} giờ</span>
                          </div>
                          {booking.address && (
                            <div className="flex items-center text-gray-600 md:col-span-2">
                              <FiMapPin className="mr-2" />
                              <span>Địa chỉ: {booking.address}</span>
                            </div>
                          )}
                        </div>
                        
                        {booking.description && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">{booking.description}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                        <div className="mt-2 text-lg font-semibold text-gray-900">
                          {formatPrice(booking.price)}
                        </div>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => {
                              // Handle cancel booking
                              if (confirm('Bạn có chắc muốn hủy lịch này?')) {
                                // Implement cancel logic
                                console.log('Cancel booking:', booking.id);
                              }
                            }}
                            className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                          >
                            Hủy lịch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedCaregiver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Đặt lịch với {selectedCaregiver.name}</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-600">{selectedCaregiver.specialty} • {formatPrice(selectedCaregiver.pricePerHour)}/giờ</p>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại dịch vụ</label>
                    <select
                      value={bookingForm.serviceType}
                      onChange={(e) => setBookingForm({...bookingForm, serviceType: e.target.value as 'home-care' | 'video-call'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="home-care">Chăm sóc tại nhà</option>
                      <option value="video-call">Tư vấn video call</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                    <input
                      type="text"
                      value={bookingForm.title}
                      onChange={(e) => setBookingForm({...bookingForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ví dụ: Chăm sóc bà ngoại"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
                  <textarea
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm({...bookingForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả nhu cầu chăm sóc cụ thể..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
                    <input
                      type="date"
                      value={bookingForm.scheduledDate}
                      onChange={(e) => setBookingForm({...bookingForm, scheduledDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ</label>
                    <input
                      type="time"
                      value={bookingForm.scheduledTime}
                      onChange={(e) => setBookingForm({...bookingForm, scheduledTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng (giờ)</label>
                    <select
                      value={bookingForm.duration}
                      onChange={(e) => setBookingForm({...bookingForm, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={1}>1 giờ</option>
                      <option value={2}>2 giờ</option>
                      <option value={3}>3 giờ</option>
                      <option value={4}>4 giờ</option>
                      <option value={6}>6 giờ</option>
                      <option value={8}>8 giờ</option>
                    </select>
                  </div>
                </div>

                {bookingForm.serviceType === 'home-care' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      value={bookingForm.address}
                      onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Địa chỉ nhà..."
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên người được chăm sóc</label>
                    <input
                      type="text"
                      value={bookingForm.elderlyPersonName}
                      onChange={(e) => setBookingForm({...bookingForm, elderlyPersonName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tên đầy đủ"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tuổi</label>
                    <input
                      type="number"
                      value={bookingForm.elderlyPersonAge}
                      onChange={(e) => setBookingForm({...bookingForm, elderlyPersonAge: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tuổi"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mối quan hệ</label>
                    <select
                      value={bookingForm.elderlyPersonRelationship}
                      onChange={(e) => setBookingForm({...bookingForm, elderlyPersonRelationship: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn mối quan hệ</option>
                      <option value="parent">Bố/Mẹ</option>
                      <option value="grandparent">Ông/Bà</option>
                      <option value="spouse">Vợ/Chồng</option>
                      <option value="relative">Họ hàng</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú thêm</label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Thông tin bổ sung về tình trạng sức khỏe, yêu cầu đặc biệt..."
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tổng cộng:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatPrice(selectedCaregiver.pricePerHour * bookingForm.duration)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Đặt lịch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;