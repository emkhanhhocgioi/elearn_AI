'use client';
import { Plus, Edit, Clock, X, ChevronLeft, BarChart3, FileText, Search, Filter } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getTeacherClasses, getSubjectClass } from '@/app/teacher/api/class';
import { createTest, getClassTeacherTest } from '@/app/api/test';

interface ClassItem {
  classId: string;
  class_code: string;
  class_year: string;
  studentCount: number;
  testCount: number;
  subjects: string[];
}

interface TestItem {
  _id: string;
  testtitle: string;
  classID: string;
  participants: number;
  status: string;
  avg_score: string;
  closeDate: string;
}

export default function SubjectTab() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjectClassIds, setSubjectClassIds] = useState<string[]>([]);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [formData, setFormData] = useState({
    testtitle: '',
    participants: '',
    closedDate: '',
    subject: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  
  const fetchTeacherTests = async () => {
    try {
      const response = await getClassTeacherTest();
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
      console.log('Subject Classes Response:', response);
      if (response?.data?.data) {
        setSubjectClassIds(response.data.data);
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

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTeacherClasses();
      const allClasses = data.data.data || [];
      
      // Filter classes to show only those in subjectClassIds
      const filteredClasses = allClasses.filter((classItem: ClassItem) =>
        subjectClassIds.includes(classItem.classId)
      );
      
      setClasses(filteredClasses);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách lớp học');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [subjectClassIds]);

  // Get unique class years for filter dropdown
  const availableYears = useMemo(() => {
    const years = classes.map(c => c.class_year);
    return ['all', ...Array.from(new Set(years))];
  }, [classes]);

  // Filter and search classes
  const filteredClasses = useMemo(() => {
    return classes.filter(classItem => {
      const matchesSearch = classItem.class_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'all' || classItem.class_year === selectedYear;
      return matchesSearch && matchesYear;
    });
  }, [classes, searchTerm, selectedYear]);

  const filteredTests = useMemo(() => {
    return tests;
  }, [tests]);

  useEffect(() => {
    if (showDialog && classes.length === 0) {
      fetchClasses();
    }
  }, [showDialog, classes.length, fetchClasses]);

  const handleSelectClass = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setFormData({
      testtitle: '',
      participants: '',
      closedDate: '',
      subject: classItem.subjects[0] || ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.testtitle || !formData.participants || !formData.closedDate) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!selectedClass) {
      setError('Chưa chọn lớp học');
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
      setSuccess('Tạo bài kiểm tra thành công!');
      setTimeout(() => {
        setShowDialog(false);
        setSelectedClass(null);
        setSuccess('');
        fetchTeacherTests(); // Refresh tests list
      }, 1500);
    } catch (err) {
      setError('Không thể tạo bài kiểm tra');
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

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lớp Học Của Tôi</h2>
            <p className="text-gray-600 text-sm mt-1">Quản lý bài kiểm tra cho các lớp đang giảng dạy</p>
          </div>
          <button 
            onClick={() => setShowDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-purple-800 transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Tạo Bài Kiểm Tra</span>
          </button>
        </div>

        {/* Dialog Modal */}
        {showDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                {selectedClass ? (
                  <h3 className="text-xl font-bold text-gray-900">Tạo Bài Kiểm Tra</h3>
                ) : (
                  <h3 className="text-xl font-bold text-gray-900">Chọn Lớp Học</h3>
                )}
                <button
                  onClick={handleCloseDialog}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
                  </div>
                )}

                {!selectedClass ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn Lớp Học</h3>
                    <p className="text-gray-500 text-sm mb-6">Chọn lớp học để tạo bài kiểm tra</p>
                    
                    {loading ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Đang tải...</p>
                      </div>
                    ) : classes.length > 0 ? (
                      <div className="grid gap-4">
                        {classes.map((classItem) => (
                          <button
                            key={classItem.classId}
                            onClick={() => handleSelectClass(classItem)}
                            className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition group hover:shadow-md"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                                {classItem.class_code}
                              </p>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {classItem.class_year}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {classItem.subjects.map((subject, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded font-medium"
                                >
                                  📚 {subject}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>👥 {classItem.studentCount} học sinh</span>
                              <span>📝 {classItem.testCount} bài kiểm tra</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Không có lớp học</p>
                        <p className="text-gray-400 text-sm mt-2">Bạn chưa được phân công giảng dạy lớp nào</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tạo Bài Kiểm Tra</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      {selectedClass.class_code} - {selectedClass.class_year}
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tiêu đề bài kiểm tra
                        </label>
                        <input
                          type="text"
                          name="testtitle"
                          value={formData.testtitle}
                          onChange={handleInputChange}
                          placeholder="Nhập tiêu đề bài kiểm tra"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition hover:border-gray-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số lượng học sinh
                        </label>
                        <input
                          type="number"
                          name="participants"
                          value={formData.participants}
                          onChange={handleInputChange}
                          placeholder="Nhập số lượng học sinh"
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition hover:border-gray-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Hạn nộp bài
                        </label>
                        <input
                          type="datetime-local"
                          name="closedDate"
                          value={formData.closedDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition hover:border-gray-400"
                          required
                        />
                      </div>

                      <div className="flex gap-3 pt-6">
                        <button
                          type="button"
                          onClick={() => setSelectedClass(null)}
                          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                          Quay lại
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Đang tạo...' : 'Tạo bài kiểm tra'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tests Table */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <h3 className="text-xl font-bold text-purple-900">Danh Sách Bài Kiểm Tra</h3>
            <p className="text-sm text-purple-700 mt-1">Quản lý và theo dõi các bài kiểm tra của bạn</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Lớp học</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Câu hỏi</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nộp bài</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Điểm TB</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hạn nộp</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTests && filteredTests.length > 0 ? (
                  filteredTests.map((test: TestItem) => (
                    <tr key={test._id} className="hover:bg-purple-50/50 transition">
                      <td className="px-6 py-4 cursor-pointer hover:text-purple-600 transition" onClick={() => router.push(`/teacher/test/${test._id}`)}>
                        <p className="text-sm font-semibold text-gray-900">{test.testtitle}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <Clock className="w-3 h-3" />
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            test.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                            test.status === 'closed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {test.status === 'ongoing' ? 'Đang diễn ra' : test.status === 'closed' ? 'Đã đóng' : test.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{test.classID}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-gray-400" />
                          -
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">0/{test.participants}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all"
                              style={{ width: '0%' }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${parseInt(test.avg_score) > 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                          {parseInt(test.avg_score) > 0 ? `${test.avg_score}%` : 'Chưa có'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(test.closeDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="bg-gradient-to-r from-green-100 to-green-50 text-green-600 text-xs px-3 py-2 rounded-lg hover:from-green-200 hover:to-green-100 transition font-semibold flex items-center gap-1 hover:shadow-md">
                            <BarChart3 className="w-3 h-3" />
                            Chấm điểm
                          </button>
                          <button onClick={() => router.push(`/teacher/test/${test._id}`)} className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600 hover:text-purple-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-lg">Chưa có bài kiểm tra nào</p>
                      <p className="text-gray-400 text-sm mt-2">Tạo bài kiểm tra đầu tiên cho lớp của bạn</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
