'use client';
import { useState, useEffect } from 'react';
import { Download, FileText, BookOpen, Trash2 } from 'lucide-react';
import {getStudentLessons} from '@/app/student/api/lesson';
const DocumentsTab = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const getLesson = async () => {
    try {
      const response = await getStudentLessons();
      console.log("Lessons data:", response);
      
      if (response?.lessons) {
        const mappedDocuments = response.lessons.map((lesson: any) => ({
          id: lesson._id,
          title: lesson.title,
          class: lesson.subject,
          type: "PDF",
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Các bài học của bạn</h2>
     
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No documents available</p>
          </div>
        ) : (
          documents.map((doc) => (
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
                <button className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                  <Trash2 className="w-5 h-5" />
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
