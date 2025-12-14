import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const getStudentNotifications = async () => {
  try {
    const token = localStorage.getItem("studentToken");
    const response = await axios.get(`${API_BASE_URL}/student/notifications`, {
        headers: {  
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const token = localStorage.getItem("studentToken"); 
    const response = await axios.patch(`${API_BASE_URL}/student/notifications/${notificationId}/read`, {}, {
        headers: {  
            Authorization: `Bearer ${token}` 
        }
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};