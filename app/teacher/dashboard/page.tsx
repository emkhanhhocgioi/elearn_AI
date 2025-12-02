'use client';
import { Bell, Search, MoreVertical, Users, BookOpen, FileText, Calendar, TrendingUp, Award } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';

const LessonsTab = lazy(() => import('../components/LessonsTab'));
const ClassesTab = lazy(() => import('../components/ClassesTab'));
const TestsTab = lazy(() => import('../components/TestsTab'));

const TabLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-gray-500">Loading...</div>
  </div>
);

export default function TeacherDashboard() {
  const [currentPage, setCurrentPage] = useState('lessons');

  const stats = [
    { label: "Total Students", value: "72", icon: Users, color: "purple" },
    { label: "Active Classes", value: "3", icon: BookOpen, color: "blue" },
    { label: "Total Lessons", value: "47", icon: FileText, color: "green" },
    { label: "Pending Tests", value: "5", icon: Award, color: "orange" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-gray-900">TEACHER PORTAL</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">MAIN MENU</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setCurrentPage('lessons')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
                  currentPage === 'lessons' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Lessons</span>
              </li>
              <li 
                onClick={() => setCurrentPage('classes')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
                  currentPage === 'classes' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Your Class  </span>
              </li>
              <li 
                onClick={() => setCurrentPage('tests')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
                  currentPage === 'tests' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Tests & Assignments</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Calendar className="w-5 h-5" />
                <span>Schedule</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">SETTINGS</h3>
            <ul className="space-y-1">
              <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-5 h-5">⚙️</div>
                <span>Settings</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                <div className="w-5 h-5">🚪</div>
                <span>Logout</span>
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
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search lessons, classes, students..."
                className="flex-1 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-sm font-medium">Teacher Profile</span>
                <div className="w-10 h-10 bg-purple-600 rounded-full"></div>
                <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Dynamic Tab Content */}
          <Suspense fallback={<TabLoader />}>
            {currentPage === 'lessons' && <LessonsTab />}
            {currentPage === 'classes' && <ClassesTab />}
            {currentPage === 'tests' && <TestsTab />}
          </Suspense>
        </div>
      </main>
    </div>
  );
}