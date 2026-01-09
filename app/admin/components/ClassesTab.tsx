'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Users } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClass, getAllClasses, deleteClass } from '@/app/admin/api/class';
import { getAllTeachers, Teacher } from '@/app/admin/api/teacher';
import EnrollStudent from './EnrollStudent';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Class {
  _id: string;
  class_code: string;
  class_subject: string;
  class_year: string;
  class_student_count: number;
  class_avarage_grade: number;
  studentCount: number;
  class_teacher: {
    _id: string;
    name: string;
    isClassTeacher: boolean;
  };
  teacher_name?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
}



const generateSchoolYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    const year = currentYear - i;
    years.push({
      value: year,
      label: `${year}-${year + 4}`
    });
  }
  return years;
};

const schoolYears = generateSchoolYears();

export default function ClassesTab() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    classCode: '',
    classYear: '',
    teacher_id: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      setFetchLoading(true);
      const response = await getAllClasses();
      console.log('Classes Response:', response);
      // Handle nested data structure: response.data.data
      const classesData = response?.data?.data || response?.data || [];
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const teachersData = await getAllTeachers();
 
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateClass = async () => {
    if (!formData.classCode) {
      alert('Vui lòng nhập mã lớp');
      return;
    }

    if (!formData.classYear) {
      alert('Vui lòng chọn năm học');
      return;
    }

    if (!formData.teacher_id) {
      alert('Vui lòng chọn giáo viên');
      return;
    }

    setIsLoading(true);
    try {
      const classYearRange = `${formData.classYear}-${parseInt(formData.classYear) + 4}`;
      const result = await createClass(formData.classCode, formData.teacher_id, classYearRange);
      if (result.error) {
        alert(`Có lỗi xảy ra: ${result.error}`);
        return;
      }else {
        alert('Tạo lớp học thành công!');
      }
      setFormData({
        classCode: '',
        classYear: '',
        teacher_id: ''
      });
      setIsOpen(false);
      // Refresh classes list
      await fetchClasses();
    } catch (error) {
      alert('Có lỗi xảy ra khi tạo lớp học');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lớp này?')) {
      return;
    }

    setDeleteLoading(classId);
    try {
      await deleteClass(classId);
      alert('Xóa lớp học thành công!');
      // Refresh classes list
      await fetchClasses();
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa lớp học');
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Classes Management</h2>
            <p className="text-indigo-100">Organize and manage class schedules and assignments</p>
          </div>
          <div className="flex gap-2">
   
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-indigo-600 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105">
                <Plus className="w-5 h-5" />
                Create New Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo Lớp Học Mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin để tạo một lớp học mới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="classCode" className="text-sm font-medium text-gray-900">
                    Mã Lớp
                  </label>
                  <input
                    id="classCode"
                    name="classCode"
                    type="text"
                    placeholder="VD: FE-2024-001"
                    value={formData.classCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="classYear" className="text-sm font-medium text-gray-900">
                    Năm Học
                  </label>
                  <select
                    id="classYear"
                    name="classYear"
                    value={formData.classYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn năm học --</option>
                    {schoolYears.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="teacher_id" className="text-sm font-medium text-gray-900">
                    Giáo Viên
                  </label>
                  <Select
                    value={formData.teacher_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, teacher_id: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-- Chọn giáo viên --" />
                    </SelectTrigger>
                    <SelectContent>
                    {teachers
                    .filter(teacher => teacher.isClassTeacher === false)
                    .map((teacher) => (
                        <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.name}
                        </SelectItem>
                    ))}

                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateClass}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang tạo...' : 'Tạo Lớp'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl px-5 py-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100 transition-all duration-300">
            <Search className="w-5 h-5 text-purple-500" />
            <input
              type="text"
              placeholder="Search by code, subject, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            />
          </div>
          
          <select
            value={filterYear}
            onChange={(e) => {
              setFilterYear(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 cursor-pointer"
          >
            <option value="all">All Years</option>
            {schoolYears.map((year) => (
              <option key={year.value} value={year.label}>
                {year.label}
              </option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-purple-50 border-b-2 border-purple-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Class Code</th>
                
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Year</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Students</th>
               
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fetchLoading ? (
                // Skeleton loader
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : (() => {
                const filteredClasses = classes.filter(cls => {
                  const matchesSearch = 
                    cls.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    cls.class_subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (cls.teacher_name || (cls.class_teacher?.name || '') || '').toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = filterStatus === 'all' || (cls.status || 'active') === filterStatus;
                  const matchesYear = filterYear === 'all' || cls.class_year === filterYear;
                  return matchesSearch && matchesStatus && matchesYear;
                });
                
                const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedClasses = filteredClasses.slice(startIndex, endIndex);
                
                return paginatedClasses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-600 mb-1">No classes found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or create a new class</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((cls) => (
                  <tr key={cls._id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200 group">
                    <td className="px-6 py-4" onClick={() => router.push(`/admin/class/${cls._id}`)}>
                      <p className="text-sm font-semibold text-gray-900 cursor-pointer group-hover:text-purple-600 transition-colors">{cls.class_code}</p>
                    </td>
                
                    <td className="px-6 py-4" onClick={() => router.push(`/admin/class/${cls._id}`)}>
                      <p className="text-sm text-gray-600">{cls.teacher_name || (cls.class_teacher?.name || '-')}</p>
                    </td>
                    <td className="px-6 py-4" onClick={() => router.push(`/admin/class/${cls._id}`)}>
                      <p className="text-sm text-gray-600">{cls.class_year}</p>
                    </td>
                    <td className="px-6 py-4" onClick={() => router.push(`/admin/class/${cls._id}`)}>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{cls.studentCount}</span>
                      </div>
                    </td>
                 
                    <td className="px-6 py-4" onClick={() => router.push(`/admin/class/${cls._id}`)}>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        (cls.status || 'active') === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {(cls.status || 'active').charAt(0).toUpperCase() + (cls.status || 'active').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(cls._id);
                          }}
                          disabled={deleteLoading === cls._id}
                          className="p-2.5 hover:bg-red-100 rounded-xl text-red-600 transition-all duration-300 hover:scale-110 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa lớp"
                        >
                          {deleteLoading === cls._id ? (
                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              );
            })()}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {(() => {
          const filteredClasses = classes.filter(cls => {
            const matchesSearch = 
              cls.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cls.class_subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (cls.teacher_name || (cls.class_teacher?.name || '') || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || (cls.status || 'active') === filterStatus;
            const matchesYear = filterYear === 'all' || cls.class_year === filterYear;
            return matchesSearch && matchesStatus && matchesYear;
          });
          const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
          
          if (totalPages <= 1) return null;
          
          return (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredClasses.length)}</span> of{' '}
                  <span className="font-semibold">{filteredClasses.length}</span> classes
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Statistics Cards */}
   

      
    </div>
  );
}