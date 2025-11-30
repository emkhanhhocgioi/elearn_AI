import axios from "axios";

const api_url = "http://localhost:4000"

export const getAllStudent = async () => {
    try {
    
        const res = await axios.get(`${api_url}/api/student/all`, {
            headers: {
                
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

export const enrollStudentToClass = async (studentID: String, classCode: String) => {
    try {
    
        const res = await axios.post(`${api_url}/api/class/enroll`, {
            student_id: studentID,
            class_code: classCode
        }, {
            headers: {  
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
