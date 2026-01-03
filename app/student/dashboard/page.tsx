'use client';
export const dynamic = "force-dynamic";
import { Bell, Search, MoreVertical, BookOpen, FileText, TrendingUp, Award, LogOut, User, Settings, Star, Phone, Calendar } from 'lucide-react';
import { useState, lazy, Suspense, useEffect } from 'react';
import { studentLogout } from '@/app/api/auth';
import { useRouter } from 'next/navigation';

const MyClassesTab = lazy(() => import('../components/PersonalTab'));
const MyTestsTab = lazy(() => import('../components/MyTestsTab'));
const DocumentsTab = lazy(() => import('../components/DocumentsTab'));
const PersonalInfoTab = lazy(() => import('../components/PersonalInfoTab'));
const SettingsTab = lazy(() => import('../components/SettingsTab'));
const MyGradeTab = lazy(() => import('../components/MyGradeTab'));
const TeacherContactTab = lazy(() => import('../components/TeacherContactTab'));
const ScheduleTab = lazy(() => import('../components/ScheduleTab'));
import {searchLessonsAndTests} from '@/app/student/api/search'

const TabLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-gray-500">Loading...</div>
  </div>
);
// Interface for API response
interface TestApiResponse {
  _id: string;
  classID: string;
  teacherID: string;
  testtitle: string;
  subject: string;
  avg_score: string;
  participants: number;
  closeDate: string;
  status: string;
  createDate: string;
  __v: number;
  test_time: number;
  isSubmited: boolean;
  isSubmitedTime: string;
}

// Interface for mapped test object

export interface Lesson {
  _id: string;
  title: string;
  classId: string;
  teacherId: string;
  subject: string;
  lessonMetadata: string;
  fileType?: string;
  createDate: string;
  __v: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  class: string;
  type: string;
  size: string;
  uploadedDate: string;
  uploader: string;
  downloadUrl: string;
}
export default function StudentDashboard() {
  const router = useRouter(); 
  const [currentPage, setCurrentPage] = useState('classes');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ lessons: Lesson[]; tests: TestApiResponse[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
 

  // Debounce search với 5 giây
  useEffect(() => {
    const searchTestAndLessons = async (query: string) => {
      if (!query.trim()) {
        setSearchResults(null);
        return;
      }
      
      setIsSearching(true);
      try {
        const results = await searchLessonsAndTests(query);
        console.log("Search Results:", results);
        setSearchResults(results);
      } catch (error) {
        console.error("Search Error:", error);
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchTestAndLessons(searchQuery);
    }, 5000);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);


  const handleLogout = () => {
    studentLogout();
    router.push('/student/login');
    console.log('Logging out...');
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <span className="font-bold text-[#0F172A] text-base tracking-tight">CỔNG HỌC SINH</span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">Menu Chính</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setCurrentPage('classes')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'classes' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium text-sm">Cá nhân</span>
              </li>
              <li 
                onClick={() => setCurrentPage('tests')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'tests' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Award className="w-5 h-5" />
                <span className="font-medium text-sm">Bài tập của tôi</span>
              </li>
              <li 
                onClick={() => setCurrentPage('documents')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'documents' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium text-sm">Tài liệu lớp học</span>
              </li>
               <li 
                onClick={() => setCurrentPage('grades')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'grades' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="font-medium text-sm">Điểm của bạn</span>
              </li>
              <li 
                onClick={() => setCurrentPage('teacher-contact')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'teacher-contact' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium text-sm">Liên hệ giáo viên</span>
              </li>
              <li 
                onClick={() => setCurrentPage('schedule')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'schedule' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium text-sm">Lịch học</span>
              </li>
              <li 
                onClick={() => setCurrentPage('personal')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'personal' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium text-sm">Thông tin cá nhân</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">Tài khoản</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setCurrentPage('settings')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentPage === 'settings' ? 'text-white bg-[#2563EB] shadow-sm' : 'text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium text-sm">Cài đặt</span>
              </li>
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
            <div className="flex items-center gap-4 flex-1 max-w-2xl relative">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm lớp học, tài liệu, bài kiểm tra..."
                className="flex-1 outline-none text-sm bg-transparent text-[#0F172A] placeholder-gray-400 focus:placeholder-gray-500 transition-colors"
                aria-label="Search"
              />
              {isSearching && (
                <div className="absolute right-0 text-xs text-gray-500">
                  Đang tìm kiếm...
                </div>
              )}
              
              {/* Search Results Dropdown */}
              {searchResults && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-20">
                  {searchResults.lessons && searchResults.lessons.length > 0 && (
                    <div className="p-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Bài học</h4>
                      {searchResults.lessons.map((lesson: Lesson) => (
                        <div key={lesson._id} className="px-3 py-3 hover:bg-[#F1F5F9] rounded-lg cursor-pointer transition-colors">
                          <div className="text-sm font-medium text-[#0F172A]">{lesson.title }</div>
                       
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.tests && searchResults.tests.length > 0 && (
                    <div className="p-3 border-t border-gray-100">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Bài kiểm tra</h4>
                      {searchResults.tests.map((test: TestApiResponse) => (
                        <div key={test._id} className="px-3 py-3 hover:bg-[#F1F5F9] rounded-lg cursor-pointer transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-[#0F172A]">{test.testtitle}</div>
                              <div className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                                <span className="inline-flex items-center gap-1">
                                  <span className="font-medium">{test.subject}</span>
                                  <span>•</span>
                                  <span>{test.test_time} phút</span>
                                  <span>•</span>
                                  <span>{test.participants} học sinh</span>
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Đóng: {new Date(test.closeDate).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              test.status === 'open' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}>
                              {test.status === 'open' ? 'Mở' : 'Đóng'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(!searchResults.lessons || searchResults.lessons.length === 0) && 
                   (!searchResults.tests || searchResults.tests.length === 0) && (
                    <div className="p-6 text-center text-sm text-gray-500">
                      Không tìm thấy kết quả
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
              onClick={() => router.push('/student/notifications')}
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
                <span className="hidden md:block text-sm font-medium text-[#0F172A]">Hồ sơ học sinh</span>
                <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">A</span>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <button 
                  onClick={() => {
                  setCurrentPage('personal');
                  setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#0F172A] hover:bg-[#F1F5F9] flex items-center gap-3 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Xem hồ sơ
                </button>
                <button 
                  onClick={() => {
                  setCurrentPage('settings');
                  setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#0F172A] hover:bg-[#F1F5F9] flex items-center gap-3 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Cài đặt
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
         

          {/* Dynamic Tab Content */}
          <Suspense fallback={<TabLoader />}>
            {currentPage === 'classes' && <MyClassesTab />}
            {currentPage === 'tests' && <MyTestsTab />}
            {currentPage === 'documents' && <DocumentsTab />}
            {currentPage === 'grades' && <MyGradeTab />}
            {currentPage === 'teacher-contact' && <TeacherContactTab />}
            {currentPage === 'schedule' && <ScheduleTab />}
            {currentPage === 'personal' && <PersonalInfoTab />}
            {currentPage === 'settings' && <SettingsTab />}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
