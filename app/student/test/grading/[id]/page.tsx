'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTestGradingDetail, editTestAnswer, editTestAnswerFile } from '../../../api/test';
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAnswers, setEditedAnswers] = useState<{[key: string]: string}>({});
  const [fileUploads, setFileUploads] = useState<{ [questionId: string]: File }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGradingDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getTestGradingDetail(testId);
        setGradingData(data);
        // Initialize edited answers with current answers
        if (data?.answer?.answers) {
          const initialAnswers: {[key: string]: string} = {};
          data.answer.answers.forEach((ans: Answer) => {
            initialAnswers[ans.questionID] = ans.answer;
          });
          setEditedAnswers(initialAnswers);
        }
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

  const handleAnswerChange = (questionID: string, value: string) => {
    setEditedAnswers(prev => ({
      ...prev,
      [questionID]: value
    }));
  };

  const handleFileChange = (questionID: string, file: File | null) => {
    if (file) {
      setFileUploads(prev => ({
        ...prev,
        [questionID]: file
      }));
    } else {
      setFileUploads(prev => {
        const updated = { ...prev };
        delete updated[questionID];
        return updated;
      });
    }
  };

  const saveEditedAnswers = async () => {
    if (!gradingData) return;
    
    setIsSubmitting(true);
    try {
      const originalAnswers = gradingData.answer.answers;
      
      // Process all questions that have been modified
      const questionsToUpdate = new Set([
        ...Object.keys(editedAnswers),
        ...Object.keys(fileUploads)
      ]);
      
      for (const questionID of questionsToUpdate) {
        const originalAnswer = originalAnswers.find(a => a.questionID === questionID);
        const newAnswer = editedAnswers[questionID];
        const question = gradingData.questions.find(q => q._id === questionID);
        
        // Check if there's a file upload for this question
        if (fileUploads[questionID]) {
          // Upload new file
          const formData = new FormData();
          formData.append('file', fileUploads[questionID]);
          formData.append('testId', testId);
          formData.append('questionId', questionID);
          
          try {
            const response = await editTestAnswerFile(formData);
            console.log('File answer updated:', response);
          } catch (error) {
            console.error('Error editing file answer:', error);
            alert('Lỗi khi cập nhật file');
            setIsSubmitting(false);
            return;
          }
        } else if (originalAnswer && originalAnswer.answer !== newAnswer) {
          // Update text answer only if it has changed
          try {
            await editTestAnswer(testId, questionID, newAnswer);
          } catch (error) {
            console.error('Error editing answer:', error);
            alert('Lỗi khi cập nhật câu trả lời');
            setIsSubmitting(false);
            return;
          }
        }
      }
      
      alert('Đã lưu các thay đổi thành công!');
      setIsEditMode(false);
      setFileUploads({});
      
      // Refresh data
      const data = await getTestGradingDetail(testId);
      setGradingData(data);
      if (data?.answer?.answers) {
        const initialAnswers: {[key: string]: string} = {};
        data.answer.answers.forEach((ans: Answer) => {
          initialAnswers[ans.questionID] = ans.answer;
        });
        setEditedAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error saving edited answers:', error);
      alert('Có lỗi xảy ra khi lưu thay đổi');
    } finally {
      setIsSubmitting(false);
    }
  };

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
  
  // Check if can edit (before closeDate)
  const closeDate = new Date(test.closeDate);
  const now = new Date();
  const canEdit = now < closeDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{test.testtitle}</h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Kết quả bài kiểm tra
            </p>
          </div>
        </div>

        {/* Test Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Thông tin bài kiểm tra</h3>
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
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-8 mb-6 text-white border-4 border-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Kết quả của bạn</h2>
                  {canEdit && (
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mt-1 inline-block">
                      ⏰ Có thể chỉnh sửa đến {closeDate.toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-blue-100 text-sm mb-2 font-medium">Số câu đúng</p>
                  <p className="text-4xl font-bold">{correctAnswers}/{totalQuestions}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-blue-100 text-sm mb-2 font-medium">Tỷ lệ chính xác</p>
                  <p className="text-4xl font-bold">
                    {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-2xl ml-6">
              <p className="text-gray-600 text-sm mb-2 font-semibold">Điểm số</p>
              <p className={`text-6xl font-bold ${getScoreColor(finalGrade)}`}>
                {finalGrade.toFixed(1)}
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto my-3"></div>
              <p className="text-gray-500 text-xs font-medium">
                {answer.teacherGrade ? '👨‍🏫 Điểm giáo viên' : '🤖 Điểm AI'}
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Comments */}
        {answer.teacherComments && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400 p-3 rounded-xl shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                  👨‍🏫 Nhận xét của giáo viên
                </h3>
                <p className="text-gray-800 leading-relaxed bg-white p-4 rounded-xl border border-yellow-200">{answer.teacherComments}</p>
              </div>
            </div>
          </div>
        )}

        {/* Questions and Answers */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <CheckCircle className="w-7 h-7 text-blue-600" />
              Chi tiết câu trả lời
            </h3>
          </div>
          
          {questions.map((question, index) => {
            const studentAnswer = answer.answers.find(a => a.questionID === question._id);
            
            return (
              <div
                key={question._id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                  studentAnswer?.isCorrect 
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-white' 
                    : 'border-red-300 bg-gradient-to-br from-red-50 to-white'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md ${
                      studentAnswer?.isCorrect 
                        ? 'bg-gradient-to-br from-green-500 to-green-600' 
                        : 'bg-gradient-to-br from-red-500 to-red-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {getDifficultyBadge(question.difficult)}
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-bold">
                          ⭐ {question.grade} điểm
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium text-lg leading-relaxed">{question.question}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-md ${
                    studentAnswer?.isCorrect 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {studentAnswer?.isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Đúng
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        Sai
                      </>
                    )}
                  </div>
                </div>

                {/* Question Image */}
                {question.metadata && question.metadata !== 'none' && (
                  <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                    <img
                      src={question.metadata}
                      alt="Question illustration"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Student Answer */}
                <div className={`mt-4 p-5 rounded-xl border-2 ${
                  studentAnswer?.isCorrect 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-2 mb-3">
                    <span className={`text-sm font-bold ${
                      studentAnswer?.isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      📝 Câu trả lời của bạn:
                    </span>
                  </div>
                  
                  {isEditMode && canEdit ? (
                    <>
                      {question.questionType === 'essay' ? (
                        <textarea
                          value={editedAnswers[question._id] || ''}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          className="w-full border rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Nhập câu trả lời mới..."
                        />
                      ) : question.questionType === 'file_upload' ? (
                        <div className="space-y-2">
                          <p className="text-gray-700 mb-2">File hiện tại: 
                            <a 
                              href={editedAnswers[question._id]} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline ml-2"
                            >
                              Xem file
                            </a>
                          </p>
                          <label className="block">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer transition-colors">
                              <input
                                type="file"
                                accept="image/*,.pdf,.doc,.docx,.txt"
                                onChange={(e) => handleFileChange(question._id, e.target.files?.[0] || null)}
                                className="hidden"
                                id={`file-${question._id}`}
                              />
                              <label htmlFor={`file-${question._id}`} className="cursor-pointer">
                                {fileUploads[question._id] ? (
                                  <div className="text-green-600">
                                    <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                                    <p className="font-medium text-sm">{fileUploads[question._id].name}</p>
                                  </div>
                                ) : (
                                  <div className="text-gray-500">
                                    <p className="font-medium text-sm">Tải file mới lên</p>
                                    <p className="text-xs mt-1">Chọn ảnh, PDF hoặc tài liệu</p>
                                  </div>
                                )}
                              </label>
                            </div>
                          </label>
                        </div>
                      ) : question.questionType === 'multiple_choice' ? (
                        <div className="space-y-2">
                          {question.options.map((option: string, optIndex: number) => (
                            <label
                              key={optIndex}
                              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`edit-${question._id}`}
                                value={option}
                                checked={editedAnswers[question._id] === option}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-gray-800">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={editedAnswers[question._id] || ''}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="Nhập câu trả lời mới..."
                        />
                      )}
                    </>
                  ) : (
                    <p className="text-gray-700">{studentAnswer?.answer || 'Chưa trả lời'}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-center gap-4 pb-8">
          {canEdit && !isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-bold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              ✏️ Chỉnh sửa đáp án
            </button>
          )}
          
          {isEditMode && (
            <>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setFileUploads({});
                  // Reset edited answers to original
                  if (gradingData?.answer?.answers) {
                    const initialAnswers: {[key: string]: string} = {};
                    gradingData.answer.answers.forEach((ans: Answer) => {
                      initialAnswers[ans.questionID] = ans.answer;
                    });
                    setEditedAnswers(initialAnswers);
                  }
                }}
                className="px-8 py-4 border-2 border-red-300 rounded-xl font-bold text-red-700 hover:bg-red-50 transition-all duration-300"
              >
                ❌ Hủy
              </button>
              <button
                onClick={saveEditedAnswers}
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    💾 Lưu thay đổi
                  </>
                )}
              </button>
            </>
          )}
          
          <button
            onClick={() => router.push('/student')}
            className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold"
          >
            🏠 Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestGradingPage;
