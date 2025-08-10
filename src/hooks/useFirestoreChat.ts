import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import {
  getOrCreateChatRoom,
  sendMessage,
  subscribeToMessages,
  subscribeToChatRooms,
  markMessageAsRead,
  deleteMessage,
  addReaction,
  removeReaction,
  updateGroupName,
  addMembersToGroup,
  removeMemberFromGroup,
  ChatMessage,
  ChatRoom,
} from '@/lib/firestore/chat';

export const useFirestoreChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);
  const [unsubscribeChatRooms, setUnsubscribeChatRooms] = useState<(() => void) | null>(null);
  
  // Thêm ref để track current active chat room
  const currentActiveChatRef = useRef<string | null>(null);
  const messagesSubscriptionRef = useRef<(() => void) | null>(null);

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
    if (!userId) return;

    const unsubscribe = subscribeToChatRooms(userId, rooms => {
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
      currentActiveChatRef.current = null;
      return;
    }

    // Cleanup previous subscription
    if (messagesSubscriptionRef.current) {
      messagesSubscriptionRef.current();
      messagesSubscriptionRef.current = null;
    }

    // Set current active chat
    currentActiveChatRef.current = activeChatRoomId;

    const unsubscribe = subscribeToMessages(activeChatRoomId, (newMessages) => {
      // Chỉ update messages nếu vẫn đang ở cùng chat room
      if (currentActiveChatRef.current === activeChatRoomId) {
        setMessages(newMessages);
      }
    });

    messagesSubscriptionRef.current = unsubscribe;

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [activeChatRoomId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (messagesSubscriptionRef.current) messagesSubscriptionRef.current();
      if (unsubscribeChatRooms) unsubscribeChatRooms();
    };
  }, [unsubscribeChatRooms]);

  const sendMessageHandler = useCallback(
    async (
      receiverId: string, 
      content: string, 
      type: 'text' | 'image' | 'file' = 'text',
      replyTo?: {
        messageId: string;
        content: string;
        senderId: string;
      }
    ) => {
      const userId = getUserId();
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Nếu có activeChatRoomId, sử dụng nó (cho group chat)
        if (activeChatRoomId) {
          // Send message trực tiếp vào chat room hiện tại
          await sendMessage(activeChatRoomId, userId, receiverId, content, type, replyTo);
        } else {
          // Get or create chat room (cho 1-1 chat)
          const chatRoomId = await getOrCreateChatRoom(userId, receiverId);
          await sendMessage(chatRoomId, userId, receiverId, content, type, replyTo);
          
          // Set active chat room if not already set
          setActiveChatRoomId(chatRoomId);
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setLoading(false);
      }
    },
    [user, activeChatRoomId, getUserId]
  );

  const sendReactionHandler = useCallback(
    async (messageId: string, emoji: string) => {
      const userId = getUserId();
      if (!userId || !activeChatRoomId) {
        setError('User not authenticated or no active chat');
        return;
      }

      try {
        setError(null);
        await addReaction(activeChatRoomId, messageId, userId, emoji);
      } catch (err) {
        console.error('Error adding reaction:', err);
        setError(err instanceof Error ? err.message : 'Failed to add reaction');
      }
    },
    [user, activeChatRoomId, getUserId]
  );

  const removeReactionHandler = useCallback(
    async (messageId: string, emoji: string) => {
      const userId = getUserId();
      if (!userId || !activeChatRoomId) {
        setError('User not authenticated or no active chat');
        return;
      }

      try {
        setError(null);
        await removeReaction(activeChatRoomId, messageId, userId, emoji);
      } catch (err) {
        console.error('Error removing reaction:', err);
        setError(err instanceof Error ? err.message : 'Failed to remove reaction');
      }
    },
    [user, activeChatRoomId, getUserId]
  );

  const joinChat = useCallback(async (chatRoomId: string) => {
    setActiveChatRoomId(chatRoomId);
  }, []);

  const leaveChat = useCallback(() => {
    setActiveChatRoomId(null);
    setMessages([]);
  }, []);

  const setActiveChatRoomIdHandler = useCallback((chatRoomId: string | null) => {
    setActiveChatRoomId(chatRoomId);
  }, []);

  const markAsRead = useCallback(
    async (messageId: string) => {
      if (!activeChatRoomId) return;

      try {
        await markMessageAsRead(activeChatRoomId, messageId);
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    },
    [activeChatRoomId]
  );

  const deleteMessageHandler = useCallback(
    async (messageId: string) => {
      if (!activeChatRoomId) return;

      try {
        await deleteMessage(activeChatRoomId, messageId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete message');
      }
    },
    [activeChatRoomId]
  );

  // Group management functions
  const updateGroupNameHandler = useCallback(
    async (newName: string) => {
      if (!activeChatRoomId) {
        setError('No active chat room');
        return;
      }

      try {
        setError(null);
        await updateGroupName(activeChatRoomId, newName);
      } catch (err) {
        console.error('Error updating group name:', err);
        setError(err instanceof Error ? err.message : 'Failed to update group name');
        throw err;
      }
    },
    [activeChatRoomId]
  );

  const addMembersToGroupHandler = useCallback(
    async (memberIds: string[]) => {
      if (!activeChatRoomId) {
        setError('No active chat room');
        return;
      }

      try {
        setError(null);
        await addMembersToGroup(activeChatRoomId, memberIds);
      } catch (err) {
        console.error('Error adding members to group:', err);
        setError(err instanceof Error ? err.message : 'Failed to add members to group');
        throw err;
      }
    },
    [activeChatRoomId]
  );

  const removeMemberFromGroupHandler = useCallback(
    async (memberId: string) => {
      if (!activeChatRoomId) {
        setError('No active chat room');
        return;
      }

      try {
        setError(null);
        await removeMemberFromGroup(activeChatRoomId, memberId);
      } catch (err) {
        console.error('Error removing member from group:', err);
        setError(err instanceof Error ? err.message : 'Failed to remove member from group');
        throw err;
      }
    },
    [activeChatRoomId]
  );

  return {
    messages,
    chatRooms,
    loading,
    error,
    activeChatRoomId,
    sendMessage: sendMessageHandler,
    sendReaction: sendReactionHandler,
    removeReaction: removeReactionHandler,
    joinChat,
    leaveChat,
    markAsRead,
    deleteMessage: deleteMessageHandler,
    setActiveChatRoomId: setActiveChatRoomIdHandler,
    updateGroupName: updateGroupNameHandler,
    addMembersToGroup: addMembersToGroupHandler,
    removeMemberFromGroup: removeMemberFromGroupHandler,
  };
};
