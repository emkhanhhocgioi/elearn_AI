import axios from "axios";

const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const getStudentClassTest = async () => { 
    try {
        const studentToken = localStorage.getItem('studentToken');
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/student/tests`, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${studentToken}`
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
        const studentToken = localStorage.getItem('studentToken');
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/student/test/${testId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
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
        const studentToken = localStorage.getItem('studentToken');
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/student/test/grading/${testId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
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
        const studentToken = localStorage.getItem('studentToken');
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.post(`${api_url}/api/student/test/answer/file-upload`, formData, {
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
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
        const studentToken = localStorage.getItem('studentToken');
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.put(`${api_url}/api/student/test/answer/edit`, 
            {
                testId,
                questionId,
                answer
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${studentToken}`
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
        const studentToken = localStorage.getItem('studentToken');
        if (!studentToken) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.put(`${api_url}/api/student/test/answer/file-edit`, formData, {
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });
        console.log('Edited test answer file:', res.data);
        return res.data;
    }
    catch (error) {
        console.error('Error editing test answer file:', error);
        throw error;
    }
};  
