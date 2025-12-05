'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTestGradingDetail } from '../../../api/test';
import { ArrowLeft, CheckCircle, XCircle, Clock, Award, FileText, Calendar, User } from 'lucide-react';

interface Question {
  _id: string;
  testid: string;
  difficult: string;
  question: string;
  questionType: string;
  grade: number;
  metadata: string;
  options: any[];
}

interface Answer {
  questionID: string;
  answer: string;
  isCorrect: boolean;
  _id: string;
}

interface AnswerData {
  AIGrade: number;
  _id: string;
  testID: string;
  studentID: string;
  answers: Answer[];
  teacherComments?: string;
  submissionTime: string;
  createdAt: string;
  updatedAt: string;
  submit: boolean;
  teacherGrade?: number;
}

interface TestData {
  _id: string;
  classID: string;
  teacherID: string;
  testtitle: string;
  subject: string;
  avg_score: string;
  participants: number;
  closeDate: string;
  status: string;
  createDate: string;
  test_time: number;
}

interface GradingDetail {
  test: TestData;
  questions: Question[];
  answer: AnswerData;
}

const TestGradingPage = () => {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  
  const [gradingData, setGradingData] = useState<GradingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGradingDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getTestGradingDetail(testId);
        setGradingData(data);
      } catch (err) {
        console.error('Error fetching grading detail:', err);
        setError('Không thể tải kết quả bài kiểm tra');
      } finally {
        setIsLoading(false);
      }
    };

    if (testId) {
      fetchGradingDetail();
    }
  }, [testId]);

  const getDifficultyBadge = (difficult: string) => {
    const styles = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-red-100 text-red-700'
    };
    const labels = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[difficult as keyof typeof styles] || styles.medium}`}>
        {labels[difficult as keyof typeof labels] || difficult}
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (error || !gradingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-800 mb-2">{error || 'Không tìm thấy kết quả'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const { test, questions, answer } = gradingData;
  const totalQuestions = questions.length;
  const correctAnswers = answer.answers.filter(a => a.isCorrect).length;
  const finalGrade = answer.teacherGrade || answer.AIGrade || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{test.testtitle}</h1>
          <p className="text-gray-600 mt-1">Kết quả bài kiểm tra</p>
        </div>

        {/* Test Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Môn học</p>
                <p className="font-semibold text-gray-900">{test.subject}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Thời gian làm bài</p>
                <p className="font-semibold text-gray-900">{test.test_time} phút</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Ngày nộp</p>
                <p className="font-semibold text-gray-900">
                  {new Date(answer.submissionTime).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="font-semibold text-green-600">Đã nộp bài</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Kết quả của bạn</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Số câu đúng</p>
                  <p className="text-3xl font-bold">{correctAnswers}/{totalQuestions}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Tỷ lệ chính xác</p>
                  <p className="text-3xl font-bold">
                    {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-lg">
              <p className="text-gray-600 text-sm mb-2">Điểm số</p>
              <p className={`text-5xl font-bold ${getScoreColor(finalGrade)}`}>
                {finalGrade.toFixed(1)}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {answer.teacherGrade ? 'Điểm giáo viên' : 'Điểm AI'}
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Comments */}
        {answer.teacherComments && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Nhận xét của giáo viên</h3>
                <p className="text-gray-700">{answer.teacherComments}</p>
              </div>
            </div>
          </div>
        )}

        {/* Questions and Answers */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Chi tiết câu trả lời</h3>
          
          {questions.map((question, index) => {
            const studentAnswer = answer.answers.find(a => a.questionID === question._id);
            
            return (
              <div
                key={question._id}
                className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
                  studentAnswer?.isCorrect ? 'border-green-200' : 'border-red-200'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                      studentAnswer?.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getDifficultyBadge(question.difficult)}
                        <span className="text-xs text-gray-500">
                          {question.grade} điểm
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">{question.question}</p>
                    </div>
                  </div>
                  {studentAnswer?.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                </div>

                {/* Question Image */}
                {question.metadata && question.metadata !== 'none' && (
                  <div className="mb-4">
                    <img
                      src={question.metadata}
                      alt="Question illustration"
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {/* Student Answer */}
                <div className={`mt-4 p-4 rounded-lg ${
                  studentAnswer?.isCorrect ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`text-sm font-semibold ${
                      studentAnswer?.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      Câu trả lời của bạn:
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      studentAnswer?.isCorrect 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {studentAnswer?.isCorrect ? 'Đúng' : 'Sai'}
                    </span>
                  </div>
                  <p className="text-gray-700">{studentAnswer?.answer || 'Chưa trả lời'}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/student')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestGradingPage;
