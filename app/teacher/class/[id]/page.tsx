'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Clock, Users, Calendar, FileText, BarChart3, BookOpen } from 'lucide-react';
import {getClassTeacherTest,deleteTestById} from '../../api/test';
import {getTeacherLessons, deleteLesson} from '../../api/lesson';
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

  const [tests, setTests] = useState([
    {
      _id: '1',
      testtitle: 'Midterm Exam - Mathematics',
      participants: 30,
      submittedCount: 15,
      status: 'ongoing',
      closeDate: '2025-12-15T23:59:00',
      avg_score: 75,
      questions_count: 20
    },
    {
      _id: '2',
      testtitle: 'Quiz - Algebra Basics',
      participants: 30,
      submittedCount: 28,
      status: 'closed',
      closeDate: '2025-11-30T23:59:00',
      avg_score: 82,
      questions_count: 10
    },
    {
      _id: '3',
      testtitle: 'Final Exam - Geometry',
      participants: 30,
      submittedCount: 0,
      status: 'upcoming',
      closeDate: '2025-12-25T23:59:00',
      avg_score: 0,
      questions_count: 25
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{classInfo.class_code}</h1>
                <p className="text-sm text-gray-500">Year: {classInfo.class_year}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'lessons' ? (
                <button 
                  onClick={() => router.push(`/teacher/class/${classId}/add-lesson?subject=${subject}`)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Add Lesson</span>
                </button>
              ) : (
                <button 
                  onClick={() => router.push(`/teacher/class/${classId}/add-test/?subject=${subject}`)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-purple-800 transition shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Create Test</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('tests')}
              className={`pb-3 px-4 font-semibold transition-all ${
                activeTab === 'tests'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Tests ({tests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`pb-3 px-4 font-semibold transition-all ${
                activeTab === 'lessons'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Tests</p>
                    <p className="text-3xl font-bold text-gray-900">{tests.length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Active Tests</p>
                    <p className="text-3xl font-bold text-green-600">
                      {tests.filter(t => t.status === 'ongoing').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Avg Completion</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {tests.length > 0 && tests.reduce((acc, t) => acc + t.participants, 0) > 0
                        ? Math.round((tests.reduce((acc, t) => acc + t.submittedCount, 0) / tests.reduce((acc, t) => acc + t.participants, 0)) * 100)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Avg Score</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {tests.length > 0 ? Math.round(tests.reduce((acc, t) => acc + t.avg_score, 0) / tests.length) : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Lessons</p>
                    <p className="text-3xl font-bold text-gray-900">{lessons.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Published</p>
                    <p className="text-3xl font-bold text-green-600">
                      {lessons.filter(l => l.status === 'published').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Draft</p>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Tests Management</h2>
              <p className="text-sm text-gray-500 mt-1">Create, edit, and manage tests for this class</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-purple-100 border-b-2 border-purple-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Test Title</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Status</th>
                  
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Submissions</th>
                
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tests.length > 0 ? (
                    tests.map((test) => (
                      <tr 
                        key={test._id} 
                        onClick={() => router.push(`/teacher/class/test/${test._id}/?subject=${subject}`)}
                        className="hover:bg-purple-50/50 transition cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{test.testtitle}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <FileText className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{test.questions_count} questions</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            test.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            test.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {test.status}
                          </span>
                        </td>
                      
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-900">{test.submittedCount}/{test.participants}</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all"
                                style={{ width: `${test.participants > 0 ? (test.submittedCount / test.participants) * 100 : 0}%` }}
                              ></div>
                            </div>
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
                              className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 hover:text-red-700"
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
                          <p className="text-gray-500 text-lg font-semibold">Chưa có bài kiểm tra nào dành cho lớp này</p>
                          <p className="text-gray-400 text-sm mt-2">Nhấn "Create Test" để tạo bài kiểm tra đầu tiên</p>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Lessons Management</h2>
              <p className="text-sm text-gray-500 mt-1">Create, edit, and manage lessons for this class</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Lesson Title</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">File</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Created Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                      <tr 
                        key={lesson._id} 
                        className="hover:bg-blue-50/50 transition cursor-pointer"
                        onClick={() => router.push(`/teacher/class/lesson/${lesson._id}`)}
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <BookOpen className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Lesson #{lesson._id?.slice(-6)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{lesson.subject || subject}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                              className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600 hover:text-blue-700"
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
                              className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 hover:text-red-700"
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
    </div>
  );
}