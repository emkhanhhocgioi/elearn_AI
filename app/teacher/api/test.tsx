import axios from "axios"; 

const api_url = "http://localhost:4000"

export const createTest = async (classID: String , testtitle: String , 
    participants: Number, closedDate: String, subject: String ) =>{
        try {
            const teacherToken = localStorage.getItem('teacherToken');
            if (!teacherToken) {
                throw new Error('Token not found in localStorage');
            }   
            const res = await axios.post(`${api_url}/api/teacher/tests/create`, {
                classID: classID,
                testtitle: testtitle,
                participants: participants,
                closeDate: closedDate,
                subject: subject
            }, {
                headers: {

                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${teacherToken}`
                }
            });
            return res.data;
        } catch (error) {
            console.error('Error creating test:', error);   
        }
    };

export const getClassTeacherTest = async (classID: String) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/teacher/${classID}/tests`, {
            headers: {
                'Content-Type': 'application/json',     
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        return res.data;
    } catch (error) {
        
    }

}

export const getTestDetailById = async (testID: String) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/teacher/tests/${testID}`, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("Fetched test detail by ID:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching test by ID:', error);
    }   
}

export const deleteTestById = async (testID: String) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');  
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.delete(`${api_url}/api/teacher/tests/${testID}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("Deleted test response:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error deleting test by ID:', error);
    }       
}
export const addQuestionToTest = async (
    testId: string,
    difficult: string,
    question: string,
    questionType: string,
    grade: number,
    solution: string,
    metadata: string,
    options: string[]
) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.post(`${api_url}/api/teacher/tests/${testId}/questions`, {
            difficult,
            question,
            questionType,
            grade,
            solution,
            metadata,
            options
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("Question added successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error adding question to test:', error);
        throw error;
    }
};

export const deleteQuestionFromTest = async (questionId: string) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');  
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.delete(`${api_url}/api/teacher/tests/questions/${questionId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("Deleted question response:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error deleting question by ID:', error);
    }       
}   

export const UpdateQuestion = async (
    QuestionId: string,
    difficult: string,
    question: string,
    questionType: string,
    grade: number,
    solution: string,
    metadata: string,
    options: string[]
) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.put(`${api_url}/api/teacher/tests/questions/${QuestionId}`, {
            difficult,
            question,
            questionType,
            grade,
            solution,
            metadata,
            options
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("Question updated successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
};