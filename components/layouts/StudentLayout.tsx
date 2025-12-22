'use client';

import { useEffect } from 'react';
import { useWebSocket } from '@/app/context/WebSocketContext';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useNotifications } from '@/app/hooks/useNotifications';

interface StudentLayoutProps {
  children: React.ReactNode;
  token: string; // JWT token from auth
  userId: string;
}

export default function StudentLayout({ children, token, }: StudentLayoutProps) {
  const { connect, isConnected } = useWebSocket();
  const { notifications: apiNotifications, fetchNotifications } = useNotifications(token);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (token) {
      connect('student', token);
    }
  }, [token, connect]);

  // Fetch initial notifications from API
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Notification Bell */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Học sinh
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* WebSocket Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Notification Bell */}
              <NotificationBell />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
