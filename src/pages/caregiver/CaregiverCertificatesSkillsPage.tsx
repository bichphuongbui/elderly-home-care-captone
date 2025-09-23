import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiAward, FiStar, FiX, FiSave, FiCalendar, FiUser, FiImage, FiUpload } from 'react-icons/fi';

interface Certificate {
  id: number;
  name: string;
  issueDate: string;
  organization: string;
  type: string;
  image?: string;
  status?: 'approved' | 'pending' | 'rejected';
  adminNote?: string;
}

interface Skill {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

interface CertificateFormData {
  name: string;
  issueDate: string;
  organization: string;
  type: string;
  image?: string;
}

interface SkillFormData {
  name: string;
  description: string;
  image?: string;
}

const CaregiverCertificatesSkillsPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [pendingNotice, setPendingNotice] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal states
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form states
  const [certificateForm, setCertificateForm] = useState<CertificateFormData>({
    name: '',
    issueDate: '',
    organization: '',
    type: '',
    image: ''
  });

  const [skillForm, setSkillForm] = useState<SkillFormData>({
    name: '',
    description: '',
    image: ''
  });

  // Image preview states
  const [certificateImagePreview, setCertificateImagePreview] = useState<string>('');
  const [skillImagePreview, setSkillImagePreview] = useState<string>('');

  // Mock data functions
  const getMockCertificates = (): Certificate[] => [
    
    {
      id: 2,
      name: 'Chứng chỉ sơ cứu cơ bản',
      issueDate: '2023-03-20',
      organization: 'Hội Chữ thập đỏ Việt Nam',
      type: 'Sơ cứu',
      status: 'approved'
    },
    {
      id: 3,
      name: 'Chứng chỉ dinh dưỡng người bệnh',
      issueDate: '2023-01-10',
      organization: 'Đại học Y Dược TP.HCM',
      type: 'Dinh dưỡng',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      status: 'approved'
    }
  ];

  const getMockSkills = (): Skill[] => [
    {
      id: 1,
      name: 'Chăm sóc người bệnh nằm liệt',
      description: 'Có kinh nghiệm 3 năm chăm sóc bệnh nhân tai biến, đột quỵ',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Vật lý trị liệu cơ bản',
      description: 'Hỗ trợ bài tập phục hồi chức năng cho người cao tuổi'
    },
    {
      id: 3,
      name: 'Tâm lý học người cao tuổi',
      description: 'Hiểu và ứng xử phù hợp với tâm lý người cao tuổi',
      image: 'https://images.unsplash.com/photo-1559757175-d1c5ee6ee04d?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Nấu ăn dinh dưỡng',
      description: 'Chuẩn bị bữa ăn phù hợp với người cao tuổi và người bệnh'
    }
  ];

  // Load user data on component mount and hydrate from user profile if available
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Base data
        let baseCertificates = getMockCertificates();
        setSkills(getMockSkills());

        // Try to read user profile certificateFiles for statuses
        const storedUserStr = localStorage.getItem('current_user');
        if (storedUserStr) {
          const user = JSON.parse(storedUserStr);
          setCurrentUser(user);
          const files = user?.profile?.professionalInfo?.certificateFiles || [];
          if (Array.isArray(files) && files.length > 0) {
            // Map status back onto base certificates by index best-effort
            const statuses = files.map((f: any) => ({
              url: f.url,
              status: (f.status || 'pending') as 'pending' | 'approved' | 'rejected',
              adminNote: f.adminNote || ''
            }));

            // Merge by url if match, else append minimal entries
            const merged: Certificate[] = [];
            baseCertificates.forEach(c => {
              const match = statuses.find((s: any) => c.image && s.url === c.image);
              merged.push({ ...c, status: match?.status || c.status || 'approved', adminNote: match?.adminNote });
            });
            // Add any extra uploaded files not in base list as unnamed pending entries
            statuses.forEach((s: any, idx: number) => {
              const exists = merged.some(m => m.image && m.image === s.url);
              if (!exists) {
                merged.push({
                  id: 100000 + idx,
                  name: 'Chứng chỉ bổ sung',
                  issueDate: new Date().toISOString().slice(0,10),
                  organization: '—',
                  type: 'Khác',
                  image: s.url,
                  status: s.status,
                  adminNote: s.adminNote
                });
              }
            });
            baseCertificates = merged;
          }
        }
        setCertificates(baseCertificates);
      } catch (error) {
        console.error('Error loading user data:', error);
        setCertificates(getMockCertificates());
        setSkills(getMockSkills());
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Image handling functions
  const handleImageUpload = (file: File, type: 'certificate' | 'skill') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      if (type === 'certificate') {
        setCertificateImagePreview(imageDataUrl);
        setCertificateForm(prev => ({ ...prev, image: imageDataUrl }));
      } else {
        setSkillImagePreview(imageDataUrl);
        setSkillForm(prev => ({ ...prev, image: imageDataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: 'certificate' | 'skill') => {
    if (type === 'certificate') {
      setCertificateImagePreview('');
      setCertificateForm(prev => ({ ...prev, image: '' }));
    } else {
      setSkillImagePreview('');
      setSkillForm(prev => ({ ...prev, image: '' }));
    }
  };

  // Certificate functions
  const openCertificateModal = (certificate?: Certificate) => {
    if (certificate) {
      setEditingCertificate(certificate);
      setCertificateForm({
        name: certificate.name,
        issueDate: certificate.issueDate,
        organization: certificate.organization,
        type: certificate.type,
        image: certificate.image || ''
      });
      setCertificateImagePreview(certificate.image || '');
    } else {
      setEditingCertificate(null);
      setCertificateForm({
        name: '',
        issueDate: '',
        organization: '',
        type: '',
        image: ''
      });
      setCertificateImagePreview('');
    }
    setShowCertificateModal(true);
  };

  const closeCertificateModal = () => {
    setShowCertificateModal(false);
    setEditingCertificate(null);
    setCertificateForm({ name: '', issueDate: '', organization: '', type: '', image: '' });
    setCertificateImagePreview('');
  };

  const saveCertificate = async () => {
    // Require image for certificates
    if (!certificateForm.image) {
      alert('Vui lòng tải ảnh chứng chỉ trước khi lưu.');
      return;
    }
    setLoading(true);
    try {
      if (editingCertificate) {
        // Update existing certificate
        const updatedCertificates = certificates.map(cert =>
          cert.id === editingCertificate.id
            ? { ...cert, ...certificateForm, status: 'pending' as const }
            : cert
        );
        setCertificates(updatedCertificates);
      } else {
        // Add new certificate
        const newCertificate: Certificate = {
          id: Date.now(),
          ...certificateForm,
          status: 'pending'
        };
        setCertificates([...certificates, newCertificate]);
      }
      // Notify admin by updating user profile lightweight record
      try {
        const storedUserStr = localStorage.getItem('current_user');
        if (storedUserStr) {
          const user = JSON.parse(storedUserStr);
          const files = Array.isArray(user?.profile?.professionalInfo?.certificateFiles)
            ? user.profile.professionalInfo.certificateFiles
            : [];
          const pendingRecord = {
            id: `cert_${Date.now()}`,
            url: certificateForm.image,
            status: 'pending',
            uploadedAt: new Date().toISOString(),
          };
          const nextUser = {
            ...user,
            adminFlags: { ...(user.adminFlags || {}), certificateReviewPending: true },
            profile: {
              ...(user.profile || {}),
              professionalInfo: {
                ...((user.profile && user.profile.professionalInfo) || {}),
                certificateFiles: [...files, pendingRecord]
              }
            }
          };
          localStorage.setItem('current_user', JSON.stringify(nextUser));
          setCurrentUser(nextUser);
          setPendingNotice('Chứng chỉ của bạn đang chờ admin duyệt trước khi hiển thị.');
          // Attempt PUT to mock API (best-effort)
          try {
            await fetch(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${user.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(nextUser)
            });
          } catch {}
        }
      } catch {}
      closeCertificateModal();
    } catch (error) {
      console.error('Error saving certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa chứng chỉ này?')) {
      setLoading(true);
      try {
        const updatedCertificates = certificates.filter(cert => cert.id !== id);
        setCertificates(updatedCertificates);
      } catch (error) {
        console.error('Error deleting certificate:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Skill functions
  const openSkillModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({
        name: skill.name,
        description: skill.description || '',
        image: skill.image || ''
      });
      setSkillImagePreview(skill.image || '');
    } else {
      setEditingSkill(null);
      setSkillForm({
        name: '',
        description: '',
        image: ''
      });
      setSkillImagePreview('');
    }
    setShowSkillModal(true);
  };

  const closeSkillModal = () => {
    setShowSkillModal(false);
    setEditingSkill(null);
    setSkillForm({ name: '', description: '', image: '' });
    setSkillImagePreview('');
  };

  const saveSkill = async () => {
    setLoading(true);
    try {
      if (editingSkill) {
        // Update existing skill
        const updatedSkills = skills.map(skill =>
          skill.id === editingSkill.id
            ? { ...skill, ...skillForm }
            : skill
        );
        setSkills(updatedSkills);
      } else {
        // Add new skill
        const newSkill: Skill = {
          id: Date.now(),
          ...skillForm
        };
        setSkills([...skills, newSkill]);
      }
      closeSkillModal();
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa kỹ năng này?')) {
      setLoading(true);
      try {
        const updatedSkills = skills.filter(skill => skill.id !== id);
        setSkills(updatedSkills);
      } catch (error) {
        console.error('Error deleting skill:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header - align title style with other pages */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Chứng chỉ & Kỹ năng
          </h1>
          <p className="text-gray-600">Quản lý chứng chỉ đã được duyệt. Chứng chỉ mới sẽ chờ admin xét duyệt.</p>
          {pendingNotice && (
            <div className="mt-3 p-3 rounded border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
              {pendingNotice}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificates Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FiAward className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Chứng chỉ</h2>
                  <p className="text-sm text-gray-500">{certificates.length} chứng chỉ</p>
                </div>
              </div>
              <button
                onClick={() => openCertificateModal()}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2 text-sm"
                disabled={loading}
              >
                <FiPlus className="h-4 w-4" />
                <span>Thêm</span>
              </button>
            </div>

            {certificates.filter(c => c.status !== 'rejected').length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiAward className="h-8 w-8 text-teal-500" />
                </div>
                <p className="text-gray-500 text-sm mb-4">Chưa có chứng chỉ nào</p>
                <button
                  onClick={() => openCertificateModal()}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  Thêm chứng chỉ đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.filter(c => c.status !== 'rejected').map((certificate) => (
                  <div
                    key={certificate.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Certificate Image */}
                      <div className="flex-shrink-0">
                        {certificate.image ? (
                          <img
                            src={certificate.image}
                            alt={certificate.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <FiImage className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Certificate Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {certificate.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Ngày cấp: {formatDate(certificate.issueDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <FiUser className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Tổ chức: {certificate.organization}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="inline-block bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded">
                            {certificate.type}
                          </span>
                          {certificate.status === 'pending' && (
                            <span className="inline-block bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded">Đang chờ duyệt</span>
                          )}
                        </div>
                        {certificate.status === 'rejected' && certificate.adminNote && (
                          <div className="mt-2 text-xs text-red-600">Bị từ chối: {certificate.adminNote}</div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openCertificateModal(certificate)}
                          className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                          disabled={loading}
                          title="Chỉnh sửa"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteCertificate(certificate.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          disabled={loading}
                          title="Xóa"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FiStar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Kỹ năng</h2>
                  <p className="text-sm text-gray-500">{skills.length} kỹ năng</p>
                </div>
              </div>
              <button
                onClick={() => openSkillModal()}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 text-sm"
                disabled={loading}
              >
                <FiPlus className="h-4 w-4" />
                <span>Thêm</span>
              </button>
            </div>

            {skills.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiStar className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-gray-500 text-sm mb-4">Chưa có kỹ năng nào</p>
                <button
                  onClick={() => openSkillModal()}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Thêm kỹ năng đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Skill Image */}
                      <div className="flex-shrink-0">
                        {skill.image ? (
                          <img
                            src={skill.image}
                            alt={skill.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <FiImage className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Skill Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {skill.name}
                        </h3>
                        {skill.description && (
                          <p className="text-sm text-gray-600 leading-relaxed mb-2">
                            {skill.description}
                          </p>
                        )}
                        <div className="mt-2">
                          <span className="inline-block bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded">
                            Kỹ năng chuyên môn
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openSkillModal(skill)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          disabled={loading}
                          title="Chỉnh sửa"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          disabled={loading}
                          title="Xóa"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCertificate ? 'Sửa chứng chỉ' : 'Thêm chứng chỉ mới'}
                </h3>
                <button
                  onClick={closeCertificateModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên chứng chỉ *
                  </label>
                  <input
                    type="text"
                    value={certificateForm.name}
                    onChange={(e) => setCertificateForm({ ...certificateForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ví dụ: Chứng chỉ chăm sóc người cao tuổi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày cấp *
                  </label>
                  <input
                    type="date"
                    value={certificateForm.issueDate}
                    onChange={(e) => setCertificateForm({ ...certificateForm, issueDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tổ chức cấp chứng chỉ *
                  </label>
                  <input
                    type="text"
                    value={certificateForm.organization}
                    onChange={(e) => setCertificateForm({ ...certificateForm, organization: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ví dụ: Viện Đào tạo Y tế TP.HCM"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại chứng chỉ *
                  </label>
                  <select
                    value={certificateForm.type}
                    onChange={(e) => setCertificateForm({ ...certificateForm, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn loại chứng chỉ</option>
                    <option value="Chăm sóc sức khỏe">Chăm sóc sức khỏe</option>
                    <option value="Sơ cứu">Sơ cứu</option>
                    <option value="Dinh dưỡng">Dinh dưỡng</option>
                    <option value="Vật lý trị liệu">Vật lý trị liệu</option>
                    <option value="Tâm lý học">Tâm lý học</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh chứng chỉ *
                  </label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {certificateImagePreview && (
                      <div className="relative">
                        <img
                          src={certificateImagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage('certificate')}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Nhấp để tải ảnh</span> hoặc kéo thả
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                alert('Kích thước file không được vượt quá 5MB');
                                return;
                              }
                              handleImageUpload(file, 'certificate');
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={saveCertificate}
                  disabled={loading || !certificateForm.name || !certificateForm.issueDate || !certificateForm.organization || !certificateForm.type || !certificateForm.image}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <FiSave className="h-4 w-4" />
                  <span>{loading ? 'Đang lưu...' : 'Lưu'}</span>
                </button>
                <button
                  onClick={closeCertificateModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingSkill ? 'Sửa kỹ năng' : 'Thêm kỹ năng mới'}
                </h3>
                <button
                  onClick={closeSkillModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên kỹ năng *
                  </label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ví dụ: Chăm sóc người bệnh nằm liệt"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả (tùy chọn)
                  </label>
                  <textarea
                    value={skillForm.description}
                    onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả chi tiết về kỹ năng, kinh nghiệm của bạn..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh minh họa (tùy chọn)
                  </label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {skillImagePreview && (
                      <div className="relative">
                        <img
                          src={skillImagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage('skill')}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Nhấp để tải ảnh</span> hoặc kéo thả
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                alert('Kích thước file không được vượt quá 5MB');
                                return;
                              }
                              handleImageUpload(file, 'skill');
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={saveSkill}
                  disabled={loading || !skillForm.name}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <FiSave className="h-4 w-4" />
                  <span>{loading ? 'Đang lưu...' : 'Lưu'}</span>
                </button>
                <button
                  onClick={closeSkillModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverCertificatesSkillsPage;