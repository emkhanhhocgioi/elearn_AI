'use client';
import { Clock, X, ChevronLeft, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSubjectClass } from '@/app/teacher/api/class';
import { createTest, getClassTeacherTest } from '@/app/api/test';

interface ClassItem {
  classId: string;
  class_code?: string;
  class_year?: string;
  subjects?: string[];
}

interface TestItem {
  classID: string;
  status?: string;
}

interface FormData {
  testtitle: string;
  participants: string;
  closedDate: string;
  subject: string;
}

export default function TestsTab() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjectClassIds, setSubjectClassIds] = useState<string[]>([]);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    testtitle: '',
    participants: '',
    closedDate: '',
    subject: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  
  const fetchTeacherTests = async () => {
    try {
      const response = await getClassTeacherTest( );
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
      console.log('Subject Classes Response:', response.data);
      if (response?.data) {
        // Map the full class objects
        setClasses(response.data);
        // Extract just the IDs for filtering
        const classIds = response.data.map((classItem: ClassItem) => classItem.classId);
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



  const handleSelectClass = (classItem: ClassItem) => {
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

    if (!selectedClass) {
      setError('No class selected');
      return;
    }

      try {
      setLoading(true);
      await createTest(
        selectedClass.classId,
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
    <div className="min-h-screen bg-[#F1F5F9] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] leading-tight">My Subject Classes</h2>
            <p className="text-gray-600 text-sm mt-1.5">Manage tests for classes you're teaching</p>
          </div>
        
        </div>

        {/* Dialog */}
        {showDialog && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {!selectedClass ? (
                // Class Selection Screen
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0F172A] leading-tight">Select a Class</h3>
                      <p className="text-gray-500 text-sm mt-1.5">Choose a class you&apos;re teaching to create a test</p>
                    </div>
                    <button
                      onClick={handleCloseDialog}
                      className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
                      aria-label="Close dialog"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm flex items-start gap-3">
                      <span className="text-xl">⚠️</span>
                      <span className="leading-relaxed">{error}</span>
                    </div>
                  )}

                  {classes.length > 0 ? (
                    <div className="space-y-3">
                      {classes.map((classItem) => (
                        <button
                          key={classItem.classId}
                          onClick={() => handleSelectClass(classItem)}
                          className="w-full text-left p-5 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-[#2563EB] transition-all group focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
                        >
                          <p className="font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-relaxed">
                            {classItem.class_code || 'Unnamed Class'}
                          </p>
                          {classItem.class_year && (
                            <p className="text-sm text-gray-600 mt-1.5">📅 Year: {classItem.class_year}</p>
                          )}
                          {classItem.subjects && classItem.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {classItem.subjects.map((subject: string, idx: number) => (
                                <span key={idx} className="text-xs bg-blue-100 text-[#2563EB] px-2.5 py-1 rounded-md font-medium">
                                  {subject}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-[#F1F5F9] rounded-lg">
                      <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 text-lg font-medium">No classes available</p>
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
                        className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
                        aria-label="Go back"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                      </button>
                      <div>
                        <h3 className="text-2xl font-bold text-[#0F172A] leading-tight">Create Test</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedClass.class_code || 'Selected Class'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseDialog}
                      className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
                      aria-label="Close dialog"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm flex items-start gap-3">
                      <span className="text-xl">⚠️</span>
                      <span className="leading-relaxed">{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm flex items-start gap-3">
                      <span className="text-xl">✅</span>
                      <span className="leading-relaxed">{success}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                        Test Title
                      </label>
                      <input
                        type="text"
                        name="testtitle"
                        value={formData.testtitle}
                        onChange={handleInputChange}
                        placeholder="Enter test title"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition bg-white text-[#0F172A] placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                        Number of Participants
                      </label>
                      <input
                        type="number"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        placeholder="Enter number of participants"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition bg-white text-[#0F172A] placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                        Due Date
                      </label>
                      <input
                        type="datetime-local"
                        name="closedDate"
                        value={formData.closedDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition bg-white text-[#0F172A]"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-6">
                      <button
                        type="button"
                        onClick={() => setSelectedClass(null)}
                        className="flex-1 px-5 py-3 border-2 border-gray-300 text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-5 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
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
                key={classItem.classId}
                onClick={() => router.push(`/teacher/class/${classItem.classId}?subject=${classItem.subjects?.[0] || ''}`)}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="bg-gradient-to-br from-[#2563EB] to-blue-700 h-36 flex items-center justify-center relative">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-bold mb-1.5 leading-tight">{classItem.class_code}</h3>
                    <p className="text-blue-100 text-sm">{classItem.class_year}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-xs font-semibold">Active</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {classItem.subjects && classItem.subjects.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Teaching Subjects:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {classItem.subjects.map((subject: string, idx: number) => (
                            <span key={idx} className="text-xs bg-blue-100 text-[#2563EB] px-2.5 py-1 rounded-md font-medium">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm py-2 border-t border-gray-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Total Tests
                      </span>
                      <span className="font-bold text-[#0F172A]">
                        {filteredTests.filter((test: TestItem) => test.classID === classItem.classId).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pb-2">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Active Tests
                      </span>
                      <span className="font-bold text-green-600">
                        {filteredTests.filter((test: TestItem) => test.classID === classItem.classId && test.status === 'ongoing').length}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-50 text-[#2563EB] py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors group-hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2">
                    View Class Details →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-100">
              <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-lg font-medium">No classes available</p>
              <p className="text-gray-400 text-sm mt-2">You are not assigned to any subject classes yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
