'use client';

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { getAllStudent } from '../api/student';

interface User {
  _id: string;
  name?: string;
  email?: string;
  password?: string;
  classid?: {
    _id: string;
    class_code: string;
    class_year: string;
    class_student_count: number;
    class_teacher: string;
    class_avarage_grade: number;
    __v: number;
  };
  DOB?: string;
  avatar?: string;
  parentContact?: string;
  academic_performance?: string;
  conduct?: string;
  averageScore?: number;
  accountSettings?: {
    notifications: boolean;
    darkMode: boolean;
    TestReminder: boolean;
  };
  lastLogin?: string | null;
  dailyQuestionSubject?: string;
  dailyPracticeQuestion?: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function UsersTab() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Get unique classes for filter
  const uniqueClasses = Array.from(new Set(users.map(u => u.classid?.class_code).filter(Boolean)));

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesClass = filterClass === 'all' || user.classid?.class_code === filterClass;
    const matchesPerformance = filterPerformance === 'all' || user.academic_performance === filterPerformance;

    return matchesSearch && matchesClass && matchesPerformance;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'class':
        return (a.classid?.class_code || '').localeCompare(b.classid?.class_code || '');
      case 'averageScore':
        return (b.averageScore || 0) - (a.averageScore || 0);
      case 'performance':
        const perfOrder: { [key: string]: number } = { 'Tốt': 4, 'Khá': 3, 'Trung bình': 2, 'Yếu': 1 };
        return (perfOrder[b.academic_performance || ''] || 0) - (perfOrder[a.academic_performance || ''] || 0);
      default:
        return 0;
    }
  });

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'teacher': return 'bg-blue-100 text-blue-700';
      case 'student': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    const getStudentData = async () => {
      try {
        const data = await getAllStudent();
        console.log(data.students);
        setUsers(data.students);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      }
    };

    if (!hasFetched.current) {
      getStudentData();
      hasFetched.current = true;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="bg-white rounded-xl px-5 py-3 border border-gray-200 flex items-center gap-3 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-200 transition-all duration-300">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
          />
        </div>

        {/* Class Filter */}
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="bg-white rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-300 cursor-pointer"
        >
          <option value="all">All Classes</option>
          {uniqueClasses.map(className => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>

        {/* Performance Filter */}
        <select
          value={filterPerformance}
          onChange={(e) => setFilterPerformance(e.target.value)}
          className="bg-white rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-300 cursor-pointer"
        >
          <option value="all">All Performance</option>
          <option value="Tốt">Tốt</option>
          <option value="Khá">Khá</option>
          <option value="Trung bình">Trung bình</option>
          <option value="Yếu">Yếu</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-300 cursor-pointer"
        >
          <option value="name">Sort by Name</option>
          <option value="class">Sort by Class</option>
          <option value="averageScore">Sort by Score</option>
          <option value="performance">Sort by Performance</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
             
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">No users found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const getPerformanceColor = (performance: string | undefined) => {
                    switch(performance) {
                      case 'Tốt': return 'bg-green-100 text-green-700';
                      case 'Khá': return 'bg-blue-100 text-blue-700';
                      case 'Trung bình': return 'bg-yellow-100 text-yellow-700';
                      case 'Yếu': return 'bg-red-100 text-red-700';
                      default: return 'bg-gray-100 text-gray-700';
                    }
                  };

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                      onClick={() => router.push(`/admin/student/${user._id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.avatar && (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{user.name || 'N/A'}</div>
                           
                          </div>
                        </div>
                      </td>
                     
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.classid?.class_code || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{user.classid?.class_year || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{user.averageScore || 0} /10</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(user.academic_performance)}`}>
                          {user.academic_performance || 'N/A'}
                        </span>
                        {user.conduct && (
                          <div className="text-xs text-gray-500 mt-1">
                            Conduct: {user.conduct}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.parentContact || 'N/A'}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6">
        <div className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-all">
            1
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}