import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

interface CertificateFile {
  id: string;
  url?: string;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  adminNote?: string;
  name?: string;
  organization?: string;
  type?: string;
  issueDate?: string;
}

interface AdminUserItem {
  id: string;
  fullName: string;
  email: string;
  role?: string;
  profile?: {
    professionalInfo?: {
      certificateFiles?: CertificateFile[] | any[];
      skillItems?: any[];
    }
  }
}

const CertificateApprovalPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ user: AdminUserItem; cert: CertificateFile } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<AdminUserItem[]>(`https://68aed258b91dfcdd62ba657c.mockapi.io/users?role=Caregiver`);
      setUsers(res.data || []);
    } catch (e) {
      setError('Không thể tải danh sách chứng chỉ đang chờ duyệt.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const pendingItems = useMemo(() => {
    const items: Array<{ user: AdminUserItem; cert: CertificateFile }> = [];
    users.forEach(u => {
      const files = (u.profile?.professionalInfo?.certificateFiles || []) as any[];
      files.forEach((raw: any) => {
        const cert: CertificateFile = {
          id: String(raw.id || ''),
          url: raw.url,
          image: raw.image,
          status: (raw.status || 'approved') as any,
          uploadedAt: raw.uploadedAt || new Date().toISOString(),
          approvedAt: raw.approvedAt,
          rejectedAt: raw.rejectedAt,
          adminNote: raw.adminNote,
          name: raw.name,
          organization: raw.organization,
          type: raw.type,
          issueDate: raw.issueDate,
        };
        if (cert.status === 'pending') items.push({ user: u, cert });
      });
    });
    return items;
  }, [users]);

  const updateCertificateStatus = async (
    user: AdminUserItem,
    certId: string,
    status: 'approved' | 'rejected',
    adminNote?: string
  ) => {
    try {
      setProcessing(`${user.id}:${certId}`);
      const prof = user.profile?.professionalInfo || {};
      const files: any[] = Array.isArray(prof.certificateFiles) ? (prof.certificateFiles as any[]) : [];
      const nextFiles = files.map((c: any) => {
        if (String(c.id) !== String(certId)) return c;
        return {
          ...c,
          status,
          approvedAt: status === 'approved' ? new Date().toISOString() : c.approvedAt,
          rejectedAt: status === 'rejected' ? new Date().toISOString() : c.rejectedAt,
          adminNote: adminNote || c.adminNote || '',
        } as any;
      });

      // Keep skills to avoid accidental delete
      const payload = {
        profile: {
          professionalInfo: {
            certificateFiles: nextFiles,
            skillItems: user.profile?.professionalInfo?.skillItems || []
          }
        }
      } as any;

      let saved = false;
      try {
        await axios.patch(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${user.id}`, payload, { headers: { 'Content-Type': 'application/json' } });
        saved = true;
      } catch {}

      if (!saved) {
        try {
          const latest = await axios.get(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${user.id}`);
          const baseUser = latest.data || user;
          const fullPayload = {
            ...(baseUser || {}),
            profile: {
              ...((baseUser as any)?.profile || {}),
              professionalInfo: {
                ...(((baseUser as any)?.profile && (baseUser as any).profile.professionalInfo) || {}),
                certificateFiles: nextFiles,
                skillItems: ((baseUser as any)?.profile?.professionalInfo?.skillItems) || []
              }
            }
          };
          await axios.put(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${user.id}`, fullPayload, { headers: { 'Content-Type': 'application/json' } });
          saved = true;
        } catch {}
      }

      if (!saved) {
        throw new Error('Network Error');
      }

      await fetchData();
    } catch (e: any) {
      console.error('Update certificate status failed:', e);
      alert(`Không thể cập nhật trạng thái chứng chỉ: ${e?.response?.status || e?.message || ''}`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchData} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Duyệt chứng chỉ caregiver</h1>
          <p className="text-gray-600">Chỉ quản lý chứng chỉ. Duyệt tài khoản làm ở mục Quản lý Caregiver.</p>
        </div>
        <div className="text-sm text-gray-600">Đang chờ duyệt: <span className="font-semibold">{pendingItems.length}</span></div>
      </div>

      {pendingItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không có chứng chỉ nào đang chờ duyệt.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caregiver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chứng chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tải lên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingItems.map(({ user, cert }) => (
                  <tr key={`${user.id}:${cert.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{cert.name || 'Chứng chỉ'}</div>
                      <div className="text-xs text-gray-500">{cert.organization || '—'}</div>
                      <div className="text-xs text-gray-500">{cert.type || ''}{cert.issueDate ? ` • ${new Date(cert.issueDate).toLocaleDateString('vi-VN')}` : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cert.image || cert.url ? (
                        <img
                          src={cert.image || cert.url}
                          alt="certificate"
                          className="h-12 w-12 object-cover rounded border cursor-pointer hover:opacity-80"
                          onClick={() => setPreview({ user, cert })}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-100 border" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cert.uploadedAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => updateCertificateStatus(user, cert.id, 'approved')}
                        disabled={processing === `${user.id}:${cert.id}`}
                        className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => {
                          const note = window.prompt('Lý do từ chối (tùy chọn)');
                          updateCertificateStatus(user, cert.id, 'rejected', note || '');
                        }}
                        disabled={processing === `${user.id}:${cert.id}`}
                        className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Từ chối
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <div className="text-base font-semibold text-gray-900">{preview.cert.name || 'Chứng chỉ'}</div>
                <div className="text-xs text-gray-500">{preview.cert.organization || '—'}{preview.cert.issueDate ? ` • ${new Date(preview.cert.issueDate).toLocaleDateString('vi-VN')}` : ''}</div>
                <div className="text-xs text-gray-500">Caregiver: {preview.user.fullName} • {preview.user.email}</div>
              </div>
              <button className="p-2 rounded hover:bg-gray-100" onClick={() => setPreview(null)}>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center">
                {preview.cert.image || preview.cert.url ? (
                  <img src={preview.cert.image || preview.cert.url} alt="certificate-large" className="max-h-[70vh] w-auto rounded border" />
                ) : (
                  <div className="h-64 w-full rounded bg-gray-100 border" />
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Tên chứng chỉ</div>
                  <div className="text-gray-900 font-medium">{preview.cert.name || 'Chứng chỉ'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tổ chức</div>
                  <div className="text-gray-900">{preview.cert.organization || '—'}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-gray-500">Loại</div>
                    <div className="text-gray-900">{preview.cert.type || '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Ngày cấp</div>
                    <div className="text-gray-900">{preview.cert.issueDate ? new Date(preview.cert.issueDate).toLocaleDateString('vi-VN') : '—'}</div>
                  </div>
                </div>
                {preview.cert.adminNote && (
                  <div>
                    <div className="text-sm text-gray-500">Ghi chú</div>
                    <div className="text-gray-900">{preview.cert.adminNote}</div>
                  </div>
                )}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => updateCertificateStatus(preview.user, preview.cert.id, 'approved')}
                    disabled={processing === `${preview.user.id}:${preview.cert.id}`}
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => {
                      const note = window.prompt('Lý do từ chối (tùy chọn)');
                      updateCertificateStatus(preview.user, preview.cert.id, 'rejected', note || '');
                    }}
                    disabled={processing === `${preview.user.id}:${preview.cert.id}`}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateApprovalPage;


