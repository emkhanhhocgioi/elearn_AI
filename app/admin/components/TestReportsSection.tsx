'use client';
import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, Eye, X } from 'lucide-react';
import { getAllClasses } from '../api/class';
import { getTestReportByClassId } from '../api/report';

interface Student {
  _id: string;
  name: string;
  email?: string;
}

interface TestResult {
  studentId: string;
  studentName?: string;
  score: number;
}

interface TestData {
  testId: string;
  results?: TestResult[];
}

interface ScoreDistribution {
  range: string;
  count: number;
}

interface TestReportSummary {
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
}

interface TestReport {
  summary?: TestReportSummary;
  scoreDistribution?: ScoreDistribution[];
  tests?: TestData[];
  error?: string;
}

interface ClassData {
  _id: string;
  class_code: string;
  class_year: string;
  class_teacher?: {
    _id: string;
    name: string;
  };
  students?: Student[];
  class_avarage_grade?: number;
}

export default function TestReportsSection() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassData[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classSearch, setClassSearch] = useState('');
  const [classSortField, setClassSortField] = useState<'class_code' | 'class_year' | 'class_avarage_grade'>('class_code');
  const [classSortOrder, setClassSortOrder] = useState<'asc' | 'desc'>('asc');
  const [classPage, setClassPage] = useState(1);
  const [classLimit] = useState(10);
  const [selectedTestReport, setSelectedTestReport] = useState<TestReport | null>(null);
  const [showTestReportModal, setShowTestReportModal] = useState(false);
  const [loadingTestReport, setLoadingTestReport] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    loadClasses();
  }, []);

  // Filter and sort classes
  useEffect(() => {
    let result = [...classes];

    // Search filter
    if (classSearch) {
      result = result.filter(cls => 
        cls.class_code.toLowerCase().includes(classSearch.toLowerCase()) ||
        cls.class_year.toLowerCase().includes(classSearch.toLowerCase()) ||
        cls.class_teacher?.name.toLowerCase().includes(classSearch.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
  let aVal: string | number;
  let bVal: string | number;

  if (classSortField === 'class_code' || classSortField === 'class_year') {
    aVal = a[classSortField] ?? '';
    bVal = b[classSortField] ?? '';
  } else {
    aVal = a[classSortField] ?? 0;
    bVal = b[classSortField] ?? 0;
  }

  if (aVal < bVal) return classSortOrder === 'asc' ? -1 : 1;
  if (aVal > bVal) return classSortOrder === 'asc' ? 1 : -1;
  return 0;
  });


    setFilteredClasses(result);
  }, [classes, classSearch, classSortField, classSortOrder]);

  const loadClasses = async () => {
    setLoadingClasses(true);
    try {
      const response = await getAllClasses();
      if (response.success) {
        setClasses(response.data);
      }
    } catch (err) {
      console.error('Error loading classes:', err);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleViewTestReport = async (classId: string) => {
    setLoadingTestReport(true);
    setShowTestReportModal(true);
    try {
      const response = await getTestReportByClassId(classId);
      if (response.success) {
        setSelectedTestReport(response.data);
      }
    } catch (err) {
      console.error('Error loading test report:', err);
      setSelectedTestReport({ error: 'Failed to load test report' });
    } finally {
      setLoadingTestReport(false);
    }
  };

  const handleClassSort = (field: 'class_code' | 'class_year' | 'class_avarage_grade') => {
    if (classSortField === field) {
      setClassSortOrder(classSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setClassSortField(field);
      setClassSortOrder('asc');
    }
  };

  // Pagination for classes
  const paginatedClasses = filteredClasses.slice(
    (classPage - 1) * classLimit,
    classPage * classLimit
  );
  const totalClassPages = Math.ceil(filteredClasses.length / classLimit);

  return (
    <div>
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Class Test Reports</h3>
        
        {/* Search and Controls */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by class code, year, or teacher..."
              value={classSearch}
              onChange={(e) => setClassSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Classes Table */}
        {loadingClasses ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading classes...</p>
          </div>
        ) : paginatedClasses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No classes found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleClassSort('class_code')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-1">
                        Class Code
                        {classSortField === 'class_code' && (
                          classSortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleClassSort('class_year')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-1">
                        Year
                        {classSortField === 'class_year' && (
                          classSortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                        
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedClasses.map((cls) => (
                    <tr key={cls._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cls.class_code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cls.class_year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {cls.class_teacher?.name || 'Not assigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewTestReport(cls._id)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {((classPage - 1) * classLimit) + 1} to {Math.min(classPage * classLimit, filteredClasses.length)} of {filteredClasses.length} classes
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setClassPage(Math.max(1, classPage - 1))}
                  disabled={classPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalClassPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setClassPage(page)}
                      className={`px-3 py-1.5 border rounded-lg text-sm ${
                        page === classPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setClassPage(Math.min(totalClassPages, classPage + 1))}
                  disabled={classPage === totalClassPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Test Report Detail Modal */}
      {showTestReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Test Report Details</h3>
              <button
                onClick={() => {
                  setShowTestReportModal(false);
                  setSelectedTestReport(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {loadingTestReport ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading test report...</p>
              </div>
            ) : selectedTestReport?.error ? (
              <div className="text-center py-12 text-red-600">
                <p>{selectedTestReport.error}</p>
              </div>
            ) : selectedTestReport ? (
              <div className="space-y-4">
                {/* Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedTestReport.summary?.totalAttempts || 0}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{selectedTestReport.summary?.completedAttempts || 0}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Average Score</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedTestReport.summary?.averageScore ? selectedTestReport.summary.averageScore.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Highest Score</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {selectedTestReport.summary?.highestScore ? selectedTestReport.summary.highestScore.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Lowest Score</p>
                    <p className="text-2xl font-bold text-red-600">
                      {selectedTestReport.summary?.lowestScore ? selectedTestReport.summary.lowestScore.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedTestReport.summary?.passRate ? selectedTestReport.summary.passRate.toFixed(1) : '0'}%
                    </p>
                  </div>
                </div>

                {/* Score Distribution */}
                {selectedTestReport.scoreDistribution && selectedTestReport.scoreDistribution.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Score Distribution</h4>
                    <div className="grid grid-cols-5 gap-3">
                      {selectedTestReport.scoreDistribution.map((dist: ScoreDistribution, index: number) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg text-center">
                          <p className="text-xs text-gray-500 mb-1">{dist.range}</p>
                          <p className="text-xl font-bold text-gray-900">{dist.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Individual Tests */}
                {selectedTestReport.tests && selectedTestReport.tests.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Individual Tests</h4>
                    <div className="space-y-3">
                      {selectedTestReport.tests.map((test: TestData, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900">Test ID: {test.testId}</p>
                            <span className="text-sm text-gray-500">
                              {test.results?.length || 0} result(s)
                            </span>
                          </div>
                          {test.results && test.results.length > 0 ? (
                            <div className="mt-3 space-y-2">
                              {test.results.map((result: TestResult, resultIndex: number) => (
                                <div key={resultIndex} className="text-sm bg-gray-50 p-2 rounded">
                                  <p className="text-gray-700">
                                    Student: {result.studentName || result.studentId || 'Unknown'}
                                  </p>
                                  <p className="text-gray-600">
                                    Score: {result.score ? result.score.toFixed(2) : 'N/A'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mt-2">No results available</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!selectedTestReport.tests || selectedTestReport.tests.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No test data available for this class</p>
                  </div>
                )}
              </div>
            ) : null}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowTestReportModal(false);
                  setSelectedTestReport(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
