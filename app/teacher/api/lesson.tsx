import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const createLesson = async (title: string, classId: string,
    
    teacherId: string,subject: string , file: File    ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("classId", classId);
    formData.append("teacherId", teacherId);
    formData.append("subject", subject);
    formData.append("file", file);
    const token = localStorage.getItem("teacherToken");
    const response = await axios.post(`${API_URL}/api/teacher/lessons/create`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.data;
    }

export const getTeacherLessons = async (classId?: string) => {
    try {
        const token = localStorage.getItem("teacherToken");
        const params: any = {};
        if (classId) {
            params.classId = classId;
        }
        const response = await axios.get(`${API_URL}/api/teacher/lessons`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            params: params,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching lessons:", error);
        throw error;
    }
    }  
    
export const deleteLesson = async (lessonId: string) => {
    try {
        const token = localStorage.getItem("teacherToken");
        const response = await axios.delete(`${API_URL}/api/teacher/lessons/${lessonId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error deleting lesson:", error);
        throw error;
    }   
    }   
export const getLessonById = async (lessonId: string) => {
    try {
        const token = localStorage.getItem("teacherToken");
        const response = await axios.get(`${API_URL}/api/teacher/lessons/${lessonId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    }   
    catch (error) {
        console.error("Error fetching lesson by ID:", error);
        throw error;
    }
    }

export const updateLesson = async (lessonId: string, title: string, classId: string,
    
    teacherId: string,subject: string , file?: File    ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("classId", classId);
    formData.append("teacherId", teacherId);
    formData.append("subject", subject);    
    if (file) {
        formData.append("file", file);
    }
    const token = localStorage.getItem("teacherToken");
    const response = await axios.put(`${API_URL}/api/teacher/lessons/${lessonId}`, formData, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.data;
    }