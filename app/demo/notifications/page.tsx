'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '@/app/context/WebSocketContext';
import { useNotifications } from '@/app/hooks/useNotifications';
import NotificationBell from '@/components/notifications/NotificationBell';
import NotificationToast from '@/components/notifications/NotificationToast';

export default function StudentNotificationDemo() {
  const { connect, isConnected, disconnect, notifications: wsNotifications } = useWebSocket();
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const { 
    notifications: apiNotifications, 
    loading, 
    fetchNotifications,
    markAsRead,
    getUnreadCount 
  } = useNotifications(token || undefined);

  const handleConnect = () => {
    if (token && !isConnecting) {
      setIsConnecting(true);
      connect('student', token);
      setTimeout(() => setIsConnecting(false), 1000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleRefreshNotifications = () => {
    fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Demo Hệ Thống Thông Báo
            </h1>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Connection Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Kết Nối WebSocket
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User ID (Student)
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Nhập student ID của bạn"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  JWT Token
                </label>
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Nhập JWT token của bạn (lấy từ localStorage sau khi đăng nhập)"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleConnect}
                  disabled={!token || isConnected || isConnecting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? 'Đang kết nối...' : 'Kết nối'}
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={!isConnected}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ngắt kết nối
                </button>
              </div>

              {/* Connection Info */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Trạng thái kết nối:
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• WebSocket URL: ws://localhost:4000</li>
                  <li>• Trạng thái: <span className={isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                  </span></li>
                  <li>• Thông báo realtime: {wsNotifications.length}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Notifications Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thông Báo từ API
              </h2>
              <button
                onClick={handleRefreshNotifications}
                disabled={loading || !token}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Đang tải thông báo...
                </p>
              ) : apiNotifications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Chưa có thông báo nào
                </p>
              ) : (
                apiNotifications.map((notif) => (
                  <div
                    key={notif._id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => markAsRead(notif._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {notif.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {notif.message}
                        </p>
                      </div>
                      {userId && !notif.isReadBy.includes(userId) && (
                        <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                        {notif.type}
                      </span>
                      {notif.important && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">
                          Quan trọng
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {userId && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Số thông báo chưa đọc: <strong>{getUnreadCount(userId)}</strong>
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📚 Hướng dẫn sử dụng
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Đăng nhập vào hệ thống để lấy JWT token (hoặc lấy từ localStorage)</li>
            <li>Copy JWT token vào ô "JWT Token" ở trên</li>
            <li>Nhập Student ID của bạn vào ô "User ID"</li>
            <li>Click nút "Kết nối" để kết nối WebSocket</li>
            <li>Khi giáo viên tạo bài kiểm tra mới, bạn sẽ nhận được thông báo realtime</li>
            <li>Click vào icon chuông 🔔 ở góc phải trên để xem tất cả thông báo</li>
            <li>Thông báo mới sẽ hiển thị dưới dạng toast ở góc phải trên màn hình</li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              <strong>Lưu ý:</strong> Để nhận browser notification, hãy cho phép quyền thông báo khi trình duyệt hỏi.
            </p>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <NotificationToast />
    </div>
  );
}
