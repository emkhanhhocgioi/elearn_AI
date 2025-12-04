'use client';

import { useEffect, useRef, useState } from 'react';

// WebSocket URL - adjust the port to match your backend
const WS_URL = 'ws://localhost:4000';

export function useWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);

    useEffect(() => {
        // Create WebSocket connection
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        // Connection opened
        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        };

        // Listen for messages
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Message received:', data);
                setLastMessage(data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        // Connection closed
        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        // Connection error
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup on unmount
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    // Send message function
    const sendMessage = (message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    };

    return {
        isConnected,
        lastMessage,
        sendMessage,
        ws: wsRef.current
    };
}
