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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Đang tải dữ liệu bài học...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 text-center mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Các bài học của bạn</h2>
        <p className="text-sm text-gray-600 mt-1">
          Tổng số: {documents.length} bài học
        </p>
        
        {/* Subject Filter */}
        <div className="mt-4">
          <label htmlFor="subject-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Lọc theo môn học
          </label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {subjects.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {selectedSubject === 'all' 
                ? 'Chưa có bài học nào' 
                : `Không có tài liệu cho môn ${subjects.find(s => s.value === selectedSubject)?.label}`}
            </p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div key={doc._id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {getFileIcon(doc.fileType || '')}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                    <p className="text-xs text-gray-500">{doc.subject}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Loại:</span>
                  <span className="font-medium">{doc.fileType}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Ngày tải lên:</span>
                  <span className="font-medium">{doc.createDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(doc.lessonMetadata, doc.title, doc.fileType || 'document')}
                  className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Tải xuống
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;