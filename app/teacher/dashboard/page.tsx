'use client';
export const dynamic = "force-dynamic";
import { Bell, Search, MoreVertical, Users, BookOpen, FileText, Calendar, TrendingUp, Award } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';
import { teacherLogout } from '@/app/api/auth';
import AnalyticsTab from '../components/AnalyticsTab';
import SettingsTab from '../components/SettingsTab';
const LessonsTab = lazy(() => import('../components/LessonsTab'));
const ClassesTab = lazy(() => import('../components/ClassesTab'));
const TestsTab = lazy(() => import('../components/TestsTab'));
const ScheduleTab = lazy(() => import('../components/ScheduleTab'));

const TabLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-gray-500">Đang tải...</div>
  </div>
);

export default function TeacherDashboard() {
  const [currentPage, setCurrentPage] = useState('lessons');

 

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">G</span>
            </div>
            <span className="font-bold text-[#0F172A] text-base tracking-tight">CỔNG GIÁO VIÊN</span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">Menu Chính</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setCurrentPage('lessons')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'lessons' 
                    ? 'text-white bg-[#2563EB] shadow-sm' 
                    : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium text-sm">Bài Giảng</span>
              </li>
              <li 
                onClick={() => setCurrentPage('classes')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'classes' 
                    ? 'text-white bg-[#2563EB] shadow-sm' 
                    : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium text-sm">Lớp Chủ Nhiệm</span>
              </li>
              <li 
                onClick={() => setCurrentPage('tests')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'tests' 
                    ? 'text-white bg-[#2563EB] shadow-sm' 
                    : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium text-sm">Các lớp bộ môn</span>
              </li>
              <li 
                onClick={() => setCurrentPage('schedule')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'schedule' 
                    ? 'text-white bg-[#2563EB] shadow-sm' 
                    : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium text-sm">Lịch Học</span>
              </li>
              <li 
                onClick={() => setCurrentPage('analytics')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'analytics' 
                    ? 'text-white bg-[#2563EB] shadow-sm' 
                    : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium text-sm">Phân Tích</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">Tài Khoản</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setCurrentPage('settings')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'settings' 
                    ? 'text-white bg-[#2563EB] shadow-sm' 
                    : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <div className="w-5 h-5">⚙️</div>
                <span className="font-medium text-sm">Cài Đặt</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { teacherLogout();  window.location.href = '/teacher/login'; }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer text-left transition-all duration-200"
                >
                  <div className="w-5 h-5">🚪</div>
                  <span className="font-medium text-sm">Đăng Xuất</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài giảng, lớp học, học sinh..."
                className="flex-1 outline-none text-sm text-[#0F172A] placeholder:text-gray-400 focus:placeholder:text-gray-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors" aria-label="Thông báo">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-sm font-medium text-[#0F172A]">Hồ Sơ Giáo Viên</span>
                <div className="w-10 h-10 bg-[#2563EB] rounded-full"></div>
                <button className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors" aria-label="Tùy chọn khác">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          

          {/* Dynamic Tab Content */}
          <Suspense fallback={<TabLoader />}>
            {currentPage === 'lessons' && <LessonsTab />}
            {currentPage === 'classes' && <ClassesTab />}
            {currentPage === 'tests' && <TestsTab />}
            {currentPage === 'schedule' && <ScheduleTab />}
            {currentPage === 'analytics' && <AnalyticsTab />}
            {currentPage === 'settings' && <SettingsTab />}
          </Suspense>
        </div>
      </div>
    </div>
  );
}