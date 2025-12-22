import { Bell, Mail, MessageSquare, Search, MoreVertical, ChevronLeft, ChevronRight, Play } from 'lucide-react';
export const dynamic = "force-dynamic";
export default function CourseDashboard() {
  const courses = [
    {
      id: 1,
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      progress: 75,
      instructor: "Prashant Kumar Singh",
      role: "Backend Developer",
      image: "/api/placeholder/280/160",
      tag: "FRONTEND"
    },
    {
      id: 2,
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      progress: 45,
      instructor: "Prashant Kumar Singh",
      role: "Solution Developer",
      image: "/api/placeholder/280/160",
      tag: "DESIGN"
    },
    {
      id: 3,
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      progress: 60,
      instructor: "Prashant Kumar Singh",
      role: "Product Developer",
      image: "/api/placeholder/280/160",
      tag: "BACKEND"
    }
  ];

  const mentors = [
    { name: "Prashant Kumar Singh", role: "Backend Developer", status: "ACTIVE" },
    { name: "Prashant Kumar Singh", role: "Solution Developer", status: "ACTIVE" },
    { name: "Prashant Kumar Singh", role: "Backend Developer", status: "ACTIVE" },
    { name: "Prashant Kumar Singh", role: "Solution Developer", status: "ACTIVE" }
  ];

  const mentorInteractions = [
    { instructor: "Prashant Kumar Singh", date: "29/12/2023", course: "Understanding Concept Of React", status: "PENDING", action: "SHOW DETAILS" },
    { instructor: "Ravi Kumar", date: "29/12/2023", course: "Understanding Concept Of React", status: "PENDING", action: "SHOW DETAILS" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-gray-900">COURSUE</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">OVERVIEW</h3>
            <ul className="space-y-1">
              <li className="flex items-center gap-3 px-4 py-2 text-purple-600 bg-purple-50 rounded-lg">
                <div className="w-5 h-5">📊</div>
                <span className="font-medium">Dashboard</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-5 h-5">📥</div>
                <span>Inbox</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-5 h-5">📚</div>
                <span>Lesson</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-5 h-5">✅</div>
                <span>Task</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-5 h-5">👥</div>
                <span>Group</span>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">FRIENDS</h3>
            <ul className="space-y-2">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Prashant</div>
                    <div className="text-xs text-gray-500">@randomusername</div>
                  </div>
                </li>
              ))}
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
                placeholder="Search your course here..."
                className="flex-1 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-sm font-medium">Your Profile</span>
                <div className="w-10 h-10 bg-purple-600 rounded-full"></div>
                <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm mb-2 opacity-90">ONLINE COURSE</p>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Sharpen Your Skills With<br />Professional Online Courses
              </h1>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100">
                Join Now
                <Play className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute right-0 top-0 opacity-10 text-[200px]">🎓</div>
          </div>

          {/* Watched Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🎯</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">2/8 Watched</p>
                  <p className="font-medium text-gray-900">Product Design</p>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 ml-auto cursor-pointer" />
              </div>
            ))}
          </div>

          {/* Continue Watching Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Continue Watching</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-200 to-purple-400 h-40"></div>
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                    {course.tag}
                  </span>
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                      <p className="text-xs text-gray-500">{course.role}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Your Mentor Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Mentor</h2>
                <a href="#" className="text-purple-600 text-sm hover:underline">See All</a>
              </div>

              <div className="bg-white rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Instructor Name & ID #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Course Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Course Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mentorInteractions.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.instructor}</p>
                                <p className="text-xs text-gray-500">{item.date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{item.course}</p>
                          </td>
                          <td className="px-6 py-4">
                            <button className="bg-purple-100 text-purple-600 text-xs px-4 py-2 rounded-full hover:bg-purple-200">
                              {item.action}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-gray-900 mb-1">Good Morning Prashant</h3>
                <p className="text-sm text-gray-500 mb-4">Continue Your Journey To Achieve<br />Top 1 Highest</p>
                <div className="flex justify-center gap-2 mb-4">
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                    <Bell className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="bg-purple-600 rounded"
                      style={{ width: '12%', height: `${30 + i * 10}px` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Your Mentor List */}
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Your Mentor</h3>
                  <button className="text-purple-600">→</button>
                </div>
                <div className="space-y-3">
                  {mentors.map((mentor, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{mentor.name}</p>
                          <p className="text-xs text-gray-500">{mentor.role}</p>
                        </div>
                      </div>
                      <button className="bg-purple-600 text-white text-xs px-4 py-1.5 rounded-full">
                        {mentor.status}
                      </button>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-purple-600 text-sm hover:underline">
                  See All
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}