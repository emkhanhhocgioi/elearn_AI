import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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


export const getStudentLessons = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/student/lessons`, getAuthConfig()); 
        return response.data;
    } catch (error) {
        console.error("Error fetching lessons:", error);
        throw error;
    }   
    }   