'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useWebSocket } from '@/app/context/WebSocketContext';

export function NotificationListener() {
  const { latestNotification } = useWebSocket();

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      window.Notification.requestPermission();
    }
  }, []);

  // Handle new notifications
  useEffect(() => {
    if (!latestNotification) return;

    const notification = latestNotification;

    // Show Sonner toast notification
    const notificationTypeLabels: Record<typeof notification.type, string> = {
      SYSTEM: '🔔 Hệ thống',
      NEW_GRADE: '📊 Điểm mới',
      NEW_ASSIGNMENT: '📝 Bài tập mới',
      NEW_TEST: '📋 Bài kiểm tra mới',
      DEADLINE: '⏰ Hạn chót',
      CLASS_UPDATE: '🏫 Cập nhật lớp học',
      MESSAGE: '💬 Tin nhắn'
    };

  
    
    toast(notification.title, {
      description: notification.message,
      duration: 5000,
      action: notification.relatedId ? {
        label: 'Xem chi tiết',
        onClick: () => {
          // Handle navigation based on relatedModel
          console.log('Navigate to:', notification.relatedModel, notification.relatedId);
        }
      } : undefined,
      classNames: {
        toast: notification.important ? 'border-red-500' : '',
        title: 'font-semibold',
        description: 'text-sm'
      }
    });
    
    // Show browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: notification._id
      });
    }
  }, [latestNotification]);

  // This component has no UI
  return null;
}
