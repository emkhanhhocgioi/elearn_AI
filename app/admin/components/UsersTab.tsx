'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit, Filter } from 'lucide-react';

interface User {
  _id: string;
  user_email: string;
  user_role: 'student' | 'teacher' | 'admin';
  user_fullname: string;
  user_status: 'active' | 'inactive';
  created_at: string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([
    {
      _id: '1',
      user_email: 'student1@email.com',
      user_role: 'student',
      user_fullname: 'Nguyễn Văn A',
      user_status: 'active',
      created_at: '2024-01-15'
    },
    {
      _id: '2',
      user_email: 'teacher1@email.com',
      user_role: 'teacher',
      user_fullname: 'Trần Thị B',
      user_status: 'active',
      created_at: '2024-01-10'
    },
    {
      _id: '3',
      user_email: 'student2@email.com',
      user_role: 'student',
      user_fullname: 'Lê Văn C',
      user_status: 'inactive',
      created_at: '2024-01-20'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_fullname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.user_role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.user_status === filterStatus;
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

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add New User
        </button>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
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
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{user.user_fullname}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.user_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleColor(user.user_role)}`}>
                        {user.user_role.charAt(0).toUpperCase() + user.user_role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(user.user_status)}`}>
                        {user.user_status.charAt(0).toUpperCase() + user.user_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.created_at}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
