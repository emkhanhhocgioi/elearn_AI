'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter,useSearchParams } from 'next/navigation';
import { Clock, Calendar, Users, BookOpen, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { getTestQuestionsDetail,getTestGradingDetail } from '../../api/test';
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


  useEffect(() => {
    const fetchTestDetail = async () => {
      try {
        setIsLoading(true);
        const response = await getTestQuestionsDetail(testId);
        setTest(response.test);
        setQuestions(response.questions);
        if (response.status === true) {
          setShowQuestions(true);
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
      token
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
  }, [lastMessage, testId]);

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

  const submitAnswers = () => {
    sendMessage({
      type: 'submit_test',
      testId,
      answerData: answers,
      token: localStorage.getItem('studentToken')
    });
    setShowConfirmDialog(false);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/student')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        </div>

        {!showQuestions ? (
          /* Test Information */
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.testtitle}</h1>
              <p className="text-lg text-gray-600">{test.subject}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời gian làm bài</p>
                  <p className="text-lg font-semibold text-gray-900">{test.test_time} phút</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số câu hỏi</p>
                  <p className="text-lg font-semibold text-gray-900">{questions.length} câu</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`${isOverdue ? 'bg-red-100' : 'bg-green-100'} p-3 rounded-lg`}>
                  <Calendar className={`w-6 h-6 ${isOverdue ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hạn nộp bài</p>
                  <p className={`text-lg font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {closeDate.toLocaleDateString('vi-VN')}
                  </p>
                  {!isOverdue && (
                    <p className="text-xs text-gray-500">Còn {daysUntilClose} ngày</p>
                  )}
                  {isOverdue && (
                    <p className="text-xs text-red-600">Đã quá hạn</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Học viên tham gia</p>
                  <p className="text-lg font-semibold text-gray-900">{test.participants} học viên</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chi tiết</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-medium ${test.status === 'ongoing' ? 'text-green-600' : 'text-gray-600'}`}>
                    {test.status === 'ongoing' ? 'Đang diễn ra' : test.status === 'closed' ? 'Đã đóng' : 'Sắp tới'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Điểm trung bình:</span>
                  <span className="font-medium text-gray-900">
                    {test.avg_score !== "0" ? `${test.avg_score}%` : 'Chưa có dữ liệu'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(test.createDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleStartTest}
                disabled={isOverdue && test.status !== 'ongoing'}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  isOverdue && test.status !== 'ongoing'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isOverdue && test.status !== 'ongoing' ? 'Bài test đã hết hạn' : 'Bắt đầu làm bài'}
              </button>
            </div>
          </div>
        ) : (
          /* Test Questions */
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{test.testtitle}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {test.test_time} phút
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {questions.length} câu hỏi
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question._id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">Câu {index + 1}:</span>
                        {getDifficultyBadge(question.difficult)}
                        <span className="text-xs text-gray-500">({question.grade} điểm)</span>
                      </div>
                      <p className="text-gray-800">{question.question}</p>
                    </div>
                  </div>
                  <div> 
                    <img
                      src={question.metadata}
                      alt={`Hình ảnh câu ${index + 1}`}
                      loading="lazy"
                      className="w-full max-w-full h-auto max-h-64 object-contain rounded-md mb-4 mx-auto"
                    />
                    </div>
                  {question.questionType === 'essay' ? (
                    <textarea
                      value={answers.find(a => a.questionID === question._id)?.answer || ''}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      placeholder="Nhập câu trả lời của bạn..."
                      className="w-full border rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                            checked={answers.find(a => a.questionID === question._id)?.answer === option}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-800">{option}</span>
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
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Nộp bài
              </button>
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
