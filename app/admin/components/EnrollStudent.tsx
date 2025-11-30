'use client';
import { useState, useEffect } from 'react';
import { Plus, Check, Search, Filter, X } from 'lucide-react';
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
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function EnrollStudent({ classCode, onSuccess, isOpen: externalIsOpen, onOpenChange }: EnrollStudentProps) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  };

  const handleEnrollStudent = async (studentId: string, studentName: string) => {
    try {
      setEnrollingIds(prev => new Set(prev).add(studentId));
      
      const response = await EnrollStudentToClass(studentId, classCode);

      if (response) {
        // Refresh the list after successful enrollment
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
            Chọn học sinh và nhấn nút "Enroll" để thêm vào lớp
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {allStudentsLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-gray-500">Đang tải danh sách học sinh...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">
                  {searchTerm ? 'Không tìm thấy học sinh phù hợp' : 'Không có học sinh nào'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 pr-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name || '-'}</p>
                      <p className="text-xs text-gray-500 truncate">{student.email || '-'}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs flex-shrink-0">
                      <div className="text-center">
                        <p className="text-gray-600">Khối</p>
                        <p className="font-semibold text-gray-900">{student.grade || '-'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">ĐTB</p>
                        <p className="font-semibold text-gray-900">{student.averageScore || '0'}</p>
                      </div>
                      <button
                        onClick={() => handleEnrollStudent(student._id || '', student.name || '')}
                        disabled={enrollingIds.has(student._id || '')}
                        className={`px-3 py-1 rounded flex items-center gap-2 justify-center text-sm font-medium transition-colors whitespace-nowrap ${
                          enrollingIds.has(student._id || '')
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        title="Thêm vào lớp"
                      >
                        {enrollingIds.has(student._id || '') ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
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