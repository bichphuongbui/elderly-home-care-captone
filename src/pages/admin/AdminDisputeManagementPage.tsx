import React, { useEffect, useMemo, useState } from "react";

type DisputeCategory = "Payment" | "Service Quality" | "Schedule" | "Behavior" | "Other";
type DisputeSeverity = "low" | "medium" | "high";
type DisputeStatus = "in_review" | "awaiting_info" | "resolved" | "refunded" | "rejected";
type UserRole = "Care Seeker" | "Caregiver";

type EvidenceType = "image" | "pdf" | "docx" | "video" | "other";

export type Dispute = {
  id: string;
  bookingId?: string;
  category: DisputeCategory;
  severity: DisputeSeverity;
  status: DisputeStatus;
  createdByRole: UserRole;
  createdByName: string;
  createdByEmail?: string;
  againstRole: UserRole extends "Care Seeker" ? "Caregiver" : "Care Seeker" | "Caregiver" | "Care Seeker";
  againstName?: string;
  summary: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes: Array<{ id: string; author: string; content: string; createdAt: string }>;
  evidence: Array<{ id: string; filename: string; type: EvidenceType; url?: string; uploadedBy: string; uploadedAt: string }>;
  timeline: Array<{ id: string; type: "created" | "status_change" | "note_added" | "evidence_added"; label: string; at: string; meta?: any }>;
};

const CATEGORY_LABEL: Record<DisputeCategory, string> = {
  Payment: "Thanh toán",
  "Service Quality": "Chất lượng dịch vụ",
  Schedule: "Lịch hẹn",
  Behavior: "Ứng xử",
  Other: "Khác",
};

const SEVERITY_LABEL: Record<DisputeSeverity, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

const STATUS_LABEL: Record<DisputeStatus, string> = {
  in_review: "Đang xem xét",
  awaiting_info: "Chờ bổ sung",
  resolved: "Đã giải quyết",
  refunded: "Đã hoàn tiền",
  rejected: "Từ chối",
};

const ALL_STATUSES: DisputeStatus[] = ["in_review", "awaiting_info", "resolved", "refunded", "rejected"];

const ADMIN_LIST = ["Admin A", "Admin B", "Admin C"];

function classNames(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

const SeverityBadge: React.FC<{ value: DisputeSeverity }> = ({ value }) => {
  const map = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  } as const;
  return <span className={classNames("inline-flex rounded-full px-2 py-1 text-xs font-medium", map[value])}>{SEVERITY_LABEL[value]}</span>;
};

const StatusBadge: React.FC<{ value: DisputeStatus }> = ({ value }) => {
  const map = {
    in_review: { className: "text-white", style: { backgroundColor: "#70C1F1" } },
    awaiting_info: { className: "bg-amber-100 text-amber-700", style: {} },
    resolved: { className: "bg-emerald-100 text-emerald-700", style: {} },
    refunded: { className: "bg-blue-100 text-blue-700", style: {} },
    rejected: { className: "bg-slate-100 text-slate-700", style: {} },
  } as const;
  const config = map[value];
  return <span className={classNames("inline-flex rounded-full px-2 py-1 text-xs font-medium", config.className)} style={config.style}>{STATUS_LABEL[value]}</span>;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function generateMockDisputes(): Dispute[] {
  const now = Date.now();
  const cats: DisputeCategory[] = ["Payment", "Service Quality", "Schedule", "Behavior", "Other"];
  const severities: DisputeSeverity[] = ["low", "medium", "high"];
  const statuses: DisputeStatus[] = ALL_STATUSES;
  const roles: UserRole[] = ["Care Seeker", "Caregiver"];
  return Array.from({ length: 10 }).map((_, i) => {
    const createdAt = new Date(now - (i + 1) * 86400000).toISOString();
    const updatedAt = new Date(now - i * 43200000).toISOString();
    const status = statuses[i % statuses.length];
    const severity = severities[(i + 1) % severities.length];
    const category = cats[i % cats.length];
    const createdByRole = roles[i % roles.length];
    const againstRole = createdByRole === "Care Seeker" ? "Caregiver" : "Care Seeker";
    const id = `D-${1000 + i}`;
    return {
      id,
      bookingId: i % 2 === 0 ? `BK-${2000 + i}` : undefined,
      category,
      severity,
      status,
      createdByRole,
      createdByName: createdByRole === "Care Seeker" ? `Người dùng ${i + 1}` : `Caregiver ${i + 1}`,
      createdByEmail: `user${i + 1}@example.com`,
      againstRole,
      againstName: againstRole === "Care Seeker" ? `Người dùng ${i + 2}` : `Caregiver ${i + 2}`,
      summary: `Vấn đề ${i + 1} liên quan ${CATEGORY_LABEL[category]}`,
      detail: `Mô tả chi tiết tranh chấp ${i + 1} về ${CATEGORY_LABEL[category]} với mức độ ${SEVERITY_LABEL[severity]}.`,
      createdAt,
      updatedAt,
      assignedTo: i % 3 === 0 ? ADMIN_LIST[i % ADMIN_LIST.length] : undefined,
      notes: [
        { id: `N-${i}-1`, author: "Admin A", content: "Đã tiếp nhận.", createdAt },
      ],
      evidence: [
        { id: `E-${i}-1`, filename: "screenshot.png", type: "image", url: "#", uploadedBy: "Admin A", uploadedAt: createdAt },
      ],
      timeline: [
        { id: `T-${i}-1`, type: "created", label: "Tạo tranh chấp", at: createdAt },
        { id: `T-${i}-2`, type: "status_change", label: `Trạng thái: Khởi tạo → ${STATUS_LABEL[status]}` , at: updatedAt, meta: { to: status } },
      ],
    };
  });
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow flex items-start gap-3">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
};

type DisputeDetailModalProps = {
  open: boolean;
  dispute?: Dispute | null;
  onClose: () => void;
  onChangeStatus: (id: string, status: DisputeStatus) => void;
  onAssign: (id: string, assignee?: string) => void;
  onChangeSeverity: (id: string, severity: DisputeSeverity) => void;
  onChangeCategory: (id: string, category: DisputeCategory) => void;
  onAddEvidence: (id: string, e: { filename: string; type: EvidenceType; url?: string }) => void;
  onDeleteEvidence: (id: string, evidenceId: string) => void;
  onAddNote: (id: string, note: string) => void;
};

const DisputeDetailModal: React.FC<DisputeDetailModalProps> = ({ open, dispute, onClose, onChangeStatus, onAssign, onChangeSeverity, onChangeCategory, onAddEvidence, onDeleteEvidence, onAddNote }) => {
  const [status, setStatus] = useState<DisputeStatus>("in_review");
  const [assignee, setAssignee] = useState<string | undefined>(undefined);
  const [severity, setSeverity] = useState<DisputeSeverity>("low");
  const [category, setCategory] = useState<DisputeCategory>("Other");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<EvidenceType>("image");
  const [fileUrl, setFileUrl] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (dispute) {
      setStatus(dispute.status);
      setAssignee(dispute.assignedTo);
      setSeverity(dispute.severity);
      setCategory(dispute.category);
    }
  }, [dispute]);

  if (!open || !dispute) return null;

  const handleSaveStatus = () => {
    if (status !== dispute.status) onChangeStatus(dispute.id, status);
  };
  const handleSaveAssign = () => onAssign(dispute.id, assignee);
  const handleSaveSeverity = () => {
    if (severity !== dispute.severity) onChangeSeverity(dispute.id, severity);
  };
  const handleSaveCategory = () => {
    if (category !== dispute.category) onChangeCategory(dispute.id, category);
  };

  const addEvidence = () => {
    if (!fileName.trim()) return;
    onAddEvidence(dispute.id, { filename: fileName.trim(), type: fileType, url: fileUrl.trim() || undefined });
    setFileName("");
    setFileType("image");
    setFileUrl("");
  };
  const addNote = () => {
    if (!note.trim()) return;
    onAddNote(dispute.id, note.trim());
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[90vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4" style={{ background: "linear-gradient(to right, #70C1F1, #5AB4E8)" }}>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white/20 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Chi tiết tranh chấp #{dispute.id}</h3>
              <p className="text-sm text-white/90">Quản lý và xử lý tranh chấp</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-white hover:bg-white/20 transition-colors" aria-label="Đóng">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3 overflow-y-auto flex-1 bg-gray-50">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" style={{ color: "#70C1F1" }}>
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-gray-900">Thông tin chung</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="rounded-lg p-2" style={{ backgroundColor: "rgba(112, 193, 241, 0.2)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" style={{ color: "#70C1F1" }}>
                      <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 uppercase">Booking ID</div>
                    <div className="mt-1 font-semibold text-gray-900">{dispute.bookingId ?? "—"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-purple-600">
                      <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 uppercase">Nhóm tranh chấp</div>
                    <div className="mt-1 font-semibold text-gray-900">{CATEGORY_LABEL[category]}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="rounded-lg bg-amber-100 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-amber-600">
                      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 uppercase">Mức độ</div>
                    <div className="mt-1"><SeverityBadge value={severity} /></div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-blue-600">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 uppercase">Người tạo</div>
                    <div className="mt-1 font-semibold text-gray-900">{dispute.createdByName}</div>
                    <div className="text-xs text-gray-500">{dispute.createdByRole}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="rounded-lg bg-rose-100 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-rose-600">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 uppercase">Đối tượng tranh chấp</div>
                    <div className="mt-1 font-semibold text-gray-900">{dispute.againstName ?? "—"}</div>
                    <div className="text-xs text-gray-500">{dispute.againstRole}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="rounded-lg bg-emerald-100 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-emerald-600">
                      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 uppercase">Admin phụ trách</div>
                    <div className="mt-1 font-semibold text-gray-900">{dispute.assignedTo ?? "Chưa gán"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" style={{ color: "#70C1F1" }}>
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-gray-900">Nội dung tranh chấp</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Tóm tắt</div>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg p-3">{dispute.summary}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Chi tiết</div>
                  <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">{dispute.detail}</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" style={{ color: "#70C1F1" }}>
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-gray-900">Lịch sử xử lý</h4>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5" style={{ background: "linear-gradient(to bottom, rgba(112, 193, 241, 0.4), transparent)" }}></div>
                <div className="space-y-4">
                  {dispute.timeline.slice().reverse().map((t, idx) => (
                    <div key={t.id} className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-sm`} style={{ backgroundColor: idx === 0 ? "#70C1F1" : "#d1d5db" }}>
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-sm font-medium text-gray-900">{t.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{formatDate(t.at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" style={{ color: "#70C1F1" }}>
                  <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-gray-900">Cập nhật thông tin</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Trạng thái</label>
                  <div className="flex items-center gap-2">
                    <select value={status} onChange={(e) => setStatus(e.target.value as DisputeStatus)} className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:outline-none transition-colors" style={{ borderColor: "#70C1F1" }}>
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                    <button onClick={handleSaveStatus} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm" style={{ backgroundColor: "#70C1F1" }}>
                      Lưu
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Admin phụ trách</label>
                  <div className="flex items-center gap-2">
                    <select value={assignee ?? ""} onChange={(e) => setAssignee(e.target.value || undefined)} className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:outline-none transition-colors" style={{ borderColor: "#70C1F1" }}>
                      <option value="">Chưa gán</option>
                      {ADMIN_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <button onClick={handleSaveAssign} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm">
                      Gán
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Nhóm tranh chấp</label>
                  <div className="flex items-center gap-2">
                    <select value={category} onChange={(e) => setCategory(e.target.value as DisputeCategory)} className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:outline-none transition-colors" style={{ borderColor: "#70C1F1" }}>
                      {(["Payment","Service Quality","Schedule","Behavior","Other"] as DisputeCategory[]).map(c => (
                        <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                      ))}
                    </select>
                    <button onClick={handleSaveCategory} className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors shadow-sm">
                      Lưu
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Mức độ nghiêm trọng</label>
                  <div className="flex items-center gap-2">
                    <select value={severity} onChange={(e) => setSeverity(e.target.value as DisputeSeverity)} className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:outline-none transition-colors" style={{ borderColor: "#70C1F1" }}>
                      {(["low","medium","high"] as DisputeSeverity[]).map(s => (
                        <option key={s} value={s}>{SEVERITY_LABEL[s]}</option>
                      ))}
                    </select>
                    <button onClick={handleSaveSeverity} className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors shadow-sm">
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" style={{ color: "#70C1F1" }}>
                  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-gray-900">Minh chứng</h4>
                <span className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: "#70C1F1" }}>
                  {dispute.evidence.length}
                </span>
              </div>
              {dispute.evidence.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {dispute.evidence.map(ev => (
                    <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg border-2 transition-colors bg-gray-50" style={{ borderColor: "rgba(112, 193, 241, 0.3)" }}>
                      {ev.type === 'image' && ev.url && (
                        <img 
                          src={ev.url} 
                          alt={ev.filename}
                          className="h-16 w-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                          onClick={() => window.open(ev.url, '_blank')}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">{ev.filename}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {ev.uploadedBy} • {formatDate(ev.uploadedAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a 
                          href={ev.url || "#"} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                          style={{ backgroundColor: "#70C1F1" }}
                        >
                          Xem
                        </a>
                        <button 
                          onClick={() => onDeleteEvidence(dispute.id, ev.id)} 
                          className="rounded-lg border-2 border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-12 w-12 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Chưa có minh chứng nào</p>
                </div>
              )}
              <div className="space-y-3">
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-colors bg-gradient-to-br from-gray-50 to-white">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="evidence-upload"
                    accept="image/*,.pdf,.doc,.docx,.mp4,.avi"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFileName(file.name);
                        setFileType(file.type.startsWith('image/') ? 'image' : 
                                   file.type === 'application/pdf' ? 'pdf' :
                                   file.type.includes('document') ? 'docx' :
                                   file.type.startsWith('video/') ? 'video' : 'other');
                        const url = URL.createObjectURL(file);
                        setFileUrl(url);
                      }
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-10 w-10 text-gray-400 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <label 
                    htmlFor="evidence-upload" 
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white cursor-pointer shadow-sm transition-colors"
                    style={{ backgroundColor: "#70C1F1" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Chọn file minh chứng
                  </label>
                  <p className="mt-2 text-xs text-gray-500">Hỗ trợ: Ảnh, PDF, Word, Video</p>
                </div>
                {fileName && (
                  <div className="flex items-center gap-3 p-4 rounded-xl border-2" style={{ backgroundColor: "rgba(112, 193, 241, 0.1)", borderColor: "#70C1F1" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" style={{ color: "#70C1F1" }}>
                      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                      <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                    <span className="flex-1 text-sm font-medium truncate" style={{ color: "#70C1F1" }}>{fileName}</span>
                    <button 
                      onClick={addEvidence} 
                      className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors shadow-sm"
                      style={{ backgroundColor: "#70C1F1" }}
                    >
                      Upload
                    </button>
                    <button 
                      onClick={() => {
                        setFileName("");
                        setFileUrl("");
                        setFileType("image");
                      }} 
                      className="rounded-lg bg-gray-500 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-600 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" style={{ color: "#70C1F1" }}>
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                </svg>
                <h4 className="font-semibold text-gray-900">Ghi chú nội bộ</h4>
                <span className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: "#70C1F1" }}>
                  {dispute.notes.length}
                </span>
              </div>
              {dispute.notes.length > 0 ? (
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {dispute.notes.map(n => (
                    <div key={n.id} className="rounded-lg border-2 border-gray-100 p-3 bg-gradient-to-br from-gray-50 to-white transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(112, 193, 241, 0.2)" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" style={{ color: "#70C1F1" }}>
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{n.author}</div>
                          <div className="text-xs text-gray-500">{formatDate(n.createdAt)}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed pl-9">{n.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-10 w-10 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Chưa có ghi chú nào</p>
                </div>
              )}
              <div className="space-y-3">
                <textarea 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  placeholder="Nhập ghi chú nội bộ..." 
                  className="w-full resize-none rounded-lg border-2 border-gray-200 p-3 text-sm focus:outline-none transition-colors min-h-[100px]"
                  style={{ borderColor: "#70C1F1" }}
                />
                <button 
                  onClick={addNote} 
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#70C1F1" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
                    <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" />
                  </svg>
                  Thêm ghi chú
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4 bg-white">
          <div className="flex items-center gap-3">
            <StatusBadge value={dispute.status} />
            <div className="text-sm text-gray-500">
              Cập nhật lần cuối: <span className="font-medium text-gray-700">{formatDate(dispute.updatedAt)}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg border-2 border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

type SortKey = "updatedAt" | "severity";

const DisputeRow: React.FC<{
  d: Dispute;
  onView: (d: Dispute) => void;
}> = ({ d, onView }) => {
  return (
    <tr 
      className="border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onView(d)}
    >
      <td className="px-4 py-3 text-sm text-gray-700">{d.id}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{d.bookingId ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{CATEGORY_LABEL[d.category]}</td>
      <td className="px-4 py-3"><SeverityBadge value={d.severity} /></td>
      <td className="px-4 py-3"><StatusBadge value={d.status} /></td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="font-medium">{d.createdByName}</div>
        <div className="text-gray-500">{d.createdByRole}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="text-gray-700">{d.assignedTo ?? "Chưa gán"}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(d.updatedAt)}</td>
    </tr>
  );
};

const PAGE_SIZE = 10;

const AdminDisputeManagementPage: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(() => generateMockDisputes());

  // filters
  const [category, setCategory] = useState<"All" | DisputeCategory>("All");
  const [status, setStatus] = useState<"All" | DisputeStatus>("All");
  const [severity, setSeverity] = useState<"All" | DisputeSeverity>("All");
  const [creator, setCreator] = useState<"All" | UserRole>("All");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  // sorting & pagination
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const stats = useMemo(() => {
    const counters = { in_review: 0, resolved: 0, refunded: 0 } as Record<string, number>;
    for (const d of disputes) {
      if (d.status === "in_review") counters.in_review++;
      if (d.status === "resolved") counters.resolved++;
      if (d.status === "refunded") counters.refunded++;
    }
    return counters;
  }, [disputes]);

  const filtered = useMemo(() => {
    const items = disputes.filter(d => {
      if (category !== "All" && d.category !== category) return false;
      if (status !== "All" && d.status !== status) return false;
      if (severity !== "All" && d.severity !== severity) return false;
      if (creator !== "All" && d.createdByRole !== creator) return false;
      if (debounced) {
        const hay = `${d.id} ${d.bookingId ?? ""} ${d.createdByName} ${d.createdByEmail ?? ""} ${d.summary}`.toLowerCase();
        if (!hay.includes(debounced)) return false;
      }
      return true;
    });
    const sorted = items.sort((a, b) => {
      if (sortKey === "updatedAt") {
        const da = new Date(a.updatedAt).getTime();
        const db = new Date(b.updatedAt).getTime();
        return sortAsc ? da - db : db - da;
      }
      const sevOrder: Record<DisputeSeverity, number> = { low: 0, medium: 1, high: 2 };
      return sortAsc ? sevOrder[a.severity] - sevOrder[b.severity] : sevOrder[b.severity] - sevOrder[a.severity];
    });
    return sorted;
  }, [disputes, category, status, severity, creator, debounced, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => { setPage(1); }, [category, status, severity, creator, debounced, sortKey, sortAsc]);

  const openDetail = (d: Dispute) => setModal({ open: true, dispute: d });

  const changeStatus = (id: string, s: DisputeStatus) => {
    setDisputes(prev => prev.map(d => d.id === id ? {
      ...d,
      status: s,
      updatedAt: new Date().toISOString(),
      timeline: [...d.timeline, { id: `T-${id}-${Date.now()}`, type: "status_change", label: `Trạng thái: ${STATUS_LABEL[d.status]} → ${STATUS_LABEL[s]}`, at: new Date().toISOString(), meta: { from: d.status, to: s } }],
    } : d));
  };

  const assignTo = (id: string, a?: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, assignedTo: a, updatedAt: new Date().toISOString() } : d));
  };

  const addEvidence = (id: string, e: { filename: string; type: EvidenceType; url?: string }) => {
    setDisputes(prev => prev.map(d => d.id === id ? {
      ...d,
      evidence: [...d.evidence, { id: `E-${Date.now()}`, filename: e.filename, type: e.type, url: e.url, uploadedBy: "Admin", uploadedAt: new Date().toISOString() }],
      timeline: [...d.timeline, { id: `T-${Date.now()}`, type: "evidence_added", label: `Thêm minh chứng: ${e.filename}`, at: new Date().toISOString() }],
      updatedAt: new Date().toISOString(),
    } : d));
  };

  const deleteEvidence = (id: string, evidenceId: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? {
      ...d,
      evidence: d.evidence.filter(ev => ev.id !== evidenceId),
      updatedAt: new Date().toISOString(),
    } : d));
  };

  const addNote = (id: string, content: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? {
      ...d,
      notes: [...d.notes, { id: `N-${Date.now()}`, author: "Admin", content, createdAt: new Date().toISOString() }],
      timeline: [...d.timeline, { id: `T-${Date.now()}`, type: "note_added", label: `Thêm ghi chú`, at: new Date().toISOString() }],
      updatedAt: new Date().toISOString(),
    } : d));
  };

  const changeSeverity = (id: string, severity: DisputeSeverity) => {
    setDisputes(prev => prev.map(d => d.id === id ? {
      ...d,
      severity,
      updatedAt: new Date().toISOString(),
      timeline: [...d.timeline, { id: `T-${Date.now()}`, type: "status_change", label: `Mức độ: ${SEVERITY_LABEL[d.severity]} → ${SEVERITY_LABEL[severity]}`, at: new Date().toISOString(), meta: { from: d.severity, to: severity } }],
    } : d));
  };

  const changeCategory = (id: string, category: DisputeCategory) => {
    setDisputes(prev => prev.map(d => d.id === id ? {
      ...d,
      category,
      updatedAt: new Date().toISOString(),
      timeline: [...d.timeline, { id: `T-${Date.now()}`, type: "status_change", label: `Nhóm: ${CATEGORY_LABEL[d.category]} → ${CATEGORY_LABEL[category]}`, at: new Date().toISOString(), meta: { from: d.category, to: category } }],
    } : d));
  };

  const [modal, setModal] = useState<{ open: boolean; dispute: Dispute | null }>({ open: false, dispute: null });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Tranh chấp</h1>
        <p className="mt-1 text-sm text-gray-600">Theo dõi và xử lý các tranh chấp giữa Người chăm sóc và Người cần chăm sóc.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Đang xem xét" value={stats.in_review} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25 21.75 12 12 21.75 2.25 12 12 2.25Z"/></svg>} />
        <StatCard title="Đã giải quyết" value={stats.resolved} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12.75 11.25 15l3.75-3.75"/></svg>} />
        <StatCard title="Đã hoàn tiền" value={stats.refunded} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12h18"/></svg>} />
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="rounded border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="All">Tất cả nhóm</option>
              {(["Payment","Service Quality","Schedule","Behavior","Other"] as DisputeCategory[]).map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="All">Tất cả trạng thái</option>
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
            <select value={severity} onChange={(e) => setSeverity(e.target.value as any)} className="rounded border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="All">Tất cả mức độ</option>
              {(["low","medium","high"] as DisputeSeverity[]).map(s => <option key={s} value={s}>{SEVERITY_LABEL[s]}</option>)}
            </select>
            <select value={creator} onChange={(e) => setCreator(e.target.value as any)} className="rounded border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="All">Tất cả người tạo</option>
              <option value="Care Seeker">Người cần chăm sóc</option>
              <option value="Caregiver">Người chăm sóc</option>
            </select>
          </div>
          <div className="relative">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo ID, booking, tên, email, tóm tắt" className="w-80 rounded border border-gray-300 px-3 py-2 text-sm" />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Booking</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nhóm</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mức độ</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Người tạo</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phụ trách</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <button className="inline-flex items-center gap-1" onClick={() => { setSortKey("updatedAt"); setSortAsc(k => sortKey === "updatedAt" ? !k : false); }}>
                    Cập nhật
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5H7z"/></svg>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pageItems.map((d) => (
                <DisputeRow key={d.id} d={d} onView={openDetail} />
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">Hiển thị {pageItems.length} / {filtered.length} kết quả</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50">Trước</button>
            <div className="text-sm">Trang {page} / {totalPages}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>

      <DisputeDetailModal
        open={modal.open}
        dispute={modal.dispute}
        onClose={() => setModal({ open: false, dispute: null })}
        onChangeStatus={changeStatus}
        onAssign={assignTo}
        onChangeSeverity={changeSeverity}
        onChangeCategory={changeCategory}
        onAddEvidence={addEvidence}
        onDeleteEvidence={deleteEvidence}
        onAddNote={addNote}
      />
    </div>
  );
};

export default AdminDisputeManagementPage;


