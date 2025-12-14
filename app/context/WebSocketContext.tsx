'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

const WS_URL = 'ws://localhost:4000';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'SYSTEM' | 'NEW_GRADE' | 'NEW_ASSIGNMENT' | 'NEW_TEST' | 'DEADLINE' | 'CLASS_UPDATE' | 'MESSAGE';
  recipients: string[];
  sender: string | { _id: string; name: string };
  isReadBy: string[];
  relatedId?: string;
  relatedModel?: 'Assignment' | 'Test' | 'Class' | 'User' | null;
  important: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
  sendMessage: (message: any) => void;
  ws: WebSocket | null;
  connect: (userType: 'student' | 'teacher', token: string) => void;
  disconnect: () => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  unreadCount: number;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const authDataRef = useRef<{ userType: 'student' | 'teacher'; token: string } | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show Sonner toast notification
    const notificationTypeLabels: Record<Notification['type'], string> = {
      SYSTEM: '🔔 Hệ thống',
      NEW_GRADE: '📊 Điểm mới',
      NEW_ASSIGNMENT: '📝 Bài tập mới',
      NEW_TEST: '📋 Bài kiểm tra mới',
      DEADLINE: '⏰ Hạn chót',
      CLASS_UPDATE: '🏫 Cập nhật lớp học',
      MESSAGE: '💬 Tin nhắn'
    };

    const typeLabel = notificationTypeLabels[notification.type] || '🔔';
    
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
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: notification._id
      });
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);


  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    authDataRef.current = null;
    reconnectAttemptsRef.current = 0;
    setIsConnected(false);
  };

  const attemptReconnect = () => {
    if (!authDataRef.current) return;

    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached. Please refresh the page.');
      return;
    }

    reconnectAttemptsRef.current += 1;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 30000); // Exponential backoff, max 30s
    
    console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts}) in ${delay}ms...`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (authDataRef.current) {
        connect(authDataRef.current.userType, authDataRef.current.token);
      }
    }, delay);
  };

  const connect = (userType: 'student' | 'teacher', token: string) => {
    // Store auth data for reconnection
    authDataRef.current = { userType, token };

    // Close existing connection if any
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection

        // Send authentication message
        ws.send(JSON.stringify({
          type: 'auth',
          userType,
          token
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Message received:', data);
          setLastMessage(data);
          
          // Handle notification messages
          if (data.type === 'new_notification' && data.notification) {
            addNotification(data.notification);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        
        // Attempt to reconnect if we have auth data
        if (authDataRef.current) {
          attemptReconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      // Attempt to reconnect on connection failure
      if (authDataRef.current) {
        attemptReconnect();
      }
    }
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        lastMessage,
        sendMessage,
        ws: wsRef.current,
        connect,
        disconnect,
        notifications,
        addNotification,
        clearNotifications,
        unreadCount
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
