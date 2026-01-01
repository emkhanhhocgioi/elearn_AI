'use client';
import { useState, useEffect } from 'react';
import { Users, Edit2, Save, X } from 'lucide-react';
import { getTeacherClasses } from '@/app/teacher/api/class';
import {sendEmailToHomeroomClass} from '@/app/teacher/api/mailing';

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

export default function ClassesTab() {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editedConduct, setEditedConduct] = useState<string>('');

  useEffect(() => {
    fetchClassData();
  }, []);

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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classData.students.map((student, index) => (
                      <tr key={student._id} className="hover:bg-[#F1F5F9] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0F172A]">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={student.studentID.avatar} 
                              alt={student.studentID.name}
                              className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-100"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                              }}
                            />
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0F172A]">
                          {student.studentID.averageScore}
                        </td>
                      </tr>
                    ))}
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