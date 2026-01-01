'use client';
import { useState, useEffect } from 'react';
import { Edit2, Save, X, Mail, Phone, Calendar, User } from 'lucide-react';
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
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0F172A] to-[#2563EB] bg-clip-text text-transparent leading-tight">Thông Tin Cá Nhân</h2>
          <p className="text-gray-600 mt-2 leading-relaxed flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Quản lý hồ sơ và thông tin cá nhân của bạn
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 font-semibold"
          >
            <Edit2 className="w-5 h-5" />
            Chỉnh Sửa
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border-2 border-gray-200 text-center hover:shadow-xl transition-shadow">
            {formData.avatar ? (
              <div className="relative inline-block">
                <img 
                  src={formData.avatar} 
                  alt={formData.fullName}
                  className="w-36 h-36 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-xl ring-4 ring-blue-100"
                />
                <div className="absolute bottom-4 right-0 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="relative inline-block">
                <div className="w-36 h-36 bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl ring-4 ring-blue-100">
                  <User className="w-20 h-20 text-white" />
                </div>
                <div className="absolute bottom-4 right-0 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
            <h3 className="text-2xl font-bold text-[#0F172A] mb-2 leading-tight">{formData.fullName}</h3>
            <p className="text-sm text-gray-500 mb-5 font-medium">{formData.studentId}</p>
            <div className="space-y-3 text-sm">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <p className="text-gray-600 leading-relaxed">
                  <span className="font-bold text-[#0F172A]">Điểm TB:</span> <span className="text-[#2563EB] font-bold text-xl ml-2">{formData.averageScore.toFixed(1)}</span>
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <p className="text-gray-600 leading-relaxed">
                  <span className="font-bold text-[#0F172A]">Học lực:</span> <span className="text-green-600 font-bold ml-2">{formData.academicPerformance}</span>
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-gray-600 leading-relaxed">
                  <span className="font-bold text-[#0F172A]">Hạnh kiểm:</span> <span className="text-amber-600 font-bold ml-2">{formData.conduct}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent disabled:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:text-gray-600 transition-all text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent disabled:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:text-gray-600 transition-all text-[#0F172A]"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số Điện Thoại Phụ Huynh
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent disabled:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:text-gray-600 transition-all text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Ngày Sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent disabled:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:text-gray-600 transition-all text-[#0F172A]"
                  />
                </div>
              </div>

              {/* Academic Info */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-bold text-[#0F172A] mb-4">Thông Tin Học Tập</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">Mã Học Sinh</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">Mã Lớp</label>
                    <input
                      type="text"
                      value={formData.class}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">Học Lực</label>
                    <input
                      type="text"
                      value={formData.academicPerformance}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">Hạnh Kiểm</label>
                    <input
                      type="text"
                      value={formData.conduct}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">Điểm Trung Bình</label>
                    <input
                      type="text"
                      value={formData.averageScore.toFixed(1)}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">Ngày Tạo</label>
                    <input
                      type="text"
                      value={formData.createdAt}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="border-t border-gray-200 pt-6 flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 border-2 border-gray-300 text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] flex items-center gap-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
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