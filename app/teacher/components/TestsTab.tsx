'use client';
import { Clock, X, ChevronLeft, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSubjectClass } from '@/app/teacher/api/class';
import { createTest, getClassTeacherTest } from '@/app/api/test';

interface ClassItem {
  classId: string;
  class_code?: string;
  class_year?: string;
  subjects?: string[];
  studentCount?: number;
  testCount?: number;
}

interface TestItem {
  classID: string;
  status?: string;
}

interface FormData {
  testtitle: string;
  participants: string;
  closedDate: string;
  subject: string;
}

export default function TestsTab() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjectClassIds, setSubjectClassIds] = useState<string[]>([]);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [formData, setFormData] = useState<FormData>({
    testtitle: '',
    participants: '',
    closedDate: '',
    subject: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  
  const fetchTeacherTests = async () => {
    try {
      const response = await getClassTeacherTest( );
      if (response?.data?.data) {
        setTests(response.data.data);
      }
      console.log('Teacher Tests:', response);
    } catch (err) {
      console.error('Error fetching teacher tests:', err);
    }
  };

  const fetchSubjectClasses = async () => {
    try {
      const response = await getSubjectClass();
      console.log('Subject Classes Response:', response.data);
      if (response?.data) {
        // Map the full class objects
        setClasses(response.data);
        // Extract just the IDs for filtering
        const classIds = response.data.map((classItem: ClassItem) => classItem.classId);
        setSubjectClassIds(classIds);
      }
    } catch (err) {
      console.error('Error fetching subject classes:', err);
    }
  };

  // Fetch teacher tests and subject classes on component mount
  useEffect(() => {
    fetchSubjectClasses();
    fetchTeacherTests();
  }, []);



  const handleSelectClass = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setFormData({
      testtitle: '',
      participants: '',
      closedDate: '',
      subject: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.testtitle || !formData.participants || !formData.closedDate) {
      setError('Please fill in all fields');
      return;
    }

    if (!selectedClass) {
      setError('No class selected');
      return;
    }

      try {
      setLoading(true);
      await createTest(
        selectedClass.classId,
        formData.testtitle,
        parseInt(formData.participants),
        formData.closedDate,
        formData.subject
      );
      setSuccess('Test created successfully!');
      setTimeout(() => {
        setShowDialog(false);
        setSelectedClass(null);
        setSuccess('');
        fetchTeacherTests(); // Refresh tests list
      }, 1500);
    } catch (err) {
      setError('Failed to create test');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedClass(null);
    setError('');
    setSuccess('');
  };

  // Filter tests to show only those for classes the teacher is teaching
  const filteredTests = tests.filter((test: TestItem) => 
    subjectClassIds.includes(test.classID)
  );

  // Get unique years for filter dropdown
  const uniqueYears = Array.from(new Set(classes.map(c => c.class_year).filter(Boolean)));

  // Apply search and year filters
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.class_code?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesYear = selectedYear === 'all' || classItem.class_year === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] leading-tight">Lớp Học Của Tôi</h2>
            <p className="text-gray-600 text-sm mt-1.5">Quản lý bài kiểm tra cho các lớp bạn đang giảng dạy</p>
          </div>
        
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
          {/* Search Bar */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Tìm kiếm theo mã lớp</label>
            <input
              type="text"
              placeholder="Nhập mã lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition bg-white text-[#0F172A] placeholder:text-gray-400"
            />
          </div>

          {/* Year Filter */}
          <div className="sm:w-64">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Lọc theo niên khóa</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition bg-white text-[#0F172A] cursor-pointer"
            >
              <option value="all">Tất cả niên khóa</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((classItem) => (
              <div
                key={classItem.classId}
                onClick={() => router.push(`/teacher/class/${classItem.classId}?subject=${classItem.subjects?.[0] || ''}`)}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="bg-gradient-to-br from-[#2563EB] to-blue-700 h-36 flex items-center justify-center relative">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-bold mb-1.5 leading-tight">{classItem.class_code}</h3>
                    <p className="text-blue-100 text-sm">Niên khóa: {classItem.class_year}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-xs font-semibold">Đang hoạt động</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {classItem.subjects && classItem.subjects.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Môn học:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {classItem.subjects.map((subject: string, idx: number) => (
                            <span key={idx} className="text-xs bg-blue-100 text-[#2563EB] px-2.5 py-1 rounded-md font-medium">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 py-2 border-t border-gray-100">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Số học sinh</p>
                        <p className="text-2xl font-bold text-[#0F172A]">{classItem.studentCount || 0}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Số bài kiểm tra</p>
                        <p className="text-2xl font-bold text-green-600">{classItem.testCount || 0}</p>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-50 text-[#2563EB] py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors group-hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2">
                    Xem chi tiết lớp học →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-100">
              <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-lg font-medium">
                {classes.length === 0 ? 'Không có lớp học' : 'Không tìm thấy lớp học'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {classes.length === 0 
                  ? 'Bạn chưa được phân công giảng dạy lớp nào' 
                  : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}