'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, BookOpen, Calendar, TrendingUp, Edit, Trash2, UserPlus, FileText, BarChart3, UserCog, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getClassById, updateSubjectTeacher, getClassSchedule, ClassScheduleResponse } from '../../api/class';
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
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [classSchedule, setClassSchedule] = useState<ClassScheduleResponse | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

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

  const fetchClassSchedule = async () => {
    try {
      setLoadingSchedule(true);
      const schedule = await getClassSchedule(classId);
      setClassSchedule(schedule);
    } catch (error) {
      console.error('Error fetching class schedule:', error);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleViewSchedule = () => {
    router.push(`/admin/class/${classId}/schedule/manage`);
  };

  const getDayDisplayName = (day: string): string => {
    const dayNames: { [key: string]: string } = {
      Mon: 'Thứ 2',
      Tue: 'Thứ 3',
      Wed: 'Thứ 4',
      Thu: 'Thứ 5',
      Fri: 'Thứ 6',
      Sat: 'Thứ 7',
      Sun: 'Chủ nhật'
    };
    return dayNames[day] || day;
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {classData.class_code}
              </h1>
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-base">{classData.class_subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-base">{classData.class_year}</span>
                </div>
              </div>
            </div>
            
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              classData.status === 'active' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-gray-50 text-gray-700 border border-gray-200'
            }`}>
              {classData.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Số học sinh</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{classData.class_student_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Điểm trung bình</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{classData.class_avarage_grade.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600">GVCN</h3>
              <p className="text-base font-semibold text-gray-900 mt-1 truncate">{classData.teacher_name || 'Chưa có'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Năm học</h3>
              <p className="text-base font-semibold text-gray-900 mt-1">{classData.class_year}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-sm border border-blue-700 transition-all hover:shadow-md flex items-start gap-4 text-left"
          onClick={() => router.push(`/admin/class/${classId}/addstudent`)}
        >
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-lg mb-1">Thêm học sinh</div>
            <div className="text-sm text-blue-100">Đăng ký học sinh vào lớp</div>
          </div>
        </button>
        
        <button 
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-sm border border-green-700 transition-all hover:shadow-md flex items-start gap-4 text-left"
          onClick={() => router.push(`/admin/class/${classId}/studentlist`)}
        >
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-lg mb-1">Danh sách học sinh</div>
            <div className="text-sm text-green-100">Xem và quản lý học sinh</div>
          </div>
        </button>

        <button 
          className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-lg shadow-sm border border-orange-700 transition-all hover:shadow-md flex items-start gap-4 text-left"
          onClick={() => alert('Chức năng đang phát triển')}
        >
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-lg mb-1">Tài liệu học tập</div>
            <div className="text-sm text-orange-100">Quản lý tài liệu và bài giảng</div>
          </div>
        </button>

        <button 
          className="bg-amber-600 hover:bg-amber-700 text-white p-6 rounded-lg shadow-sm border border-amber-700 transition-all hover:shadow-md flex items-start gap-4 text-left"
          onClick={() => router.push(`/admin/class/${classId}/edit`)}
        >
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Edit className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-lg mb-1">Chỉnh sửa thông tin</div>
            <div className="text-sm text-amber-100">Cập nhật thông tin lớp học</div>
          </div>
        </button>

        <button 
          className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-lg shadow-sm border border-red-700 transition-all hover:shadow-md flex items-start gap-4 text-left"
          onClick={() => alert('Chức năng đang phát triển')}
        >
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-lg mb-1">Xóa lớp học</div>
            <div className="text-sm text-red-100">Xóa lớp học khỏi hệ thống</div>
          </div>
        </button>

        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-lg shadow-sm border border-indigo-700 transition-all hover:shadow-md flex items-start gap-4 text-left"
          onClick={handleViewSchedule}
        >
          <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-lg mb-1">Lịch dạy học</div>
            <div className="text-sm text-indigo-100">Xem và quản lý thời khóa biểu</div>
          </div>
        </button>
      </div>

      {/* Class Information Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Mã lớp</p>
            <p className="text-base font-semibold text-gray-900">{classData.class_code}</p>
          </div>
          <div className="pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Năm học</p>
            <p className="text-base font-semibold text-gray-900">{classData.class_year}</p>
          </div>
          <div className="pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Giáo viên chủ nhiệm</p>
            <p className="text-base font-semibold text-gray-900">{classData.teacher_name || 'Chưa có GVCN'}</p>
          </div>
          <div className="pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Tổng số học sinh</p>
            <p className="text-base font-semibold text-gray-900">{classData.class_student_count} học sinh</p>
          </div>
          <div className="pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Trạng thái</p>
            <p className="text-base font-semibold text-gray-900">
              {classData.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
          </div>
        </div>
      </div>

      {/* Subject Teachers Table */}
      {classData.subjectTeacher && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <UserCog className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Giáo viên bộ môn</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="w-[80px] font-semibold text-gray-700">STT</TableHead>
                  <TableHead className="font-semibold text-gray-700">Môn học</TableHead>
                  <TableHead className="font-semibold text-gray-700">Giáo viên</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Hành động</TableHead>
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

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Thời khóa biểu lớp {classData?.class_code}</DialogTitle>
            <DialogDescription>
              Lịch giảng dạy của các môn học trong tuần
            </DialogDescription>
          </DialogHeader>
          
          {loadingSchedule ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : classSchedule ? (
            <div className="mt-4 space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">
                    Tổng số: {classSchedule.totalSchedules} tiết học
                  </span>
                </div>
              </div>

              {/* Schedule by Day */}
              <div className="space-y-4">
                {Object.entries(classSchedule.schedules).map(([day, schedules]) => (
                  schedules.length > 0 && (
                    <div key={day} className="border rounded-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          {getDayDisplayName(day)}
                        </h3>
                      </div>
                      <div className="p-4 bg-white">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[120px]">Thời gian</TableHead>
                              <TableHead>Môn học</TableHead>
                              <TableHead>Giáo viên</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Học kỳ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {schedules.map((schedule, idx) => (
                              <TableRow key={schedule.scheduleId || idx}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">
                                      {schedule.timeSlot.startTime} - {schedule.timeSlot.endTime}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium text-gray-900">
                                    {schedule.subject || 'N/A'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <p>{schedule.teacher?.name || 'N/A'}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-gray-600 text-sm">
                                  {schedule.teacher?.email || 'N/A'}
                                </TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                                    {schedule.semester}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {classSchedule.totalSchedules === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Chưa có lịch dạy học</p>
                  <p className="text-sm mt-2">Vui lòng thêm lịch dạy cho lớp học này</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setScheduleDialogOpen(false)}
                >
                  Đóng
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setScheduleDialogOpen(false);
                    router.push(`/admin/class/${classId}/schedule/manage`);
                  }}
                >
                  Quản lý lịch dạy
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không thể tải lịch dạy học
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}