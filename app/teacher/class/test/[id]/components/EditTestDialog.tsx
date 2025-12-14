'use client';
import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { editTestById } from '@/app/teacher/api/test';

interface TestDetail {
  _id: string;
  testtitle: string;
  classID: {
    _id: string;
    class_code: string;
  };
  teacherID: {
    _id: string;
    name: string;
  };
  participants: number;
  closeDate: string;
  status: string;
  avg_score: string;
  createDate: string;
}

interface EditTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  testDetail: TestDetail | null;
  onSuccess: () => void;
}

export default function EditTestDialog({
  isOpen,
  onClose,
  testDetail,
  onSuccess,
}: EditTestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [testFormData, setTestFormData] = useState({
    testtitle: '',
    classID: '',
    test_time: '',
    closeDate: '',
  });

  // Update form data when testDetail changes or dialog opens
  useEffect(() => {
    if (testDetail && isOpen) {
      setTestFormData({
        testtitle: testDetail.testtitle || '',
        classID: testDetail.classID._id || '',
        test_time: '',
        closeDate: testDetail.closeDate ? testDetail.closeDate.split('T')[0] : '',
      });
      setError('');
      setSuccess('');
    }
  }, [testDetail, isOpen]);

  const handleTestFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testDetail) return;

    try {
      setLoading(true);
      await editTestById(
        testDetail._id,
        testFormData.testtitle,
        Number(testFormData.test_time),
        testFormData.closeDate
      );
      setSuccess('Test updated successfully!');
      setTimeout(() => {
        onClose();
        onSuccess();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Failed to update test');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Edit Test Information</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleUpdateTest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Title *
              </label>
              <input
                type="text"
                name="testtitle"
                value={testFormData.testtitle}
                onChange={handleTestFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Close Date *
              </label>
              <input
                type="date"
                name="closeDate"
                value={testFormData.closeDate}
                onChange={handleTestFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Updating...' : 'Update Test'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
