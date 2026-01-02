'use client';
import { useState, useEffect } from 'react';
import { Users, Edit2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getTeacherClasses } from '@/app/teacher/api/class';
import {sendEmailToHomeroomClass} from '@/app/teacher/api/mailing';
import { getClassStudentsAllSubjectsAverage } from '@/app/teacher/api/student';

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

export default function ClassesTab() {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editedConduct, setEditedConduct] = useState<string>('');
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
      console.log('Teacher Classes Response:', response);
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
      console.log('Students Averages Response:', response);
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

  const handleEditConduct = (studentId: string, currentConduct: string) => {
    setEditingStudentId(studentId);
    setEditedConduct(currentConduct);
  };

  const handleSaveConduct = async (studentId: string) => {
    // TODO: Implement API call to update student conduct
    console.log('Saving conduct for student:', studentId, 'New conduct:', editedConduct);
    // For now, just update locally
    if (classData) {
      const updatedStudents = classData.students.map(student => {
        if (student.studentID._id === studentId) {
          return {
            ...student,
            studentID: {
              ...student.studentID,
              conduct: editedConduct
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
    setEditingStudentId(null);
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setEditedConduct('');
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

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-[#F1F5F9]">
              <h3 className="text-xl font-bold text-[#0F172A] leading-tight">Danh sách học sinh</h3>
              <p className="text-sm text-gray-500 mt-1">{classData.students?.length || 0} students enrolled</p>
            </div>
            
            {classData.students && classData.students.length > 0 ? (
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classData.students.map((student, index) => {
                      const studentAvgData = getStudentAverageData(student.studentID._id);
                      const isExpanded = expandedStudentId === student.studentID._id;
                      
                      return (
                        <>
                          <tr key={student?._id} className="hover:bg-[#F1F5F9] transition-colors">
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
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-[#2563EB]">
                                {student.studentID.academic_performance}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingStudentId === student.studentID._id ? (
                                <div className="flex items-center gap-2">
                                  <select
                                    value={editedConduct}
                                    onChange={(e) => setEditedConduct(e.target.value)}
                                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white text-[#0F172A]"
                                  >
                                    <option value="Tốt">Tốt</option>
                                    <option value="Khá">Khá</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Yếu">Yếu</option>
                                  </select>
                                  <button
                                    onClick={() => handleSaveConduct(student.studentID._id)}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                    title="Lưu"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                    title="Hủy"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                    {student.studentID.conduct}
                                  </span>
                                  <button
                                    onClick={() => handleEditConduct(student.studentID._id, student.studentID.conduct)}
                                    className="p-1.5 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                </div>
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
                          </tr>
                          {isExpanded && studentAvgData && (
                            <tr key={`${student._id}-details`} className="bg-blue-50">
                              <td colSpan={9} className="px-6 py-4">
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
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Chưa có học sinh nào trong lớp</p>
              </div>
            )}
          </div>
        </>
      )}
      
    </div>
  );
}