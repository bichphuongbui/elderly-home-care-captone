import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type BookingStatus = 'pending' | 'reschedule_pending' | 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'complaint';
type BookingType = 'instant' | 'scheduled';
type VideoStatus = 'pending' | 'accepted' | 'rejected';
type ComplaintTag = 'reviewing' | 'awaiting_more_info' | 'resolved' | 'refunded' | 'rejected';

type Booking = {
  id: string;
  elderlyName: string;
  address: string;
  startTime: string; // ISO or human
  endTime?: string;
  hours: number;
  price: number; // per hour or total demo
  status: BookingStatus;
  notes?: string;
  service?: string;
  type: BookingType;
  videoRequest?: boolean;
  videoStatus?: VideoStatus;
  rescheduleProposal?: { reason: string; date: string; start: string; end: string };
  complaintTag?: ComplaintTag;
};

const mockBookings: Booking[] = [
  { id: 'BK001', elderlyName: 'Cụ Nguyễn Văn A', address: 'Q.1, TP.HCM', startTime: '2025-09-20 08:00', hours: 4, price: 120000, status: 'pending', notes: 'Hỗ trợ ăn uống và đi lại', service: 'Chăm sóc theo giờ', type: 'instant' },
  { id: 'BK002', elderlyName: 'Bà Trần Thị B', address: 'Q.3, TP.HCM', startTime: '2025-09-19 14:00', hours: 3, price: 110000, status: 'in_progress', notes: 'Giám sát uống thuốc', service: 'Theo dõi thuốc', type: 'instant' },
  { id: 'BK003', elderlyName: 'Ông Lê Văn C', address: 'Q.5, TP.HCM', startTime: '2025-09-15 09:00', endTime: '2025-09-15 12:00', hours: 3, price: 100000, status: 'completed', notes: 'Vệ sinh cá nhân', service: 'Chăm sóc cá nhân', type: 'instant' },
  { id: 'BK004', elderlyName: 'Cụ Phạm Văn D', address: 'Q.7, TP.HCM', startTime: '2025-09-18 13:00', hours: 2, price: 120000, status: 'cancelled', notes: 'Khách huỷ do bận', service: 'Đi lại an toàn', type: 'instant' },
  { id: 'BK005', elderlyName: 'Bà Nguyễn Thị E', address: 'Q.10, TP.HCM', startTime: '2025-09-21 07:30', hours: 5, price: 120000, status: 'pending', service: 'Đi chợ nấu ăn', type: 'scheduled', videoRequest: true, videoStatus: 'pending' },
  { id: 'BK006', elderlyName: 'Cụ Võ Văn F', address: 'Q.2, TP.HCM', startTime: '2025-09-16 08:00', endTime: '2025-09-16 12:00', hours: 4, price: 120000, status: 'completed', notes: 'Theo dõi đường huyết', service: 'Theo dõi sức khỏe', type: 'scheduled', videoRequest: true, videoStatus: 'accepted' },
  { id: 'BK007', elderlyName: 'Cụ Hoàng Văn G', address: 'Q.4, TP.HCM', startTime: '2025-09-22 09:00', hours: 3, price: 120000, status: 'waiting', notes: 'Hỗ trợ tập thể dục', service: 'Vận động trị liệu', type: 'scheduled', videoRequest: true, videoStatus: 'accepted' },
  { id: 'BK008', elderlyName: 'Bà Lý Thị H', address: 'Q.6, TP.HCM', startTime: '2025-09-23 10:30', hours: 4, price: 110000, status: 'waiting', notes: 'Chăm sóc vết thương', service: 'Chăm sóc vết thương', type: 'scheduled', videoRequest: true, videoStatus: 'rejected' },
  // Đơn mẫu đã khiếu nại thành công (đang ở trạng thái khiếu nại với tag đã giải quyết)
  { id: 'BK009', elderlyName: 'Ông Phan Văn I', address: 'Q.8, TP.HCM', startTime: '2025-09-12 08:00', endTime: '2025-09-12 11:00', hours: 3, price: 120000, status: 'complaint', complaintTag: 'resolved', notes: 'Hoàn tất dịch vụ nhưng phát sinh tranh chấp', service: 'Chăm sóc theo giờ', type: 'instant' },
];

const STATUS_META: Record<BookingStatus, { label: string; color: string; dot: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 ring-amber-600/20', dot: 'bg-amber-500' },
  reschedule_pending: { label: 'Chờ đổi lịch', color: 'bg-blue-50 text-blue-700 ring-blue-600/20', dot: 'bg-blue-500' },
  waiting: { label: 'Chờ thực hiện', color: 'bg-orange-50 text-orange-700 ring-orange-600/20', dot: 'bg-orange-500' },
  in_progress: { label: 'Đang thực hiện', color: 'bg-blue-50 text-blue-700 ring-blue-600/20', dot: 'bg-blue-500' },
  completed: { label: 'Đã hoàn thành', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-600 ring-gray-500/20', dot: 'bg-gray-400' },
  complaint: { label: 'Khiếu nại', color: 'bg-rose-50 text-rose-700 ring-rose-600/20', dot: 'bg-rose-500' },
};

const VIDEO_STATUS_META: Record<VideoStatus, { label: string; color: string }> = {
  pending: { label: 'Chờ người chăm sóc xác nhận', color: 'bg-gray-100 text-gray-700 ring-gray-500/20' },
  accepted: { label: 'Người chăm sóc đã chấp nhận', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  rejected: { label: 'Người chăm sóc đã từ chối', color: 'bg-red-50 text-red-700 ring-red-600/20' },
};

const COMPLAINT_TAG_META: Record<ComplaintTag, { label: string; color: string }> = {
  reviewing: { label: 'Đang xem xét', color: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
  awaiting_more_info: { label: 'Chờ bổ sung', color: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  resolved: { label: 'Đã giải quyết', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  rejected: { label: 'Đã từ chối', color: 'bg-red-50 text-red-700 ring-red-600/20' },
};

const TABS: { key: BookingStatus; title: string }[] = [
  { key: 'pending', title: 'Chờ xác nhận' },
  { key: 'reschedule_pending', title: 'Chờ đổi lịch' },
  { key: 'waiting', title: 'Chờ thực hiện' },
  { key: 'in_progress', title: 'Đang thực hiện' },
  { key: 'completed', title: 'Đã hoàn thành' },
  { key: 'cancelled', title: 'Đã hủy' },
  { key: 'complaint', title: 'Khiếu nại' },
];

const currency = (v: number) => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const BookingRow: React.FC<{ b: Booking; onStatusChange: (id: string, newStatus: BookingStatus) => void; onOpenReschedule: (id: string) => void }> = ({ b, onStatusChange, onOpenReschedule }) => {
  const navigate = useNavigate();
  const meta = STATUS_META[b.status];
  const complaintTagKey = (b.status === 'complaint' ? (b.complaintTag || (localStorage.getItem(`complaint_tag_${b.id}`) as ComplaintTag | null) || undefined) : undefined);
  const serviceReviewed = !!localStorage.getItem(`service_review_${b.id}`);
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md overflow-hidden cursor-pointer" onClick={() => navigate(`/care-giver/bookings/${b.id}`)}>
      <div className={`h-1 w-full ${
        b.status === 'pending' ? 'bg-amber-400' :
        b.status === 'waiting' ? 'bg-orange-500' :
        b.status === 'in_progress' ? 'bg-blue-500' :
        b.status === 'completed' ? 'bg-emerald-500' :
        b.status === 'complaint' ? 'bg-rose-500' : 'bg-gray-300'
      }`} aria-hidden></div>
      <div className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">#{b.id}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden></span>
            <span>{b.address}</span>
            <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs ring-1 ${
              b.type === 'instant' ? 'bg-teal-50 text-teal-700 ring-teal-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'
            }`}>
              {b.type === 'instant' ? 'Đặt ngay' : 'Đặt trước'}
            </span>
            {b.type === 'scheduled' && b.videoRequest && (
              <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs ring-1 bg-purple-50 text-purple-700 ring-purple-600/20">Video Call</span>
            )}
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-900 truncate">{b.elderlyName}</div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700">
            <span className="inline-flex items-center gap-1">🕒 <span>{b.startTime}</span></span>
            {b.endTime && <span className="inline-flex items-center gap-1">⏱ <span>{b.endTime}</span></span>}
            <span className="inline-flex items-center gap-1">📦 <span>{b.hours} giờ</span></span>
            {b.service && <span className="inline-flex items-center gap-1">🧩 <span>{b.service}</span></span>}
          </div>
          {b.type === 'scheduled' && b.videoRequest && b.videoStatus && (
            <div className="mt-2">
              <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs ring-1 ${VIDEO_STATUS_META[b.videoStatus].color}`}>Yêu cầu video: {VIDEO_STATUS_META[b.videoStatus].label}</span>
            </div>
          )}
          {b.status === 'complaint' && complaintTagKey && (
            <div className="mt-2">
              <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs ring-1 ${COMPLAINT_TAG_META[complaintTagKey].color}`}>Khiếu nại: {COMPLAINT_TAG_META[complaintTagKey].label}</span>
            </div>
          )}
          {/* Hidden note per request */}
        </div>
        <div className="shrink-0 text-right">
          <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ring-1 ${meta.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden></span>
            {meta.label}
          </span>
          <div className="mt-2 text-xs text-gray-500">Tổng tạm tính</div>
          <div className="text-lg font-semibold text-gray-900">{currency(b.hours * b.price)}</div>
          <div className="mt-3 flex items-center justify-end gap-2">
            {b.status === 'completed' && (
              <>
                <button
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-700"
                  onClick={(e) => { e.stopPropagation(); window.location.href = `/care-giver/complaint?bookingId=${b.id}`; }}
                >
                  Khiếu nại
                </button>
                <button
                  className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-black"
                  onClick={(e) => { e.stopPropagation(); window.location.href = `/care-giver/service-review?bookingId=${b.id}`; }}
                >
                  {serviceReviewed ? 'Xem đánh giá' : 'Đánh giá'}
                </button>
              </>
            )}
            {b.status === 'pending' && (
              <>
                <button 
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(b.id, 'cancelled');
                  }}
                >
                  Từ chối
                </button>
                <button
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenReschedule(b.id);
                  }}
                >
                  Đề nghị đổi lịch
                </button>
                <button 
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(b.id, 'waiting');
                  }}
                >
                  Chấp nhận
                </button>
              </>
            )}
            {b.status === 'waiting' && (
              <>
                <button 
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(b.id, 'cancelled');
                  }}
                >
                  Hủy
                </button>
                <button 
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(b.id, 'in_progress');
                  }}
                >
                  Bắt đầu
                </button>
              </>
            )}
            {b.status === 'in_progress' && (
              <button 
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(b.id, 'completed');
                }}
              >
                Hoàn thành
              </button>
            )}
            {b.status === 'complaint' && complaintTagKey && (['resolved','refunded','rejected'].includes(complaintTagKey)) && (
              <button
                className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-black"
                onClick={(e) => { e.stopPropagation(); window.location.href = `/care-giver/complaint-review?bookingId=${b.id}`; }}
              >
                Đánh giá
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingList: React.FC<{ data: Booking[]; onStatusChange: (id: string, newStatus: BookingStatus) => void; onOpenReschedule: (id: string) => void }> = ({ data, onStatusChange, onOpenReschedule }) => {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
        Không có đơn nào trong trạng thái này.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {data.map((b) => (
        <BookingRow key={b.id} b={b} onStatusChange={onStatusChange} onOpenReschedule={onOpenReschedule} />
      ))}
    </div>
  );
};

const BookingRequestPage: React.FC = () => {
  const [active, setActive] = useState<BookingStatus>('pending');
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [typeFilter, setTypeFilter] = useState<BookingType | 'all'>('all');
  // reschedule modal state
  const [showReschedule, setShowReschedule] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  // Sync from global active booking (if started elsewhere)
  useEffect(() => {
    const activeId = localStorage.getItem('booking_active');
    if (!activeId) return;
    setBookings(prev => prev.map(b => b.id === activeId ? { ...b, status: 'in_progress' } : b));
  }, []);

  // Apply persisted complaint status/tags after complaint submission
  useEffect(() => {
    setBookings(prev => prev.map(b => {
      const persisted = localStorage.getItem(`booking_status_${b.id}`) as BookingStatus | null;
      const tag = localStorage.getItem(`complaint_tag_${b.id}`) as ComplaintTag | null;
      if (persisted === 'complaint') {
        return { ...b, status: 'complaint', complaintTag: tag || 'reviewing' };
      }
      return b;
    }));
  }, []);

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
    // Update shared flag so Dashboard reflects immediately
    if (newStatus === 'in_progress') {
      localStorage.setItem('booking_active', id);
    } else if (newStatus === 'completed' || newStatus === 'cancelled') {
      const cur = localStorage.getItem('booking_active');
      if (cur === id) localStorage.removeItem('booking_active');
    }
  };

  const openReschedule = (id: string) => {
    setEditingId(id);
    setReason('');
    setDate('');
    setStart('');
    setEnd('');
    setShowReschedule(true);
  };

  const submitReschedule = () => {
    if (!editingId) return;
    setBookings(prev => prev.map(b => b.id === editingId ? { ...b, status: 'reschedule_pending', rescheduleProposal: { reason: reason.trim(), date, start, end } } : b));
    setShowReschedule(false);
    setEditingId(null);
  };

  const groups = useMemo(() => {
    const byType = typeFilter === 'all' ? bookings : bookings.filter(b => b.type === typeFilter);
    return {
      pending: byType.filter((b) => b.status === 'pending'),
      reschedule_pending: byType.filter((b) => b.status === 'reschedule_pending'),
      waiting: byType.filter((b) => b.status === 'waiting'),
      in_progress: byType.filter((b) => b.status === 'in_progress'),
      completed: byType.filter((b) => b.status === 'completed'),
      cancelled: byType.filter((b) => b.status === 'cancelled'),
      complaint: byType.filter((b) => b.status === 'complaint'),
    } as Record<BookingStatus, Booking[]>;
  }, [bookings, typeFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý yêu cầu đặt lịch</h1>
            <p className="mt-1 text-sm text-gray-600">Theo dõi và xử lý các yêu cầu lịch chăm sóc theo trạng thái.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Loại:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-gray-800"
            >
              <option value="all">Tất cả</option>
              <option value="instant">Đặt lịch ngay</option>
              <option value="scheduled">Đặt lịch trước</option>
            </select>
          </div>
        </div>

        <div className="mt-6 sticky top-0 z-10 bg-gray-50/80 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60">
          <div className="flex gap-2 overflow-x-auto py-2">
            {TABS.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm ring-1 transition ${
                    isActive
                      ? 'bg-blue-600 text-white ring-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t.title}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-gray-700'}`}>
                    {groups[t.key].length}
                  </span>
                  {isActive && <span className="absolute -bottom-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-blue-600" aria-hidden></span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          {active === 'pending' && <BookingList data={groups.pending} onStatusChange={handleStatusChange} onOpenReschedule={openReschedule} />}
          {active === 'reschedule_pending' && <BookingList data={groups.reschedule_pending} onStatusChange={handleStatusChange} onOpenReschedule={openReschedule} />}
          {active === 'waiting' && <BookingList data={groups.waiting} onStatusChange={handleStatusChange} onOpenReschedule={openReschedule} />}
          {active === 'in_progress' && <BookingList data={groups.in_progress} onStatusChange={handleStatusChange} onOpenReschedule={openReschedule} />}
          {active === 'completed' && <BookingList data={groups.completed} onStatusChange={handleStatusChange} onOpenReschedule={openReschedule} />}
          {active === 'cancelled' && <BookingList data={groups.cancelled} onStatusChange={handleStatusChange} onOpenReschedule={openReschedule} />}
          {active === 'complaint' && <BookingList data={groups.complaint} onStatusChange={handleStatusChange} onOpenReschedule={openReschedule} />}
        </div>

        {showReschedule && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-lg border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Đề nghị đổi lịch</h3>
                <button onClick={() => setShowReschedule(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div className="px-5 py-5 space-y-4">
                <div>
                  <label className="text-xs text-gray-500">Lý do</label>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Ngày</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Từ</label>
                    <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Đến</label>
                    <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button onClick={() => setShowReschedule(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">Hủy</button>
                <button onClick={submitReschedule} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Gửi đề nghị</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingRequestPage;


