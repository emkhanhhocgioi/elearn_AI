'use client';
import { Bell, Search, MoreVertical, Plus, Edit, Trash2, Users, BookOpen, FileText, Calendar, Clock, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';

export default function TeacherDashboard() {
  const [currentPage, setCurrentPage] = useState('lessons');

  const lessonsData = [
    {
      id: 1,
      title: "Introduction to React Hooks",
      course: "Frontend Development",
      duration: "45 min",
      students: 24,
      status: "Published",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Advanced State Management",
      course: "Frontend Development",
      duration: "60 min",
      students: 24,
      status: "Draft",
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "API Integration Best Practices",
      course: "Backend Development",
      duration: "50 min",
      students: 18,
      status: "Published",
      date: "2024-01-18"
    }
  ];

  const classesData = [
    {
      id: 1,
      name: "Frontend Development Batch 2024",
      students: 24,
      lessons: 12,
      progress: 65,
      schedule: "Mon, Wed, Fri - 10:00 AM",
      status: "Active"
    },
    {
      id: 2,
      name: "Backend Development Advanced",
      students: 18,
      lessons: 15,
      progress: 45,
      schedule: "Tue, Thu - 2:00 PM",
      status: "Active"
    },
    {
      id: 3,
      name: "Full Stack Development",
      students: 30,
      lessons: 20,
      progress: 30,
      schedule: "Daily - 6:00 PM",
      status: "Active"
    }
  ];

  const testsData = [
    {
      id: 1,
      title: "React Fundamentals Quiz",
      class: "Frontend Development Batch 2024",
      questions: 20,
      duration: "30 min",
      submitted: 18,
      total: 24,
      avgScore: 85,
      dueDate: "2024-01-25"
    },
    {
      id: 2,
      title: "Node.js Midterm Exam",
      class: "Backend Development Advanced",
      questions: 30,
      duration: "60 min",
      submitted: 15,
      total: 18,
      avgScore: 78,
      dueDate: "2024-01-28"
    },
    {
      id: 3,
      title: "Database Design Assignment",
      class: "Full Stack Development",
      questions: 15,
      duration: "45 min",
      submitted: 0,
      total: 30,
      avgScore: 0,
      dueDate: "2024-02-05"
    }
  ];

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
                <span className="font-medium">Classes</span>
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
              const colors = {
                purple: 'bg-purple-100 text-purple-600',
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                orange: 'bg-orange-100 text-orange-600'
              };
              return (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg  flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Lessons Page */}
          {currentPage === 'lessons' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Lessons</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                  Create New Lesson
                </button>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lesson Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Students</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {lessonsData.map((lesson) => (
                        <tr key={lesson.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                            <p className="text-xs text-gray-500">{lesson.date}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{lesson.course}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {lesson.duration}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              {lesson.students}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              lesson.status === 'Published' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {lesson.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Classes Page */}
          {currentPage === 'classes' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                  Create New Class
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classesData.map((classItem) => (
                  <div key={classItem.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 h-32 flex items-center justify-center">
                      <Users className="w-16 h-16 text-white opacity-50" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{classItem.name}</h3>
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                          {classItem.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Students</span>
                          <span className="font-medium text-gray-900">{classItem.students}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Lessons</span>
                          <span className="font-medium text-gray-900">{classItem.lessons}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{classItem.schedule}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-500">Course Progress</span>
                          <span className="font-medium text-purple-600">{classItem.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${classItem.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-purple-100 text-purple-600 py-2 rounded-lg text-sm font-medium hover:bg-purple-200">
                          View Details
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tests Page */}
          {currentPage === 'tests' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tests & Assignments</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                  Create New Test
                </button>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Test Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Questions</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Submissions</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Avg Score</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {testsData.map((test) => (
                        <tr key={test.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">{test.title}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3" />
                              {test.duration}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{test.class}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{test.questions} questions</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{test.submitted}/{test.total}</span>
                              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-purple-600 h-1.5 rounded-full"
                                  style={{ width: `${(test.submitted / test.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${
                              test.avgScore >= 80 ? 'text-green-600' : 
                              test.avgScore >= 60 ? 'text-yellow-600' : 
                              test.avgScore > 0 ? 'text-red-600' : 'text-gray-400'
                            }`}>
                              {test.avgScore > 0 ? `${test.avgScore}%` : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{test.dueDate}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="bg-purple-100 text-purple-600 text-xs px-3 py-1.5 rounded-full hover:bg-purple-200">
                                View Results
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}