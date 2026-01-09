'use client';
import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';

const WS_URL = "wss://ai-webserver.onrender.com/";

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

// WebSocket Message Types
export interface BaseMessage {
  type: string;
}

export interface ConnectedMessage extends BaseMessage {
  type: 'connected';
  message: string;
}

export interface ErrorMessage extends BaseMessage {
  type: 'error';
  message: string;
  testId?: string;
  isSubmitted?: boolean;
}

export interface TestStartedMessage extends BaseMessage {
  type: 'test_started';
  message: string;
  testId: string;
}

export interface AnswerSubmittedMessage extends BaseMessage {
  type: 'answer_submitted';
  message: string;
  testId: string;
  isSubmitted: boolean;
}

export interface NewNotificationMessage extends BaseMessage {
  type: 'new_notification';
  notification: Notification;
}

export interface AuthSuccessMessage extends BaseMessage {
  type: 'auth_success';
  message: string;
}

// Messages received from server
export type ServerMessage = 
  | ConnectedMessage 
  | ErrorMessage 
  | TestStartedMessage 
  | AnswerSubmittedMessage 
  | NewNotificationMessage 
  | AuthSuccessMessage;

// Client to Server Messages
export interface AuthMessage extends BaseMessage {
  type: 'auth';
  userType: 'student' | 'teacher';
  token: string;
}

export interface StartTestMessage extends BaseMessage {
  type: 'start_test';
  testId: string;
  token: string;
}

export interface SubmitTestMessage extends BaseMessage {
  type: 'submit_test';
  testId: string;
  answerData: any;
  token: string;
}

export type ClientMessage = AuthMessage | StartTestMessage | SubmitTestMessage;


interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: ServerMessage | null;
  sendMessage: (message: ClientMessage) => void;
  connect: (userType: 'student' | 'teacher', token: string) => void;
  disconnect: () => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  unreadCount: number;
  setUnreadCount: (count: number | ((prev: number) => number)) => void;
  latestNotification: Notification | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authDataRef = useRef<{ userType: 'student' | 'teacher'; token: string } | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;

  // Helper function to check if notifications are enabled in settings
  const isNotificationsEnabled = useCallback(() => {
    try {
      const studentSettings = localStorage.getItem('studentSettings');
      const teacherSettings = localStorage.getItem('teacherSettings');
      
      if (studentSettings) {
        const settings = JSON.parse(studentSettings);
        return settings.notifications !== false; // Default to true if not specified
      }
      
      if (teacherSettings) {
        const settings = JSON.parse(teacherSettings);
        return settings.notifications !== false; // Default to true if not specified
      }
      
      return true; // Default to enabled if no settings found
    } catch (error) {
      console.error('Error reading settings:', error);
      return true; // Default to enabled on error
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    // Check if notifications are enabled before playing sound
    if (!isNotificationsEnabled()) {
      return;
    }
    
    try {
      const audio = new Audio('/audio/notification.mp3');
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  }, [isNotificationsEnabled]);

  const addNotification = useCallback((notification: Notification) => {
    // Check if notifications are enabled before adding
    if (!isNotificationsEnabled()) {
      console.log('Notifications are disabled in settings. Skipping notification.');
      return;
    }
    
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    setLatestNotification(notification);
    // Play notification sound
    playNotificationSound();
  }, [isNotificationsEnabled, playNotificationSound]);

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

  const sendMessage = (message: ClientMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  // Auto-connect on mount if token exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const studentToken = localStorage.getItem('studentToken');
      const teacherToken = localStorage.getItem('teacherToken');
      
      if (studentToken) {
        console.log('Auto-connecting as student...');
        connect('student', studentToken);
      } else if (teacherToken) {
        console.log('Auto-connecting as teacher...');
        connect('teacher', teacherToken);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        lastMessage,
        sendMessage,
        connect,
        disconnect,
        notifications,
        addNotification,
        clearNotifications,
        unreadCount,
        setUnreadCount,
        latestNotification
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
