'use client';
import { useState, useEffect } from 'react';
import { Users, Calendar, BookOpen, Trash2 } from 'lucide-react';

const MyClassesTab = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch student's classes from API
    const mockClasses = [
      {
        id: 1,
        name: "Frontend Development Batch 2024",
        teacher: "John Doe",
        students: 24,
        lessons: 12,
        progress: 65,
        schedule: "Mon, Wed, Fri - 10:00 AM",
        status: "Active"
      },
      {
        id: 2,
        name: "Backend Development Advanced",
        teacher: "Jane Smith",
        students: 18,
        lessons: 15,
        progress: 45,
        schedule: "Tue, Thu - 2:00 PM",
        status: "Active"
      },
      {
        id: 3,
        name: "Full Stack Development",
        teacher: "Mike Johnson",
        students: 30,
        lessons: 20,
        progress: 30,
        schedule: "Daily - 6:00 PM",
        status: "Active"
      }
    ];

    setClasses(mockClasses);
    setIsLoading(false);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
        <p className="text-gray-600 mt-1">Your enrolled classes and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Loading classes...
          </div>
        ) : classes.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No classes enrolled yet</p>
          </div>
        ) : (
          classes.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 h-32 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white opacity-50" />
              </div>
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="font-bold text-gray-900 mb-1">{classItem.name}</h3>
                  <p className="text-sm text-gray-500">Teacher: {classItem.teacher}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">{classItem.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${classItem.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{classItem.students} students</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{classItem.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 col-span-2">
                    <Calendar className="w-4 h-4" />
                    <span>{classItem.schedule}</span>
                  </div>
                </div>

                <button className="w-full bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-200">
                  View Class
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyClassesTab;
