'use client';
export const dynamic = "force-dynamic";
import { Bell, Search, MoreVertical, BookOpen, FileText, TrendingUp, Award, LogOut, User, Settings, Star, Phone, Calendar } from 'lucide-react';
import { useState, lazy, Suspense, useEffect } from 'react';
import { studentLogout } from '@/app/api/auth';
import { useRouter } from 'next/navigation';

const MyClassesTab = lazy(() => import('../components/MyClassesTab'));
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-gray-900">STUDENT PORTAL</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">MAIN MENU</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setCurrentPage('classes')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'classes' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Personal</span>
              </li>
              <li 
                onClick={() => setCurrentPage('tests')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'tests' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Award className="w-5 h-5" />
                <span className="font-medium">My Assignments</span>
              </li>
              <li 
                onClick={() => setCurrentPage('documents')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'documents' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Class Documents</span>
              </li>
               <li 
                onClick={() => setCurrentPage('grades')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'grades' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="font-medium">Your Grade</span>
              </li>
              <li 
                onClick={() => setCurrentPage('teacher-contact')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'teacher-contact' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Teacher Contact</span>
              </li>
              <li 
                onClick={() => setCurrentPage('schedule')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'schedule' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Schedule</span>
              </li>
              <li 
                onClick={() => setCurrentPage('personal')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'personal' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Personal Info</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">ACCOUNT</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setCurrentPage('settings')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </li>
              <li 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4 flex-1 max-w-2xl relative">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classes, documents, tests..."
                className="flex-1 outline-none text-sm bg-transparent"
              />
              {isSearching && (
                <div className="absolute right-0 text-xs text-gray-500">
                  Searching...
                </div>
              )}
              
              {/* Search Results Dropdown */}
              {searchResults && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-20">
                  {searchResults.lessons && searchResults.lessons.length > 0 && (
                    <div className="p-2">
                      <h4 className="text-xs font-semibold text-gray-500 px-2 py-1">Lessons</h4>
                      {searchResults.lessons.map((lesson: Lesson) => (
                        <div key={lesson._id} className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                          <div className="text-sm font-medium text-gray-900">{lesson.title }</div>
                       
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.tests && searchResults.tests.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <h4 className="text-xs font-semibold text-gray-500 px-2 py-1">Tests</h4>
                      {searchResults.tests.map((test: TestApiResponse) => (
                        <div key={test._id} className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{test.testtitle}</div>
                              <div className="text-xs text-gray-500 mt-1">
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
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              test.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
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
                    <div className="p-4 text-center text-sm text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
              onClick={() => router.push('/student/notifications')}
              className="relative"
              aria-label="Notifications"
              >
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              </button>

              <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <span className="hidden md:block text-sm font-medium">Student Profile</span>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </div>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <button 
                  onClick={() => {
                  setCurrentPage('personal');
                  setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  View Profile
                </button>
                <button 
                  onClick={() => {
                  setCurrentPage('settings');
                  setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <hr className="my-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
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
