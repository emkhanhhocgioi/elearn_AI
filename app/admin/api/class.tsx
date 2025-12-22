'use client';
import axios from "axios"; 

const api_url = "http://localhost:4000"
export interface StudentData {
  name: string;
  classid: string;
  DOB: string;
  avatar: string;
  email: string;
  password: string;
  parentContact: string;
  academic_performance?: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  conduct?: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  averageScore?: number;
}

interface ClassData {
  class_code: string;
  class_year: string;
  teacher_id: string;
    class_teacher?: string;
    class_avarage_grade?: number;
}

export const createClass = async (classCode: string,teacher_id:string , class_year: string) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.post(`${api_url}/api/admin/classes/create`, {
            class_code: classCode,
            class_year: class_year,
            teacher_id: teacher_id,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;

    } catch (error) {
        console.error('Error creating class:', error);
        throw error;
    }
}

export const getClassById = async (classId: string) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${api_url}/api/admin/class/${classId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Class data:", res.data.class);
        return res.data.class;
    } catch (error) {
        console.error("Error fetching class by ID:", error);
        throw error;
    }   
}

export const getAllClasses = async () => {
    try {
        const token = localStorage.getItem('adminToken');
        
        const res = await axios.get(`${api_url}/api/admin/classes`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("All classes data:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching classes:", error);
        throw error;
    }
}


export const createMutilpleStudentAccount = async (students: StudentData[], classid: string) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.post(
            `${api_url}/api/admin/class/add-students/${classid}`,
            { classid, students },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error creating multiple student accounts:', error);
        throw error;
    }
}


export const EnrollStudentToClass = async (studentId: string, classId: string) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.post(`${api_url}/api/class/enroll`, {
            studentid: studentId,
            classid: classId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error enrolling student:", error);
        throw error;
    }
}
export const deleteClass = async (classId: string) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.delete(`${api_url}/api/admin/class/delete/${classId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
    }
}

export const updateClass = async (
    classId: string, 
    classCode?: string, 
    class_teacher?: string, 
    classYear?: string, 
    averageGrade?: number
) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        
        const updateData: Partial<ClassData> = {};
        if (classCode !== undefined) updateData.class_code = classCode;
        if (class_teacher !== undefined) updateData.class_teacher = class_teacher;
        if (classYear !== undefined) updateData.class_year = classYear;
        if (averageGrade !== undefined) updateData.class_avarage_grade = averageGrade;
        
        const res = await axios.put(`${api_url}/api/admin/class/update/${classId}`, updateData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error updating class:", error);
        throw error;
    }
}
export const getClassSubjectTeachers = async (classId: string) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found'); 
        const res = await axios.get(`${api_url}/api/admin/class/${classId}/subject-teachers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Class subject teachers data:", res.data);  
        return res.data;
    } catch (error) {
        console.error("Error fetching class subject teachers:", error);
        throw error;
    }   
}
export const updateSubjectTeacher = async (
    classId: string,
    subjectField: string,
    teacherId: string
) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        
        const res = await axios.put(
            `${api_url}/api/admin/class/subject-teacher/${classId}`,
            {
                subjectField,
                teacherId
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error updating subject teacher:", error);
        throw error;
    }
}
