import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type VideoStatus = 'pending' | 'responded' | 'accepted' | 'rejected';

type VideoRequest = {
  id: string;
  customerName: string;
  bookingId: string; // e.g. BK001
  time: string; // ISO or readable
  note: string;
  status: VideoStatus;
  proposal?: { reason: string; date: string; start: string; end: string };
};

const STATUS_META: Record<VideoStatus, { label: string; color: string; bar: string }> = {
  pending: { label: 'Chờ phản hồi', color: 'bg-amber-50 text-amber-700 ring-amber-600/20', bar: 'bg-amber-400' },
  responded: { label: 'Đã phản hồi', color: 'bg-blue-50 text-blue-700 ring-blue-600/20', bar: 'bg-blue-500' },
  accepted: { label: 'Đã chấp nhận', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', bar: 'bg-emerald-500' },
  rejected: { label: 'Đã từ chối', color: 'bg-red-50 text-red-700 ring-red-600/20', bar: 'bg-red-500' },
};

const TABS: { key: VideoStatus; title: string }[] = [
  { key: 'pending', title: 'Chờ phản hồi' },
  { key: 'responded', title: 'Đã phản hồi' },
  { key: 'accepted', title: 'Đã chấp nhận' },
  { key: 'rejected', title: 'Đã từ chối' },
];

const mockRequests: VideoRequest[] = [
  { id: 'VR001', customerName: 'Nguyễn Minh', bookingId: 'BK005', time: '2025-09-21 07:30', note: 'Muốn trao đổi thêm nội dung chăm sóc', status: 'pending' },
  // Removed responded request for BK007 as per request
  { id: 'VR003', customerName: 'Lê Văn C', bookingId: 'BK006', time: '2025-09-16 08:00', note: 'Xác nhận trao đổi trước lịch', status: 'accepted' },
  { id: 'VR004', customerName: 'Phạm Thu D', bookingId: 'BK008', time: '2025-09-23 10:30', note: 'Không phù hợp thời gian hiện tại', status: 'rejected' },
];

const VideoRequestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VideoStatus>('pending');
  const [items, setItems] = useState<VideoRequest[]>(mockRequests);
  const navigate = useNavigate();
  const [showProposal, setShowProposal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end,   setEnd] = useState('');

  const filtered = useMemo(() => items.filter(i => i.status === activeTab), [items, activeTab]);

  const updateStatus = (id: string, status: VideoStatus) => {
    setItems(prev => prev.map(v => {
      if (v.id === id) {
        try { localStorage.setItem(`video_status_${v.bookingId}`, status); } catch {}
        return { ...v, status };
      }
      return v;
    }));
  };

  const openProposal = (id: string) => {
    setEditingId(id);
    setReason('');
    setDate('');
    setStart('');
    setEnd('');
    setShowProposal(true);
  };

  const saveProposal = () => {
    if (!editingId) return;
    setItems(prev => prev.map(v => (
      v.id === editingId
        ? { ...v, status: 'responded', proposal: { reason: reason.trim(), date, start, end } }
        : v
    )));
    setShowProposal(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý yêu cầu Video Call</h1>
          <p className="mt-1 text-sm text-gray-600">Theo dõi và xử lý các yêu cầu gọi video từ khách hàng</p>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto">
          {TABS.map(t => {
            const active = t.key === activeTab;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm ring-1 ${active ? 'bg-gray-900 text-white ring-gray-900' : 'bg-white text-gray-800 ring-gray-200 hover:bg-gray-50'}`}
              >
                {t.title}
                {active && <span className="absolute -bottom-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-gray-900" aria-hidden></span>}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden cursor-pointer"
              onClick={() => {
                try {
                  localStorage.setItem(`vr_note_${r.bookingId}`, r.note || '');
                  localStorage.setItem(`video_status_${r.bookingId}`, r.status);
                } catch {}
                navigate(`/care-giver/bookings/${r.bookingId}`);
              }}
            >
              <div className={`h-1 w-full ${STATUS_META[r.status].bar}`} aria-hidden></div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium">#{r.bookingId}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden></span>
                    <span>{r.time}</span>
                  </div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 truncate">{r.customerName}</div>
                  <div className="mt-2 text-sm text-gray-700 line-clamp-2">{r.note}</div>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ring-1 ${STATUS_META[r.status].color}`}>
                    {STATUS_META[r.status].label}
                  </span>
                  {r.status === 'accepted' && (
                    <div className="mt-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/care-giver/video-call'); }}
                        className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs text-white hover:bg-purple-700"
                      >
                        Vào phòng video
                      </button>
                    </div>
                  )}
                  {r.status === 'pending' && (
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(r.id, 'rejected'); }} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700">Từ chối</button>
                      <button onClick={(e) => { e.stopPropagation(); openProposal(r.id); }} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700">Đề nghị đổi lịch</button>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(r.id, 'accepted'); }} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-700">Chấp nhận</button>
                    </div>
                  )}
                  {r.status === 'responded' && r.proposal && (
                    <div className="mt-3 text-xs text-gray-700 text-left">
                      <div className="font-medium text-gray-900">Đề nghị đổi lịch:</div>
                      <div>Lý do: {r.proposal.reason || '—'}</div>
                      <div>Ngày: {r.proposal.date || '—'} • Thời gian: {r.proposal.start || '—'} – {r.proposal.end || '—'}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">Không có yêu cầu trong nhóm này.</div>
          )}
        </div>
      </div>
      {showProposal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-lg border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Đề nghị đổi lịch video</h3>
              <button onClick={() => setShowProposal(false)} className="text-gray-400 hover:text-gray-600">×</button>
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
              <button onClick={() => setShowProposal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">Hủy</button>
              <button onClick={saveProposal} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Gửi đề nghị</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRequestPage;


