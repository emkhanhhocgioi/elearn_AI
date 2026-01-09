import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const STUDENT_API_URL = `${API_BASE_URL}/api/student`;

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

export const getTeacherContacts = async () => {
    try {
        const response = await axios.get(`${STUDENT_API_URL}/teachers/contact`, getAuthConfig());
        return response.data;
    }   
    catch (error) {
        console.error("Error fetching teacher contacts:", error);
        throw error;
    }
};