'use client';
import React, { useState, useEffect } from "react";
import { Brain, BookOpen, AlertCircle, CheckCircle, Clock, Target, Loader2 } from "lucide-react";
import { AI_recent_test_grading_feedback } from "../api/personal";

interface Question {
  topic: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
}

interface IncorrectQuestion {
  questionId: string;
  question: string;
  questionType: string;
  options: string[];
  solution: string;
  studentAnswer: string;
  isCorrect: boolean;
}

interface Topic {
  testId: string;
  testTitle: string;
  testSubject: string;
  submissionTime: string;
  incorrectQuestions: IncorrectQuestion[];
}

interface RecentTestResponse {
  success: boolean;
  questions: Question[];
  topics: Topic[];
  subject: string;
  subject_name: string;
}

export default function RecentQuestions() {
  const [data, setData] = useState<RecentTestResponse | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    // Lấy data từ localStorage
    const storedData = localStorage.getItem('recentTestData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
        // Xóa data sau khi đã lấy (tùy chọn)
        // localStorage.removeItem('recentTestData');
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  }, []);

  if (!data || !data.success) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không có dữ liệu câu hỏi gần đây.</p>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      alert("Vui lòng trả lời ít nhất một câu hỏi!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Chuẩn bị dữ liệu grading
      const grading_datas = data?.questions?.map((question, index) => ({
        question: question.question,
        student_answer: answers[`suggested_${index}`] || "",
        topic: question.topic,
        difficulty: question.difficulty
      })).filter(item => item.student_answer.trim() !== "");

      if (!grading_datas || grading_datas.length === 0) {
        alert("Vui lòng trả lời ít nhất một câu hỏi!");
        setIsSubmitting(false);
        return;
      }

      // Gọi AI để chấm điểm và nhận feedback
      const result = await AI_recent_test_grading_feedback(
        grading_datas,
        data?.subject || ""
      );

      setFeedback(result);
      console.log("AI Feedback:", result);
      alert("Đã nộp bài thành công! Xem kết quả phía dưới.");
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "hard": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Dễ";
      case "medium": return "Trung bình";
      case "hard": return "Khó";
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Luyện Tập Câu Hỏi Gần Đây</h1>
              <p className="text-blue-100 mt-1">Môn học: {data.subject_name}</p>
            </div>
          </div>
        </div>

        {/* Two Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Questions */}
          <div className="space-y-6">
            {/* Test Information */}
            {data.topics && data.topics.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <BookOpen className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Thông Tin Bài Kiểm Tra</h2>
                </div>
                
                {data.topics.map((topic, index) => (
                  <div key={topic.testId} className="bg-orange-50 rounded-lg p-5 border border-orange-200 mb-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tiêu đề:</p>
                        <p className="font-semibold text-gray-900">{topic.testTitle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Môn học:</p>
                        <p className="font-semibold text-gray-900">{topic.testSubject}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Thời gian nộp:</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(topic.submissionTime).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Số câu sai:</p>
                        <p className="font-semibold text-red-600 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {topic.incorrectQuestions.length} câu
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Suggested Questions */}
            {data.questions && data.questions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Câu Hỏi Gợi Ý Từ AI</h2>
                    <p className="text-sm text-gray-600">Dựa trên các lỗi sai của bạn</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {data.questions.map((question, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-purple-600 text-white font-bold px-3 py-1 rounded-lg text-sm">
                              Câu {index + 1}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getDifficultyColor(question.difficulty)}`}>
                              {getDifficultyLabel(question.difficulty)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {question.topic}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4 border border-purple-100">
                        <p className="text-gray-900 font-medium leading-relaxed">{question.question}</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Câu trả lời của bạn:</span>
                        </label>
                        <textarea
                          value={answers[`suggested_${index}`] || ''}
                          onChange={(e) => handleAnswerChange(`suggested_${index}`, e.target.value)}
                          placeholder="Nhập câu trả lời của bạn..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all min-h-[100px] resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Hoàn thành bài luyện tập</p>
                    <p className="text-sm text-gray-600">
                      Đã trả lời {Object.keys(answers).length} / {data.questions?.length || 0} câu
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Nộp Bài
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - AI Feedback */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            {feedback ? (
              <>
                {/* Summary Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Brain className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Kết Quả Chấm Bài</h2>
                      <p className="text-sm text-gray-600">Phản hồi từ AI</p>
                    </div>
                  </div>

                  {/* Score Summary */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Điểm trung bình</p>
                      <p className="text-3xl font-bold text-blue-600">{feedback.average_score || 0}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Số câu đúng</p>
                      <p className="text-3xl font-bold text-green-600">
                        {feedback.correct_count || 0}/{feedback.total_questions || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Results */}
                {feedback.detailed_results && feedback.detailed_results.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Chi Tiết Từng Câu</h3>
                    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                      {feedback.detailed_results.map((result: any, index: number) => (
                        <div 
                          key={index} 
                          className={`rounded-lg p-4 border-2 ${
                            result.isCorrect 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          {/* Question Header */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`font-bold px-3 py-1 rounded-lg text-sm ${
                              result.isCorrect 
                                ? 'bg-green-600 text-white' 
                                : 'bg-red-600 text-white'
                            }`}>
                              Câu {result.question_number || index + 1}
                            </span>
                            {result.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="text-sm font-semibold text-gray-600">
                              Điểm: {result.score || 0}/10
                            </span>
                          </div>

                          {/* Question */}
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Câu hỏi:</p>
                            <p className="text-sm text-gray-900 font-medium">{result.question}</p>
                          </div>

                          {/* Student Answer */}
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Câu trả lời của bạn:</p>
                            <p className="text-sm text-gray-900 bg-white rounded p-2 border border-gray-200">
                              {result.student_answer}
                            </p>
                          </div>

                          {/* Correct Answer */}
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Đáp án đúng:</p>
                            <p className="text-sm text-gray-900 bg-white rounded p-2 border border-gray-200">
                              {result.correct_answer}
                            </p>
                          </div>

                          {/* Comments */}
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Nhận xét:</p>
                            <p className="text-sm text-gray-700 bg-white rounded p-2 border border-gray-200">
                              {result.comments}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
                <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-2">Chưa có kết quả</p>
                <p className="text-sm text-gray-500">
                  Hoàn thành và nộp bài để xem phản hồi từ AI
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}