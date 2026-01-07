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

export const getTeacherInfo = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/teacher/profile`, getAuthConfig());
        console.log("Fetched teacher info:", res.data); 
        return res.data.teacher;
    } catch (error) {
        console.error("Error fetching teacher info:", error);
        throw error;
    }
};

export const updateAccountSettings = async (settingsData: any) => {
    try {
        const res = await axios.patch(`${API_URL}/api/teacher/settings`, settingsData, getAuthConfig());    
        console.log("Updated account settings response:", res.data);
        return res.data;
    }
    catch (error) {
        console.error("Error updating account settings:", error);
        throw error;
    }
};
export const changePassword = async (passwordData: any) => {
    try {
        const res = await axios.patch(`${API_URL}/api/teacher/settings/password`, passwordData, getAuthConfig());
        console.log("Changed password response:", res.data);
        return res.data;
    }
    catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};