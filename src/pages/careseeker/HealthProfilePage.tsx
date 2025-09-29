import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiUser, FiHeart, FiActivity, FiDroplet, FiThermometer, FiEye, FiFileText, FiDownload, FiFilter, FiX } from 'react-icons/fi';

interface HealthRecord {
  id: number;
  date: string;
  time: string;
  type: 'checkup' | 'care' | 'emergency' | 'medication' | 'vital_signs';
  title: string;
  description: string;
  recordedBy: {
    name: string;
    role: 'Care Seeker' | 'Care Giver';
    avatar: string;
  };
  elderlyPerson: {
    name: string;
    age: number;
    relationship: string;
    avatar: string;
  };
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    bloodSugar?: number;
    oxygenSaturation?: number;
  };
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    notes?: string;
  }>;
  symptoms?: string[];
  diagnosis?: string;
  treatment?: string;
  followUp?: string;
  attachments?: Array<{
    name: string;
    type: 'image' | 'document' | 'lab_result';
    url: string;
  }>;
}

const HealthProfilePage: React.FC = () => {
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [isViewRecordModalOpen, setIsViewRecordModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMemberDetail, setShowMemberDetail] = useState(false);

  // Mock family members with current health status
  const familyMembers = [
    { 
      id: 1, 
      name: 'Nguyễn Văn Bố', 
      age: 72, 
      relationship: 'Bố', 
      avatar: '👨‍🦳', 
      conditions: ['Huyết áp cao', 'Tiểu đường'],
      currentHealth: {
        bloodPressure: '140/90',
        heartRate: 75,
        temperature: 36.5,
        bloodSugar: 7.2,
        oxygenSaturation: 98,
        lastUpdated: '22/01/2024 14:30',
        updatedBy: 'Trần Thị Mai (Care Giver)',
        overallStatus: 'Ổn định',
        riskLevel: 'Trung bình',
        nextCheckup: '25/04/2024',
        currentMedications: [
          { name: 'Amlodipine', dosage: '5mg', frequency: '1 lần/ngày' },
          { name: 'Metformin', dosage: '500mg', frequency: '2 lần/ngày' }
        ],
        recentSymptoms: ['Đau đầu nhẹ', 'Mệt mỏi'],
        careNotes: 'Cần theo dõi huyết áp hàng ngày, uống thuốc đúng giờ'
      }
    },
    { 
      id: 2, 
      name: 'Trần Thị Mẹ', 
      age: 68, 
      relationship: 'Mẹ', 
      avatar: '👩‍🦳', 
      conditions: ['Viêm khớp', 'Loãng xương'],
      currentHealth: {
        bloodPressure: '125/80',
        heartRate: 68,
        temperature: 36.3,
        bloodSugar: 5.8,
        oxygenSaturation: 99,
        lastUpdated: '21/01/2024 09:15',
        updatedBy: 'Lê Văn Hùng (Care Giver)',
        overallStatus: 'Tốt',
        riskLevel: 'Thấp',
        nextCheckup: '15/03/2024',
        currentMedications: [
          { name: 'Vitamin D3', dosage: '1000 IU', frequency: '1 lần/ngày' },
          { name: 'Calcium', dosage: '600mg', frequency: '2 lần/ngày' },
          { name: 'Glucosamine', dosage: '1500mg', frequency: '1 lần/ngày' }
        ],
        recentSymptoms: ['Đau khớp nhẹ'],
        careNotes: 'Tập luyện nhẹ nhàng, tránh vận động mạnh'
      }
    }
  ];

  // Mock health records
  const healthRecords: HealthRecord[] = [
    {
      id: 1,
      date: '22/01/2024',
      time: '14:30',
      type: 'checkup',
      title: 'Khám định kỳ tại Bệnh viện Đa khoa TP.HCM',
      description: 'Khám định kỳ 6 tháng một lần. Bác sĩ đánh giá tình trạng sức khỏe tổng thể.',
      recordedBy: {
        name: 'Nguyễn Văn A',
        role: 'Care Seeker',
        avatar: '👨'
      },
      elderlyPerson: {
        name: 'Nguyễn Văn Bố',
        age: 72,
        relationship: 'Bố',
        avatar: '👨‍🦳'
      },
      vitalSigns: {
        bloodPressure: '140/90',
        heartRate: 75,
        temperature: 36.5,
        bloodSugar: 7.2
      },
      medications: [
        { name: 'Amlodipine', dosage: '5mg', frequency: '1 lần/ngày', notes: 'Uống sau ăn sáng' },
        { name: 'Metformin', dosage: '500mg', frequency: '2 lần/ngày', notes: 'Uống trước ăn' }
      ],
      symptoms: ['Đau đầu nhẹ', 'Mệt mỏi'],
      diagnosis: 'Huyết áp cao, Tiểu đường type 2',
      treatment: 'Tiếp tục thuốc hiện tại, theo dõi huyết áp hàng ngày',
      followUp: 'Tái khám sau 3 tháng',
      attachments: [
        { name: 'Kết quả xét nghiệm máu', type: 'lab_result', url: '#' },
        { name: 'Hình ảnh X-quang ngực', type: 'image', url: '#' }
      ]
    },
    {
      id: 2,
      date: '21/01/2024',
      time: '09:15',
      type: 'care',
      title: 'Chăm sóc hàng ngày - Theo dõi huyết áp',
      description: 'Đo huyết áp và đường huyết theo lịch. Bệnh nhân hợp tác tốt.',
      recordedBy: {
        name: 'Trần Thị Mai',
        role: 'Care Giver',
        avatar: '👩‍⚕️'
      },
      elderlyPerson: {
        name: 'Nguyễn Văn Bố',
        age: 72,
        relationship: 'Bố',
        avatar: '👨‍🦳'
      },
      vitalSigns: {
        bloodPressure: '135/85',
        heartRate: 72,
        bloodSugar: 6.8
      },
      medications: [
        { name: 'Amlodipine', dosage: '5mg', frequency: '1 lần/ngày', notes: 'Đã uống đúng giờ' }
      ]
    },
    {
      id: 3,
      date: '20/01/2024',
      time: '16:45',
      type: 'emergency',
      title: 'Cấp cứu - Huyết áp tăng cao đột ngột',
      description: 'Huyết áp tăng lên 160/95 mmHg, bệnh nhân có biểu hiện đau đầu và chóng mặt.',
      recordedBy: {
        name: 'Lê Văn Hùng',
        role: 'Care Giver',
        avatar: '👨‍⚕️'
      },
      elderlyPerson: {
        name: 'Nguyễn Văn Bố',
        age: 72,
        relationship: 'Bố',
        avatar: '👨‍🦳'
      },
      vitalSigns: {
        bloodPressure: '160/95',
        heartRate: 85,
        temperature: 36.8
      },
      symptoms: ['Đau đầu dữ dội', 'Chóng mặt', 'Buồn nôn'],
      treatment: 'Cho uống thuốc hạ huyết áp khẩn cấp, gọi bác sĩ tư vấn',
      followUp: 'Theo dõi sát sao, tái khám nếu không cải thiện'
    },
    {
      id: 4,
      date: '19/01/2024',
      time: '10:30',
      type: 'medication',
      title: 'Cập nhật thuốc - Thêm vitamin D',
      description: 'Bác sĩ kê thêm vitamin D3 do thiếu hụt vitamin D.',
      recordedBy: {
        name: 'Nguyễn Văn A',
        role: 'Care Seeker',
        avatar: '👨'
      },
      elderlyPerson: {
        name: 'Trần Thị Mẹ',
        age: 68,
        relationship: 'Mẹ',
        avatar: '👩‍🦳'
      },
      medications: [
        { name: 'Vitamin D3', dosage: '1000 IU', frequency: '1 lần/ngày', notes: 'Uống sau ăn sáng' },
        { name: 'Calcium', dosage: '600mg', frequency: '2 lần/ngày', notes: 'Uống với nước' }
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup': return <FiCalendar className="h-5 w-5" />;
      case 'care': return <FiHeart className="h-5 w-5" />;
      case 'emergency': return <FiActivity className="h-5 w-5" />;
      case 'medication': return <FiDroplet className="h-5 w-5" />;
      case 'vital_signs': return <FiThermometer className="h-5 w-5" />;
      default: return <FiFileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checkup': return 'bg-blue-100 text-blue-800';
      case 'care': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'medication': return 'bg-purple-100 text-purple-800';
      case 'vital_signs': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'checkup': return 'Khám bệnh';
      case 'care': return 'Chăm sóc';
      case 'emergency': return 'Cấp cứu';
      case 'medication': return 'Thuốc men';
      case 'vital_signs': return 'Vital signs';
      default: return 'Khác';
    }
  };

  const filteredRecords = healthRecords.filter(record => {
    const matchesFilter = filterType === 'all' || record.type === filterType;
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddRecord = () => {
    setIsAddRecordModalOpen(true);
  };

  const handleViewRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsViewRecordModalOpen(true);
  };

  const handleViewMemberDetail = (member: any) => {
    setSelectedFamilyMember(member);
    setShowMemberDetail(true);
  };

  const handleCloseModals = () => {
    setIsAddRecordModalOpen(false);
    setIsViewRecordModalOpen(false);
    setSelectedRecord(null);
    setShowMemberDetail(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ sức khỏe</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin sức khỏe của người thân</p>
        </div>
        <button
          onClick={handleAddRecord}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <FiPlus className="h-5 w-5" />
          <span>Thêm bản ghi</span>
        </button>
      </div>

      {/* Family Member Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thành viên gia đình</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{member.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.age} tuổi - {member.relationship}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.conditions.map((condition, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {condition}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.currentHealth.riskLevel === 'Thấp' ? 'bg-green-100 text-green-800' :
                        member.currentHealth.riskLevel === 'Trung bình' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {member.currentHealth.overallStatus} - {member.currentHealth.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleViewMemberDetail(member)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiEye className="h-4 w-4" />
                  <span>Xem chi tiết</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <FiHeart className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Hướng dẫn sử dụng</h3>
            <p className="text-blue-700 mt-1">Nhấn "Xem chi tiết" bên cạnh tên thành viên để xem tình trạng sức khỏe hiện tại và lịch sử sức khỏe của họ.</p>
          </div>
        </div>
      </div>

      {/* Member Detail Modal */}
      {showMemberDetail && selectedFamilyMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{selectedFamilyMember.avatar}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedFamilyMember.name}</h2>
                  <p className="text-gray-600">{selectedFamilyMember.age} tuổi - {selectedFamilyMember.relationship}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Current Health Status */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FiHeart className="h-6 w-6 text-blue-600" />
                  <span>Tình trạng sức khỏe hiện tại</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiDroplet className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-gray-900">Huyết áp</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{selectedFamilyMember.currentHealth.bloodPressure}</p>
                    <p className="text-sm text-gray-600">mmHg</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiHeart className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Nhịp tim</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{selectedFamilyMember.currentHealth.heartRate}</p>
                    <p className="text-sm text-gray-600">bpm</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiThermometer className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-gray-900">Nhiệt độ</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{selectedFamilyMember.currentHealth.temperature}</p>
                    <p className="text-sm text-gray-600">°C</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiActivity className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Đường huyết</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{selectedFamilyMember.currentHealth.bloodSugar}</p>
                    <p className="text-sm text-gray-600">mmol/L</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Tình trạng tổng thể</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedFamilyMember.currentHealth.overallStatus === 'Tốt' ? 'bg-green-100 text-green-800' :
                      selectedFamilyMember.currentHealth.overallStatus === 'Ổn định' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedFamilyMember.currentHealth.overallStatus}
                    </span>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Mức độ rủi ro</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedFamilyMember.currentHealth.riskLevel === 'Thấp' ? 'bg-green-100 text-green-800' :
                      selectedFamilyMember.currentHealth.riskLevel === 'Trung bình' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedFamilyMember.currentHealth.riskLevel}
                    </span>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Cập nhật lần cuối</h4>
                    <p className="text-sm text-gray-600">{selectedFamilyMember.currentHealth.lastUpdated}</p>
                    <p className="text-xs text-gray-500">Bởi {selectedFamilyMember.currentHealth.updatedBy}</p>
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FiDroplet className="h-6 w-6 text-purple-600" />
                  <span>Thuốc đang sử dụng</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedFamilyMember.currentHealth.currentMedications.map((med: any, index: number) => (
                    <div key={index} className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900">{med.name}</h4>
                      <p className="text-purple-700">{med.dosage} - {med.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Symptoms & Care Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Triệu chứng gần đây</h3>
                  <div className="space-y-2">
                    {selectedFamilyMember.currentHealth.recentSymptoms.map((symptom: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-gray-700">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ghi chú chăm sóc</h3>
                  <p className="text-gray-700">{selectedFamilyMember.currentHealth.careNotes}</p>
                </div>
              </div>

              {/* Health History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FiFileText className="h-6 w-6 text-gray-600" />
                  <span>Lịch sử sức khỏe</span>
                </h3>
                <div className="space-y-4">
                  {healthRecords
                    .filter(record => record.elderlyPerson.name === selectedFamilyMember.name)
                    .slice(0, 5)
                    .map((record) => (
                      <div key={record.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{record.title}</h4>
                            <p className="text-sm text-gray-600">{record.date} {record.time}</p>
                            <p className="text-sm text-gray-700 mt-1">{record.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              setShowMemberDetail(false);
                              handleViewRecord(record);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {isAddRecordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Thêm bản ghi sức khỏe</h2>
              <button
                onClick={handleCloseModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Tính năng thêm bản ghi sức khỏe sẽ được phát triển sau.</p>
            </div>
          </div>
        </div>
      )}

      {/* View Record Modal */}
      {isViewRecordModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết bản ghi sức khỏe</h2>
              <button
                onClick={handleCloseModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getTypeColor(selectedRecord.type)}`}>
                  {getTypeIcon(selectedRecord.type)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedRecord.title}</h3>
                  <p className="text-gray-600">{selectedRecord.date} {selectedRecord.time}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Mô tả</h4>
                <p className="text-gray-700">{selectedRecord.description}</p>
              </div>

              {/* Vital Signs */}
              {selectedRecord.vitalSigns && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Vital Signs</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedRecord.vitalSigns.bloodPressure && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FiDroplet className="h-5 w-5 text-red-600" />
                          <span className="font-medium text-red-900">Huyết áp</span>
                        </div>
                        <p className="text-red-700 font-semibold">{selectedRecord.vitalSigns.bloodPressure} mmHg</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.heartRate && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FiHeart className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Nhịp tim</span>
                        </div>
                        <p className="text-blue-700 font-semibold">{selectedRecord.vitalSigns.heartRate} bpm</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.temperature && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FiThermometer className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-orange-900">Nhiệt độ</span>
                        </div>
                        <p className="text-orange-700 font-semibold">{selectedRecord.vitalSigns.temperature}°C</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.bloodSugar && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FiActivity className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">Đường huyết</span>
                        </div>
                        <p className="text-green-700 font-semibold">{selectedRecord.vitalSigns.bloodSugar} mmol/L</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Medications */}
              {selectedRecord.medications && selectedRecord.medications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Thuốc men</h4>
                  <div className="space-y-2">
                    {selectedRecord.medications.map((med, index) => (
                      <div key={index} className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-purple-900">{med.name}</h5>
                            <p className="text-sm text-purple-700">{med.dosage} - {med.frequency}</p>
                            {med.notes && <p className="text-xs text-purple-600 mt-1">{med.notes}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnosis & Treatment */}
              {selectedRecord.diagnosis && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Chẩn đoán</h4>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{selectedRecord.diagnosis}</p>
                </div>
              )}

              {selectedRecord.treatment && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Điều trị</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedRecord.treatment}</p>
                </div>
              )}

              {selectedRecord.followUp && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Theo dõi</h4>
                  <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{selectedRecord.followUp}</p>
                </div>
              )}

              {/* Attachments */}
              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tài liệu đính kèm</h4>
                  <div className="space-y-2">
                    {selectedRecord.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FiFileText className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700">{attachment.name}</span>
                        <button className="ml-auto px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          Tải xuống
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthProfilePage;
