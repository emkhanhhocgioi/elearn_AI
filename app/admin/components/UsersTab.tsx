'use client';
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';
import {  Search } from 'lucide-react';
import { getAllStudent } from '../api/student';
interface User {
  _id: string;

  // New API fields
  name?: string;
  email?: string;
  password?: string;
  className?: string;
  class?: string;
  classid?: {
    _id: string;
    class_code: string;
    teacherid: string;
  };
  grade?: string;
  academic_performance?: string;
  conduct?: string;
  subjects?: {
    math: number;
    literature: number;
    english: number;
    physics: number;
    chemistry: number;
    biology: number;
    history: number;
    geography: number;
  };
  averageScore?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;

  
}


export default function UsersTab() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesRole = filterRole === 'all' || filterRole === 'student'; // All current data are students
    const matchesStatus = filterStatus === 'all'; // No status field in new data
    return matchesSearch && matchesRole && matchesStatus;
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
    getStudentData();
  }, []);
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
            <p className="text-pink-100">View and manage all user accounts in the system</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-pink-50 rounded-xl px-5 py-3 border border-gray-200 focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-100 transition-all duration-300">
            <Search className="w-5 h-5 text-pink-500" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-pink-50 border-b-2 border-pink-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-600 mb-1">No users found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 cursor-pointer group"
                    onClick={() => router.push(`/admin/student/${user._id}`)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Class: {user.classid?.class_code || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleColor('student')}`}>
                        Student
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${user.academic_performance === 'Tốt' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {user.academic_performance || 'N/A'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Conduct: {user.conduct || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                       
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-600">Showing <span className="font-bold text-gray-900">{filteredUsers.length}</span> of <span className="font-bold text-gray-900">{users.length}</span> users</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 transition-all duration-300 hover:scale-105">Previous</button>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">1</button>
          <button className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 transition-all duration-300 hover:scale-105">2</button>
          <button className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 transition-all duration-300 hover:scale-105">Next</button>
        </div>
      </div>
    </div>
  );
}
