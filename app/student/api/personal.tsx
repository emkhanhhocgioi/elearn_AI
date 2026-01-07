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




export const DailyTestSubjectChange = async (subject: string) => {
    try {
        const response = await axios.put(`${API_URL}/api/student/personal/daily-question-subject`, { subject }, getAuthConfig());
        console.log("AI Response:", response.data);
        return response.data;   
    } catch (error) {
       console.error("Error changing daily test subject:", error);
       throw error;
    }
}

export const getDailyQuestionAnswer = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/student/personal/daily-question-answer`, getAuthConfig());
        console.log("Daily Question Answer Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching daily question answer:", error);
        throw error;
    }   
}


export const generateTeacherComment = async (subject: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/student/ai/generate/teacher_comment`, { subject }, getAuthConfig());
        console.log("AI Response:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error generating teacher comment:", error);
        throw error;
    }
}

export const getStudentInfo = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/student/info`, getAuthConfig());
        return response.data;
    } catch (error) {
        console.error("Error fetching student info:", error);
        throw error;
    }
}

export const AI_suggest_on_recentTest = async (subject: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/student/ai/recent-incorrect-answers`, { subject }, getAuthConfig());
        console.log("Recent Incorrect Answers Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching recent incorrect answers:", error);
        throw error;
    }
}

// Grade Function to get all subjects grade summary
export const getAllSubjectsGrade = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/student/grades/summary`, getAuthConfig());
        console.log("Grade Summary Response:", response);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching grade summary:", error);
        throw error;
    }
}


// AI function to generate English Question and Answer
export const AI_generate_English_QA = async (topic: string, difficulty: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/student/ai/generate/english_qa`, { topic, difficulty }, getAuthConfig());
        console.log("AI English QA Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error generating English QA:", error);
        throw error;
    }
}


// AI function to generate Daily Question and Answer
export const AI_generate_Daily_QA = async (subject: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/student/ai/daily-question-answer`, { subject }, getAuthConfig());
        console.log("AI Daily QA Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error generating Daily QA:", error);
        throw error;
    }
 
}
// AI auto grade function
export const AI_auto_grade = async (exercise_question: string, student_answer: string,subject: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/student/ai/auto-grade`,  {
                exercise_question,
                student_answer,
                subject
            } , getAuthConfig());
        console.log("AI Auto Grade Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in AI auto grade:", error);
        throw error;
    }   
}