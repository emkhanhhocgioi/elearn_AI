'use client';
import { Plus, Edit, Trash2, FileText, ArrowUpDown } from 'lucide-react';
import { getTeacherLessons, deleteLesson } from '@/app/teacher/api/lesson';
import { useEffect, useState } from 'react';

interface Lesson {
  _id: string;
  title: string;
  classId: string;
  teacherId: string;
  subject: string;
  lessonMetadata: string;
  fileType?: string;
  createDate: string;
  __v: number;
}

type SortField = 'title' | 'subject' | 'createDate';
type SortOrder = 'asc' | 'desc';

export default function LessonsTab() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('createDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    try {
      setLoading(true);
      const response = await getTeacherLessons();
      console.log(response);
      if (response.lessons) {
        setLessons(response.lessons);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(lessonId: string) {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }
    
    try {
      await deleteLesson(lessonId);
      setLessons(lessons.filter(lesson => lesson._id !== lessonId));
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      alert('Failed to delete lesson. Please try again.');
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  const sortedLessons = [...lessons].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'createDate') {
      aValue = new Date(a.createDate).getTime().toString();
      bValue = new Date(b.createDate).getTime().toString();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading lessons...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] leading-tight">My Lessons</h2>
          <p className="text-sm text-gray-500 mt-1">{lessons.length} total lessons</p>
        </div>
       
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F1F5F9] border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Lesson Title
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort('subject')}
                >
                  <div className="flex items-center gap-2">
                    Subject
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">File Type</th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort('createDate')}
                >
                  <div className="flex items-center gap-2">
                    Created Date
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Material</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedLessons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No lessons found. Create your first lesson!</p>
                  </td>
                </tr>
              ) : (
                sortedLessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-[#F1F5F9] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#0F172A] leading-relaxed">{lesson.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-[#2563EB]">{lesson.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        {lesson.fileType ? lesson.fileType.split('/')[1]?.toUpperCase() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">{formatDate(lesson.createDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {lesson.lessonMetadata && (
                        <a 
                          href={lesson.lessonMetadata} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-[#2563EB] hover:text-blue-700 hover:underline transition-colors focus:outline-none focus:underline"
                        >
                          View Material
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1"
                          title="Edit lesson"
                          onClick={() => {
                            // TODO: Implement edit functionality (navigate to edit page or open modal)
                            console.log('Edit lesson:', lesson._id);
                          }}
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          title="Delete lesson"
                          onClick={() => handleDelete(lesson._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
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
}