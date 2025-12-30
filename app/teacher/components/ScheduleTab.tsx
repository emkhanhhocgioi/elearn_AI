'use client';
import { useEffect, useState } from 'react';
import { getTeacherSchedule } from '../api/class';
import { Calendar, Clock, BookOpen, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';

interface TimeSlot {
  startTime: string;
  endTime: string;
  session: string;
  period: number;
}

interface ClassInfo {
  id: string;
  class_code: string;
  class_year: string;
  class_grade: string;
}

interface ScheduleItem {
  scheduleId: string;
  class: ClassInfo;
  subject: string;
  timeSlot: TimeSlot;
  semester: string;
}

interface ScheduleData {
  Mon: ScheduleItem[];
  Tue: ScheduleItem[];
  Wed: ScheduleItem[];
  Thu: ScheduleItem[];
  Fri: ScheduleItem[];
  Sat: ScheduleItem[];
  Sun: ScheduleItem[];
}

interface TeacherInfo {
  name: string;
  subject: string;
  email: string;
}

const ScheduleTab = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));

  const daysOfWeek = [
    { key: 'Mon', label: 'Thứ Hai', short: 'T2' },
    { key: 'Tue', label: 'Thứ Ba', short: 'T3' },
    { key: 'Wed', label: 'Thứ Tư', short: 'T4' },
    { key: 'Thu', label: 'Thứ Năm', short: 'T5' },
    { key: 'Fri', label: 'Thứ Sáu', short: 'T6' },
    { key: 'Sat', label: 'Thứ Bảy', short: 'T7' },
    { key: 'Sun', label: 'Chủ Nhật', short: 'CN' }
  ];

  const periods = [
    { period: 1, time: '07:00 - 07:45' },
    { period: 2, time: '07:50 - 08:35' },
    { period: 3, time: '08:40 - 09:25' },
    { period: 4, time: '09:30 - 10:15' },
    { period: 5, time: '10:20 - 11:05' },
    { period: 6, time: '13:00 - 13:45' },
    { period: 7, time: '13:50 - 14:35' },
    { period: 8, time: '14:40 - 15:25' },
    { period: 9, time: '15:30 - 16:15' },
    { period: 10, time: '16:20 - 17:05' }
  ];

  function getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekDates(monday: Date) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  function formatDate(date: Date) {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const response = await getTeacherSchedule();
      console.log('Teacher Schedule Response:', response);
      
      if (response.success) {
        setScheduleData(response.schedules);
        setTeacherInfo(response.teacher);
      }
    } catch (error) {
      console.error('Error fetching teacher schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScheduleForDayAndPeriod = (dayKey: string, periodNumber: number): ScheduleItem | null => {
    if (!scheduleData || !scheduleData[dayKey as keyof ScheduleData]) return null;
    
    const daySchedules = scheduleData[dayKey as keyof ScheduleData];
    return daySchedules.find(item => item.timeSlot.period === periodNumber) || null;
  };

  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeekStart(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeekStart(newWeek);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  const weekDates = getWeekDates(currentWeekStart);
  const isCurrentWeek = formatDate(getMonday(new Date())) === formatDate(currentWeekStart);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải lịch dạy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Lịch Dạy
            </h2>
            {teacherInfo && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  Giáo viên: <span className="font-medium">{teacherInfo.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Môn dạy: <span className="font-medium">{teacherInfo.subject}</span>
                </p>
              </div>
            )}
          </div>
          
          {/* Week Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Tuần trước"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {!isCurrentWeek && (
              <button
                onClick={goToCurrentWeek}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Hôm nay
              </button>
            )}
            
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Tuần sau"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Current Week Display */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            Tuần từ {formatDate(weekDates[0])} đến {formatDate(weekDates[6])}
          </span>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                <th className="px-4 py-3 text-left text-white font-semibold border-r border-blue-500 w-32">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tiết
                  </div>
                </th>
                {daysOfWeek.map((day, index) => (
                  <th key={day.key} className="px-3 py-3 text-center text-white font-semibold border-r border-blue-500 last:border-r-0">
                    <div className="flex flex-col items-center gap-1">
                      <span className="hidden lg:inline">{day.label}</span>
                      <span className="lg:hidden">{day.short}</span>
                      <span className="text-xs font-normal text-blue-100">
                        {formatDate(weekDates[index])}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, periodIndex) => (
                <tr key={period.period} className={periodIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 border-r border-b border-gray-200 font-medium text-gray-700">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Tiết {period.period}</span>
                      <span className="text-xs text-gray-500">{period.time}</span>
                    </div>
                  </td>
                  {daysOfWeek.map((day) => {
                    const scheduleItem = getScheduleForDayAndPeriod(day.key, period.period);
                    return (
                      <td
                        key={`${day.key}-${period.period}`}
                        className="px-2 py-2 border-r border-b border-gray-200 last:border-r-0"
                      >
                        {scheduleItem ? (
                          <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer h-full">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                                <span className="font-semibold text-sm text-gray-900 line-clamp-1">
                                  {scheduleItem.class.class_code}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                <span className="text-xs text-gray-600 line-clamp-1">
                                  {scheduleItem.subject}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                <span className="text-xs text-gray-500">
                                  {scheduleItem.timeSlot.startTime} - {scheduleItem.timeSlot.endTime}
                                </span>
                              </div>
                              {scheduleItem.class.class_grade && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Khối: {scheduleItem.class.class_grade}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full min-h-[80px] flex items-center justify-center">
                            <span className="text-gray-300 text-xs">—</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Ghi chú:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 rounded"></div>
            <span className="text-gray-600">Có lịch dạy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Không có lịch dạy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;
