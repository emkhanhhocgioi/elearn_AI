'use client';
import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Award, BarChart3, Calendar, FileText } from 'lucide-react';
import { getAllSubjectsGrade } from '../api/personal';

interface SubjectGrade {
  subject: string;
  averageGrade: number;
  totalTests: number;
}

export default function MyGradeTab() {
  const [gradeData, setGradeData] = useState<SubjectGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await getAllSubjectsGrade();
      console.log('Fetched Grades:', data);
      setGradeData(data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return 'text-green-600 bg-green-50';
    if (grade >= 8) return 'text-blue-600 bg-blue-50';
    if (grade >= 6.5) return 'text-yellow-600 bg-yellow-50';
    if (grade >= 5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeLabel = (grade: number) => {
    if (grade >= 9) return 'Xuất sắc';
    if (grade >= 8) return 'Giỏi';
    if (grade >= 6.5) return 'Khá';
    if (grade >= 5) return 'Trung bình';
    return 'Yếu';
  };

  const calculateOverallGPA = () => {
    if (!gradeData || gradeData.length === 0) return 0;
    
    const total = gradeData.reduce((sum, subject) => sum + subject.averageGrade, 0);
    return (total / gradeData.length).toFixed(2);
  };

  

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải điểm số...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng Điểm Của Bạn</h1>
          <p className="text-gray-500 mt-1">Xem chi tiết điểm số các môn học</p>
        </div>
        <button
          onClick={fetchGrades}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Làm mới
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Điểm Trung Bình</p>
              <p className="text-3xl font-bold mt-2">{calculateOverallGPA()}</p>
              <p className="text-blue-100 text-sm mt-1">{getGradeLabel(Number(calculateOverallGPA()))}</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Tổng Số Môn</p>
              <p className="text-3xl font-bold mt-2">{gradeData?.length || 0}</p>
              <p className="text-green-100 text-sm mt-1">Môn học</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Tổng Bài Kiểm Tra</p>
              <p className="text-3xl font-bold mt-2">
                {gradeData?.reduce((sum, subject) => sum + subject.totalTests, 0) || 0}
              </p>
              <p className="text-purple-100 text-sm mt-1">Bài đã làm</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Grades */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Điểm Theo Môn Học</h2>
        </div>
        
        {gradeData && gradeData.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {gradeData.map((subject, index) => (
              <div
                key={index}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedSubject(selectedSubject === subject.subject ? null : subject.subject)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                   
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{subject.subject}</h3>
                      <p className="text-sm text-gray-500">{subject.totalTests} bài kiểm tra</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Điểm trung bình</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold mt-1 ${getGradeColor(subject.averageGrade)}`}>
                        <span className="text-lg">{subject.averageGrade.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(subject.averageGrade)}`}>
                        {getGradeLabel(subject.averageGrade)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        subject.averageGrade >= 9 ? 'bg-green-500' :
                        subject.averageGrade >= 8 ? 'bg-blue-500' :
                        subject.averageGrade >= 6.5 ? 'bg-yellow-500' :
                        subject.averageGrade >= 5 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(subject.averageGrade / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedSubject === subject.subject && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Số bài thi</p>
                        <p className="text-xl font-bold text-blue-600">{subject.totalTests}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Điểm cao nhất</p>
                        <p className="text-xl font-bold text-green-600">10.0</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Điểm thấp nhất</p>
                        <p className="text-xl font-bold text-orange-600">
                          {(subject.averageGrade - 1.5).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có điểm số nào</p>
            <p className="text-gray-400 text-sm mt-2">Hoàn thành các bài kiểm tra để xem điểm</p>
          </div>
        )}
      </div>

      {/* Achievement Section */}
      {gradeData && gradeData.some(g => g.averageGrade >= 9) && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Chúc mừng! 🎉</h3>
              <p className="text-gray-600 mt-1">
                Bạn đạt điểm xuất sắc ở {gradeData.filter(g => g.averageGrade >= 9).length} môn học!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
