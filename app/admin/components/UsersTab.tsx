'use client';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Edit, Filter } from 'lucide-react';
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
  const getStudentData = async () => {
    try {
      const data = await getAllStudent();
      console.log(data.students);
      setUsers(data.students);
    } catch (error) {
      console.error('Failed to fetch student data:', error);
    }
  };
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'teacher': return 'bg-blue-100 text-blue-700';
      case 'student': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  
   useEffect(() => {
    getStudentData();
  }, []);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-gray-50 rounded-lg px-4 py-2 text-sm border border-gray-200 outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 rounded-lg px-4 py-2 text-sm border border-gray-200 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
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
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">Showing {filteredUsers.length} of {users.length} users</p>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Previous</button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">1</button>
          <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">2</button>
          <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
