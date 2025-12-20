'use client';
import { Plus, Edit, Trash2, Clock, FileText, ArrowUpDown } from 'lucide-react';
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
        <h2 className="text-2xl font-bold text-gray-900">My Lessons ({lessons.length})</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
          <Plus className="w-4 h-4" />
          Create New Lesson
        </button>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Lesson Title
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('subject')}
                >
                  <div className="flex items-center gap-2">
                    Subject
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">File Type</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createDate')}
                >
                  <div className="flex items-center gap-2">
                    Created Date
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Material</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedLessons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No lessons found. Create your first lesson!
                  </td>
                </tr>
              ) : (
                sortedLessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{lesson.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        {lesson.fileType ? lesson.fileType.split('/')[1]?.toUpperCase() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500">{formatDate(lesson.createDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {lesson.lessonMetadata && (
                        <a 
                          href={lesson.lessonMetadata} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-purple-600 hover:text-purple-700 underline"
                        >
                          View Material
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit lesson"
                          onClick={() => {
                            // TODO: Implement edit functionality (navigate to edit page or open modal)
                            console.log('Edit lesson:', lesson._id);
                          }}
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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