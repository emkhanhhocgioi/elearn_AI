import axios from "axios";

const api_url = "http://localhost:4000";

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
        const res = await axios.get(`${api_url}/api/student/all`, getAuthConfig());
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
        const res = await axios.post(`${api_url}/api/class/enrollStudent`, {
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