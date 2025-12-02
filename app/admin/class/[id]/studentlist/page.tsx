'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search, UserPlus, Mail, Phone, Calendar, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStudentByClass } from '@/app/admin/api/student';

interface Student {
  _id: string;
  name: string;
  email: string;
  DOB?: string;
  parentContact?: string;
  avatar?: string;
  academic_performance?: string;
  conduct?: string;
  averageScore?: number;
  timeJoin?: string;
  enrollmentId?: string;
  classid?: string;
  class?: string;
  grade?: string;
}

export default function StudentListPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.enrollmentId && student.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await getStudentByClass(classId);
      console.log('Students data:', response);
      
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
      } else if (response && response.data && Array.isArray(response.data)) {
        setStudents(response.data);
        setFilteredStudents(response.data);
      } else if (response && Array.isArray(response)) {
        setStudents(response);
        setFilteredStudents(response);
      } else {
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Chức năng xuất danh sách đang được phát triển');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={() => router.back()} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Danh sách học sinh
              </h1>
              <p className="text-gray-600">
                Tổng số: <span className="font-semibold text-blue-600">{filteredStudents.length}</span> học sinh
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Xuất danh sách
              </Button>
              <Button 
                onClick={() => router.push(`/admin/class/${classId}/addstudent`)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Thêm học sinh
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, mã học sinh hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Không tìm thấy học sinh' : 'Chưa có học sinh'}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm 
                ? 'Không có học sinh nào phù hợp với từ khóa tìm kiếm' 
                : 'Lớp học chưa có học sinh nào. Hãy thêm học sinh vào lớp.'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => router.push(`/admin/class/${classId}/addstudent`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm học sinh ngay
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">STT</TableHead>
                  <TableHead className="font-semibold">Mã ghi danh</TableHead>
                  <TableHead className="font-semibold">Họ và tên</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Liên hệ phụ huynh</TableHead>
                  <TableHead className="font-semibold">Ngày sinh</TableHead>
                  <TableHead className="font-semibold">Ngày tham gia</TableHead>
                  <TableHead className="font-semibold">Học lực</TableHead>
                  <TableHead className="font-semibold text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={student._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {student.enrollmentId || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img 
                            src={student.avatar} 
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-gray-900">
                          {student.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{student.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{student.parentContact || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {student.DOB 
                            ? new Date(student.DOB).toLocaleDateString('vi-VN')
                            : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {student.timeJoin 
                        ? new Date(student.timeJoin).toLocaleDateString('vi-VN')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        student.academic_performance === 'Tốt' 
                          ? 'bg-green-100 text-green-700' 
                          : student.academic_performance === 'Khá'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {student.academic_performance || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/student/${student._id}`)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
