'use client';
import { Plus, Edit, Trash2, FileText, Search, X } from 'lucide-react';
import { getTeacherLessons, deleteLesson } from '@/app/teacher/api/lesson';
import { useEffect, useState } from 'react';

interface Lesson {
  _id: string;
  title: string;
  classId: string;
  teacherId: string;
  subject: string;
  lessonMetadata: string;
  fileType?: string;
  createDate: string;
  __v: number;
}

type SortField = 'title' | 'subject' | 'createDate' | 'fileType';
type SortOrder = 'asc' | 'desc';

export default function LessonsTab() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('createDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterFileType, setFilterFileType] = useState<string>('all');

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    try {
      setLoading(true);
      const response = await getTeacherLessons();
      console.log(response);
      if (response.lessons) {
        setLessons(response.lessons);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(lessonId: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa bài giảng này?')) {
      return;
    }
    
    try {
      await deleteLesson(lessonId);
      setLessons(lessons.filter(lesson => lesson._id !== lessonId));
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      alert('Xóa bài giảng thất bại. Vui lòng thử lại.');
    }
  }

  // Get unique subjects and file types for filter dropdowns
  const uniqueSubjects = Array.from(new Set(lessons.map(l => l.subject))).sort();
  const uniqueFileTypes = Array.from(
    new Set(lessons.map(l => getFileExtension(l.fileType)).filter(Boolean))
  ).sort();

  // Filter lessons based on search term, subject, and file type
  const filteredLessons = lessons.filter(lesson => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      lesson.title.toLowerCase().includes(searchLower) ||
      lesson.subject.toLowerCase().includes(searchLower) ||
      (lesson.fileType && lesson.fileType.toLowerCase().includes(searchLower));
    
    const matchesSubject = filterSubject === 'all' || lesson.subject === filterSubject;
    const matchesFileType = filterFileType === 'all' || getFileExtension(lesson.fileType) === filterFileType;
    
    return matchesSearch && matchesSubject && matchesFileType;
  });

  // Sort filtered lessons
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    if (sortField === 'createDate') {
      aValue = new Date(a.createDate).getTime().toString();
      bValue = new Date(b.createDate).getTime().toString();
    } else if (sortField === 'fileType') {
      aValue = getFileExtension(a.fileType);
      bValue = getFileExtension(b.fileType);
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  function getFileExtension(fileType: string | undefined): string {
    if (!fileType) return '';
    
    // Normalize to lowercase for comparison
    const normalizedType = fileType.toLowerCase();
    
    // Map complex MIME types to simple extensions
    const mimeTypeMap: { [key: string]: string } = {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      'application/msword': 'doc',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.ms-powerpoint': 'ppt',
    };
    
    // Check if it's a known complex MIME type
    if (mimeTypeMap[normalizedType]) {
      return mimeTypeMap[normalizedType];
    }
    
    // Otherwise, extract extension from MIME type
    const parts = fileType.split('/');
    return parts[1] || '';
  }

  function getDownloadFileName(lesson: Lesson): string {
    const extension = getFileExtension(lesson.fileType);
    const cleanTitle = lesson.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
    return `${cleanTitle}.${extension}`;
  }

  async function handleDownload(lesson: Lesson) {
    if (!lesson.lessonMetadata) return;
    
    try {
      const response = await fetch(lesson.lessonMetadata);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getDownloadFileName(lesson);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Không thể tải tài liệu. Vui lòng thử lại.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải bài giảng...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] leading-tight">Bài Giảng Của Tôi</h2>
          <p className="text-sm text-gray-500 mt-1">{lessons.length} bài giảng</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, môn học hoặc loại file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter and Sorting Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Filter Controls */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Môn học:</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm bg-white min-w-[140px]"
                >
                  <option value="all">Tất cả</option>
                  {uniqueSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Loại file:</label>
                <select
                  value={filterFileType}
                  onChange={(e) => setFilterFileType(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm bg-white min-w-[120px]"
                >
                  <option value="all">Tất cả</option>
                  {uniqueFileTypes.map(fileType => (
                    <option key={fileType} value={fileType}>{fileType.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sorting Controls */}
            <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Sắp xếp theo:</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm bg-white min-w-[120px]"
              >
                <option value="createDate">Ngày tạo</option>
                <option value="title">Tiêu đề</option>
                <option value="subject">Môn học</option>
                <option value="fileType">Loại file</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Thứ tự:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm bg-white min-w-[120px]"
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-500">
          Hiển thị {sortedLessons.length} trong tổng số {lessons.length} bài giảng
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F1F5F9] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tiêu đề bài giảng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Loại file</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tài liệu</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedLessons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Không tìm thấy bài giảng nào. Tạo bài giảng đầu tiên của bạn!</p>
                  </td>
                </tr>
              ) : (
                sortedLessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-[#F1F5F9] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#0F172A] leading-relaxed">{lesson.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-[#2563EB]">{lesson.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        {lesson.fileType ? getFileExtension(lesson.fileType).toUpperCase() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">{formatDate(lesson.createDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {lesson.lessonMetadata && (
                        <button
                          onClick={() => handleDownload(lesson)}
                          className="text-sm text-[#2563EB] hover:text-blue-700 hover:underline transition-colors focus:outline-none focus:underline"
                        >
                          Tải xuống
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1"
                          title="Chỉnh sửa bài giảng"
                          onClick={() => {
                            // TODO: Implement edit functionality (navigate to edit page or open modal)
                            console.log('Edit lesson:', lesson._id);
                          }}
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          title="Xóa bài giảng"
                          onClick={() => handleDelete(lesson._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
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
    </div>
  );
}