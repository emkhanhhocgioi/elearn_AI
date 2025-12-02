import axios from "axios";
const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const getSubjectClass = async () =>{
    try {
        const token = localStorage.getItem('teacherToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${api_url}/api/class/teacher/subject`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Fetched subject class:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching subject class:', error);
        throw error;
    }
}

export const createClass = async (classCode: String,class_subject: String,class_year: String) => {
    try {
        const token = localStorage.getItem('teacherToken');
        
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

export const getTeacherClasses = async () => {
    try {
        const token = localStorage.getItem('teacherToken');
        
        const res = await axios.get(`${api_url}/api/class/get`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching teacher classes:", error);
        throw error;
    }
}