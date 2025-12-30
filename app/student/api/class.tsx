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
export const getStudentSchedule = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/student/schedule`, getAuthConfig());
        console.log("Fetched student schedule:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching student schedule:", error);
        throw error;
    }
}