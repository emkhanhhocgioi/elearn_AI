'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Calendar, Clock, CheckCircle, XCircle, User, X, Sparkles } from 'lucide-react';
import { getSubmittedAnswers, TeacherGradingAsnwer, Ai_grade, Ai_grade_from_file ,Ai_grade_from_image} from '@/app/teacher/api/test';

interface Question {
  questionID: {
    _id: string;
    question: string;
    questionType: string;
  };
  
  answer: string;
  isCorrect: boolean;
  _id: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  classid: string;
  DOB: string;
  parentContact: string;
  academic_performance: string;
  conduct: string;
  averageScore: number;
}

interface Test {
  _id: string;
  testtitle: string;
  subject: string;
  avg_score: string;
  participants: number;
  closeDate: string;
  status: string;
  createDate: string;
  test_time: number;
  classID: string;
  teacherID: string;
}

interface SubmittedAnswer {
  _id: string;
  testID: Test;
  studentID: Student;
  answers: Question[];
  teacherComments: string;
  submissionTime: string;
  createdAt: string;
  updatedAt: string;
  submit: boolean;
}

export default function SubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [submissions, setSubmissions] = useState<SubmittedAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmittedAnswer | null>(null);
  const [teacherComments, setTeacherComments] = useState('');
  const [isSavingComments, setIsSavingComments] = useState(false);
  const [teacherGrade, setTeacherGrade] = useState<number>(0);
  const [editedAnswers, setEditedAnswers] = useState<Question[]>([]);
  const [aiGradingLoading, setAiGradingLoading] = useState<string | null>(null);
  const [aiGradingResults, setAiGradingResults] = useState<{[key: string]: any}>({});

  // Helper function to check if URL is an image
  const isImageUrl = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('/image/upload/'); // Cloudinary image pattern
  };

  useEffect(() => {
    fetchSubmissions();
  }, [testId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getSubmittedAnswers(testId);
      if (response?.submittedAnswers) {
        setSubmissions(response.submittedAnswers);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (answers: Question[]) => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;
    return totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : '0';
  };

  const handleAnswerCorrectChange = (answerId: string, isCorrect: boolean) => {
    setEditedAnswers(prev => 
      prev.map(answer => 
        answer._id === answerId 
          ? { ...answer, isCorrect } 
          : answer
      )
    );
  };

  const handleAiGrade = async (answer: Question) => {
    if (!selectedSubmission) return;

    try {
      setAiGradingLoading(answer._id);
      
      const questionType = answer.questionID?.questionType;
      const subject = selectedSubmission.testID.subject;
      const exercise_question = answer.questionID?.question || '';
      
      let result;
      
      if (questionType === 'file_upload') {
        // Check if the file is an image
        if (isImageUrl(answer.answer)) {
          // Call AI grading with image URL
          result = await Ai_grade_from_image(
            exercise_question,
            answer.answer, // This is the image URL
            subject
          );
        } else {
          // Call AI grading with file URL
          result = await Ai_grade_from_file(
            exercise_question,
            answer.answer, // This is the file URL
            subject
          );
        }
      } else {
        // Call AI grading with text answer
        result = await Ai_grade(
          exercise_question,
          answer.answer,
          subject
        );
      }
      
      // Extract grading_response from the API result
      const gradingData = result?.grading_response || result;
      
      // Store the AI grading result
      setAiGradingResults(prev => ({
        ...prev,
        [answer._id]: gradingData
      }));
      
      console.log('AI Grading Result:', result);
      console.log('Grading Data:', gradingData);
      
    } catch (error) {
      console.error('Error in AI grading:', error);
      alert('Failed to get AI grading');
    } finally {
      setAiGradingLoading(null);
    }
  };

  const handleSaveComments = async () => {
    if (!selectedSubmission) return;

    try {
      setIsSavingComments(true);
      
      // Prepare answer data for grading
      const answerData = editedAnswers.map(answer => ({
        questionID: answer.questionID._id,
        answer: answer.answer,
        isCorrect: answer.isCorrect
      }));

      console.log("Submitting grading data:", {
        answerId: selectedSubmission._id,
        teacherGrade,
        teacherComments,
        answerData
      });

      // Call the grading API
      await TeacherGradingAsnwer(
        selectedSubmission._id,
        teacherGrade,
        teacherComments,
        answerData
      );
      
      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub._id === selectedSubmission._id 
            ? { ...sub, teacherComments, answers: editedAnswers } 
            : sub
        )
      );
      
      setSelectedSubmission({
        ...selectedSubmission,
        teacherComments,
        answers: editedAnswers
      });
      
      alert('Grading saved successfully!');
    } catch (err) {
      console.error('Error saving grading:', err);
      alert('Failed to save grading');
    } finally {
      setIsSavingComments(false);
    }
  };

  if (loading) {
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
          Back to Test
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {submissions[0]?.testID?.testtitle || 'Test Submissions'}
              </h1>
              {submissions[0]?.testID && (
                <p className="text-gray-600 mt-1">
                  Subject: {submissions[0].testID.subject} • Duration: {submissions[0].testID.test_time} minutes
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-blue-600">
                {submissions[0]?.testID?.participants || 0}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Submissions</p>
              <p className="text-2xl font-bold text-green-600">{submissions.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-purple-600">
                {submissions[0]?.testID?.avg_score || '0'}%
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-2xl font-bold text-orange-600 capitalize">
                {submissions[0]?.testID?.status || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Submissions List */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Student Submissions ({submissions.length})
          </h2>
        </div>

        {submissions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {submissions.map((submission) => {
              const score = calculateScore(submission.answers);
              const correctCount = submission.answers.filter(a => a.isCorrect).length;
              const totalCount = submission.answers.length;

              return (
                <div
                  key={submission._id}
                  className="p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setTeacherComments(submission.teacherComments || '');
                    setEditedAnswers(submission.answers);
                    setTeacherGrade(parseFloat(score));
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Student Avatar */}
                      <img
                        src={submission.studentID.avatar || '/default-avatar.png'}
                        alt={submission.studentID.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      {/* Student Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.studentID.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {submission.studentID.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Submission Time */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(submission.submissionTime).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4" />
                          {new Date(submission.submissionTime).toLocaleTimeString('vi-VN')}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-center bg-purple-50 rounded-lg px-6 py-3">
                        <p className="text-3xl font-bold text-purple-600">{score}%</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {correctCount}/{totalCount} correct
                        </p>
                      </div>

                      {/* Status Badge */}
                      {submission.submit && (
                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Submitted
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No submissions yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Students haven't submitted their answers for this test
            </p>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (  
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedSubmission.studentID.avatar || '/default-avatar.png'}
                    alt={selectedSubmission.studentID.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedSubmission.studentID.name}'s Submission
                    </h2>
                    <p className="text-sm text-gray-600">
                      Submitted on {new Date(selectedSubmission.submissionTime).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X
                   className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Student Stats */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Academic Performance</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedSubmission.studentID.academic_performance}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Conduct</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedSubmission.studentID.conduct}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Average Score</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedSubmission.studentID.averageScore}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Test Score</p>
                  <p className="text-sm font-semibold text-purple-600">
                    {calculateScore(selectedSubmission.answers)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Answers ({selectedSubmission.answers.length})
              </h3>

            

              <div className="space-y-4">
                {editedAnswers.map((answer, index) => (
                  <div
                    key={answer._id}
                    className={`p-4 rounded-lg border-2 ${
                      answer.isCorrect
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          Question {index + 1}
                        </span>
                        {answer.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      
                      {/* Select dropdown to change correct/incorrect */}
                      <select
                        value={answer.isCorrect ? 'correct' : 'incorrect'}
                        onChange={(e) => handleAnswerCorrectChange(answer._id, e.target.value === 'correct')}
                        className={`px-3 py-1 rounded-lg border-2 font-medium text-sm focus:ring-2 focus:ring-purple-500 ${
                          answer.isCorrect
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : 'bg-red-50 border-red-300 text-red-700'
                        }`}
                      >
                        <option value="correct">Correct</option>
                        <option value="incorrect">Incorrect</option>
                      </select>
                    </div>

                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Question:</p>
                        <p className="text-gray-900 bg-white p-3 rounded border border-gray-200 font-medium">
                          {answer.questionID?.question || 'Question not available'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Student's Answer:</p>
                        {answer.questionID?.questionType === 'file_upload' ? (
                          isImageUrl(answer.answer) ? (
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <img 
                                src={answer.answer} 
                                alt="Student's uploaded answer"
                                className="max-w-full h-auto rounded-lg shadow-sm"
                                onError={(e) => {
                                  // Fallback to link if image fails to load
                                  e.currentTarget.style.display = 'none';
                                  const link = document.createElement('a');
                                  link.href = answer.answer;
                                  link.target = '_blank';
                                  link.rel = 'noopener noreferrer';
                                  link.className = 'text-blue-600 hover:text-blue-800 underline';
                                  link.textContent = 'View Uploaded File';
                                  e.currentTarget.parentElement?.appendChild(link);
                                }}
                              />
                              <a 
                                href={answer.answer} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm mt-2 inline-block"
                              >
                                Open in new tab
                              </a>
                            </div>
                          ) : (
                            <a 
                              href={answer.answer} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline bg-white p-3 rounded border border-gray-200 block"
                            >
                              View Uploaded File
                            </a>
                          )
                        ) : (
                          <p className="text-gray-900 bg-white p-3 rounded border border-gray-200">
                            {answer.answer}
                          </p>
                        )}
                      </div>

                      {/* AI Grading Button */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAiGrade(answer)}
                          disabled={aiGradingLoading === answer._id}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {aiGradingLoading === answer._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              AI Grading...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              AI Grade
                            </>
                          )}
                        </button>

                        {aiGradingResults[answer._id] && (
                          <div className="flex-1 bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-blue-900">AI Analysis:</p>
                              {aiGradingResults[answer._id].isCorrect ? (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  Correct
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                  Incorrect
                                </span>
                              )}
                            </div>
                            
                            <div className="bg-white p-3 rounded border border-blue-200">
                              <p className="text-xs font-semibold text-gray-600 mb-1">AI Comments:</p>
                              <p className="text-sm text-gray-800 leading-relaxed">
                                {aiGradingResults[answer._id].comments}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
               {/* Teacher Grade Input */}
              <div className="mb-6 bg-purple-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Điểm của học sinh (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={teacherGrade}
                  onChange={(e) => setTeacherGrade(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập điểm..."
                />
              </div>
              {/* Teacher Comments Section */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Teacher's Comments</h4>
                <textarea
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                  placeholder="Add your comments for this student..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSaveComments}
                    disabled={isSavingComments}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSavingComments ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Grading'
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
