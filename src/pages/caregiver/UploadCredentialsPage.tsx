import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Footer from '../../components/layout/Footer';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  status?: string;
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

const UploadCredentialsPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('personal');
  const navigate = useNavigate();

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    dateOfBirth: '',
    gender: '',
    idNumber: '',
    permanentAddress: '',
    temporaryAddress: '',
    phone: '',
    idCardFront: '',
    idCardBack: '',
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    yearsOfExperience: 0,
    previousWorkplace: '',
    skills: '',
    languages: [] as string[],
    certificates: '',
    certificateFiles: [] as string[],
  });

  const [legalDocuments, setLegalDocuments] = useState({
    criminalRecord: '',
    healthCertificate: '',
    vaccinationCertificate: '',
    workPermit: '',
  });

  const [references, setReferences] = useState({
    referenceName: '',
    referencePhone: '',
    referenceRelation: '',
  });

  const [commitments, setCommitments] = useState({
    ethicalCommitment: false,
    termsAgreement: false,
  });

  const [additionalProfile, setAdditionalProfile] = useState({
    profilePhoto: '',
    introductionVideo: '',
    specialAbilities: '',
  });

  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('');
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [certificatePreviews, setCertificatePreviews] = useState<string[]>([]);
  const [idCardFrontFile, setIdCardFrontFile] = useState<File | null>(null);
  const [idCardFrontPreview, setIdCardFrontPreview] = useState<string>('');
  const [idCardBackFile, setIdCardBackFile] = useState<File | null>(null);
  const [idCardBackPreview, setIdCardBackPreview] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${userId}`);
        setUserData(response.data);
        
        // Populate form with existing data
        if (response.data.profile) {
          setPersonalInfo(response.data.profile.personalInfo || personalInfo);
          setProfessionalInfo(response.data.profile.professionalInfo || professionalInfo);
          setLegalDocuments(response.data.profile.legalDocuments || legalDocuments);
          setReferences(response.data.profile.references || references);
          setCommitments(response.data.profile.commitments || commitments);
          setAdditionalProfile(response.data.profile.additionalProfile || additionalProfile);
          
          // Load existing certificate files if any
          if (response.data.profile.professionalInfo?.certificateFiles) {
            setProfessionalInfo(prev => ({
              ...prev,
              certificateFiles: response.data.profile.professionalInfo.certificateFiles
            }));
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
        alert('Có lỗi xảy ra khi tải thông tin người dùng.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!personalInfo.dateOfBirth || !personalInfo.gender || !personalInfo.idNumber || 
        !personalInfo.permanentAddress || !personalInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin cá nhân bắt buộc.');
      setActiveSection('personal');
      return;
    }

    // Validate ID number format (Vietnamese ID format)
    const idNumberRegex = /^[0-9]{9,12}$/;
    if (!idNumberRegex.test(personalInfo.idNumber)) {
      alert('Số CMND/CCCD/Hộ chiếu phải có từ 9-12 chữ số.');
      setActiveSection('personal');
      return;
    }

    // Validate phone number format (Vietnamese phone format)
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$|^(\+84[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(personalInfo.phone)) {
      alert('Số điện thoại không đúng định dạng Việt Nam. Ví dụ: 0123456789 hoặc +84123456789');
      setActiveSection('personal');
      return;
    }

    // Validate date of birth (must be at least 18 years old)
    const today = new Date();
    const birthDate = new Date(personalInfo.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      alert('Bạn phải ít nhất 18 tuổi để đăng ký làm caregiver.');
      setActiveSection('personal');
      return;
    }

    if (age > 65) {
      alert('Độ tuổi không phù hợp để làm caregiver (quá 65 tuổi).');
      setActiveSection('personal');
      return;
    }

    if (!personalInfo.idCardFront && !idCardFrontFile) {
      alert('Vui lòng upload ảnh CCCD mặt trước.');
      setActiveSection('personal');
      return;
    }

    if (!personalInfo.idCardBack && !idCardBackFile) {
      alert('Vui lòng upload ảnh CCCD mặt sau.');
      setActiveSection('personal');
      return;
    }

    // Validate professional information
    if (!professionalInfo.yearsOfExperience || professionalInfo.yearsOfExperience < 0) {
      alert('Vui lòng nhập số năm kinh nghiệm hợp lệ.');
      setActiveSection('professional');
      return;
    }

    if (professionalInfo.yearsOfExperience > 50) {
      alert('Số năm kinh nghiệm không hợp lý (quá 50 năm).');
      setActiveSection('professional');
      return;
    }

    if (!professionalInfo.skills || professionalInfo.skills.trim().length < 10) {
      alert('Vui lòng mô tả kỹ năng chuyên môn ít nhất 10 ký tự.');
      setActiveSection('professional');
      return;
    }

    // Validate reference information
    if (references.referenceName && (!references.referencePhone || !references.referenceRelation)) {
      alert('Nếu có người tham chiếu, vui lòng điền đầy đủ thông tin liên lạc.');
      setActiveSection('references');
      return;
    }

    if (references.referencePhone) {
      const refPhoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$|^(\+84[3|5|7|8|9])[0-9]{8}$/;
      if (!refPhoneRegex.test(references.referencePhone)) {
        alert('Số điện thoại người tham chiếu không đúng định dạng Việt Nam.');
        setActiveSection('references');
        return;
      }
    }

    // Validate commitments
    if (!commitments.termsAgreement) {
      alert('Vui lòng đồng ý với điều khoản hệ thống.');
      setActiveSection('references');
      return;
    }

    // Validate video URL if provided
    if (additionalProfile.introductionVideo) {
      const urlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/;
      if (!urlRegex.test(additionalProfile.introductionVideo)) {
        alert('Link video không hợp lệ. Vui lòng nhập link YouTube, Vimeo hoặc Dailymotion.');
        setActiveSection('additional');
        return;
      }
    }

    // Prepare profile photo data
    let profilePhotoData: string | undefined = undefined;
    if (profilePhotoFile) {
      profilePhotoData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(profilePhotoFile);
      });
    }

    // Prepare ID card images data
    let idCardFrontData: string | undefined = undefined;
    if (idCardFrontFile) {
      idCardFrontData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(idCardFrontFile);
      });
    }

    let idCardBackData: string | undefined = undefined;
    if (idCardBackFile) {
      idCardBackData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(idCardBackFile);
      });
    }

    // Prepare certificate files data
    const certificateData: string[] = [];
    for (const file of certificateFiles) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      certificateData.push(dataUrl);
    }

    setIsSubmitting(true);
    try {
      const updatedProfile = {
        personalInfo: {
          ...personalInfo,
          idCardFront: idCardFrontData || personalInfo.idCardFront,
          idCardBack: idCardBackData || personalInfo.idCardBack
        },
        professionalInfo: {
          ...professionalInfo,
          certificateFiles: certificateData.length > 0 ? [...professionalInfo.certificateFiles, ...certificateData] : professionalInfo.certificateFiles
        },
        legalDocuments,
        references,
        commitments,
        additionalProfile: {
          ...additionalProfile,
          profilePhoto: profilePhotoData || additionalProfile.profilePhoto
        }
      };

      await axios.put(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${userId}`, {
        ...userData,
        profile: updatedProfile,
        status: 'pending',
        role: 'Caregiver'
      });
      
      alert('Đã hoàn tất hồ sơ đăng ký. Vui lòng chờ quản trị viên xét duyệt.');
      navigate('/care-giver/pending-approval');
    } catch (error) {
      console.error('Cập nhật hồ sơ thất bại:', error);
      alert('Có lỗi xảy ra khi gửi hồ sơ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const languageOptions = ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Trung', 'Tiếng Nhật', 'Tiếng Hàn', 'Tiếng Pháp', 'Tiếng Đức'];

  const handleLanguageChange = (language: string) => {
    setProfessionalInfo(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn (tối đa 5MB).`);
        return false;
      }
      return true;
    });

    setCertificateFiles(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      setCertificatePreviews(prev => [...prev, previewUrl]);
    });
  };

  const removeCertificate = (index: number) => {
    setCertificateFiles(prev => prev.filter((_, i) => i !== index));
    setCertificatePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateIdNumber = (value: string) => {
    const idNumberRegex = /^[0-9]{9,12}$/;
    if (value && !idNumberRegex.test(value)) {
      setValidationErrors(prev => ({ ...prev, idNumber: 'Số CMND/CCCD phải có từ 9-12 chữ số' }));
    } else {
      setValidationErrors(prev => ({ ...prev, idNumber: '' }));
    }
  };

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$|^(\+84[3|5|7|8|9])[0-9]{8}$/;
    if (value && !phoneRegex.test(value)) {
      setValidationErrors(prev => ({ ...prev, phone: 'Số điện thoại không đúng định dạng Việt Nam' }));
    } else {
      setValidationErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateReferencePhone = (value: string) => {
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$|^(\+84[3|5|7|8|9])[0-9]{8}$/;
    if (value && !phoneRegex.test(value)) {
      setValidationErrors(prev => ({ ...prev, referencePhone: 'Số điện thoại không đúng định dạng Việt Nam' }));
    } else {
      setValidationErrors(prev => ({ ...prev, referencePhone: '' }));
    }
  };

  const validateSkills = (value: string) => {
    if (value && value.trim().length < 10) {
      setValidationErrors(prev => ({ ...prev, skills: 'Kỹ năng chuyên môn phải ít nhất 10 ký tự' }));
    } else {
      setValidationErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const validateVideoUrl = (value: string) => {
    if (value) {
      const urlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/;
      if (!urlRegex.test(value)) {
        setValidationErrors(prev => ({ ...prev, videoUrl: 'Link video không hợp lệ. Chỉ chấp nhận YouTube, Vimeo, Dailymotion' }));
      } else {
        setValidationErrors(prev => ({ ...prev, videoUrl: '' }));
      }
    } else {
      setValidationErrors(prev => ({ ...prev, videoUrl: '' }));
    }
  };

  const handleIdCardUpload = (type: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('Ảnh quá lớn (tối đa 5MB).');
      return;
    }
    
    if (type === 'front') {
      setIdCardFrontFile(file || null);
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setIdCardFrontPreview(previewUrl);
      } else {
        setIdCardFrontPreview('');
      }
    } else {
      setIdCardBackFile(file || null);
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setIdCardBackPreview(previewUrl);
      } else {
        setIdCardBackPreview('');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thiện hồ sơ đăng ký</h1>
            <p className="text-gray-600 mb-8">
              Vui lòng điền đầy đủ thông tin để hoàn thiện hồ sơ chuyên nghiệp của bạn.
            </p>

            {/* Rejection Notice */}
            {userData?.status === 'rejected' && (
              <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="text-orange-800 font-semibold mb-1">Hồ sơ của bạn đã bị từ chối</h3>
                    <p className="text-orange-700 text-sm">
                      Vui lòng chỉnh sửa lại thông tin theo góp ý của quản trị viên và gửi lại để được xét duyệt lần nữa.
                    </p>
                    {userData.rejectionReason && (
                      <p className="text-orange-600 text-sm mt-2">
                        <span className="font-semibold">Lý do từ chối:</span> {userData.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* User Info Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">Thông tin đăng ký</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    value={userData?.fullName || ''}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={userData?.email || ''}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 mb-8">
              {[
                { id: 'personal', label: 'Thông tin cá nhân' },
                { id: 'professional', label: 'Thông tin nghề nghiệp'},
                { id: 'legal', label: 'Giấy tờ pháp lý' },
                { id: 'references', label: 'Tham chiếu & Cam kết' },
                { id: 'additional', label: 'Hồ sơ bổ sung' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeSection === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2"></span>
                  {tab.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              {activeSection === 'personal' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 65)).toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={personalInfo.gender}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số CMND/CCCD/Hộ chiếu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={personalInfo.idNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                          if (value.length <= 12) {
                            setPersonalInfo(prev => ({ ...prev, idNumber: value }));
                            validateIdNumber(value);
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors.idNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập số CMND/CCCD/Hộ chiếu (9-12 chữ số)"
                        maxLength={12}
                        required
                      />
                      {validationErrors.idNumber && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.idNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => {
                          let value = e.target.value.replace(/[^\d+]/g, ''); // Only allow digits and +
                          
                          // Limit length based on format
                          if (value.startsWith('+84')) {
                            if (value.length > 12) value = value.substring(0, 12);
                          } else if (value.startsWith('0')) {
                            if (value.length > 10) value = value.substring(0, 10);
                          } else if (value.length > 10) {
                            value = value.substring(0, 10);
                          }
                          
                          setPersonalInfo(prev => ({ ...prev, phone: value }));
                          validatePhoneNumber(value);
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập số điện thoại (VD: 0123456789 hoặc +84123456789)"
                        maxLength={12}
                        required
                      />
                      {validationErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ thường trú <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={personalInfo.permanentAddress}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, permanentAddress: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Nhập địa chỉ thường trú"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ tạm trú
                      </label>
                      <textarea
                        value={personalInfo.temporaryAddress}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, temporaryAddress: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Nhập địa chỉ tạm trú (nếu khác địa chỉ thường trú)"
                      />
                    </div>
                    
                    {/* ID Card Upload Section */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Ảnh CCCD/CCCD</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ảnh CCCD mặt trước <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleIdCardUpload('front', e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Tối đa 5MB - JPG, PNG</p>
                          
                          {(idCardFrontPreview || personalInfo.idCardFront) && (
                            <div className="mt-3">
                              <img 
                                src={idCardFrontPreview || personalInfo.idCardFront} 
                                alt="CCCD mặt trước" 
                                className="h-32 w-full object-cover rounded-md border"
                              />
                              {idCardFrontPreview && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIdCardFrontFile(null);
                                    setIdCardFrontPreview('');
                                  }}
                                  className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                >
                                  ✕ Xóa ảnh
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ảnh CCCD mặt sau <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleIdCardUpload('back', e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Tối đa 5MB - JPG, PNG</p>
                          
                          {(idCardBackPreview || personalInfo.idCardBack) && (
                            <div className="mt-3">
                              <img 
                                src={idCardBackPreview || personalInfo.idCardBack} 
                                alt="CCCD mặt sau" 
                                className="h-32 w-full object-cover rounded-md border"
                              />
                              {idCardBackPreview && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIdCardBackFile(null);
                                    setIdCardBackPreview('');
                                  }}
                                  className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                >
                                  ✕ Xóa ảnh
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Information Section */}
              {activeSection === 'professional' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin nghề nghiệp</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số năm kinh nghiệm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={professionalInfo.yearsOfExperience}
                        onChange={(e) => setProfessionalInfo(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nơi từng làm việc
                      </label>
                      <input
                        type="text"
                        value={professionalInfo.previousWorkplace}
                        onChange={(e) => setProfessionalInfo(prev => ({ ...prev, previousWorkplace: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Nhập nơi từng làm việc"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kỹ năng chuyên môn <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={professionalInfo.skills}
                        onChange={(e) => {
                          setProfessionalInfo(prev => ({ ...prev, skills: e.target.value }));
                          validateSkills(e.target.value);
                        }}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors.skills ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Mô tả các kỹ năng chuyên môn của bạn (ít nhất 10 ký tự)..."
                        minLength={10}
                        required
                      />
                      {validationErrors.skills && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.skills}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khả năng ngôn ngữ
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {languageOptions.map((language) => (
                          <label key={language} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={professionalInfo.languages.includes(language)}
                              onChange={() => handleLanguageChange(language)}
                              className="mr-2"
                            />
                            <span className="text-sm">{language}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bằng cấp, chứng chỉ liên quan
                      </label>
                      <textarea
                        value={professionalInfo.certificates}
                        onChange={(e) => setProfessionalInfo(prev => ({ ...prev, certificates: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-3"
                        placeholder="Mô tả các bằng cấp, chứng chỉ liên quan..."
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload file chứng chỉ, bằng cấp
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          multiple
                          onChange={handleCertificateUpload}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Có thể upload nhiều file (PDF, JPG, PNG, DOC, DOCX) - tối đa 5MB/file</p>
                        
                        {(certificatePreviews.length > 0 || professionalInfo.certificateFiles.length > 0) && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Files đã upload:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {/* Existing files from database */}
                              {professionalInfo.certificateFiles.map((file: string, index: number) => (
                                <div key={`existing-${index}`} className="flex items-center justify-between p-2 border border-gray-200 rounded-md bg-gray-50">
                                  <div className="flex items-center">
                                    <img 
                                      src={file} 
                                      alt={`Certificate ${index + 1}`} 
                                      className="h-12 w-12 object-cover rounded mr-3"
                                    />
                                    <span className="text-sm text-gray-700">
                                      Certificate {index + 1}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">Đã lưu</span>
                                </div>
                              ))}
                              
                              {/* New files being uploaded */}
                              {certificatePreviews.map((preview, index) => (
                                <div key={`new-${index}`} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                                  <div className="flex items-center">
                                    <img 
                                      src={preview} 
                                      alt={`Certificate ${index + 1}`} 
                                      className="h-12 w-12 object-cover rounded mr-3"
                                    />
                                    <span className="text-sm text-gray-700">
                                      {certificateFiles[index]?.name || `Certificate ${index + 1}`}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeCertificate(index)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Legal Documents Section */}
              {activeSection === 'legal' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Giấy tờ pháp lý & sức khỏe</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lý lịch tư pháp
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setLegalDocuments(prev => ({ ...prev, criminalRecord: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giấy khám sức khỏe
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setLegalDocuments(prev => ({ ...prev, healthCertificate: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chứng nhận tiêm phòng
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setLegalDocuments(prev => ({ ...prev, vaccinationCertificate: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giấy phép lao động (nếu có)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setLegalDocuments(prev => ({ ...prev, workPermit: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* References & Commitments Section */}
              {activeSection === 'references' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Tham chiếu & Cam kết</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Người tham chiếu</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên người tham chiếu
                          </label>
                          <input
                            type="text"
                            value={references.referenceName}
                            onChange={(e) => setReferences(prev => ({ ...prev, referenceName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nhập tên người tham chiếu"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            value={references.referencePhone}
                            onChange={(e) => {
                              let value = e.target.value.replace(/[^\d+]/g, '');
                              
                              // Limit length based on format
                              if (value.startsWith('+84')) {
                                if (value.length > 12) value = value.substring(0, 12);
                              } else if (value.startsWith('0')) {
                                if (value.length > 10) value = value.substring(0, 10);
                              } else if (value.length > 10) {
                                value = value.substring(0, 10);
                              }
                              
                              setReferences(prev => ({ ...prev, referencePhone: value }));
                              validateReferencePhone(value);
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                              validationErrors.referencePhone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Nhập số điện thoại"
                            maxLength={12}
                          />
                          {validationErrors.referencePhone && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.referencePhone}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quan hệ
                          </label>
                          <input
                            type="text"
                            value={references.referenceRelation}
                            onChange={(e) => setReferences(prev => ({ ...prev, referenceRelation: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Ví dụ: Đồng nghiệp, Sếp cũ..."
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Cam kết</h3>
                      <div className="space-y-3">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={commitments.ethicalCommitment}
                            onChange={(e) => setCommitments(prev => ({ ...prev, ethicalCommitment: e.target.checked }))}
                            className="mt-1 mr-3"
                          />
                          <span className="text-sm text-gray-700">
                            Tôi cam kết tuân thủ các nguyên tắc đạo đức nghề nghiệp và cung cấp dịch vụ chăm sóc chất lượng cao.
                          </span>
                        </label>
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={commitments.termsAgreement}
                            onChange={(e) => setCommitments(prev => ({ ...prev, termsAgreement: e.target.checked }))}
                            className="mt-1 mr-3"
                            required
                          />
                          <span className="text-sm text-gray-700">
                            Tôi đồng ý với các điều khoản và điều kiện sử dụng hệ thống <span className="text-red-500">*</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Profile Section */}
              {activeSection === 'additional' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Hồ sơ bổ sung</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ảnh đại diện
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.size > 5 * 1024 * 1024) {
                            alert('Ảnh quá lớn (tối đa 5MB).');
                            return;
                          }
                          setProfilePhotoFile(file || null);
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setProfilePhotoPreview(previewUrl);
                          } else {
                            setProfilePhotoPreview('');
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {profilePhotoPreview && (
                        <div className="mt-3">
                          <img src={profilePhotoPreview} alt="Xem trước ảnh đại diện" className="h-32 w-32 object-cover rounded-md border" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video giới thiệu (link YouTube hoặc upload)
                      </label>
                      <input
                        type="text"
                        value={additionalProfile.introductionVideo}
                        onChange={(e) => {
                          setAdditionalProfile(prev => ({ ...prev, introductionVideo: e.target.value }));
                          validateVideoUrl(e.target.value);
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors.videoUrl ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập link YouTube, Vimeo hoặc Dailymotion"
                      />
                      {validationErrors.videoUrl && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.videoUrl}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khả năng đặc biệt
                      </label>
                      <textarea
                        value={additionalProfile.specialAbilities}
                        onChange={(e) => setAdditionalProfile(prev => ({ ...prev, specialAbilities: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Mô tả các khả năng đặc biệt của bạn..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                <div className="flex space-x-4">
                  {activeSection !== 'personal' && (
                    <button
                      type="button"
                      onClick={() => {
                        const sections = ['personal', 'professional', 'legal', 'references', 'additional'];
                        const currentIndex = sections.indexOf(activeSection);
                        if (currentIndex > 0) {
                          setActiveSection(sections[currentIndex - 1]);
                        }
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Quay lại
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  {activeSection !== 'additional' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const sections = ['personal', 'professional', 'legal', 'references', 'additional'];
                        const currentIndex = sections.indexOf(activeSection);
                        if (currentIndex < sections.length - 1) {
                          setActiveSection(sections[currentIndex + 1]);
                        }
                      }}
                      className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Tiếp theo
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-2 text-white rounded-md font-semibold ${
                        isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất hồ sơ'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UploadCredentialsPage;


