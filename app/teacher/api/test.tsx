import axios from "axios"; 
import test from "node:test";

const api_url = "http://localhost:4000"
interface AnswerData {
    questionID: string;
    answer: string;
    isCorrect: boolean;
}
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
export const editTestById = async (
      testId: String,
      classID: String ,
      testtitle: String ,
      test_time: Number,
      closeDate: String,
) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }   
        const updateData = {
            classID: classID,
            testtitle: testtitle,
            test_time: test_time,
            closeDate: closeDate
        };
        const res = await axios.put(`${api_url}/api/teacher/tests/${testId}`, updateData, {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error editing test by ID:', error);
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
    options: string[],
    file?: File | null
) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }

        const formData = new FormData();
        formData.append('difficult', difficult);
        formData.append('question', question);
        formData.append('questionType', questionType);
        formData.append('grade', grade.toString());
        formData.append('solution', solution);
        
        // Only append metadata if no file is being uploaded
        if (!file && metadata) {
            formData.append('metadata', metadata);
        }
        
        // Append options as JSON string
        formData.append('options', JSON.stringify(options));
        
        // Append file if provided
        if (file) {
            formData.append('file', file);
        }

        const res = await axios.post(`${api_url}/api/teacher/tests/${testId}/questions`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
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
    options: string[],
    file?: File | null
) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }

        const formData = new FormData();
        formData.append('difficult', difficult);
        formData.append('question', question);
        formData.append('questionType', questionType);
        formData.append('grade', grade.toString());
        formData.append('solution', solution);
        
        // Only append metadata if no file is being uploaded
        if (!file && metadata) {
            formData.append('metadata', metadata);
        }
        
        // Append options as JSON string
        formData.append('options', JSON.stringify(options));
        
        // Append file if provided
        if (file) {
            formData.append('file', file);
        }

        const res = await axios.put(`${api_url}/api/teacher/tests/questions/${QuestionId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
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

export const getSubmittedAnswers = async (testId: string) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/teacher/tests/${testId}/submitted-answers`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("Fetched submitted answers:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching submitted answers:', error);
    }
};

export const TeacherGradingAsnwer = async (
    answerId: string,
    grade: number,
    teacherComments: string,
    answerData: AnswerData[]
) => {
    try {   
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }   
        const res = await axios.put(`${api_url}/api/teacher/tests/answers/${answerId}/grade`, {
            teacherGrade:grade,
            teacherComments,
            answerData
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("Answer graded successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error grading answer:', error);
        throw error;
    }
};