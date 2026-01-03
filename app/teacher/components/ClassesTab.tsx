'use client';
import { useState, useEffect, Fragment } from 'react';
import { Users, Edit2, Save, X, ChevronDown, ChevronUp, Search, Filter, RotateCcw } from 'lucide-react';
import { getTeacherClasses } from '@/app/teacher/api/class';
import {sendEmailToHomeroomClass} from '@/app/teacher/api/mailing';
import { getClassStudentsAllSubjectsAverage, UpdateStudentConductAndPerformance } from '@/app/teacher/api/student';

interface Student {
  _id: string;
  studentID: {
    _id: string;
    name: string;
    email: string;
    DOB: string;
    avatar: string;
    parentContact: string;
    academic_performance: string;
    conduct: string;
    averageScore: number;
  };
  timeJoin: string;
}

interface ClassData {
  _id: string;
  class_code: string;
  class_year: string;
  class_student_count: number;
  class_avarage_grade: number;
  students: Student[];
}

interface SubjectAverage {
  subjectName: string;
  averageScore: number | string;
}

interface StudentAllSubjectsAverage {
  studentId: string;
  studentName: string;
  subjects: SubjectAverage[];
  overallAverage: number | string;
}

// Filter constants
const ACADEMIC_PERFORMANCE_OPTIONS = ['Tất cả', 'Tốt', 'Khá', 'Trung bình', 'Yếu'];
const CONDUCT_OPTIONS = ['Tất cả', 'Tốt', 'Khá', 'Trung bình', 'Yếu'];

// Edit options (without 'Tất cả')
const ACADEMIC_PERFORMANCE_EDIT_OPTIONS = ['Tốt', 'Khá', 'Trung bình', 'Yếu'];
const CONDUCT_EDIT_OPTIONS = ['Tốt', 'Khá', 'Trung bình', 'Yếu'];

export default function ClassesTab() {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editedConduct, setEditedConduct] = useState<string>('');
  const [editedAcademicPerformance, setEditedAcademicPerformance] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Filter states
  const [searchText, setSearchText] = useState<string>('');
  const [academicFilter, setAcademicFilter] = useState<string>('Tất cả');
  const [conductFilter, setConductFilter] = useState<string>('Tất cả');
  const [studentsAverages, setStudentsAverages] = useState<StudentAllSubjectsAverage[]>([]);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [loadingAverages, setLoadingAverages] = useState(false);

  useEffect(() => {
    fetchClassData();
  }, []);

  useEffect(() => {
    if (classData?._id) {
      fetchStudentsAverages(classData._id);
    }
  }, [classData?._id]);

  const fetchClassData = async () => {
    try {
      setFetchLoading(true);
      const response = await getTeacherClasses();

      const classesData = response?.class;
      if (classesData && classesData.length > 0) {
        setClassData(classesData[0]);
      }
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      setClassData(null);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchStudentsAverages = async (classId: string) => {
    try {
      setLoadingAverages(true);
      const response = await getClassStudentsAllSubjectsAverage(classId);
    
      if (response?.data) {
        setStudentsAverages(response.data);
      }
    } catch (error) {
      console.error('Error fetching students averages:', error);
      setStudentsAverages([]);
    } finally {
      setLoadingAverages(false);
    }
  };

  const handleEdit = (studentId: string, currentConduct: string, currentAcademicPerformance: string) => {
    setEditingStudentId(studentId);
    // Trim and validate values, use first option as default if invalid
    const validConduct = currentConduct?.trim() || CONDUCT_EDIT_OPTIONS[0];
    const validAcademic = currentAcademicPerformance?.trim() || ACADEMIC_PERFORMANCE_EDIT_OPTIONS[0];
    setEditedConduct(CONDUCT_EDIT_OPTIONS.includes(validConduct) ? validConduct : CONDUCT_EDIT_OPTIONS[0]);
    setEditedAcademicPerformance(ACADEMIC_PERFORMANCE_EDIT_OPTIONS.includes(validAcademic) ? validAcademic : ACADEMIC_PERFORMANCE_EDIT_OPTIONS[0]);
  };

  const handleSave = async (studentId: string) => {
    console.log('Saving student:', { studentId, editedConduct, editedAcademicPerformance });
    try {
      
      setIsSaving(true);
      setSaveMessage(null);
      // Call API to update student conduct and performance
      const response = await UpdateStudentConductAndPerformance(
        studentId, 
        editedConduct, 
        editedAcademicPerformance
      );
      
      // Only update local state if the response is successful (200)
      if (response) {
        // Update local state
        if (classData) {
          const updatedStudents = classData.students.map(student => {
            if (student.studentID._id === studentId) {
              return {
                ...student,
                studentID: {
                  ...student.studentID,
                  conduct: editedConduct,
                  academic_performance: editedAcademicPerformance
                }
              };
            }
            return student;
          });
          setClassData({
            ...classData,
            students: updatedStudents
          });
        }
        
        setSaveMessage({ type: 'success', text: 'Cập nhật thành công!' });
        
        // Auto-hide message and reset edit state after 2 seconds
        setTimeout(() => {
          setEditingStudentId(null);
          setEditedConduct('');
          setEditedAcademicPerformance('');
          setSaveMessage(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      setSaveMessage({ type: 'error', text: 'Có lỗi xảy ra. Vui lòng thử lại!' });
      
      // Auto-hide error message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setEditedConduct('');
    setEditedAcademicPerformance('');
    setSaveMessage(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const toggleExpandStudent = (studentId: string) => {
    setExpandedStudentId(expandedStudentId === studentId ? null : studentId);
  };

  const getStudentAverageData = (studentId: string) => {
    return studentsAverages.find(avg => avg.studentId === studentId);
  };

  // Filter students based on search text, academic performance, and conduct
  const getFilteredStudents = () => {
    if (!classData?.students) return [];
    
    return classData.students.filter(student => {
      // Search filter (name or student ID)
      const searchLower = searchText.toLowerCase().trim();
      const matchesSearch = !searchText || 
        student.studentID.name.toLowerCase().includes(searchLower) || 
        student.studentID._id.toLowerCase().includes(searchLower);
      
      // Academic performance filter
      const matchesAcademic = academicFilter === 'Tất cả' || 
        student.studentID.academic_performance === academicFilter;
      
      // Conduct filter
      const matchesConduct = conductFilter === 'Tất cả' || 
        student.studentID.conduct === conductFilter;
      
      return matchesSearch && matchesAcademic && matchesConduct;
    });
  };

  const resetFilters = () => {
    setSearchText('');
    setAcademicFilter('Tất cả');
    setConductFilter('Tất cả');
  };

  const handleUpdateStudent = (studentId: string, studentName: string) => {
    // TODO: Implement student update functionality
    console.log('Update student clicked:', { studentId, studentName });
  };

  const filteredStudents = getFilteredStudents();

  return (
    <div className="space-y-6">
      {fetchLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading class data...</p>
        </div>
      ) : !classData ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No class found</p>
        </div>
      ) : (
        <>
          {/* Class Header */}
          <div className="bg-gradient-to-br from-[#2563EB] to-blue-700 rounded-lg p-8 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2 leading-tight">{classData.class_code}</h2>
                <p className="text-blue-100">Năm học: {classData.class_year}</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                  <p className="text-sm text-blue-100">Số học sinh</p>
                  <p className="text-3xl font-bold mt-1">{classData.students?.length || 0}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                  <p className="text-sm text-blue-100">Điểm TB</p>
                  <p className="text-3xl font-bold mt-1">{classData.class_avarage_grade}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-lg font-semibold text-[#0F172A]">Bộ lọc</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Tên hoặc mã học sinh..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Academic Performance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Học lực
                </label>
                <select
                  value={academicFilter}
                  onChange={(e) => setAcademicFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white"
                >
                  {ACADEMIC_PERFORMANCE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Conduct Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hạnh kiểm
                </label>
                <select
                  value={conductFilter}
                  onChange={(e) => setConductFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white"
                >
                  {CONDUCT_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-[#2563EB]">{filteredStudents.length}</span> / {classData.students?.length || 0} học sinh
              </div>
              {(searchText || academicFilter !== 'Tất cả' || conductFilter !== 'Tất cả') && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Đặt lại bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-[#F1F5F9]">
              <h3 className="text-xl font-bold text-[#0F172A] leading-tight">Danh sách học sinh</h3>
              <p className="text-sm text-gray-500 mt-1">{filteredStudents.length} học sinh</p>
            </div>
            
            {loadingAverages ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                <p className="mt-4 text-gray-500">Đang tải điểm học sinh...</p>
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F1F5F9] border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Họ và tên
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ngày sinh
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        SĐT phụ huynh
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Học lực
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Hạnh kiểm
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Điểm TB
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Chi tiết
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student, index) => {
                      const studentAvgData = getStudentAverageData(student.studentID._id);
                      const isExpanded = expandedStudentId === student.studentID._id;
                      
                      return (
                        <Fragment key={student._id}>
                          <tr className="hover:bg-[#F1F5F9] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0F172A]">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {student.studentID.avatar ? (
                                  <img 
                                    src={student.studentID.avatar} 
                                    alt={student.studentID.name}
                                    className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-100"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const avatarDiv = target.nextElementSibling as HTMLElement;
                                      if (avatarDiv) avatarDiv.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className="w-10 h-10 rounded-full mr-3 bg-gradient-to-br from-[#2563EB] to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-100"
                                  style={{ display: student.studentID.avatar ? 'none' : 'flex' }}
                                >
                                  {student.studentID.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-[#0F172A] leading-relaxed">
                                  {student.studentID.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(student.studentID.DOB)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {student.studentID.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {student.studentID.parentContact}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingStudentId === student.studentID._id ? (
                                <select
                                  value={editedAcademicPerformance || ACADEMIC_PERFORMANCE_EDIT_OPTIONS[0]}
                                  onChange={(e) => setEditedAcademicPerformance(e.target.value)}
                                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white text-[#0F172A]"
                                >
                                  {ACADEMIC_PERFORMANCE_EDIT_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-[#2563EB]">
                                  {student.studentID.academic_performance}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingStudentId === student.studentID._id ? (
                                <select
                                  value={editedConduct || CONDUCT_EDIT_OPTIONS[0]}
                                  onChange={(e) => setEditedConduct(e.target.value)}
                                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white text-[#0F172A]"
                                >
                                  {CONDUCT_EDIT_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                  {student.studentID.conduct}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#0F172A]">
                                  {loadingAverages ? '...' : studentAvgData?.overallAverage || 'Chưa có'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleExpandStudent(student.studentID._id)}
                                className="p-2 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1"
                                title={isExpanded ? "Thu gọn" : "Xem điểm các môn"}
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingStudentId === student.studentID._id ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleSave(student.studentID._id)}
                                    disabled={isSaving}
                                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                    title="Lưu"
                                  >
                                    {isSaving ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Lưu...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Save className="w-4 h-4" />
                                        <span>Lưu</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                    title="Hủy"
                                  >
                                    <X className="w-4 h-4" />
                                    <span>Hủy</span>
                                  </button>
                                  {saveMessage && (
                                    <div className={`ml-2 px-3 py-2 rounded-lg text-sm font-medium ${
                                      saveMessage.type === 'success' 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                      {saveMessage.text}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEdit(student.studentID._id, student.studentID.conduct, student.studentID.academic_performance)}
                                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 shadow-sm flex items-center gap-1"
                                  title="Chỉnh sửa"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  <span>Chỉnh sửa</span>
                                </button>
                              )}
                            </td>
                          </tr>
                          {isExpanded && studentAvgData && (
                            <tr key={`${student.studentID._id}-details`} className="bg-blue-50">
                              <td colSpan={10} className="px-6 py-4">
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-[#0F172A] mb-3">
                                    Điểm trung bình các môn học
                                  </h4>
                                  {studentAvgData.subjects.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                      {studentAvgData.subjects.map((subject, idx) => (
                                        <div 
                                          key={idx}
                                          className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
                                        >
                                          <p className="text-xs text-gray-500 mb-1">{subject.subjectName}</p>
                                          <p className="text-lg font-bold text-[#2563EB]">
                                            {subject.averageScore}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 italic">Chưa có điểm cho môn học nào</p>
                                  )}
                                  <div className="mt-4 pt-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between bg-gradient-to-r from-[#2563EB] to-blue-600 text-white rounded-lg px-4 py-3">
                                      <span className="font-semibold">Điểm trung bình chung:</span>
                                      <span className="text-2xl font-bold">{studentAvgData.overallAverage}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">
                  {classData.students && classData.students.length > 0 
                    ? 'Không tìm thấy học sinh phù hợp với bộ lọc' 
                    : 'Chưa có học sinh nào trong lớp'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
      
    </div>
  );
}