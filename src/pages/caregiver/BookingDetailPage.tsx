import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

type BookingStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Chờ xác nhận',
  in_progress: 'Đang thực hiện',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
};

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  in_progress: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  cancelled: 'bg-gray-100 text-gray-600 ring-gray-500/20',
};

type TaskItem = string | { name: string; completed: boolean };

// Mock booking fetch by id (replace with API later)
const getMockBookingById = (id: string) => {
  const base = {
    duration: '4 giờ',
    description:
      'Yêu cầu hỗ trợ ăn uống, theo dõi uống thuốc đúng giờ và hỗ trợ đi lại trong nhà. Ưu tiên ứng xử nhẹ nhàng, kiên nhẫn.',
    tasks: [
      { name: 'Theo dõi huyết áp', completed: true },
      'Chuẩn bị bữa ăn sáng',
      { name: 'Trò chuyện 15 phút', completed: false },
    ] as TaskItem[],
    recipient: {
      fullName: 'Cụ Nguyễn Văn A',
      age: 82,
      gender: 'Nam',
      healthStatus: 'Bệnh mãn tính, cần hỗ trợ đặc biệt',
      medicalNotes: 'Tăng huyết áp, tiểu đường; dị ứng penicillin',
      specialNeeds: 'Chế độ ăn nhạt, hỗ trợ đi lại, đồng hành tinh thần',
    },
    service: {
      internalId: 'CASE-0001',
      serviceType: 'Chăm sóc tại nhà - theo giờ',
      time: '2025-09-20 08:00 – 2025-09-20 12:00 (ca cố định 8h–12h)',
      location: 'Q.1, TP.HCM',
      primaryContact: { name: 'Nguyễn Minh', phone: '0901 234 567', email: 'minh@example.com' },
      familyNotes: 'Không ăn mặn, hạn chế ra ngoài buổi tối',
    },
    scheduleReminders: [
      { time: '09:00', title: 'Uống thuốc huyết áp' },
      { time: '10:30', title: 'Vận động nhẹ 15 phút' },
      { time: '11:45', title: 'Chuẩn bị bữa trưa' },
    ],
    careLog: [] as { time: string; note: string }[],
    billing: {
      unitPrice: 120000,
      hours: 4,
      paymentMethod: 'Tiền mặt',
      paymentStatus: 'Chưa thanh toán',
    },
  };

  const byId: Record<string, {
    careseekerName: string; startTime: string; address: string; status: BookingStatus; reportSubmitted?: boolean; review?: { rated: boolean; rating?: number; comment?: string; date?: string };
  }> = {
    BK001: { careseekerName: 'Cụ Nguyễn Văn A', startTime: '2025-09-20 08:00', address: 'Q.1, TP.HCM', status: 'pending', reportSubmitted: false },
    BK002: { careseekerName: 'Bà Trần Thị B', startTime: '2025-09-19 14:00', address: 'Q.3, TP.HCM', status: 'in_progress', reportSubmitted: false },
    BK003: { careseekerName: 'Ông Lê Văn C', startTime: '2025-09-15 09:00', address: 'Q.5, TP.HCM', status: 'completed', reportSubmitted: true, review: { rated: true, rating: 5, comment: 'Caregiver rất tận tâm, đúng giờ và nhẹ nhàng.', date: '2025-09-15 13:00' } },
    BK004: { careseekerName: 'Cụ Phạm Văn D', startTime: '2025-09-18 13:00', address: 'Q.7, TP.HCM', status: 'cancelled', reportSubmitted: false },
    BK005: { careseekerName: 'Bà Nguyễn Thị E', startTime: '2025-09-21 07:30', address: 'Q.10, TP.HCM', status: 'pending', reportSubmitted: false },
    BK006: { careseekerName: 'Cụ Võ Văn F', startTime: '2025-09-16 08:00', address: 'Q.2, TP.HCM', status: 'completed', reportSubmitted: false, review: { rated: false } },
  };

  const v = byId[id] ?? { careseekerName: 'Careseeker', startTime: '2025-09-20 08:00', address: '—', status: 'pending' as BookingStatus };
  return { id, ...v, ...base } as { id: string } & typeof base & typeof v;
};

const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const booking = getMockBookingById(bookingId || 'BK');

  // Normalize tasks to object form
  const normalizedTasks = useMemo(() => {
    const list = (booking as any).tasks as TaskItem[] | undefined;
    if (!list || list.length === 0) return [] as { name: string; completed: boolean }[];
    return list.map((t) => (typeof t === 'string' ? { name: t, completed: false } : t));
  }, [booking]);

  const [tasks, setTasks] = useState<{ name: string; completed: boolean }[]>(normalizedTasks);

  const toggleTask = (index: number) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t))
    );
  };
  const canToggle = booking.status === 'in_progress';
  const completedCount = (booking.status === 'in_progress')
    ? tasks.filter((t) => t.completed).length
    : 0;
  const totalCount = tasks.length || 1;
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/care-giver/bookings" className="text-blue-600 hover:underline">← Quay lại danh sách</Link>

        <div className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết ca chăm sóc</h1>
              <div className="mt-1 text-sm text-gray-500">Mã đơn #{booking.id}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ring-1 ${STATUS_STYLE[booking.status]}`}>
                {STATUS_LABEL[booking.status]}
              </span>
              {booking.status === 'completed' && !booking.reportSubmitted && (
                <button
                  type="button"
                  onClick={() => navigate(`/care-giver/bookings/${booking.id}/report`)}
                  className="hidden sm:inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black"
                >
                  Gửi báo cáo nhanh
                </button>
              )}
              {booking.status === 'completed' && booking.reportSubmitted && (
                <button
                  type="button"
                  onClick={() => navigate(`/care-giver/bookings/${booking.id}/report?view=1`)}
                  className="hidden sm:inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                >
                  Xem báo cáo
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* 1. Thông tin người được chăm sóc */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Thông tin người được chăm sóc</h2>
              <div className="mt-3 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Họ tên</div>
                  <div className="mt-1 font-medium text-gray-900">{booking.recipient.fullName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Tuổi / Giới tính</div>
                  <div className="mt-1 font-medium text-gray-900">{booking.recipient.age} • {booking.recipient.gender}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-gray-500">Tình trạng sức khỏe chung</div>
                  <div className="mt-1 text-gray-900">{booking.recipient.healthStatus}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-gray-500">Bệnh sử / ghi chú y tế quan trọng</div>
                  <div className="mt-1 text-gray-900">{booking.recipient.medicalNotes}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-gray-500">Nhu cầu đặc biệt</div>
                  <div className="mt-1 text-gray-900">{booking.recipient.specialNeeds}</div>
                </div>
              </div>
            </div>

            {/* 2. Thông tin ca chăm sóc */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Thông tin ca chăm sóc</h2>
              <div className="mt-3 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Loại dịch vụ</div>
                  <div className="mt-1 font-medium text-gray-900">{booking.service.serviceType}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Thời gian</div>
                  <div className="mt-1 font-medium text-gray-900">{booking.service.time}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Địa điểm</div>
                  <div className="mt-1 font-medium text-gray-900">{booking.service.location}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-gray-500">Người liên hệ chính</div>
                  <div className="mt-1 text-gray-900">{booking.service.primaryContact.name} — {booking.service.primaryContact.phone} — {booking.service.primaryContact.email}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-gray-500">Ghi chú đặc biệt từ gia đình</div>
                  <div className="mt-1 text-gray-900">{booking.service.familyNotes}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Mô tả yêu cầu chăm sóc</div>
              <p className="mt-2 text-gray-700 leading-7">
                {booking.description}
              </p>
            </div>

            <div>
              <div className="text-xs text-gray-500">Danh sách nhiệm vụ</div>
              {!canToggle && tasks.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">(Chỉ xem khi chờ xác nhận. Có thể tick khi trạng thái là "Đang thực hiện".)</p>
              )}
              {tasks.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Hoàn thành: {completedCount}/{totalCount}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )}
              {tasks.length === 0 ? (
                <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                  Chưa có nhiệm vụ được giao.
                </div>
              ) : (
                <ul className="mt-3 space-y-2">
                  {tasks.map((task, idx) => (
                    <li key={idx}>
                      {canToggle ? (
                        <button
                          type="button"
                          onClick={() => toggleTask(idx)}
                          className={`w-full text-left rounded-lg border px-3 py-2 flex items-center justify-between ${
                            task.completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <span className={`inline-flex items-center gap-2 ${task.completed ? 'text-emerald-700' : 'text-gray-800'}`}>
                            {task.name}
                          </span>
                          <span className={`text-xs ${task.completed ? 'text-emerald-700' : 'text-gray-500'}`}>
                            {task.completed ? '✔' : ''}
                          </span>
                        </button>
                      ) : (
                        <div
                          className="w-full text-left rounded-lg border border-gray-200 px-3 py-2 flex items-center justify-between"
                        >
                          <span className="inline-flex items-center gap-2 text-gray-800">
                            {task.name}
                          </span>
                          <span className="text-xs text-gray-500">—</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Review from customer */}
            {booking.status === 'completed' && (
              <div>
                <h2 className="text-base font-semibold text-gray-900">Đánh giá từ khách hàng</h2>
                {booking.review && booking.review.rated ? (
                  <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < (booking.review?.rating || 0) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <p className="mt-2 text-gray-800">{booking.review?.comment}</p>
                    {booking.review?.date && (
                      <div className="mt-1 text-xs text-gray-500">{booking.review.date}</div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                    Chưa có đánh giá.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;


