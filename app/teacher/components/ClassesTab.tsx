'use client';
import { useState, useEffect } from 'react';
import { Users, Trash2 } from 'lucide-react';
import { getTeacherClasses, deleteClass } from '@/app/api/class';
import EnrollStudent from './EnrollStudent';

export default function ClassesTab() {
  const [classes, setClasses] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      try {
        setFetchLoading(true);
        const response = await getTeacherClasses();
        console.log('Teacher Classes Response:', response);
        // Extract the classes array from nested data structure
        const classesData = response?.data?.data || [];
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching teacher classes:', error);
        setClasses([]);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTeacherClasses();
  }, []);

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lớp này?')) {
      return;
    }

    setDeleteLoading(classId);
    try {
      await deleteClass(classId);
      alert('Xóa lớp học thành công!');
      // Refresh classes list
      const response = await getTeacherClasses();
      const classesData = response?.data?.data || [];
      setClasses(classesData);
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa lớp học');
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fetchLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Loading classes...
          </div>
        ) : classes.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No classes found
          </div>
        ) : (
          classes.map((classItem) => (
            <div key={classItem._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 h-32 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-50" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{classItem.class_code}</h3>
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Students</span>
                    <span className="font-medium text-gray-900">{classItem.class_student_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Average Grade</span>
                    <span className="font-medium text-gray-900">{classItem.class_avarage_grade}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-100 text-purple-600 py-2 rounded-lg text-sm font-medium hover:bg-purple-200">
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDeleteClass(classItem._id)}
                    disabled={deleteLoading === classItem._id}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600 hover:text-red-700"
                    title="Xóa lớp"
                  >
                    {deleteLoading === classItem._id ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <EnrollStudent 
                  classCode={classItem.class_code}
                  onSuccess={() => {
                    const response = getTeacherClasses();
                    response.then((res) => {
                      const classesData = res?.data?.data || [];
                      setClasses(classesData);
                    });
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}