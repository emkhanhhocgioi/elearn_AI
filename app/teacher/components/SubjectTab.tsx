'use client';
import { Plus, Edit, Clock, X, ChevronLeft, BarChart3, FileText } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTeacherClasses, getSubjectClass } from '@/app/teacher/api/class';
import { createTest, getClassTeacherTest } from '@/app/api/test';

interface ClassItem {
  _id: string;
  class_name?: string;
  class_code?: string;
  class_subject?: string;
  description?: string;
  student_count?: number;
}

interface TestItem {
  _id: string;
  testtitle: string;
  classID: string;
  participants: number;
  status: string;
  avg_score: string;
  closeDate: string;
}

export default function SubjectTab() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjectClassIds, setSubjectClassIds] = useState<string[]>([]);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [formData, setFormData] = useState({
    testtitle: '',
    participants: '',
    closedDate: '',
    subject: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  
  const fetchTeacherTests = async () => {
    try {
      const response = await getClassTeacherTest();
      if (response?.data?.data) {
        setTests(response.data.data);
      }
      console.log('Teacher Tests:', response);
    } catch (err) {
      console.error('Error fetching teacher tests:', err);
    }
  };

  const fetchSubjectClasses = async () => {
    try {
      const response = await getSubjectClass();
      console.log('Subject Classes Response:', response);
      if (response?.data?.data) {
        setSubjectClassIds(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching subject classes:', err);
    }
  };

  // Fetch teacher tests and subject classes on component mount
  useEffect(() => {
    fetchSubjectClasses();
    fetchTeacherTests();
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTeacherClasses();
      const allClasses = data.data.data || [];
      
      // Filter classes to show only those the teacher is teaching (subject classes)
      const filteredClasses = allClasses.filter((classItem: ClassItem) => 
        subjectClassIds.includes(classItem._id)
      );
      
      setClasses(filteredClasses);
      setError('');
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [subjectClassIds]);

  useEffect(() => {
    if (showDialog && classes.length === 0) {
      fetchClasses();
    }
  }, [showDialog, classes.length, fetchClasses]);

  const handleSelectClass = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setFormData({
      testtitle: '',
      participants: '',
      closedDate: '',
      subject: classItem.class_subject || ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.testtitle || !formData.participants || !formData.closedDate) {
      setError('Please fill in all fields');
      return;
    }

    if (!selectedClass) {
      setError('No class selected');
      return;
    }

    try {
      setLoading(true);
      await createTest(
        selectedClass._id,
        formData.testtitle,
        parseInt(formData.participants),
        formData.closedDate,
        formData.subject
      );
      setSuccess('Test created successfully!');
      setTimeout(() => {
        setShowDialog(false);
        setSelectedClass(null);
        setSuccess('');
        fetchTeacherTests(); // Refresh tests list
      }, 1500);
    } catch (err) {
      setError('Failed to create test');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedClass(null);
    setError('');
    setSuccess('');
  };

  // Filter tests to show only those for classes the teacher is teaching
  const filteredTests = tests.filter((test: TestItem) => 
    subjectClassIds.includes(test.classID)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Subject Classes</h2>
            <p className="text-gray-600 text-sm mt-1">Manage tests for classes you&apos;re teaching</p>
          </div>
          <button 
            onClick={() => setShowDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-purple-800 transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Create New Test</span>
          </button>
        </div>

        {/* Dialog */}
        {showDialog && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {!selectedClass ? (
                // Class Selection Screen
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Select a Class</h3>
                      <p className="text-gray-500 text-sm mt-1">Choose a class you&apos;re teaching to create a test</p>
                    </div>
                    <button
                      onClick={handleCloseDialog}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                      <span className="text-xl">⚠️</span>
                      {error}
                    </div>
                  )}

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600"></div>
                    </div>
                  ) : classes.length > 0 ? (
                    <div className="space-y-3">
                      {classes.map((classItem) => (
                        <button
                          key={classItem._id}
                          onClick={() => handleSelectClass(classItem)}
                          className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition group hover:shadow-md"
                        >
                          <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                            {classItem.class_name || classItem.class_code || 'Unnamed Class'}
                          </p>
                          {classItem.class_subject && (
                            <p className="text-sm text-purple-600 mt-1 font-medium">📚 {classItem.class_subject}</p>
                          )}
                          {classItem.description && (
                            <p className="text-sm text-gray-600 mt-1">{classItem.description}</p>
                          )}
                          {classItem.student_count && (
                            <p className="text-xs text-gray-500 mt-1">
                              👥 {classItem.student_count} students
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No classes available</p>
                      <p className="text-gray-400 text-sm mt-2">You are not assigned to any subject classes yet</p>
                    </div>
                  )}
                </div>
              ) : (
                // Test Form Screen
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedClass(null)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                      </button>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Create Test</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedClass.class_name || selectedClass.class_code || 'Selected Class'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseDialog}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                      <span className="text-xl">⚠️</span>
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-2">
                      <span className="text-xl">✅</span>
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Test Title
                      </label>
                      <input
                        type="text"
                        name="testtitle"
                        value={formData.testtitle}
                        onChange={handleInputChange}
                        placeholder="Enter test title"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition hover:border-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Participants
                      </label>
                      <input
                        type="number"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        placeholder="Enter number of participants"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition hover:border-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="datetime-local"
                        name="closedDate"
                        value={formData.closedDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition hover:border-gray-400"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-6">
                      <button
                        type="button"
                        onClick={() => setSelectedClass(null)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creating...' : 'Create Test'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-purple-100 border-b-2 border-purple-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Test Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Submissions</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Avg Score</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTests && filteredTests.length > 0 ? (
                  filteredTests.map((test: TestItem) => (
                    <tr key={test._id} className="hover:bg-purple-50/50 transition">
                      <td className="px-6 py-4 cursor-pointer hover:text-purple-600 transition" onClick={() => router.push(`/teacher/test/${test._id}`)}>
                        <p className="text-sm font-semibold text-gray-900">{test.testtitle}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <Clock className="w-3 h-3" />
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            test.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                            test.status === 'closed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{test.classID}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-gray-400" />
                          -
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">0/{test.participants}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all"
                              style={{ width: '0%' }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${parseInt(test.avg_score) > 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                          {parseInt(test.avg_score) > 0 ? `${test.avg_score}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(test.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="bg-gradient-to-r from-green-100 to-green-50 text-green-600 text-xs px-3 py-2 rounded-lg hover:from-green-200 hover:to-green-100 transition font-semibold flex items-center gap-1 hover:shadow-md">
                            <BarChart3 className="w-3 h-3" />
                            Grade
                          </button>
                          <button onClick={() => router.push(`/teacher/test/${test._id}`)} className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600 hover:text-purple-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-lg">No tests created yet</p>
                      <p className="text-gray-400 text-sm mt-2">Create a test for your subject classes</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
