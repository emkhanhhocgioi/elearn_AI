'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, User, BookOpen, Award, Edit2, Save, X, Eye, EyeOff, Bell, Lock, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { getTeacherInfo, updateAccountSettings as updateInfo } from '@/app/teacher/api/info';
import { updateAccountSettings, changePassword } from '../api/settings';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const Info = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [teacherId, setTeacherId] = useState<string>('');
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    TestReminder: true,
    language: 'vi'
  });
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    avatar: '',
    teacherId: '',
    age: 0,
    gender: '',
    subject: '',
    subjects: [] as string[],
    classes: [] as string[],
    qualification: '',
    experience: 0,
    isClassTeacher: false,
    createdAt: '',
    updatedAt: ''
  });
  
  const getTeacherPersonalInfo = async () => {
    try {
      setLoading(true);
      const tInfo = await getTeacherInfo();
      console.log("Teacher Info:", tInfo);
      
      if (tInfo) {
        setFormData({
          fullName: tInfo.name || '',
          email: tInfo.email || '',
          phoneNumber: tInfo.phoneNumber || '',
          dateOfBirth: tInfo.DOB ? tInfo.DOB.split('T')[0] : '',
          avatar: tInfo.avatar || '',
          teacherId: tInfo._id || '',
          age: tInfo.age || 0,
          gender: tInfo.gender || '',
          subject: tInfo.subject || '',
          subjects: tInfo.subject ? [tInfo.subject] : [],
          classes: tInfo.classes || [],
          qualification: tInfo.qualification || '',
          experience: tInfo.yearsOfExperience || 0,
          isClassTeacher: tInfo.isClassTeacher || false,
          createdAt: tInfo.createdAt ? new Date(tInfo.createdAt).toLocaleDateString('vi-VN') : '',
          updatedAt: tInfo.updatedAt ? new Date(tInfo.updatedAt).toLocaleDateString('vi-VN') : ''
        });
        
        setTeacherId(tInfo._id || '');
        
        if (tInfo.accountSettings) {
          setSettings({
            notifications: tInfo.accountSettings.notifications ?? true,
            darkMode: tInfo.accountSettings.darkMode ?? false,
            TestReminder: tInfo.accountSettings.TestReminder ?? true,
            language: 'vi'
          });
        }
      }
    } catch (error) {
      console.error("Error fetching teacher info:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getTeacherPersonalInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      await updateInfo({
        name: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        DOB: formData.dateOfBirth
      });
      
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
      getTeacherPersonalInfo();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Lỗi cập nhật thông tin' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      await updateAccountSettings( {
        notifications: settings.notifications,
        darkMode: settings.darkMode,
        TestReminder: settings.TestReminder
      });
      
      setMessage({ type: 'success', text: 'Cập nhật cài đặt thành công!' });
      setIsEditingSettings(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Lỗi cập nhật cài đặt' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    
    try {
      await changePassword(teacherId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setPasswordError(error.message || 'Lỗi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
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
      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0F172A] to-[#2563EB] bg-clip-text text-transparent leading-tight">Thông Tin & Cài Đặt</h2>
          <p className="text-gray-600 mt-2 leading-relaxed flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Quản lý hồ sơ, thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 font-semibold"
          >
            <Edit2 className="w-5 h-5" />
            Chỉnh Sửa Thông Tin
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border-2 border-gray-200 text-center hover:shadow-xl transition-shadow">
            <div className="relative inline-block">
              <div className="w-36 h-36 bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl ring-4 ring-blue-100">
                <span className="text-6xl font-bold text-white">
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'G'}
                </span>
              </div>
              <div className="absolute bottom-4 right-0 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#0F172A] mb-2 leading-tight">{formData.fullName}</h3>
            <p className="text-sm text-gray-500 mb-2 font-medium">{formData.teacherId}</p>
            {(formData.age > 0 || formData.gender) && (
              <div className="flex items-center justify-center gap-3 mb-4">
                {formData.age > 0 && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {formData.age} tuổi
                  </span>
                )}
                {formData.gender && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {formData.gender}
                  </span>
                )}
              </div>
            )}
            <div className="space-y-3 text-sm">
              {formData.subjects.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-gray-600 leading-relaxed flex items-center justify-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#2563EB]" />
                    <span className="font-bold text-[#0F172A]">Môn giảng dạy:</span> 
                  </p>
                  <p className="text-[#2563EB] font-bold text-lg mt-2">
                    {formData.subjects.join(', ')}
                  </p>
                </div>
              )}
              {formData.experience > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <p className="text-gray-600 leading-relaxed flex items-center justify-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-[#0F172A]">Kinh nghiệm:</span> 
                  </p>
                  <p className="text-green-600 font-bold text-lg mt-2">{formData.experience} năm</p>
                </div>
              )}
              {formData.qualification && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
                  <p className="text-gray-600 leading-relaxed">
                    <span className="font-bold text-[#0F172A]">Bằng cấp:</span> 
                  </p>
                  <p className="text-amber-600 font-bold text-base mt-2">{formData.qualification}</p>
                </div>
              )}
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-[#F1F5F9] disabled:cursor-not-allowed text-gray-600"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-[#F1F5F9] disabled:cursor-not-allowed text-gray-600"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-[#F1F5F9] disabled:cursor-not-allowed text-gray-600"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-[#F1F5F9] disabled:cursor-not-allowed text-gray-600"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Tuổi
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-[#F1F5F9] disabled:cursor-not-allowed text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Giới Tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-[#F1F5F9] disabled:cursor-not-allowed text-gray-600"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              {/* Teaching Info */}
              {(formData.teacherId || formData.qualification || formData.experience > 0 || formData.createdAt || formData.subject) && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-4">Thông Tin Giảng Dạy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.teacherId && (
                      <div>
                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Mã Giáo Viên</label>
                        <input
                          type="text"
                          value={formData.teacherId}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                        />
                      </div>
                    )}
                    {formData.subject && (
                      <div>
                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Môn Giảng Dạy</label>
                        <input
                          type="text"
                          value={formData.subject}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                        />
                      </div>
                    )}
                    {formData.qualification && (
                      <div>
                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Bằng Cấp</label>
                        <input
                          type="text"
                          value={formData.qualification}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                        />
                      </div>
                    )}
                    {formData.experience > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Kinh Nghiệm (năm)</label>
                        <input
                          type="text"
                          value={formData.experience}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-[#0F172A] mb-2">Giáo Viên Chủ Nhiệm</label>
                      <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9]">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          formData.isClassTeacher 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {formData.isClassTeacher ? '✓ Có' : '✗ Không'}
                        </span>
                      </div>
                    </div>
                    {formData.createdAt && (
                      <div>
                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Ngày Tạo Tài Khoản</label>
                        <input
                          type="text"
                          value={formData.createdAt}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F1F5F9] cursor-not-allowed text-gray-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Subjects & Classes */}
              {(formData.subjects.length > 0 || formData.classes.length > 0) && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-4">Môn Học & Lớp Giảng Dạy</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {formData.subjects.length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                          <BookOpen className="w-4 h-4 inline mr-2" />
                          Môn Học
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F1F5F9] min-h-[50px]">
                          <div className="flex flex-wrap gap-2">
                            {formData.subjects.map((subject, index) => (
                              <span 
                                key={index} 
                                className="bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {formData.classes.length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                          <Award className="w-4 h-4 inline mr-2" />
                          Lớp Giảng Dạy
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#F1F5F9] min-h-[50px]">
                          <div className="flex flex-wrap gap-2">
                            {formData.classes.map((classItem, index) => (
                              <span 
                                key={index} 
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {classItem}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons for Profile */}
              {isEditing && (
                <div className="border-t border-gray-200 pt-6 flex gap-3 justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 border-2 border-gray-300 text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] flex items-center gap-2"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4" />
                    Lưu Thay Đổi
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6 mt-6">
            {/* Notification Settings */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Thông Báo</h3>
                  <p className="text-sm text-gray-600">Quản lý cách bạn nhận thông báo</p>
                </div>
                {!isEditingSettings && (
                  <button
                    onClick={() => setIsEditingSettings(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 block">Thông báo chung</label>
                    <p className="text-xs text-gray-500 mt-1">Nhận thông báo về lớp học và bài học mới</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications')}
                    disabled={!isEditingSettings}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                    } ${!isEditingSettings ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 block">Nhắc nhở kiểm tra</label>
                    <p className="text-xs text-gray-500 mt-1">Nhận nhắc nhở trước khi có bài kiểm tra</p>
                  </div>
                  <button
                    onClick={() => handleToggle('TestReminder')}
                    disabled={!isEditingSettings}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.TestReminder ? 'bg-blue-600' : 'bg-gray-300'
                    } ${!isEditingSettings ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.TestReminder ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {isEditingSettings && (
                <div className="flex gap-3 justify-end pt-4 border-t border-blue-100 mt-4">
                  <button
                    onClick={() => setIsEditingSettings(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                  </button>
                </div>
              )}
            </div>

            {/* Security Settings */}
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-100">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Bảo mật</h3>
                  <p className="text-sm text-gray-600">Quản lý mật khẩu và bảo mật tài khoản</p>
                </div>
              </div>

              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full text-left px-4 py-3 rounded-lg bg-white hover:bg-purple-50 transition-colors flex items-center justify-between border-2 border-purple-100"
              >
                <div>
                  <label className="text-sm font-medium text-gray-900 block">Đổi mật khẩu</label>
                  <p className="text-xs text-gray-500 mt-1">Cập nhật mật khẩu để bảo mật tài khoản</p>
                </div>
                <span className="text-purple-600 text-sm font-medium">Thay đổi</span>
              </button>
            </div>

            {/* Preferences */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border-2 border-green-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-100">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Tùy chọn</h3>
                  <p className="text-sm text-gray-600">Cá nhân hóa trải nghiệm của bạn</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Chế độ tối</label>
                <p className="text-xs text-gray-500 mb-2">Chuyển sang giao diện tối để xem thoải mái hơn</p>
                <button
                  onClick={() => handleToggle('darkMode')}
                  disabled={!isEditingSettings}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.darkMode ? 'bg-green-600' : 'bg-gray-300'
                  } ${!isEditingSettings ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{passwordError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Info;
