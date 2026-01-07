import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_BASE_URL = `${API_URL}/api/teacher/analytics`;

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

export const fetchClassAverageGrades = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/class/average-grades`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Error fetching class average grades:', error);
    throw error;
  } 
};

export const fetchTestsAnalytics = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tests/performance`, getAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Error fetching tests analytics:', error);
        throw error;
    }
};
