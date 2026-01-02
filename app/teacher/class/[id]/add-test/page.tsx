'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, Users, BookOpen, Clock, CheckCircle, X } from 'lucide-react';
import { createTest } from '../../../api/test';
import { useSearchParams } from 'next/navigation';

export default function AddTestPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = params.id as string;
  const subject = searchParams.get('subject') || '';

  const initialFormData = {
    testtitle: '',
    test_time: 0,
    closedDate: '',
    subject: subject
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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
        setShowSuccessDialog(true);
        // Reset form data
        setFormData(initialFormData);
      } else {
        setError(response?.message || 'Không thể tạo bài kiểm tra. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tạo bài kiểm tra. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    router.push(`/teacher/class/${classId}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      {/* Success Dialog - ĐẶT Ở NGOÀI CÙNG */}
      {showSuccessDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-slideUp">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                🎉 Tạo thành công!
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Bài kiểm tra <span className="font-semibold text-gray-900">{formData.testtitle}</span> đã được tạo thành công.<br/>
                Bạn có thể thêm câu hỏi ngay bây giờ.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleCloseSuccessDialog}
                  className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Xem bài kiểm tra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/teacher/class/${classId}?subject=${subject}`)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 font-medium group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </button>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tạo Bài kiểm tra mới
                </h1>
                <p className="mt-2 text-gray-600">Điền thông tin để tạo bài kiểm tra cho lớp học</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Test Title */}
              <div>
                <label htmlFor="testtitle" className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Tiêu đề Bài kiểm tra
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="testtitle"
                  name="testtitle"
                  value={formData.testtitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-gray-400"
                  placeholder="VD: Kiểm tra giữa kỳ - Toán học"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Môn học
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={true}
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600"
                  placeholder="VD: Toán học, Vật lý, Hóa học"
                />
              </div>

              {/* Close Date */}
              <div>
                <label htmlFor="closedDate" className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Hạn nộp bài
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="closedDate"
                  name="closedDate"
                  value={formData.closedDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-400"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl animate-slideDown">
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 bg-blue-600 text-white px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:active:scale-100 font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Tạo Bài kiểm tra
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 active:scale-95 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-blue-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                i
              </div>
              Thông tin quan trọng
            </h3>
            <ul className="text-sm text-blue-800 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg leading-none mt-0.5">•</span>
                <span>Sau khi tạo bài kiểm tra, bạn có thể thêm câu hỏi vào</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg leading-none mt-0.5">•</span>
                <span>Hạn nộp xác định thời gian học sinh có thể nộp bài</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg leading-none mt-0.5">•</span>
                <span>Các trường có dấu <span className="text-red-500 font-semibold">*</span> là bắt buộc</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}