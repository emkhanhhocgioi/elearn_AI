'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar, Award, Edit, Trash2, Mail, GraduationCap, UserCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getStudentById, deleteStudentById } from '../../api/student';

interface StudentDetail {
  _id: string;
  name: string;
  email: string;
  password?: string;
  class: string;
  grade: string;
  academic_performance: string;
  conduct: string;
  subjects: {
    math: number;
    literature: number;
    english: number;
    physics: number;
    chemistry: number;
    biology: number;
    history: number;
    geography: number;
  };
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  
  const [studentData, setStudentData] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId]);

  const fetchStudentDetail = async () => {
    try {
      setIsLoading(true);
      const response = await getStudentById(studentId);
      console.log('Student API response:', response);
      
      // Map API response to StudentDetail interface
      const apiData = response.student;
      console.log('Mapped Student Data:', apiData);
      setStudentData(apiData);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const response = await deleteStudentById(id);
      if (response) {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Xuất sắc':
        return 'bg-purple-100 text-purple-700';
      case 'Giỏi':
        return 'bg-blue-100 text-blue-700';
      case 'Khá':
        return 'bg-green-100 text-green-700';
      case 'Trung bình':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getConductColor = (conduct: string) => {
    switch (conduct) {
      case 'Tốt':
        return 'bg-green-100 text-green-700';
      case 'Khá':
        return 'bg-blue-100 text-blue-700';
      case 'Trung bình':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-purple-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 6.5) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">Không tìm thấy thông tin học sinh</p>
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
                  {studentData.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-lg">Lớp {studentData.class}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Khối {studentData.grade}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPerformanceColor(studentData.academic_performance)}`}>
                {studentData.academic_performance}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getConductColor(studentData.conduct)}`}>
                Hạnh kiểm: {studentData.conduct}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Điểm trung bình</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(studentData.averageScore)}`}>
            {studentData.averageScore.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Tổng kết</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Học lực</h3>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">{studentData.academic_performance}</p>
          <p className="text-sm text-gray-500 mt-1">Xếp loại</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Hạnh kiểm</h3>
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">{studentData.conduct}</p>
          <p className="text-sm text-gray-500 mt-1">Đánh giá</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Lớp học</h3>
            <GraduationCap className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">{studentData.class}</p>
          <p className="text-sm text-gray-500 mt-1">Khối {studentData.grade}</p>
        </div>
      </div>

      {/* Subject Scores */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Điểm số các môn học</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
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
              <p className="text-base font-semibold text-gray-900">{studentData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="text-base font-semibold text-gray-900">
                {new Date(studentData.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button 
          className="bg-yellow-600 hover:bg-yellow-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => router.push(`/admin/student/${studentId}/edit`)}
        >
          <Edit className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Chỉnh sửa thông tin</div>
            <div className="text-sm opacity-90">Cập nhật thông tin học sinh</div>
          </div>
        </Button>

        <Button 
          className="bg-red-600 hover:bg-red-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => {
            if (confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
              handleDeleteStudent(studentId);
            }
          }}
        >
          <Trash2 className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Xóa học sinh</div>
            <div className="text-sm opacity-90">Xóa khỏi hệ thống</div>
          </div>
        </Button>
      </div>

      {/* Student Information Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
            <p className="text-base font-semibold text-gray-900">{studentData.name}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-base font-semibold text-gray-900">{studentData.email}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Lớp</p>
            <p className="text-base font-semibold text-gray-900">{studentData.class}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Khối</p>
            <p className="text-base font-semibold text-gray-900">{studentData.grade}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Học lực</p>
            <p className="text-base font-semibold text-gray-900">{studentData.academic_performance}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Hạnh kiểm</p>
            <p className="text-base font-semibold text-gray-900">{studentData.conduct}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Điểm trung bình</p>
            <p className={`text-base font-semibold ${getScoreColor(studentData.averageScore)}`}>
              {studentData.averageScore.toFixed(2)}
            </p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Ngày cập nhật</p>
            <p className="text-base font-semibold text-gray-900">
              {new Date(studentData.updatedAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
