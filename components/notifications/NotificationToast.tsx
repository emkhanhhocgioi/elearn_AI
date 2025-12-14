'use client';

import { useEffect, useState } from 'react';
import { useWebSocket, Notification } from '@/app/context/WebSocketContext';
import { X, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ToastNotification extends Notification {
  id: string;
}

export default function NotificationToast() {
  const { lastMessage } = useWebSocket();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    if (lastMessage?.type === 'new_notification' && lastMessage.notification) {
      const notification = lastMessage.notification;
      const toast: ToastNotification = {
        ...notification,
        id: `${notification._id}-${Date.now()}`
      };

      setToasts(prev => [...prev, toast]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 5000);
    }
  }, [lastMessage]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'NEW_TEST':
        return 'bg-blue-500';
      case 'NEW_GRADE':
        return 'bg-green-500';
      case 'NEW_ASSIGNMENT':
        return 'bg-purple-500';
      case 'DEADLINE':
        return 'bg-red-500';
      case 'CLASS_UPDATE':
        return 'bg-yellow-500';
      case 'MESSAGE':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-in bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className={`h-1 ${getNotificationColor(toast.type)}`} />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getNotificationColor(toast.type)} flex items-center justify-center`}>
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {toast.title}
                  </h4>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {toast.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDistanceToNow(new Date(toast.createdAt), {
                      addSuffix: true,
                      locale: vi
                    })}
                  </span>
                  {toast.important && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                      Quan trọng
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
