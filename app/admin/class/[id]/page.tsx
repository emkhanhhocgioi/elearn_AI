'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, BookOpen, Calendar, TrendingUp, Edit, Trash2, UserPlus, FileText, BarChart3, UserCog } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getClassById, updateSubjectTeacher } from '../../api/class';
import { getAllTeachers, Teacher } from '../../api/teacher';

interface SubjectTeacher {
  _id?: string;
  name?: string;
  subject?: string;
}

interface SubjectTeachers {
  _id?: string;
  classid?: string;
  toan: SubjectTeacher | null;
  ngu_van: SubjectTeacher | null;
  tieng_anh: SubjectTeacher | null;
  vat_ly: SubjectTeacher | null;
  hoa_hoc: SubjectTeacher | null;
  sinh_hoc: SubjectTeacher | null;
  lich_su: SubjectTeacher | null;
  dia_ly: SubjectTeacher | null;
  giao_duc_cong_dan: SubjectTeacher | null;
  cong_nghe: SubjectTeacher | null;
  tin_hoc: SubjectTeacher | null;
  the_duc: SubjectTeacher | null;
  am_nhac: SubjectTeacher | null;
  my_thuat: SubjectTeacher | null;
}

interface ClassDetail {
  _id: string;
  class_code: string;
  class_subject: string;
  class_year: string;
  class_student_count: number;
  class_avarage_grade: number;
  class_teacher: string;
  teacher_name?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
  subjectTeacher?: SubjectTeachers;
}

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  
  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const fetchClassDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getClassById(classId);
      
      // Map API response to ClassDetail interface
      const apiData = response;
      setClassData({
        _id: apiData._id,
        class_code: apiData.class_code,
        class_subject: apiData.class_subject || 'Chưa xác định',
        class_year: apiData.class_year,
        class_student_count: apiData.class_student_count,
        class_avarage_grade: apiData.class_avarage_grade,
        class_teacher: apiData.class_teacher?._id,
        teacher_name: apiData.class_teacher?.name,
        status: 'active',
        created_at: apiData.created_at,
        subjectTeacher: apiData.subjectTeacher
      });
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClassDetail();
  }, [fetchClassDetail]);

  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const teachersList = await getAllTeachers();
      setTeachers(teachersList);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleChangeTeacher = (subjectKey: string) => {
    setSelectedSubject(subjectKey);
    setIsDialogOpen(true);
    fetchTeachers();
  };

  const handleSelectTeacher = async (teacherId: string) => {
    try {
      await updateSubjectTeacher(classId, selectedSubject, teacherId);
      setIsDialogOpen(false);
      // Refresh class data after update
      fetchClassDetail();
    } catch (error) {
      console.error('Error updating subject teacher:', error);
      alert('Có lỗi xảy ra khi cập nhật giáo viên');
    }
  };

  const getSubjectDisplayName = (key: string): string => {
    const subjectNames: { [key: string]: string } = {
      toan: 'Toán',
      ngu_van: 'Ngữ văn',
      tieng_anh: 'Tiếng Anh',
      vat_ly: 'Vật lý',
      hoa_hoc: 'Hóa học',
      sinh_hoc: 'Sinh học',
      lich_su: 'Lịch sử',
      dia_ly: 'Địa lý',
      giao_duc_cong_dan: 'Giáo dục công dân',
      cong_nghe: 'Công nghệ',
      tin_hoc: 'Tin học',
      the_duc: 'Thể dục',
      am_nhac: 'Âm nhạc',
      my_thuat: 'Mỹ thuật'
    };
    return subjectNames[key] || key;
  };

  const getFilteredTeachers = () => {
    if (!selectedSubject) return teachers;
    
    const subjectDisplayName = getSubjectDisplayName(selectedSubject);
    return teachers.filter(teacher => 
      teacher.subject?.toLowerCase() === subjectDisplayName.toLowerCase()
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">Không tìm thấy thông tin lớp học</p>
        <Button onClick={() => router.back()} variant="outline">
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
          onClick={() => router.back()} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {classData.class_code}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-lg">{classData.class_subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{classData.class_year}</span>
                </div>
              </div>
            </div>
            
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              classData.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {classData.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Số học sinh</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{classData.class_student_count}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Điểm trung bình</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{classData.class_avarage_grade.toFixed(1)}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Giáo viên chủ nhiệm</h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">{classData.teacher_name || 'Hiện tại chưa có giáo viên chủ nhiệm'}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Năm học</h3>
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {classData.class_year}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Button 
     
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => router.push(`/admin/class/${classId}/addstudent`)}
        >
          <UserPlus className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Thêm học sinh</div>
            <div className="text-sm opacity-90">Đăng ký học sinh vào lớp</div>
          </div>
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => router.push(`/admin/class/${classId}/studentlist`)}
        >
          <FileText className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Danh sách học sinh</div>
            <div className="text-sm opacity-90">Xem và quản lý học sinh</div>
          </div>
        </Button>

        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => alert('Chức năng đang phát triển')}
        >
          <BarChart3 className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Thống kê điểm</div>
            <div className="text-sm opacity-90">Xem báo cáo và thống kê</div>
          </div>
        </Button>

        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => alert('Chức năng đang phát triển')}
        >
          <BookOpen className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Tài liệu học tập</div>
            <div className="text-sm opacity-90">Quản lý tài liệu và bài giảng</div>
          </div>
        </Button>

        <Button 
          className="bg-yellow-600 hover:bg-yellow-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => router.push(`/admin/class/${classId}/edit`)}
        >
          <Edit className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Chỉnh sửa thông tin</div>
            <div className="text-sm opacity-90">Cập nhật thông tin lớp học</div>
          </div>
        </Button>

        <Button 
          className="bg-red-600 hover:bg-red-700 text-white p-6 h-auto flex flex-col items-start gap-2"
          onClick={() => alert('Chức năng đang phát triển')}
        >
          <Trash2 className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold text-lg">Xóa lớp học</div>
            <div className="text-sm opacity-90">Xóa lớp học khỏi hệ thống</div>
          </div>
        </Button>
      </div>

      {/* Class Information Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Mã lớp</p>
            <p className="text-base font-semibold text-gray-900">{classData.class_code}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Năm học</p>
            <p className="text-base font-semibold text-gray-900">{classData.class_year}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Giáo viên chủ nhiệm</p>
            <p className="text-base font-semibold text-gray-900">{classData.teacher_name || 'Hiện tại chưa có giáo viên chủ nhiệm'}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Tổng số học sinh</p>
            <p className="text-base font-semibold text-gray-900">{classData.class_student_count} học sinh</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
            <p className="text-base font-semibold text-gray-900">
              {classData.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
          </div>
        </div>
      </div>

      {/* Subject Teachers Table */}
      {classData.subjectTeacher && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Giáo viên bộ môn</h2>
            <UserCog className="w-6 h-6 text-blue-600" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">STT</TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead>Giáo viên</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(classData.subjectTeacher)
                  .filter(([key]) => key !== '_id' && key !== 'classid' && key !== '__v')
                  .map(([key, value], index) => {
                    const teacherInfo = value;
                    const teacherName = teacherInfo?.name || 'Chưa thêm giáo viên';
                    
                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{getSubjectDisplayName(key)}</TableCell>
                        <TableCell>
                          <span className={teacherInfo ? 'text-gray-900 font-medium' : 'text-gray-400 italic'}>
                            {teacherName}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleChangeTeacher(key)}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
                          >
                            <UserCog className="w-4 h-4 mr-1" />
                            Thay đổi
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Teacher Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chọn giáo viên cho môn {getSubjectDisplayName(selectedSubject)}</DialogTitle>
            <DialogDescription>
              Chọn giáo viên phù hợp từ danh sách bên dưới để thay thế cho môn học này.
            </DialogDescription>
          </DialogHeader>
          
          {loadingTeachers ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên giáo viên</TableHead>
                    <TableHead>Môn dạy</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredTeachers().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Không có giáo viên nào phù hợp với môn {getSubjectDisplayName(selectedSubject)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    getFilteredTeachers().map((teacher) => (
                      <TableRow key={teacher._id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.phoneNumber || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleSelectTeacher(teacher._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Chọn
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}