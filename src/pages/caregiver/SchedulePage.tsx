import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type BookingStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

type BookingItem = {
  id: string;
  careSeekerName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  location: string;
};

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday-based
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const HOURS = Array.from({ length: 15 }).map((_, i) => 7 + i); // 7..21
const DAYS = ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ nhật'];

const mockBookings: BookingItem[] = [
  { id: 'BK001', careSeekerName: 'Cụ Nguyễn Văn A', date: '2025-09-22', startTime: '09:00', endTime: '11:00', status: 'upcoming', location: 'Q.1, TP.HCM' },
  { id: 'BK002', careSeekerName: 'Bà Trần Thị B', date: '2025-09-23', startTime: '14:00', endTime: '17:00', status: 'ongoing', location: 'Q.3, TP.HCM' },
  { id: 'BK003', careSeekerName: 'Ông Lê Văn C', date: '2025-09-24', startTime: '08:00', endTime: '10:00', status: 'completed', location: 'Q.5, TP.HCM' },
  { id: 'BK006', careSeekerName: 'Cụ Võ Văn F', date: '2025-09-25', startTime: '13:00', endTime: '16:00', status: 'upcoming', location: 'Q.2, TP.HCM' },
];

const statusStyles: Record<BookingStatus, string> = {
  upcoming: 'bg-blue-50 text-blue-800 border-blue-200',
  ongoing: 'bg-amber-50 text-amber-800 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200 line-through',
};

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<Date>(getStartOfWeek(new Date()));

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(current);
      d.setDate(current.getDate() + i);
      return d;
    });
  }, [current]);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, BookingItem[]> = {};
    for (const b of mockBookings) {
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b);
    }
    return map;
  }, []);

  const goWeek = (diff: number) => {
    const next = new Date(current);
    next.setDate(current.getDate() + diff * 7);
    setCurrent(getStartOfWeek(next));
  };

  const weekLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    const fmt = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
    return `${fmt(start)} - ${fmt(end)}`;
  }, [weekDays]);

  const renderCell = (date: Date, hour: number) => {
    const key = formatYMD(date);
    const list = bookingsByDate[key] || [];
    const hh = pad(hour);
    const within = list.filter(b => b.startTime.startsWith(hh));

    if (within.length === 0) return null;

    return (
      <div className="space-y-2">
        {within.map(b => (
          <button
            key={b.id}
            onClick={() => navigate(`/care-giver/bookings/${b.id}`)}
            title={`${b.careSeekerName} • ${b.startTime}-${b.endTime} • ${b.location}`}
            className={`w-full text-left rounded-lg border px-2 py-1 text-xs ${statusStyles[b.status]} hover:opacity-90`}
          >
            <div className="font-semibold">{b.startTime} – {b.endTime}</div>
            <div>{b.careSeekerName}</div>
            <div className="truncate">{b.location}</div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lịch làm việc trong tuần</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => goWeek(-1)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">← Tuần trước</button>
            <div className="text-sm text-gray-700">{weekLabel}</div>
            <button onClick={() => goWeek(1)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">Tuần sau →</button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-16 sticky left-0 bg-gray-50 z-10 text-left text-xs font-semibold text-gray-600">Giờ</th>
                {weekDays.map((d, idx) => (
                  <th key={idx} className="px-2 py-2 text-xs font-semibold text-gray-600">
                    {DAYS[idx]}<div className="text-gray-500">{pad(d.getDate())}/{pad(d.getMonth() + 1)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map(h => (
                <tr key={h} className="align-top">
                  <td className="sticky left-0 bg-gray-50 z-10 px-2 py-2 text-xs text-gray-700">{pad(h)}:00</td>
                  {weekDays.map((d, idx) => (
                    <td key={idx} className="h-24 border border-gray-100 align-top p-2">
                      {renderCell(d, h)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;


