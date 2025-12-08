import axios from "axios";


const studentToken = localStorage.getItem("studentToken");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const generateTeacherComment = async (subject: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/student/ai/generate/teacher_comment`, { subject }, {
            headers: {
                "Authorization": `Bearer ${studentToken}`,
            },
        });
        console.log("AI Response:", response.data);
        return response.data;

    } catch (error) {
        
    }
}