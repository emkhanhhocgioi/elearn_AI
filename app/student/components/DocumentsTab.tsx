'use client';
import { useState, useEffect } from 'react';
import { Download, FileText, BookOpen, Loader2 } from 'lucide-react';
import {getStudentLessons} from '@/app/student/api/lesson';
import downloadFileFromObject from '@/lib/downloadFile';


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

export interface DocumentItem {
  id: string;
  title: string;
  class: string;
  type: string;
  size: string;
  uploadedDate: string;
  uploader: string;
  downloadUrl: string;
}

const DocumentsTab = () => {
  const [documents, setDocuments] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  
  // 12 môn học THCS
  const subjects = [
    { value: 'all', label: 'Tất cả môn học' },
    { value: 'Toán học', label: 'Toán học' },
    { value: 'Ngữ văn', label: 'Ngữ văn' },
    { value: 'Tiếng Anh', label: 'Tiếng Anh' },
    { value: 'Vật lý', label: 'Vật lý' },
    { value: 'Hóa học', label: 'Hóa học' },
    { value: 'Sinh học', label: 'Sinh học' },
    { value: 'Lịch sử', label: 'Lịch sử' },
    { value: 'Địa lý', label: 'Địa lý' },
    { value: 'Giáo dục công dân', label: 'Giáo dục công dân' },
    { value: 'Tin học', label: 'Tin học' },
    { value: 'Công nghệ', label: 'Công nghệ' },
    { value: 'Thể dục', label: 'Thể dục' }
  ];
  
  // Hàm xác định loại file từ URL
  const getFileTypeFromUrl = (url: string) => {
    if (!url) return 'Unknown';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.pdf') || lowerUrl.includes('/raw/')) return 'PDF';
    if (lowerUrl.includes('.doc') || lowerUrl.includes('.docx')) return 'DOC';
    if (lowerUrl.includes('.ppt') || lowerUrl.includes('.pptx')) return 'PPT';
    if (lowerUrl.includes('.xls') || lowerUrl.includes('.xlsx')) return 'XLS';
    return 'Document';
  };

  // Hàm tải file
  const handleDownload = async (url: string, filename: string, filetype: string) => {
    try {
      console.log("Downloading file from URL:", url);
      console.log("Filename:", filename);
      console.log("Filetype:", filetype);
      await downloadFileFromObject({
        file: {
          url,
          name: filename,
          type: filetype
        }
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Không thể tải file. Vui lòng thử lại!");
    }
  };
  
  
  useEffect(() => {
    const getLesson = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getStudentLessons();
        console.log("Lessons data:", response.lessons);
        
        if (response?.lessons && Array.isArray(response.lessons)) {
          const mappedDocuments = response.lessons.map((lesson: Lesson) => ({
            ...lesson,
            id: lesson._id,
            title: lesson.title,
            subject: lesson.subject,
            type: getFileTypeFromUrl(lesson.lessonMetadata),
            size: "N/A",
            uploadedDate: new Date(lesson.createDate).toLocaleDateString('vi-VN'),
            uploader: lesson.teacherId,
            downloadUrl: lesson.lessonMetadata,
            fileType: lesson.fileType || getFileTypeFromUrl(lesson.lessonMetadata),
            createDate: new Date(lesson.createDate).toLocaleDateString('vi-VN')
          }));  
          
          console.log("Mapped documents:", mappedDocuments);
          setDocuments(mappedDocuments);
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

  const getFileIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  // Filter documents based on selected subject
  const filteredDocuments = selectedSubject === 'all' 
    ? documents 
    : documents.filter(doc => doc.subject === selectedSubject);

  // Loading state - Skeleton Screen
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mb-4 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
              </div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 max-w-md shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-700 text-center mb-6 leading-relaxed font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0F172A] leading-tight bg-gradient-to-r from-[#0F172A] to-[#2563EB] bg-clip-text text-transparent">
            Tài Liệu Học Tập
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Tổng số <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white px-3 py-1 rounded-full text-sm font-bold ml-1">{documents.length}</span> tài liệu
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="flex gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-600 font-medium">Đã xem</p>
            <p className="text-2xl font-bold text-blue-700">{Math.floor(documents.length * 0.7)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-xs text-green-600 font-medium">Mới nhất</p>
            <p className="text-2xl font-bold text-green-700">{Math.floor(documents.length * 0.3)}</p>
          </div>
        </div>
      </div>
        
      {/* Subject Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="subject-filter" className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] whitespace-nowrap">
            <BookOpen className="w-5 h-5 text-[#2563EB]" />
            Lọc theo môn học
          </label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-[#0F172A] font-medium transition-all hover:border-[#2563EB] cursor-pointer bg-white shadow-sm"
          >
            {subjects.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filteredDocuments.length} kết quả
          </span>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full">
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="inline-flex items-center justify-center p-6 bg-white rounded-full shadow-lg mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {selectedSubject === 'all' 
                  ? 'Chưa có tài liệu nào' 
                  : 'Không tìm thấy tài liệu'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {selectedSubject === 'all' 
                  ? 'Các tài liệu học tập sẽ xuất hiện ở đây khi giáo viên upload' 
                  : `Chưa có tài liệu cho môn ${subjects.find(s => s.value === selectedSubject)?.label}`}
              </p>
            </div>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div 
              key={doc._id} 
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#2563EB] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-3 bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {getFileIcon(doc.fileType || '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0F172A] text-base mb-1.5 leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                        {doc.subject}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Loại file:
                  </span>
                  <span className="font-bold text-[#0F172A] px-2 py-1 bg-white rounded-md">{doc.fileType}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ngày tải:
                  </span>
                  <span className="font-semibold text-[#0F172A]">{doc.createDate}</span>
                </div>
              </div>

              <button 
                onClick={() => handleDownload(doc.lessonMetadata, doc.title, doc.fileType || 'document')}
                className="group/btn w-full bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              >
                <Download className="w-5 h-5 group-hover/btn:animate-bounce" />
                Tải xuống
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;