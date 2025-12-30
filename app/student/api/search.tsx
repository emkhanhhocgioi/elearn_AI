import axios from "axios";  

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
const STUDENT_API_URL = `${API_BASE_URL}/student`;

const getStudentToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("studentToken");
  }
  return null;
};
const getAuthConfig = () => {
  const token = getStudentToken();
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};


export const searchLessonsAndTests = async (query: string) => {
    try {
        const response = await axios.get(`${STUDENT_API_URL}/search/all`, { 
            params: { query },
            ...getAuthConfig()
        });
        return response.data;
    } catch (error) {
        console.error("Error searching lessons and tests:", error);
        throw error;
    }
};

export const searchTeachersByQuery = async (query: string) => {
    try {
        const response = await axios.get(`${STUDENT_API_URL}/search/Teachers`, { 
            params: { query },
            ...getAuthConfig()
        });
        return response.data;
    }
    catch (error) {
        console.error("Error searching teachers:", error);
        throw error;
    }       
};