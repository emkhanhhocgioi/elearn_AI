import axios from "axios";

const BASE_URL = "http://localhost:4000";

export interface Teacher {
  _id: string;
  name: string;
  age: number;
  gender: string;
  subject: string;
  classInCharge?: string;
  phoneNumber?: string;
  email: string;
  yearsOfExperience?: number;
}
export interface CreateTeacherDTO {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  subject: string;
  classInCharge?: string;
  phoneNumber?: string;
  yearsOfExperience?: number;
}



export const getTeacherById  = async (teacherId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const response = await axios.get(`${BASE_URL}/api/teacher/${teacherId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;;
  } catch (error) {
    
  }
}

export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const response = await axios.get(`${BASE_URL}/api/teacher/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    // Response structure: { message, count, teachers: [...] }
    return response.data.teachers || [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const createTeacher = async (teacherData: CreateTeacherDTO) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const response = await axios.post(`${BASE_URL}/api/admin/teacher/add`, teacherData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

export const updateTeacher = async (id: string, teacherData: Partial<CreateTeacherDTO>) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const response = await axios.put(`${BASE_URL}/api/admin/teacher/update/${id}`, teacherData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating teacher:", error);
    throw error;
  }
};

export const deleteTeacher = async (id: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const response = await axios.delete(`${BASE_URL}/api/admin/teacher/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};
