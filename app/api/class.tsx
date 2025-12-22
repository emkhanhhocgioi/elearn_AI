'use client';
import axios from "axios"; 

const api_url = "http://localhost:4000"

interface Student {
}
export const createClass = async (classCode: string,class_subject: string,class_year: string) => {
    try {
        const token = localStorage.getItem('teacherToken');
        
        console.log(token)
        if (!token) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.post(`${api_url}/api/class/create`, {
            class_code: classCode,
            class_subject: class_subject,
            class_year: class_year
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

export const createStudentAccounts = async (students: any[]) => {
    try {
        const token = localStorage.getItem('teacherToken');
        
        if (!token) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.post(`${api_url}/api/auth/student/create`, {
            students: students
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;

    } catch (error) {
        console.error('Error creating student accounts:', error);
        throw error;
    }
}

export const getAllClasses = async () => {
    try {
        const token = localStorage.getItem('teacherToken');
        
        const res = await axios.get(`${api_url}/api/class/getAll`, {
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

export const getTeacherClasses = async () => {
    try {
        const token = localStorage.getItem('teacherToken');
        
        const res = await axios.get(`${api_url}/api/class/get`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching teacher classes:", error);
        throw error;
    }
}

export const deleteClass = async (classId: string) => {
    try {
        const token = localStorage.getItem('teacherToken');
        
        const res = await axios.delete(`${api_url}/api/class/delete/${classId}`, {
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
