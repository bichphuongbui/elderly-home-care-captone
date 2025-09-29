import React, { useEffect, useMemo, useState } from 'react';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
type TimeRange = { start: string; end: string };
type DailyAvailability = { enabled: boolean; ranges: TimeRange[] };
type WeeklyAvailability = Record<DayKey, DailyAvailability>;

const DAY_LABEL: Record<DayKey, string> = {
  mon: 'Thứ 2',
  tue: 'Thứ 3',
  wed: 'Thứ 4',
  thu: 'Thứ 5',
  fri: 'Thứ 6',
  sat: 'Thứ 7',
  sun: 'Chủ nhật',
};

const DEFAULT_RANGE: TimeRange = { start: '08:00', end: '17:00' };

// Helper functions for week navigation
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday-based
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatWeekLabel = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  const formatDate = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const buildDefault = (): WeeklyAvailability => ({
  mon: { enabled: true, ranges: [DEFAULT_RANGE] },
  tue: { enabled: true, ranges: [DEFAULT_RANGE] },
  wed: { enabled: true, ranges: [DEFAULT_RANGE] },
  thu: { enabled: true, ranges: [DEFAULT_RANGE] },
  fri: { enabled: true, ranges: [DEFAULT_RANGE] },
  sat: { enabled: true, ranges: [DEFAULT_RANGE] },
  sun: { enabled: true, ranges: [DEFAULT_RANGE] },
});

const STORAGE_KEY = 'caregiver_availability_v1';

const AvailabilityPage: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(() => getStartOfWeek(new Date()));
  const [availability, setAvailability] = useState<WeeklyAvailability>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Auto: rảnh nguyên tuần nếu chưa set
    return buildDefault();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(availability));
  }, [availability]);

  const weekLabel = useMemo(() => formatWeekLabel(currentWeek), [currentWeek]);

  const goToWeek = (direction: 'prev' | 'next' | 'current') => {
    if (direction === 'current') {
      setCurrentWeek(getStartOfWeek(new Date()));
    } else {
      const newWeek = new Date(currentWeek);
      newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeek(newWeek);
    }
  };

  const dayKeys = useMemo(() => Object.keys(DAY_LABEL) as DayKey[], []);

  const addRange = (day: DayKey) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], ranges: [...prev[day].ranges, { start: '09:00', end: '12:00' }] },
    }));
  };

  const removeRange = (day: DayKey, idx: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], ranges: prev[day].ranges.filter((_, i) => i !== idx) },
    }));
  };

  const updateRange = (day: DayKey, idx: number, key: keyof TimeRange, value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        ranges: prev[day].ranges.map((r, i) => (i === idx ? { ...r, [key]: value } : r)),
      },
    }));
  };

  const toggleDay = (day: DayKey) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const resetAll = () => setAvailability(buildDefault());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thiết lập lịch rảnh trong tuần</h1>
            <p className="mt-1 text-sm text-gray-600">Nếu bạn không thiết lập, hệ thống mặc định rảnh cả tuần (08:00–17:00).</p>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <button 
            onClick={() => goToWeek('prev')}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            ← Tuần trước
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900">{weekLabel}</span>
            <button 
              onClick={() => goToWeek('current')}
              className="px-3 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200"
            >
              Tuần này
            </button>
          </div>
          
          <button 
            onClick={() => goToWeek('next')}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            Tuần sau →
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {dayKeys.map((day) => (
            <div key={day} className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={availability[day].enabled}
                    onChange={() => toggleDay(day)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="font-medium text-gray-900">{DAY_LABEL[day]}</span>
                </div>
                <button
                  onClick={() => addRange(day)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Thêm khung giờ
                </button>
              </div>

              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {availability[day].ranges.map((r, idx) => (
                  <div key={idx} className={`flex items-center gap-2 ${!availability[day].enabled ? 'opacity-50' : ''}`}> 
                    <label className="text-xs text-gray-500">Từ</label>
                    <input
                      type="time"
                      value={r.start}
                      onChange={(e) => updateRange(day, idx, 'start', e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-sm"
                      disabled={!availability[day].enabled}
                    />
                    <label className="text-xs text-gray-500 ml-2">Đến</label>
                    <input
                      type="time"
                      value={r.end}
                      onChange={(e) => updateRange(day, idx, 'end', e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-sm"
                      disabled={!availability[day].enabled}
                    />
                    <button
                      onClick={() => removeRange(day, idx)}
                      className="ml-auto text-xs text-gray-500 hover:text-red-600"
                      disabled={!availability[day].enabled}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={resetAll} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Đặt lại mặc định</button>
          <button onClick={() => alert('Đã lưu')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;


