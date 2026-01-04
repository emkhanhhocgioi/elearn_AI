'use client';
import { useState, useEffect } from 'react';
import { X, Save, BookOpen, Search, ArrowUpDown } from 'lucide-react';
import { editTestById } from '@/app/teacher/api/test';
import { getTeacherLessons } from '@/app/teacher/api/lesson';

interface TestDetail {
  _id: string;
  testtitle: string;
  classID: {
    _id: string;
    class_code: string;
  };
  teacherID: {
    _id: string;
    name: string;
  };
  participants: number;
  closeDate: string;
  status: string;
  avg_score: string;
  createDate: string;
}

interface EditTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  testDetail: TestDetail | null;
  onSuccess: () => void;
}

export default function EditTestDialog({
  isOpen,
  onClose,
  testDetail,
  onSuccess,
}: EditTestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [testFormData, setTestFormData] = useState({
    testtitle: '',
    classID: '',
    test_time: '',
    closeDate: '',
    lessonID: '',
  });

  // Update form data when testDetail changes or dialog opens
  useEffect(() => {
    if (testDetail && isOpen) {
      setTestFormData({
        testtitle: testDetail.testtitle || '',
        classID: testDetail.classID._id || '',
        test_time: '',
        closeDate: testDetail.closeDate ? testDetail.closeDate.split('T')[0] : '',
        lessonID: '',
      });
      setSelectedLessonId('');
      setError('');
      setSuccess('');
      
      // Fetch lessons for the class
      const fetchLessons = async () => {
        try {
          const response = await getTeacherLessons(testDetail.classID._id);
          setLessons(response.lessons || []);
        } catch (error) {
          console.error('Error fetching lessons:', error);
          setLessons([]);
        }
      };
      fetchLessons();
    }
  }, [testDetail, isOpen]);

  const handleTestFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testDetail) return;

    try {
      setLoading(true);
      await editTestById(
        testDetail._id,
        selectedLessonId || testFormData.lessonID,
        testFormData.testtitle,
        Number(testFormData.test_time),
        testFormData.closeDate
      );
      setSuccess('Cập nhật bài kiểm tra thành công!');
      setTimeout(() => {
        onClose();
        onSuccess();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Không thể cập nhật bài kiểm tra');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa Thông tin Bài kiểm tra</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleUpdateTest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề Bài kiểm tra *
              </label>
              <input
                type="text"
                name="testtitle"
                value={testFormData.testtitle}
                onChange={handleTestFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Chọn Bài học (Tùy chọn)
                </div>
              </label>
              {lessons.length > 0 ? (
                <div className="space-y-3">
                  {/* Search and Sort Controls */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm bài học..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      {sortOrder === 'desc' ? 'Mới nhất' : 'Cũ nhất'}
                    </button>
                  </div>
                  
                  <div className="border border-gray-300 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Chọn</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Tiêu đề Bài học</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Môn học</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Ngày tạo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lessons
                          .filter(lesson => 
                            lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            lesson.subject.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .sort((a, b) => {
                            const dateA = new Date(a.createDate || a.createdAt).getTime();
                            const dateB = new Date(b.createDate || b.createdAt).getTime();
                            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                          })
                          .map((lesson) => (
                            <tr
                              key={lesson._id}
                              onClick={() => setSelectedLessonId(lesson._id)}
                              className={`cursor-pointer hover:bg-blue-50 transition ${
                                selectedLessonId === lesson._id ? 'bg-blue-100' : ''
                              }`}
                            >
                              <td className="px-4 py-2">
                                <input
                                  type="radio"
                                  name="lesson"
                                  checked={selectedLessonId === lesson._id}
                                  onChange={() => setSelectedLessonId(lesson._id)}
                                  className="w-4 h-4 text-blue-600"
                                />
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">{lesson.title}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{lesson.subject}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">
                                {new Date(lesson.createDate || lesson.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Không có bài học nào cho lớp này</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hạn nộp bài *
              </label>
              <input
                type="date"
                name="closeDate"
                value={testFormData.closeDate}
                onChange={handleTestFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
