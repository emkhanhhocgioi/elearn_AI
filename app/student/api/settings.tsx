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

// Update account settings (notifications, darkMode, TestReminder)
export const updateAccountSettings = async (settings: {
  notifications?: boolean;
  darkMode?: boolean;
  TestReminder?: boolean;
}) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/student/settings/account`,
      settings,
      getAuthConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi cập nhật cài đặt" };
  }
};

// Change password
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/student/settings/change-password`,
      data,
      getAuthConfig()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi đổi mật khẩu" };
  }
};
