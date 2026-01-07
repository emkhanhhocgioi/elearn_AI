'use client';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Filter, Calendar, ChevronRight, Award } from 'lucide-react';
import { getStudentClassTest } from '../../student/api/test';
import { useRouter } from 'next/navigation';

// Interface for API response
interface TestApiResponse {
  _id: string;
  classID: string;
  teacherID: string;
  testtitle: string;
  subject: string;
  avg_score: string;
  participants: number;
  closeDate: string;
  status: string;
  createDate: string;
  __v: number;
  test_time: number;
  hasSubmitted: boolean;
  isSubmitedTime?: string;
  isGraded: boolean;
}

// Interface for mapped test object
interface MappedTest {
  id: string;
  title: string;
  subject: string;
  classID: string;
  teacherID: string;
  status: string;
  score: number | null;
  closeDate: string;
  participants: number;
  daysUntilClose: number;
  isSubmited: boolean;
  isLateSubmission: boolean;
  isGraded: boolean;
}

// Danh sách 12 môn học THCS
const THCS_SUBJECTS = [
  'Tất cả môn',
  'Toán',
  'Ngữ văn',
  'Tiếng Anh',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Lịch sử',
  'Địa lý',
  'GDCD',
  'Tin học',
  'Công nghệ',
  'Thể dục'
];

const MyTestsTab = () => {
  const [tests, setTests] = useState<MappedTest[]>([]);
  const [filteredTests, setFilteredTests] = useState<MappedTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Tất cả môn');
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentClassTest();
        
        // Map the response data to the expected format
        const mappedTests = response.map((test: TestApiResponse) => {
          const closeDate = new Date(test.closeDate);
          const now = new Date();
          const daysUntilClose = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Determine status based on hasSubmitted and closeDate
          let status = 'Upcoming';
          let isLateSubmission = false;
          
          if (test.hasSubmitted) {
            // Check if submitted on time
            if (test.isSubmitedTime) {
              const submitTime = new Date(test.isSubmitedTime);
              isLateSubmission = submitTime > closeDate;
            }
            status = isLateSubmission ? 'Submitted Late' : 'Submitted';
          } else if (test.status === 'closed' || daysUntilClose < 0) {
            status = 'Overdue';
          } else if (daysUntilClose <= 3) {
            status = 'Pending';
          }
          
          return {
            id: test._id,
            title: test.testtitle,
            subject: test.subject,
            classID: test.classID,
            teacherID: test.teacherID,
            status: status,
            score: test.avg_score !== "0" ? parseInt(test.avg_score) : null,
            closeDate: closeDate.toLocaleDateString('vi-VN'),
            participants: test.participants,
            daysUntilClose: daysUntilClose,
            isSubmited: test.hasSubmitted,
            isLateSubmission: isLateSubmission,
            isGraded: test.isGraded
          };
        });
        
        setTests(mappedTests);
        setFilteredTests(mappedTests);
      } catch (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
        setFilteredTests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Filter tests when subject selection changes
  useEffect(() => {
    if (selectedSubject === 'Tất cả môn') {
      setFilteredTests(tests);
    } else {
      const filtered = tests.filter(test => test.subject === selectedSubject);
      setFilteredTests(filtered);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [selectedSubject, tests]);

  const getStatusBadge = (status: string) => {
    switch (status) {
    
      case 'Submitted':
        return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Đã nộp</span>;
      case 'Submitted Late':
        return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full"><AlertCircle className="w-3 h-3" /> Nộp trễ</span>;
      case 'Overdue' :
        return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full"><AlertCircle className="w-3 h-3" /> Quá hạn</span>;
      case 'Pending':
        return <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full"><AlertCircle className="w-3 h-3" /> Sắp hết hạn</span>;
      case 'Upcoming':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"><Clock className="w-3 h-3" /> Sắp tới</span>;
      default:
        return null;
    }
  };

  const getCloseDateColor = (daysUntilClose: number) => {
    if (daysUntilClose < 0) return 'text-red-600 font-semibold';
    if (daysUntilClose <= 3) return 'text-orange-600 font-semibold';
    if (daysUntilClose <= 7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  // Get upcoming tests (not submitted and not overdue) sorted by close date
  const getUpcomingTests = () => {
    return filteredTests
      .filter(test => !test.isSubmited && test.daysUntilClose >= 0)
      .sort((a, b) => a.daysUntilClose - b.daysUntilClose)
      .slice(0, 5); // Show only next 5 upcoming tests
  };

  const getTimelineColor = (daysUntilClose: number) => {
    if (daysUntilClose <= 1) return 'bg-red-500';
    if (daysUntilClose <= 3) return 'bg-orange-500';
    if (daysUntilClose <= 7) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getTimelineBorderColor = (daysUntilClose: number) => {
    if (daysUntilClose <= 1) return 'border-red-200 bg-red-50';
    if (daysUntilClose <= 3) return 'border-orange-200 bg-orange-50';
    if (daysUntilClose <= 7) return 'border-yellow-200 bg-yellow-50';
    return 'border-blue-200 bg-blue-50';
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredTests.length / testsPerPage);
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0F172A] to-[#2563EB] bg-clip-text text-transparent leading-tight">Bài Tập Của Tôi</h2>
        <p className="text-gray-600 mt-2 leading-relaxed flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">{tests.length}</span>
          Theo dõi các bài tập và điểm số của bạn
        </p>
      </div>

      {/* Timeline Section */}
      {getUpcomingTests().length > 0 && (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 mb-6 shadow-lg border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">Bài Tập Sắp Hết Hạn</h3>
              <p className="text-sm text-gray-600">Ưu tiên hoàn thành các bài này trước</p>
            </div>
          </div>
          <div className="space-y-4">
            {getUpcomingTests().map((test, index) => (
              <div key={test.id} className="relative">
                {/* Timeline line */}
                {index < getUpcomingTests().length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                )}
                
                <div className={`flex items-start gap-4 p-4 rounded-lg border-2 ${getTimelineBorderColor(test.daysUntilClose)} transition-all hover:shadow-md`}>
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full ${getTimelineColor(test.daysUntilClose)} flex items-center justify-center shadow-sm`}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[#0F172A] mb-1.5 leading-relaxed">{test.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <span className="font-semibold">{test.subject}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Hạn nộp: {test.closeDate}
                          </span>
                        </div>
                      </div>
                      
                      {/* Days remaining badge */}
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          test.daysUntilClose <= 1 ? 'bg-red-100 text-red-700 border border-red-200' :
                          test.daysUntilClose <= 3 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                          test.daysUntilClose <= 7 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {test.daysUntilClose === 0 ? 'Hôm nay' :
                           test.daysUntilClose === 1 ? 'Ngày mai' :
                           `Còn ${test.daysUntilClose} ngày`}
                        </div>
                        
                        <button
                          onClick={() => router.push(`/student/test/${test.id}`)}
                          className="flex items-center gap-1 bg-[#2563EB] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
                        >
                          Làm bài
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 text-[#0F172A]">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-bold text-lg">Lọc theo môn:</span>
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-[#0F172A] font-medium transition-all hover:border-[#2563EB] bg-white shadow-sm"
          >
            {THCS_SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm font-bold rounded-full border border-blue-200">
            Hiển thị <span className="text-[#2563EB]">{filteredTests.length}</span> / {tests.length} bài kiểm tra
          </span>
        </div>
      </div>

      {/* Pagination Info */}
      {filteredTests.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span className="font-medium">
              Hiển thị <span className="text-[#2563EB] font-bold">{indexOfFirstTest + 1}</span> đến{' '}
              <span className="text-[#2563EB] font-bold">{Math.min(indexOfLastTest, filteredTests.length)}</span> trong tổng số{' '}
              <span className="text-[#2563EB] font-bold">{filteredTests.length}</span> bài kiểm tra
            </span>
            <span className="font-medium">
              Trang <span className="text-[#2563EB] font-bold">{currentPage}</span> / <span className="text-[#2563EB] font-bold">{totalPages}</span>
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#0F172A] uppercase tracking-wide">Tiêu đề</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#0F172A] uppercase tracking-wide">Môn học</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#0F172A] uppercase tracking-wide">Học viên</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#0F172A] uppercase tracking-wide">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#0F172A] uppercase tracking-wide">Điểm TB</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#0F172A] uppercase tracking-wide">Hạn nộp</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#0F172A] uppercase tracking-wide">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                    {selectedSubject === 'Tất cả môn' 
                      ? 'Không có bài kiểm tra nào' 
                      : `Không có bài kiểm tra môn ${selectedSubject}`}
                  </td>
                </tr>
              ) : (
                currentTests.map((test) => (
                  <tr key={test.id} className="hover:bg-[#F1F5F9] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#0F172A] leading-relaxed">{test.title}</p>
                      {test.daysUntilClose !== undefined && test.daysUntilClose >= 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
                          <Clock className="w-3 h-3" />
                          Còn {test.daysUntilClose} ngày
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 font-medium">{test.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{test.participants} học viên</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(test.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${
                        test.score ? (
                          test.score >= 80 ? 'text-green-600' :
                          test.score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        ) : 'text-gray-400'
                      }`}>
                        {test.score ? `${test.score}%` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-medium ${test.daysUntilClose !== undefined ? getCloseDateColor(test.daysUntilClose) : 'text-gray-600'}`}>
                        {test.closeDate}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {!test.isSubmited ? (
                          <button 
                            onClick={() => router.push(`/student/test/${test.id}`)}
                            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs px-4 py-2 rounded-lg transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 font-medium"
                          > 
                            Làm bài
                          </button>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-gray-700 font-medium">Đã nộp bài</span>
                            </div>
                            {test.isGraded && (
                              <>
                                <button 
                                  onClick={() => router.push(`/student/test/grading/${test.id}`)}
                                  className="bg-green-50 text-green-700 text-xs px-4 py-2 rounded-lg hover:bg-green-100 transition-all duration-200 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium flex items-center justify-center gap-1"
                                > 
                                  <Award className="w-3 h-3" />
                                  Xem điểm
                                </button>
                                <div className="flex items-center gap-1 text-xs text-green-600 font-medium justify-center">
                                  <CheckCircle className="w-3 h-3" />
                                  Đã chấm điểm
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#2563EB] border-2 border-[#2563EB] hover:bg-[#2563EB] hover:text-white shadow-sm'
            }`}
          >
            ← Trước
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
              // Show first page, last page, current page, and pages around current
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`min-w-[40px] h-10 rounded-lg font-bold text-sm transition-all duration-200 ${
                      currentPage === pageNumber
                        ? 'bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white shadow-lg scale-110'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#2563EB] hover:text-[#2563EB] shadow-sm'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="text-gray-400 font-bold">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#2563EB] border-2 border-[#2563EB] hover:bg-[#2563EB] hover:text-white shadow-sm'
            }`}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTestsTab;
