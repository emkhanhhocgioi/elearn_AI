'use client';
import { Plus, Edit, Trash2, Clock, Users } from 'lucide-react';

const lessonsData = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    course: "Frontend Development",
    duration: "45 min",
    students: 24,
    status: "Published",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Advanced State Management",
    course: "Frontend Development",
    duration: "60 min",
    students: 24,
    status: "Draft",
    date: "2024-01-20"
  },
  {
    id: 3,
    title: "API Integration Best Practices",
    course: "Backend Development",
    duration: "50 min",
    students: 18,
    status: "Published",
    date: "2024-01-18"
  }
];

export default function LessonsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Lessons</h2>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lesson Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lessonsData.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                    <p className="text-xs text-gray-500">{lesson.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{lesson.course}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {lesson.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {lesson.students}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      lesson.status === 'Published' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {lesson.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
