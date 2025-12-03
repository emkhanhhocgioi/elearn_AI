'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Edit, Users, BookOpen } from 'lucide-react';
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

const subjects = [
  'Tiếng Việt',
  'Toán học',
  'Tiếng Anh',
  'Lịch Sử',
  'Địa Lý',
  'Vật Lý',
  'Hóa Học',
  'Sinh Học',
  'Công Nghệ',
  'Tin Học',
  'Giáo Dục Thể Chất',
  'Nhạc Nhạc',
  'Mỹ Thuật',
];

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
      alert('Tạo lớp học thành công!');
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Classes Management</h2>
        <div className="flex gap-2">
   
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
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
                     {teachers.map((teacher) => (
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

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code, subject, or teacher..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Class Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Avg. Grade</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fetchLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Loading classes...
                  </td>
                </tr>
              ) : classes.filter(cls => {
                const matchesSearch = 
                  cls.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  cls.class_subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (cls.teacher_name || (cls.class_teacher?.name || '') || '').toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = filterStatus === 'all' || (cls.status || 'active') === filterStatus;
                return matchesSearch && matchesStatus;
              }).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No classes found
                  </td>
                </tr>
              ) : (
                classes.filter(cls => {
                  const matchesSearch = 
                    cls.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    cls.class_subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (cls.teacher_name || (cls.class_teacher?.name || '') || '').toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = filterStatus === 'all' || (cls.status || 'active') === filterStatus;
                  return matchesSearch && matchesStatus;
                }).map((cls) => (
                  <tr key={cls._id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4" onClick={() => router.push(`/admin/class/${cls._id}`)}>
                      <p className="text-sm font-medium text-gray-900">{cls.class_code}</p>
                    </td>
                    <td className="px-6 py-4" onClick={() => router.push(`/admin/class/${cls._id}`)}>
                      <p className="text-sm text-gray-600">{cls.class_subject}</p>
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
                      <p className="text-sm font-medium text-gray-900">{cls.class_avarage_grade.toFixed(1)}</p>
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
                            setSelectedClass(cls);
                            setIsEnrollDialogOpen(true);
                          }}
                          title="Thêm học sinh"
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(cls._id);
                          }}
                          disabled={deleteLoading === cls._id}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
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
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Classes</h3>
          <p className="text-3xl font-bold text-gray-900">{classes.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-gray-900">{classes.reduce((sum, cls) => sum + cls.class_student_count, 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Avg. Class Grade</h3>
          <p className="text-3xl font-bold text-gray-900">
            {classes.length > 0 ? (classes.reduce((sum, cls) => sum + cls.class_avarage_grade, 0) / classes.length).toFixed(1) : '0.0'}
          </p>
        </div>
      </div>

      {/* Enroll Student Dialog */}
      {selectedClass && (
        <EnrollStudent 
          classCode={selectedClass._id}
          isOpen={isEnrollDialogOpen}
          onOpenChange={setIsEnrollDialogOpen}
          onSuccess={() => {
            setIsEnrollDialogOpen(false);
            fetchClasses();
          }}
        />
      )}
    </div>
  );
}