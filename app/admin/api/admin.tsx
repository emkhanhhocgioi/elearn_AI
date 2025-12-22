'use client';
import axios from "axios";
// Admin API endpoints
const api_url = "http://localhost:4000";


// ============ System Heath    ============

export const checServiceHeath = async () =>{
  try {
    const response = await axios.get('http://localhost:4000/api/admin/service',{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('adminToken')
      }
    });
    return response;
  } catch (error) {
    console.error('Error checking service health:', error);
    throw error;
  }
}


// ============ USER MANAGEMENT ============

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

export const createMutilpleStudentAccount = async (students: StudentData[], classid: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/students/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ classid, students })
    });
    
    if (!res.ok) throw new Error('Failed to create multiple student accounts');
    return res.json();
  } catch (error) {
    console.error('Error creating multiple student accounts:', error);
    throw error;
  }
}

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const res = await fetch(`${api_url}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};



