'use client';
import { useState } from 'react';
import { X, Save, Plus, Trash2, Sparkles, FileText } from 'lucide-react';
import { addQuestionToTest, UpdateQuestion, AI_Generate_Question_Answer } from '@/app/teacher/api/test';

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

interface AddQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  testId: string;
  editingQuestion: Question | null;
  onSuccess: () => void;
}

export default function AddQuestionDialog({
  isOpen,
  onClose,
  testId,
  editingQuestion,
  onSuccess,
}: AddQuestionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    question: editingQuestion?.question || '',
    questionType: editingQuestion?.questionType || 'essay',
    difficult: editingQuestion?.difficult || 'medium',
    grade: editingQuestion?.grade.toString() || '1',
    solution: editingQuestion?.solution || '',
    metadata: editingQuestion?.metadata || '',
    options: editingQuestion?.options || [''],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Check if file is an image
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  // Handle file selection and preview
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    
    if (file) {
      setFormData(prev => ({ ...prev, metadata: '' }));
      
      // Create preview if it's an image
      if (isImageFile(file)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
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
        await UpdateQuestion(
          editingQuestion._id,
          formData.difficult,
          formData.question,
          formData.questionType,
          parseInt(formData.grade),
          formData.solution,
          formData.metadata,
          formData.options.filter(opt => opt.trim() !== ''),
          selectedFile
        );
        setSuccess('Question updated successfully!');
      } else {
        // Add new question using addQuestionToTest
        await addQuestionToTest(
          testId,
          formData.difficult,
          formData.question,
          formData.questionType,
          parseInt(formData.grade),
          formData.solution,
          formData.metadata,
          formData.options.filter(opt => opt.trim() !== ''),
          selectedFile
        );
        setSuccess('Question added successfully!');
      }

      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1500);
    } catch (err) {
      setError('Failed to save question');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiPrompt.trim()) {
      setError('Please enter a prompt for AI generation');
      return;
    }

    try {
      setAiGenerating(true);
      setError('');
      const result = await AI_Generate_Question_Answer(aiPrompt);
      
      if (result?.success && result?.response) {
        const { question, answer, difficulty } = result.response;
        setFormData({
          question: question || '',
          questionType: 'essay',
          difficult: difficulty || 'medium',
          grade: '1',
          solution: answer || '',
          metadata: '',
          options: [''],
        });
        setAiPrompt('');
        setSuccess('AI generated question successfully!');
      } else {
        setError('Failed to generate question. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate question via AI');
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>
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

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Question Form (2/3 width) */}
            <div className="lg:col-span-2">
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
                  {!selectedFile ? (
                    <p className="text-xs text-gray-500 mb-1">
                      You can provide additional metadata like topic or chapter. If you upload an image, this field will be disabled.
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Metadata input disabled when file is selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileSelect(file);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {selectedFile && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Selected: {selectedFile.name}</p>
                        <button
                          type="button"
                          onClick={() => handleFileSelect(null)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      
                      {/* Image Preview */}
                      {filePreview && isImageFile(selectedFile) && (
                        <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={filePreview} 
                            alt="Preview" 
                            className="w-full h-auto max-h-64 object-contain bg-gray-50"
                          />
                        </div>
                      )}
                      
                      {/* File Info for non-image files */}
                      {!isImageFile(selectedFile) && (
                        <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {selectedFile.type || 'Unknown type'} • {(selectedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                    onClick={onClose}
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

            {/* Right Column - AI Generator (1/3 width) */}
            {!editingQuestion && (
              <div className="lg:col-span-1">
                <div className="sticky top-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h4 className="text-lg font-bold text-gray-900">AI Generator</h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Nhập yêu cầu để AI tạo câu hỏi tự động
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yêu cầu AI *
                      </label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition min-h-[150px] text-sm"
                        placeholder="Ví dụ: Tạo 1 câu hỏi toán lớp 10 về phương trình bậc 2, độ khó trung bình"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={aiGenerating || !aiPrompt.trim()}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                    >
                      {aiGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Tạo câu hỏi
                        </>
                      )}
                    </button>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p className="font-semibold">💡 Gợi ý:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        <li>Nêu rõ môn học và lớp</li>
                        <li>Chỉ định độ khó</li>
                        <li>Mô tả chủ đề cụ thể</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
