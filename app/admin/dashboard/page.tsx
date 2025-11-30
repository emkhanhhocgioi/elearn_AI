'use client';
import { Bell, Search, MoreVertical, Users, BookOpen, FileText, BarChart3, Settings, LogOut } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';

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

  const stats = [
    { label: "Total Users", value: "2,547", icon: Users, color: "blue" },
    { label: "Total Classes", value: "156", icon: BookOpen, color: "purple" },
    { label: "Total Teachers", value: "87", icon: FileText, color: "green" },
    { label: "System Health", value: "98%", icon: BarChart3, color: "orange" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-gray-900">ADMIN PANEL</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">MAIN MENU</h3>
            <ul className="space-y-1">
              <li 
                onClick={() => setCurrentPage('dashboard')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </li>
              <li 
                onClick={() => setCurrentPage('users')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'users' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </li>
              <li 
                onClick={() => setCurrentPage('classes')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'classes' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Classes</span>
              </li>
              <li 
                onClick={() => setCurrentPage('teachers')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'teachers' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Teachers</span>
              </li>
              <li 
                onClick={() => setCurrentPage('reports')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Reports</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">SETTINGS</h3>
            <ul className="space-y-1">
              <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <Settings className="w-5 h-5" />
                <span>System Settings</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <FileText className="w-5 h-5" />
                <span>Audit Logs</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                <LogOut className="w-5 h-5" />
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
                placeholder="Search users, classes, teachers..."
                className="flex-1 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-sm font-medium">Administrator</span>
                <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
                <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
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
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-gray-400" />
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
            {currentPage === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">User Registration</span>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Class Created</span>
                      <span className="text-xs text-gray-400">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Teacher Approved</span>
                      <span className="text-xs text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Server</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cache Server</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
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
