'use client';
import axios from "axios";

const studentToken = localStorage.getItem("studentToken");  
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";


export const getStudentLessons = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/student/lessons`, {
            headers: {  
                "Authorization": `Bearer ${studentToken}`,
            },  
           
        }); 
        return response.data;
    } catch (error) {
        console.error("Error fetching lessons:", error);
        throw error;
    }   
    }   