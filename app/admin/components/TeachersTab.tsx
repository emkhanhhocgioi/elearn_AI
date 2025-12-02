'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { getAllTeachers, createTeacher, updateTeacher, deleteTeacher, Teacher as APITeacher, CreateTeacherDTO } from '../api/teacher';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
export interface Teacher {
  _id: string;
  name: string;
  age: number;
  gender: string;
  subject: string;
  classInCharge?: string;
  phoneNumber?: string;
  email: string;
  yearsOfExperience?: number;
}
export default function TeachersTab() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<APITeacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingTeacher, setEditingTeacher] = useState<APITeacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Nam',
    subject: '',
    phoneNumber: '',
    yearsOfExperience: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setFetchLoading(true);
      const teachersData = await getAllTeachers();
      console.log('Teachers Response:', teachersData);
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTeacher = async () => {
    if (!formData.name || !formData.email || !formData.subject) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Email, Môn học)');
      return;
    }

    if (!formData.age || !formData.gender) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tuổi, Giới tính)');
      return;
    }

    // Nếu đang edit, không cần password
    if (!editingTeacher && !formData.password) {
      alert('Vui lòng nhập mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      if (editingTeacher) {
        // Cập nhật giáo viên
        const teacherData: Partial<CreateTeacherDTO> = {
          name: formData.name,
          email: formData.email,
          age: parseInt(formData.age),
          gender: formData.gender,
          subject: formData.subject,
        };

        if (formData.password) teacherData.password = formData.password;
        if (formData.phoneNumber) teacherData.phoneNumber = formData.phoneNumber;
        if (formData.yearsOfExperience) teacherData.yearsOfExperience = parseInt(formData.yearsOfExperience);

        await updateTeacher(editingTeacher._id, teacherData);
        alert('Cập nhật giáo viên thành công!');
      } else {
        // Tạo giáo viên mới
        const teacherData: CreateTeacherDTO = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age),
          gender: formData.gender,
          subject: formData.subject,
        };

        if (formData.phoneNumber) teacherData.phoneNumber = formData.phoneNumber;
        if (formData.yearsOfExperience) teacherData.yearsOfExperience = parseInt(formData.yearsOfExperience);

        await createTeacher(teacherData);
        alert('Tạo giáo viên thành công!');
      }
      
      setFormData({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'Nam',
        subject: '',
        phoneNumber: '',
        yearsOfExperience: ''
      });
      setEditingTeacher(null);
      setIsOpen(false);
      await fetchTeachers();
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu giáo viên');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (teacher: APITeacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: '',
      age: teacher.age.toString(),
      gender: teacher.gender,
      subject: teacher.subject,
      phoneNumber: teacher.phoneNumber || '',
      yearsOfExperience: teacher.yearsOfExperience?.toString() || ''
    });
    setIsOpen(true);
  };


  const handleDelete = async (teacherId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      return;
    }

    try {
      await deleteTeacher(teacherId);
      alert('Xóa giáo viên thành công!');
      await fetchTeachers();
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa giáo viên');
      console.error(error);
    }
  };

  const handleOpenDialog = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      age: '',
      gender: 'Nam',
      subject: '',
      phoneNumber: '',
      yearsOfExperience: ''
    });
    setIsOpen(true);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });



  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Teachers Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add New Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTeacher ? 'Cập Nhật Giáo Viên' : 'Thêm Giáo Viên Mới'}</DialogTitle>
              <DialogDescription>
                {editingTeacher ? 'Cập nhật thông tin giáo viên' : 'Nhập thông tin để thêm giáo viên mới vào hệ thống'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-900">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="VD: Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-900">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="teacher@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Mật Khẩu {!editingTeacher && <span className="text-red-500">*</span>}
                  {editingTeacher && <span className="text-gray-500 text-xs ml-2">(Bỏ trống nếu không đổi)</span>}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-900">
                    Môn Học <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn môn học --</option>
                    <option value="Toán">Toán</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Lịch sử">Lịch sử</option>
                    <option value="Địa lý">Địa lý</option>
                    <option value="Giáo dục công dân">Giáo dục công dân</option>
                    <option value="Công nghệ">Công nghệ</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Thể dục">Thể dục</option>
                    <option value="Âm nhạc">Âm nhạc</option>
                    <option value="Mỹ thuật">Mỹ thuật</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium text-gray-900">
                    Giới Tính <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium text-gray-900">
                    Tuổi <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="VD: 35"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-900">
                    Số Điện Thoại
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="0123456789"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="yearsOfExperience" className="text-sm font-medium text-gray-900">
                  Số Năm Kinh Nghiệm
                </label>
                <input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  placeholder="VD: 5"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                onClick={handleCreateTeacher}
                disabled={isLoading}
              >
                {isLoading ? (
                  editingTeacher ? 'Đang cập nhật...' : 'Đang tạo...'
                ) : (
                  editingTeacher ? 'Cập Nhật' : 'Thêm Giáo Viên'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <option value="all">All Teachers</option>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Age</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fetchLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading teachers...
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No teachers found
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr 
                    key={teacher._id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/teacher/${teacher._id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {teacher.name.charAt(0)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{teacher.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{teacher.gender === 'Nam' ? 'Nam' : 'Nữ'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{teacher.age || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{teacher.yearsOfExperience ? `${teacher.yearsOfExperience} năm` : '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                     
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Teachers</h3>
          <p className="text-3xl font-bold text-gray-900">{teachers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Avg. Experience</h3>
          <p className="text-3xl font-bold text-blue-600">
            {teachers.length > 0 && teachers.some(t => t.yearsOfExperience)
              ? (teachers.reduce((sum, t) => sum + (t.yearsOfExperience || 0), 0) / teachers.filter(t => t.yearsOfExperience).length).toFixed(1)
              : '0.0'} năm
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Avg. Age</h3>
          <p className="text-3xl font-bold text-green-600">
            {teachers.length > 0 && teachers.some(t => t.age)
              ? (teachers.reduce((sum, t) => sum + (t.age || 0), 0) / teachers.filter(t => t.age).length).toFixed(0)
              : '0'}
          </p>
        </div>
      </div>
    </div>
  );
}
