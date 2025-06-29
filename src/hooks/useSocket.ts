import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000'; // Đổi thành URL backend của bạn nếu cần

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
}; 