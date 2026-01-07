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

export const getStudentClassTest = async () => { 
    try {
        const studentToken = getStudentToken();
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/student/tests`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        console.log('Fetched student class tests:', res.data);  
        return res.data;
    } catch (error) {   
        console.error('Error fetching student class tests:', error);
    }
};

export const getTestQuestionsDetail = async (testId: string) => {   
    try {
        const studentToken = getStudentToken();
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/student/test/${testId}`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        console.log('Fetched test questions detail:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching test questions detail:', error);
    }
};

export const getTestGradingDetail = async (testId: string) => {
    try {
        const studentToken = getStudentToken();
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/student/test/grading/${testId}`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        console.log('Fetched test grading detail:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching test grading detail:', error);
    }
};

export const uploadTestAnswerFile = async (formData: FormData) => {
    try {
        const studentToken = getStudentToken();
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.post(`${API_URL}/api/student/test/answer/file-upload`, formData, getAuthConfig());
        console.log('Uploaded test answer file:', res.data);
        return res.data;
    }
    catch (error) {
        console.error('Error uploading test answer file:', error);
        throw error;
    }
};

export const editTestAnswer = async (testId: string, questionId: string, answer: string) => {
    try {
        const studentToken = getStudentToken();
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.put(`${API_URL}/api/student/test/answer/edit`, 
            {
                testId,
                questionId,
                answer
            },
            {
                ...getAuthConfig(),
                headers: {
                    ...getAuthConfig().headers,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Edited test answer:', res.data);
        return res.data;
    }
    catch (error) {
        console.error('Error editing test answer:', error);
        throw error;
    }
};

export const editTestAnswerFile = async (formData: FormData) => {
    try {
        const studentToken = getStudentToken();
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.put(`${API_URL}/api/student/test/answer/file-edit`, formData, getAuthConfig());
        console.log('Edited test answer file:', res.data);
        return res.data;
    }
    catch (error) {
        console.error('Error editing test answer file:', error);
        throw error;
    }
};  
