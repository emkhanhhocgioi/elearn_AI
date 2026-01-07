
import axios from "axios"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const createTest = async (classID: string , testtitle: string , 
    participants: number, closedDate: string, subject: string ) =>{
        try {
            const teacherToken = localStorage.getItem('teacherToken');
            if (!teacherToken) {
                throw new Error('Token not found in localStorage');
            }   
            const res = await axios.post(`${API_URL}/api/test/create`, {
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

export const getClassTeacherTest = async () => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }
        const res = await axios.get(`${API_URL}/api/test/get`, {
            headers: {
                'Content-Type': 'application/json',     
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        return res.data;
    } catch (error) {
        
    }

}


export const getTestDetailById = async (testid: string) => {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        if (!teacherToken) {
            throw new Error('Token not found in localStorage');
        }       
        const res = await axios.get(`${API_URL}/api/test/data/${testid}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${teacherToken}`
            }
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching test details:', error);   
    }  
};

