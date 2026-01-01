'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchClassAverageGrades, fetchTestsAnalytics } from '../api/analytics';
import { Loader2, TrendingUp, TrendingDown, FileText, CheckCircle, XCircle, Users } from 'lucide-react';

interface StudentBelow40 {
  studentId: string;
  studentName: string;
  studentEmail: string;
  averageGrade: number;
  testCount: number;
}

interface ClassAverage {
  classId: string;
  averageGrade: number;
  highestGrade: number | null;
  lowestGrade: number | null;
  gradedCount: number;
  studentsBelow40: StudentBelow40[];
}

interface TestAnalytics {
  totalTestsAssigned: number;
  totalSubmitted: number;
  totalUnsubmitted: number;
}

const AnalyticsTab = () => {
  const [classAverages, setClassAverages] = useState<ClassAverage[]>([]);
  const [testAnalytics, setTestAnalytics] = useState<TestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classGradesData, testAnalyticsData] = await Promise.all([
          fetchClassAverageGrades(),
          fetchTestsAnalytics()
        ]);
        
        setClassAverages(classGradesData.classAverages || []);
        setTestAnalytics(testAnalyticsData.analytics || null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-[#F1F5F9] rounded-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0F172A] leading-tight mb-2">Thống kê & Phân tích</h2>
        <p className="text-gray-600 leading-relaxed">Tổng quan về hiệu suất lớp học và bài kiểm tra</p>
      </div>

      {/* Test Analytics Section */}
      {testAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-[#2563EB] bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2563EB]" />
                Bài tập đã giao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#0F172A]">
                {testAnalytics.totalTestsAssigned}
              </div>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">Tổng số bài kiểm tra</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Bài đã nộp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {testAnalytics.totalSubmitted}
              </div>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">Học sinh đã hoàn thành</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Bài chưa nộp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {testAnalytics.totalUnsubmitted}
              </div>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">Chưa hoàn thành</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Class Averages Section */}
      <div>
        <h3 className="text-2xl font-bold text-[#0F172A] mb-6 leading-tight">Điểm trung bình theo lớp</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classAverages.length > 0 ? (
            classAverages.map((classData, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 bg-white">
                <CardHeader className="border-b border-gray-100 bg-[#F1F5F9]">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-[#0F172A] font-bold">Lớp {classData.classId}</span>
                    <div className="flex items-center gap-2">
                      {classData.averageGrade >= 7 ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : classData.averageGrade >= 5 ? (
                        <span className="w-5 h-5 text-yellow-500">−</span>
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {classData.gradedCount} bài đã chấm điểm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-sm text-gray-600 mb-1.5 font-medium">Điểm TB</p>
                      <p className="text-2xl font-bold text-[#2563EB]">
                        {classData.averageGrade.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-sm text-gray-600 mb-1.5 font-medium">Cao nhất</p>
                      <p className="text-2xl font-bold text-green-600">
                        {classData.highestGrade !== null ? classData.highestGrade.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <p className="text-sm text-gray-600 mb-1.5 font-medium">Thấp nhất</p>
                      <p className="text-2xl font-bold text-red-600">
                        {classData.lowestGrade !== null ? classData.lowestGrade.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <p className="text-sm text-gray-600 mb-1.5 font-medium">Số bài chấm</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {classData.gradedCount}
                      </p>
                    </div>
                  </div>

                  {classData.studentsBelow40.length > 0 && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-orange-500" />
                        <h4 className="font-semibold text-[#0F172A]">
                          Học sinh cần hỗ trợ (Điểm TB &lt; 4.0)
                        </h4>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {classData.studentsBelow40.map((student, idx) => (
                          <div key={idx} className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-[#0F172A] leading-relaxed">{student.studentName}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{student.studentEmail}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-orange-600">
                                  {student.averageGrade.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">{student.testCount} bài</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white border border-gray-100">
              <CardContent className="p-8">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Chưa có dữ liệu điểm trung bình</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
