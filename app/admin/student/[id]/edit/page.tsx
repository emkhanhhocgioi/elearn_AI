'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getStudentById, updateStudent } from '@/app/admin/api/student';
import { getAllClasses } from '@/app/admin/api/class';

interface StudentFormData {
  name: string;
  email: string;
  classid: string;
  DOB: string;
  avatar: string;
  password?: string;
  parentContact: string;
  academic_performance: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  conduct: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  averageScore: number;
}

interface ClassData {
  _id: string;
  class_code: string;
  class_year?: string;
  class_teacher?: {
    _id: string;
    name: string;
  }
}

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    classid: '',
    DOB: '',
    avatar: '',
    password: '',
    parentContact: '',
    academic_performance: 'Tốt',
    conduct: 'Tốt',
    averageScore: 0,
  });
  
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [showClassDialog, setShowClassDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});

  useEffect(() => {
    const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      const response = await getStudentById(studentId);
      const apiData = response.student;
      
      setFormData({
        name: apiData.name || '',
        email: apiData.email || '',
        classid: apiData.classid || '',
        DOB: apiData.DOB || '',
        avatar: apiData.avatar || '',
        password: '',
        parentContact: apiData.parentContact || '',
        academic_performance: apiData.academic_performance || 'Tốt',
        conduct: apiData.conduct || 'Tốt',
        averageScore: apiData.averageScore || 0,
      });
      
      // Set selected class if classid exists
      if (apiData.classid && classes.length > 0) {
        const foundClass = classes.find(c => c._id === apiData.classid);
        if (foundClass) {
          setSelectedClass(foundClass);
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      alert('Không thể tải thông tin học sinh');
    } finally {
      setIsLoading(false);
    }
  };

    fetchStudentData();
    fetchClasses();
  }, [studentId]);

  
  const fetchClasses = async () => {
    try {
      const response = await getAllClasses();
      console.log('Fetched classes:', response.data);  
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const sortClasses = (classesToSort: ClassData[]) => {
    return [...classesToSort].sort((a, b) => {
      const yearA = a.class_year || '';
      const yearB = b.class_year || '';
      
      if (sortOrder === 'asc') {
        return yearA.localeCompare(yearB);
      } else {
        return yearB.localeCompare(yearA);
      }
    });
  };

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Update selected class when classes are loaded
  useEffect(() => {
    if (formData.classid && classes.length > 0) {
      const foundClass = classes.find(c => c._id === formData.classid);
      if (foundClass) {
        setSelectedClass(foundClass);
      }
    }
  }, [classes, formData.classid]);

  const handleClassSelect = (classItem: ClassData) => {
    setSelectedClass(classItem);
    setFormData(prev => ({
      ...prev,
      classid: classItem._id
    }));
    setShowClassDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name as keyof StudentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.classid.trim()) {
      newErrors.classid = 'Vui lòng chọn lớp học';
    }
    
    if (!formData.DOB.trim()) {
      newErrors.DOB = 'Vui lòng nhập ngày sinh';
    }
    
    if (!formData.parentContact.trim()) {
      newErrors.parentContact = 'Vui lòng nhập số điện thoại phụ huynh';
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
      // Remove password field if empty
      const updateData = { ...formData };
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
      }
      
      await updateStudent(studentId, updateData);
      alert('Cập nhật thông tin học sinh thành công!');
      router.push(`/admin/student/${studentId}`);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin học sinh');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.')) {
      router.push(`/admin/student/${studentId}`);
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
            Chỉnh sửa thông tin học sinh
          </h1>
          <p className="text-gray-600 mt-2">
            Cập nhật thông tin chi tiết của học sinh
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
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
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
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.DOB ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.DOB && (
              <p className="text-red-500 text-sm mt-1">{errors.DOB}</p>
            )}
          </div>

          {/* Số điện thoại phụ huynh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại phụ huynh <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="parentContact"
              value={formData.parentContact}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.parentContact ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số điện thoại phụ huynh"
            />
            {errors.parentContact && (
              <p className="text-red-500 text-sm mt-1">{errors.parentContact}</p>
            )}
          </div>

          {/* Lớp học */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lớp học <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedClass ? `${selectedClass.class_code} - ${selectedClass.class_year || ''} - ${selectedClass.class_teacher?.name || 'Chưa có giáo viên'}` : ''}
                readOnly
                className={`flex-1 px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 ${
                  errors.classid ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Chưa chọn lớp"
              />
              <Button
                type="button"
                onClick={() => setShowClassDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                <List className="w-4 h-4 mr-2" />
                Chọn lớp
              </Button>
            </div>
            {errors.classid && (
              <p className="text-red-500 text-sm mt-1">{errors.classid}</p>
            )}
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar URL
            </label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập đường dẫn avatar"
            />
          </div>

          {/* Học lực */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Học lực
            </label>
            <select
              name="academic_performance"
              value={formData.academic_performance}
              onChange={(e) => setFormData(prev => ({ ...prev, academic_performance: e.target.value as 'Tốt' }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Tốt">Tốt</option>
              <option value="Khá">Khá</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Yếu">Yếu</option>
            </select>
          </div>

          {/* Hạnh kiểm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hạnh kiểm
            </label>
            <select
              name="conduct"
              value={formData.conduct}
              onChange={(e) => setFormData(prev => ({ ...prev, conduct: e.target.value as 'Tốt' }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Tốt">Tốt</option>
              <option value="Khá">Khá</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Yếu">Yếu</option>
            </select>
          </div>

          {/* Điểm trung bình */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điểm trung bình
            </label>
            <input
              type="number"
              name="averageScore"
              value={formData.averageScore}
              onChange={(e) => setFormData(prev => ({ ...prev, averageScore: parseFloat(e.target.value) || 0 }))}
              step="0.1"
              min="0"
              max="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập điểm trung bình"
            />
          </div>

          {/* Mật khẩu mới */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới (để trống nếu không muốn thay đổi)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mật khẩu mới"
            />
            <p className="text-sm text-gray-500 mt-1">
              Chỉ nhập mật khẩu nếu bạn muốn thay đổi mật khẩu hiện tại
            </p>
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

      {/* Class Selection Dialog */}
      {showClassDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Dialog Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Chọn lớp học</h2>
              <button
                onClick={() => setShowClassDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {classes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mã lớp</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          <button
                            onClick={handleSortToggle}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            Năm học
                            <span className="text-xs">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giáo viên</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortClasses(classes).map((classItem) => (
                        <tr
                          key={classItem._id}
                          className={`hover:bg-blue-50 transition-colors ${
                            selectedClass?._id === classItem._id ? 'bg-blue-100' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                            {classItem._id.substring(0, 8)}...
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {classItem.class_code}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {classItem.class_year || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {classItem.class_teacher?.name || 'Chưa có giáo viên'}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              type="button"
                              onClick={() => handleClassSelect(classItem)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Chọn
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Không có lớp học nào</p>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <Button
                type="button"
                onClick={() => setShowClassDialog(false)}
                variant="outline"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
