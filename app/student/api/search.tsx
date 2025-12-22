'use client';
import axios from "axios";  


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
const STUDENT_API_URL = `${API_BASE_URL}/student`;


export const searchLessonsAndTests = async (query: string) => {
    try {
        const token = localStorage.getItem("studentToken") || "";
        const response = await axios.get(`${STUDENT_API_URL}/search/all`, { 
            params: { query },
            headers: {
                Authorization: `Bearer ${token}`,   
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching lessons and tests:", error);
        throw error;
    }
};

export const searchTeachersByQuery = async (query: string) => {
    try {
        const token = localStorage.getItem("studentToken") || "";   
        const response = await axios.get(`${STUDENT_API_URL}/search/Teachers`, { 
            params: { query },
            headers: {  
                Authorization: `Bearer ${token}`,   
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error searching teachers:", error);
        throw error;
    }       
};