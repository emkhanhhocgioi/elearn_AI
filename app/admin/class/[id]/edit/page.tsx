'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2,Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getClassById, updateClass } from '../../../api/class';
import { getAllTeachers, Teacher } from '../../../api/teacher';

export default function EditClassPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  const [formData, setFormData] = useState({
    class_code: '',
    class_year: '',
    teacher_id: '',
    class_avarage_grade: 0
  });

  useEffect(() => {
    const fetchData = async () => {
    try {
      setIsLoading(true);
      const [classResponse, teachersResponse] = await Promise.all([
        getClassById(classId),
        getAllTeachers()
      ]);
      
      const classData = classResponse;
      setFormData({
        class_code: classData.class_code,
        class_year: classData.class_year,
        teacher_id: classData.class_teacher?._id || '',
        class_avarage_grade: classData.class_avarage_grade
      });
      
      setTeachers(teachersResponse || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Không thể tải thông tin lớp học');
    } finally {
      setIsLoading(false);
    }
  };
    fetchData();
  }, [classId]);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.class_code || !formData.class_year) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setIsSaving(true);
      await updateClass(
        classId,
        formData.class_code,
        formData.teacher_id ,
        formData.class_year,
        formData.class_avarage_grade
      );
      
      alert('Cập nhật lớp học thành công!');
      router.push(`/admin/class/${classId}`);
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Không thể cập nhật lớp học');
    } finally {
      setIsSaving(false);
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chỉnh sửa lớp học
              </h1>
            </div>
            <p className="text-gray-600">
              Cập nhật thông tin lớp học
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <div className="space-y-6">
            {/* Class Code */}
            <div>
              <Label htmlFor="class_code" className="text-base font-semibold text-gray-900">
                Mã lớp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="class_code"
                type="text"
                value={formData.class_code}
                onChange={(e) => setFormData({ ...formData, class_code: e.target.value })}
                placeholder="Ví dụ: 10A1"
                className="mt-2"
                required
              />
            </div>

            {/* Class Year */}
            <div>
              <Label htmlFor="class_year" className="text-base font-semibold text-gray-900">
                Năm học <span className="text-red-500">*</span>
              </Label>
              <Input
                id="class_year"
                type="text"
                value={formData.class_year}
                onChange={(e) => setFormData({ ...formData, class_year: e.target.value })}
                placeholder="Ví dụ: 2024-2025"
                className="mt-2"
                required
              />
            </div>

            {/* Teacher */}
            <div>
              <Label htmlFor="teacher_id" className="text-base font-semibold text-gray-900">
                Giáo viên chủ nhiệm
              </Label>
              <select
                id="teacher_id"
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Hiện tại chưa có giáo viên chủ nhiệm --</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} - {teacher.phoneNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Average Grade */}
            <div>
              <Label htmlFor="class_avarage_grade" className="text-base font-semibold text-gray-900">
                Điểm trung bình
              </Label>
              <Input
                id="class_avarage_grade"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.class_avarage_grade}
                onChange={(e) => setFormData({ ...formData, class_avarage_grade: parseFloat(e.target.value) })}
                placeholder="Ví dụ: 8.5"
                className="mt-2"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border border-blue-700 shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSaving}
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
