import React from 'react';

// Component hiển thị preview của 3 bài blog mới nhất
const BlogPreview: React.FC = () => {
  const blogs = [
    {
      id: 1,
      title: '5 Bài tập thể dục nhẹ nhàng cho người cao tuổi',
      excerpt: 'Khám phá những bài tập đơn giản, an toàn giúp người cao tuổi duy trì sức khỏe và sự linh hoạt hàng ngày.',
      date: '15 Tháng 12, 2024',
      readTime: '5 phút đọc',
      image: '🏃‍♂️',
      category: 'Sức khỏe'
    },
    {
      id: 2,
      title: 'Dinh dưỡng cân bằng: Chìa khóa cho tuổi già khỏe mạnh',
      excerpt: 'Hướng dẫn chi tiết về chế độ ăn uống phù hợp, đảm bảo đủ chất dinh dưỡng cho người cao tuổi.',
      date: '12 Tháng 12, 2024',
      readTime: '7 phút đọc',
      image: '🥗',
      category: 'Dinh dưỡng'
    },
    {
      id: 3,
      title: 'Công nghệ AI trong chăm sóc sức khỏe: Tương lai đã đến',
      excerpt: 'Tìm hiểu cách AI đang cách mạng hóa việc chăm sóc sức khỏe người cao tuổi và mang lại những lợi ích thiết thực.',
      date: '10 Tháng 12, 2024',
      readTime: '6 phút đọc',
      image: '🤖',
      category: 'Công nghệ'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blog & Tin tức
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cập nhật những thông tin mới nhất về chăm sóc sức khỏe người cao tuổi và công nghệ AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-primary-100 text-primary-600 text-sm font-medium px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <div className="text-4xl">{blog.image}</div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 cursor-pointer transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{blog.date}</span>
                  <span>{blog.readTime}</span>
                </div>
                
                <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  Đọc thêm
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Xem tất cả bài viết
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
