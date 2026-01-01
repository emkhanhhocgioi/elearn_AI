'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Calendar, Clock, Users, BookOpen, Trash2, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  getClassById, 
  getClassSchedule, 
  assignTeacherToTimeSlot, 
  getAllTimeSlots,
  AssignTeacherToTimeSlotData,
  ClassScheduleResponse,
  TimeSlot 
} from '../../../../api/class';
import { getAllTeachers, Teacher } from '../../../../api/teacher';

interface SubjectTeacher {
  _id?: string;
  name?: string;
  subject?: string;
}

interface SubjectTeachers {
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
  [key: string]: SubjectTeacher | null;
}

interface ClassDetail {
  _id: string;
  class_code: string;
  class_year: string;
  subjectTeacher?: SubjectTeachers;
}

// Type-safe days array
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
const DAYS_OF_WEEK: readonly DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export default function ScheduleManagementPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [schedule, setSchedule] = useState<ClassScheduleResponse | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [time_slot, set_time_slot] = useState<TimeSlot[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ day: DayOfWeek; period: number } | null>(null);
  // Form state
  const [formData, setFormData] = useState({
    subjectField: '',
    teacherId: '',
    timeSlotId: '',
    semester: ''
  });

  useEffect(() => {
    fetchData();
  }, [classId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [classRes, scheduleRes, teachersRes,time_slots] = await Promise.all([
        getClassById(classId),
        getClassSchedule(classId).catch(() => null),
        getAllTeachers(),
        getAllTimeSlots()
      ]);
      console.log("schedule" , scheduleRes?.schedules)
      set_time_slot(time_slots);
      setClassData(classRes);
      setSchedule(scheduleRes);
      setTeachers(teachersRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
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

  const handleOpenDialog = (day?: DayOfWeek, period?: number) => {
    // Find the time slot for this day and period
    let preselectedTimeSlotId = '';
    if (day && period) {
      const matchingSlot = time_slot.find(
        slot => slot.dayOfWeek === day && slot.period === period
      );
      if (matchingSlot) {
        preselectedTimeSlotId = matchingSlot._id;
      }
      setSelectedCell({ day, period });
    } else {
      setSelectedCell(null);
    }

    setFormData({
      subjectField: '',
      teacherId: '',
      timeSlotId: preselectedTimeSlotId,
      semester: ''
    });
    setIsDialogOpen(true);
  };

  const handleCellClick = (day: DayOfWeek, period: number, hasSchedule: boolean) => {
    if (!hasSchedule) {
      handleOpenDialog(day, period);
    }
  };

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subjectField: value }));
    
    // Auto-select teacher if subject has assigned teacher
    if (classData?.subjectTeacher && classData.subjectTeacher[value]) {
      const subjectTeacher = classData.subjectTeacher[value];
      if (subjectTeacher?._id) {
        setFormData(prev => ({ ...prev, teacherId: subjectTeacher._id! }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subjectField || !formData.teacherId || !formData.timeSlotId || !formData.semester) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get subjectId from subjectTeacher
      const subjectTeacher = classData?.subjectTeacher?.[formData.subjectField];
      if (!subjectTeacher?._id) {
        alert('Không tìm thấy thông tin môn học');
        return;
      }

      const assignData: AssignTeacherToTimeSlotData = {
        teacherId: formData.teacherId,
        classId: classId,
        subjectId: subjectTeacher._id,
        timeSlotId: formData.timeSlotId,
        semester: formData.semester
      };

      await assignTeacherToTimeSlot(assignData);
      alert('Thêm lịch dạy thành công!');
      setIsDialogOpen(false);
      fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error assigning teacher:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi thêm lịch dạy');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableSubjects = () => {
    if (!classData?.subjectTeacher) return [];
    
    return Object.entries(classData.subjectTeacher)
      .filter(([key, value]) => key !== '_id' && key !== 'classid' && key !== '__v' && value !== null)
      .map(([key, value]) => ({
        key,
        displayName: getSubjectDisplayName(key),
        teacherId: value?._id || '',
        teacherName: value?.name || ''
      }));
  };

  const getFilteredTeachers = () => {
    if (!formData.subjectField) return teachers;
    
    const subjectDisplayName = getSubjectDisplayName(formData.subjectField);
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
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý lịch dạy học
                </h1>
              </div>
              <div className="flex items-center gap-6 text-gray-600 ml-15">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-base font-medium">{classData?.class_code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-base">{classData?.class_year}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 ml-15 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 inline-block">
                💡 Nhấp vào ô trống trong thời khóa biểu để thêm lịch dạy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Schedule */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thời khóa biểu hiện tại</h2>
        
        {time_slot && time_slot.length > 0 ? (
          <div className="min-w-[1200px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600">
                  <th className="border border-gray-300 px-4 py-3 text-white font-semibold text-center w-[100px]">
                    TIẾT
                  </th>
                  {DAYS_OF_WEEK.map((day) => (
                    <th 
                      key={day} 
                      className="border border-gray-300 px-4 py-3 text-white font-semibold text-center"
                    >
                      {getDayDisplayName(day).toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((period) => {
                  // Find timeslots for this period
                  const periodSlots = time_slot.filter(slot => slot.period === period);
                  
                  return (
                    <tr key={period} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 bg-gray-50">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500">TIẾT</span>
                          <span className="text-lg font-bold">{period}</span>
                        </div>
                      </td>
                      
                      {DAYS_OF_WEEK.map((day) => {
                        // Fixed: Using type-safe day access
                        const daySchedules = schedule?.schedules?.[day] || [];
                        const periodSlot = periodSlots.find(slot => slot.dayOfWeek === day);
                        const scheduleItem = daySchedules.find(item => {
                          const matchingSlot = time_slot.find(slot => 
                            slot.startTime === item.timeSlot.startTime && 
                            slot.endTime === item.timeSlot.endTime
                          );
                          return matchingSlot?.period === period;
                        });
                        
                        const hasSchedule = !!scheduleItem;
                        
                        return (
                          <td 
                            key={`${day}-${period}`} 
                            className={`border border-gray-300 px-3 py-2 text-center align-top transition-all duration-200 ${
                              !hasSchedule ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm' : 'bg-white'
                            }`}
                            onClick={() => handleCellClick(day, period, hasSchedule)}
                          >
                            {scheduleItem ? (
                              <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                                <div className="font-semibold text-blue-700 text-sm">
                                  {scheduleItem.subject || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {scheduleItem.teacher?.name || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {scheduleItem.timeSlot?.startTime} - {scheduleItem.timeSlot?.endTime}
                                </div>
                                <div className="inline-block px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs border border-purple-200">
                                  {scheduleItem.semester}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="mt-1 h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200"
                                  onClick={() => alert('Chức năng xóa đang phát triển')}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 py-2 hover:text-blue-600 transition-colors min-h-[70px] flex items-center justify-center">
                                {periodSlot ? (
                                  <div className="space-y-1.5">
                                    <div className="text-gray-500 text-xs">{periodSlot.startTime} - {periodSlot.endTime}</div>
                                    <div className="flex items-center justify-center gap-1.5 text-blue-600 font-medium">
                                      <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center border border-blue-200">
                                        <Plus className="w-4 h-4" />
                                      </div>
                                      <span className="text-xs">Thêm lịch</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-gray-300 text-base">—</div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Chưa có lịch dạy học</p>
            <p className="text-sm mt-2">Nhấp vào ô trong bảng để thêm lịch dạy</p>
          </div>
        )}
      </div>

      {/* Add Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setSelectedCell(null);
      }}>
        <DialogContent className="max-w-2xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl">Thêm lịch dạy mới</DialogTitle>
            <DialogDescription className="text-base">
              {selectedCell ? (
                <span>
                  Thêm lịch dạy cho <strong className="text-blue-600">{getDayDisplayName(selectedCell.day)} - Tiết {selectedCell.period}</strong> - Lớp {classData?.class_code}
                </span>
              ) : (
                <span>Điền thông tin để thêm lịch dạy cho lớp {classData?.class_code}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Subject Selection */}
            <div className="space-y-2">
              <Label htmlFor="subject">Môn học *</Label>
              <Select 
                value={formData.subjectField} 
                onValueChange={handleSubjectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSubjects().map(subject => (
                    <SelectItem key={subject.key} value={subject.key}>
                      {subject.displayName}
                      {subject.teacherName && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({subject.teacherName})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Teacher Selection */}
            <div className="space-y-2">
              <Label htmlFor="teacher">Giáo viên *</Label>
              <Select 
                value={formData.teacherId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, teacherId: value }))}
                disabled={!formData.subjectField}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giáo viên" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredTeachers().map(teacher => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.name} - {teacher.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-2">
              <Label htmlFor="timeslot">Khung giờ *</Label>
              <Select 
                value={formData.timeSlotId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, timeSlotId: value }))}
                disabled={!!selectedCell}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khung giờ" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {time_slot
                    .filter(slot => !selectedCell || (slot.dayOfWeek === selectedCell.day && slot.period === selectedCell.period))
                    .map((slot) => (
                      <SelectItem key={slot._id} value={slot._id}>
                        {getDayDisplayName(slot.dayOfWeek)} - Tiết {slot.period} ({slot.startTime} - {slot.endTime}) - {slot.session === 'morning' ? 'Sáng' : 'Chiều'}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedCell && (
                <p className="text-xs text-blue-600">
                  Đã chọn: {getDayDisplayName(selectedCell.day)} - Tiết {selectedCell.period}
                </p>
              )}
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <Label htmlFor="semester">Học kỳ *</Label>
              <Select 
                value={formData.semester} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HK1">Học kỳ 1</SelectItem>
                  <SelectItem value="HK2">Học kỳ 2</SelectItem>
                  <SelectItem value="HK_HE">Học kỳ hè</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="border-gray-300 hover:bg-gray-50"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-700 shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu lịch dạy
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}