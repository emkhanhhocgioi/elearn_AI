'use client';
import { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Brain, 
  Zap, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Sparkles,
  BookOpen,
  ChevronRight,
  Settings,
  Lightbulb
} from 'lucide-react';

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
  id: number;
  topic: string;
  difficulty: string;
  reason: string;
  estimatedTime: string;
}

const MyClassesTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    accuracy: 0,
    speed: 0,
    consistency: 0,
    improvement: 0
  });
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [learningGoal, setLearningGoal] = useState('');

  useEffect(() => {
    // TODO: Fetch personalized learning data from API
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

    const mockMetrics: PerformanceMetrics = {
      accuracy: 75,
      speed: 82,
      consistency: 68,
      improvement: 15
    };

    const mockSuggestions: SuggestedQuestion[] = [
      {
        id: 1,
        topic: "Phương trình bậc 2",
        difficulty: "Trung bình",
        reason: "Bạn đã làm sai 3/5 câu tương tự",
        estimatedTime: "10 phút"
      },
      {
        id: 2,
        topic: "Định luật Ôm",
        difficulty: "Dễ",
        reason: "Tốc độ làm bài chậm, cần luyện tập thêm",
        estimatedTime: "8 phút"
      },
      {
        id: 3,
        topic: "Phản ứng oxi hóa",
        difficulty: "Khó",
        reason: "Sẵn sàng thử thách ở mức cao hơn",
        estimatedTime: "15 phút"
      }
    ];

    setLearningPaths(mockLearningPaths);
    setMetrics(mockMetrics);
    setSuggestedQuestions(mockSuggestions);
    setLearningGoal("Đạt điểm 9+ trong kỳ thi cuối kỳ");
    setIsLoading(false);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return difficulty;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8" />
              Lộ Trình Học Cá Nhân Hóa
            </h1>
            <p className="text-blue-100 text-lg">
              Học thông minh hơn với hệ thống thích ứng theo năng lực của bạn
            </p>
          </div>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Settings className="w-5 h-5" />
            Cài đặt
          </button>
        </div>

      
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{metrics.accuracy}%</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Độ chính xác</p>
          <p className="text-xs text-gray-500 mt-1">Tỷ lệ làm đúng</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{metrics.speed}%</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Tốc độ học</p>
          <p className="text-xs text-gray-500 mt-1">So với mục tiêu</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{metrics.consistency}%</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Tính ổn định</p>
          <p className="text-xs text-gray-500 mt-1">Độ nhất quán</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">+{metrics.improvement}%</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Cải thiện</p>
          <p className="text-xs text-gray-500 mt-1">So với tuần trước</p>
        </div>
      </div>

      {/* Learning Paths */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Lộ Trình Học Thích Ứng
          </h2>
          <span className="text-sm text-gray-500">{learningPaths.length} môn học</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Đang tải lộ trình học...
            </div>
          ) : (
            learningPaths.map((path) => (
              <div key={path.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{path.subject}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{path.currentLevel}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-semibold text-blue-600">{path.targetLevel}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(path.difficulty)}`}>
                      {getDifficultyLabel(path.difficulty)}
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-bold text-gray-900">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Adaptive Status */}
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Trạng thái thích ứng</p>
                      <p className="text-sm text-gray-700">{path.adaptiveStatus}</p>
                    </div>
                  </div>

                  {/* Next Lesson */}
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Bài học tiếp theo</p>
                      <p className="text-sm font-medium text-gray-900">{path.nextLesson}</p>
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Thời gian ước tính</p>
                      <p className="text-sm font-medium text-gray-900">{path.estimatedTime}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4">
                    Tiếp tục học
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
       <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Gợi Ý Của Giáo Viên 
          </h2>
          <span className="text-sm text-gray-500">{learningPaths.length} môn học</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Đang tải lộ trình học...
            </div>
          ) : (
            learningPaths.map((path) => (
              <div key={path.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{path.subject}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{path.currentLevel}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-semibold text-blue-600">{path.targetLevel}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(path.difficulty)}`}>
                      {getDifficultyLabel(path.difficulty)}
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-bold text-gray-900">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Adaptive Status */}
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Trạng thái thích ứng</p>
                      <p className="text-sm text-gray-700">{path.adaptiveStatus}</p>
                    </div>
                  </div>

                  {/* Next Lesson */}
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Bài học tiếp theo</p>
                      <p className="text-sm font-medium text-gray-900">{path.nextLesson}</p>
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Thời gian ước tính</p>
                      <p className="text-sm font-medium text-gray-900">{path.estimatedTime}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4">
                    Tiếp tục học
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>


      {/* Suggested Questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Câu Hỏi Gợi Ý Tự Động
          </h2>
          <span className="text-sm text-gray-500">Dựa trên năng lực của bạn</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                  {question.difficulty}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 mb-2">{question.topic}</h3>
              
              <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Lý do gợi ý:</p>
                <p className="text-sm text-gray-800">{question.reason}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{question.estimatedTime}</span>
                </div>
              </div>

              <button className="w-full bg-yellow-100 text-yellow-700 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-200 transition-colors">
                Luyện tập ngay
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
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
