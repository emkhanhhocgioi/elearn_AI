'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter,useSearchParams } from 'next/navigation';
import { Clock, Calendar, Users, BookOpen, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { getTestQuestionsDetail,getTestGradingDetail,uploadTestAnswerFile,editTestAnswer,editTestAnswerFile } from '../../api/test';
import { useWebSocket } from '@/app/context/WebSocketContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface Test {
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
  isGraded?: boolean;
}

interface SubmitAnswer {
  questionID: string;
  answer: string;
}

const TestDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = params.id as string;

   const { isConnected, lastMessage, sendMessage } = useWebSocket();

  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<SubmitAnswer[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fileUploads, setFileUploads] = useState<{ [questionId: string]: File }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [originalAnswers, setOriginalAnswers] = useState<SubmitAnswer[]>([]); 


  useEffect(() => {
    const fetchTestDetail = async () => {
      try {
        setIsLoading(true);
        const response = await getTestQuestionsDetail(testId);
        setTest(response.test);
        setQuestions(response.questions);
        if (response.status === true) {
          setShowQuestions(true);
          setHasSubmitted(true);
          
          // Fetch submitted answers if already submitted
          try {
            const gradingResponse = await getTestGradingDetail(testId);
            if (gradingResponse && gradingResponse.answers) {
              const submittedAnswers = gradingResponse.answers.map((ans: any) => ({
                questionID: ans.questionID,
                answer: ans.answer
              }));
              setAnswers(submittedAnswers);
              setOriginalAnswers(submittedAnswers);
            }
          } catch (error) {
            console.error('Error fetching submitted answers:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching test detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (testId) {
      fetchTestDetail();
    }
  }, [testId]);

  const handleStartTest = () => {
    const token = localStorage.getItem('studentToken');
    sendMessage({
      type: 'start_test',
      testId,
      token: token ? token : '',
    });
  };

  // Listen for WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      console.log('Received message:', lastMessage);
      
      if (lastMessage.type === 'test_started' && lastMessage.testId === testId) {
        console.log('Test started successfully, showing questions');
        setShowQuestions(true);
      } else if (lastMessage.type === 'error') {
        console.error('Error:', lastMessage.message);
        alert('Lỗi: ' + lastMessage.message);
      }
      else if (lastMessage.type === 'answer_submitted' && lastMessage.testId === testId && lastMessage.isSubmitted === true) {
       
        router.push('/student');
      }
    }
  }, [lastMessage, testId, test]);

  const handleAnswerChange = (questionID: string, answer: string) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionID === questionID);
      if (existingIndex >= 0) {
        // Update existing answer
        const updated = [...prev];
        updated[existingIndex] = { questionID, answer };
        return updated;
      } else {
        // Add new answer
        return [...prev, { questionID, answer }];
      }
    });
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

  const handleSubmitTest = () => {
    // Check if all questions have answers
    const unansweredCount = questions.length - answers.length;
    
    if (unansweredCount > 0) {
      setShowConfirmDialog(true);
      return;
    }
    
    // Submit if all questions are answered
    submitAnswers();
  };

  const submitAnswers = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('studentToken');
      
      // Upload files first and get URLs
      const updatedAnswers = [...answers];
      
      for (const question of questions) {
        if (question.questionType === 'file_upload' && fileUploads[question._id]) {
          const formData = new FormData();
          formData.append('file', fileUploads[question._id]);
          formData.append('testId', testId);
          formData.append('questionId', question._id);
          
          try {
            const uploadResponse = await uploadTestAnswerFile(formData);
            if (uploadResponse && uploadResponse.filePath) {
              // Add or update answer with file URL
              const existingIndex = updatedAnswers.findIndex(a => a.questionID === question._id);
              if (existingIndex >= 0) {
                updatedAnswers[existingIndex].answer = uploadResponse.filePath;
              } else {
                updatedAnswers.push({
                  questionID: question._id,
                  answer: uploadResponse.filePath
                });
              }
            }
          } catch (error) {
            console.error('Error uploading file for question', question._id, error);
            alert(`Lỗi khi tải file cho câu hỏi ${questions.indexOf(question) + 1}`);
            setIsSubmitting(false);
            return;
          }
        }
      }
      
      // Submit all answers including file URLs
      sendMessage({
        type: 'submit_test',
        testId,
        answerData: updatedAnswers,
        token: token ? token : '',
      });
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Có lỗi xảy ra khi nộp bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveEditedAnswers = async () => {
    setIsSubmitting(true);
    try {
      // Find changed answers
      for (const answer of answers) {
        const original = originalAnswers.find(a => a.questionID === answer.questionID);
        if (!original || original.answer !== answer.answer) {
          const question = questions.find(q => q._id === answer.questionID);
          
          if (question?.questionType === 'file_upload' && fileUploads[answer.questionID]) {
            // Upload new file
            const formData = new FormData();
            formData.append('file', fileUploads[answer.questionID]);
            formData.append('testId', testId);
            formData.append('questionId', answer.questionID);
            
            try {
              await editTestAnswerFile(formData);
            } catch (error) {
              console.error('Error editing file answer:', error);
              alert('Lỗi khi cập nhật file');
              setIsSubmitting(false);
              return;
            }
          } else {
            // Update text answer
            try {
              await editTestAnswer(testId, answer.questionID, answer.answer);
            } catch (error) {
              console.error('Error editing answer:', error);
              alert('Lỗi khi cập nhật câu trả lời');
              setIsSubmitting(false);
              return;
            }
          }
        }
      }
      
      alert('Đã lưu các thay đổi thành công!');
      setIsEditMode(false);
      setOriginalAnswers([...answers]);
      setFileUploads({});
    } catch (error) {
      console.error('Error saving edited answers:', error);
      alert('Có lỗi xảy ra khi lưu thay đổi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Dễ</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Trung bình</span>;
      case 'hard':
        return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Khó</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài test</h2>
          <button
            onClick={() => router.push('/student')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const closeDate = new Date(test.closeDate);
  const now = new Date();
  const daysUntilClose = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilClose < 0;

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        </div>

        {!showQuestions ? (
          /* Test Information */
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Title Section */}
            <div className="mb-8 pb-6 border-b-2 border-blue-400">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 p-4 rounded-xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-blue-600 mb-2">
                    {test.testtitle}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                      <BookOpen className="w-4 h-4" />
                      {test.subject}
                    </span>
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                      test.status === 'ongoing' 
                        ? 'bg-green-100 text-green-700' 
                        : test.status === 'closed' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        test.status === 'ongoing' ? 'bg-green-600' : test.status === 'closed' ? 'bg-red-600' : 'bg-yellow-600'
                      }`}></div>
                      {test.status === 'ongoing' ? 'Đang diễn ra' : test.status === 'closed' ? 'Đã đóng' : 'Sắp tới'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-4 bg-blue-50 p-5 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="bg-blue-600 p-4 rounded-xl shadow-md">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Thời gian làm bài</p>
                  <p className="text-2xl font-bold text-blue-900">{test.test_time} <span className="text-lg">phút</span></p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-purple-50 p-5 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="bg-purple-600 p-4 rounded-xl shadow-md">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Số câu hỏi</p>
                  <p className="text-2xl font-bold text-purple-900">{questions.length} <span className="text-lg">câu</span></p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-green-50 p-5 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all duration-300">
                <div className={`${isOverdue ? 'bg-red-600' : 'bg-green-600'} p-4 rounded-xl shadow-md`}>
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Hạn nộp bài</p>
                  <p className={`text-2xl font-bold ${isOverdue ? 'text-red-600' : 'text-green-900'}`}>
                    {closeDate.toLocaleDateString('vi-VN')}
                  </p>
                  {!isOverdue && (
                    <p className="text-xs text-green-600 font-medium mt-1">⏱️ Còn {daysUntilClose} ngày</p>
                  )}
                  {isOverdue && (
                    <p className="text-xs text-red-600 font-medium mt-1">⚠️ Đã quá hạn</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 bg-orange-50 p-5 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all duration-300">
                <div className="bg-orange-600 p-4 rounded-xl shadow-md">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Học viên tham gia</p>
                  <p className="text-2xl font-bold text-orange-900">{test.participants} <span className="text-lg">học viên</span></p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Thông tin chi tiết
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                  <span className="text-gray-700 font-medium">Trạng thái:</span>
                  <span className={`font-semibold px-4 py-1.5 rounded-full ${
                    test.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'text-gray-600'
                  }`}>
                    {test.status === 'ongoing' ? '✓ Đang diễn ra' : test.status === 'closed' ? 'Đã đóng' : 'Sắp tới'}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                  <span className="text-gray-700 font-medium">Điểm trung bình:</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {test.avg_score !== "0" ? `${test.avg_score}%` : 'Chưa có dữ liệu'}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                  <span className="text-gray-700 font-medium">Ngày tạo:</span>
                  <span className="font-semibold text-gray-900">
                    📅 {new Date(test.createDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleStartTest}
                disabled={isOverdue && test.status !== 'ongoing'}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  isOverdue && test.status !== 'ongoing'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:shadow-2xl hover:bg-blue-700'
                }`}
              >
                {isOverdue && test.status !== 'ongoing' ? '⚠️ Bài test đã hết hạn' : '🚀 Bắt đầu làm bài'}
              </button>
            </div>
          </div>
        ) : (
          /* Test Questions */
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header with Progress */}
            <div className="mb-8 pb-6 border-b-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">
                    {test.testtitle}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full font-medium">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">{test.test_time} phút</span>
                    </span>
                    <span className="flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-full font-medium">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700">{questions.length} câu hỏi</span>
                    </span>
                    {hasSubmitted && !isOverdue && (
                      <span className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full text-green-700 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Đã nộp bài - Có thể chỉnh sửa
                      </span>
                    )}
                  </div>
                </div>
                {/* Progress Indicator */}
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Tiến độ</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${(answers.length / questions.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{answers.length}/{questions.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question._id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                          {index + 1}
                        </div>
                        {getDifficultyBadge(question.difficult)}
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-bold">
                          ⭐ {question.grade} điểm
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium text-lg leading-relaxed">{question.question}</p>
                    </div>
                  </div>
                  {question.metadata && question.metadata !== 'none' && (
                    <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                      <img
                        src={question.metadata}
                        alt={`Hình ảnh câu ${index + 1}`}
                        loading="lazy"
                        className="w-full max-w-full h-auto max-h-64 object-contain rounded-md p-2"
                      />
                    </div>
                  )}
                  {question.questionType === 'essay' ? (
                    <textarea
                      value={answers.find(a => a.questionID === question._id)?.answer || ''}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      placeholder="✍️ Nhập câu trả lời của bạn..."
                      className="w-full border-2 border-gray-300 rounded-xl p-4 min-h-[150px] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                      disabled={hasSubmitted && !isEditMode}
                    />
                  ) : question.questionType === 'file_upload' ? (
                    <div className="space-y-2">
                      {hasSubmitted && !isEditMode && answers.find(a => a.questionID === question._id)?.answer ? (
                        <div className="border-2 border-green-300 bg-green-50 rounded-xl p-4">
                          <p className="text-sm font-semibold text-green-700 mb-2">✅ File đã nộp:</p>
                          <a 
                            href={answers.find(a => a.questionID === question._id)?.answer} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 font-medium hover:underline flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Xem file đã nộp
                          </a>
                        </div>
                      ) : (
                        <label className="block">
                          <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all duration-300">
                            <input
                              type="file"
                              accept="image/*,.pdf,.doc,.docx,.txt"
                              onChange={(e) => handleFileChange(question._id, e.target.files?.[0] || null)}
                              className="hidden"
                              id={`file-${question._id}`}
                              disabled={hasSubmitted && !isEditMode}
                            />
                            <label htmlFor={`file-${question._id}`} className="cursor-pointer">
                              {fileUploads[question._id] ? (
                                <div className="text-green-600">
                                  <CheckCircle className="w-10 h-10 mx-auto mb-3" />
                                  <p className="font-bold text-lg">{fileUploads[question._id].name}</p>
                                  <p className="text-sm text-gray-600 mt-2">📎 Nhấn để chọn file khác</p>
                                </div>
                              ) : (
                                <div className="text-gray-500">
                                  <svg className="w-12 h-12 mx-auto mb-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <p className="font-bold text-lg text-gray-700">{hasSubmitted && isEditMode ? '📤 Tải file mới lên' : '📤 Tải file lên'}</p>
                                  <p className="text-sm mt-2 text-gray-500">Chọn ảnh, PDF hoặc tài liệu</p>
                                </div>
                              )}
                            </label>
                          </div>
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-xl hover:bg-purple-50 hover:border-purple-400 cursor-pointer transition-all duration-200"
                        >
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                            checked={answers.find(a => a.questionID === question._id)?.answer === option}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            className="w-5 h-5 text-purple-600"
                            disabled={hasSubmitted && !isEditMode}
                          />
                          <span className="text-gray-800 font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowQuestions(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                ← Quay lại
              </button>
              {hasSubmitted && !isOverdue ? (
                <>
                  {!isEditMode ? (
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-bold hover:shadow-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      ✏️ Chỉnh sửa đáp án
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsEditMode(false);
                          setAnswers([...originalAnswers]);
                          setFileUploads({});
                        }}
                        className="px-6 py-3 border-2 border-red-300 rounded-xl font-semibold text-red-700 hover:bg-red-50 transition-all duration-200"
                      >
                        ❌ Hủy
                      </button>
                      <button
                        onClick={saveEditedAnswers}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-6 bg-green-600 text-white rounded-xl font-bold hover:shadow-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                </>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 bg-green-600 text-white rounded-xl font-bold hover:shadow-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang nộp bài...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      📤 Nộp bài
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận nộp bài</DialogTitle>
              <DialogDescription>
                Có một số câu hỏi chưa có câu trả lời. Bạn có muốn nộp bài không?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={submitAnswers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Nộp bài
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TestDetailPage;
