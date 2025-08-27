import React from 'react';

// Component hiển thị các gói dịch vụ và giá cả
const Pricing: React.FC = () => {
  const pricingPlans = [
    {
      name: 'Gói Cơ Bản',
      price: '299.000',
      period: 'tháng',
      description: 'Phù hợp cho gia đình có nhu cầu giám sát cơ bản',
      features: [
        'Giám sát sức khỏe cơ bản',
        'Cảnh báo khẩn cấp',
        'Báo cáo hàng tuần',
        'Hỗ trợ qua điện thoại',
        'Ứng dụng di động'
      ],
      popular: false,
      buttonText: 'Chọn gói này'
    },
    {
      name: 'Gói Tiêu Chuẩn',
      price: '599.000',
      period: 'tháng',
      description: 'Lựa chọn phổ biến với đầy đủ tính năng thiết yếu',
      features: [
        'Tất cả tính năng gói Cơ Bản',
        'Giám sát 24/7',
        'Quản lý thuốc thông minh',
        'Báo cáo chi tiết hàng ngày',
        'Tư vấn y tế trực tuyến',
        'Kết nối với 5 thành viên gia đình'
      ],
      popular: true,
      buttonText: 'Bắt đầu ngay'
    },
    {
      name: 'Gói Cao Cấp',
      price: '999.000',
      period: 'tháng',
      description: 'Giải pháp toàn diện cho chăm sóc chuyên sâu',
      features: [
        'Tất cả tính năng gói Tiêu Chuẩn',
        'AI phân tích tiên tiến',
        'Chăm sóc cá nhân hóa',
        'Hỗ trợ y tế tại nhà',
        'Báo cáo y tế chuyên sâu',
        'Ưu tiên hỗ trợ 24/7',
        'Kết nối không giới hạn thành viên'
      ],
      popular: false,
      buttonText: 'Liên hệ tư vấn'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bảng giá dịch vụ
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lựa chọn gói dịch vụ phù hợp với nhu cầu và ngân sách của gia đình bạn
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-8 ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Phổ biến nhất
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">đ/{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                plan.popular 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Cần tư vấn thêm? Liên hệ với chúng tôi để được hỗ trợ tốt nhất.
          </p>
          <button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Liên hệ tư vấn miễn phí
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
