'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, Users, BookOpen, Clock } from 'lucide-react';
import { createTest } from '../../../api/test';
import { useSearchParams } from 'next/navigation';
export default function AddTestPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = params.id as string;
  const subject = searchParams.get('subject') || '';

  const [formData, setFormData] = useState({
    testtitle: '',
    test_time: 0,
    closedDate: '',
    subject: subject
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createTest(
        classId,
        formData.testtitle,
        formData.closedDate,
        formData.subject
      );

      if (response && response.success) {
        router.push(`/teacher/class/${classId}`);
      } else {
        setError(response?.message || 'Failed to create test');
      }
    } catch (err) {
      setError('An error occurred while creating the test');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Tạo Bài kiểm tra Mới</h1>
              <p className="text-sm text-gray-500 mt-1">Thêm bài kiểm tra mới cho lớp học của bạn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Title */}
            <div>
              <label htmlFor="testtitle" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Tiêu đề Bài kiểm tra
              </label>
              <input
                type="text"
                id="testtitle"
                name="testtitle"
                value={formData.testtitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="VD: Kiểm tra giữa kỳ - Toán học"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Môn học
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={true}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                placeholder="VD: Toán học, Vật lý, Hóa học"
              />
            </div>

            {/* Close Date */}
            <div>
              <label htmlFor="closedDate" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Hạn nộp bài
              </label>
              <input
                type="datetime-local"
                id="closedDate"
                name="closedDate"
                value={formData.closedDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Plus className="w-5 h-5" />
                {loading ? 'Đang tạo...' : 'Tạo Bài kiểm tra'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span className="text-xl">ℹ️</span> Thông tin quan trọng
          </h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Sau khi tạo bài kiểm tra, bạn có thể thêm câu hỏi vào</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Hạn nộp xác định thời gian học sinh có thể nộp bài</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Đảm bảo số lượng học sinh khớp với sĩ số lớp</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
