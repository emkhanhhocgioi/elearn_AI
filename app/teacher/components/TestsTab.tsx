'use client';
import { Plus, Edit, Clock, X, ChevronLeft, BarChart3, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSubjectClass } from '@/app/teacher/api/class';
import { createTest, getClassTeacherTest } from '@/app/api/test';

export default function TestsTab() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjectClassIds, setSubjectClassIds] = useState<string[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
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
        // Map the full class objects
        setClasses(response.data.data);
        // Extract just the IDs for filtering
        const classIds = response.data.data.map((classItem: any) => classItem._id);
        setSubjectClassIds(classIds);
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



  const handleSelectClass = (classItem: any) => {
    setSelectedClass(classItem);
    setFormData({
      testtitle: '',
      participants: '',
      closedDate: '',
      subject: ''
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
  const filteredTests = tests.filter((test: any) => 
    subjectClassIds.includes(test.classID)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Subject Classes</h2>
            <p className="text-gray-600 text-sm mt-1">Manage tests for classes you're teaching</p>
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
                      <p className="text-gray-500 text-sm mt-1">Choose a class you're teaching to create a test</p>
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

                  {classes.length > 0 ? (
                    <div className="space-y-3">
                      {classes.map((classItem) => (
                        <button
                          key={classItem._id}
                          onClick={() => handleSelectClass(classItem)}
                          className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition group hover:shadow-md"
                        >
                          <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                            {classItem.class_code || 'Unnamed Class'}
                          </p>
                          {classItem.class_year && (
                            <p className="text-sm text-gray-600 mt-1">📅 Year: {classItem.class_year}</p>
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
                          {selectedClass.class_code || 'Selected Class'}
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

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <div
                key={classItem._id}
                onClick={() => router.push(`/teacher/class/${classItem._id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 h-32 flex items-center justify-center relative">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-bold mb-1">{classItem.class_code}</h3>
                    <p className="text-purple-100 text-sm">{classItem.class_year}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-xs font-semibold">Active</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Total Tests
                      </span>
                      <span className="font-bold text-gray-900">
                        {filteredTests.filter((test: any) => test.classID === classItem._id).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Active Tests
                      </span>
                      <span className="font-bold text-green-600">
                        {filteredTests.filter((test: any) => test.classID === classItem._id && test.status === 'ongoing').length}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-purple-50 text-purple-600 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition group-hover:bg-purple-100">
                    View Class Details →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No classes available</p>
              <p className="text-gray-400 text-sm mt-2">You are not assigned to any subject classes yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
