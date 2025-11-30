'use client';
import { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Edit2, Check } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getAllStudent } from '@/app/teacher/api/student';

interface StudentData {
  name: string;
  class: string;
  email: string;
  password: string;
  grade: string;
  conduct: string;
}

interface AllStudentData {
  _id?: string;
  name?: string;
  email?: string;
  grade?: string;
  conduct?: string;
  class?: string;
  averageScore?: number;
}

interface EnrollStudentProps {
  classCode: string;
  onSuccess?: () => void;
}

export default function EnrollStudent({ classCode, onSuccess }: EnrollStudentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [allStudents, setAllStudents] = useState<AllStudentData[]>([]);
  const [allStudentsLoading, setAllStudentsLoading] = useState(false);
  const [enrollingIds, setEnrollingIds] = useState<Set<string>>(new Set());

  // Fetch all students when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchAllStudents();
    }
  }, [isOpen]);

  const fetchAllStudents = async () => {
    setAllStudentsLoading(true);
    try {
      const response = await getAllStudent();
      console.log('All students response:', response);
      // Map nested data structure to flat array
      const studentsData = response?.data?.students || response?.data || [];
      setAllStudents(studentsData);
    } catch (error) {
      console.error('Error fetching all students:', error);
      alert('Có lỗi xảy ra khi tải danh sách học sinh');
      setAllStudents([]);
    } finally {
      setAllStudentsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudents(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const data = event.target?.result as string;
          const lines = data.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            alert('File Excel trống hoặc không hợp lệ');
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          const importedStudents: StudentData[] = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const student: any = {
              class_code: classCode,
              subjects: {
                math: '',
                english: ''
              }
            };

            headers.forEach((header, index) => {
              const value = values[index] || '';
              if (header.startsWith('subjects.')) {
                const subject = header.split('.')[1];
                student.subjects[subject] = value ? parseInt(value) : '';
              } else if (header === 'name' || header === 'email' || header === 'password' || 
                        header === 'grade' || header === 'conduct') {
                student[header] = value;
              }
            });

            return student;
          }).filter(s => s.name && s.email && s.password);

          setStudents(prev => [...prev, ...importedStudents]);
          alert(`Nhập thành công ${importedStudents.length} học sinh từ Excel`);
          e.target.value = '';
        } catch (parseError) {
          alert('Lỗi khi xử lý file Excel');
          console.error(parseError);
        }
      };
      fileReader.readAsText(file);
    } catch (error) {
      alert('Có lỗi xảy ra khi nhập file');
      console.error(error);
    }
  };

  const handleEnrollStudent = async (studentId: string, studentName: string) => {
    try {
      setEnrollingIds(prev => new Set(prev).add(studentId));
      
      const response = await fetch('http://localhost:4000/api/class/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('teacherToken')}`
        },
        body: JSON.stringify({
          student_id: studentId,
          class_code: classCode
        })
      });

      if (response.ok) {
        alert(`Thêm ${studentName} vào lớp thành công!`);
        // Refresh the list
        await fetchAllStudents();
        onSuccess?.();
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || 'Có lỗi xảy ra khi thêm học sinh vào lớp'}`);
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      alert(`Có lỗi xảy ra: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setEnrollingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Enroll Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Học Sinh - Lớp {classCode}</DialogTitle>
          <DialogDescription>
            Chọn học sinh từ danh sách để thêm vào lớp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {allStudentsLoading ? (
            <div className="text-center py-8 text-gray-500">
              Đang tải danh sách học sinh...
            </div>
          ) : allStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              Không có học sinh nào
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 w-12">STT</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Họ tên</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Email</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 w-16">Khối</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-900 w-20">Hạnh kiểm</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-900 w-16">Điểm TB</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-900 w-24">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {allStudents.map((student, index) => (
                    <tr key={student._id} className="border-b border-gray-200 hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-900 font-medium">{index + 1}</td>
                      <td className="px-4 py-2 text-gray-900 font-medium">{student.name || '-'}</td>
                      <td className="px-4 py-2 text-gray-700">{student.email || '-'}</td>
                      <td className="px-4 py-2 text-gray-700 text-center">{student.grade || '-'}</td>
                      <td className="px-4 py-2 text-gray-700 text-center">{student.conduct || '-'}</td>
                      <td className="px-4 py-2 text-gray-700 text-center">{student.averageScore || '0'}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleEnrollStudent(student._id || '', student.name || '')}
                          disabled={enrollingIds.has(student._id || '')}
                          className={`px-3 py-1 rounded flex items-center gap-2 justify-center text-sm font-medium transition-colors ${
                            enrollingIds.has(student._id || '')
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                          title="Thêm vào lớp"
                        >
                          {enrollingIds.has(student._id || '') ? (
                            <>
                              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Thêm
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
            }}
            disabled={isLoading}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}