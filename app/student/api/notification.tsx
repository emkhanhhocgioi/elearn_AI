import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

export const getStudentNotifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/student/notifications`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};
export const getUnreadNotificationCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/student/notifications/unread-count`, getAuthConfig());  
  
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    throw error;
  }
};
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/student/notifications/${notificationId}/read`, {}, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};