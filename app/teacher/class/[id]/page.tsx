'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Clock, Users, Calendar, FileText, BarChart3, BookOpen, Mail, X } from 'lucide-react';
import {getClassTeacherTest,deleteTestById} from '../../api/test';
import {getTeacherLessons, deleteLesson} from '../../api/lesson';
import { sendEmailToSubjectClass } from '../../api/mailing';
import { useSearchParams } from 'next/navigation';
import { get } from 'http';
export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = params.id as string;
  const subject = searchParams.get('subject') || '';

  const [activeTab, setActiveTab] = useState<'tests' | 'lessons'>('tests');
  
  const [classInfo, setClassInfo] = useState({
    class_code: 'A-2025-2029',
    class_year: '2025-2029',
    _id: classId
  });

  const [lessons, setLessons] = useState<any[]>([]);
  
  // Email dialog states
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Filter and search states for tests
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'status' | 'closeDate' | 'createDate'>('closeDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [tests, setTests] = useState([
    {
      _id: '1',
      testtitle: 'Midterm Exam - Mathematics',
      participants: 30,
      submittedCount: 15,
      status: 'ongoing',
      closeDate: '2025-12-15T23:59:00',
      avg_score: 75,
      questions_count: 20,
      createDate: '2025-11-01T10:00:00'
    },
    {
      _id: '2',
      testtitle: 'Quiz - Algebra Basics',
      participants: 30,
      submittedCount: 28,
      status: 'closed',
      closeDate: '2025-11-30T23:59:00',
      avg_score: 82,
      questions_count: 10,
      createDate: '2025-11-10T10:00:00'
    },
    {
      _id: '3',
      testtitle: 'Final Exam - Geometry',
      participants: 30,
      submittedCount: 0,
      status: 'upcoming',
      closeDate: '2025-12-25T23:59:00',
      avg_score: 0,
      questions_count: 25,
      createDate: '2025-11-15T10:00:00'
    }
  ]);
   


  
  useEffect(() => {
    console.log("subject param:", subject);
    async function fetchTests() {
      try {
        const response = await getClassTeacherTest(classId);
        console.log('Fetched tests:', response.tests);
        if (response?.tests) {
          setTests(response.tests || []);
        } else {
          console.error('Failed to fetch tests:', response.data?.message || 'Unknown error');
          setTests([]);
        }   
      } catch (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      } 
    }
    
    async function fetchLessons() {
      try {
        const response = await getTeacherLessons(classId);
        console.log('Fetched lessons:', response);
        
        setLessons(response.lessons || []);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setLessons([]);
      }
    }
    
    fetchTests();
    fetchLessons();
  }, [classId]);

  // Filter and sort tests
  const filteredAndSortedTests = tests
    .filter(test => 
      test.testtitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === 'status') {
        const statusOrder = { 'open': 1, 'ongoing': 1, 'closed': 2 };
        const aStatus = a.status === 'open' || a.status === 'ongoing' ? 'open' : 'closed';
        const bStatus = b.status === 'open' || b.status === 'ongoing' ? 'open' : 'closed';
        compareValue = (statusOrder[aStatus as keyof typeof statusOrder] || 0) - (statusOrder[bStatus as keyof typeof statusOrder] || 0);
      } else if (sortBy === 'closeDate') {
        compareValue = new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
      } else if (sortBy === 'createDate') {
        compareValue = new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/teacher/dashboard')}
                className="p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 group"
                aria-label="trở về bảng điều khiển"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#2563EB] transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 leading-tight">{classInfo.class_code}</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-600">Năm học: {classInfo.class_year}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => setEmailDialogOpen(true)}
                className="bg-green-600 text-white px-4 sm:px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Mail className="w-5 h-5" />
                <span className="hidden sm:inline">Gửi Email</span>
              </button>
              {activeTab === 'lessons' ? (
                <button 
                  onClick={() => router.push(`/teacher/class/${classId}/add-lesson?subject=${subject}`)}
                  className="bg-purple-600 text-white px-4 sm:px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Thêm bài học</span>
                  <span className="sm:hidden">Thêm</span>
                </button>
              ) : (
                <button 
                  onClick={() => router.push(`/teacher/class/${classId}/add-test/?subject=${subject}`)}
                  className="bg-blue-600 text-white px-4 sm:px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Tạo bài kiểm tra</span>
                  <span className="sm:hidden">Tạo</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 sm:gap-6 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('tests')}
              className={`pb-3 px-3 font-semibold transition-all duration-200 relative ${
                activeTab === 'tests'
                  ? 'text-[#2563EB] border-b-3 border-[#2563EB]'
                  : 'text-gray-500 hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Tests ({tests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`pb-3 px-2 font-semibold transition-all ${
                activeTab === 'lessons'
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                  : 'text-gray-500 hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Lessons ({lessons.length})</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'tests' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1.5 font-medium">Tổng số bài kiểm tra</p>
                    <p className="text-3xl font-bold text-[#0F172A]">{tests.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-[#2563EB]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1.5 font-medium">Đang diễn ra</p>
                    <p className="text-3xl font-bold text-green-600">
                      {tests.filter(t => {
                        const closeDate = new Date(t.closeDate);
                        const now = new Date();
                        return (t.status === 'open' || t.status === 'ongoing') && closeDate > now;
                      }).length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1.5 font-medium">Sắp hết hạn</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {tests.filter(t => {
                        const closeDate = new Date(t.closeDate);
                        const now = new Date();
                        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
                        return (t.status === 'open' || t.status === 'ongoing') && closeDate > now && closeDate <= threeDaysFromNow;
                      }).length}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1.5 font-medium">Đã hết hạn</p>
                    <p className="text-3xl font-bold text-red-600">
                      {tests.filter(t => {
                        const closeDate = new Date(t.closeDate);
                        const now = new Date();
                        return t.status === 'closed' || closeDate < now;
                      }).length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1.5 font-medium">Total Lessons</p>
                    <p className="text-3xl font-bold text-[#0F172A]">{lessons.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-[#2563EB]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1.5 font-medium">Đã xuất bản</p>
                    <p className="text-3xl font-bold text-green-600">
                      {lessons.filter(l => l.status === 'published').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1.5 font-medium">Bản nháp</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {lessons.filter(l => l.status === 'draft').length}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Edit2 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tests List */}
        {activeTab === 'tests' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] leading-tight">Quản lý Bài kiểm tra</h2>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">Tạo, chỉnh sửa và quản lý các bài kiểm tra cho lớp học</p>
                </div>
              </div>
              
              {/* Search and Filter Section */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm bài kiểm tra..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition bg-white text-[#0F172A] placeholder:text-gray-400"
                    />
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'status' | 'closeDate' | 'createDate')}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition bg-white text-[#0F172A] font-medium"
                  >
                    <option value="closeDate">Hạn nộp</option>
                    <option value="createDate">Ngày tạo</option>
                    <option value="status">Trạng thái</option>
                  </select>

                  {/* Sort Order Button */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1 bg-white"
                    aria-label="Toggle sort order"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên bài kiểm tra</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bài nộp</th>
                
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hạn nộp</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedTests.length > 0 ? (
                    filteredAndSortedTests.map((test) => (
                      <tr 
                        key={test._id} 
                        onClick={() => router.push(`/teacher/class/test/${test._id}/?subject=${subject}`)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-[#0F172A] leading-relaxed">{test.testtitle}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <FileText className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{test.questions_count} questions</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            test.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            test.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {test.status}
                          </span>
                        </td>
                      
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#0F172A]">{test.submittedCount}</span>
                          
                         
                          </div>
                        </td>
                     
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(test.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                          
                            <button 
                              onClick={async (e) => {
                                 if (confirm('Are you sure you want to delete this lesson?')) {
                                  try {
                                    await deleteTestById(test._id);
                                    setTests(tests.filter(t => t._id !== test._id));
                                  } catch (error) {
                                    console.error('Error deleting lesson:', error);
                                    alert('Failed to delete lesson');
                                  }
                                }
                                
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                              aria-label="Delete test"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="w-16 h-16 text-gray-300 mb-4" />
                          {searchQuery ? (
                            <>
                              <p className="text-gray-500 text-lg font-semibold">Không tìm thấy bài kiểm tra nào</p>
                              <p className="text-gray-400 text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
                            </>
                          ) : (
                            <>
                              <p className="text-gray-500 text-lg font-semibold">Chưa có bài kiểm tra nào dành cho lớp này</p>
                              <p className="text-gray-400 text-sm mt-2">Nhấn "Create Test" để tạo bài kiểm tra đầu tiên</p>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lessons List */}
        {activeTab === 'lessons' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-[#0F172A] leading-tight">Quản lý Bài học</h2>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">Tạo, chỉnh sửa và quản lý các bài học cho lớp học</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên bài học</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Môn học</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tệp</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                      <tr 
                        key={lesson._id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/teacher/class/lesson/${lesson._id}`)}
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-[#0F172A] leading-relaxed">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <BookOpen className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Lesson #{lesson._id?.slice(-6)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{lesson.subject || subject}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            lesson.status === 'published' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {lesson.status || 'draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {lesson.lessonMetadata ? (
                            <a 
                              href={lesson.lessonMetadata} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#2563EB] hover:text-blue-700 flex items-center gap-1.5 hover:underline transition-colors focus:outline-none focus:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">View File</span>
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">No file</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {lesson.createDate ? new Date(lesson.createDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/teacher/class/lesson/${lesson._id}`);
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-600 hover:text-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1"
                              aria-label="Edit lesson"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this lesson?')) {
                                  try {
                                    await deleteLesson(lesson._id);
                                    setLessons(lessons.filter(l => l._id !== lesson._id));
                                  } catch (error) {
                                    console.error('Error deleting lesson:', error);
                                    alert('Failed to delete lesson');
                                  }
                                }
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                              aria-label="Delete lesson"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg font-semibold">Chưa có bài học nào cho lớp này</p>
                          <p className="text-gray-400 text-sm mt-2">Nhấn "Add Lesson" để tạo bài học đầu tiên</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Email Dialog */}
      {emailDialogOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A] leading-tight">Send Email to Class</h2>
                  <p className="text-sm text-gray-600 mt-1">Send message to all students in {classInfo.class_code}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEmailDialogOpen(false);
                  setEmailSubject('');
                  setEmailMessage('');
                }}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Subject Input */}
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Email Subject *
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white text-[#0F172A] placeholder:text-gray-400"
                  disabled={sendingEmail}
                />
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Message *
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none bg-white text-[#0F172A] placeholder:text-gray-400 leading-relaxed"
                  disabled={sendingEmail}
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-[#2563EB] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#2563EB] mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Recipients</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">This email will be sent to all students enrolled in class {classInfo.class_code} for subject {subject}.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-xl">
              <button
                onClick={() => {
                  setEmailDialogOpen(false);
                  setEmailSubject('');
                  setEmailMessage('');
                }}
                className="px-6 py-2.5 border-2 border-gray-300 text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!emailSubject.trim() || !emailMessage.trim()) {
                    alert('Please fill in both subject and message');
                    return;
                  }
                  
                  if (!subject) {
                    alert('Subject information is missing');
                    return;
                  }

                  try {
                    setSendingEmail(true);
                    await sendEmailToSubjectClass({
                      classId: classId,
                      subjectId: subject,
                      subject: emailSubject,
                      message: emailMessage
                    });
                    alert('Email sent successfully!');
                    setEmailDialogOpen(false);
                    setEmailSubject('');
                    setEmailMessage('');
                  } catch (error) {
                    console.error('Error sending email:', error);
                    alert('Failed to send email. Please try again.');
                  } finally {
                    setSendingEmail(false);
                  }
                }}
                disabled={sendingEmail || !emailSubject.trim() || !emailMessage.trim()}
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                {sendingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}