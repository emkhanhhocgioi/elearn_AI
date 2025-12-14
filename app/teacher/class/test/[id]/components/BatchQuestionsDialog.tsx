'use client';
import { useState } from 'react';
import { X, Save, Plus, Trash2, Sparkles } from 'lucide-react';
import { addQuestionsToTest, AI_Generate_Question_Answer, math_question_generation } from '@/app/teacher/api/test';

interface BatchQuestion {
  question: string;
  questionType: string;
  subjectQuestionType: string;
  difficult: string;
  grade: number;
  solution: string;
  metadata: string;
  options: string[];
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
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const [batchQuestions, setBatchQuestions] = useState<BatchQuestion[]>([{
    question: '',
    questionType: 'essay',
    subjectQuestionType: '',
    difficult: 'medium',
    grade: 1,
    solution: '',
    metadata: '',
    options: [''],
  }]);

  const [batchFiles, setBatchFiles] = useState<(File | null)[]>([null]);
  const [batchFilePreviews, setBatchFilePreviews] = useState<(string | null)[]>([null]);

  // Check if file is an image
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  // Handle batch file selection
  const handleBatchFileSelect = (index: number, file: File | null) => {
    const newFiles = [...batchFiles];
    const newPreviews = [...batchFilePreviews];
    
    newFiles[index] = file;
    
    if (file) {
      const newQuestions = [...batchQuestions];
      newQuestions[index] = { ...newQuestions[index], metadata: '' };
      setBatchQuestions(newQuestions);
      
      if (isImageFile(file)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews[index] = reader.result as string;
          setBatchFilePreviews(newPreviews);
        };
        reader.readAsDataURL(file);
      } else {
        newPreviews[index] = null;
        setBatchFilePreviews(newPreviews);
      }
    } else {
      newPreviews[index] = null;
      setBatchFilePreviews(newPreviews);
    }
    
    setBatchFiles(newFiles);
  };

  const handleBatchQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...batchQuestions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setBatchQuestions(newQuestions);
  };

  const handleBatchOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...batchQuestions];
    const newOptions = [...(newQuestions[questionIndex].options || [''])];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setBatchQuestions(newQuestions);
  };

  const addBatchOption = (questionIndex: number) => {
    const newQuestions = [...batchQuestions];
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      options: [...(newQuestions[questionIndex].options || ['']), '']
    };
    setBatchQuestions(newQuestions);
  };

  const removeBatchOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...batchQuestions];
    const newOptions = (newQuestions[questionIndex].options || ['']).filter((_, i) => i !== optionIndex);
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setBatchQuestions(newQuestions);
  };

  const addNewBatchQuestion = () => {
    setBatchQuestions([...batchQuestions, {
      question: '',
      questionType: 'essay',
      subjectQuestionType: '',
      difficult: 'medium',
      grade: 1,
      solution: '',
      metadata: '',
      options: [''],
    }]);
    setBatchFiles([...batchFiles, null]);
    setBatchFilePreviews([...batchFilePreviews, null]);
  };

  const removeBatchQuestion = (index: number) => {
    if (batchQuestions.length > 1) {
      setBatchQuestions(batchQuestions.filter((_, i) => i !== index));
      setBatchFiles(batchFiles.filter((_, i) => i !== index));
      setBatchFilePreviews(batchFilePreviews.filter((_, i) => i !== index));
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all questions
    const hasEmpty = batchQuestions.some(q => !q.question || !q.solution);
    if (hasEmpty) {
      setError('Please fill in all required fields for all questions');
      return;
    }

    try {
      setLoading(true);
      await addQuestionsToTest(testId, batchQuestions, batchFiles);
      setSuccess('All questions added successfully!');
      setTimeout(() => {
        onClose();
        onSuccess();
        // Reset state
        setBatchQuestions([{
          question: '',
          questionType: 'essay',
          subjectQuestionType: '',
          difficult: 'medium',
          grade: 1,
          solution: '',
          metadata: '',
          options: [''],
        }]);
        setBatchFiles([null]);
        setBatchFilePreviews([null]);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Failed to add questions');
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
      
      const response = await AI_Generate_Question_Answer(aiPrompt, subject);
      
      if (response?.success) {
        // Handle array of questions
        if (response.result?.questions && Array.isArray(response.result.questions)) {
          setBatchQuestions(response.result.questions);
          setBatchFiles(new Array(response.result.questions.length).fill(null));
          setBatchFilePreviews(new Array(response.result.questions.length).fill(null));
          setAiPrompt('');
          setSuccess('AI generated questions successfully! Review and submit.');
        }
        // Handle single question - convert to array
        else if (response.result?.question) {
          const singleQuestion = {
            question: response.result.question || '',
            questionType: 'essay',
            subjectQuestionType: '',
            difficult: response.result.difficulty || 'medium',
            grade: 1,
            solution: response.result.answer || '',
            metadata: '',
            options: [''],
          };
          setBatchQuestions([singleQuestion]);
          setBatchFiles([null]);
          setBatchFilePreviews([null]);
          setAiPrompt('');
          setSuccess('AI generated question successfully! Review and submit.');
        } else {
          setError('Failed to generate questions. Please try again.');
        }
      } else {
        setError('Failed to generate questions. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate questions via AI');
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-xl flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              Add Multiple Questions ({batchQuestions.length})
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
            {/* Left Column - Questions Form (2/3 width) */}
            <div className="lg:col-span-2 overflow-y-auto p-6 border-r">
              <form onSubmit={handleBatchSubmit} className="space-y-6">
                {batchQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Question {qIndex + 1}</h4>
                      {batchQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBatchQuestion(qIndex)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={q.questionType}
                            onChange={(e) => handleBatchQuestionChange(qIndex, 'questionType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          >
                            <option value="essay">Essay</option>
                            <option value="multiple_choice">Multiple Choice</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                          <select
                            value={q.difficult}
                            onChange={(e) => handleBatchQuestionChange(qIndex, 'difficult', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                          <input
                            type="number"
                            value={q.grade}
                            onChange={(e) => handleBatchQuestionChange(qIndex, 'grade', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject Question Type</label>
                        <input
                          type="text"
                          value={q.subjectQuestionType}
                          onChange={(e) => handleBatchQuestionChange(qIndex, 'subjectQuestionType', e.target.value)}
                          placeholder="Ví dụ: Văn học Việt Nam, Đại số, Hóa học hữu cơ..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                        <textarea
                          value={q.question}
                          onChange={(e) => handleBatchQuestionChange(qIndex, 'question', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Solution *</label>
                        <textarea
                          value={q.solution}
                          onChange={(e) => handleBatchQuestionChange(qIndex, 'solution', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          rows={3}
                          required
                        />
                      </div>

                      {/* File Upload for Batch Questions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image/File Attachment (Optional)
                        </label>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBatchFileSelect(qIndex, e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                          {batchFilePreviews[qIndex] && (
                            <div className="relative inline-block">
                              <img
                                src={batchFilePreviews[qIndex]!}
                                alt="Preview"
                                className="max-w-xs rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => handleBatchFileSelect(qIndex, null)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {batchFiles[qIndex] && !batchFilePreviews[qIndex] && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>📎 {batchFiles[qIndex]!.name}</span>
                              <button
                                type="button"
                                onClick={() => handleBatchFileSelect(qIndex, null)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {q.questionType === 'multiple_choice' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                          <div className="space-y-2">
                            {(q.options || ['']).map((option, optIndex) => (
                              <div key={optIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleBatchOptionChange(qIndex, optIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                  placeholder={`Option ${optIndex + 1}`}
                                />
                                {(q.options || ['']).length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeBatchOption(qIndex, optIndex)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addBatchOption(qIndex)}
                              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              Add Option
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addNewBatchQuestion}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Another Question
                </button>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save All Questions
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - AI Generator (1/3 width) */}
            <div className="lg:col-span-1 overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-gray-900">AI Generator</h4>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Nhập yêu cầu để AI tạo nhiều câu hỏi cùng lúc
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu AI *
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition min-h-[200px] text-sm"
                      placeholder="Ví dụ: Tạo 5 câu hỏi trắc nghiệm về Văn học Việt Nam thế kỷ 20, độ khó trung bình. Mỗi câu có 4 đáp án."
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

                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">💡 Gợi ý sử dụng:</p>
                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                      <li>Chỉ định số lượng câu hỏi</li>
                      <li>Nêu rõ môn học và lớp</li>
                      <li>Chọn loại câu hỏi (trắc nghiệm/tự luận)</li>
                      <li>Mô tả chủ đề chi tiết</li>
                      <li>Chỉ định độ khó</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>Lưu ý:</strong> Sau khi AI tạo xong, bạn có thể xem lại và chỉnh sửa trước khi lưu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
