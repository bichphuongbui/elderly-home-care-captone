import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

type Lesson = { id: string; title: string; duration?: string; type?: 'video' | 'article'; content?: string; videoUrl?: string };
type Section = { id: string; title: string; lessons: Lesson[] };

// Simple mock syllabus per course id
const getMockSections = (courseId: string): Section[] => {
  return [
    {
      id: 'sec-1',
      title: 'Tổng quan & an toàn',
      lessons: [
        { id: 'l-1', title: 'Giới thiệu vai trò caregiver', duration: '10m', type: 'article', content: 'Vai trò caregiver bao gồm hỗ trợ sinh hoạt, đảm bảo an toàn và đồng hành cảm xúc...' },
        { id: 'l-2', title: 'Nguyên tắc an toàn tại nhà', duration: '18m', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      ],
    },
    {
      id: 'sec-2',
      title: 'Giao tiếp & đồng hành',
      lessons: [
        { id: 'l-3', title: 'Kỹ thuật giao tiếp trấn an', duration: '22m', type: 'article', content: 'Sử dụng giọng nói nhẹ nhàng, ngôn ngữ cơ thể mở, lắng nghe chủ động...' },
        { id: 'l-4', title: 'Xử lý tình huống căng thẳng', duration: '15m', type: 'article', content: 'Nhận diện dấu hiệu căng thẳng, kỹ thuật thở, chuyển hướng sự chú ý...' },
      ],
    },
  ];
};

const LessonViewerPage: React.FC = () => {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  const sections = useMemo(() => getMockSections(id || 'course'), [id]);
  const allLessons = sections.flatMap((s) => s.lessons);
  const currentIndex = Math.max(0, allLessons.findIndex((l) => l.id === (lessonId || 'l-1')));
  const current = allLessons[currentIndex] || allLessons[0];
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : undefined;
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm">
          <Link to={`/care-giver/training/${id}`} className="text-blue-600 hover:underline">← Quay lại khoá học</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{current.title}</h1>
              <div className="mt-2 text-sm text-gray-600">Bài {currentIndex + 1} / {allLessons.length}{current.duration ? ` • ${current.duration}` : ''}</div>

              <div className="mt-5">
                {current.type === 'video' && current.videoUrl ? (
                  <video controls className="w-full rounded-lg border border-gray-200">
                    <source src={current.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <article className="prose prose-sm sm:prose max-w-none">
                    <p>{current.content ?? 'Nội dung bài học sẽ được cập nhật.'}</p>
                    <h4>Ghi chú quan trọng</h4>
                    <ul>
                      <li>Luôn đảm bảo an toàn trước khi hỗ trợ di chuyển.</li>
                      <li>Giao tiếp rõ ràng, chậm rãi và tôn trọng.</li>
                      <li>Quan sát và phản hồi phù hợp với cảm xúc người cao tuổi.</li>
                    </ul>
                  </article>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                {prev ? (
                  <Link to={`/care-giver/training/${id}/lesson/${prev.id}`} className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50">← Bài trước</Link>
                ) : <span />}
                {next ? (
                  <Link to={`/care-giver/training/${id}/lesson/${next.id}`} className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Bài tiếp theo →</Link>
                ) : (
                  <Link to={`/care-giver/training/${id}`} className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">Hoàn thành khoá học</Link>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900 rounded-t-2xl">Mục lục</div>
              <div className="p-2">
                {sections.map((sec) => (
                  <div key={sec.id} className="mb-2">
                    <div className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg">{sec.title}</div>
                    <ul className="mt-1">
                      {sec.lessons.map((l, idx) => {
                        const isActive = l.id === current.id;
                        return (
                          <li key={l.id}>
                            <Link
                              to={`/care-giver/training/${id}/lesson/${l.id}`}
                              className={`block px-3 py-2 text-sm rounded-lg ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              <span className="inline-flex items-center gap-2">
                                <span aria-hidden>▶</span>
                                <span>{l.title}</span>
                              </span>
                              {l.duration && <span className="ml-2 text-xs text-gray-500">({l.duration})</span>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LessonViewerPage;


