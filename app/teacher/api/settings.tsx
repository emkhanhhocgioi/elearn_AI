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

// Update account settings
export const updateAccountSettings = async ( settingsData: any) => {
  try {
    const response = await axios.patch(`${API_URL}/api/teacher/settings`, settingsData, {
      ...getAuthConfig(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Change password
export const changePassword = async (teacherId: string, passwordData: any) => {
  try {
    const response = await axios.post(`${API_URL}/teacher/settings/${teacherId}/change-password`, passwordData, {
        ...getAuthConfig(),
        withCredentials: true,  
    });
    return response.data;
  } catch (error) {
    throw error;
  } 
};

export const getTeacherSettings = async (teacherId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/teacher/settings/${teacherId}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error;
  }
};