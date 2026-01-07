import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_BASE_URL = `${API_URL}/api/teacher`;

// Interface for email data
interface EmailData {
  subject: string;
  message: string;
  recipients?: string[];
}

interface HomeroomEmailData extends EmailData {
  classId?: string;
}

interface SubjectClassEmailData extends EmailData {
  classId: string;
  subjectId: string;
}


const getAuthToken = () => {
  return localStorage.getItem('teacherToken') || sessionStorage.getItem('teacherToken');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};


export const sendEmailToHomeroomClass = async (emailData: HomeroomEmailData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/send-email/homeroom`,
      emailData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to send email to homeroom class');
    }
    throw error;
  }
};


export const sendEmailToSubjectClass = async (emailData: SubjectClassEmailData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/send-email/subject/class`,
      emailData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to send email to subject class');
    }
    throw error;
  }
};

export const sendmailtoStudent = async (studentid: string , message: string) => {
  try {
    const response = await axios.post(
        `${API_BASE_URL}/send-email/student/${studentid}`,  
        { message },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to send email to student');
    }   
    throw error;
  }
};