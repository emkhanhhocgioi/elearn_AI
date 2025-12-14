'use client';

import { useState, useEffect } from 'react';
import { useWebSocket, Notification } from '@/app/context/WebSocketContext';
import { Bell, X, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function NotificationBell() {
  const { notifications, unreadCount, clearNotifications } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'NEW_TEST':
        return '📝';
      case 'NEW_GRADE':
        return '⭐';
      case 'NEW_ASSIGNMENT':
        return '📚';
      case 'DEADLINE':
        return '⏰';
      case 'CLASS_UPDATE':
        return '📢';
      case 'MESSAGE':
        return '💬';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'NEW_TEST':
        return 'border-l-blue-500';
      case 'NEW_GRADE':
        return 'border-l-green-500';
      case 'NEW_ASSIGNMENT':
        return 'border-l-purple-500';
      case 'DEADLINE':
        return 'border-l-red-500';
      case 'CLASS_UPDATE':
        return 'border-l-yellow-500';
      case 'MESSAGE':
        return 'border-l-indigo-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const handleClearAll = () => {
    setLocalNotifications([]);
    clearNotifications();
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thông báo
              </h3>
              {localNotifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  Xóa tất cả
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {localNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Chưa có thông báo mới
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {localNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-4 ${getNotificationColor(notification.type)} ${
                        notification.important ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                              {notification.title}
                            </h4>
                            {notification.important && (
                              <span className="flex-shrink-0 text-xs px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                                Quan trọng
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: vi
                              })}
                            </span>
                            {typeof notification.sender === 'object' && notification.sender.name && (
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                từ {notification.sender.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
