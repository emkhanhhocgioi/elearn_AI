import axios  from "axios";



const api_url = "http://localhost:4000"

export const studentlogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${api_url}/api/auth/student/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const teacherLogin  = async (email: string , password: string) => {
    try {
    const response = await axios.post(`${api_url}/api/auth/teacher/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


