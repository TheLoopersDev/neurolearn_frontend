import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import {
  getOrCreateChatRoom,
  sendMessage,
  subscribeToMessages,
  subscribeToChatRooms,
  markMessageAsRead,
  deleteMessage,
  ChatMessage,
  ChatRoom
} from '@/lib/firestore/chat';

export const useFirestoreChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);
  const [unsubscribeMessages, setUnsubscribeMessages] = useState<(() => void) | null>(null);
  const [unsubscribeChatRooms, setUnsubscribeChatRooms] = useState<(() => void) | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  // Helper để lấy userId an toàn
  const getUserId = () => {
    if (!user) return undefined;
    if (typeof user === 'string') {
      try {
        const parsed = JSON.parse(user);
        return parsed._id;
      } catch {
        return undefined;
      }
    }
    return user._id;
  };

  // Subscribe to chat rooms
  useEffect(() => {
    const userId = getUserId();
    console.log('Current userId for chatRooms query:', userId); // DEBUG LOG
    if (!userId) return;

    const unsubscribe = subscribeToChatRooms(userId, (rooms) => {
      setChatRooms(rooms);
    });

    setUnsubscribeChatRooms(() => unsubscribe);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Subscribe to messages when active chat room changes
  useEffect(() => {
    if (!activeChatRoomId) {
      setMessages([]);
      return;
    }

    // Cleanup previous subscription
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }

    const unsubscribe = subscribeToMessages(activeChatRoomId, (messages) => {
      setMessages(messages);
    });

    setUnsubscribeMessages(() => unsubscribe);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeChatRoomId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeChatRooms) unsubscribeChatRooms();
    };
  }, []);

  const sendMessageHandler = useCallback(async (
    receiverId: string,
    content: string,
    type: 'text' | 'image' | 'file' = 'text'
  ) => {
    const userId = getUserId();
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get or create chat room
      const chatRoomId = await getOrCreateChatRoom(userId, receiverId);
      
      // Send message (truyền receiverId)
      await sendMessage(chatRoomId, userId, receiverId, content, type);

      // Set active chat room if not already set
      if (!activeChatRoomId) {
        setActiveChatRoomId(chatRoomId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [user, activeChatRoomId]);

  const joinChat = useCallback(async (chatRoomId: string) => {
    setActiveChatRoomId(chatRoomId);
  }, []);

  const leaveChat = useCallback(() => {
    setActiveChatRoomId(null);
    setMessages([]);
  }, []);

  const markAsRead = useCallback(async (messageId: string) => {
    if (!activeChatRoomId) return;

    try {
      await markMessageAsRead(activeChatRoomId, messageId);
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  }, [activeChatRoomId]);

  const deleteMessageHandler = useCallback(async (messageId: string) => {
    if (!activeChatRoomId) return;

    try {
      await deleteMessage(activeChatRoomId, messageId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  }, [activeChatRoomId]);

  return {
    messages,
    chatRooms,
    loading,
    error,
    activeChatRoomId,
    sendMessage: sendMessageHandler,
    joinChat,
    leaveChat,
    markAsRead,
    deleteMessage: deleteMessageHandler,
    setActiveChatRoomId
  };
}; 