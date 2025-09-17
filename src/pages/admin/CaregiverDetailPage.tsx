import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface CaregiverProfile {
  id: string;
  fullName: string;
  email: string;
  status: string;
  role: string;
  rejectionReason?: string;
  profile?: {
    personalInfo?: {
      dateOfBirth?: string;
      gender?: string;
      idNumber?: string;
      permanentAddress?: string;
      temporaryAddress?: string;
      phone?: string;
      idCardFront?: string;
      idCardBack?: string;
    };
    professionalInfo?: {
      yearsOfExperience?: number;
      previousWorkplace?: string;
      skills?: string;
      languages?: string[];
      certificates?: string;
      certificateFiles?: string[];
    };
    legalDocuments?: {
      criminalRecord?: string;
      healthCertificate?: string;
      vaccinationCertificate?: string;
      workPermit?: string;
    };
    references?: {
      referenceName?: string;
      referencePhone?: string;
      referenceRelation?: string;
    };
    commitments?: {
      ethicalCommitment?: boolean;
      termsAgreement?: boolean;
    };
    additionalProfile?: {
      profilePhoto?: string;
      introductionVideo?: string;
      specialAbilities?: string;
    };
  };
}

const CaregiverDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState<CaregiverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchCaregiver = async () => {
      if (!id) {
        setError('ID caregiver không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${id}`);
        setCaregiver(response.data);
      } catch (error) {
        console.error('Lỗi khi tải thông tin caregiver:', error);
        setError('Không thể tải thông tin caregiver');
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiver();
  }, [id]);

  const handleApprove = async () => {
    if (!caregiver) return;

    setIsUpdating(true);
    try {
      console.log('Sending approve request for caregiver:', caregiver.id);
      
      // Thử PUT request thay vì PATCH
      const response = await axios.put(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${caregiver.id}`, {
        ...caregiver, // Giữ nguyên tất cả dữ liệu hiện tại
        status: 'approved',
        rejectionReason: null // Xóa lý do từ chối nếu có
      });
      
      console.log('Approve response:', response.data);
      alert('Đã phê duyệt caregiver thành công!');
      navigate('/admin/caregiver-approval');
    } catch (error: any) {
      console.error('Lỗi khi phê duyệt:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Thử với PATCH nếu PUT không work
      if (error.response?.status === 405 || error.response?.status === 404) {
        try {
          console.log('Trying PATCH request...');
          const patchResponse = await axios.patch(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${caregiver.id}`, {
            status: 'approved',
            rejectionReason: null
          });
          console.log('PATCH response:', patchResponse.data);
          alert('Đã phê duyệt caregiver thành công!');
          navigate('/admin/caregiver-approval');
          return;
        } catch (patchError: any) {
          console.error('PATCH also failed:', patchError);
          alert(`Có lỗi xảy ra khi phê duyệt caregiver: ${patchError.response?.data?.message || patchError.message}`);
        }
      } else {
        alert(`Có lỗi xảy ra khi phê duyệt caregiver: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!caregiver) return;
    
    // Kiểm tra rejection reason
    if (!rejectionReason || rejectionReason.trim() === '') {
      alert('Vui lòng nhập lý do từ chối.');
      return;
    }

    setIsUpdating(true);
    try {
      console.log('Sending reject request for caregiver:', caregiver.id);
      console.log('Rejection reason:', rejectionReason.trim());
      
      // Thử PUT request thay vì PATCH (MockAPI có thể không hỗ trợ PATCH)
      const response = await axios.put(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${caregiver.id}`, {
        ...caregiver, // Giữ nguyên tất cả dữ liệu hiện tại
        status: 'rejected',
        rejectionReason: rejectionReason.trim()
      });
      
      console.log('Reject response:', response.data);
      alert('Đã từ chối caregiver thành công!');
      
      // Trigger refresh user data để caregiver thấy status mới
      try {
        window.dispatchEvent(new Event('auth:changed'));
      } catch {}
      
      navigate('/admin/caregiver-approval');
    } catch (error: any) {
      console.error('Lỗi khi từ chối:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);
      
      // Thử với PATCH nếu PUT không work
      if (error.response?.status === 405 || error.response?.status === 404) {
        try {
          console.log('Trying PATCH request...');
          const patchResponse = await axios.patch(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${caregiver.id}`, {
            status: 'rejected',
            rejectionReason: rejectionReason.trim()
          });
          console.log('PATCH response:', patchResponse.data);
          alert('Đã từ chối caregiver thành công!');
          
          // Trigger refresh user data để caregiver thấy status mới
          try {
            window.dispatchEvent(new Event('auth:changed'));
          } catch {}
          
          navigate('/admin/caregiver-approval');
          return;
        } catch (patchError: any) {
          console.error('PATCH also failed:', patchError);
          alert(`Có lỗi xảy ra khi từ chối caregiver: ${patchError.response?.data?.message || patchError.message}`);
        }
      } else {
        alert(`Có lỗi xảy ra khi từ chối caregiver: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Chờ duyệt</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Đã duyệt</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Bị từ chối</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">Không xác định</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin caregiver...</p>
        </div>
      </div>
    );
  }

  if (error || !caregiver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy caregiver</h2>
          <p className="text-gray-600 mb-6">{error || 'Caregiver không tồn tại'}</p>
          <button
            onClick={() => navigate('/admin/caregiver-approval')}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{caregiver.fullName}</h1>
              <p className="text-gray-600 mt-1">{caregiver.email}</p>
              <div className="mt-2">{getStatusBadge(caregiver.status)}</div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/admin/caregiver-approval')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Quay lại
              </button>
              {caregiver.status === 'pending' && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isUpdating}
                    className={`px-6 py-2 rounded-md text-white font-medium ${
                      isUpdating ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    ✔ Phê duyệt
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={isUpdating}
                    className={`px-6 py-2 rounded-md text-white font-medium ${
                      isUpdating ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    ✖ Từ chối
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rejection Reason Form */}
        {showRejectForm && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lý do từ chối</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Nhập lý do từ chối hồ sơ..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleReject}
                disabled={isUpdating}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  isUpdating ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Xác nhận từ chối
              </button>
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin cá nhân</h2>
            {caregiver.profile?.personalInfo ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Ngày sinh</label>
                    <p className="text-gray-900">{caregiver.profile.personalInfo.dateOfBirth || 'Chưa cung cấp'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Giới tính</label>
                    <p className="text-gray-900">{caregiver.profile.personalInfo.gender || 'Chưa cung cấp'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Số CMND/CCCD</label>
                  <p className="text-gray-900">{caregiver.profile.personalInfo.idNumber || 'Chưa cung cấp'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                  <p className="text-gray-900">{caregiver.profile.personalInfo.phone || 'Chưa cung cấp'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Địa chỉ thường trú</label>
                  <p className="text-gray-900">{caregiver.profile.personalInfo.permanentAddress || 'Chưa cung cấp'}</p>
                </div>
                {caregiver.profile.personalInfo.temporaryAddress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Địa chỉ tạm trú</label>
                    <p className="text-gray-900">{caregiver.profile.personalInfo.temporaryAddress}</p>
                  </div>
                )}
                
                {/* ID Card Images */}
                {(caregiver.profile.personalInfo.idCardFront || caregiver.profile.personalInfo.idCardBack) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Ảnh CCCD</label>
                    <div className="grid grid-cols-2 gap-4">
                      {caregiver.profile.personalInfo.idCardFront && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Mặt trước</p>
                          <img
                            src={caregiver.profile.personalInfo.idCardFront}
                            alt="CCCD mặt trước"
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                      {caregiver.profile.personalInfo.idCardBack && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Mặt sau</p>
                          <img
                            src={caregiver.profile.personalInfo.idCardBack}
                            alt="CCCD mặt sau"
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Chưa cung cấp thông tin cá nhân</p>
            )}
          </div>

          {/* Professional Information */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin nghề nghiệp</h2>
            {caregiver.profile?.professionalInfo ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Số năm kinh nghiệm</label>
                    <p className="text-gray-900">{caregiver.profile.professionalInfo.yearsOfExperience || 0} năm</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nơi từng làm việc</label>
                    <p className="text-gray-900">{caregiver.profile.professionalInfo.previousWorkplace || 'Chưa cung cấp'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Kỹ năng chuyên môn</label>
                  <p className="text-gray-900">{caregiver.profile.professionalInfo.skills || 'Chưa cung cấp'}</p>
                </div>
                {caregiver.profile.professionalInfo.languages && caregiver.profile.professionalInfo.languages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Khả năng ngôn ngữ</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {caregiver.profile.professionalInfo.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500">Bằng cấp, chứng chỉ</label>
                  <p className="text-gray-900">{caregiver.profile.professionalInfo.certificates || 'Chưa cung cấp'}</p>
                </div>
                
                {/* Certificate Files */}
                {caregiver.profile.professionalInfo.certificateFiles && caregiver.profile.professionalInfo.certificateFiles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">File chứng chỉ</label>
                    <div className="grid grid-cols-2 gap-2">
                      {caregiver.profile.professionalInfo.certificateFiles.map((file, index) => (
                        <img
                          key={index}
                          src={file}
                          alt={`Certificate ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Chưa cung cấp thông tin nghề nghiệp</p>
            )}
          </div>

          {/* Legal Documents */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Giấy tờ pháp lý & sức khỏe</h2>
            {caregiver.profile?.legalDocuments ? (
              <div className="space-y-4">
                {caregiver.profile.legalDocuments.criminalRecord && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Lý lịch tư pháp</label>
                    <img
                      src={caregiver.profile.legalDocuments.criminalRecord}
                      alt="Lý lịch tư pháp"
                      className="w-full h-32 object-cover rounded border mt-1"
                    />
                  </div>
                )}
                {caregiver.profile.legalDocuments.healthCertificate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Giấy khám sức khỏe</label>
                    <img
                      src={caregiver.profile.legalDocuments.healthCertificate}
                      alt="Giấy khám sức khỏe"
                      className="w-full h-32 object-cover rounded border mt-1"
                    />
                  </div>
                )}
                {caregiver.profile.legalDocuments.vaccinationCertificate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Chứng nhận tiêm phòng</label>
                    <img
                      src={caregiver.profile.legalDocuments.vaccinationCertificate}
                      alt="Chứng nhận tiêm phòng"
                      className="w-full h-32 object-cover rounded border mt-1"
                    />
                  </div>
                )}
                {caregiver.profile.legalDocuments.workPermit && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Giấy phép lao động</label>
                    <img
                      src={caregiver.profile.legalDocuments.workPermit}
                      alt="Giấy phép lao động"
                      className="w-full h-32 object-cover rounded border mt-1"
                    />
                  </div>
                )}
                {!caregiver.profile.legalDocuments.criminalRecord && 
                 !caregiver.profile.legalDocuments.healthCertificate && 
                 !caregiver.profile.legalDocuments.vaccinationCertificate && 
                 !caregiver.profile.legalDocuments.workPermit && (
                  <p className="text-gray-500">Chưa cung cấp giấy tờ pháp lý</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Chưa cung cấp giấy tờ pháp lý</p>
            )}
          </div>

          {/* References & Additional Info */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tham chiếu & Thông tin bổ sung</h2>
            <div className="space-y-4">
              {/* References */}
              {caregiver.profile?.references && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Người tham chiếu</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Tên</label>
                      <p className="text-gray-900">{caregiver.profile.references.referenceName || 'Chưa cung cấp'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                      <p className="text-gray-900">{caregiver.profile.references.referencePhone || 'Chưa cung cấp'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Quan hệ</label>
                      <p className="text-gray-900">{caregiver.profile.references.referenceRelation || 'Chưa cung cấp'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Commitments */}
              {caregiver.profile?.commitments && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Cam kết</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className={`w-4 h-4 rounded mr-2 ${caregiver.profile.commitments.ethicalCommitment ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-sm text-gray-700">Cam kết đạo đức nghề nghiệp</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`w-4 h-4 rounded mr-2 ${caregiver.profile.commitments.termsAgreement ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-sm text-gray-700">Đồng ý điều khoản hệ thống</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Profile */}
              {caregiver.profile?.additionalProfile && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Hồ sơ bổ sung</h3>
                  <div className="space-y-3">
                    {caregiver.profile.additionalProfile.profilePhoto && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Ảnh đại diện</label>
                        <img
                          src={caregiver.profile.additionalProfile.profilePhoto}
                          alt="Ảnh đại diện"
                          className="w-24 h-24 object-cover rounded-full border mt-1"
                        />
                      </div>
                    )}
                    {caregiver.profile.additionalProfile.introductionVideo && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Video giới thiệu</label>
                        <a
                          href={caregiver.profile.additionalProfile.introductionVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Xem video
                        </a>
                      </div>
                    )}
                    {caregiver.profile.additionalProfile.specialAbilities && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Khả năng đặc biệt</label>
                        <p className="text-gray-900">{caregiver.profile.additionalProfile.specialAbilities}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rejection Reason Display */}
        {caregiver.status === 'rejected' && caregiver.rejectionReason && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Lý do từ chối</h3>
            <p className="text-red-800">{caregiver.rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverDetailPage;
