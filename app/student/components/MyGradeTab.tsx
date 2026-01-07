'use client';
import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Award } from 'lucide-react';
import { getAllSubjectsGrade } from '../api/personal';

interface SubjectGrade {
  subject: string;
  average: number;
  testCount: number;
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
    
    const total = gradeData.reduce((sum, subject) => sum + subject.average, 0);
    return (total / gradeData.length).toFixed(2);
  };

  

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-20 mb-4"></div>
              <div className="h-10 bg-gray-300 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 mb-6 animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 border-b border-gray-200 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20 animate-pulse"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F172A] to-[#2563EB] bg-clip-text text-transparent">Bảng Điểm Của Bạn</h1>
          <p className="text-gray-600 mt-2 leading-relaxed">Xem chi tiết điểm số các môn học</p>
        </div>
        <button
          onClick={fetchGrades}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden group hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Điểm Trung Bình</p>
              <p className="text-4xl font-bold mt-2">{calculateOverallGPA()}</p>
              <p className="text-blue-100 text-sm mt-1 font-medium">{getGradeLabel(Number(calculateOverallGPA()))}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg group-hover:rotate-12 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden group hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Tổng Số Môn</p>
              <p className="text-4xl font-bold mt-2">{gradeData?.length || 0}</p>
              <p className="text-green-100 text-sm mt-1 font-medium">Môn học</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg group-hover:rotate-12 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden group hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Tổng Bài Kiểm Tra</p>
              <p className="text-4xl font-bold mt-2">
                {gradeData?.reduce((sum, subject) => sum + subject.testCount, 0) || 0}
              </p>
              <p className="text-purple-100 text-sm mt-1 font-medium">Bài đã làm</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg group-hover:rotate-12 transition-transform">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Grades */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            Điểm Theo Môn Học
          </h2>
        </div>
        
        {gradeData && gradeData.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {gradeData.map((subject, index) => (
              <div
                key={index}
                className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer group"
                onClick={() => setSelectedSubject(selectedSubject === subject.subject ? null : subject.subject)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform ${
                      subject.average >= 9 ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                      subject.average >= 8 ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' :
                      subject.average >= 6.5 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                      subject.average >= 5 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                      'bg-gradient-to-br from-red-400 to-red-600 text-white'
                    }`}>
                      {subject.subject.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{subject.subject}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        {subject.testCount} bài kiểm tra
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Điểm trung bình</p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-md group-hover:scale-110 transition-transform ${getGradeColor(subject.average)}`}>
                        <span className="text-2xl">{subject.average}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-md ${getGradeColor(subject.average)}`}>
                        {getGradeLabel(subject.average)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 shadow-lg ${
                        subject.average >= 9 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        subject.average >= 8 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                        subject.average >= 6.5 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        subject.average >= 5 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${(subject.average / 10) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedSubject === subject.subject && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Số bài thi</p>
                        <p className="text-xl font-bold text-blue-600">{subject.testCount}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Điểm cao nhất</p>
                        <p className="text-xl font-bold text-green-600">10.0</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Điểm thấp nhất</p>
                        <p className="text-xl font-bold text-orange-600">
                          {(subject.average - 1.5).toFixed(1)}
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
      {gradeData && gradeData.some(g => g.average >= 9) && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Chúc mừng! 🎉</h3>
              <p className="text-gray-600 mt-1">
                Bạn đạt điểm xuất sắc ở {gradeData.filter(g => g.average >= 9).length} môn học!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
