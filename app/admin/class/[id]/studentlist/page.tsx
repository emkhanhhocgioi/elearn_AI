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
interface StudentEnroll {
  studentID: { 
  _id: string;
  name: string;
  email: string;
  DOB?: string;
  parentContact?: string;
  avatar?: string;
  academic_performance?: string;
  conduct?: string;
  averageScore?: number;
  ClassID?: string;
  enrollmentId?: string;

  class?: string;
  grade?: string;
   }
     timeJoin?: string;
       _id: string;
         classID?: string;
  
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
    const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await getStudentByClass(classId);
      console.log('Students data:', response.students);

      // Extract the array of enrollments from response
      const enrollments = Array.isArray(response.students)
        ? response.students   
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.students)
        ? response.students
        : [];

      // Map the nested structure to flat student objects
      const studentsData = enrollments.map((enrollment: StudentEnroll) => ({
        _id: enrollment.studentID._id,
        name: enrollment.studentID.name,
        email: enrollment.studentID.email,
        DOB: enrollment.studentID.DOB,
        parentContact: enrollment.studentID.parentContact,
        avatar: enrollment.studentID.avatar,
        academic_performance: enrollment.studentID.academic_performance,
        conduct: enrollment.studentID.conduct,
        averageScore: enrollment.studentID.averageScore,
        timeJoin: enrollment.timeJoin,
        enrollmentId: enrollment._id,
        classid: enrollment.classID,
      }));

      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setIsLoading(false);
    }
  };
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
      <div className="mb-8">
        <Button 
          onClick={() => router.back()} 
          variant="ghost" 
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Danh sách học sinh
                </h1>
                <p className="text-gray-600">
                  Tổng số: <span className="font-semibold text-blue-600">{filteredStudents.length}</span> học sinh
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Xuất danh sách
              </Button>
              <Button 
                onClick={() => router.push(`/admin/class/${classId}/addstudent`)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 border border-blue-700 shadow-sm"
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
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
                className="bg-blue-600 hover:bg-blue-700 border border-blue-700 shadow-sm"
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
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700">STT</TableHead>
                  <TableHead className="font-semibold text-gray-700">Mã ghi danh</TableHead>
                  <TableHead className="font-semibold text-gray-700">Họ và tên</TableHead>
                  <TableHead className="font-semibold text-gray-700">Email</TableHead>
                  <TableHead className="font-semibold text-gray-700">Liên hệ phụ huynh</TableHead>
                  <TableHead className="font-semibold text-gray-700">Ngày sinh</TableHead>
                  <TableHead className="font-semibold text-gray-700">Ngày tham gia</TableHead>
                  <TableHead className="font-semibold text-gray-700">Học lực</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={student._id} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-200">
                        {student.enrollmentId || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img 
                            src={student.avatar} 
                            alt={student.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-semibold text-base border border-blue-200">
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
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200"
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
