import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { 
  setTypingStatus, 
  setOnlineStatus, 
  addMessage, 
  incrementUnreadCount 
} from '@/lib/redux/features/chat/chatSlice';
import { SocketMessage, TypingEvent, OnlineStatusEvent } from '@/types/chat';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

export const useChatSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeChatId } = useSelector((state: RootState) => state.chat);

  // Parse user from string if needed
  const currentUser = typeof user === 'string' ? JSON.parse(user || '{}') : user;
  const userId = currentUser?._id || currentUser?.id;

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        userId,
      },
    });

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    // Chat events
    socketRef.current.on('newMessage', (data: SocketMessage) => {
      dispatch(addMessage({ chatId: data.chatId, message: data.message }));
      dispatch(incrementUnreadCount(data.chatId));
    });

    socketRef.current.on('typing', (data: TypingEvent) => {
      dispatch(setTypingStatus(data));
    });

    socketRef.current.on('userOnline', (data: OnlineStatusEvent) => {
      dispatch(setOnlineStatus(data));
    });

    socketRef.current.on('userOffline', (data: OnlineStatusEvent) => {
      dispatch(setOnlineStatus(data));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, dispatch]);

  // Join chat room when active chat changes
  useEffect(() => {
    if (socketRef.current && activeChatId) {
      socketRef.current.emit('joinChat', activeChatId);
    }
  }, [activeChatId]);

  // Send message
  const sendMessage = useCallback((chatId: string, content: string) => {
    if (socketRef.current && userId) {
      socketRef.current.emit('sendMessage', {
        chatId,
        sender: userId,
        content,
      });
    }
  }, [userId]);

  // Send typing indicator
  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (socketRef.current && userId) {
      socketRef.current.emit('typing', {
        chatId,
        userId,
        isTyping,
      });
    }
  }, [userId]);

  // Join chat room
  const joinChat = useCallback((chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('joinChat', chatId);
    }
  }, []);

  // Leave chat room
  const leaveChat = useCallback((chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leaveChat', chatId);
    }
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
    sendTyping,
    joinChat,
    leaveChat,
    isConnected: socketRef.current?.connected || false,
  };
}; 