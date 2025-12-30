'use client';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Filter, Calendar, ChevronRight } from 'lucide-react';
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
  isSubmited: boolean;
  isSubmitedTime: string;
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
          
          // Determine status based on isSubmited and closeDate
          let status = 'Upcoming';
          let isLateSubmission = false;
          
          if (test.isSubmited) {
            // Check if submitted on time
            const submitTime = new Date(test.isSubmitedTime);
            isLateSubmission = submitTime > closeDate;
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
            isSubmited: test.isSubmited,
            isLateSubmission: isLateSubmission
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Bài tập của tôi</h2>
        <p className="text-gray-600 mt-1">Theo dõi các bài tập và điểm số của bạn</p>
      </div>

      {/* Timeline Section */}
      {getUpcomingTests().length > 0 && (
        <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bài tập sắp hết hạn</h3>
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
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full ${getTimelineColor(test.daysUntilClose)} flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{test.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{test.subject}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Hạn nộp: {test.closeDate}
                          </span>
                        </div>
                      </div>
                      
                      {/* Days remaining badge */}
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          test.daysUntilClose <= 1 ? 'bg-red-100 text-red-700' :
                          test.daysUntilClose <= 3 ? 'bg-orange-100 text-orange-700' :
                          test.daysUntilClose <= 7 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {test.daysUntilClose === 0 ? 'Hôm nay' :
                           test.daysUntilClose === 1 ? 'Ngày mai' :
                           `Còn ${test.daysUntilClose} ngày`}
                        </div>
                        
                        <button
                          onClick={() => router.push(`/student/test/${test.id}`)}
                          className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
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
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Lọc theo môn:</span>
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {THCS_SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            Hiển thị {filteredTests.length} / {tests.length} bài kiểm tra
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Môn học</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Học viên</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Điểm TB</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hạn nộp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {selectedSubject === 'Tất cả môn' 
                      ? 'Không có bài kiểm tra nào' 
                      : `Không có bài kiểm tra môn ${selectedSubject}`}
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{test.title}</p>
                      {test.daysUntilClose !== undefined && test.daysUntilClose >= 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          Còn {test.daysUntilClose} ngày
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{test.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{test.participants} học viên</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(test.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
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
                      <p className={`text-sm ${test.daysUntilClose !== undefined ? getCloseDateColor(test.daysUntilClose) : 'text-gray-600'}`}>
                        {test.closeDate}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {
                        test.isSubmited === false  && (
                           <button 
                        onClick={() => router.push(`/student/test/${test.id}`)}
                        className="bg-blue-100 text-blue-600 text-xs px-3 py-1.5 rounded-full hover:bg-blue-200"
                      > 
                        Làm bài
                      </button>
                        ) 
                      }
                      {
                        test.isSubmited === true  && (
                           <button 
                        onClick={() => router.push(`/student/test/grading/${test.id}`)}
                        className="bg-green-100 text-green-600 text-xs px-3 py-1.5 rounded-full hover:bg-green-200"
                      > 
                        Xem kết quả
                      </button>
                        ) 
                      }


                     
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyTestsTab;
