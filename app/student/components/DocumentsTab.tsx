'use client';
import { useState, useEffect } from 'react';
import { Download, FileText, BookOpen, Trash2 } from 'lucide-react';
import {getStudentLessons} from '@/app/student/api/lesson';
import downloadFileFromObject from '@/lib/downloadFile';
const DocumentsTab = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
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
  
  const getLesson = async () => {
    try {
      const response = await getStudentLessons();
      console.log("Lessons data:", response);
      
      if (response?.lessons) {
        const mappedDocuments = response.lessons.map((lesson: any) => ({
          id: lesson._id,
          title: lesson.title,
          class: lesson.subject,
          type: getFileTypeFromUrl(lesson.lessonMetadata),
          size: "N/A",
          uploadedDate: new Date(lesson.createDate).toISOString().split('T')[0],
          uploader: lesson.teacherId,
          downloadUrl: lesson.lessonMetadata
        }));
        
        setDocuments(mappedDocuments);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    getLesson();
  }, []);

  const getFileIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  // Filter documents based on selected subject
  const filteredDocuments = selectedSubject === 'all' 
    ? documents 
    : documents.filter(doc => doc.class === selectedSubject);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Các bài học của bạn</h2>
        
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
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Loading documents...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {selectedSubject === 'all' 
                ? 'No documents available' 
                : `Không có tài liệu cho môn ${subjects.find(s => s.value === selectedSubject)?.label}`}
            </p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                    <p className="text-xs text-gray-500">{doc.class}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{doc.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{doc.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span className="font-medium">{doc.uploadedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>By:</span>
                  <span className="font-medium">{doc.uploader}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(doc.downloadUrl, doc.title, doc.type)}
                  className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
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
