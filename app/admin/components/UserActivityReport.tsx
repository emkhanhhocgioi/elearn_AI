'use client';
import { useState, useEffect } from 'react';
import { Download, Users, Eye, X ,Activity} from 'lucide-react';
import { fetchUserActivityLogs, exportUserActivityLogsToCSV, fetchUserActivityById } from '../api/report';

interface UserActivity {
  _id: string;
  role: 'student' | 'teacher';
  teacherId?: {
    _id: string;
    name: string;
    email: string;
  };
  studentId?: {
    _id: string;
    name: string;
    email: string;
  };
  action: string;
  testId?: {
    _id: string;
    title: string;
  };
  lessonId?: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

interface ActivityFilters {
  role?: 'student' | 'teacher' | '';
  action?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export default function UserActivityReport() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [filters, setFilters] = useState<ActivityFilters>({
    role: '',
    action: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  // Fetch activities on component mount and when filters change
  useEffect(() => {
    const loadActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await fetchUserActivityLogs();
      if (response.success) {
        setActivities(response.data.activities);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

    loadActivities();
  }, [filters.page,filters.limit, filters.role, filters.action, filters.startDate, filters.endDate]);

  
  const handleExportCSV = async () => {
    try {
      const blob = await exportUserActivityLogsToCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_activities_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV');
    }
  };

  const handleViewDetail = async (activityId: string) => {
    try {
      const response = await fetchUserActivityById(activityId);
      if (response.success) {
        setSelectedActivity(response.activity);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error('Error fetching activity detail:', err);
    }
  };

  const handleFilterChange = (key: keyof ActivityFilters, value: ActivityFilters[keyof ActivityFilters]) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          Nhật Ký Hoạt Động Người Dùng
        </h3>
        <button 
          onClick={handleExportCSV}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-semibold hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          Xuất CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-6 bg-purple-50 rounded-xl border-2 border-purple-100">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Vai Trò</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 cursor-pointer transition-all duration-300"
            >
              <option value="">Tất Cả</option>
              <option value="student">Học Sinh</option>
              <option value="teacher">Giáo Viên</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Hành Động</label>
            <input
              type="text"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              placeholder="Lọc theo hành động"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Ngày Bắt Đầu</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 cursor-pointer transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Ngày Kết Thúc</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 cursor-pointer transition-all duration-300"
            />
          </div>
        </div>

        {/* Activity Table */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Đang tải hoạt động...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-xl">
            <p className="text-lg font-semibold text-red-600">Error: {error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-purple-500" />
            </div>
            <p className="text-lg font-semibold text-gray-600">Không tìm thấy hoạt động nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border-2 border-gray-100">
              <table className="w-full">
                <thead className="bg-purple-50 border-b-2 border-purple-100">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Người Dùng</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Vai Trò</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Hành Động</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Liên Quan</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Thời Gian</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => {
                    const user = activity.role === 'teacher' ? activity.teacherId : activity.studentId;
                    const userName = user?.name || 'N/A';
                    const userEmail = user?.email || 'N/A';
                    
                    return (
                      <tr key={activity._id} className="hover:bg-purple-50 transition-all duration-200">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{userName}</div>
                            <div className="text-xs text-gray-500">{userEmail}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            activity.role === 'teacher' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {activity.role === 'teacher' ? 'Giáo Viên' : 'Học Sinh'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">{activity.action}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-xs text-gray-600">
                            {activity.testId && <div>Bài kiểm tra: {activity.testId.title}</div>}
                            {activity.lessonId && <div>Bài học: {activity.lessonId.title}</div>}
                            {!activity.testId && !activity.lessonId && <span className="text-gray-400">-</span>}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewDetail(activity._id)}
                            className="text-purple-600 hover:text-purple-800 flex items-center gap-2 font-semibold hover:scale-110 transition-all duration-300"
                          >
                            <Eye className="w-5 h-5" />
                            Xem
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến {Math.min(pagination.page * pagination.limit, pagination.total)} trong {pagination.total} kết quả
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          pagination.page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiếp
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Chi Tiết Hoạt Động</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mã Số</label>
                  <p className="text-sm text-gray-900 break-all">{selectedActivity._id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vai Trò</label>
                  <p className="text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedActivity.role === 'teacher' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedActivity.role === 'teacher' ? 'Giáo Viên' : 'Học Sinh'}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Người Dùng</label>
                <div className="mt-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedActivity.role === 'teacher' 
                      ? selectedActivity.teacherId?.name 
                      : selectedActivity.studentId?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedActivity.role === 'teacher' 
                      ? selectedActivity.teacherId?.email 
                      : selectedActivity.studentId?.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Hành Động</label>
                <p className="text-sm text-gray-900 mt-1">{selectedActivity.action}</p>
              </div>

              {selectedActivity.testId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Bài Kiểm Tra Liên Quan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedActivity.testId.title}</p>
                </div>
              )}

              {selectedActivity.lessonId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Bài Học Liên Quan</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedActivity.lessonId.title}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Thời Gian Tạo</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(selectedActivity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
