import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/teacher/analytics';

export const fetchClassAverageGrades = async () => {
  try {
    const token = localStorage.getItem('teacherToken');
    const response = await axios.get(`${API_BASE_URL}/class/average-grades`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },  
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching class average grades:', error);
    throw error;
  } 
};

export const fetchTestsAnalytics = async () => {
    try {
        const token = localStorage.getItem('teacherToken'); 
        const response = await axios.get(`${API_BASE_URL}/tests/performance`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tests analytics:', error);
        throw error;
    }
};
