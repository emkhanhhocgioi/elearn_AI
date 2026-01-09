'use client';
import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Check } from 'lucide-react';

interface BatchQuestion {
  question: string;
  questionType: string;
  subjectQuestionType: string;
  difficult: string;
  grade: number;
  solution: string;
  metadata: string;
  options: string[];
  file?: File | null;
  filePreview?: string | null;
}

interface BatchQuestionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  testId: string;
  onSuccess: () => void;
  subject: string;
}

export default function BatchQuestionsDialog({
  isOpen,
  onClose,
  testId,
  onSuccess,
  subject,
}: BatchQuestionsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Saved questions array
  const [savedQuestions, setSavedQuestions] = useState<BatchQuestion[]>([]);

  // Current form state for ONE question
  const [currentQuestion, setCurrentQuestion] = useState<BatchQuestion>({
    question: '',
    questionType: 'essay',
    subjectQuestionType: '',
    difficult: 'medium',
    grade: 1,
    solution: '',
    metadata: '',
    options: [''],
    file: null,
    filePreview: null,
  });

  // Check if file is an image
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  // Handle file selection for current question
  const handleFileSelect = (file: File | null) => {
    if (file && isImageFile(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentQuestion(prev => ({ 
          ...prev, 
          file, 
          filePreview: reader.result as string,
          metadata: '' 
        }));
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setCurrentQuestion(prev => ({ 
        ...prev, 
        file, 
        filePreview: null,
        metadata: '' 
      }));
    } else {
      setCurrentQuestion(prev => ({ ...prev, file: null, filePreview: null }));
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof BatchQuestion, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options.length > 1) {
      setCurrentQuestion(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  // Save current question to the list
  const handleSaveQuestion = () => {
    // Validation
    if (!currentQuestion.question.trim() || !currentQuestion.solution.trim()) {
      setError('Please fill in question and solution fields');
      return;
    }

    if (currentQuestion.questionType === 'multiple_choice') {
      const hasEmptyOptions = currentQuestion.options.some(opt => !opt.trim());
      if (hasEmptyOptions) {
        setError('Please fill in all options for multiple choice questions');
        return;
      }
    }

    // Add to saved questions
    setSavedQuestions(prev => [...prev, { ...currentQuestion }]);
    
    // Reset form
    setCurrentQuestion({
      question: '',
      questionType: 'essay',
      subjectQuestionType: '',
      difficult: 'medium',
      grade: 1,
      solution: '',
      metadata: '',
      options: [''],
      file: null,
      filePreview: null,
    });
    
    setError('');
    setSuccess('Question added to list! Add more or click "Save All Questions"');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Remove a saved question from the list
  const handleRemoveQuestion = (index: number) => {
    setSavedQuestions(prev => prev.filter((_, i) => i !== index));
  };

  // Submit all saved questions to backend
  const handleSaveAllQuestions = async () => {
    if (savedQuestions.length === 0) {
      setError('Please add at least one question before saving');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('All questions saved successfully!');
      setTimeout(() => {
        onClose();
        onSuccess();
        setSavedQuestions([]);
        setCurrentQuestion({
          question: '',
          questionType: 'essay',
          subjectQuestionType: '',
          difficult: 'medium',
          grade: 1,
          solution: '',
          metadata: '',
          options: [''],
          file: null,
          filePreview: null,
        });
      }, 1500);
    } catch (err) {
      setError('Failed to save questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 overflow-hidden">
      <style>{`
        body.modal-open {
          overflow: hidden;
        }
        .custom-scrollbar {
          overflow-y: scroll !important;
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          display: block;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 10px;
          min-height: 40px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
      <div className="bg-white rounded-lg w-full max-w-[98vw] h-[95vh] overflow-hidden shadow-xl flex flex-col">
        {/* Fixed Header */}
        <div className="p-6 border-b bg-white z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              Thêm nhiều Câu hỏi
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

       
        {/* 2-Column Layout */}
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
            {/* Left Column - Question Form (2/3 width) */}
            <div className="lg:col-span-2 overflow-auto p-6 border-r custom-scrollbar">
              <div className="space-y-4">
                <div className="border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                  <h4 className="font-semibold text-lg text-gray-900 mb-4">Chi tiết Câu hỏi</h4>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại *</label>
                        <select
                          value={currentQuestion.questionType}
                          onChange={(e) => handleFieldChange('questionType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="essay">Tự luận</option>
                          <option value="multiple_choice">Trắc nghiệm</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Độ khó *</label>
                        <select
                          value={currentQuestion.difficult}
                          onChange={(e) => handleFieldChange('difficult', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="easy">Dễ</option>
                          <option value="medium">Trung bình</option>
                          <option value="hard">Khó</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Điểm *</label>
                        <input
                          type="number"
                          value={currentQuestion.grade}
                          onChange={(e) => handleFieldChange('grade', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại Câu hỏi theo Môn học</label>
                      <input
                        type="text"
                        value={currentQuestion.subjectQuestionType}
                        onChange={(e) => handleFieldChange('subjectQuestionType', e.target.value)}
                        placeholder="Ví dụ: Văn học Việt Nam, Đại số, Hóa học hữu cơ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Câu hỏi *</label>
                      <textarea
                        value={currentQuestion.question}
                        onChange={(e) => handleFieldChange('question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        rows={4}
                        placeholder="Nhập câu hỏi của bạn..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án / Lời giải *</label>
                      <textarea
                        value={currentQuestion.solution}
                        onChange={(e) => handleFieldChange('solution', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        rows={4}
                        placeholder="Nhập đáp án hoặc lời giải..."
                        required
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đính kèm Ảnh/File (Tùy chọn)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {currentQuestion.filePreview && (
                        <div className="mt-3 relative inline-block">
                          <img
                            src={currentQuestion.filePreview}
                            alt="Preview"
                            className="max-w-xs rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleFileSelect(null)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {currentQuestion.file && !currentQuestion.filePreview && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <span>📎 {currentQuestion.file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleFileSelect(null)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Multiple Choice Options */}
                    {currentQuestion.questionType === 'multiple_choice' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Các lựa chọn *</label>
                        <div className="space-y-2">
                          {currentQuestion.options.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder={`Lựa chọn ${index + 1}`}
                              />
                              {currentQuestion.options.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addOption}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Thêm lựa chọn
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Save Question Button */}
                  <div className="mt-6 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleSaveQuestion}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
                    >
                      <Check className="w-5 h-5" />
                      Lưu Câu hỏi vào Danh sách
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Questions List (1/3 width) */}
            <div className="lg:col-span-1 overflow-y-auto custom-scrollbar bg-gray-50">
              <div className="p-6">
                 {/* Fixed Alert Messages */}
                  {(error || success) && (
                    <div className="px-6 pt-4 bg-white z-10 flex-shrink-0">
                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-2">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                          {success}
                        </div>
                      )}
                    </div>
                  )}

                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">Danh sách Câu hỏi</h4>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {savedQuestions.length}
                  </span>
                </div>

                {savedQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">Chưa có câu hỏi nào</p>
                    <p className="text-gray-400 text-xs mt-1">Điền form và nhấn "Lưu Câu hỏi vào Danh sách"</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {savedQuestions.map((q, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                                {q.question}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                  {q.questionType === 'essay' ? 'Tự luận' : 'Trắc nghiệm'}
                                </span>
                                <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                                  q.difficult === 'easy'
                                    ? 'bg-green-100 text-green-700'
                                    : q.difficult === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {q.difficult === 'easy' ? 'Dễ' : q.difficult === 'medium' ? 'TB' : 'Khó'}
                                </span>
                                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                  {q.grade} điểm
                                </span>
                              </div>
                              {q.file && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  📎 {q.file.name}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveQuestion(index)}
                              className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Remove question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Save All Questions Button */}
                    <div className="sticky bottom-0 bg-gray-50 pt-4 border-t">
                      <button
                        onClick={handleSaveAllQuestions}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold shadow-lg"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Lưu tất cả {savedQuestions.length} Câu hỏi
                          </>
                        )}
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                      >
                        Hủy
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}