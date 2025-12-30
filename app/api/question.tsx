
import axios from 'axios';
const api_url = "http://localhost:4000"

export async function addQuestion(testid: string, difficult: string, question: string, questionType: string, grade: string, solution: string, metadata: string) {
    try {
        const token = localStorage.getItem('teacherToken');
        
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.post(`${api_url}/api/test/question/add`, {
            testid,
            difficult,
            question,
            questionType,
            grade,
            solution,
            metadata,
            
        }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data;

    } catch (error) {
        console.error('Error adding question:', error);
        throw error;
    }
}

export async function getTestDetail(testid: string) {
      try {
        const token = localStorage.getItem('teacherToken');
        
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/test/question/fetch/${testid}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;

    } catch (error) {
        console.error('Error fetching test questions:', error);
        throw error;
    }
}

export async function getTestQuestions(testid: string) {
    try {
        const token = localStorage.getItem('teacherToken');
        
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/test/question/fetch/${testid}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;

    } catch (error) {
        console.error('Error fetching test questions:', error);
        throw error;
    }
}

export async function updateQuestion(questionid: string, testid: string, difficult: string, question: string, questionType: string, grade: number, solution: string, metadata: string) {
    try {
        const token = localStorage.getItem('teacherToken');
        
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.put(`${api_url}/api/test/question/edit`, {
            questionId: questionid,
            testid,
            difficult,
            question,
            questionType,
            grade,
            solution,
            metadata
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;

    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
}

export async function deleteQuestion(questionIds: string[]) {
    try {
        const token = localStorage.getItem('teacherToken');
        
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.post(`${api_url}/api/test/question/delete`, {
            questionIds
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;

    } catch (error) {
        console.error('Error deleting question:', error);
        throw error;
    }
}