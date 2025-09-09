import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CaregiverItem {
  id: string;
  fullName: string;
  email: string;
  credentials?: string;
  status?: string;
  role?: string;
  credentialImage?: string;
}

const CaregiverApprovalPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [caregivers, setCaregivers] = useState<CaregiverItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<CaregiverItem[]>('https://68aed258b91dfcdd62ba657c.mockapi.io/users');
      const pending = res.data.filter(u => u.role === 'Caregiver' && u.status === 'pending');
      setCaregivers(pending);
    } catch (e) {
      setError('Không thể tải danh sách caregiver.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id);
    try {
      await axios.put(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${id}`, { status });
      alert(status === 'approved' ? 'Đã phê duyệt caregiver.' : 'Đã từ chối caregiver.');
      // Cập nhật lại danh sách trên UI
      setCaregivers(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert('Cập nhật trạng thái thất bại.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchData} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Xét duyệt người chăm sóc (Caregiver)</h1>
      {caregivers.length === 0 ? (
        <p>Không có hồ sơ đang chờ duyệt.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caregivers.map(cg => (
            <div key={cg.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="mb-2">
                <h2 className="text-lg font-semibold">{cg.fullName}</h2>
                <p className="text-gray-600 text-sm">{cg.email}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{cg.credentials || 'Không có mô tả chứng chỉ.'}</p>
              </div>
              {cg.credentialImage && (
                <div className="mb-4">
                  <img
                    src={cg.credentialImage}
                    alt={`Chứng chỉ của ${cg.fullName}`}
                    className="max-h-48 rounded border"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus(cg.id, 'approved')}
                  disabled={updatingId === cg.id}
                  className={`px-3 py-2 rounded-md text-white ${updatingId === cg.id ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  ✔ Phê duyệt
                </button>
                <button
                  onClick={() => updateStatus(cg.id, 'rejected')}
                  disabled={updatingId === cg.id}
                  className={`px-3 py-2 rounded-md text-white ${updatingId === cg.id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  ✖ Từ chối
                </button>
              </div>
            </div>
          ))
          }
        </div>
      )}
    </div>
  );
};

export default CaregiverApprovalPage;


