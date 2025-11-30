'use client';
import { Bell, Search, MoreVertical, Users, BookOpen, FileText, TrendingUp, Award, LogOut, User, Settings } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';

const MyClassesTab = lazy(() => import('../components/MyClassesTab'));
const MyTestsTab = lazy(() => import('../components/MyTestsTab'));
const DocumentsTab = lazy(() => import('../components/DocumentsTab'));
const PersonalInfoTab = lazy(() => import('../components/PersonalInfoTab'));
const SettingsTab = lazy(() => import('../components/SettingsTab'));

const TabLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-gray-500">Loading...</div>
  </div>
);

export default function StudentDashboard() {
  const [currentPage, setCurrentPage] = useState('classes');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const stats = [
    { label: "Active Classes", value: "3", icon: BookOpen, color: "blue" },
    { label: "Pending Tests", value: "2", icon: Award, color: "orange" },
    { label: "Documents", value: "24", icon: FileText, color: "green" },
    { label: "Current GPA", value: "3.8", icon: TrendingUp, color: "purple" }
  ];

  const handleLogout = () => {
    // TODO: Implement logout functionality
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
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">My Classes</span>
              </li>
              <li 
                onClick={() => setCurrentPage('tests')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'tests' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Award className="w-5 h-5" />
                <span className="font-medium">My Tests</span>
              </li>
              <li 
                onClick={() => setCurrentPage('documents')}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'documents' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Document Repository</span>
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
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search classes, documents, tests..."
                className="flex-1 outline-none text-sm bg-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
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
          {currentPage === 'classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Dynamic Tab Content */}
          <Suspense fallback={<TabLoader />}>
            {currentPage === 'classes' && <MyClassesTab />}
            {currentPage === 'tests' && <MyTestsTab />}
            {currentPage === 'documents' && <DocumentsTab />}
            {currentPage === 'personal' && <PersonalInfoTab />}
            {currentPage === 'settings' && <SettingsTab />}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
