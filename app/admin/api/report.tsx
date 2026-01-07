import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_BASE_URL = `${API_URL}/api/admin`;

const getAdminToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
};
const getAuthConfig = () => {
  const token = getAdminToken();
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
}; 

export const fetchUserActivityLogs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/activities`, getAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Error fetching user activity logs:', error);
        throw error;
    }   
};
export const fetchUserActivityById = async (activityId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/activity/${activityId}`, getAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Error fetching user activity by ID:', error);
        throw error;
    }
};
export const exportUserActivityLogsToCSV = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/activities/export/csv`, {
            ...getAuthConfig(),
            responseType: 'blob', // Important for file download
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting user activity logs to CSV:', error);
        throw error;
    }
};

// Test Report API
export const getTestReportByClassId = async (classId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/test-reports/class/${classId}`, getAuthConfig());
        console.log("Test report data:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching test report by class ID:', error);
        throw error;
    }       
};