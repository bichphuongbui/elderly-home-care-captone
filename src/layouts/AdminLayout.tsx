import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type AdminLayoutProps = {
  children: React.ReactNode;
};

type MenuItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M3.75 13.5A2.25 2.25 0 0 1 6 11.25h3A2.25 2.25 0 0 1 11.25 13.5V18A2.25 2.25 0 0 1 9 20.25H6A2.25 2.25 0 0 1 3.75 18v-4.5ZM12.75 6A2.25 2.25 0 0 1 15 3.75h3A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-3a2.25 2.25 0 0 1-2.25-2.25V6ZM12.75 13.5A2.25 2.25 0 0 1 15 11.25h3A2.25 2.25 0 0 1 20.25 13.5V18A2.25 2.25 0 0 1 18 20.25h-3A2.25 2.25 0 0 1 12.75 18v-4.5ZM3.75 6A2.25 2.25 0 0 1 6 3.75h3A2.25 2.25 0 0 1 11.25 6v2.25A2.25 2.25 0 0 1 9 10.5H6A2.25 2.25 0 0 1 3.75 8.25V6Z" />
          </svg>
        ),
      },
      {
        label: "Quản lý người dùng",
        path: "/admin/users",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0 .882.882 0 0 1-.879.882H5.379A.882.882 0 0 1 4.5 20.118Z" />
          </svg>
        ),
      },
      {
        label: "Tài liệu đào tạo",
        path: "/admin/training",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h10.5A2.25 2.25 0 0 1 18.75 6v12A2.25 2.25 0 0 1 16.5 20.25H6A2.25 2.25 0 0 1 3.75 18V6Zm3.75-.75A.75.75 0 0 0 6.75 6v12a.75.75 0 0 0 .75.75h9a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H7.5Z" />
          </svg>
        ),
      },
      {
        label: "Duyệt hồ sơ caregiver",
        path: "/admin/caregiver-approval",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M9 12.75 11.25 15l3.75-3.75M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Z" />
          </svg>
        ),
      },
      {
        label: "Duyệt chứng chỉ",
        path: "/admin/certificate-approval",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M8.25 6.75h7.5m-7.5 3h7.5m-7.5 3h7.5M4.5 6.75h.008v.008H4.5V6.75Zm0 3h.008v.008H4.5v-.008Zm0 3h.008v.008H4.5v-.008ZM2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h15a2.25 2.25 0 0 1 2.25 2.25v15A2.25 2.25 0 0 1 19.5 21.75h-15A2.25 2.25 0 0 1 2.25 19.5v-15Z" />
          </svg>
        ),
      },
      {
        label: "Phản hồi / Đánh giá",
        path: "/admin/feedback",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2.25c5.385 0 9.75 3.858 9.75 8.625S17.385 19.5 12 19.5a11.6 11.6 0 0 1-2.612-.3l-3.61 2.165a.75.75 0 0 1-1.126-.65v-3.31C2.03 15.885 2.25 15.21 2.25 10.875 2.25 6.108 6.615 2.25 12 2.25Z" />
          </svg>
        ),
      },
      {
        label: "Tranh chấp",
        path: "/admin/disputes",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2.25 21.75 12 12 21.75 2.25 12 12 2.25Z" />
          </svg>
        ),
      },
    ],
    []
  );

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    try {
      localStorage.removeItem("current_user");
      localStorage.removeItem("userId");
    } catch {}
    try { window.dispatchEvent(new Event('auth:changed')); } catch {}
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`sticky top-0 z-30 hidden h-screen flex-shrink-0 bg-gray-800 text-white shadow md:block ${
          isOpen ? "w-64" : "w-20"
        } transition-[width] duration-200`}
      >
        <div className="flex items-center justify-between border-b border-gray-700 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white shadow-sm">A</div>
            {isOpen && <span className="text-sm font-semibold">Admin</span>}
          </div>
          <button
            aria-label="Toggle sidebar"
            onClick={() => setIsOpen((v) => !v)}
            className="rounded p-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition hover:bg-gray-700 ${
                isActive(item.path) ? "bg-gray-700 text-white" : "text-gray-300"
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <span className="text-gray-300 group-hover:text-white">{item.icon}</span>
              {isOpen && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
            title={!isOpen ? "Đăng xuất" : undefined}
          >
            <span className="text-gray-300 group-hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M15.75 3.75A3.75 3.75 0 0 1 19.5 7.5v9a3.75 3.75 0 0 1-3.75 3.75h-3a.75.75 0 0 1 0-1.5h3A2.25 2.25 0 0 0 18 16.5v-9A2.25 2.25 0 0 0 15.75 5.25h-3a.75.75 0 0 1 0-1.5h3Zm-6.53 4.22a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H3.75a.75.75 0 0 1 0-1.5h6.19l-1.72-1.72a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </span>
            {isOpen && <span>Đăng xuất</span>}
          </button>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:ml-0">
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;


