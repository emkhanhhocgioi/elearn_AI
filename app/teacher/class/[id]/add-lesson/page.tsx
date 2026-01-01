'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Upload, BookOpen, FileText } from 'lucide-react';
import { createLesson } from '../../../api/lesson';

export default function AddLessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = params.id as string;
  const subject = searchParams.get('subject') || '';

  const [formData, setFormData] = useState({
    title: '',
    subject: subject,
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a lesson title');
      return;
    }

    if (!file) {
      setError('Please upload a lesson file');
      return;
    }

    setIsSubmitting(true);

    try {
      const teacherId = localStorage.getItem('teacherId') || '';
      
      const response = await createLesson(
        formData.title,
        classId,
        teacherId,
        formData.subject,
        file
      );

      if (response) {
        alert('Lesson created successfully!');
        router.push(`/teacher/class/${classId}?subject=${subject}`);
      }
    } catch (err: any) {
      console.error('Error creating lesson:', err);
      setError(err.response?.data?.message || 'Failed to create lesson. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">Thêm Bài học Mới</h1>
              <p className="text-sm text-gray-500 mt-1">Tạo bài học mới cho lớp học của bạn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Lesson Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Lesson Title
                </div>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Nhập tiêu đề bài học..."
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Môn học
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Nhập môn học..."
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Lesson Material
                </div>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="lesson-file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                />
                <label
                  htmlFor="lesson-file"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload lesson material
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, DOC, DOCX, PPT, PPTX, TXT (Max 10MB)
                  </p>
                </label>
              </div>
              {file && (
                <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-900">
                    <span className="font-semibold">Đã chọn file:</span> {file.name}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-sm ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Đang tạo bài học...' : 'Tạo Bài học'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
            <span className="text-xl">📚</span> Mẹo tạo Bài học
          </h3>
          <ul className="text-sm text-purple-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Sử dụng tiêu đề rõ ràng và mô tả cho bài học</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Tải lên tài liệu đầy đủ và bao quát chủ đề</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Hỗ trợ định dạng: PDF, Word, PowerPoint</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Đảm bảo file của bạn được định dạng đúng và dễ đọc</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
