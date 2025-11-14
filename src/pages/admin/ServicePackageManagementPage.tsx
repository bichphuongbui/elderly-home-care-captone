import React, { useState } from "react";

type PackageType = "basic" | "standard" | "premium";

interface ServicePackage {
  id: number;
  name: string;
  description: string;
  price: number;
  type: PackageType;
  duration: number; // giờ/ngày
  billingCycle: "month" | "day" | "hour";
  features: string[];
  usageLimit?: string;
  userCount: number;
  isPopular: boolean;
  isActive: boolean;
}

const mockPackages: ServicePackage[] = [
  {
    id: 1,
    name: "Gói Cơ Bản",
    description: "Dành cho nhu cầu chăm sóc hàng ngày",
    price: 500000,
    type: "basic",
    duration: 4,
    billingCycle: "day",
    features: [
      "Chăm sóc cơ bản hàng ngày",
      "Hỗ trợ vệ sinh cá nhân",
      "Chuẩn bị bữa ăn đơn giản",
      "Không bao gồm y tế chuyên sâu"
    ],
    usageLimit: "4 giờ/ngày",
    userCount: 89,
    isPopular: false,
    isActive: true
  },
  {
    id: 2,
    name: "Gói Tiêu Chuẩn",
    description: "Chăm sóc toàn diện cho người cao tuổi",
    price: 1200000,
    type: "standard",
    duration: 8,
    billingCycle: "day",
    features: [
      "Tất cả tính năng gói Cơ Bản",
      "Theo dõi sức khỏe định kỳ",
      "Tư vấn dinh dưỡng chuyên nghiệp",
      "Hỗ trợ vật lý trị liệu cơ bản"
    ],
    usageLimit: "8 giờ/ngày",
    userCount: 234,
    isPopular: true,
    isActive: true
  },
  {
    id: 3,
    name: "Gói Cao Cấp",
    description: "Chăm sóc cao cấp 24/7 với đội ngũ chuyên nghiệp",
    price: 2500000,
    type: "premium",
    duration: 24,
    billingCycle: "day",
    features: [
      "Tất cả tính năng gói Tiêu Chuẩn",
      "Chăm sóc y tế chuyên sâu 24/7",
      "Điều dưỡng viên chuyên nghiệp",
      "Hỗ trợ khẩn cấp ưu tiên"
    ],
    usageLimit: "24/7",
    userCount: 67,
    isPopular: false,
    isActive: true
  }
];

const ServicePackageManagementPage: React.FC = () => {
  const [packages, setPackages] = useState<ServicePackage[]>(mockPackages);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "basic" as PackageType,
    duration: "",
    billingCycle: "month" as "month" | "day" | "hour",
    features: [] as string[],
    notes: "",
    isPopular: false,
    isActive: true
  });

  const [featureChecks, setFeatureChecks] = useState({
    basicCare: false,
    personalHygiene: false,
    mealPrep: false,
    healthMonitoring: false,
    nutritionConsulting: false,
    physicalTherapy: false,
    medicalCare: false,
    professionalNurse: false,
    emergencySupport: false
  });

  const [customFeature, setCustomFeature] = useState("");
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);

  const stats = {
    total: packages.length,
    active: packages.filter(p => p.isActive).length,
    totalUsers: packages.reduce((sum, p) => sum + p.userCount, 0),
    revenue: packages.reduce((sum, p) => sum + p.price * p.userCount, 0)
  };

  const handleCreatePackage = () => {
    setEditingPackage(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      type: "basic",
      duration: "",
      billingCycle: "month",
      features: [],
      notes: "",
      isPopular: false,
      isActive: true
    });
    setFeatureChecks({
      basicCare: false,
      personalHygiene: false,
      mealPrep: false,
      healthMonitoring: false,
      nutritionConsulting: false,
      physicalTherapy: false,
      medicalCare: false,
      professionalNurse: false,
      emergencySupport: false
    });
    setCustomFeature("");
    setCustomFeatures([]);
    setShowModal(true);
  };

  const handleEditPackage = (pkg: ServicePackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      type: pkg.type,
      duration: pkg.duration.toString(),
      billingCycle: pkg.billingCycle,
      features: pkg.features,
      notes: "",
      isPopular: pkg.isPopular,
      isActive: pkg.isActive
    });
    setShowModal(true);
  };

  const handleSavePackage = () => {
    const selectedFeatures: string[] = [];
    if (featureChecks.basicCare) selectedFeatures.push("Chăm sóc cơ bản hàng ngày");
    if (featureChecks.personalHygiene) selectedFeatures.push("Hỗ trợ vệ sinh cá nhân");
    if (featureChecks.mealPrep) selectedFeatures.push("Chuẩn bị bữa ăn");
    if (featureChecks.healthMonitoring) selectedFeatures.push("Theo dõi sức khỏe định kỳ");
    if (featureChecks.nutritionConsulting) selectedFeatures.push("Tư vấn dinh dưỡng chuyên nghiệp");
    if (featureChecks.physicalTherapy) selectedFeatures.push("Hỗ trợ vật lý trị liệu");
    if (featureChecks.medicalCare) selectedFeatures.push("Chăm sóc y tế chuyên sâu");
    if (featureChecks.professionalNurse) selectedFeatures.push("Điều dưỡng viên chuyên nghiệp");
    if (featureChecks.emergencySupport) selectedFeatures.push("Hỗ trợ khẩn cấp ưu tiên");
    
    // Add custom features
    selectedFeatures.push(...customFeatures);

    if (editingPackage) {
      setPackages(packages.map(p => 
        p.id === editingPackage.id 
          ? { ...p, ...formData, price: parseFloat(formData.price), duration: parseInt(formData.duration), features: selectedFeatures }
          : p
      ));
    } else {
      const newPackage: ServicePackage = {
        id: Math.max(...packages.map(p => p.id)) + 1,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        duration: parseInt(formData.duration),
        billingCycle: formData.billingCycle,
        features: selectedFeatures,
        userCount: 0,
        isPopular: formData.isPopular,
        isActive: formData.isActive
      };
      setPackages([...packages, newPackage]);
    }
    setShowModal(false);
  };

  const getPackageColor = (type: PackageType) => {
    switch (type) {
      case "basic": return { bg: "#4F9CF9", gradient: "linear-gradient(135deg, #4F9CF9, #3B82F6)" };
      case "standard": return { bg: "#A855F7", gradient: "linear-gradient(135deg, #A855F7, #9333EA)" };
      case "premium": return { bg: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #D97706)" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý gói dịch vụ</h1>
              <p className="mt-1 text-sm text-gray-500">Tạo và quản lý các gói dịch vụ chăm sóc người cao tuổi</p>
            </div>
            <button
              onClick={handleCreatePackage}
              className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              style={{ backgroundColor: "#70C1F1" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Tạo gói mới
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng gói dịch vụ</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(112, 193, 241, 0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" style={{ color: "#70C1F1" }}>
                  <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                  <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                  <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(112, 193, 241, 0.15)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" style={{ color: "#70C1F1" }}>
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lượt đăng ký</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" style={{ color: "#3B82F6" }}>
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{(stats.revenue / 1000000).toFixed(0)}M</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" style={{ color: "#F59E0B" }}>
                  <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              onClick={() => handleEditPackage(pkg)}
              className="relative rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl cursor-pointer"
            >
              {/* Header with gradient */}
              <div className="relative p-6 text-white" style={{ background: getPackageColor(pkg.type).gradient }}>
                {pkg.isPopular && (
                  <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white border border-white/30">
                      PHỔ BIẾN
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold">{pkg.name}</h3>
                <p className="mt-2 text-sm text-white/90">{pkg.description}</p>
              </div>

              {/* Price */}
              <div className="border-b border-gray-100 bg-white p-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {(pkg.price / 1000).toFixed(0)}K
                  </span>
                  <span className="text-sm text-gray-500">VND</span>
                  <span className="text-sm text-gray-500">/ {pkg.billingCycle === "month" ? "tháng" : pkg.billingCycle === "day" ? "ngày" : "giờ"}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6 space-y-3">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#70C1F1" }}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                    </svg>
                    <span>{pkg.usageLimit || `${pkg.duration} ${pkg.billingCycle === "day" ? "giờ/ngày" : "ngày"}`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                    </svg>
                    <span>{pkg.userCount} người dùng</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {editingPackage ? "Chỉnh sửa gói dịch vụ" : "Tạo gói dịch vụ mới"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Tên gói */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên gói <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Gói Cơ Bản"
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ borderColor: formData.name ? "#70C1F1" : undefined }}
                />
              </div>

              {/* Mô tả ngắn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về gói dịch vụ..."
                  rows={3}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none transition-colors"
                  style={{ borderColor: formData.description ? "#70C1F1" : undefined }}
                />
              </div>

              {/* Giá và Loại gói */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="500000"
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: formData.price ? "#70C1F1" : undefined }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại gói <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PackageType })}
                    className="w-full rounded-lg border-2 px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: "#70C1F1" }}
                  >
                    <option value="basic">Cơ bản</option>
                    <option value="standard">Tiêu chuẩn</option>
                    <option value="premium">Cao cấp</option>
                  </select>
                </div>
              </div>

              {/* Thời gian và Chu kỳ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian (giờ/ngày) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="4"
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: formData.duration ? "#70C1F1" : undefined }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chu kỳ thanh toán
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as "month" | "day" | "hour" })}
                    className="w-full rounded-lg border-2 px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: "#70C1F1" }}
                  >
                    <option value="month">Tháng</option>
                    <option value="day">Ngày</option>
                    <option value="hour">Giờ</option>
                  </select>
                </div>
              </div>

              {/* Tính năng gói dịch vụ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tính năng gói dịch vụ
                </label>
                <div className="space-y-2.5 rounded-lg border-2 border-gray-100 bg-gray-50 p-4">
                  {[
                    { key: "basicCare", label: "Chăm sóc cơ bản hàng ngày" },
                    { key: "personalHygiene", label: "Hỗ trợ vệ sinh cá nhân" },
                    { key: "mealPrep", label: "Chuẩn bị bữa ăn" },
                    { key: "healthMonitoring", label: "Theo dõi sức khỏe định kỳ" },
                    { key: "nutritionConsulting", label: "Tư vấn dinh dưỡng chuyên nghiệp" },
                    { key: "physicalTherapy", label: "Hỗ trợ vật lý trị liệu" },
                    { key: "medicalCare", label: "Chăm sóc y tế chuyên sâu" },
                    { key: "professionalNurse", label: "Điều dưỡng viên chuyên nghiệp" },
                    { key: "emergencySupport", label: "Hỗ trợ khẩn cấp ưu tiên" }
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={featureChecks[feature.key as keyof typeof featureChecks]}
                        onChange={(e) => setFeatureChecks({ ...featureChecks, [feature.key]: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 transition-colors"
                        style={{ accentColor: "#70C1F1" }}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tính năng tùy chỉnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Thêm tính năng tùy chỉnh
                </label>
                <div className="space-y-3">
                  {customFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg border-2 bg-gray-50 px-3 py-2" style={{ borderColor: "#70C1F1" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" style={{ color: "#70C1F1" }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      <span className="flex-1 text-sm text-gray-700">{feature}</span>
                      <button
                        onClick={() => setCustomFeatures(customFeatures.filter((_, i) => i !== idx))}
                        className="rounded-lg p-1 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customFeature}
                      onChange={(e) => setCustomFeature(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customFeature.trim()) {
                          setCustomFeatures([...customFeatures, customFeature.trim()]);
                          setCustomFeature("");
                        }
                      }}
                      placeholder="Nhập tính năng mới..."
                      className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm focus:outline-none transition-colors"
                      style={{ borderColor: customFeature ? "#70C1F1" : undefined }}
                    />
                    <button
                      onClick={() => {
                        if (customFeature.trim()) {
                          setCustomFeatures([...customFeatures, customFeature.trim()]);
                          setCustomFeature("");
                        }
                      }}
                      className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                      style={{ backgroundColor: "#70C1F1" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Ghi chú thêm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú thêm
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Các điều khoản, chính sách, hoặc đặc biệt..."
                  rows={4}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none transition-colors"
                  style={{ borderColor: formData.notes ? "#70C1F1" : undefined }}
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                    style={{ accentColor: "#70C1F1" }}
                  />
                  <span className="text-sm font-medium" style={{ color: "#70C1F1" }}>
                    Đánh dấu là gói phổ biến
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                    style={{ accentColor: "#70C1F1" }}
                  />
                  <span className="text-sm font-medium" style={{ color: "#70C1F1" }}>
                    Kích hoạt gói dịch vụ
                  </span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t px-6 py-4 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border-2 border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSavePackage}
                className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                style={{ backgroundColor: "#70C1F1" }}
              >
                {editingPackage ? "Lưu thay đổi" : "Lưu gói dịch vụ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackageManagementPage;
