'use client';
import { useState, useEffect } from 'react';
import { Users, Edit2, Save, X } from 'lucide-react';
import { getTeacherClasses } from '@/app/teacher/api/class';

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
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4">Loading class data...</p>
        </div>
      ) : !classData ? (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No class found</p>
        </div>
      ) : (
        <>
          {/* Class Header */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">{classData.class_code}</h2>
                <p className="text-purple-100">Năm học: {classData.class_year}</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 rounded-lg px-4 py-2 mb-2">
                  <p className="text-sm text-purple-100">Số học sinh</p>
                  <p className="text-2xl font-bold">{classData.students?.length || 0}</p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm text-purple-100">Điểm TB</p>
                  <p className="text-2xl font-bold">{classData.class_avarage_grade}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
            
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Danh sách học sinh</h3>
            </div>
            
            {classData.students && classData.students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Họ và tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày sinh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SĐT phụ huynh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Học lực
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hạnh kiểm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Điểm TB
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classData.students.map((student, index) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={student.studentID.avatar} 
                              alt={student.studentID.name}
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                              }}
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {student.studentID.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(student.studentID.DOB)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.studentID.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.studentID.parentContact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {student.studentID.academic_performance}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingStudentId === student.studentID._id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editedConduct}
                                onChange={(e) => setEditedConduct(e.target.value)}
                                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="Tốt">Tốt</option>
                                <option value="Khá">Khá</option>
                                <option value="Trung bình">Trung bình</option>
                                <option value="Yếu">Yếu</option>
                              </select>
                              <button
                                onClick={() => handleSaveConduct(student.studentID._id)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Lưu"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Hủy"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                {student.studentID.conduct}
                              </span>
                              <button
                                onClick={() => handleEditConduct(student.studentID._id, student.studentID.conduct)}
                                className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                                title="Chỉnh sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.studentID.averageScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có học sinh nào trong lớp</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}