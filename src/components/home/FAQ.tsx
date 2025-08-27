import React, { useState } from 'react';

// Component hiển thị câu hỏi thường gặp
const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Hệ thống có an toàn và bảo mật thông tin cá nhân không?',
      answer: 'Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân và dữ liệu sức khỏe của người dùng. Hệ thống sử dụng mã hóa end-to-end, tuân thủ các tiêu chuẩn bảo mật quốc tế như ISO 27001 và GDPR. Tất cả dữ liệu được lưu trữ trên server tại Việt Nam với hệ thống backup đa lớp.'
    },
    {
      question: 'Thiết bị giám sát có khó sử dụng không? Người cao tuổi có thể tự vận hành được không?',
      answer: 'Thiết bị được thiết kế đặc biệt thân thiện với người cao tuổi. Giao diện đơn giản, chữ to rõ ràng, và hầu hết các chức năng hoạt động tự động. Chúng tôi cũng cung cấp dịch vụ hướng dẫn sử dụng tại nhà và hỗ trợ kỹ thuật 24/7. Người thân có thể theo dõi và điều khiển từ xa qua ứng dụng di động.'
    },
    {
      question: 'Chi phí có bao gồm thiết bị và phí lắp đặt không?',
      answer: 'Gói dịch vụ đã bao gồm cho thuê thiết bị cơ bản (cảm biến, máy đo), phí lắp đặt tại nhà và hướng dẫn sử dụng ban đầu. Đối với các thiết bị cao cấp hoặc đặc biệt, sẽ có phí bổ sung. Chúng tôi cam kết minh bạch về giá cả và không có phí phát sinh ẩn. Khách hàng có thể hủy dịch vụ bất cứ lúc nào với thông báo trước 30 ngày.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-xl text-gray-600">
            Giải đáp những thắc mắc phổ biến về dịch vụ chăm sóc người cao tuổi của chúng tôi
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-500 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Không tìm thấy câu trả lời bạn cần? Hãy liên hệ với chúng tôi.
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Đặt câu hỏi
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
