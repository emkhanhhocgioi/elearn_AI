'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, UserPlus, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createMutilpleStudentAccount, StudentData } from '../../../api/class';

export default function AddStudentPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [students, setStudents] = useState<StudentData[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for new student
  const [formData, setFormData] = useState<StudentData>({
    name: '',
    classid: classId,
    DOB: '',
    avatar: '',
    email: '',
    password: '',
    parentContact: '',
    academic_performance: 'Tốt',
    conduct: 'Tốt',
    averageScore: 0
  });

  const updateFormField = (field: keyof StudentData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const addStudentToList = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.DOB || !formData.parentContact) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    setStudents([...students, { ...formData }]);
    
    // Reset form
    setFormData({
      name: '',
      classid: classId,
      DOB: '',
      avatar: '',
      email: '',
      password: '',
      parentContact: '',
      academic_performance: 'Tốt',
      conduct: 'Tốt',
      averageScore: 0
    });
  };

  const removeStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (students.length === 0) {
      alert('Vui lòng thêm ít nhất một học sinh!');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createMutilpleStudentAccount(students, classId);
      alert('Thêm danh sách học sinh thành công!');
      setStudents([]);
      setShowConfirmDialog(false);
      router.back();
    } catch (error) {
      console.error('Error creating students:', error);
      alert('Có lỗi xảy ra khi thêm học sinh. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (students.length > 0) {
      if (confirm('Bạn có chắc muốn quay lại? Dữ liệu chưa lưu sẽ bị mất.')) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thêm danh sách học sinh
          </h1>
          <p className="text-gray-600">
            Nhập thông tin học sinh bên trái và thêm vào danh sách. Danh sách học sinh sẽ hiển thị bên phải.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Input Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin học sinh</h2>
          
          <div className="space-y-4">
            {/* Họ tên */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormField('email', e.target.value)}
                placeholder="student@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormField('password', e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {/* Ngày sinh */}
            <div className="space-y-2">
              <Label htmlFor="dob">
                Ngày sinh <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.DOB}
                onChange={(e) => updateFormField('DOB', e.target.value)}
              />
            </div>

            {/* Số điện thoại phụ huynh */}
            <div className="space-y-2">
              <Label htmlFor="parent">
                SĐT phụ huynh <span className="text-red-500">*</span>
              </Label>
              <Input
                id="parent"
                type="tel"
                value={formData.parentContact}
                onChange={(e) => updateFormField('parentContact', e.target.value)}
                placeholder="0123456789"
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                type="url"
                value={formData.avatar}
                onChange={(e) => updateFormField('avatar', e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Học lực */}
            <div className="space-y-2">
              <Label htmlFor="academic">Học lực</Label>
              <Select
                value={formData.academic_performance}
                onValueChange={(value) => updateFormField('academic_performance', value as 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu')}
              >
                <SelectTrigger id="academic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tốt">Tốt</SelectItem>
                  <SelectItem value="Khá">Khá</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Yếu">Yếu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hạnh kiểm */}
            <div className="space-y-2">
              <Label htmlFor="conduct">Hạnh kiểm</Label>
              <Select
                value={formData.conduct}
                onValueChange={(value) => updateFormField('conduct', value as 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu')}
              >
                <SelectTrigger id="conduct">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tốt">Tốt</SelectItem>
                  <SelectItem value="Khá">Khá</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Yếu">Yếu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Điểm trung bình */}
            <div className="space-y-2">
              <Label htmlFor="score">Điểm trung bình</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.averageScore}
                onChange={(e) => updateFormField('averageScore', parseFloat(e.target.value) || 0)}
                placeholder="8.5"
              />
            </div>

            {/* Add Button */}
            <Button 
              onClick={addStudentToList}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm vào danh sách
            </Button>
          </div>
        </div>

        {/* Right Side - Students Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Danh sách học sinh ({students.length})
            </h2>
            {students.length > 0 && (
              <Button 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu tất cả
              </Button>
            )}
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Chưa có học sinh nào</p>
           <p className="text-sm">
  Điền thông tin bên trái và nhấn Thêm vào danh sách
</p>

            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ngày sinh</TableHead>
                    <TableHead>SĐT PH</TableHead>
                    <TableHead>Học lực</TableHead>
                    <TableHead>Hạnh kiểm</TableHead>
                    <TableHead>ĐTB</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-sm">{student.email}</TableCell>
                      <TableCell className="text-sm">
                        {student.DOB ? new Date(student.DOB).toLocaleDateString('vi-VN') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm">{student.parentContact}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          student.academic_performance === 'Tốt' ? 'bg-green-100 text-green-700' :
                          student.academic_performance === 'Khá' ? 'bg-blue-100 text-blue-700' :
                          student.academic_performance === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {student.academic_performance}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          student.conduct === 'Tốt' ? 'bg-green-100 text-green-700' :
                          student.conduct === 'Khá' ? 'bg-blue-100 text-blue-700' :
                          student.conduct === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {student.conduct}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{student.averageScore}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => removeStudent(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thêm học sinh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thêm {students.length} học sinh vào lớp học và tạo tài khoản cho họ?
              Hành động này sẽ tạo tài khoản đăng nhập cho tất cả học sinh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
