import axios from "axios"; 

const api_url = "http://localhost:4000"

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
export interface StudentData {
  name: string;
  classid: string;
  DOB: string;
  avatar: string;
  email: string;
  password: string;
  parentContact: string;
  academic_performance?: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  conduct?: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  averageScore?: number;
}

interface ClassData {
  class_code: string;
  class_year: string;
  teacher_id: string;
    class_teacher?: string;
    class_avarage_grade?: number;
}

export const createClass = async (classCode: string,teacher_id:string , class_year: string) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.post(`${api_url}/api/admin/classes/create`, {
            class_code: classCode,
            class_year: class_year,
            teacher_id: teacher_id,
        }, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        return res.data;

    } catch (error) {
        console.error('Error creating class:', error);
        throw error;
    }
}

export const getClassById = async (classId: string) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.get(`${api_url}/api/admin/class/${classId}`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        console.log("Class data:", res.data.class);
        return res.data.class;
    } catch (error) {
        console.error("Error fetching class by ID:", error);
        throw error;
    }   
}

export const getAllClasses = async () => {
    try {
        const res = await axios.get(`${api_url}/api/admin/classes`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        console.log("All classes data:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching classes:", error);
        throw error;
    }
}


export const createMutilpleStudentAccount = async (students: StudentData[], classid: string) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.post(
            `${api_url}/api/admin/class/add-students/${classid}`,
            { classid, students },
            {
                ...getAuthConfig(),
                headers: {
                    ...getAuthConfig().headers,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error creating multiple student accounts:', error);
        throw error;
    }
}


export const EnrollStudentToClass = async (studentId: string, classId: string) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.post(`${api_url}/api/class/enroll`, {
            studentid: studentId,
            classid: classId
        }, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error enrolling student:", error);
        throw error;
    }
}
export const deleteClass = async (classId: string) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        const res = await axios.delete(`${api_url}/api/admin/class/delete/${classId}`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
    }
}

export const updateClass = async (
    classId: string, 
    classCode?: string, 
    class_teacher?: string, 
    classYear?: string, 
    averageGrade?: number
) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        
        const updateData: Partial<ClassData> = {};
        if (classCode !== undefined) updateData.class_code = classCode;
        if (class_teacher !== undefined) updateData.class_teacher = class_teacher;
        if (classYear !== undefined) updateData.class_year = classYear;
        if (averageGrade !== undefined) updateData.class_avarage_grade = averageGrade;
        
        const res = await axios.put(`${api_url}/api/admin/class/update/${classId}`, updateData, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error updating class:", error);
        throw error;
    }
}
export const getClassSubjectTeachers = async (classId: string) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found'); 
        const res = await axios.get(`${api_url}/api/admin/class/${classId}/subject-teachers`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        console.log("Class subject teachers data:", res.data);  
        return res.data;
    } catch (error) {
        console.error("Error fetching class subject teachers:", error);
        throw error;
    }   
}
export const updateSubjectTeacher = async (
    classId: string,
    subjectField: string,
    teacherId: string
) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        
        const res = await axios.put(
            `${api_url}/api/admin/class/subject-teacher/${classId}`,
            {
                subjectField,
                teacherId
            },
            {
                ...getAuthConfig(),
                headers: {
                    ...getAuthConfig().headers,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error updating subject teacher:", error);
        throw error;
    }
}

// Schedule Management APIs
export interface AssignTeacherToTimeSlotData {
    teacherId: string;
    classId: string;
    subjectId: string;
    timeSlotId: string;
    semester: string;
}

export interface TimeSlot {
    _id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    session: string;
    period: number;

}

export interface ScheduleItem {
    scheduleId: string;
    teacher: {
        id: string;
        name: string;
        email: string;
    };
    subject: string;
    timeSlot: {
        startTime: string;
        endTime: string;
    };
    semester: string;
}

export interface ClassScheduleResponse {
    success: boolean;
    class: {
        id: string;
        class_code: string;
        class_year: string;
    };
    totalSchedules: number;
    schedules: {
        Mon: ScheduleItem[];
        Tue: ScheduleItem[];
        Wed: ScheduleItem[];
        Thu: ScheduleItem[];
        Fri: ScheduleItem[];
        Sat: ScheduleItem[];
        Sun: ScheduleItem[];
    };
    rawSchedules: any[];
}

export const assignTeacherToTimeSlot = async (data: AssignTeacherToTimeSlotData) => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        
        const res = await axios.post(
            `${api_url}/api/admin/schedule/assign`,
            data,
            {
                ...getAuthConfig(),
                headers: {
                    ...getAuthConfig().headers,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error assigning teacher to timeslot:", error);
        throw error;
    }
}

export const getClassSchedule = async (classId: string, semester?: string): Promise<ClassScheduleResponse> => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        
        const url = semester 
            ? `${api_url}/api/admin/schedule/class/${classId}?semester=${semester}`
            : `${api_url}/api/admin/schedule/class/${classId}`;
        
        const res = await axios.get(url, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching class schedule:", error);
        throw error;
    }
}

// Get all timeslots
export const getAllTimeSlots = async (): Promise<TimeSlot[]> => {
    try {
        const token = getAdminToken();
        if (!token) throw new Error('Token not found');
        
        const res = await axios.get(`${api_url}/api/admin/time_slot`, {
            ...getAuthConfig(),
            headers: {
                ...getAuthConfig().headers,
                'Content-Type': 'application/json'
            }
        });
      
        return res.data.data || [];
    } catch (error) {
        console.error("Error fetching timeslots:", error);
        throw error;
    }
}
