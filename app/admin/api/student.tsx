import axios from "axios";

const api_url = "http://localhost:4000"

export const getAllStudent = async () => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${api_url}/api/admin/students`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(res)
        return res.data;    
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

export const getStudentById = async (StudentID: string) => { 
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${api_url}/api/admin/students/${StudentID}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;    
    }   
    catch (error) {
        console.error('Error fetching student by ID:', error);
        throw error;
    }
}

export const deleteStudentById = async (StudentID: string) => { 
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.delete(`${api_url}/api/admin/student/delete/${StudentID}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;    
    }   
    catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
}


export const getStudentByClass = async (classid: string ) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${api_url}/api/admin/students/class/${classid}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(res) 
        return res.data;
    } catch (error) {
        console.error('Error fetching students by class:', error);
    }
}
export const enrollStudentToClass = async (studentID: String, classCode: String) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.post(`${api_url}/api/class/enroll`, {
            student_id: studentID,
            class_code: classCode
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

export const updateStudent = async (studentID: string, data: any) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Token not found');
        const res = await axios.put(`${api_url}/api/admin/student/update/${studentID}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}
