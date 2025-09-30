import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiEdit2, FiTrash2, FiPlus, FiCalendar } from 'react-icons/fi';

export interface CourseResource {
  id: string;
  type: 'pdf' | 'video' | 'doc' | 'link';
  title: string;
  size?: string;
  url?: string;
}

export interface LessonContent {
  id: string;
  type: 'text' | 'video' | 'file';
  title: string;
  content?: string; // For text content
  url?: string; // For video/file URLs
  size?: string; // For file size
}

export interface CourseLesson {
  id: string;
  title: string;
  duration?: string;
  content?: LessonContent[];
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseInstructor {
  name: string;
  title: string;
  initials: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration?: string;
  level?: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  objectives?: string[];
  sections?: CourseSection[];
  resources?: CourseResource[];
  instructor?: CourseInstructor;
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
    { 
      id: '1', 
      title: 'Kỹ năng chăm sóc người cao tuổi', 
      description: 'Các nguyên tắc chăm sóc cơ bản và nâng cao cho người cao tuổi, bao gồm dinh dưỡng, vận động và giao tiếp.',
      duration: '4 giờ',
      level: 'Cơ bản',
      objectives: [
        'Nắm vững nguyên tắc an toàn khi hỗ trợ sinh hoạt hằng ngày',
        'Thực hành giao tiếp trấn an và tôn trọng người cao tuổi',
        'Nhận biết sớm dấu hiệu rủi ro và cách xử lý ban đầu'
      ],
      sections: [
        {
          id: 'sec-1',
          title: 'Tổng quan & an toàn',
          lessons: [
            { 
              id: 'l-1', 
              title: 'Giới thiệu vai trò caregiver', 
              duration: '10m',
              content: [
                {
                  id: 'c-1',
                  type: 'text',
                  title: 'Định nghĩa caregiver',
                  content: 'Caregiver là người chăm sóc, hỗ trợ người cao tuổi trong các hoạt động sinh hoạt hàng ngày...'
                },
                {
                  id: 'c-2',
                  type: 'video',
                  title: 'Video giới thiệu',
                  url: 'https://example.com/video1.mp4',
                  size: '5:30'
                }
              ]
            },
            { 
              id: 'l-2', 
              title: 'Nguyên tắc an toàn tại nhà', 
              duration: '18m',
              content: [
                {
                  id: 'c-3',
                  type: 'text',
                  title: 'Các nguyên tắc cơ bản',
                  content: 'Luôn đảm bảo môi trường sống an toàn, loại bỏ các vật cản, đảm bảo ánh sáng đầy đủ...'
                },
                {
                  id: 'c-4',
                  type: 'file',
                  title: 'Checklist an toàn',
                  url: 'https://example.com/checklist.pdf',
                  size: '2.1MB'
                }
              ]
            }
          ]
        },
        {
          id: 'sec-2',
          title: 'Giao tiếp & đồng hành',
          lessons: [
            { 
              id: 'l-3', 
              title: 'Kỹ thuật giao tiếp trấn an', 
              duration: '22m',
              content: [
                {
                  id: 'c-5',
                  type: 'text',
                  title: 'Nguyên tắc giao tiếp',
                  content: 'Lắng nghe tích cực, sử dụng ngôn ngữ cơ thể phù hợp, tránh áp đặt...'
                },
                {
                  id: 'c-6',
                  type: 'video',
                  title: 'Thực hành giao tiếp',
                  url: 'https://example.com/communication.mp4',
                  size: '8:45'
                }
              ]
            },
            { 
              id: 'l-4', 
              title: 'Xử lý tình huống căng thẳng', 
              duration: '15m',
              content: [
                {
                  id: 'c-7',
                  type: 'text',
                  title: 'Nhận biết dấu hiệu căng thẳng',
                  content: 'Quan sát thay đổi hành vi, cảm xúc, phản ứng của người cao tuổi...'
                }
              ]
            }
          ]
        }
      ],
      resources: [
        { id: 'r-1', type: 'pdf', title: 'Checklist an toàn trong nhà', size: '1.2MB' },
        { id: 'r-2', type: 'video', title: 'Kỹ thuật di chuyển an toàn', size: '8:24' }
      ],
      instructor: { name: 'BS. Nguyễn Minh Anh', title: 'Chuyên gia Lão khoa', initials: 'MA' },
      createdAt: new Date().toISOString() 
    },
    { 
      id: '2', 
      title: 'Xử lý tình huống khẩn cấp', 
      description: 'Nhận biết dấu hiệu và quy trình sơ cứu cho người cao tuổi trong các tình huống khẩn cấp.',
      duration: '2.5 giờ',
      level: 'Nâng cao',
      objectives: [
        'Nhận biết các dấu hiệu nguy cấp ở người cao tuổi',
        'Thực hiện sơ cứu cơ bản an toàn',
        'Biết khi nào cần gọi cấp cứu'
      ],
      sections: [
        {
          id: 'sec-1',
          title: 'Nhận biết dấu hiệu nguy cấp',
          lessons: [
            { 
              id: 'l-1', 
              title: 'Dấu hiệu đột quỵ', 
              duration: '15m',
              content: [
                {
                  id: 'c-8',
                  type: 'text',
                  title: 'Các dấu hiệu chính',
                  content: 'Mặt méo, tay yếu, nói khó, đau đầu dữ dội, chóng mặt...'
                },
                {
                  id: 'c-9',
                  type: 'video',
                  title: 'Video minh họa',
                  url: 'https://example.com/stroke-signs.mp4',
                  size: '6:20'
                }
              ]
            },
            { 
              id: 'l-2', 
              title: 'Dấu hiệu đau tim', 
              duration: '12m',
              content: [
                {
                  id: 'c-10',
                  type: 'text',
                  title: 'Triệu chứng đau tim',
                  content: 'Đau ngực, khó thở, đổ mồ hôi, buồn nôn, đau lan ra cánh tay...'
                }
              ]
            }
          ]
        }
      ],
      resources: [
        { id: 'r-1', type: 'pdf', title: 'Guideline sơ cứu', size: '2.1MB' },
        { id: 'r-2', type: 'video', title: 'Video minh hoạ', size: '15:30' }
      ],
      instructor: { name: 'BS. Trần Văn Nam', title: 'Bác sĩ Cấp cứu', initials: 'TN' },
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString() 
    },
    { 
      id: '3', 
      title: 'Giao tiếp với người cao tuổi', 
      description: 'Thực hành giao tiếp, lắng nghe và đồng cảm với người cao tuổi.',
      duration: '3 giờ',
      level: 'Trung cấp',
      objectives: [
        'Học cách lắng nghe tích cực',
        'Thực hành giao tiếp không lời',
        'Xử lý xung đột trong giao tiếp'
      ],
      sections: [
        {
          id: 'sec-1',
          title: 'Kỹ năng giao tiếp cơ bản',
          lessons: [
            { 
              id: 'l-1', 
              title: 'Lắng nghe tích cực', 
              duration: '20m',
              content: [
                {
                  id: 'c-11',
                  type: 'text',
                  title: 'Kỹ thuật lắng nghe',
                  content: 'Tập trung hoàn toàn, không ngắt lời, đặt câu hỏi mở, phản hồi tích cực...'
                },
                {
                  id: 'c-12',
                  type: 'file',
                  title: 'Bài tập thực hành',
                  url: 'https://example.com/listening-exercise.pdf',
                  size: '1.5MB'
                }
              ]
            },
            { 
              id: 'l-2', 
              title: 'Giao tiếp không lời', 
              duration: '25m',
              content: [
                {
                  id: 'c-13',
                  type: 'text',
                  title: 'Ngôn ngữ cơ thể',
                  content: 'Ánh mắt, nụ cười, cử chỉ tay, tư thế cơ thể, khoảng cách giao tiếp...'
                },
                {
                  id: 'c-14',
                  type: 'video',
                  title: 'Thực hành giao tiếp',
                  url: 'https://example.com/body-language.mp4',
                  size: '12:30'
                }
              ]
            }
          ]
        }
      ],
      resources: [
        { id: 'r-1', type: 'pdf', title: 'Tài liệu tổng quan', size: '1.5MB' },
        { id: 'r-2', type: 'doc', title: 'Slide đào tạo', size: '2.3MB' }
      ],
      instructor: { name: 'ThS. Lê Thị Hoa', title: 'Chuyên gia Tâm lý', initials: 'LH' },
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString() 
    }
  ]), []);

  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const openAdd = () => {
    navigate('/admin/training/new');
  };

  const openEdit = (course: Course) => {
    navigate(`/admin/training/${course.id}/edit`);
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
            onClick={() => navigate(`/admin/training/${course.id}`)}
            className="group bg-white rounded-lg shadow hover:shadow-lg transition p-5 cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/training/${course.id}`); }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-3">
                  <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  <span>Ngày tạo: {formatDate(course.createdAt)}</span>
                  </div>
                  {course.duration && (
                    <div className="flex items-center">
                      <span className="mr-1">⏱</span>
                      <span>{course.duration}</span>
                    </div>
                  )}
                  {course.level && (
                    <div className="flex items-center">
                      <span className="mr-1">🎯</span>
                      <span>{course.level}</span>
                    </div>
                  )}
                  {course.sections && course.sections.length > 0 && (
                    <div className="flex items-center">
                      <span className="mr-1">📚</span>
                      <span>{course.sections.length} module</span>
                    </div>
                  )}
                  {course.resources && course.resources.length > 0 && (
                    <div className="flex items-center">
                      <span className="mr-1">📁</span>
                      <span>{course.resources.length} tài liệu</span>
                    </div>
                  )}
                </div>
                
                {course.instructor && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Giảng viên:</span> {course.instructor.name} - {course.instructor.title}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/admin/training/${course.id}`); }}
                className="inline-flex items-center px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <FiBookOpen className="mr-2" /> Xem chi tiết
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

    </div>
  );
};

export default AdminTrainingPage;
