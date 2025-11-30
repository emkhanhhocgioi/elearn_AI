'use client';
import { useState } from 'react';
import { Plus, Search, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';

interface Teacher {
  _id: string;
  teacher_email: string;
  teacher_name: string;
  teacher_subject: string;
  classes_count: number;
  students_count: number;
  status: 'approved' | 'pending' | 'rejected';
  joined_date: string;
}

export default function TeachersTab() {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      _id: '1',
      teacher_email: 'teacher1@email.com',
      teacher_name: 'Trần Thị B',
      teacher_subject: 'Toán học',
      classes_count: 3,
      students_count: 85,
      status: 'approved',
      joined_date: '2024-01-10'
    },
    {
      _id: '2',
      teacher_email: 'teacher2@email.com',
      teacher_name: 'Nguyễn Văn D',
      teacher_subject: 'Tiếng Anh',
      classes_count: 2,
      students_count: 56,
      status: 'approved',
      joined_date: '2024-01-12'
    },
    {
      _id: '3',
      teacher_email: 'teacher3@email.com',
      teacher_name: 'Lê Thị E',
      teacher_subject: 'Vật Lý',
      classes_count: 0,
      students_count: 0,
      status: 'pending',
      joined_date: '2024-01-25'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.teacher_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacher_subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApprove = (teacherId: string) => {
    setTeachers(teachers.map(t => 
      t._id === teacherId ? { ...t, status: 'approved' } : t
    ));
  };

  const handleReject = (teacherId: string) => {
    setTeachers(teachers.map(t => 
      t._id === teacherId ? { ...t, status: 'rejected' } : t
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Teachers Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add New Teacher
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 rounded-lg px-4 py-2 text-sm border border-gray-200 outline-none"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No teachers found
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {teacher.teacher_name.charAt(0)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{teacher.teacher_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{teacher.teacher_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{teacher.teacher_subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{teacher.classes_count}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{teacher.students_count}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(teacher.status)}`}>
                        {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{teacher.joined_date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {teacher.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(teacher._id)}
                              className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleReject(teacher._id)}
                              className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Teachers</h3>
          <p className="text-3xl font-bold text-gray-900">{teachers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-600">
            {teachers.filter(t => t.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {teachers.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">
            {teachers.filter(t => t.status === 'rejected').length}
          </p>
        </div>
      </div>
    </div>
  );
}
