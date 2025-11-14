import React, { useEffect, useMemo, useState } from "react";

type ReviewCategory = "Video Consultation" | "Service" | "System" | "Complaint";
type ReviewRole = "Care Seeker" | "Caregiver";

export type AdminReview = {
  id: string;
  category: ReviewCategory;
  rating: number; // 1..5
  comment: string;
  createdByRole: ReviewRole;
  createdByName: string;
  createdByEmail?: string;
  relatedBookingId?: string;
  createdAt: string; // ISO
};

const CATEGORIES: ReviewCategory[] = [
  "Video Consultation",
  "Service",
  "System",
  "Complaint",
];

const CATEGORY_LABEL: Record<ReviewCategory, string> = {
  "Video Consultation": "Tư vấn video",
  "Service": "Dịch vụ",
  "System": "Hệ thống",
  "Complaint": "Khiếu nại",
};

const ROLE_LABEL: Record<ReviewRole, string> = {
  "Care Seeker": "Người cần chăm sóc",
  "Caregiver": "Người chăm sóc",
};

function generateMockReviews(count: number): AdminReview[] {
  const names = [
    "Nguyen Van A",
    "Tran Thi B",
    "Le Van C",
    "Pham Thi D",
    "Do Van E",
    "Hoang Thi F",
  ];
  const emails = [
    "a@example.com",
    "b@example.com",
    "c@example.com",
    "d@example.com",
    "e@example.com",
    "f@example.com",
  ];
  const comments = [
    "Dịch vụ rất tốt, caregiver thân thiện và đúng giờ.",
    "Video tư vấn rõ ràng, giải thích dễ hiểu.",
    "Hệ thống có lúc chậm, mong tối ưu thêm.",
    "Khiếu nại về việc tính phí chưa chính xác.",
    "Trải nghiệm tổng thể ổn, sẽ sử dụng tiếp.",
    "Cần cải thiện phần lịch đặt hẹn trên mobile.",
  ];

  const items: AdminReview[] = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const rating = 1 + Math.floor(Math.random() * 5);
    const name = names[i % names.length];
    const email = emails[i % emails.length];
    const role: ReviewRole = Math.random() > 0.5 ? "Care Seeker" : "Caregiver";
    const comment = comments[Math.floor(Math.random() * comments.length)];
    const createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)
    ).toISOString();
    const relatedBookingId = Math.random() > 0.6 ? `BK-${1000 + i}` : undefined;

    items.push({
      id: `R-${i + 1}`,
      category,
      rating,
      comment,
      createdByRole: role,
      createdByName: name,
      createdByEmail: email,
      relatedBookingId,
      createdAt,
    });
  }
  return items;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function classNames(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const StarRating: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, idx) => (
        <svg
          key={idx}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={idx < value ? "#F59E0B" : "none"}
          stroke="#F59E0B"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M11.48 3.499a.562.562 0 011.04 0l2.01 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61L12.53 17.89a.563.563 0 00-.56 0l-4.378 2.649a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557L3.65 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.01-5.111z"
          />
        </svg>
      ))}
    </div>
  );
};

// (Đã bỏ badge trạng thái khỏi bảng theo yêu cầu)

type ReviewModalProps = {
  open: boolean;
  review?: AdminReview | null;
  onClose: () => void;
};

const ReviewModal: React.FC<ReviewModalProps> = ({ open, review, onClose }) => {
  if (!open || !review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-semibold">Chi tiết đánh giá</h3>
          <button onClick={onClose} className="rounded p-2 text-gray-500 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-gray-500">Nhóm</div>
              <div className="font-medium">{CATEGORY_LABEL[review.category]}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Điểm</div>
              <div className="flex items-center gap-2"><StarRating value={review.rating} /><span className="text-sm text-gray-600">{review.rating}/5</span></div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Người tạo</div>
              <div className="font-medium">{review.createdByName} <span className="text-gray-500">({ROLE_LABEL[review.createdByRole]})</span></div>
              {review.createdByEmail && <div className="text-sm text-gray-600">{review.createdByEmail}</div>}
            </div>
            <div>
              <div className="text-sm text-gray-500">Ngày tạo</div>
              <div className="font-medium">{formatDate(review.createdAt)}</div>
            </div>
            {review.relatedBookingId && (
              <div className="sm:col-span-2">
                <div className="text-sm text-gray-500">Lịch hẹn liên quan</div>
                <div className="font-medium">{review.relatedBookingId}</div>
              </div>
            )}
            <div className="sm:col-span-2">
              <div className="text-sm text-gray-500">Bình luận</div>
              <div className="whitespace-pre-wrap">{review.comment}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Đóng</button>
        </div>
      </div>
    </div>
  );
};

type ReviewRowProps = {
  review: AdminReview;
  onView: (r: AdminReview) => void;
};

const ReviewRow: React.FC<ReviewRowProps> = ({ review, onView }) => {
  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3 text-sm text-gray-700">{CATEGORY_LABEL[review.category]}</td>
      <td className="px-4 py-3"><StarRating value={review.rating} /></td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
        <div className="line-clamp-2">{review.comment}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="font-medium">{review.createdByName}</div>
        <div className="text-gray-500">{ROLE_LABEL[review.createdByRole]}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(review.createdAt)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(review)}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50"
          >
            Xem
          </button>
        </div>
      </td>
    </tr>
  );
};

const PAGE_SIZE = 10;

const AdminReviewManagementPage: React.FC = () => {
  // data
  const [reviews] = useState<AdminReview[]>(() => generateMockReviews(42));

  // filters
  const [activeCategory, setActiveCategory] = useState<ReviewCategory | "All">("All");
  const [roleFilter, setRoleFilter] = useState<"All" | ReviewRole>("All");
  // Bỏ lọc trạng thái theo yêu cầu
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // pagination
  const [page, setPage] = useState(1);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<AdminReview | null>(null);

  // derived counts
  const counts = useMemo(() => {
    const map: Record<ReviewCategory, number> = {
      "Video Consultation": 0,
      "Service": 0,
      "System": 0,
      "Complaint": 0,
    };
    for (const r of reviews) {
      map[r.category]++;
    }
    return map;
  }, [reviews]);

  // debounce search 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (activeCategory !== "All" && r.category !== activeCategory) return false;
      if (roleFilter !== "All" && r.createdByRole !== roleFilter) return false;
      // Không lọc theo trạng thái nữa
      if (debouncedSearch) {
        const hay = `${r.createdByName} ${r.createdByEmail ?? ""}`.toLowerCase();
        if (!hay.includes(debouncedSearch)) return false;
      }
      return true;
    });
  }, [reviews, activeCategory, roleFilter, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    // reset page when filters change
    setPage(1);
  }, [activeCategory, roleFilter, debouncedSearch]);

  const handleView = (r: AdminReview) => {
    setSelected(r);
    setOpenModal(true);
  };

  // Bỏ cập nhật trạng thái và xoá theo yêu cầu

  const summaryCards = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CATEGORIES.map((c) => (
        <div key={c} className="rounded-xl bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">{CATEGORY_LABEL[c]}</div>
          <div className="mt-1 text-2xl font-semibold">{counts[c]}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đánh giá</h1>
        <p className="mt-1 text-sm text-gray-600">Theo dõi và xử lý phản hồi từ Care Seeker và Caregiver.</p>
      </div>

      {summaryCards}

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory("All")}
              className={classNames(
                "rounded-lg px-3 py-1.5 text-sm",
                activeCategory === "All" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Tất cả
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={classNames(
                  "rounded-lg px-3 py-1.5 text-sm",
                  activeCategory === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">Tất cả vai trò</option>
              <option value="Care Seeker">Người cần chăm sóc</option>
              <option value="Caregiver">Người chăm sóc</option>
            </select>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc email..."
                className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nhóm</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Điểm</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bình luận</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Người tạo</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ngày tạo</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pageItems.map((r) => (
                <ReviewRow
                  key={r.id}
                  review={r}
                  onView={handleView}
                />
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị {pageItems.length} / {filtered.length} kết quả
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <div className="text-sm">Trang {page} / {totalPages}</div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      <ReviewModal
        open={openModal}
        review={selected}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default AdminReviewManagementPage;


