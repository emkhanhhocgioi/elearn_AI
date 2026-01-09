'use client';
export const dynamic = "force-dynamic";
import { Bell, Search, MoreVertical, Users, BookOpen, FileText, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, lazy, Suspense, useEffect } from 'react';

import { getAllStudent } from '../api/student';
import { getAllClasses } from '../api/class';
import { getAllTeachers } from '../api/teacher';
import { fetchUserActivityLogs } from '../api/report';  

const UsersTab = lazy(() => import('../components/UsersTab'));
const ClassesTab = lazy(() => import('../components/ClassesTab'));
const TeachersTab = lazy(() => import('../components/TeachersTab'));
const ReportsTab = lazy(() => import('../components/ReportsTab'));

const TabLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-gray-500">Loading...</div>
  </div>
);

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const activitiesPerPage = 10;

  const handleLogout = () => {
    console.log('Logging out...');
    // Add your logout logic here
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API lấy danh sách students
        const studentsResponse = await getAllStudent();
        console.log('Students Response:', studentsResponse);
        const studentCount = Array.isArray(studentsResponse.students) ? studentsResponse.students.length : 0;
        setTotalStudents(studentCount);
        console.log('Total Students:', studentCount);

        // Gọi API lấy danh sách classes
        const classesResponse = await getAllClasses();
        console.log('Classes Response:', classesResponse.data);
        const classCount = Array.isArray(classesResponse.data) ? classesResponse.data.length : 0;
        setTotalClasses(classCount);
        console.log('Total Classes:', classCount);

        // Gọi API lấy danh sách teachers
        const teachersResponse = await getAllTeachers();
        console.log('Teachers Response:', teachersResponse);
        const teacherCount = Array.isArray(teachersResponse) ? teachersResponse.length : 0;
        setTotalTeachers(teacherCount);
        console.log('Total Teachers:', teacherCount);

        // Gọi API lấy danh sách activities
        const activitiesResponse = await fetchUserActivityLogs();
        console.log('Activities Response:', activitiesResponse);
        if (activitiesResponse && activitiesResponse.data && Array.isArray(activitiesResponse.data.activities)) {
          setActivities(activitiesResponse.data.activities);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const indexOfLastActivity = currentActivityPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(activities.length / activitiesPerPage);

  const handleNextPage = () => {
    if (currentActivityPage < totalPages) {
      setCurrentActivityPage(currentActivityPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentActivityPage > 1) {
      setCurrentActivityPage(currentActivityPage - 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else {
      return `${diffDays} ngày trước`;
    }
  };

  const stats = [
    { label: "Tổng số học sinh", value: totalStudents.toString(), icon: Users, color: "blue" },
    { label: "Tổng số lớp học", value: totalClasses.toString(), icon: BookOpen, color: "purple" },
    { label: "Tổng số giáo viên", value: totalTeachers.toString(), icon: FileText, color: "green" }
  ];

 

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">A</span>
            </div>
            <span className="font-bold text-[#0F172A] text-base tracking-tight">BẢNG QUẢN TRỊ</span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">Menu Chính</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setCurrentPage('dashboard')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'dashboard' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium text-sm">Bảng điều khiển</span>
              </li>
              <li 
                onClick={() => setCurrentPage('users')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'users' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium text-sm">Học sinh</span>
              </li>
              <li 
                onClick={() => setCurrentPage('classes')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'classes' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium text-sm">Lớp học</span>
              </li>
              <li 
                onClick={() => setCurrentPage('teachers')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'teachers' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium text-sm">Giáo viên</span>
              </li>
              <li 
                onClick={() => setCurrentPage('reports')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'reports' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium text-sm">Báo cáo</span>
              </li>
            </ul>
          </div>

          <div>
         
            <ul className="space-y-1">
              
              <li 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Đăng xuất</span>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
             
            </div>
            <div className="flex items-center gap-4">
              <button
                className="relative p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600 hover:text-[#0F172A]" />
              </button>
              <div className="relative">
                <button 
                  className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  aria-label="Profile menu"
                  aria-expanded={profileMenuOpen}
                >
                  <span className="hidden md:block text-sm font-medium text-[#0F172A]">Quản trị viên</span>
                  <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                
                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <button 
                      className="w-full text-left px-4 py-2.5 text-sm text-[#0F172A] hover:bg-[#F1F5F9] flex items-center gap-3 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Cài đặt hồ sơ
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2.5 text-sm text-[#0F172A] hover:bg-[#F1F5F9] flex items-center gap-3 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Nhật ký hoạt động
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Dynamic Tab Content */}
          <Suspense fallback={<TabLoader />}>
            {currentPage === 'dashboard' && (
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#0F172A]">Hoạt động gần đây</h3>
                  <span className="text-sm text-gray-500 font-medium">
                    Trang {currentActivityPage} / {totalPages || 1}
                  </span>
                </div>
                <div className="space-y-3">
                  {currentActivities.length > 0 ? (
                    currentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between pb-3 border-b border-gray-100 hover:bg-[#F1F5F9] -mx-3 px-3 py-2 rounded-lg transition-colors">
                        <div className="flex-1">
                          <span className="text-sm text-[#0F172A] font-medium">{activity.action}</span>
                          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                            {activity.studentId?.name || activity.teacherId?.name || 'Unknown User'} <span className="text-gray-400">•</span> <span className="capitalize">{activity.role}</span>
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm font-medium">Không có hoạt động gần đây</p>
                    </div>
                  )}
                </div>
                {activities.length > activitiesPerPage && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentActivityPage === 1}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Trước
                    </button>
                    <span className="text-sm text-gray-600">
                      {indexOfFirstActivity + 1} - {Math.min(indexOfLastActivity, activities.length)} / {activities.length}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentActivityPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Tiếp
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
            {currentPage === 'users' && <UsersTab />}
            {currentPage === 'classes' && <ClassesTab />}
            {currentPage === 'teachers' && <TeachersTab />}
            {currentPage === 'reports' && <ReportsTab />}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
