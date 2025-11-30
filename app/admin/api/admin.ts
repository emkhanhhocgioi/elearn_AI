'use client';

// Admin API endpoints
const api_url = "http://localhost:4000";

// ============ USER MANAGEMENT ============

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

export const updateUser = async (userId: string, userData: any) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// ============ CLASS MANAGEMENT ============

export const getAllClasses = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/classes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch classes');
    return res.json();
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

export const getClassById = async (classId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/classes/${classId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch class');
    return res.json();
  } catch (error) {
    console.error('Error fetching class:', error);
    throw error;
  }
};

export const createClass = async (classData: any) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/classes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(classData)
    });
    if (!res.ok) throw new Error('Failed to create class');
    return res.json();
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

export const updateClass = async (classId: string, classData: any) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/classes/${classId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(classData)
    });
    if (!res.ok) throw new Error('Failed to update class');
    return res.json();
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

export const deleteClass = async (classId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/classes/${classId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to delete class');
    return res.json();
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
};

// ============ TEACHER MANAGEMENT ============

export const getAllTeachers = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/teachers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch teachers');
    return res.json();
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

export const getTeacherById = async (teacherId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/teachers/${teacherId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch teacher');
    return res.json();
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
};

export const approveTeacher = async (teacherId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/teachers/${teacherId}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to approve teacher');
    return res.json();
  } catch (error) {
    console.error('Error approving teacher:', error);
    throw error;
  }
};

export const rejectTeacher = async (teacherId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/teachers/${teacherId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to reject teacher');
    return res.json();
  } catch (error) {
    console.error('Error rejecting teacher:', error);
    throw error;
  }
};

export const deleteTeacher = async (teacherId: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/teachers/${teacherId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to delete teacher');
    return res.json();
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

// ============ ANALYTICS & REPORTS ============

export const getSystemStats = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const getReports = async (reportType?: string) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const queryParam = reportType ? `?type=${reportType}` : '';
    const res = await fetch(`${api_url}/api/admin/reports${queryParam}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const generateReport = async (reportConfig: any) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/reports/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportConfig)
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export const exportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/reports/${reportId}/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to export report');
    return res.blob();
  } catch (error) {
    console.error('Error exporting report:', error);
    throw error;
  }
};

// ============ AUDIT LOGS ============

export const getAuditLogs = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/audit-logs?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

// ============ SYSTEM SETTINGS ============

export const getSystemSettings = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSystemSettings = async (settings: any) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Token not found');
    const res = await fetch(`${api_url}/api/admin/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};
