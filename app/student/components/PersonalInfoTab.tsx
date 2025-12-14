'use client';
import { useState, useEffect } from 'react';
import { Edit2, Save, X, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';
import { getStudentInfo } from '@/app/student/api/personal';

const PersonalInfoTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    avatar: '',
    studentId: '',
    class: '',
    academicPerformance: '',
    conduct: '',
    averageScore: 0,
    createdAt: '',
    updatedAt: ''
  });
  
  const getpersonalInfo = async () => {
    try {
      setLoading(true);
      const sInfo = await getStudentInfo();
      console.log("Student Info:", sInfo);
      
      if (sInfo) {
        setFormData({
          fullName: sInfo.name || '',
          email: sInfo.email || '',
          phone: sInfo.parentContact || '',
          dateOfBirth: sInfo.DOB ? sInfo.DOB.split('T')[0] : '',
          avatar: sInfo.avatar || '',
          studentId: sInfo._id || '',
          class: sInfo.classid || '',
          academicPerformance: sInfo.academic_performance || '',
          conduct: sInfo.conduct || '',
          averageScore: sInfo.averageScore || 0,
          createdAt: sInfo.createdAt ? new Date(sInfo.createdAt).toLocaleDateString('vi-VN') : '',
          updatedAt: sInfo.updatedAt ? new Date(sInfo.updatedAt).toLocaleDateString('vi-VN') : ''
        });
      }
    } catch (error) {
      console.error("Error fetching student info:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getpersonalInfo();
  }, []);
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // TODO: Save form data to API
    console.log('Saving:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    getpersonalInfo();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Đang tải thông tin...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thông Tin Cá Nhân</h2>
          <p className="text-gray-600 mt-1">Quản lý hồ sơ và thông tin cá nhân của bạn</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Edit2 className="w-4 h-4" />
            Chỉnh Sửa
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            {formData.avatar ? (
              <img 
                src={formData.avatar} 
                alt={formData.fullName}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-1">{formData.fullName}</h3>
            <p className="text-sm text-gray-600 mb-4">{formData.studentId}</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Điểm TB:</span> {formData.averageScore.toFixed(1)}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Học lực:</span> <span className="text-blue-600">{formData.academicPerformance}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Hạnh kiểm:</span> <span className="text-green-600">{formData.conduct}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số Điện Thoại Phụ Huynh
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Ngày Sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Academic Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Học Tập</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Mã Học Sinh</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Mã Lớp</label>
                    <input
                      type="text"
                      value={formData.class}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Học Lực</label>
                    <input
                      type="text"
                      value={formData.academicPerformance}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Hạnh Kiểm</label>
                    <input
                      type="text"
                      value={formData.conduct}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Điểm Trung Bình</label>
                    <input
                      type="text"
                      value={formData.averageScore.toFixed(1)}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Ngày Tạo</label>
                    <input
                      type="text"
                      value={formData.createdAt}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="border-t border-gray-200 pt-6 flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Lưu Thay Đổi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;