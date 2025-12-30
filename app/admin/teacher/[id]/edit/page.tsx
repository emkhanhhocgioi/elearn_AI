'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getTeacherById, updateTeacher } from '@/app/admin/api/teacher';

interface TeacherFormData {
  name: string;
  age: number;
  gender: string;
  subject: string;
  classInCharge?: string;
  phoneNumber?: string;
  email: string;
  yearsOfExperience?: number;
}

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;
  
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    age: 0,
    gender: 'male',
    subject: '',
    classInCharge: '',
    phoneNumber: '',
    email: '',
    yearsOfExperience: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<TeacherFormData>>({});

  useEffect(() => {
    const fetchTeacherData = async () => {
    try {
      setIsLoading(true);
      const response = await getTeacherById(teacherId);
      const apiData = response.teacher;
      
      setFormData({
        name: apiData.name || '',
        age: apiData.age || 0,
        gender: apiData.gender || 'male',
        subject: apiData.subject || '',
        classInCharge: apiData.classInCharge || '',
        phoneNumber: apiData.phoneNumber || '',
        email: apiData.email || '',
        yearsOfExperience: apiData.yearsOfExperience || 0,
      });
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      alert('Không thể tải thông tin giáo viên');
    } finally {
      setIsLoading(false);
    }
  };
    fetchTeacherData();
  }, [teacherId]);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'yearsOfExperience' ? Number(value) : value
    }));
    // Clear error for this field
    if (errors[name as keyof TeacherFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TeacherFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên' as string;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email' as string;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ' as string;
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập môn giảng dạy' as string;
    }
    
    if (formData.age <= 0) {
      newErrors.age = 0 as number;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSaving(true);
      await updateTeacher(teacherId, formData);
      alert('Cập nhật thông tin giáo viên thành công!');
      router.push(`/admin/teacher/${teacherId}`);
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin giáo viên');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.')) {
      router.push(`/admin/teacher/${teacherId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={() => router.back()} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Chỉnh sửa thông tin giáo viên
          </h1>
          <p className="text-gray-600 mt-2">
            Cập nhật thông tin chi tiết của giáo viên
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập họ và tên"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name as string}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email as string}</p>
            )}
          </div>

          {/* Tuổi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tuổi <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tuổi"
              min="1"
            />
           
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Môn giảng dạy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Môn giảng dạy <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập môn giảng dạy"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject as string}</p>
            )}
          </div>

          {/* Số năm kinh nghiệm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số năm kinh nghiệm
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập số năm kinh nghiệm"
              min="0"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Lớp chủ nhiệm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lớp chủ nhiệm
            </label>
            <input
              type="text"
              name="classInCharge"
              value={formData.classInCharge}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập lớp chủ nhiệm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-end">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="px-6 py-2"
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
