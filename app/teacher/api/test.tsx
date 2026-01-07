import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

interface AnswerData {
    questionID: string;
    answer: string;
    isCorrect: boolean;
}
export const createTest = async (classID: string ,lessonID: string, testtitle: string , 
    closedDate: string, subject: string ) =>{
        try {
            const teacherToken = getAdminToken();
            if (!teacherToken) {
                throw new Error('Token not found in localStorage');
            }   
            const res = await axios.post(`${API_URL}/api/teacher/tests/create`, {
                classID: classID,
                testtitle: testtitle,
                lessonID: lessonID,
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

export const getClassTeacherTest = async (classID: string) => {
    try {
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/teacher/${classID}/tests`, {
            headers: {
                'Content-Type': 'application/json',     
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        return res.data;
    } catch (error) {
        
    }

}

export const getTestDetailById = async (testID: string) => {
    try {
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/teacher/tests/${testID}`, {
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
      testId: string,
      lessonID: string,
      testtitle: string ,
      test_time: number,
      closeDate: string,
) => {
    try {
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }   
        const updateData = {
            testtitle: testtitle,
            lessonID: lessonID,
            test_time: test_time,
            closeDate: closeDate
        };
        const res = await axios.put(`${API_URL}/api/teacher/tests/${testId}`, updateData, {

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
export const deleteTestById = async (testID: string) => {
    try {
        const teacherToken = getAdminToken();  
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.delete(`${API_URL}/api/teacher/tests/${testID}`, {
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
    subjectQuestionType: string,
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
        formData.append('subjectQuestionType', subjectQuestionType);
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

        const res = await axios.post(`${API_URL}/api/teacher/tests/${testId}/questions/single`, formData, {
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

export const addQuestionsToTest = async (
    testId: string,
    questions: Array<{
        difficult: string;
        question: string;
        questionType: string;
        subjectQuestionType: string;
        grade: number;
        solution: string;
        metadata?: string;
        options?: string[];
    }>,
    files?: (File | null)[]
) => {
    try {
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }

        const formData = new FormData();
        
        // Add questions as JSON
        formData.append('questions', JSON.stringify(questions));
        
        // Add files with indexed field names
        if (files) {
            files.forEach((file, index) => {
                if (file) {
                    formData.append(`file_${index}`, file);
                }
            });
        }

        const res = await axios.post(`${API_URL}/api/teacher/tests/${testId}/questions`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("Questions added successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error adding questions to test:', error);
        throw error;
    }
};

export const AI_Generate_Question_Answer = async (
   prompt: string, 
   subject: string
) => {
    try {
        const teacherToken = getAdminToken();  
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.post(`${API_URL}/api/teacher/ai/question-answer/generate`, {
            prompt: prompt,
            subject: subject
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("AI Generated questions response:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error generating questions via AI:', error);
    }
};

export const deleteQuestionFromTest = async (questionId: string) => {
    try {
        const teacherToken = getAdminToken();  
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.delete(`${API_URL}/api/teacher/tests/questions/${questionId}`, {
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
    subjectQuestionType: string,
    grade: number,
    solution: string,
    metadata: string,
    options: string[],
    file?: File | null
) => {
    try {
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }

        const formData = new FormData();
        formData.append('difficult', difficult);
        formData.append('question', question);
        formData.append('questionType', questionType);
        formData.append('subjectQuestionType', subjectQuestionType);
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

        const res = await axios.put(`${API_URL}/api/teacher/tests/questions/${QuestionId}`, formData, {
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
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/teacher/tests/${testId}/submitted-answers`, {
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
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }   
        const res = await axios.put(`${API_URL}/api/teacher/tests/answers/${answerId}/grade`, {
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

export const math_question_generation = async (prompt: string) => {
    try {
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.post(`${API_URL}/api/teacher/tests/question/math/generate`,
            { prompt },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${teacherToken}`
                }
            }
        );
        console.log('Math question generation response:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error generating math question:', error);
    }   
};

export const Ai_grade = async (
    exercise_question: string,
    student_answer: string,
    subject: string
) => {
    try {   
        const teacherToken = getAdminToken();  
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }   
        const res = await axios.post(`${API_URL}/api/teacher/ai/auto-grading`, {
            exercise_question,
            student_answer,
            subject
        }, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("AI grading response:", res.data);
        return res.data;
    } catch (error) {
        console.error('Error in AI grading:', error);
    }   
};
export const Ai_grade_from_file = async (
    exercise_question: string,
    student_answer_file_url: string,
    subject: string
) => {
    try {
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.post(`${API_URL}/api/teacher/ai/auto-grading/file`, {
            exercise_question,
            student_answer_file_url,
            subject
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("AI grading from file response:", res.data);
        return res.data;
    } catch (error) {   
        console.error('Error in AI grading from file:', error);
    }
};

export const Ai_grade_from_image = async (
    exercise_question: string,
    student_answer_image_url: string,
    subject: string
) => {
    try {
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }   
        const res = await axios.post(`${API_URL}/api/teacher/ai/auto-grading/image`, {
            exercise_question,
            student_answer_image_url,
            subject
        }, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("AI grading from image response:", res.data);
        return res.data;
    }
    catch (error) {   
        console.error('Error in AI grading from image:', error);
    }
};


interface RubricCriteria {
    name: string;
    weight: number;
    description?: string;
}

export const Teacher_AI_grading_Base_on_rubic = async (
    answerid: string,
    rubric_criteria: RubricCriteria[],
    subject: string
) => {
    try {   
        const teacherToken = getAdminToken();
        if (!teacherToken) {
            throw new Error('Token not found in localStorage'); 
        }   
        const res = await axios.post(`${API_URL}/api/teacher/ai/auto-grading/rubric`, {
            answerid,
            rubric_criteria,
            subject
        }, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log("Teacher AI grading based on rubric response:", res.data);
        return res.data;
    }
    catch (error) {
        console.error('Error in Teacher AI grading based on rubric:', error);
        throw error;
    }
};