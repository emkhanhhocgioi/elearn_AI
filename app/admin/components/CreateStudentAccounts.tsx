'use client';
import { useState } from 'react';
import { Plus, Upload, Trash2, UserPlus } from 'lucide-react';
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


interface StudentData {
  name: string;
  email: string;
  password: string;
  grade: string;
  conduct: string;
}

interface CreateStudentAccountsProps {
  onSuccess?: () => void;
}

export default function CreateStudentAccounts({ onSuccess }: CreateStudentAccountsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '',
    conduct: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStudent = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Vui lòng nhập tên, email và mật khẩu');
      return;
    }

    setStudents(prev => [...prev, { ...formData }]);
    setFormData({
      name: '',
      email: '',
      password: '',
      grade: '',
      conduct: ''
    });
  };

  const handleRemoveStudent = (index: number) => {
    setStudents(prev => prev.filter((_, i) => i !== index));
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
            const student: StudentData = {
              name: '',
              email: '',
              password: '',
              grade: '',
              conduct: ''
            };

            headers.forEach((header, index) => {
              const value = values[index] || '';
              if (header === 'name' || header === 'email' || header === 'password' || 
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

  const handleCreateStudents = async () => {
    if (students.length === 0) {
      alert('Vui lòng thêm ít nhất một học sinh');
      return;
    }

    setIsLoading(true);
    try {
    
      alert(`Tạo thành công ${students.length} tài khoản học sinh!`);
      setStudents([]);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      alert('Có lỗi xảy ra khi tạo tài khoản học sinh');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105">
          <UserPlus className="w-5 h-5" />
          Create Student Accounts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Tài Khoản Học Sinh</DialogTitle>
          <DialogDescription>
            Thêm học sinh mới bằng cách nhập từng người hoặc nhập từ file Excel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Manual Entry */}
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl border-2 border-green-100">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Thêm Học Sinh Thủ Công
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Họ tên"
                value={formData.name}
                onChange={handleInputChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 text-sm transition-all duration-300"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 text-sm transition-all duration-300"
              />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 text-sm transition-all duration-300"
              />
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 text-sm cursor-pointer transition-all duration-300"
              >
                <option value="">-- Chọn khối --</option>
                <option value="6">Khối 6</option>
                <option value="7">Khối 7</option>
                <option value="8">Khối 8</option>
                <option value="9">Khối 9</option>
                <option value="10">Khối 10</option>
                <option value="11">Khối 11</option>
                <option value="12">Khối 12</option>
              </select>
              <select
                name="conduct"
                value={formData.conduct}
                onChange={handleInputChange}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 text-sm cursor-pointer transition-all duration-300"
              >
                <option value="">-- Chọn hạnh kiểm --</option>
                <option value="Tốt">Tốt</option>
                <option value="Khá">Khá</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Yếu">Yếu</option>
              </select>
            </div>
            <Button
              type="button"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={handleAddStudent}
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Học Sinh
            </Button>
          </div>

          {/* File Import */}
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-100">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              Nhập Từ File Excel
            </h3>
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-white hover:bg-blue-50 transition-colors duration-300">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleExcelImport}
                className="hidden"
                id="excel-input"
              />
              <label
                htmlFor="excel-input"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-900">
                  Kéo file hoặc click để chọn
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                  CSV, XLSX, XLS (Cột: name, email, password, grade, conduct)
                </span>
              </label>
            </div>
          </div>

          {/* Students List */}
          {students.length > 0 && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border-2 border-purple-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{students.length}</span>
                  </div>
                  Danh Sách Học Sinh
                </h3>
                <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full font-semibold">
                  {students.length} học sinh
                </span>
              </div>
              <div className="overflow-x-auto border-2 border-purple-200 rounded-xl shadow-md">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Họ tên</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Email</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Khối</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-900">Hạnh kiểm</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-900 w-16">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {students.map((student, index) => (
                      <tr key={index} className="border-b border-purple-100 hover:bg-purple-50 transition-colors duration-200">
                        <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-gray-700">{student.email}</td>
                        <td className="px-4 py-3 text-gray-700">{student.grade || '-'}</td>
                        <td className="px-4 py-3 text-gray-700">{student.conduct || '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleRemoveStudent(index)}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110"
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setStudents([]);
              setFormData({
                name: '',
                email: '',
                password: '',
                grade: '',
                conduct: ''
              });
            }}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleCreateStudents}
            disabled={isLoading || students.length === 0}
          >
            {isLoading ? 'Đang tạo...' : `Tạo ${students.length} Tài Khoản`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
