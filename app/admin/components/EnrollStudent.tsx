'use client';
import { useState, useEffect } from 'react';
import { Check, Search, X } from 'lucide-react';
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
import { getAllStudent } from '@/app/admin/api/student';
import { EnrollStudentToClass } from '@/app/admin/api/class';

// interface StudentData {
//   name: string;
//   class: string;
//   email: string;
//   password: string;
//   grade: string;
//   conduct: string;
// }

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

  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function EnrollStudent({ classCode,  isOpen: externalIsOpen, onOpenChange }: EnrollStudentProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const [allStudents, setAllStudents] = useState<AllStudentData[]>([]);
  const [allStudentsLoading, setAllStudentsLoading] = useState(false);
  const [enrollingIds, setEnrollingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all students when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
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
      setAllStudents([]);
    } finally {
      setAllStudentsLoading(false);
    }
  };

  const filteredStudents = allStudents.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleEnrollStudent = async (studentId: string, studentName: string) => {
    try {
      setEnrollingIds(prev => new Set(prev).add(studentId));
      
      const response = await EnrollStudentToClass(studentId, classCode);

      if (response) {
        // Refresh the list after successful enrollment
         
        alert(`Đã thêm ${studentName} vào lớp thành công`);
        await fetchAllStudents();
      } else {
        alert(`Lỗi: ${studentName} có thể đã được thêm vào lớp hoặc có lỗi xảy ra`);
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="hidden"></div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm Học Sinh Vào Lớp {classCode}</DialogTitle>
          <DialogDescription>
            Chọn học sinh và nhấn nút Enroll để thêm vào lớp
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl px-5 py-3 border-2 border-gray-200 focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-100 transition-all duration-300">
            <Search className="w-5 h-5 text-green-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1.5 hover:bg-green-100 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {allStudentsLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">Đang tải danh sách học sinh...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-green-50 rounded-xl border-2 border-gray-200 py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-600 mb-1">
                  {searchTerm ? 'Không tìm thấy học sinh phù hợp' : 'Không có học sinh nào'}
                </p>
                {searchTerm && (
                  <p className="text-sm text-gray-400">Thử tìm kiếm với từ khóa khác</p>
                )}
              </div>
            ) : (
              <div className="space-y-3 pr-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {student.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">{student.name || '-'}</p>
                        <p className="text-xs text-gray-500 truncate">{student.email || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs flex-shrink-0">
                      <div className="text-center bg-blue-50 px-3 py-2 rounded-lg">
                        <p className="text-gray-500 font-medium">Khối</p>
                        <p className="font-bold text-blue-600 text-sm">{student.grade || '-'}</p>
                      </div>
                      <div className="text-center bg-purple-50 px-3 py-2 rounded-lg">
                        <p className="text-gray-500 font-medium">ĐTB</p>
                        <p className="font-bold text-purple-600 text-sm">{student.averageScore || '0'}</p>
                      </div>
                      <button
                        onClick={() => handleEnrollStudent(student._id || '', student.name || '')}
                        disabled={enrollingIds.has(student._id || '')}
                        className={`px-4 py-2.5 rounded-xl flex items-center gap-2 justify-center text-sm font-semibold transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-lg ${
                          enrollingIds.has(student._id || '')
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105'
                        }`}
                        title="Thêm vào lớp"
                      >
                        {enrollingIds.has(student._id || '') ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang thêm...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Enroll
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={allStudentsLoading}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}