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
    in_review: "bg-indigo-100 text-indigo-700",
    awaiting_info: "bg-amber-100 text-amber-700",
    resolved: "bg-emerald-100 text-emerald-700",
    refunded: "bg-blue-100 text-blue-700",
    rejected: "bg-slate-100 text-slate-700",
  } as const;
  return <span className={classNames("inline-flex rounded-full px-2 py-1 text-xs font-medium", map[value])}>{STATUS_LABEL[value]}</span>;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white shadow overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Tranh chấp #{dispute.id}</h3>
            <StatusBadge value={dispute.status} />
          </div>
          <button onClick={onClose} className="rounded p-2 text-gray-500 hover:bg-gray-100" aria-label="Đóng">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-gray-500">Booking</div>
                  <div className="font-medium">{dispute.bookingId ?? "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nhóm</div>
                  <div className="font-medium">{CATEGORY_LABEL[category]}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Mức độ</div>
                  <div className="font-medium"><SeverityBadge value={severity} /></div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Người tạo</div>
                  <div className="font-medium">{dispute.createdByName} <span className="text-gray-500">({dispute.createdByRole})</span></div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Đối tượng</div>
                  <div className="font-medium">{dispute.againstName ?? "—"} <span className="text-gray-500">({dispute.againstRole})</span></div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phụ trách</div>
                  <div className="font-medium">{dispute.assignedTo ?? "Chưa gán"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cập nhật</div>
                  <div className="font-medium">{formatDate(dispute.updatedAt)}</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="text-sm text-gray-500">Tóm tắt</div>
              <div className="font-medium">{dispute.summary}</div>
              <div className="mt-3 text-sm text-gray-500">Chi tiết</div>
              <div className="whitespace-pre-wrap">{dispute.detail}</div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Timeline</div>
              <div className="space-y-2">
                {dispute.timeline.slice().reverse().map(t => (
                  <div key={t.id} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500" />
                    <div>
                      <div className="font-medium">{t.label}</div>
                      <div className="text-gray-500">{formatDate(t.at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">Chỉnh sửa thông tin</div>
                <StatusBadge value={status} />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Trạng thái</label>
                    <div className="flex items-center gap-2">
                      <select value={status} onChange={(e) => setStatus(e.target.value as DisputeStatus)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                      <button onClick={handleSaveStatus} className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">Lưu</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phụ trách</label>
                    <div className="flex items-center gap-2">
                      <select value={assignee ?? ""} onChange={(e) => setAssignee(e.target.value || undefined)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                        <option value="">Chưa gán</option>
                        {ADMIN_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <button onClick={handleSaveAssign} className="rounded bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-900">Gán</button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nhóm tranh chấp</label>
                    <div className="flex items-center gap-2">
                      <select value={category} onChange={(e) => setCategory(e.target.value as DisputeCategory)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                        {(["Payment","Service Quality","Schedule","Behavior","Other"] as DisputeCategory[]).map(c => (
                          <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                        ))}
                      </select>
                      <button onClick={handleSaveCategory} className="rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">Lưu</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Mức độ nghiêm trọng</label>
                    <div className="flex items-center gap-2">
                      <select value={severity} onChange={(e) => setSeverity(e.target.value as DisputeSeverity)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none">
                        {(["low","medium","high"] as DisputeSeverity[]).map(s => (
                          <option key={s} value={s}>{SEVERITY_LABEL[s]}</option>
                        ))}
                      </select>
                      <button onClick={handleSaveSeverity} className="rounded bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700">Lưu</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Minh chứng</div>
              <div className="divide-y divide-gray-100 rounded border">
                {dispute.evidence.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between gap-3 p-2 text-sm">
                    <div className="flex items-center gap-3">
                      {ev.type === 'image' && ev.url && (
                        <div className="relative">
                          <img 
                            src={ev.url} 
                            alt={ev.filename}
                            className="h-12 w-12 rounded object-cover cursor-pointer hover:opacity-80"
                            onClick={() => window.open(ev.url, '_blank')}
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{ev.filename} <span className="text-gray-500">({ev.type})</span></div>
                        <div className="text-gray-500">{ev.uploadedBy} • {formatDate(ev.uploadedAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={ev.url || "#"} target="_blank" rel="noreferrer" className="rounded border px-2 py-1 hover:bg-gray-50">Xem</a>
                      <button onClick={() => onDeleteEvidence(dispute.id, ev.id)} className="rounded bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100">Xoá</button>
                    </div>
                  </div>
                ))}
                {dispute.evidence.length === 0 && <div className="p-2 text-center text-sm text-gray-500">Chưa có minh chứng</div>}
              </div>
              <div className="mt-3 space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-500 mb-2">Upload file minh chứng</div>
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
                        // Tạo URL tạm thời cho file
                        const url = URL.createObjectURL(file);
                        setFileUrl(url);
                      }
                    }}
                  />
                  <label 
                    htmlFor="evidence-upload" 
                    className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    Chọn file
                  </label>
                </div>
                {fileName && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">File đã chọn: {fileName}</span>
                    <button 
                      onClick={addEvidence} 
                      className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Upload
                    </button>
                    <button 
                      onClick={() => {
                        setFileName("");
                        setFileUrl("");
                        setFileType("image");
                      }} 
                      className="rounded bg-gray-500 px-3 py-1 text-sm font-medium text-white hover:bg-gray-600"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Ghi chú nội bộ</div>
              <div className="space-y-2">
                {dispute.notes.map(n => (
                  <div key={n.id} className="rounded border p-2 text-sm">
                    <div className="font-medium">{n.author} <span className="text-gray-500">{formatDate(n.createdAt)}</span></div>
                    <div>{n.content}</div>
                  </div>
                ))}
                {dispute.notes.length === 0 && <div className="text-sm text-gray-500">Chưa có ghi chú</div>}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Thêm ghi chú" className="h-20 w-full resize-none rounded border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none" />
                <button onClick={addNote} className="h-10 shrink-0 rounded bg-gray-800 px-3 text-sm font-medium text-white hover:bg-gray-900">Thêm</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3 bg-white">
          <div className="text-sm text-gray-500">
            Tranh chấp #{dispute.id} • Cập nhật lần cuối: {formatDate(dispute.updatedAt)}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Đóng
            </button>
            
          </div>
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


