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

export const getAllStudent = async () => {
    try {
        const token = getAdminToken();
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/student/all`, getAuthConfig());
        console.log(res.data)
        return res.data;    
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

export const enrollStudentToClass = async (studentID: string, classID: string) => {
    try {
        const token = getAdminToken();
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.post(`${API_URL}/api/class/enrollStudent`, {
            studentID: studentID,
            classID: classID
        }, getAuthConfig());
        return res.data;    
    }                   
    catch (error) {
        console.error('Error enrolling student to class:', error);
        throw error;
    }           

}  

// Get student average grade by subject
export const getStudentAverageGradeBySubject = async (studentId: string, subject: string) => {
    try {
        const token = getAdminToken();
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/teacher/analytics/student/average-grade`, {
            ...getAuthConfig(),
            params: {
                studentId: studentId,
                subject: subject
            }
        });
        return res.data;    
    } catch (error) {
        console.error('Error fetching student average grade:', error);
        throw error;
    }
}

// Update all students' average grades in a class for a subject
export const updateClassStudentsAverageGrade = async (classId: string, subject: string) => {
    try {
        const token = getAdminToken();
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.post(`${API_URL}/api/teacher/analytics/class/update-average-grades`, {
            classId: classId,
            subject: subject
        }, getAuthConfig());
        return res.data;    
    } catch (error) {
        console.error('Error updating students average grades:', error);
        throw error;
    }
}

// Get all subjects average for all students in a class
export const getClassStudentsAllSubjectsAverage = async (classId: string) => {
    try {
        const token = getAdminToken();
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/teacher/analytics/class/students/all-subjects-average`, {
            ...getAuthConfig(),
            params: {
                classId: classId
            }
        });
        return res.data;    
    } catch (error) {
        console.error('Error fetching class students all subjects average:', error);
        throw error;
    }
} 


export const UpdateStudentConductAndPerformance = async (studentId: string, conduct: string, performance: string) => {
    try {
        const token = getAdminToken();
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.patch(`${API_URL}/api/teacher/students/${studentId}`, {
            conduct: conduct,
            performance: performance
        }, getAuthConfig());
        return res.data;    
    } catch (error) {
        console.error('Error updating student conduct and performance:', error);
        throw error;
    }   
}