import axios from "axios"; 

const api_url = "http://localhost:4000"

export const createTest = async (classID: String , testtitle: String , 
    participants: Number, closedDate: String, subject: String ) =>{
        try {
            const teacherToken = localStorage.getItem('teacherToken');
            if (!teacherToken) {
                throw new Error('Token not found in localStorage');
            }   
            const res = await axios.post(`${api_url}/api/test/create`, {
                classID: classID,
                testtitle: testtitle,
                participants: participants,
                closedDate: closedDate,
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

export const getClassTeacherTest = async (classID: String) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${api_url}/api/test/get/${classID}`, {
            headers: {
                'Content-Type': 'application/json',     
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        return res.data;
    } catch (error) {
        
    }

}

