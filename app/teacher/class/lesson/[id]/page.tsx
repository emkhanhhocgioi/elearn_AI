'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLessonById, updateLesson, deleteLesson } from '@/app/teacher/api/lesson';
import { ArrowLeft, Save, Trash2, Upload, FileText, Clock, User, BookOpen } from 'lucide-react';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await getLessonById(lessonId);
      console.log('Fetched lesson:', response);
      setLesson(response.lesson);
      setTitle(response.lesson.title);
      setFilePreview(response.lesson.lessonMetadata || '');
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  const handleUpdate = async () => {
    if (!lesson) return;
    
    try {
      setSaving(true);
      const response = await updateLesson(
        lessonId,
        title,  
        lesson.classId._id,
        lesson.teacherId._id,
        lesson.subject,
        file || undefined
      );
      if (response.success){
            alert('Lesson updated successfully!');
      }
      
      
      setIsEditing(false);
      fetchLesson(); // Refresh data
    } catch (error) {
      console.error('Error updating lesson:', error);
      alert('Failed to update lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      await deleteLesson(lessonId);
      alert('Lesson deleted successfully!');
      router.back();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Failed to delete lesson');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lesson not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2.5 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Chi tiết Bài học</h1>
                <p className="text-sm text-gray-500 mt-1">Xem và quản lý thông tin bài học</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg hover:scale-105 font-semibold"
                  >
                    Chỉnh sửa Bài học
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg hover:scale-105 font-semibold flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setTitle(lesson.title);
                      setFile(null);
                      setFilePreview(lesson.lessonMetadata || '');
                    }}
                    className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg hover:scale-105 font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Đang lưu...' : 'Lưu Thay đổi'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-5 border border-blue-200 shadow-md hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-700 font-semibold">Môn học</p>
                  <p className="text-lg font-bold text-blue-900">{lesson.subject}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-5 border border-purple-200 shadow-md hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-600 rounded-xl shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-700 font-semibold">Giáo viên</p>
                  <p className="text-lg font-bold text-purple-900">{lesson.teacherId?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-5 border border-green-200 shadow-md hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-600 rounded-xl shadow-md">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-green-700 font-semibold">Ngày tạo</p>
                  <p className="text-sm font-bold text-green-900">
                    {new Date(lesson.createDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề Bài học
            </label>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                placeholder="Nhập tiêu đề bài học"
              />
            ) : (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-3 rounded-xl border border-gray-200">
                <p className="text-gray-900 font-medium">{lesson.title}</p>
              </div>
            )}
          </div>

          {/* File Upload/Display */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lesson File
            </label>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload new file or keep existing
                    </p>
                    {file && (
                      <p className="text-xs text-blue-600 font-semibold">
                        Selected: {file.name}
                      </p>
                    )}
                  </label>
                </div>

                {filePreview && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Current/Preview:</p>
                    {filePreview.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={filePreview}
                        alt="Lesson preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-700">
                        <FileText className="w-5 h-5" />
                        <a
                          href={filePreview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View file
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                {lesson.lessonMetadata ? (
                  lesson.lessonMetadata.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={lesson.lessonMetadata}
                      alt={lesson.title}
                      className="max-h-96 mx-auto rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <a
                        href={lesson.lessonMetadata}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Download/View Lesson File
                      </a>
                    </div>
                  )
                ) : (
                  <p className="text-gray-500 text-center">No file attached</p>
                )}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Class Code</p>
              <p className="text-sm font-semibold text-gray-900">{lesson.classId?.class_code || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Class Year</p>
              <p className="text-sm font-semibold text-gray-900">
                {lesson.classId?.class_year || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
