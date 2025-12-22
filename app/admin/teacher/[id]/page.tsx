'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, BookOpen, Calendar, Award, Edit, Trash2, Mail, Phone, UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getTeacherById , deleteTeacher } from '../../api/teacher';

interface TeacherDetail {
  _id: string;
  name: string;
  age: number;
  gender: string;
  subject: string;
  classInCharge?: string;
  phoneNumber?: string;
  email: string;
  yearsOfExperience?: number;
  status?: 'active' | 'inactive';
  created_at?: string;
}

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;
  
  const [teacherData, setTeacherData] = useState<TeacherDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherDetail = async () => {
    try {
      setIsLoading(true);
      const response = await getTeacherById(teacherId);
      console.log('Teacher API response:', response);   
      // Map API response to TeacherDetail interface
      const apiData = response.teacher;
      console.log('Mapped Teacher Data:', apiData);
      setTeacherData({
        _id: apiData._id,
        name: apiData.name,
        age: apiData.age,
        gender: apiData.gender,
        subject: apiData.subject,
        classInCharge: apiData.classInCharge || 'Chưa phân công',
        phoneNumber: apiData.phoneNumber || 'Chưa cập nhật',
        email: apiData.email,
        yearsOfExperience: apiData.yearsOfExperience || 0,
        status: 'active',
        created_at: apiData.created_at
      });
    } catch (error) {
      console.error('Error fetching teacher details:', error);
    } finally {
      setIsLoading(false);
    }
  };

    fetchTeacherDetail();
  }, [teacherId]);

  
  const deleteTeacherById = async (id: string) => {
    try {
        const response = await deleteTeacher(id);
        if(response){
        
          router.push('/admin/dashboard');
        }  
    } catch (error) {
        console.error('Error deleting teacher:', error);
        
    }
}
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">Không tìm thấy thông tin giáo viên</p>
        <Button onClick={() => router.push('/admin/dashboard')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={() => router.push('/admin/dashboard')} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {teacherData.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-lg">{teacherData.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>{teacherData.yearsOfExperience} năm kinh nghiệm</span>
                  </div>
                </div>
              </div>
            </div>
            
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              teacherData.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {teacherData.status === 'active' ? 'Đang công tác' : 'Không hoạt động'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Tuổi</h3>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{teacherData.age}</p>
          <p className="text-sm text-gray-500 mt-1">tuổi</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Kinh nghiệm</h3>
            <Award className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{teacherData.yearsOfExperience}</p>
          <p className="text-sm text-gray-500 mt-1">năm</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Môn giảng dạy</h3>
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">{teacherData.subject}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Lớp chủ nhiệm</h3>
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {teacherData.classInCharge || 'Chưa có'}
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin liên hệ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-semibold text-gray-900">{teacherData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="text-base font-semibold text-gray-900">{teacherData.phoneNumber || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => router.push(`/admin/teacher/${teacherId}/classes`)}
        >
          <Users className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Danh sách lớp</div>
            <div className="text-sm opacity-90">Xem các lớp giảng dạy</div>
          </div>
        </Button>

       
        

     
        <Button 
          className="bg-yellow-600 hover:bg-yellow-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => router.push(`/admin/teacher/${teacherId}/edit`)}
        >
          <Edit className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Chỉnh sửa thông tin</div>
            <div className="text-sm opacity-90">Cập nhật thông tin giáo viên</div>
          </div>
        </Button>

        <Button 
          className="bg-red-600 hover:bg-red-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => {
            if (confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
                deleteTeacherById(teacherId);
            }
          }}
        >
          <Trash2 className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Xóa giáo viên</div>
            <div className="text-sm opacity-90">Xóa khỏi hệ thống</div>
          </div>
        </Button>
      </div>

      {/* Teacher Information Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
            <p className="text-base font-semibold text-gray-900">{teacherData.name}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Giới tính</p>
            <p className="text-base font-semibold text-gray-900">
              {teacherData.gender === 'Nam' ? 'Nam' : teacherData.gender === 'Nữ' ? 'Nữ' : 'Khác'}
            </p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Tuổi</p>
            <p className="text-base font-semibold text-gray-900">{teacherData.age} tuổi</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Môn giảng dạy</p>
            <p className="text-base font-semibold text-gray-900">{teacherData.subject}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Lớp chủ nhiệm</p>
            <p className="text-base font-semibold text-gray-900">{teacherData.classInCharge || 'Chưa phân công'}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Số năm kinh nghiệm</p>
            <p className="text-base font-semibold text-gray-900">{teacherData.yearsOfExperience} năm</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-base font-semibold text-gray-900">{teacherData.email}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
            <p className="text-base font-semibold text-gray-900">{teacherData.phoneNumber || 'Chưa cập nhật'}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
            <p className="text-base font-semibold text-gray-900">
              {teacherData.status === 'active' ? 'Đang công tác' : 'Không hoạt động'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
