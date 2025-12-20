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
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Thống kê & Phân tích</h2>
        <p className="text-gray-600">Tổng quan về hiệu suất lớp học và bài kiểm tra</p>
      </div>

      {/* Test Analytics Section */}
      {testAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Bài tập đã giao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {testAnalytics.totalTestsAssigned}
              </div>
              <p className="text-xs text-gray-500 mt-1">Tổng số bài kiểm tra</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
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
              <p className="text-xs text-gray-500 mt-1">Học sinh đã hoàn thành</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
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
              <p className="text-xs text-gray-500 mt-1">Chưa hoàn thành</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Class Averages Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Điểm trung bình theo lớp</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classAverages.length > 0 ? (
            classAverages.map((classData, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Lớp {classData.classId}</span>
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
                  <CardDescription>
                    {classData.gradedCount} bài đã chấm điểm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Điểm TB</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {classData.averageGrade.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Cao nhất</p>
                      <p className="text-2xl font-bold text-green-600">
                        {classData.highestGrade !== null ? classData.highestGrade.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Thấp nhất</p>
                      <p className="text-2xl font-bold text-red-600">
                        {classData.lowestGrade !== null ? classData.lowestGrade.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Số bài chấm</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {classData.gradedCount}
                      </p>
                    </div>
                  </div>

                  {classData.studentsBelow40.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-orange-500" />
                        <h4 className="font-semibold text-gray-700">
                          Học sinh cần hỗ trợ (Điểm TB &lt; 4.0)
                        </h4>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {classData.studentsBelow40.map((student, idx) => (
                          <div key={idx} className="bg-orange-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-800">{student.studentName}</p>
                                <p className="text-xs text-gray-500">{student.studentEmail}</p>
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
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500 text-center">Chưa có dữ liệu điểm trung bình</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
