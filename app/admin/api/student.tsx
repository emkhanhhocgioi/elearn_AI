import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const getAdminToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
};
const getAuthConfig = () => {
  const token = getAdminToken();
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

interface StudentFormData {
  name: string;
  email: string;
  classid: string;
  DOB: string;
  avatar: string;
  password?: string;
  parentContact: string;
  academic_performance: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  conduct: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  averageScore: number;
}
export const getAllStudent = async () => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${API_URL}/api/admin/students`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        console.log(res)
        return res.data;    
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

export const getStudentById = async (StudentID: string) => { 
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${API_URL}/api/admin/students/${StudentID}`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        return res.data;    
    }   
    catch (error) {
        console.error('Error fetching student by ID:', error);
        throw error;
    }
}

export const deleteStudentById = async (StudentID: string) => { 
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.delete(`${API_URL}/api/admin/student/delete/${StudentID}`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        return res.data;    
    }   
    catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
}


export const getStudentByClass = async (classid: string ) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${API_URL}/api/admin/students/class/${classid}`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        console.log(res) 
        return res.data;
    } catch (error) {
        console.error('Error fetching students by class:', error);
    }
}
export const enrollStudentToClass = async (studentID: string, classCode: string) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.post(`${API_URL}/api/class/enroll`, {
            student_id: studentID,
            class_code: classCode
        }, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        return res.data;    
    }                   
    catch (error) {
        console.error('Error enrolling student to class:', error);
        throw error;
    }           
}

export const updateStudent = async (studentID: string, data: StudentFormData) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.put(`${API_URL}/api/admin/student/update/${studentID}`, data, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}
