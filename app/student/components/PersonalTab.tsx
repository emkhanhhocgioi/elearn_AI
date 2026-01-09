'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
 
  Brain, 

  Award, 
  Clock, 

  AlertCircle,

  Sparkles,
  BookOpen,
  ChevronRight,
  Settings,
  Lightbulb
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generateTeacherComment,AI_suggest_on_recentTest,DailyTestSubjectChange,getDailyQuestionAnswer } from '@/app/student/api/personal';
import {getLessonBySubjectforStudent} from '@/app/student/api/lesson';
import { getTestsBySubject } from '@/app/student/api/test';
import { usePractice } from '@/app/student/context/PracticeContext';

interface LearningPath {
  id: number;
  subject: string;
  currentLevel: string;
  targetLevel: string;
  progress: number;
  estimatedTime: string;
  nextLesson: string;
  difficulty: 'easy' | 'medium' | 'hard';
  adaptiveStatus: string;
}

interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  improvement: number;
}

interface SuggestedQuestion {
  _id: string;
  question: string;
  answer: string;
  ai_score: number;
  improvement_suggestions: string;
  createdAt: string;
}

interface AIResponse {
  question_answer: string | null;
  difficulty_level: string | null;
  result: {
    exercise_question: string;
    improve_suggestion: string;
  };
  teacher_comment: string;
}

interface RecentTestResponse {
  success: boolean;
  questions: {
    topic: string;
    question: string;
    difficulty: string;
  }[];
  topics: {
    testId: string;
    testTitle: string;
    testSubject: string;
    submissionTime: string;
    incorrectQuestions: {
      questionId: string;
      question: string;
      questionType: string;
      options: string[];
      solution: string;
      studentAnswer: string;
      isCorrect: boolean;
    }[];
  }[];
  subject: string;
  subject_name: string;
}

interface Lesson {
  _id: string;
  title: string;
}

interface Test {
  _id: string;
  testtitle: string;
  subject: string;
  createDate: string;
  closeDate: string;
  status: string;
  avg_score: string;
  classID: string;
  teacherID: string;
  lessonID?: string;
}



const MyClassesTab = () => {
  const router = useRouter();
  const { setPracticeData } = usePractice();
  
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);

  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [recentTestResponse, setRecentTestResponse] = useState<RecentTestResponse | null>(null);
  const [selectedRecentTestSubject, setSelectedRecentTestSubject] = useState<string>('');
  const [isLoadingRecentTest, setIsLoadingRecentTest] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [selectedDailySubject, setSelectedDailySubject] = useState<string>('');
  const [isSavingDailySubject, setIsSavingDailySubject] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string>('');

  useEffect(() => {
  
    const mockLearningPaths: LearningPath[] = [
      {
        id: 1,
        subject: "Toán học THCS",
        currentLevel: "Trung bình",
        targetLevel: "Giỏi",
        progress: 68,
        estimatedTime: "3 tuần",
        nextLesson: "Phương trình bậc 2 nâng cao",
        difficulty: 'medium',
        adaptiveStatus: "Đang điều chỉnh độ khó phù hợp"
      },
      {
        id: 2,
        subject: "Vật lý 9",
        currentLevel: "Yếu",
        targetLevel: "Khá",
        progress: 45,
        estimatedTime: "5 tuần",
        nextLesson: "Định luật Ôm - Bài tập cơ bản",
        difficulty: 'easy',
        adaptiveStatus: "Giảm tốc độ để nắm vững kiến thức"
      },
      {
        id: 3,
        subject: "Hóa học 9",
        currentLevel: "Khá",
        targetLevel: "Xuất sắc",
        progress: 82,
        estimatedTime: "2 tuần",
        nextLesson: "Phản ứng oxi hóa khử phức tạp",
        difficulty: 'hard',
        adaptiveStatus: "Tăng độ khó để thử thách"
      }
    ];

   

    setLearningPaths(mockLearningPaths);
    
    fetchDailyQuestionAnswer();

  }, []);

  const fetchDailyQuestionAnswer = async () => {
    try {
      const response = await getDailyQuestionAnswer();  
      console.log("Daily Question Answer Response:", response);
      if (response && Array.isArray(response)){
         setSuggestedQuestions(response);
      }
    } catch (error) {
      console.error("Error fetching daily question answer:", error);
      setSuggestedQuestions([]);
    }
  };
  

  const Recent_test = async (subject: string, testId: string) => {
    try {
        setIsLoadingRecentTest(true);
        setSelectedTest(testId);
        const response = await AI_suggest_on_recentTest(subject,testId);
        console.log("Recent Incorrect Answers Response:", response.data);
        
        if (response) {
          setRecentTestResponse(response.data);
        }
        setIsLoadingRecentTest(false);
        return response;  
    } catch (error) {
        console.error("Error fetching recent incorrect answers:", error);
        setIsLoadingRecentTest(false);
        throw error;
    }
  };
  const loadLessons = async (subject: string) => {
    try {
        setIsLoadingLessons(true);
        setSelectedSubject(subject);
        setSelectedLesson('');
        setAiResponse(null);
        
        const lessonsData = await getLessonBySubjectforStudent(subject);
        
        if (lessonsData && lessonsData.lessons) {
          setLessons(lessonsData.lessons);
          console.log('Lessons loaded for subject:', subject, lessonsData.lessons);
        }
        
        setIsLoadingLessons(false);
    } catch (error) {
        console.error("Error loading lessons:", error);
        setIsLoadingLessons(false);
    }
  };

  const loadTests = async (subject: string) => {
    try {
        setIsLoadingTests(true);
        setSelectedRecentTestSubject(subject);
        setSelectedTest('');
        setRecentTestResponse(null);
        
        const testsData = await getTestsBySubject(subject);
        
        if (testsData && Array.isArray(testsData)) {
          setTests(testsData);
          console.log('Tests loaded for subject:', subject, testsData);
        }
        
        setIsLoadingTests(false);
    } catch (error) {
        console.error("Error loading tests:", error);
        setIsLoadingTests(false);
    }
  };

  const GenerateTeacherComment = async (subject: string, lessonId: string) => {
    try {
        setIsLoadingAI(true);
        setSelectedLesson(lessonId);
        
        const aiResponseData = await generateTeacherComment(subject, lessonId);
  
        if (aiResponseData) {
          setAiResponse(aiResponseData);
          console.log('AI Response set for subject:', subject, 'lesson:', lessonId, aiResponseData);
        }
        
        setIsLoadingAI(false);
        return aiResponseData;
    } catch (error) {
        console.error("Error generating teacher comment:", error);
        setIsLoadingAI(false);
    }
  };

  const handleStartPractice = (subject: string) => {
    if (!aiResponse || !aiResponse.result.exercise_question) {
      alert('Vui lòng chọn môn học để tạo câu hỏi trước!');
      return;
    }

    // Lưu dữ liệu vào context
    setPracticeData({
      subject: subject,
      exercise_question: aiResponse.result.exercise_question,
      improve_suggestion: aiResponse.result.improve_suggestion || undefined,
      source: 'teacher_comment',
    });

    // Chuyển sang trang practice
    router.push('/student/practice');
  };

  

  const handleReset = () => {
    setSelectedSubject('');
    setSelectedLesson('');
    setAiResponse(null);
    setLessons([]);
  };

  const handleResetRecentTest = () => {
    setSelectedRecentTestSubject('');
    setSelectedTest('');
    setRecentTestResponse(null);
    setTests([]);
  };

  

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-0 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 flex items-center gap-3 animate-slide-in-left">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-9 h-9 animate-pulse" />
              </div>
              Lộ Trình Học Cá Nhân Hóa
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl leading-relaxed animate-slide-in-left" style={{animationDelay: '0.1s'}}>
              🚀 Học thông minh hơn với hệ thống AI thích ứng theo năng lực của bạn
            </p>
          </div>
          
        </div>
      </div>

      

     
       <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-600">
              Gợi Ý Dựa Trên Đánh Giá Giáo Viên
            </span>
          </h2>
          <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">{learningPaths.length} môn học</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - AI Response Display */}
          <div className="lg:col-span-1">
            <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200 shadow-xl sticky top-4 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Phân Tích AI</h3>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Dựa trên nhận xét giáo viên
                  </p>
                </div>
              </div>

              {isLoadingAI ? (
                <div className="text-center py-10">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium animate-pulse">Đang phân tích với AI...</p>
                  <p className="text-xs text-gray-500 mt-1">Vui lòng đợi trong giây lát</p>
                </div>
              ) : aiResponse ? (
                <div className="space-y-4">
                  {/* Subject */}
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <p className="text-xs text-gray-500 mb-1">Môn học</p>
                    <p className="font-semibold text-gray-900">{selectedSubject}</p>
                  </div>

                  {/* Exercise Question */}
                  {aiResponse.result.exercise_question && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-start gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-semibold text-gray-700">Bài tập gợi ý</p>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{aiResponse.result.exercise_question}</p>
                    </div>
                  )}

                  {/* Improvement Suggestion */}
                  {aiResponse.result.improve_suggestion && (
                    <div className="bg-white rounded-lg p-4 border border-yellow-100">
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-semibold text-gray-700">Gợi ý cải thiện</p>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{aiResponse.result.improve_suggestion}</p>
                    </div>
                  )}

                  {/* Teacher Comment */}
                  {aiResponse.teacher_comment && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-semibold text-gray-700">Nhận xét giáo viên</p>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{aiResponse.teacher_comment}</p>
                    </div>
                  )}

                  {/* Question & Answer if available */}
                  {aiResponse.question_answer && (
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Câu hỏi & Câu trả lời</p>
                      <p className="text-sm text-gray-800">{aiResponse.question_answer}</p>
                    </div>
                  )}

                  <button 
                    onClick={() => handleStartPractice(selectedSubject)}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Bắt đầu luyện tập
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Chọn một môn học</p>
                  <p className="text-xs text-gray-500">để xem phân tích từ AI</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Subject Selection or Lessons Display */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            {!selectedSubject ? (
              <>
                <h3 className="text-sm font-bold text-gray-700 mb-5 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Chọn môn học THCS
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Toán',
                    'Ngữ Văn',
                    'Tiếng Anh',
                    'Vật Lý',
                    'Hóa Học',
                    'Sinh Học',
                    'Lịch Sử',
                    'Địa Lý',
                    'Tin Học',
                    'GDCD'
                  ].map((subject) => (
                    <button
                      key={subject}
                      onClick={() => loadLessons(subject)}
                      disabled={isLoadingLessons}
                      aria-label={`Chọn môn ${subject}`}
                      className={`group flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-semibold border-2 transition-all hover:scale-105 ${
                        selectedSubject === subject
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                          : 'bg-white hover:bg-blue-50 text-gray-800 border-gray-200 hover:border-blue-300 hover:shadow-md'
                      } ${isLoadingLessons ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${selectedSubject === subject ? 'bg-white/20' : 'bg-blue-100'}`}>
                        <BookOpen className={`w-5 h-5 ${selectedSubject === subject ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      <span>{subject}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 bg-blue-50 rounded-xl p-5 border-2 border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-2">Hướng dẫn sử dụng</p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Bước 1: Chọn môn học để xem danh sách các tiết học.<br/>
                        Bước 2: Chọn tiết học để nhận phân tích từ AI và bài tập phù hợp.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Danh sách tiết học - {selectedSubject}
                  </h3>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Chọn lại môn học
                  </button>
                </div>

                {isLoadingLessons ? (
                  <div className="text-center py-12">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-700 font-medium animate-pulse">Đang tải danh sách tiết học...</p>
                  </div>
                ) : lessons.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson._id}
                        onClick={() => GenerateTeacherComment(selectedSubject, lesson._id)}
                        className={`bg-gradient-to-r from-blue-50 to-white rounded-xl p-5 border-2 transition-all cursor-pointer group ${
                          selectedLesson === lesson._id 
                            ? 'border-blue-600 shadow-xl bg-blue-100' 
                            : 'border-blue-100 hover:border-blue-300 hover:shadow-lg'
                        } ${isLoadingAI ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1 text-base group-hover:text-blue-600 transition-colors">
                              {lesson.title}
                            </h4>
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <BookOpen className="w-3 h-3" />
                              Tiết học {index + 1}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-2">Không có tiết học nào</p>
                    <p className="text-sm text-gray-500">Hiện tại chưa có tiết học cho môn {selectedSubject}</p>
                  </div>
                )}

                <div className="mt-6 bg-blue-50 rounded-xl p-5 border-2 border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-2">Thông tin</p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Chọn một tiết học từ danh sách trên để nhận phân tích từ AI. 
                        Phân tích sẽ xuất hiện ở panel bên trái và bạn có thể bắt đầu luyện tập.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>


      {/* Suggested Questions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-xl shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <span className="text-yellow-600">
              Câu Hỏi Từ Bài Làm Sai Gần Đây
            </span>
          </h2>
          <span className="px-4 py-2 bg-yellow-50 text-orange-700 text-sm font-semibold rounded-full border border-orange-200">Dựa trên lỗi mắc phải</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Side - Recent Test AI Response Display */}
          <div className="lg:col-span-1">
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 sticky top-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phân Tích Lỗi Gần Đây</h3>
                  <p className="text-xs text-gray-500">Từ bài kiểm tra gần nhất</p>
                </div>
              </div>

              {isLoadingRecentTest ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Đang phân tích...</p>
                </div>
              ) : recentTestResponse ? (
                <div className="space-y-4">
                  {/* Subject */}
                  <div className="bg-white rounded-lg p-4 border border-yellow-100">
                    <p className="text-xs text-gray-500 mb-1">Môn học</p>
                    <p className="font-semibold text-gray-900">{recentTestResponse.subject_name}</p>
                  </div>

                  {/* Test Info */}
                  {recentTestResponse.topics && recentTestResponse.topics.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-semibold text-gray-700">Thông tin bài kiểm tra</p>
                      </div>
                      {recentTestResponse.topics.map((topic, index) => (
                        <div key={index} className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{topic.testTitle}</p>
                            <p className="text-xs text-gray-500">
                              Nộp bài: {new Date(topic.submissionTime).toLocaleString('vi-VN')}
                            </p>
                            <p className="text-xs text-red-600 font-medium mt-1">
                              Số câu sai: {topic.incorrectQuestions.length} câu
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Questions - Câu hỏi gợi ý từ AI */}
                  {recentTestResponse.questions && recentTestResponse.questions.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100 max-h-96 overflow-y-auto">
                      <div className="flex items-start gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-semibold text-gray-700">Câu hỏi luyện tập gợi ý từ AI</p>
                      </div>
                      <div className="space-y-3">
                        {recentTestResponse.questions.map((item, index) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-start gap-2 mb-2">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs font-semibold text-blue-700">{item.topic}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    item.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                    item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {item.difficulty === 'easy' ? 'Dễ' : 
                                     item.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-800 leading-relaxed">{item.question}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      if (recentTestResponse) {
                        // Lưu data vào localStorage để truyền sang trang recent
                        localStorage.setItem('recentTestData', JSON.stringify(recentTestResponse));
                        router.push('/student/recent');
                      }
                    }}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Luyện tập khắc phục lỗi
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Chọn một môn học</p>
                  <p className="text-xs text-gray-500">để xem phân tích lỗi gần đây</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Subject Selection or Tests Display */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
            {!selectedRecentTestSubject ? (
              <>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Chọn môn học để xem bài kiểm tra</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    'Toán',
                    'Ngữ Văn',
                    'Tiếng Anh',
                    'Vật Lý',
                    'Hóa Học',
                    'Sinh Học',
                    'Lịch Sử',
                    'Địa Lý',
                    'Tin Học',
                    'GDCD'
                  ].map((subject) => (
                    <button
                      key={subject}
                      onClick={() => loadTests(subject)}
                      disabled={isLoadingTests}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
                        selectedRecentTestSubject === subject
                          ? 'bg-yellow-600 text-white border-yellow-600 shadow-md'
                          : 'bg-yellow-50 hover:bg-yellow-100 text-gray-800 border-transparent hover:shadow-sm'
                      } ${isLoadingTests ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <BookOpen className={`w-4 h-4 ${selectedRecentTestSubject === subject ? 'text-white' : 'text-yellow-600'}`} />
                      {subject}
                    </button>
                  ))}
                </div>
                <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Hướng dẫn sử dụng</p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Chọn môn học để xem danh sách bài kiểm tra. Sau đó chọn bài kiểm tra để xem phân tích các lỗi mắc phải. 
                        Hệ thống AI sẽ đề xuất các câu hỏi luyện tập giúp bạn khắc phục những lỗi này.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold text-gray-700">Danh sách bài kiểm tra - {selectedRecentTestSubject}</h3>
                  <button
                    onClick={handleResetRecentTest}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Đổi môn học
                  </button>
                </div>

                {isLoadingTests ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Đang tải danh sách bài kiểm tra...</p>
                  </div>
                ) : tests.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {tests.map((test, index) => (
                      <button
                        key={test._id}
                        onClick={() => Recent_test(selectedRecentTestSubject, test._id)}
                        disabled={isLoadingRecentTest}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          selectedTest === test._id
                            ? 'border-yellow-500 bg-yellow-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-yellow-300'
                        } ${isLoadingRecentTest ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                              <BookOpen className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{test.testtitle || `Bài kiểm tra ${index + 1}`}</h4>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-500">
                                  Ngày tạo: {new Date(test.createDate).toLocaleDateString('vi-VN')}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Hạn nộp: {new Date(test.closeDate).toLocaleDateString('vi-VN')}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    test.status === 'open' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {test.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Điểm TB: {test.avg_score || '0'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {selectedTest === test._id && (
                            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Đã chọn
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Không có bài kiểm tra nào</p>
                    <p className="text-xs text-gray-500">Chưa có bài kiểm tra cho môn học này</p>
                  </div>
                )}

                <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">💡 Mẹo học tập</p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Chọn một bài kiểm tra để xem phân tích chi tiết các câu trả lời sai và nhận gợi ý cải thiện từ AI.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Original Suggested Questions Grid */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Câu hỏi gợi ý theo năng lực</h3>
            <div className="flex items-center gap-3">
              <Select value={selectedDailySubject} onValueChange={setSelectedDailySubject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toán">Toán</SelectItem>
                  <SelectItem value="Ngữ Văn">Ngữ Văn</SelectItem>
                  <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                  <SelectItem value="Vật Lý">Vật Lý</SelectItem>
                  <SelectItem value="Hóa Học">Hóa Học</SelectItem>
                  <SelectItem value="Sinh Học">Sinh Học</SelectItem>
                  <SelectItem value="Lịch Sử">Lịch Sử</SelectItem>
                  <SelectItem value="Địa Lý">Địa Lý</SelectItem>
                  <SelectItem value="Tin Học">Tin Học</SelectItem>
                  <SelectItem value="GDCD">GDCD</SelectItem>
                </SelectContent>
              </Select>
              <button 
                onClick={async () => {
                  if (!selectedDailySubject) {
                    alert('Vui lòng chọn môn học trước!');
                    return;
                  }
                  try {
                    setIsSavingDailySubject(true);
                    await DailyTestSubjectChange(selectedDailySubject);
                    alert(`Đã lưu môn học: ${selectedDailySubject}`);
                  } catch (error) {
                    console.error('Error saving daily subject:', error);
                    alert('Lỗi khi lưu môn học. Vui lòng thử lại!');
                  } finally {
                    setIsSavingDailySubject(false);
                  }
                }}
                disabled={isSavingDailySubject || !selectedDailySubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isSavingDailySubject ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedQuestions.length > 0 ? (
              suggestedQuestions.map((question) => (
                <div key={question._id} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-yellow-50 p-2 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                      Điểm AI: {question.ai_score}/10
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{question.question}</h3>
                  
                  <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-100 max-h-32 overflow-y-auto">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Gợi ý cải thiện:</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{question.improvement_suggestions}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(question.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setPracticeData({
                        subject: selectedDailySubject || 'Toán',
                        exercise_question: question.question,
                        improve_suggestion: question.improvement_suggestions,                        source: 'recent_test',                      });
                      router.push('/student/practice');
                    }}
                    className="w-full bg-yellow-100 text-yellow-700 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-200 transition-colors"
                  >
                    Luyện tập ngay
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">Chưa có câu hỏi hàng ngày</p>
                <p className="text-sm text-gray-500">Chọn môn học và lưu để nhận câu hỏi hàng ngày vào lần đăng nhập tiếp theo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Phân Tích AI</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Hệ thống AI nhận thấy bạn đang tiến bộ tốt ở <strong>Hóa học</strong>. 
              Tuy nhiên, bạn cần chú ý hơn đến <strong>Vật lý</strong> - đặc biệt là các bài tập về định luật Ôm. 
              Hệ thống đã điều chỉnh độ khó và tốc độ học phù hợp với khả năng hiện tại của bạn. 
              Tiếp tục duy trì nhịp độ này, bạn sẽ đạt mục tiêu trong <strong>4 tuần</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClassesTab;
