'use client';
import axios from "axios";
const API_BASE_URL = 'http://localhost:4000/api/admin'; 

export const fetchUserActivityLogs = async () => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API_BASE_URL}/activities`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user activity logs:', error);
        throw error;
    }   
};
export const fetchUserActivityById = async (activityId: string) => {
    try {
        const token = localStorage.getItem('adminToken');   
        const response = await axios.get(`${API_BASE_URL}/activity/${activityId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user activity by ID:', error);
        throw error;
    }
};
export const exportUserActivityLogsToCSV = async () => {
    try {
        const token = localStorage.getItem('adminToken');   
        const response = await axios.get(`${API_BASE_URL}/activities/export/csv`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
        const token = localStorage.getItem('adminToken');   
        const response = await axios.get(`${API_BASE_URL}/test-reports/class/${classId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Test report data:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching test report by class ID:', error);
        throw error;
    }       
};