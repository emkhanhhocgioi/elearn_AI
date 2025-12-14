'use client';

import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/app/context/WebSocketContext';

const API_BASE_URL = 'http://localhost:4000/api';

export function useNotifications(token?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/student/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/student/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      const data = await response.json();
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? data.notification : n)
      );

      return data.notification;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, [token]);

  // Get unread count
  const getUnreadCount = useCallback((userId: string) => {
    return notifications.filter(n => !n.isReadBy.includes(userId)).length;
  }, [notifications]);

  // Filter notifications by type
  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Get important notifications
  const getImportantNotifications = useCallback(() => {
    return notifications.filter(n => n.important);
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    getUnreadCount,
    getNotificationsByType,
    getImportantNotifications
  };
}
