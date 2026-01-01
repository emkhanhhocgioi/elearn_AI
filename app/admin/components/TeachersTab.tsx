'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { getAllTeachers, createTeacher, updateTeacher, Teacher as APITeacher, CreateTeacherDTO } from '../api/teacher';
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
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterExperience, setFilterExperience] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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
    
    const matchesSubject = filterSubject === 'all' || teacher.subject === filterSubject;
    const matchesGender = filterGender === 'all' || teacher.gender === filterGender;
    
    let matchesAge = true;
    if (filterAge !== 'all' && teacher.age) {
      const age = teacher.age;
      switch (filterAge) {
        case '20-30':
          matchesAge = age >= 20 && age <= 30;
          break;
        case '31-40':
          matchesAge = age >= 31 && age <= 40;
          break;
        case '41-50':
          matchesAge = age >= 41 && age <= 50;
          break;
        case '51+':
          matchesAge = age >= 51;
          break;
      }
    }
    
    let matchesExperience = true;
    if (filterExperience !== 'all' && teacher.yearsOfExperience) {
      const exp = teacher.yearsOfExperience;
      switch (filterExperience) {
        case '0-5':
          matchesExperience = exp >= 0 && exp <= 5;
          break;
        case '6-10':
          matchesExperience = exp >= 6 && exp <= 10;
          break;
        case '11-20':
          matchesExperience = exp >= 11 && exp <= 20;
          break;
        case '20+':
          matchesExperience = exp >= 20;
          break;
      }
    }
    
    return matchesSearch && matchesSubject && matchesGender && matchesAge && matchesExperience;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterSubject, filterGender, filterAge, filterExperience]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentPage === i
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };



  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Teachers Management</h2>
            <p className="text-blue-100">Manage and oversee all teacher accounts</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={handleOpenDialog} 
              className="bg-white text-blue-600 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105"
            >
              <Plus className="w-5 h-5" />
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
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl px-5 py-3 border border-gray-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300">
            <Search className="w-5 h-5 text-blue-500" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 cursor-pointer"
            >
              <option value="all">Tất cả môn học</option>
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

            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 cursor-pointer"
            >
              <option value="all">Tất cả giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>

            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 cursor-pointer"
            >
              <option value="all">Tất cả độ tuổi</option>
              <option value="20-30">20-30 tuổi</option>
              <option value="31-40">31-40 tuổi</option>
              <option value="41-50">41-50 tuổi</option>
              <option value="51+">51+ tuổi</option>
            </select>

            <select
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl px-5 py-3 text-sm border border-gray-200 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 cursor-pointer"
            >
              <option value="all">Tất cả kinh nghiệm</option>
              <option value="0-5">0-5 năm</option>
              <option value="6-10">6-10 năm</option>
              <option value="11-20">11-20 năm</option>
              <option value="20+">20+ năm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-blue-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Age</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200" style={{ minHeight: '700px' }}>
              {fetchLoading ? (
                // Skeleton loader
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  </tr>
                ))
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-600 mb-1">No teachers found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentTeachers.map((teacher) => (
                  <tr 
                    key={teacher._id} 
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group"
                    onClick={() => router.push(`/admin/teacher/${teacher._id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                          <span className="text-base font-bold text-white">
                            {teacher.name.charAt(0)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{teacher.name}</p>
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
        
        {/* Pagination */}
        {!fetchLoading && filteredTeachers.length > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTeachers.length)} trong số {filteredTeachers.length} giáo viên
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-blue-50 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Trước
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-blue-50 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Teachers</h3>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white">{teachers.length}</p>
          <p className="text-blue-100 text-sm mt-2">Active teachers in system</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-indigo-100 uppercase tracking-wide">Avg. Experience</h3>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white">
            {teachers.length > 0 && teachers.some(t => t.yearsOfExperience)
              ? (teachers.reduce((sum, t) => sum + (t.yearsOfExperience || 0), 0) / teachers.filter(t => t.yearsOfExperience).length).toFixed(1)
              : '0.0'}
            <span className="text-2xl ml-2">năm</span>
          </p>
          <p className="text-indigo-100 text-sm mt-2">Average years of teaching</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-green-100 uppercase tracking-wide">Avg. Age</h3>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white">
            {teachers.length > 0 && teachers.some(t => t.age)
              ? (teachers.reduce((sum, t) => sum + (t.age || 0), 0) / teachers.filter(t => t.age).length).toFixed(0)
              : '0'}
          </p>
          <p className="text-green-100 text-sm mt-2">Average teacher age</p>
        </div>
      </div>
    </div>
  );
}
