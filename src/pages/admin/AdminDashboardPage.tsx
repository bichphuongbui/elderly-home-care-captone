import React from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  accent?: "blue" | "green" | "purple" | "amber";
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
};

const statAccentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-green-50 text-green-700 ring-green-200",
  purple: "bg-purple-50 text-purple-700 ring-purple-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
};

const StatCard: React.FC<StatCardProps> = ({ label, value, accent = "blue", icon, trend }) => {
  const accentClasses = statAccentMap[accent];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-sm font-medium ring-1 ${accentClasses}`}>
          <span className="inline-block h-2 w-2 rounded-full bg-current opacity-80" />
          {label}
        </div>
        {icon && (
          <div className="rounded-xl bg-gray-50 p-2 text-gray-600 ring-1 ring-inset ring-gray-100">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <div className="text-3xl font-semibold tracking-tight text-gray-900">{value}</div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
              trend.direction === "up"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-rose-50 text-rose-700 ring-rose-200"
            }`}
          >
            {trend.direction === "up" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M10 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 1 1 6.293 10.293L8.586 12.586V4a1 1 0 0 1 1-1Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M10 17a1 1 0 0 1-1-1V7.414L6.707 9.707A1 1 0 1 1 5.293 8.293l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 1 1-1.414 1.414L11 7.414V16a1 1 0 0 1-1 1Z" clipRule="evenodd" />
              </svg>
            )}
            {trend.value}
          </span>
        )}
      </div>
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-gray-50 to-white opacity-60 ring-1 ring-inset ring-gray-100 transition group-hover:scale-110" />
    </div>
  );
};

type Feedback = {
  id: string;
  name: string;
  content: string;
  date: string;
};

const mockFeedbacks: Feedback[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    content: "Dịch vụ rất tốt, nhân viên nhiệt tình và chu đáo.",
    date: "2025-08-12",
  },
  {
    id: "2",
    name: "Trần Thị B",
    content: "Ứng dụng dễ sử dụng, đặt lịch nhanh chóng.",
    date: "2025-08-10",
  },
  {
    id: "3",
    name: "Phạm Minh C",
    content: "Mong có thêm nhiều gói dịch vụ linh hoạt hơn.",
    date: "2025-08-08",
  },
  {
    id: "4",
    name: "Lê Thu D",
    content: "Tốc độ phản hồi nhanh, rất hài lòng.",
    date: "2025-08-05",
  },
  {
    id: "5",
    name: "Đỗ Quang E",
    content: "Giao diện đẹp, trải nghiệm mượt mà.",
    date: "2025-08-02",
  },
];

type Activity = {
  id: string;
  type: "user" | "caregiver" | "booking" | "system";
  description: string;
  time: string;
};

const mockActivities: Activity[] = [
  { id: "a1", type: "user", description: "Tài khoản mới: Lưu Gia Huy", time: "5 phút trước" },
  { id: "a2", type: "booking", description: "Đặt lịch mới #BK-2025-0875", time: "15 phút trước" },
  { id: "a3", type: "caregiver", description: "Yêu cầu duyệt hồ sơ caregiver: Vũ Thu Hà", time: "35 phút trước" },
  { id: "a4", type: "system", description: "Backup hệ thống hoàn tất", time: "1 giờ trước" },
];

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-emerald-50 p-6 sm:p-8">
          <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Bảng điều khiển</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Quản trị hệ thống</h1>
              <p className="mt-1 text-sm text-gray-600">Tổng quan nhanh về người dùng, đặt lịch và phản hồi.</p>
            </div>
            
          </div>
          <div className="pointer-events-none absolute -right-10 top-0 -z-10 h-40 w-40 rounded-full bg-indigo-100 opacity-60 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 -z-10 h-40 w-40 rounded-full bg-emerald-100 opacity-60 blur-2xl" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            label="Tổng số người dùng" 
            value={1280} 
            accent={"blue"}
            
            trend={{ value: "+12%", direction: "up" }}
          />
          <StatCard 
            label="Người chăm sóc chờ duyệt" 
            value={42} 
            accent={"amber"}
           
            trend={{ value: "+3", direction: "up" }}
          />
          <StatCard 
            label="Tổng lượt đặt dịch vụ" 
            value={875} 
            accent={"green"}
            
            trend={{ value: "+7%", direction: "up" }}
          />
          <StatCard 
            label="Phản hồi/đánh giá" 
            value={350} 
            accent={"purple"}
           
            trend={{ value: "-2%", direction: "down" }}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Phản hồi gần đây</h2>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Xem tất cả</button>
            </div>
            <ul className="divide-y divide-gray-100">
              {mockFeedbacks.slice(0, 5).map((fb) => (
                <li key={fb.id} className="flex items-start gap-4 py-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
                    <span className="text-sm font-semibold">
                      {fb.name
                        .split(" ")
                        .slice(-2)
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <p className="truncate text-sm font-medium text-gray-900">{fb.name}</p>
                      <span className="flex-none text-xs text-gray-500">{new Date(fb.date).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{fb.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Hoạt động hệ thống</h2>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-700">Làm mới</button>
            </div>
            <ul className="space-y-3">
              {mockActivities.map((act) => (
                <li key={act.id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                  <div className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg ring-1 ring-inset ${
                    act.type === "user"
                      ? "bg-indigo-50 text-indigo-600 ring-indigo-100"
                      : act.type === "caregiver"
                      ? "bg-amber-50 text-amber-600 ring-amber-100"
                      : act.type === "booking"
                      ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                      : "bg-gray-50 text-gray-600 ring-gray-100"
                  }`}>
                    {act.type === "user" && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0 .882.882 0 0 1-.879.882H5.379A.882.882 0 0 1 4.5 20.118Z"/></svg>
                    )}
                    {act.type === "caregiver" && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M6.75 7.5A3.75 3.75 0 1 0 6.75 0a3.75 3.75 0 0 0 0 7.5Zm10.5 0A3.75 3.75 0 1 0 17.25 0a3.75 3.75 0 0 0 0 7.5Z"/></svg>
                    )}
                    {act.type === "booking" && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25V6H3v-.75ZM3 7.5h18v11.25A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V7.5Z"/></svg>
                    )}
                    {act.type === "system" && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 2.25A9.75 9.75 0 1 0 21.75 12 9.761 9.761 0 0 0 12 2.25Zm.75 5.25a.75.75 0 0 0-1.5 0v4.5c0 .199.079.39.22.53l3 3a.75.75 0 1 0 1.06-1.06l-2.78-2.78V7.5Z"/></svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800">{act.description}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{act.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;


