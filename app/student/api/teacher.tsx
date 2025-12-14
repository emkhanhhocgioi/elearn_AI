import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
const STUDENT_API_URL = `${API_BASE_URL}/student`;

export const getTeacherContacts = async () => {
    try {
        const token = localStorage.getItem("studentToken") || "";   
        const response = await axios.get(`${STUDENT_API_URL}/teachers/contact`, { 
            headers: {  
                Authorization: `Bearer ${token}`,   
            },
        });
        return response.data;
    }   
    catch (error) {
        console.error("Error fetching teacher contacts:", error);
        throw error;
    }
};