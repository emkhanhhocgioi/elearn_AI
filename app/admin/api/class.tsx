import axios from "axios"; 

const api_url = "http://localhost:4000"

export const createClass = async (classCode: String,teacher_id:String , class_year: String) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.post(`${api_url}/api/admin/class/create`, {
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
        const res = await axios.get(`${api_url}/api/class/${classId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Class data:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching class by ID:", error);
        throw error;
    }   
}

export const getAllClasses = async () => {
    try {
        const token = localStorage.getItem('adminToken');
        
        const res = await axios.get(`${api_url}/api/class/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching classes:", error);
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
    teacherId?: string, 
    classYear?: string, 
    averageGrade?: number
) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        
        const updateData: any = {};
        if (classCode !== undefined) updateData.class_code = classCode;
        if (teacherId !== undefined) updateData.teacher_id = teacherId;
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

export const updateSubjectTeacher = async (
    classId: string,
    subjectField: string,
    teacherId: string
) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        
        const res = await axios.put(
            `${api_url}/api/class/${classId}/subject-teacher`,
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
