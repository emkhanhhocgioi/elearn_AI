'use client';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const MyTestsTab = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch student's tests from API
    const mockTests = [
      {
        id: 1,
        title: "React Fundamentals Quiz",
        class: "Frontend Development Batch 2024",
        questions: 20,
        duration: "30 min",
        status: "Submitted",
        score: 85,
        dueDate: "2024-01-25",
        submittedDate: "2024-01-24"
      },
      {
        id: 2,
        title: "Node.js Midterm Exam",
        class: "Backend Development Advanced",
        questions: 30,
        duration: "60 min",
        status: "Pending",
        score: null,
        dueDate: "2024-01-28",
        submittedDate: null
      },
      {
        id: 3,
        title: "Database Design Assignment",
        class: "Full Stack Development",
        questions: 15,
        duration: "45 min",
        status: "Upcoming",
        score: null,
        dueDate: "2024-02-05",
        submittedDate: null
      }
    ];

    setTests(mockTests);
    setIsLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Submitted</span>;
      case 'Pending':
        return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full"><AlertCircle className="w-3 h-3" /> Pending</span>;
      case 'Upcoming':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"><Clock className="w-3 h-3" /> Upcoming</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Tests & Assignments</h2>
        <p className="text-gray-600 mt-1">Track your test submissions and scores</p>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Test Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Questions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading tests...
                  </td>
                </tr>
              ) : tests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No tests found
                  </td>
                </tr>
              ) : (
                tests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{test.title}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {test.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{test.class}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{test.questions} questions</p>
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
                      <p className="text-sm text-gray-600">{test.dueDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button className="bg-blue-100 text-blue-600 text-xs px-3 py-1.5 rounded-full hover:bg-blue-200">
                        {test.status === 'Submitted' ? 'View Results' : 'Take Test'}
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
