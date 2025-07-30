'use client';
import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setActiveChat } from '@/lib/redux/features/chat/chatSlice';
import { useFirestoreChat } from '@/hooks/useFirestoreChat';
import { ChatList, ChatRoom, CreateChatModal } from '@/components/chat';

// Check if Firebase is available
const isFirebaseAvailable = () => {
  return typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
};


const MessagePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Parse current user
  const currentUser = typeof user === 'string' ? JSON.parse(user || '{}') : user;
  const currentUserId = useMemo(() => {
    const id = currentUser?._id || currentUser?.id;
    return id;
  }, [currentUser]);

  // Firestore chat hook - only use if Firebase is available
  const firebaseAvailable = isFirebaseAvailable();
  const {
    chatRooms,
    joinChat,
    leaveChat,
    activeChatRoomId: activeChatRoomIdHook,
    setActiveChatRoomId,
    messages,
    sendMessage,
    loading,
    error
  } = useFirestoreChat();

  // State loading cho box chat
  const [isChatLoading, setIsChatLoading] = useState(false);
  const prevChatRoomId = useRef<string | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState(0);



  // Fetch all users whenever chatRooms thay đổi (đảm bảo user mới được cập nhật)
  useEffect(() => {
    if (!currentUserId) return;
    setUsersLoading(true);
    const url = `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/related-users?userId=${currentUserId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setAllUsers(data.users || []))
      .finally(() => setUsersLoading(false));
  }, [currentUserId, chatRooms.length]);

  // Khi chọn chat mới, set loading và clear messages cũ
  const handleSelectChat = useCallback(async (chatRoomId: string) => {
    if (activeChatRoomIdHook && activeChatRoomIdHook !== chatRoomId) {
      leaveChat();
    }

    setIsChatLoading(true);
    setSelectedChatRoomId(chatRoomId);
    dispatch(setActiveChat(chatRoomId));
    setActiveChatRoomId(chatRoomId);

    await joinChat(chatRoomId);
    prevChatRoomId.current = chatRoomId;

    // Force refresh để đảm bảo messages được load lại
    setForceRefresh(prev => prev + 1);
  }, [activeChatRoomIdHook, dispatch, joinChat, leaveChat, setActiveChatRoomId]);

  // Khi messages thay đổi hoặc activeChatRoomId đổi, tắt loading
  useEffect(() => {
    if (isChatLoading && messages && messages.length >= 0) {
      setIsChatLoading(false);
    }
  }, [messages, activeChatRoomIdHook, isChatLoading]);

  // Auto-select first chat if none selected, hoặc chọn phòng chat mới nhất có lastMessage chưa đọc
  useEffect(() => {
    if (chatRooms.length > 0 && !hasAutoSelected) {
      const activeRoomStillExists = chatRooms.some(room => room.id === activeChatRoomIdHook);
      if (!activeChatRoomIdHook || !activeRoomStillExists) {
        const unreadRoom = chatRooms.find(room => {
          return room.lastMessage && room.lastMessage.receiverId === currentUserId && !room.lastMessage.read;
        });
        if (unreadRoom) {
          handleSelectChat(unreadRoom.id!);
          setHasAutoSelected(true);
        } else {
          const sortedRooms = [...chatRooms].sort((a, b) => {
            const aTime = a.lastMessageTime || a.createdAt;
            const bTime = b.lastMessageTime || b.createdAt;
            return bTime?.toMillis?.() - aTime?.toMillis?.();
          });
          if (sortedRooms.length > 0) {
            handleSelectChat(sortedRooms[0].id!);
            setHasAutoSelected(true);
          }
        }
      }
    }
    // Reset flag nếu chatRooms thay đổi hoàn toàn (ví dụ reload)
    if (chatRooms.length === 0 && hasAutoSelected) {
      setHasAutoSelected(false);
    }
  }, [chatRooms, activeChatRoomIdHook, handleSelectChat, currentUserId, hasAutoSelected]);

  // Helper: Map ChatRoom to Chat (for UI compatibility)
  const mapChatRoomToChat = function (room: any): any {
    if (room.isGroup) {
      return {
        _id: room.id,
        members: room.participants.map((id: string) => allUsers.find(u => String(u._id) === String(id)) || { _id: id, name: 'Loading...', email: '' }),
        isGroup: true,
        groupName: room.groupName || 'Group',
        messages: [],
        lastMessage: room.lastMessage,
        unreadCount: 0,
        avatar: '/assets/images/avatar-default.png',
      };
    } else {
      // 1-1 chat: get the other user
      const otherId = room.participants.find((id: string) => String(id) !== String(currentUserId));
      const otherUser = allUsers.find(u => String(u._id) === String(otherId));
      return {
        _id: room.id,
        members: [otherUser || { _id: otherId, name: 'Loading...', email: '' }],
        isGroup: false,
        groupName: undefined,
        messages: [],
        lastMessage: room.lastMessage,
        unreadCount: 0,
        avatar: otherUser?.avatar?.url || '/assets/images/avatar-default.png',
        displayName: otherUser?.name || 'Loading...'
      };
    }
  };

  // Callback khi tạo chat mới
  const handleChatCreated = (chatRoomId: string) => {
    if (!currentUserId) return;
    setUsersLoading(true);
    const url = `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/related-users?userId=${currentUserId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setAllUsers(data.users || []))
      .finally(() => setUsersLoading(false));
    dispatch(setActiveChat(chatRoomId));
    setActiveChatRoomId(chatRoomId);
    // Đảm bảo join vào phòng chat vừa tạo sau một delay nhỏ để Firestore cập nhật
    setTimeout(() => {
      joinChat(chatRoomId);
    }, 200);
  };

  if (!currentUserId) {
    return (
      <div className="h-[calc(100vh-var(--header-height,80px))] flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <p className="text-gray-500">Please log in to access messages</p>
        </div>
      </div>
    );
  }

  if (!firebaseAvailable) {
    return (
      <div className="h-[calc(100vh-var(--header-height,80px))] flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <p className="text-gray-500">Chat feature is not available</p>
        </div>
      </div>
    );
  }

  // Sử dụng selectedChatRoomId thay vì activeChatRoomIdHook để UI
  const currentActiveChatId = selectedChatRoomId || activeChatRoomIdHook;

  return (
    <div className="h-[calc(100vh-var(--header-height,80px))] flex rounded-2xl overflow-hidden bg-[#F7F8FA] gap-5 p-5">
      {/* Chat List */}
      <ChatList
        chats={chatRooms.map(mapChatRoomToChat)}
        activeChatId={currentActiveChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={() => { }}
      />

      {/* Chat Room */}
      {(!usersLoading && currentActiveChatId && !isChatLoading) ? (
        <ChatRoom
          key={`${currentActiveChatId}-${forceRefresh}`} // Force re-render khi chat thay đổi
          chat={chatRooms.find(room => room.id === currentActiveChatId) ? mapChatRoomToChat(chatRooms.find(room => room.id === currentActiveChatId)) : null}
          currentUserId={currentUserId}
          messages={messages}
          sendMessage={sendMessage}
          loading={loading}
          error={error}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white rounded-2xl">
          <span className="text-gray-400">Loading chat...</span>
        </div>
      )}

      {/* Modal tạo chat */}
      <CreateChatModal
        open={/* trạng thái modal */ false}
        onClose={() => { }}
        currentUserId={currentUserId}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
};

export default MessagePage;
