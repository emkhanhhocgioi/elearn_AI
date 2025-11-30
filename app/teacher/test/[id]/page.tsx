'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { addQuestion, getTestQuestions, deleteQuestion, updateQuestion } from '@/app/api/question';
import { getTestDetailById } from '@/app/api/test';

interface Question {
  _id: string;
  testid: string;
  question: string;
  questionType: string;
  difficult: string;
  grade: number;
  solution: string;
  answer: string;
  metadata: string;
  options?: string[];
}

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

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [testDetail, setTestDetail] = useState<TestDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    question: '',
    questionType: 'essay',
    difficult: 'medium',
    grade: '1',
    solution: '',
    metadata: 'none',
    options: [''],
  });

  // Fetch test and questions on mount
  useEffect(() => {
    fetchTestData();
  }, [testId]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const [testRes, questionsRes] = await Promise.all([
        getTestDetailById(testId),
        getTestQuestions(testId),
      ]);

      if (testRes?.data?.data) {
        setTestDetail(testRes.data.data);
      }
      if (questionsRes?.data?.data) {
        setQuestions(questionsRes.data.data);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load test data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      questionType: 'essay',
      difficult: 'medium',
      grade: '1',
      solution: '',
      metadata: '',
      options: [''],
    });
    setEditingQuestion(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question || !formData.solution) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      if (editingQuestion) {
        // Update existing question
        await updateQuestion(
          editingQuestion._id,
          testId,
          formData.difficult,
          formData.question,
          formData.questionType,
          parseInt(formData.grade),
          formData.solution,
          formData.metadata
        );
        setSuccess('Question updated successfully!');
      } else {
        // Add new question
        await addQuestion(
          testId,
          formData.difficult,
          formData.question,
          formData.questionType,
          formData.grade,
          formData.solution,
          formData.metadata
        );
        setSuccess('Question added successfully!');
      }

      setTimeout(() => {
        setShowAddDialog(false);
        resetForm();
        setSuccess('');
        fetchTestData();
      }, 1500);
    } catch (err) {
      setError('Failed to save question');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      questionType: question.questionType,
      difficult: question.difficult,
      grade: question.grade.toString(),
      solution: question.solution,
      metadata: question.metadata,
      options: question.options || [''],
    });
    setShowAddDialog(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        setLoading(true);
        await deleteQuestion([questionId]);
        setSuccess('Question deleted successfully!');
        setTimeout(() => {
          setSuccess('');
          fetchTestData();
        }, 1500);
      } catch (err) {
        setError('Failed to delete question');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    resetForm();
    setError('');
  };

  if (loading && !testDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tests
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {testDetail?.testtitle || 'Test'}
              </h1>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <strong>Giáo viên:</strong> {testDetail?.teacherID?.name || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <strong>Lớp học:</strong> {testDetail?.classID?.class_code || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <strong>Số học sinh:</strong> {testDetail?.participants || 0}
                </p>
                <p className="text-gray-600">
                  <strong>Điểm trung bình:</strong> {testDetail?.avg_score || '0'}
                </p>
                <p className="text-gray-600">
                  <strong>Ngày tạo:</strong> {testDetail?.createDate ? new Date(testDetail.createDate).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
                <p className="text-gray-600">
                  <strong>Ngày hết hạn:</strong> {testDetail?.closeDate ? new Date(testDetail.closeDate).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${
                testDetail?.status === 'ongoing'
                  ? 'bg-blue-100 text-blue-700'
                  : testDetail?.status === 'closed'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {testDetail?.status}
              </span>
            </div>
            <button
              onClick={() => setShowAddDialog(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h3>
                <button
                  onClick={handleCloseDialog}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Enter question text"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type *
                    </label>
                    <select
                      name="questionType"
                      value={formData.questionType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    >
                      <option value="essay">Essay</option>
                      <option value="fill_blank">Fill in the Blank</option>
                      <option value="true_false">True/False</option>
                      <option value="math">Math Open Question</option>
                      <option value="choose_correct">Choose Correct</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      name="difficult"
                      value={formData.difficult}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Points *
                  </label>
                  <input
                    type="number"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Solution/Explanation *
                  </label>
                  <textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    placeholder="Enter detailed solution or explanation"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metadata (Optional)
                  </label>
                  <input
                    type="text"
                    name="metadata"
                    value={formData.metadata}
                    onChange={handleInputChange}
                    placeholder="Additional metadata (e.g., topic, chapter)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {formData.questionType === 'choose_correct' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Options *
                      </label>
                      <button
                        type="button"
                        onClick={addOption}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        + Add Option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                          />
                          {formData.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Remove option"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Questions ({questions.length})
          </h2>
        </div>

        {questions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {questions.map((question, index) => (
              <div key={question._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {question.question}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Type: {question.questionType}
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        question.difficult === 'easy'
                          ? 'bg-green-100 text-green-700'
                          : question.difficult === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {question.difficult.charAt(0).toUpperCase() + question.difficult.slice(1)}
                      </span>
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        Points: {question.grade}
                      </span>
                    </div>

                    {question.metadata && (
                      <p className="text-sm text-gray-600 mt-3">
                        <strong>Topic:</strong> {question.metadata}
                      </p>
                    )}

                    <p className="text-sm text-gray-700 mt-3">
                      <strong>Solution:</strong> {question.solution}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition"
                      title="Edit question"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition"
                      title="Delete question"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-lg">No questions added yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Add Question" to create the first question
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
