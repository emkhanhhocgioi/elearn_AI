'use client';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl border-4 border-white">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Luyện tập: {practiceData.subject}</h1>
                <p className="text-blue-100 text-sm mt-1 flex items-center gap-2">
                  {practiceData.difficulty && (
                    <>
                      <Target className="w-4 h-4" />
                      <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">
                        Độ khó: {practiceData.difficulty}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Exercise */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-md">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🎯 Câu hỏi
                  </h2>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200 shadow-inner">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                      {practiceData.exercise_question}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-md">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isVanSubject ? '✍️ Bài làm của bạn' : '✍️ Câu trả lời của bạn'}
                </h2>
              </div>
              
              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder={isVanSubject 
                  ? "Nhập bài làm của bạn vào đây...\n\nHãy trình bày rõ ràng, mạch lạc và có dẫn chứng cụ thể."
                  : "Nhập câu trả lời của bạn vào đây..."}
                className="w-full min-h-[300px] p-5 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 resize-none shadow-inner bg-gradient-to-br from-white to-purple-50 text-lg"
                disabled={isSubmitting}
              />

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                    <p className="text-sm font-semibold text-blue-700">
                      📝 {studentAnswer.length} ký tự
                    </p>
                  </div>
                  {studentAnswer.length > 0 && (
                    <div className="bg-green-50 px-4 py-2 rounded-full border border-green-200">
                      <p className="text-sm font-semibold text-green-700">
                        ✅ Sẵn sàng nộp
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !studentAnswer.trim()}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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
              <div className="bg-white rounded-2xl shadow-2xl border-4 border-green-200 p-8">
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">🤖 Đánh Giá Của AI</h2>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      Phân tích chi tiết bài làm của bạn
                    </p>
                  </div>
                </div>
                    
                {gradingResult.success && (gradingResult.result || gradingResult.grading_response) ? (
                  <div className="space-y-6">
                    {/* Overall Grade */}
                    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8 rounded-2xl border-4 border-green-300 shadow-lg">
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Điểm tổng thể</p>
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <p className="text-7xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            {gradingResult.grading_response?.score || gradingResult.result?.grade || 0}
                          </p>
                          <span className="text-4xl text-gray-400 font-bold">/10</span>
                        </div>
                        {(gradingResult.grading_response?.score || gradingResult.result?.grade || 0) >= 8 ? (
                          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 px-6 py-3 rounded-full shadow-md">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-base font-bold text-green-700">🎉 Xuất sắc!</span>
                          </div>
                        ) : (gradingResult.grading_response?.score || gradingResult.result?.grade || 0) >= 6.5 ? (
                          <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 px-6 py-3 rounded-full shadow-md">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-base font-bold text-blue-700">👍 Khá tốt!</span>
                          </div>
                        ) : (
                          <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 px-6 py-3 rounded-full shadow-md">
                            <TrendingDown className="w-5 h-5 text-yellow-600" />
                            <span className="text-base font-bold text-yellow-700">💪 Cần cố gắng thêm</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Correct/Incorrect Status for Non-Van Subjects */}
                    {gradingResult.grading_response?.isCorrect !== undefined && (
                      <div className={`${gradingResult.grading_response.isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'} p-6 rounded-2xl border-2 shadow-md`}>
                        <div className="flex items-start gap-4">
                          {gradingResult.grading_response.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-8 h-8 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h3 className="font-bold text-green-900 mb-2 text-lg">✅ Câu trả lời đúng!</h3>
                                <p className="text-sm text-green-700">Bài làm của bạn hoàn toàn chính xác.</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-8 h-8 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h3 className="font-bold text-red-900 mb-2 text-lg">❌ Câu trả lời chưa chính xác</h3>
                                <p className="text-sm text-red-700">Hãy xem lại nhận xét bên dưới để cải thiện.</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Comments */}
                    {(gradingResult.grading_response?.comments || gradingResult.result?.comments) && (
                      <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300 shadow-md">
                        <div className="flex items-start gap-4 mb-4">
                          <Lightbulb className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                          <h3 className="font-bold text-gray-900 text-lg">💡 Nhận xét chung</h3>
                        </div>
                        <p className="text-gray-800 leading-relaxed pl-10 text-base">
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
                    <div className="flex gap-4 pt-6">
                      <button
                        onClick={() => {
                          setStudentAnswer('');
                          setGradingResult(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                      >
                        <Send className="w-6 h-6" />
                        🔄 Làm lại bài mới
                      </button>
                      <button
                        onClick={() => router.back()}
                        className="flex-1 bg-gray-600 text-white py-4 rounded-xl font-bold hover:bg-gray-700 hover:shadow-xl transition-all duration-300 text-lg"
                      >
                        ← Quay về
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
            <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-200 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl shadow-md">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">💡 Gợi ý cải thiện</h3>
              </div>

              {practiceData.improve_suggestion ? (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border-2 border-yellow-200 shadow-inner">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {practiceData.improve_suggestion}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Chưa có gợi ý</p>
              )}

              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  {isVanSubject ? '📝 Lưu ý khi làm bài văn' : '📌 Lưu ý'}
                </h4>
                <ul className="space-y-3 text-sm text-gray-700">
                  {isVanSubject ? (
                    <>
                      <li className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Trình bày mạch lạc, có mở bài - thân bài - kết bài</span>
                      </li>
                      <li className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Dẫn chứng cụ thể từ văn bản</span>
                      </li>
                      <li className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
                        <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Sử dụng ngôn ngữ phù hợp, có biện pháp tu từ</span>
                      </li>
                      <li className="flex items-start gap-3 bg-pink-50 p-3 rounded-lg border border-pink-100">
                        <Sparkles className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Thể hiện quan điểm cá nhân</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Đọc kỹ đề bài</span>
                      </li>
                      <li className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Trình bày rõ ràng</span>
                      </li>
                      <li className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
                        <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Kiểm tra lại trước khi nộp</span>
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
