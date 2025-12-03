'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, Users, BookOpen } from 'lucide-react';
import { createTest } from '../../../api/test';
import { useSearchParams } from 'next/navigation';
export default function AddTestPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = params.id as string;
  const subject = searchParams.get('subject') || '';

  const [formData, setFormData] = useState({
    testtitle: '',
    participants: 0,
    closedDate: '',
    subject: subject
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createTest(
        classId,
        formData.testtitle,
        formData.participants,
        formData.closedDate,
        formData.subject
      );

      if (response && response.success) {
        router.push(`/teacher/class/${classId}`);
      } else {
        setError(response?.message || 'Failed to create test');
      }
    } catch (err) {
      setError('An error occurred while creating the test');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'participants' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Test</h1>
              <p className="text-sm text-gray-500">Add a new test for your class</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Title */}
            <div>
              <label htmlFor="testtitle" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Test Title
              </label>
              <input
                type="text"
                id="testtitle"
                name="testtitle"
                value={formData.testtitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="e.g., Midterm Exam - Mathematics"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={true}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="e.g., Mathematics, Physics, Chemistry"
              />
            </div>

            {/* Participants */}
            <div>
              <label htmlFor="participants" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                Number of Participants
              </label>
              <input
                type="number"
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="e.g., 30"
              />
            </div>

            {/* Close Date */}
            <div>
              <label htmlFor="closedDate" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Close Date
              </label>
              <input
                type="datetime-local"
                id="closedDate"
                name="closedDate"
                value={formData.closedDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-800 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Plus className="w-5 h-5" />
                {loading ? 'Creating...' : 'Create Test'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Information</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>After creating the test, you can add questions to it</li>
            <li>The close date determines when students can no longer submit</li>
            <li>Make sure the participant count matches your class size</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
