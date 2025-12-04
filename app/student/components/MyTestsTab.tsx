'use client';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { getStudentClassTest } from '../../student/api/test';
import { useRouter } from 'next/navigation';
const MyTestsTab = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentClassTest();
        
        // Map the response data to the expected format
        const mappedTests = response.map((test: any) => {
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
      } catch (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  const getStatusBadge = (status: string, daysUntilClose?: number) => {
    switch (status) {
      case 'Submitted':
        return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Đã nộp</span>;
      case 'Submitted Late':
        return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full"><AlertCircle className="w-3 h-3" /> Nộp trễ</span>;
      case 'Overdue':
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Bài kiểm tra của tôi</h2>
        <p className="text-gray-600 mt-1">Theo dõi các bài kiểm tra và điểm số của bạn</p>
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
              ) : tests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Không có bài kiểm tra nào
                  </td>
                </tr>
              ) : (
                tests.map((test) => (
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
                      {getStatusBadge(test.status, test.daysUntilClose)}
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
                      <button 
                        onClick={() => router.push(`/student/test/${test.id}`)}
                        className="bg-blue-100 text-blue-600 text-xs px-3 py-1.5 rounded-full hover:bg-blue-200"
                      >
                        {test.isSubmited ? 'Xem kết quả' : 'Làm bài'}
                      </button>
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
