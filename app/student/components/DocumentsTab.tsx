'use client';
import { useState, useEffect } from 'react';
import { Download, FileText, BookOpen, Trash2 } from 'lucide-react';

const DocumentsTab = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch documents from API
    const mockDocuments = [
      {
        id: 1,
        title: "React Hook Advanced Guide",
        class: "Frontend Development Batch 2024",
        type: "PDF",
        size: "2.4 MB",
        uploadedDate: "2024-01-15",
        uploader: "John Doe"
      },
      {
        id: 2,
        title: "Node.js Best Practices",
        class: "Backend Development Advanced",
        type: "PDF",
        size: "3.1 MB",
        uploadedDate: "2024-01-18",
        uploader: "Jane Smith"
      },
      {
        id: 3,
        title: "Database Design Patterns",
        class: "Full Stack Development",
        type: "DOCX",
        size: "1.8 MB",
        uploadedDate: "2024-01-20",
        uploader: "Mike Johnson"
      },
      {
        id: 4,
        title: "JavaScript Interview Questions",
        class: "Frontend Development Batch 2024",
        type: "PDF",
        size: "1.2 MB",
        uploadedDate: "2024-01-22",
        uploader: "John Doe"
      }
    ];

    setDocuments(mockDocuments);
    setIsLoading(false);
  }, []);

  const getFileIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Document Repository</h2>
        <p className="text-gray-600 mt-1">Access all study materials and documents from your classes</p>
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
