import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const getAdminToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("teacherToken");
  }
  return null;
};

const getAuthConfig = () => {
  const token = getAdminToken();
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};
export const getSubjectClass = async () =>{
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${API_URL}/api/teacher/class/subjects`, getAuthConfig());
        console.log('Fetched subject class:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching subject class:', error);
        throw error;
    }
}
export const getTeacherClasses = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/teacher/class`, getAuthConfig());
        console.log("Fetched teacher classes:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching teacher classes:", error);
        throw error;
    }
}
export const deleteClass = async (classId: string) => {
    try {
        const res = await axios.delete(`${API_URL}/api/teacher/class/${classId}`, getAuthConfig());
        console.log("Deleted class response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
    }   
}   

export const getTeacherSchedule = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/teacher/schedule`, getAuthConfig());
        console.log("Fetched teacher schedule:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching teacher schedule:", error);
        throw error;
    }
}

