import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiEdit2, FiTrash2, FiPlus, FiX, FiCalendar } from 'react-icons/fi';

export interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string; // ISO string
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const day = `${d.getDate()}`.padStart(2, '0');
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const AdminTrainingPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock initial data
  const initialCourses: Course[] = useMemo(() => ([
    { id: '1', title: 'Kỹ năng chăm sóc người cao tuổi', description: 'Các nguyên tắc chăm sóc cơ bản và nâng cao.', createdAt: new Date().toISOString() },
    { id: '2', title: 'Xử lý tình huống khẩn cấp', description: 'Nhận biết dấu hiệu và quy trình sơ cứu.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: '3', title: 'Giao tiếp với người cao tuổi', description: 'Thực hành giao tiếp, lắng nghe và đồng cảm.', createdAt: new Date(Date.now() - 86400000 * 12).toISOString() }
  ]), []);

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<{ title: string; description: string }>(() => ({ title: '', description: '' }));

  const openAdd = () => {
    setEditingCourse(null);
    setForm({ title: '', description: '' });
    setIsFormOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setForm({ title: course.title, description: course.description });
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingCourse) {
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, title: form.title.trim(), description: form.description.trim() } : c));
    } else {
      const newCourse: Course = {
        id: `${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        createdAt: new Date().toISOString()
      };
      setCourses(prev => [newCourse, ...prev]);
    }
    setIsFormOpen(false);
  };

  const confirmDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xoá khoá học này?')) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khoá học</h1>
          <p className="text-gray-600">Thêm, chỉnh sửa và quản lý tài liệu đào tạo</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" /> Thêm khoá học
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            onClick={() => navigate(`/admin/training/${course.id}/files`)}
            className="group bg-white rounded-lg shadow hover:shadow-lg transition p-5 cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/training/${course.id}/files`); }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                <div className="flex items-center text-sm text-gray-500 mt-3">
                  <FiCalendar className="mr-1" />
                  <span>Ngày tạo: {formatDate(course.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/admin/training/${course.id}/files`); }}
                className="inline-flex items-center px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <FiBookOpen className="mr-2" /> Xem tài liệu
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openEdit(course); }}
                className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <FiEdit2 className="mr-2" /> Sửa
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); confirmDelete(course.id); }}
                className="inline-flex items-center px-3 py-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
              >
                <FiTrash2 className="mr-2" /> Xoá
              </button>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-600">
            Chưa có khoá học nào.
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingCourse ? 'Chỉnh sửa khoá học' : 'Thêm khoá học'}</h2>
              <button onClick={closeForm} className="p-2 rounded hover:bg-gray-100">
                <FiX />
              </button>
            </div>

            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khoá học</label>
                <input
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên khoá học"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Mô tả ngắn về nội dung khoá học"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Huỷ</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  {editingCourse ? 'Lưu thay đổi' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrainingPage;
