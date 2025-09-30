import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiBookOpen, FiClock, FiUser, FiFileText, FiVideo, FiDownload } from 'react-icons/fi';

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
  content?: string;
  url?: string;
  size?: string;
  file?: File;
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
  createdAt: string;
}

const AdminCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Mock course data - in real app, this would come from API
  const course: Course = useMemo(() => ({
    id: courseId || '1',
    title: 'Kỹ năng chăm sóc người cao tuổi',
    description: 'Các nguyên tắc chăm sóc cơ bản và nâng cao cho người cao tuổi, bao gồm dinh dưỡng, vận động và giao tiếp. Khóa học này cung cấp kiến thức toàn diện về cách chăm sóc người cao tuổi một cách an toàn và hiệu quả.',
    duration: '4 giờ',
    level: 'Cơ bản',
    objectives: [
      'Nắm vững nguyên tắc an toàn khi hỗ trợ sinh hoạt hằng ngày',
      'Thực hành giao tiếp trấn an và tôn trọng người cao tuổi',
      'Nhận biết sớm dấu hiệu rủi ro và cách xử lý ban đầu',
      'Hiểu biết về dinh dưỡng và chế độ ăn uống phù hợp',
      'Kỹ năng hỗ trợ vận động và phòng ngừa té ngã'
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
                content: '<p>Caregiver là người chăm sóc, hỗ trợ người cao tuổi trong các hoạt động sinh hoạt hàng ngày. Vai trò này đòi hỏi sự kiên nhẫn, tình yêu thương và kiến thức chuyên môn.</p>'
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
                content: '<p>Luôn đảm bảo môi trường sống an toàn, loại bỏ các vật cản, đảm bảo ánh sáng đầy đủ và không gian rộng rãi để di chuyển.</p>'
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
                content: '<p>Lắng nghe tích cực, sử dụng ngôn ngữ cơ thể phù hợp, tránh áp đặt và luôn thể hiện sự tôn trọng.</p>'
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
                content: '<p>Quan sát thay đổi hành vi, cảm xúc, phản ứng của người cao tuổi để kịp thời can thiệp.</p>'
              }
            ]
          }
        ]
      }
    ],
    resources: [
      { id: 'r-1', type: 'pdf', title: 'Checklist an toàn trong nhà', size: '1.2MB' },
      { id: 'r-2', type: 'video', title: 'Kỹ thuật di chuyển an toàn', size: '8:24' },
      { id: 'r-3', type: 'doc', title: 'Hướng dẫn dinh dưỡng', size: '3.1MB' }
    ],
    instructor: { 
      name: 'BS. Nguyễn Minh Anh', 
      title: 'Chuyên gia Lão khoa', 
      initials: 'MA' 
    },
    createdAt: new Date().toISOString()
  }), [courseId]);

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa khóa học này?')) {
      // In real app, call API to delete course
      navigate('/admin/training');
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'text': return <FiFileText className="w-4 h-4" />;
      case 'video': return <FiVideo className="w-4 h-4" />;
      case 'file': return <FiDownload className="w-4 h-4" />;
      default: return <FiFileText className="w-4 h-4" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FiFileText className="w-4 h-4 text-red-600" />;
      case 'video': return <FiVideo className="w-4 h-4 text-purple-600" />;
      case 'doc': return <FiFileText className="w-4 h-4 text-blue-600" />;
      case 'link': return <FiBookOpen className="w-4 h-4 text-green-600" />;
      default: return <FiFileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin/training')}
              className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Quay lại
            </button>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                {course.duration && (
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center">
                    <span className="mr-2">🎯</span>
                    <span>{course.level}</span>
                  </div>
                )}
                {course.sections && course.sections.length > 0 && (
                  <div className="flex items-center">
                    <span className="mr-2">📚</span>
                    <span>{course.sections.length} module</span>
                  </div>
                )}
                {course.resources && course.resources.length > 0 && (
                  <div className="flex items-center">
                    <span className="mr-2">📁</span>
                    <span>{course.resources.length} tài liệu</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/training/${course.id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit2 className="mr-2" />
                Chỉnh sửa
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiTrash2 className="mr-2" />
                Xóa
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mô tả khóa học</h2>
              <p className="text-gray-700 leading-7">{course.description}</p>
            </div>

            {/* Learning Objectives */}
            {course.objectives && course.objectives.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Những gì sẽ học được</h2>
                <ul className="space-y-3">
                  {course.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="mt-1 text-green-600">✅</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content */}
            {course.sections && course.sections.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Nội dung khóa học</h2>
                <div className="space-y-6">
                  {course.sections.map((section) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          <span className="text-sm text-gray-600">{section.lessons.length} bài</span>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {section.lessons.map((lesson) => (
                          <div key={lesson.id} className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">{lesson.title}</h4>
                                {lesson.duration && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <FiClock className="mr-1" />
                                    <span>{lesson.duration}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Lesson Content */}
                            {lesson.content && lesson.content.length > 0 && (
                              <div className="ml-4 space-y-2">
                                <div className="text-sm font-medium text-gray-700 mb-2">Nội dung:</div>
                                {lesson.content.map((content) => (
                                  <div key={content.id} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    {getContentIcon(content.type)}
                                    <span>{content.title}</span>
                                    {content.size && (
                                      <span className="text-xs text-gray-500">({content.size})</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {course.resources && course.resources.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tài liệu đính kèm</h2>
                <div className="space-y-3">
                  {course.resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getResourceIcon(resource.type)}
                        <div>
                          <div className="font-medium text-gray-900">{resource.title}</div>
                          <div className="text-sm text-gray-600">
                            {resource.type.toUpperCase()} • {resource.size}
                          </div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Tải xuống
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khóa học</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Thời lượng</span>
                  <span className="font-medium">{course.duration || 'Chưa xác định'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trình độ</span>
                  <span className="font-medium">{course.level || 'Chưa xác định'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Số module</span>
                  <span className="font-medium">{course.sections?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tài liệu</span>
                  <span className="font-medium">{course.resources?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Giảng viên</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {course.instructor.initials}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{course.instructor.name}</div>
                    <div className="text-sm text-gray-600">{course.instructor.title}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Chuyên gia với nhiều năm kinh nghiệm trong lĩnh vực lão khoa và chăm sóc người cao tuổi.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động</h3>
              <div className="space-y-3">
                <Link
                  to={`/admin/training/${course.id}/files`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FiBookOpen className="mr-2" />
                  Quản lý tài liệu
                </Link>
                <Link
                  to={`/admin/training/${course.id}/edit`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiEdit2 className="mr-2" />
                  Chỉnh sửa khóa học
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetailPage;
