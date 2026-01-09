'use client';
import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, Eye, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { getAllClasses } from '../api/class';
import { getTestReportByClassId } from '../api/report';

interface Student {
  _id: string;
  name: string;
  email?: string;
}

interface TestResult {
  studentId: string;
  studentName: string;
  studentEmail: string;
  teacherGrade: number;
  AIGrade: number;
  teacherComments: string;
  submissionTime: string;
  submit: boolean;
  isgraded: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface TestData {
  testId: string;
  testTitle: string;
  testSubject: string;
  createDate: string;
  closeDate: string;
  status: string;
  teacher: Teacher | null;
  results: TestResult[];
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
  
  // Modal pagination and selected test states
  const [testPage, setTestPage] = useState(1);
  const [testLimit] = useState(5);
  const [selectedTest, setSelectedTest] = useState<TestData | null>(null);

  // Export to Excel function
  const exportToExcel = (test: TestData) => {
    if (!test.results || test.results.length === 0) {
      alert('No data to export');
      return;
    }

    // Create CSV content
    const headers = ['STT', 'Student Name', 'Email', 'Score', 'AI Grade', 'Teacher Grade', 'Status', 'Submission Time', 'Comments'];
    const rows = test.results.map((result, index) => [
      index + 1,
      result.studentName,
      result.studentEmail,
      result.score,
      result.AIGrade,
      result.teacherGrade,
      result.isgraded ? 'Graded' : result.submit ? 'Submitted' : 'Pending',
      new Date(result.submissionTime).toLocaleString('vi-VN'),
      result.teacherComments || ''
    ]);

    // Add BOM for UTF-8 and create CSV string
    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma or newline
        const cellStr = String(cell).replace(/"/g, '""');
        return `"${cellStr}"`;
      }).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${test.testTitle}_results.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    setTestPage(1);
    setSelectedTest(null);
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

  // Pagination for tests in modal
  const paginatedTests = selectedTestReport?.tests?.slice(
    (testPage - 1) * testLimit,
    testPage * testLimit
  ) || [];
  const totalTestPages = Math.ceil((selectedTestReport?.tests?.length || 0) / testLimit);

  return (
    <div>
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          Class Test Reports
        </h3>
        
        {/* Search and Controls */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input
              type="text"
              placeholder="Search by class code, year, or teacher..."
              value={classSearch}
              onChange={(e) => setClassSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300"
            />
          </div>
        </div>

        {/* Classes Table */}
        {loadingClasses ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading classes...</p>
          </div>
        ) : paginatedClasses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-blue-500" />
            </div>
            <p className="text-lg font-semibold text-gray-600">No classes found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border-2 border-gray-100">
              <table className="w-full">
                <thead className="bg-blue-50">
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
                    <tr key={cls._id} className="hover:bg-blue-50 transition-all duration-200">
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
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <Eye className="w-5 h-5" />
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="text-sm font-medium text-gray-700">
                Showing <span className="font-bold text-blue-600">{((classPage - 1) * classLimit) + 1}</span> to <span className="font-bold text-blue-600">{Math.min(classPage * classLimit, filteredClasses.length)}</span> of <span className="font-bold text-blue-600">{filteredClasses.length}</span> classes
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setClassPage(Math.max(1, classPage - 1))}
                  disabled={classPage === 1}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalClassPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setClassPage(page)}
                      className={`px-4 py-2 border-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                        page === classPage
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setClassPage(Math.min(totalClassPages, classPage + 1))}
                  disabled={classPage === totalClassPages}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105"
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
          <div className="bg-white rounded-xl p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedTest ? (
                  <button 
                    onClick={() => setSelectedTest(null)}
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Tests List
                  </button>
                ) : (
                  'Test Report Details'
                )}
              </h3>
              <button
                onClick={() => {
                  setShowTestReportModal(false);
                  setSelectedTestReport(null);
                  setSelectedTest(null);
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
                {/* Summary Statistics - Always visible */}
                {!selectedTest && (
                  <>
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
                  </>
                )}

                {/* Individual Tests List or Selected Test Results */}
                {selectedTest ? (
                  /* Selected Test Results View */
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{selectedTest.testTitle}</h4>
                        {selectedTest.results && selectedTest.results.length > 0 && (
                          <button
                            onClick={() => exportToExcel(selectedTest)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Export Excel
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Subject:</span>
                          <span className="ml-2 font-medium">{selectedTest.testSubject}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Teacher:</span>
                          <span className="ml-2 font-medium">{selectedTest.teacher?.name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                            selectedTest.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {selectedTest.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Results:</span>
                          <span className="ml-2 font-medium">{selectedTest.results?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    {selectedTest.results && selectedTest.results.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Score</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">AI Grade</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {selectedTest.results.map((result: TestResult, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{result.studentName}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{result.studentEmail}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-1 rounded text-sm font-bold ${
                                    result.score >= 8 ? 'bg-green-100 text-green-700' :
                                    result.score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {result.score}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-gray-600">{result.AIGrade}</td>
                                <td className="px-4 py-3 text-center">
                                  {result.isgraded ? (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Graded</span>
                                  ) : result.submit ? (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Submitted</span>
                                  ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">Pending</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate" title={result.teacherComments}>
                                  {result.teacherComments || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No results available for this test</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Tests List View */
                  selectedTestReport.tests && selectedTestReport.tests.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Tests ({selectedTestReport.tests.length})</h4>
                      <div className="space-y-3">
                        {paginatedTests.map((test: TestData, index: number) => (
                          <div 
                            key={index} 
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                            onClick={() => setSelectedTest(test)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-lg">{test.testTitle}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <span className="bg-gray-100 px-2 py-1 rounded">{test.testSubject}</span>
                                  <span>Teacher: {test.teacher?.name || 'N/A'}</span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    test.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {test.status}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-blue-600">{test.results?.length || 0}</p>
                                  <p className="text-xs text-gray-500">results</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tests Pagination */}
                      {totalTestPages > 1 && (
                        <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">
                            Showing {((testPage - 1) * testLimit) + 1} to {Math.min(testPage * testLimit, selectedTestReport.tests.length)} of {selectedTestReport.tests.length} tests
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setTestPage(Math.max(1, testPage - 1))}
                              disabled={testPage === 1}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="flex gap-1">
                              {Array.from({ length: totalTestPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => setTestPage(page)}
                                  className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                                    page === testPage
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'border-gray-300 hover:bg-white'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => setTestPage(Math.min(totalTestPages, testPage + 1))}
                              disabled={testPage === totalTestPages}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}

                {(!selectedTestReport.tests || selectedTestReport.tests.length === 0) && !selectedTest && (
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
                  setSelectedTest(null);
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
