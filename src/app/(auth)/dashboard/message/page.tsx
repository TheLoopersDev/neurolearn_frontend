// src/app/(auth)/dashboard/message/page.tsx
'use client';
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useGetUserChatsQuery, useGetChatDetailQuery } from '@/lib/redux/features/chat/chatApi';
import { setActiveChat } from '@/lib/redux/features/chat/chatSlice';
import { useChatSocket } from '@/hooks/useChatSocket';
import { ChatList, ChatRoom } from '@/components/chat';

const MessagePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeChatId } = useSelector((state: RootState) => state.chat);

  // Parse current user
  const currentUser = typeof user === 'string' ? JSON.parse(user || '{}') : user;
  const currentUserId = currentUser?._id || currentUser?.id;

  console.log('MessagePage - currentUser:', currentUser);
  console.log('MessagePage - currentUserId:', currentUserId);

  // Get user's chats with refetch capability
  const { data: chats = [], refetch } = useGetUserChatsQuery(currentUserId || '', {
    skip: !currentUserId,
  });

  console.log('MessagePage - chats from API:', chats);

  // Get active chat details
  const { data: activeChat } = useGetChatDetailQuery(activeChatId || '', {
    skip: !activeChatId,
  });

  // Socket connection
  const { joinChat, leaveChat } = useChatSocket();

  // Handle chat selection
  const handleSelectChat = useCallback((chatId: string) => {
    if (activeChatId) {
      leaveChat(activeChatId);
    }
    dispatch(setActiveChat(chatId));
    joinChat(chatId);
  }, [activeChatId, dispatch, joinChat, leaveChat]);

  // Handle create new chat - refresh the list
  const handleCreateChat = () => {
    refetch();
  };

  // Auto-select first chat if none selected
  useEffect(() => {
    if (chats.length > 0 && !activeChatId) {
      handleSelectChat(chats[0]._id);
    }
  }, [chats, activeChatId, handleSelectChat]);

  if (!currentUserId) {
    return (
      <div className="h-[calc(100vh-var(--header-height,80px))] flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <p className="text-gray-500">Please log in to access messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-var(--header-height,80px))] flex rounded-2xl overflow-hidden bg-[#F7F8FA] gap-5 p-5">
      {/* Chat List */}
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
      />

      {/* Chat Room */}
      <ChatRoom
        chat={activeChat || null}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default MessagePage;
