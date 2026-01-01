import axios from "axios";

const BASE_URL = "http://localhost:4000";

const getAdminToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
};
const getAuthConfig = () => {
  const token = getAdminToken();
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

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
  isClassTeacher: boolean;
  createdAt: string;
  updatedAt: string;

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
    const token = getAdminToken();
    if (!token) throw new Error('Token not found');
    const response = await axios.get(`${BASE_URL}/api/admin/teacher/${teacherId}`, {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "application/json",
      },
    });
    return response.data;;
  } catch (error) {
    console.error("Error fetching teacher by ID:", error);
  }
}

export const getAllTeachers = async ()  => {
  try {
    const token = getAdminToken();
    if (!token) throw new Error('Token not found');
    const response = await axios.get(`${BASE_URL}/api/admin/teachers`, {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "application/json",
      },
    });
    // Response structure: { message, count, teachers: [...] }
    console.log("Teachers fetched:", response.data.data);
    return response.data.data.teachers || [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const createTeacher = async (teacherData: CreateTeacherDTO) => {
  try {
    const token = getAdminToken();
    if (!token) throw new Error('Token not found');
    const response = await axios.post(`${BASE_URL}/api/admin/teachers/create`, teacherData, {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
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
    const token = getAdminToken();
    if (!token) throw new Error('Token not found');
    const response = await axios.put(`${BASE_URL}/api/admin/teacher/update/${id}`, teacherData, {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
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
    const token = getAdminToken();
    if (!token) throw new Error('Token not found');
    const response = await axios.delete(`${BASE_URL}/api/admin/teacher/delete/${id}`, {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};
