'use client';
export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react';
import { usePractice } from '@/app/student/context/PracticeContext';
import { gradeEssay ,AI_auto_grade} from '@/app/student/api/personal';
import { 
  BookOpen, 
  Send, 
  Lightbulb, 
  Target, 
  ChevronLeft,
  Sparkles,
  Award,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const PracticePage = () => {
  const router = useRouter();
  const { practiceData } = usePractice();
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingResult, setGradingResult] = useState<any>(null);

  useEffect(() => {
    if (!practiceData) {
      // Nếu không có dữ liệu, quay về trang trước
      router.push('/student');
    }
  }, [practiceData, router]);

  const handleSubmit = async () => {
    if (!studentAnswer.trim()) {
      alert('Vui lòng nhập câu trả lời!');
      return;
    }

    if (!practiceData) return;

    setIsSubmitting(true);
    try {
      // Kiểm tra nếu là môn Văn thì dùng gradeEssay
      if (practiceData.subject.toLowerCase().includes('văn') || 
          practiceData.subject.toLowerCase() === 'ngữ văn') {
        const result = await gradeEssay(practiceData.exercise_question, studentAnswer);
        console.log('Grading Result:', result);
        setGradingResult(result);
      } else {
        console.log('Submitting answer for non-Van subject:', practiceData.exercise_question);
        const result = await AI_auto_grade(practiceData.exercise_question, studentAnswer, practiceData.subject);
        console.log('Auto Grade Result:', result);
        setGradingResult(result);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Có lỗi xảy ra khi chấm bài!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!practiceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const isVanSubject = practiceData.subject.toLowerCase().includes('văn') || 
                       practiceData.subject.toLowerCase() === 'ngữ văn';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại</span>
          </button>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-3 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Luyện tập: {practiceData.subject}</h1>
                <p className="text-blue-100 text-sm">
                  {practiceData.difficulty && `Độ khó: ${practiceData.difficulty}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Exercise */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Câu hỏi</h2>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {practiceData.exercise_question}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Send className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {isVanSubject ? 'Bài làm của bạn' : 'Câu trả lời của bạn'}
                </h2>
              </div>
              
              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder={isVanSubject 
                  ? "Nhập bài làm của bạn vào đây...\n\nHãy trình bày rõ ràng, mạch lạc và có dẫn chứng cụ thể."
                  : "Nhập câu trả lời của bạn vào đây..."}
                className="w-full min-h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isSubmitting}
              />

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {studentAnswer.length} ký tự
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !studentAnswer.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang chấm bài...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Nộp bài
                    </>
                  )}
                </button>
              </div>
            </div>
             
            {/* Grading Result */}
            {gradingResult && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">Đánh Giá Của AI</h2>
                    <p className="text-sm text-gray-500">Phân tích chi tiết bài làm của bạn</p>
                  </div>
                </div>
                    
                {gradingResult.success && (gradingResult.result || gradingResult.grading_response) ? (
                  <div className="space-y-6">
                    {/* Overall Grade */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Điểm tổng thể</p>
                        <div className="flex items-center justify-center gap-3">
                          <p className="text-6xl font-bold text-green-600">
                            {gradingResult.grading_response?.score || gradingResult.result?.grade || 0}
                          </p>
                          <span className="text-3xl text-gray-400">/10</span>
                        </div>
                        {(gradingResult.grading_response?.score || gradingResult.result?.grade || 0) >= 8 ? (
                          <div className="mt-3 inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">Xuất sắc!</span>
                          </div>
                        ) : (gradingResult.grading_response?.score || gradingResult.result?.grade || 0) >= 6.5 ? (
                          <div className="mt-3 inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700">Khá tốt!</span>
                          </div>
                        ) : (
                          <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                            <TrendingDown className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-700">Cần cố gắng thêm</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Correct/Incorrect Status for Non-Van Subjects */}
                    {gradingResult.grading_response?.isCorrect !== undefined && (
                      <div className={`${gradingResult.grading_response.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} p-5 rounded-xl border`}>
                        <div className="flex items-start gap-3">
                          {gradingResult.grading_response.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h3 className="font-bold text-green-900 mb-1">Câu trả lời đúng!</h3>
                                <p className="text-sm text-green-700">Bài làm của bạn hoàn toàn chính xác.</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h3 className="font-bold text-red-900 mb-1">Câu trả lời chưa chính xác</h3>
                                <p className="text-sm text-red-700">Hãy xem lại nhận xét bên dưới để cải thiện.</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Comments */}
                    {(gradingResult.grading_response?.comments || gradingResult.result?.comments) && (
                      <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                        <div className="flex items-start gap-3 mb-3">
                          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <h3 className="font-bold text-gray-900">Nhận xét chung</h3>
                        </div>
                        <p className="text-gray-800 leading-relaxed pl-8">
                          {gradingResult.grading_response?.comments || gradingResult.result?.comments}
                        </p>
                      </div>
                    )}

                    {/* Criteria Scores - Only for Van subjects */}
                    {gradingResult.result?.criteria_scores && (
                      <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                        <div className="flex items-start gap-3 mb-4">
                          <BarChart3 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <h3 className="font-bold text-gray-900">Điểm theo tiêu chí</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                          {Object.entries(gradingResult.result.criteria_scores).map(([criteria, score]: [string, any]) => (
                            <div key={criteria} className="bg-white p-4 rounded-lg border border-purple-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{criteria}</span>
                                <span className="text-lg font-bold text-purple-600">{score}/10</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(score / 10) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths - Only for Van subjects */}
                    {gradingResult.result?.strengths && gradingResult.result.strengths.length > 0 && (
                      <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                        <div className="flex items-start gap-3 mb-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <h3 className="font-bold text-gray-900">Điểm mạnh</h3>
                        </div>
                        <ul className="space-y-2 pl-8">
                          {gradingResult.result.strengths.map((strength: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-gray-800">
                              <span className="text-green-600 font-bold mt-1">✓</span>
                              <span className="flex-1">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses - Only for Van subjects */}
                    {gradingResult.result?.weaknesses && gradingResult.result.weaknesses.length > 0 && (
                      <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                        <div className="flex items-start gap-3 mb-3">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <h3 className="font-bold text-gray-900">Điểm cần cải thiện</h3>
                        </div>
                        <ul className="space-y-2 pl-8">
                          {gradingResult.result.weaknesses.map((weakness: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-gray-800">
                              <span className="text-yellow-600 font-bold mt-1">!</span>
                              <span className="flex-1">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          setStudentAnswer('');
                          setGradingResult(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Làm lại bài mới
                      </button>
                      <button
                        onClick={() => router.back()}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                      >
                        Quay về
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-red-900 mb-1">Có lỗi xảy ra</p>
                        <p className="text-sm text-red-700">
                          {gradingResult.message || 'Không thể chấm bài lúc này. Vui lòng thử lại sau.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Suggestions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-gray-900">Gợi ý cải thiện</h3>
              </div>

              {practiceData.improve_suggestion ? (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {practiceData.improve_suggestion}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Chưa có gợi ý</p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                  {isVanSubject ? 'Lưu ý khi làm bài văn' : 'Lưu ý'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {isVanSubject ? (
                    <>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Trình bày mạch lạc, có mở bài - thân bài - kết bài</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Dẫn chứng cụ thể từ văn bản</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Sử dụng ngôn ngữ phù hợp, có biện pháp tu từ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Thể hiện quan điểm cá nhân</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Đọc kỹ đề bài</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Trình bày rõ ràng</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Kiểm tra lại trước khi nộp</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
