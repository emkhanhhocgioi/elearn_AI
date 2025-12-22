'use client';
import axios from "axios";
const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const getSubjectClass = async () =>{
    try {
        const token = localStorage.getItem('teacherToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${api_url}/api/teacher/class/subjects`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Fetched subject class:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching subject class:', error);
        throw error;
    }
}
export const getTeacherClasses = async () => {
    try {
        const token = localStorage.getItem('teacherToken');
        
        const res = await axios.get(`${api_url}/api/teacher/class`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Fetched teacher classes:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching teacher classes:", error);
        throw error;
    }
}
export const deleteClass = async (classId: string) => {
    try {
        const token = localStorage.getItem('teacherToken');
        const res = await axios.delete(`${api_url}/api/teacher/class/${classId}`, {
            headers: {  
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Deleted class response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
    }   
}   