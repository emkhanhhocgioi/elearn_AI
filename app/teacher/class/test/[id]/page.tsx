'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Settings, FileText } from 'lucide-react';
import { getTestDetailById, deleteQuestionFromTest } from '@/app/teacher/api/test';
import AddQuestionDialog from './components/AddQuestionDialog';
import BatchQuestionsDialog from './components/BatchQuestionsDialog';
import EditTestDialog from './components/EditTestDialog';


interface Question {
  _id: string;
  testid: string;
  question: string;
  questionType: string;
  subjectQuestionType: string;
  difficult: string;
  grade: number;
  solution: string;
  answer: string;
  metadata: string;
  options?: string[];
}

interface TestDetail {
  _id: string;
  testtitle: string;
  classID: {
    _id: string;
    class_code: string;
  };
  lessonID: {
    _id: string;
    title: string;
  };
  subject: string;
  teacherID: {
    _id: string;
    name: string;
  };
  participants: number;
  closeDate: string;
  status: string;
  avg_score: string;
  createDate: string;
}

function TestDetailContent() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') || '';



  const [testDetail, setTestDetail] = useState<TestDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [showEditTestDialog, setShowEditTestDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch test and questions on mount
  useEffect(() => {
    fetchTestData();
  }, [testId]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const testRes = await getTestDetailById(testId);
      
      if (testRes?.test) {
        setTestDetail(testRes.test);
      }
      if (testRes?.questions) {
        setQuestions(testRes.questions);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load test data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowAddDialog(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        setLoading(true);
        await deleteQuestionFromTest(questionId);
        setSuccess('Question deleted successfully!');
        setTimeout(() => {
          setSuccess('');
          fetchTestData();
        }, 1500);
      } catch (err) {
        setError('Failed to delete question');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !testDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/teacher/class/' + testDetail?.classID)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all hover:scale-105 font-semibold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại Danh sách Bài kiểm tra
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
                {testDetail?.testtitle || 'Bài kiểm tra'}
              </h1>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              
                <p className="text-gray-600">
                  <strong>Bài học:</strong> {testDetail?.testtitle || 0}
                </p>
                <p className="text-gray-600">
                  <strong>Giáo viên:</strong> {testDetail?.teacherID.name || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <strong>Ngày tạo:</strong> {testDetail?.createDate ? new Date(testDetail.createDate).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
                <p className="text-gray-600">
                  <strong>Ngày hết hạn:</strong> {testDetail?.closeDate ? new Date(testDetail.closeDate).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                testDetail?.status === 'ongoing'
                  ? 'bg-blue-100 text-blue-700'
                  : testDetail?.status === 'closed'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {testDetail?.status}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button
                onClick={() => router.push(`/teacher/class/test/${testId}/submition`)}
                className="bg-green-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-md hover:shadow-lg hover:scale-105 font-semibold"
              >
                <FileText className="w-4 h-4" />
                Xem Bài nộp
              </button>
              <button
                onClick={() => setShowEditTestDialog(true)}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:scale-105 font-semibold"
              >
                <Settings className="w-4 h-4" />
                Chỉnh sửa
              </button>
             
              <button
                onClick={() => setShowBatchDialog(true)}
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:scale-105 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Thêm nhiều Câu
              </button>
              <button
                onClick={() => {
                  setEditingQuestion(null);
                  setShowAddDialog(true);
                }}
                className="bg-purple-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-md hover:shadow-lg hover:scale-105 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Thêm 1 Câu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddQuestionDialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setEditingQuestion(null);
        }}
        testId={testId}
        editingQuestion={editingQuestion}
        onSuccess={fetchTestData}
        subject={subject}
      />

      <BatchQuestionsDialog
        isOpen={showBatchDialog}
        onClose={() => setShowBatchDialog(false)}
        testId={testId}
        onSuccess={fetchTestData}
        subject={subject}
        
      />

      <EditTestDialog
        isOpen={showEditTestDialog}
        onClose={() => setShowEditTestDialog(false)}
        testDetail={testDetail}
        onSuccess={fetchTestData}
      />

      {/* Questions List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200 bg-blue-50">
          <h2 className="text-xl font-bold text-gray-900">
            Câu hỏi ({questions.length})
          </h2>
        </div>

        {questions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {questions.map((question, index) => (
              <div key={question._id} className="p-6 hover:bg-blue-50 transition-all duration-200 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {question.question}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium shadow-sm">
                        Loại: {question.questionType}
                      </span>
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                        question.difficult === 'easy'
                          ? 'bg-green-100 text-green-700'
                          : question.difficult === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {question.difficult === 'easy' ? 'Dễ' : question.difficult === 'medium' ? 'Trung bình' : 'Khó'}
                      </span>
                      <span className="inline-block px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium shadow-sm">
                        Điểm: {question.grade}
                      </span>
                    </div>

                    {question.metadata && (
                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Topic:</strong> {question.metadata}
                      </p>
                    )}

                    <p className="text-sm text-gray-700 mt-3">
                      <strong>Solution:</strong> {question.solution}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition"
                      title="Edit question"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition"
                      title="Delete question"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-lg">No questions added yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Add Question" to create the first question
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <TestDetailContent />
    </Suspense>
  );
}
