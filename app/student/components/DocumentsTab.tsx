'use client';
import { useState, useEffect } from 'react';
import { Download, FileText, BookOpen, Loader2, Search, X } from 'lucide-react';
import {getStudentLessons} from '@/app/student/api/lesson';

export interface Lesson {
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

const DocumentsTab = () => {
  const [documents, setDocuments] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('createDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterFileType, setFilterFileType] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  function getFileExtension(fileType: string | undefined): string {
    if (!fileType) return '';
    
    const normalizedType = fileType.toLowerCase();
    
    const mimeTypeMap: { [key: string]: string } = {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      'application/msword': 'doc',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/pdf': 'pdf',
    };
    
    if (mimeTypeMap[normalizedType]) {
      return mimeTypeMap[normalizedType];
    }
    
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
  
  
  useEffect(() => {
    const getLesson = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getStudentLessons();
        console.log("Lessons data:", response.lessons);
        
        if (response?.lessons && Array.isArray(response.lessons)) {
          setDocuments(response.lessons);
        } else {
          console.warn("No lessons found in response");
          setDocuments([]);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    getLesson();
  }, []);

  // Get unique subjects and file types for filter dropdowns
  const uniqueSubjects = Array.from(new Set(documents.map(l => l.subject))).sort();
  const uniqueFileTypes = Array.from(
    new Set(documents.map(l => getFileExtension(l.fileType)).filter(Boolean))
  ).sort();

  // Filter documents based on search term, subject, and file type
  const filteredDocuments = documents.filter(doc => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchLower) ||
      doc.subject.toLowerCase().includes(searchLower) ||
      (doc.fileType && doc.fileType.toLowerCase().includes(searchLower));
    
    const matchesSubject = filterSubject === 'all' || doc.subject === filterSubject;
    const matchesFileType = filterFileType === 'all' || getFileExtension(doc.fileType) === filterFileType;
    
    return matchesSearch && matchesSubject && matchesFileType;
  });

  // Sort filtered documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải tài liệu...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] leading-tight">Tài Liệu Học Tập</h2>
          <p className="text-sm text-gray-500 mt-1">{documents.length} tài liệu</p>
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
          Hiển thị {sortedDocuments.length} trong tổng số {documents.length} tài liệu
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F1F5F9] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tiêu đề tài liệu
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Loại file</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tải xuống</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedDocuments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Không tìm thấy tài liệu nào.</p>
                  </td>
                </tr>
              ) : (
                sortedDocuments.map((doc) => (
                  <tr key={doc._id} className="hover:bg-[#F1F5F9] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#0F172A] leading-relaxed">{doc.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-[#2563EB]">{doc.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        {doc.fileType ? getFileExtension(doc.fileType).toUpperCase() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">{formatDate(doc.createDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {doc.lessonMetadata && (
                        <button
                          onClick={() => handleDownload(doc)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1"
                        >
                          <Download className="w-4 h-4" />
                          Tải xuống
                        </button>
                      )}
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
};

export default DocumentsTab;