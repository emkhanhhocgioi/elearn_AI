
import axios from "axios";

const api_url = "http://localhost:4000"

export const getAllStudent = async () => {
    try {
        const token = localStorage.getItem('teacherToken');
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/student/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(res.data)
        return res.data;    
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

export const enrollStudentToClass = async (studentID: String, classID: String) => {
    try {
        const token = localStorage.getItem('teacherToken');
        if (!token) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.post(`${api_url}/api/class/enrollStudent`, {
            studentID: studentID,
            classID: classID
        }, {
            headers: {  
                'Authorization': `Bearer ${token}`,  
                
                'Content-Type': 'application/json'
            }
        });
        return res.data;    
    }                   
    catch (error) {
        console.error('Error enrolling student to class:', error);
        throw error;
    }           

}  