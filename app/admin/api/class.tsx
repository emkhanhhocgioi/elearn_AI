import axios from "axios"; 

const api_url = "http://localhost:4000"

export const createClass = async (classCode: String, class_subject: String, class_year: String) => {
    try {
        const token = localStorage.getItem('adminToken');
        
        console.log(token)
        if (!token) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.post(`${api_url}/api/class/create`, {
            class_code: classCode,
            class_subject: class_subject,
            class_year: class_year
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;

    } catch (error) {
        console.error('Error creating class:', error);
        throw error;
    }
}

export const createStudentAccounts = async (students: any[]) => {
    try {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
            throw new Error('Token not found in localStorage');
        }

        const res = await axios.post(`${api_url}/api/auth/student/create`, {
            students: students
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;

    } catch (error) {
        console.error('Error creating student accounts:', error);
        throw error;
    }
}

export const getAllClasses = async () => {
    try {
        const token = localStorage.getItem('adminToken');
        
        const res = await axios.get(`${api_url}/api/class/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching classes:", error);
        throw error;
    }
}

export const EnrollStudentToClass = async (studentId: string, classId: string) => {
    try {
        const res = await axios.post(`${api_url}/api/class/enroll`, {
            studentid: studentId,
            classid: classId
        }, {
            headers: {
              
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error enrolling student:", error);
        throw error;
    }
}
export const deleteClass = async (classId: string) => {
    try {
        const token = localStorage.getItem('adminToken');
        
        const res = await axios.delete(`${api_url}/api/class/delete/${classId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
    }
}
