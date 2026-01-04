'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Calendar, Clock, CheckCircle, XCircle, X, Sparkles, Plus, Trash2, Award, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import { getSubmittedAnswers, TeacherGradingAsnwer, Teacher_AI_grading_Base_on_rubic } from '@/app/teacher/api/test';

interface Question {
  questionID: {
    _id: string;
    question: string;
    questionType: string;
  };
  
  answer: string;
  isCorrect: boolean;
  _id: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  classid: string;
  DOB: string;
  parentContact: string;
  academic_performance: string;
  conduct: string;
  averageScore: number;
}

interface Test {
  _id: string;
  testtitle: string;
  subject: string;
  avg_score: string;
  participants: number;
  closeDate: string;
  status: string;
  createDate: string;
  test_time: number;
  classID: string;
  teacherID: string;
}

interface SubmittedAnswer {
  _id: string;
  testID: Test;
  studentID: Student;
  answers: Question[];
  teacherComments: string;
  submissionTime: string;
  createdAt: string;
  updatedAt: string;
  submit: boolean;
  teacherGrade: number;
  isgraded: boolean;
}

interface RubricCriteria {
  name: string;
  weight: number;
  description?: string;
}

interface RubricScore {
  criteria_name: string;
  weight: number;
  score: number;
  weighted_score: number;
  comment: string;
}

interface QuestionScore {
  question_number: number;
  max_score: number;
  student_score: number;
  is_correct: boolean;
  feedback: string;
}

interface AIGradingResult {
  success: boolean;
  grading_result?: {
    rubric_scores: RubricScore[];
    question_scores: QuestionScore[];
    total_score: number;
    overall_comment: string;
    strengths: string[];
    weaknesses: string[];
    improvement_suggestions: string;
  };
  test_title?: string;
  subject?: string;
  student_name?: string;
  error?: string;
}

export default function SubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [submissions, setSubmissions] = useState<SubmittedAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmittedAnswer | null>(null);
  const [teacherComments, setTeacherComments] = useState('');
  const [isSavingComments, setIsSavingComments] = useState(false);
  const [teacherGrade, setTeacherGrade] = useState<number>(0);
  const [editedAnswers, setEditedAnswers] = useState<Question[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'graded' | 'ungraded'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Rubric states
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriteria[]>([
    { name: "Đọc hiểu văn bản", weight: 30 },
    { name: "Viết (cấu trúc, lập luận)", weight: 40 },
    { name: "Diễn đạt & dùng từ", weight: 20 },
    { name: "Chính tả, ngữ pháp", weight: 10 }
  ]);
  const [aiGradingResult, setAiGradingResult] = useState<AIGradingResult | null>(null);
  const [isAiGrading, setIsAiGrading] = useState(false);

  // Helper function to check if URL is an image
  const isImageUrl = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('/image/upload/');
  };

  useEffect(() => {
    fetchSubmissions();
  }, [testId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getSubmittedAnswers(testId);
      if (response?.submittedAnswers) {
        setSubmissions(response.submittedAnswers);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (answers: Question[]) => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;
    return totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : '0';
  };

  const calculateAverageGrade = () => {
    if (submissions.length === 0) return '0';
    const total = submissions.reduce((sum, sub) => {
      return sum + (sub.teacherGrade || parseFloat(calculateScore(sub.answers)));
    }, 0);
    return (total / submissions.length).toFixed(1);
  };

  const getGradedCount = () => {
    return submissions.filter(sub => sub.isgraded).length;
  };

  const getSortedSubmissions = () => {
    let filtered = [...submissions];
    if (filterStatus === 'graded') {
      filtered = filtered.filter(sub => sub.isgraded);
    } else if (filterStatus === 'ungraded') {
      filtered = filtered.filter(sub => !sub.isgraded);
    }
    
    const sorted = filtered.sort((a, b) => {
      const timeA = new Date(a.submissionTime).getTime();
      const timeB = new Date(b.submissionTime).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
    
    return sorted;
  };

  const getPaginatedSubmissions = () => {
    const sorted = getSortedSubmissions();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sorted.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getSortedSubmissions().length / itemsPerPage);

  const handleAnswerCorrectChange = (answerId: string, isCorrect: boolean) => {
    setEditedAnswers(prev => 
      prev.map(answer => 
        answer._id === answerId 
          ? { ...answer, isCorrect } 
          : answer
      )
    );
  };

  // Rubric handlers
  const addRubricCriteria = () => {
    setRubricCriteria(prev => [...prev, { name: "", weight: 0 }]);
  };

  const removeRubricCriteria = (index: number) => {
    setRubricCriteria(prev => prev.filter((_, i) => i !== index));
  };

  const updateRubricCriteria = (index: number, field: keyof RubricCriteria, value: string | number) => {
    setRubricCriteria(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const getTotalWeight = () => {
    return rubricCriteria.reduce((sum, item) => sum + item.weight, 0);
  };

  // AI Grading with Rubric
  const handleAIGradeWithRubric = async () => {
    if (!selectedSubmission) return;
    
    const totalWeight = getTotalWeight();
    if (totalWeight !== 100) {
      alert(`Tổng trọng số phải bằng 100%. Hiện tại: ${totalWeight}%`);
      return;
    }

    try {
      setIsAiGrading(true);
      setAiGradingResult(null);
      
      const result = await Teacher_AI_grading_Base_on_rubic(
        selectedSubmission._id,
        rubricCriteria,
        selectedSubmission.testID.subject
      );
      
      console.log('AI Grading Result:', result);
      setAiGradingResult(result);
      
      // Auto-fill teacher grade if successful
      if (result?.success && result?.grading_result?.total_score) {
        setTeacherGrade(result.grading_result.total_score);
      }
      
    } catch (error) {
      console.error('Error in AI grading:', error);
      setAiGradingResult({ success: false, error: 'Lỗi khi chấm điểm AI. Vui lòng thử lại.' });
    } finally {
      setIsAiGrading(false);
    }
  };

  const handleSaveComments = async () => {
    if (!selectedSubmission) return;

    try {
      setIsSavingComments(true);
      
      const answerData = editedAnswers.map(answer => ({
        questionID: answer.questionID._id,
        answer: answer.answer,
        isCorrect: answer.isCorrect
      }));

      await TeacherGradingAsnwer(
        selectedSubmission._id,
        teacherGrade,
        teacherComments,
        answerData
      );
      
      setSubmissions(prev => 
        prev.map(sub => 
          sub._id === selectedSubmission._id 
            ? { ...sub, teacherComments, answers: editedAnswers, teacherGrade, isgraded: true } 
            : sub
        )
      );
      
      setSelectedSubmission({
        ...selectedSubmission,
        teacherComments,
        answers: editedAnswers,
        teacherGrade,
        isgraded: true
      });
      
      alert('Lưu chấm điểm thành công!');
    } catch (err) {
      console.error('Error saving grading:', err);
      alert('Lỗi khi lưu chấm điểm');
    } finally {
      setIsSavingComments(false);
    }
  };

  if (loading) {
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
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all hover:scale-105 font-semibold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại Bài kiểm tra
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-md">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {submissions[0]?.testID?.testtitle || 'Bài nộp Kiểm tra'}
              </h1>
              {submissions[0]?.testID && (
                <p className="text-gray-600 mt-1">
                  Môn: {submissions[0].testID.subject} • Thời gian: {submissions[0].testID.test_time} phút
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <p className="text-sm text-blue-700 font-semibold">Bài nộp</p>
              <p className="text-3xl font-bold text-blue-700">{submissions.length}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <p className="text-sm text-green-700 font-semibold">Đã chấm điểm</p>
              <p className="text-3xl font-bold text-green-700">{getGradedCount()}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <p className="text-sm text-purple-700 font-semibold">Điểm TB</p>
              <p className="text-3xl font-bold text-purple-700">{calculateAverageGrade()}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 shadow-sm">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Submissions List */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Bài nộp của Học sinh ({getSortedSubmissions().length}/{submissions.length})
            </h2>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Lọc:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as 'all' | 'graded' | 'ungraded');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 rounded-lg font-medium border-2 border-gray-300 bg-white text-gray-700 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="all">Tất cả</option>
                  <option value="graded">Đã chấm</option>
                  <option value="ungraded">Chưa chấm</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Ngày nộp:</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSortOrder('desc')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      sortOrder === 'desc'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-300'
                    }`}
                  >
                    Mới nhất
                  </button>
                  <button
                    onClick={() => setSortOrder('asc')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      sortOrder === 'asc'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-300'
                    }`}
                  >
                    Cũ nhất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {submissions.length > 0 ? (
          <>
            <div className="divide-y divide-gray-200">
              {getPaginatedSubmissions().map((submission) => {
                const score = submission.teacherGrade || parseFloat(calculateScore(submission.answers));
                const correctCount = submission.answers.filter(a => a.isCorrect).length;
                const totalCount = submission.answers.length;

                return (
                  <div
                    key={submission._id}
                    className="p-6 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setTeacherComments(submission.teacherComments || '');
                      setEditedAnswers(submission.answers);
                      setTeacherGrade(score);
                      setAiGradingResult(null);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {submission.studentID.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{submission.studentID.name}</h3>
                          <p className="text-sm text-gray-600">{submission.studentID.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(submission.submissionTime).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Clock className="w-4 h-4" />
                            {new Date(submission.submissionTime).toLocaleTimeString('vi-VN')}
                          </div>
                        </div>

                        <div className="text-center bg-blue-100 rounded-xl px-6 py-3 shadow-sm group-hover:scale-110 transition-transform">
                          <p className="text-3xl font-bold text-blue-600">{score.toFixed(1)}</p>
                          <p className="text-xs text-gray-600 mt-1">{correctCount}/{totalCount} đúng</p>
                        </div>

                        {submission.isgraded && (
                          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                            <CheckCircle className="w-4 h-4" />
                            Đã chấm điểm
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Trang {currentPage} / {totalPages} ({getSortedSubmissions().length} bài nộp)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Trước
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có bài nộp</p>
            <p className="text-gray-400 text-sm mt-2">Học sinh chưa nộp bài cho bài kiểm tra này</p>
          </div>
        )}
      </div>

      {/* Submission Detail Modal - Full Width Two Column Layout */}
      {selectedSubmission && (  
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[95vw] h-[95vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {selectedSubmission.studentID.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Bài nộp của {selectedSubmission.studentID.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Nộp lúc {new Date(selectedSubmission.submissionTime).toLocaleString('vi-VN')} • {selectedSubmission.testID.testtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setAiGradingResult(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Two Column Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column - Submission Data */}
              <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-6">
                {/* Student Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold">Học lực</p>
                    <p className="text-sm font-bold text-gray-900">{selectedSubmission.studentID.academic_performance}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold">Hạnh kiểm</p>
                    <p className="text-sm font-bold text-gray-900">{selectedSubmission.studentID.conduct}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold">Điểm TB</p>
                    <p className="text-sm font-bold text-gray-900">{selectedSubmission.studentID.averageScore}</p>
                  </div>
                  <div className="bg-blue-100 rounded-xl p-3 border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold">Điểm kiểm tra</p>
                    <p className="text-sm font-bold text-blue-700">{teacherGrade.toFixed(1)}</p>
                  </div>
                </div>

                {/* Answers List */}
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Câu trả lời ({selectedSubmission.answers.length})
                </h3>
                <div className="space-y-4">
                  {editedAnswers.map((answer, index) => (
                    <div
                      key={answer._id}
                      className={`p-4 rounded-lg border-2 ${
                        answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Câu {index + 1}</span>
                          {answer.isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <select
                          value={answer.isCorrect ? 'correct' : 'incorrect'}
                          onChange={(e) => handleAnswerCorrectChange(answer._id, e.target.value === 'correct')}
                          className={`px-3 py-1 rounded-lg border-2 font-medium text-sm ${
                            answer.isCorrect
                              ? 'bg-green-50 border-green-300 text-green-700'
                              : 'bg-red-50 border-red-300 text-red-700'
                          }`}
                        >
                          <option value="correct">Đúng</option>
                          <option value="incorrect">Sai</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Câu hỏi:</p>
                          <p className="text-gray-900 bg-white p-2 rounded border border-gray-200 text-sm">
                            {answer.questionID?.question || 'Không có câu hỏi'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Câu trả lời:</p>
                          {answer.questionID?.questionType === 'file_upload' ? (
                            isImageUrl(answer.answer) ? (
                              <div className="bg-white p-2 rounded border border-gray-200">
                                <img src={answer.answer} alt="Bài làm" className="max-w-full h-auto rounded max-h-40" />
                                <a href={answer.answer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline text-sm mt-1 block">
                                  Mở tab mới
                                </a>
                              </div>
                            ) : (
                              <a href={answer.answer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline bg-white p-2 rounded border border-gray-200 block text-sm">
                                Xem file đã tải lên
                              </a>
                            )
                          ) : (
                            <p className="text-gray-900 bg-white p-2 rounded border border-gray-200 text-sm">{answer.answer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Teacher Grade & Comments */}
                <div className="mt-6 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Điểm (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={teacherGrade}
                      onChange={(e) => setTeacherGrade(parseFloat(e.target.value) || 0)}
                      className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nhận xét của giáo viên</label>
                    <textarea
                      value={teacherComments}
                      onChange={(e) => setTeacherComments(e.target.value)}
                      placeholder="Nhập nhận xét..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleSaveComments}
                    disabled={isSavingComments}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                  >
                    {isSavingComments ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu chấm điểm'
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column - AI Grading */}
              <div className="w-1/2 overflow-y-auto p-6 bg-gray-50">
                {/* Rubric Input */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      Tiêu chí chấm điểm (Rubric)
                    </h3>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${getTotalWeight() === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      Tổng: {getTotalWeight()}%
                    </span>
                  </div>

                  <div className="space-y-3">
                    {rubricCriteria.map((criteria, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          value={criteria.name}
                          onChange={(e) => updateRubricCriteria(index, 'name', e.target.value)}
                          placeholder="Tên tiêu chí"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={criteria.weight}
                            onChange={(e) => updateRubricCriteria(index, 'weight', parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                            className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                        <button
                          onClick={() => removeRubricCriteria(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addRubricCriteria}
                    className="mt-3 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm tiêu chí
                  </button>

                  <button
                    onClick={handleAIGradeWithRubric}
                    disabled={isAiGrading || getTotalWeight() !== 100}
                    className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isAiGrading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        AI đang chấm điểm...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Chấm điểm với AI
                      </>
                    )}
                  </button>
                </div>

                {/* AI Grading Results */}
                {aiGradingResult && (
                  <div className="space-y-4">
                    {aiGradingResult.success && aiGradingResult.grading_result ? (
                      <>
                        {/* Total Score */}
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-purple-100 text-sm font-medium">Tổng điểm AI</p>
                              <p className="text-5xl font-bold">{aiGradingResult.grading_result.total_score.toFixed(1)}</p>
                              <p className="text-purple-100 text-sm">/ 10 điểm</p>
                            </div>
                            <Award className="w-16 h-16 text-white/30" />
                          </div>
                        </div>

                        {/* Rubric Scores */}
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Award className="w-4 h-4 text-purple-600" />
                            Điểm theo tiêu chí
                          </h4>
                          <div className="space-y-3">
                            {aiGradingResult.grading_result.rubric_scores?.map((score, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-700">{score.criteria_name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">({score.weight}%)</span>
                                    <span className="font-bold text-purple-600">{score.score}/10</span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${score.score * 10}%` }}></div>
                                </div>
                                <p className="text-sm text-gray-600">{score.comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Điểm mạnh
                            </h4>
                            <ul className="space-y-1">
                              {aiGradingResult.grading_result.strengths?.map((item, i) => (
                                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                            <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                              <TrendingDown className="w-4 h-4" />
                              Điểm yếu
                            </h4>
                            <ul className="space-y-1">
                              {aiGradingResult.grading_result.weaknesses?.map((item, i) => (
                                <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Overall Comment */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Nhận xét tổng thể
                          </h4>
                          <p className="text-sm text-blue-700">{aiGradingResult.grading_result.overall_comment}</p>
                        </div>

                        {/* Improvement Suggestions */}
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                          <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Gợi ý cải thiện
                          </h4>
                          <p className="text-sm text-yellow-700">{aiGradingResult.grading_result.improvement_suggestions}</p>
                        </div>

                        {/* Question Scores */}
                        {aiGradingResult.grading_result.question_scores && aiGradingResult.grading_result.question_scores.length > 0 && (
                          <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3">Điểm từng câu</h4>
                            <div className="space-y-2">
                              {aiGradingResult.grading_result.question_scores.map((qs, i) => (
                                <div key={i} className={`p-3 rounded-lg ${qs.is_correct ? 'bg-green-50' : 'bg-red-50'}`}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">Câu {qs.question_number}</span>
                                    <span className={`font-bold ${qs.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                                      {qs.student_score}/{qs.max_score}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{qs.feedback}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <p className="text-red-700 font-medium">Lỗi: {aiGradingResult.error || 'Không thể chấm điểm'}</p>
                      </div>
                    )}
                  </div>
                )}

                {!aiGradingResult && !isAiGrading && (
                  <div className="bg-gray-100 rounded-xl p-8 text-center">
                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Nhấn "Chấm điểm với AI" để xem kết quả phân tích</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
