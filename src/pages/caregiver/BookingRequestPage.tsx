import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type BookingStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

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
};

const mockBookings: Booking[] = [
  { id: 'BK001', elderlyName: 'Cụ Nguyễn Văn A', address: 'Q.1, TP.HCM', startTime: '2025-09-20 08:00', hours: 4, price: 120000, status: 'pending', notes: 'Hỗ trợ ăn uống và đi lại' },
  { id: 'BK002', elderlyName: 'Bà Trần Thị B', address: 'Q.3, TP.HCM', startTime: '2025-09-19 14:00', hours: 3, price: 110000, status: 'in_progress', notes: 'Giám sát uống thuốc' },
  { id: 'BK003', elderlyName: 'Ông Lê Văn C', address: 'Q.5, TP.HCM', startTime: '2025-09-15 09:00', endTime: '2025-09-15 12:00', hours: 3, price: 100000, status: 'completed', notes: 'Vệ sinh cá nhân' },
  { id: 'BK004', elderlyName: 'Cụ Phạm Văn D', address: 'Q.7, TP.HCM', startTime: '2025-09-18 13:00', hours: 2, price: 120000, status: 'cancelled', notes: 'Khách huỷ do bận' },
  { id: 'BK005', elderlyName: 'Bà Nguyễn Thị E', address: 'Q.10, TP.HCM', startTime: '2025-09-21 07:30', hours: 5, price: 120000, status: 'pending' },
  { id: 'BK006', elderlyName: 'Cụ Võ Văn F', address: 'Q.2, TP.HCM', startTime: '2025-09-16 08:00', endTime: '2025-09-16 12:00', hours: 4, price: 120000, status: 'completed', notes: 'Theo dõi đường huyết' },
];

const STATUS_META: Record<BookingStatus, { label: string; color: string; dot: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 ring-amber-600/20', dot: 'bg-amber-500' },
  in_progress: { label: 'Đang thực hiện', color: 'bg-blue-50 text-blue-700 ring-blue-600/20', dot: 'bg-blue-500' },
  completed: { label: 'Đã hoàn thành', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-600 ring-gray-500/20', dot: 'bg-gray-400' },
};

const TABS: { key: BookingStatus; title: string }[] = [
  { key: 'pending', title: 'Chờ xác nhận' },
  { key: 'in_progress', title: 'Đang thực hiện' },
  { key: 'completed', title: 'Đã hoàn thành' },
  { key: 'cancelled', title: 'Đã hủy' },
];

const currency = (v: number) => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const BookingRow: React.FC<{ b: Booking }> = ({ b }) => {
  const navigate = useNavigate();
  const meta = STATUS_META[b.status];
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md overflow-hidden cursor-pointer" onClick={() => navigate(`/care-giver/bookings/${b.id}`)}>
      <div className={`h-1 w-full ${
        b.status === 'pending' ? 'bg-amber-400' :
        b.status === 'in_progress' ? 'bg-blue-500' :
        b.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-300'
      }`} aria-hidden></div>
      <div className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">#{b.id}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden></span>
            <span>{b.address}</span>
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-900 truncate">{b.elderlyName}</div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700">
            <span className="inline-flex items-center gap-1">🕒 <span>{b.startTime}</span></span>
            {b.endTime && <span className="inline-flex items-center gap-1">⏱ <span>{b.endTime}</span></span>}
            <span className="inline-flex items-center gap-1">📦 <span>{b.hours} giờ</span></span>
          </div>
          {b.notes && <div className="mt-2 text-sm text-gray-600 line-clamp-2">{b.notes}</div>}
        </div>
        <div className="shrink-0 text-right">
          <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ring-1 ${meta.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden></span>
            {meta.label}
          </span>
          <div className="mt-2 text-xs text-gray-500">Tổng tạm tính</div>
          <div className="text-lg font-semibold text-gray-900">{currency(b.hours * b.price)}</div>
          <div className="mt-3 flex items-center justify-end gap-2">
            {b.status === 'pending' && (
              <>
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Từ chối</button>
                <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">Chấp nhận</button>
              </>
            )}
            {b.status === 'in_progress' && (
              <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700">Hoàn thành</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingList: React.FC<{ data: Booking[] }> = ({ data }) => {
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
        <BookingRow key={b.id} b={b} />
      ))}
    </div>
  );
};

const BookingRequestPage: React.FC = () => {
  const [active, setActive] = useState<BookingStatus>('pending');

  const groups = useMemo(() => {
    return {
      pending: mockBookings.filter((b) => b.status === 'pending'),
      in_progress: mockBookings.filter((b) => b.status === 'in_progress'),
      completed: mockBookings.filter((b) => b.status === 'completed'),
      cancelled: mockBookings.filter((b) => b.status === 'cancelled'),
    } as Record<BookingStatus, Booking[]>;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý yêu cầu đặt lịch</h1>
            <p className="mt-1 text-sm text-gray-600">Theo dõi và xử lý các yêu cầu lịch chăm sóc theo trạng thái.</p>
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
          {active === 'pending' && <BookingList data={groups.pending} />}
          {active === 'in_progress' && <BookingList data={groups.in_progress} />}
          {active === 'completed' && <BookingList data={groups.completed} />}
          {active === 'cancelled' && <BookingList data={groups.cancelled} />}
        </div>
      </div>
    </div>
  );
};

export default BookingRequestPage;


