'use client';
import React, { useEffect, useCallback, useState, useRef } from 'react';
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
  const currentUserId = currentUser?._id || currentUser?.id;

  // Firestore chat hook - only use if Firebase is available
  const firebaseAvailable = isFirebaseAvailable();
  const { chatRooms, joinChat, leaveChat, activeChatRoomId: activeChatRoomIdHook, setActiveChatRoomId, messages, sendMessage, loading, error } = useFirestoreChat();

  // State loading cho box chat
  const [isChatLoading, setIsChatLoading] = useState(false);
  const prevChatRoomId = useRef<string | null>(null);

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
    if (activeChatRoomIdHook) {
      leaveChat();
    }
    setIsChatLoading(true);
    dispatch(setActiveChat(chatRoomId));
    setActiveChatRoomId(chatRoomId);
    await joinChat(chatRoomId);
    prevChatRoomId.current = chatRoomId;
  }, [activeChatRoomIdHook, dispatch, joinChat, leaveChat, setActiveChatRoomId]);

  // Khi messages thay đổi hoặc activeChatRoomId đổi, tắt loading
  useEffect(() => {
    if (isChatLoading && messages && messages.length >= 0) {
      setIsChatLoading(false);
    }
  }, [messages, activeChatRoomIdHook, isChatLoading]);

  // Auto-select first chat if none selected, hoặc chọn phòng chat mới nhất có lastMessage chưa đọc
  useEffect(() => {
    if (chatRooms.length > 0) {
      // Nếu chưa có phòng chat nào active hoặc active chat không còn tồn tại trong danh sách
      const activeRoomStillExists = chatRooms.some(room => room.id === activeChatRoomIdHook);
      if (!activeChatRoomIdHook || !activeRoomStillExists) {
        // Ưu tiên chọn phòng chat có lastMessage chưa đọc (nếu có)
        const unreadRoom = chatRooms.find(room => {
          // Nếu lastMessage tồn tại và receiverId là currentUserId và chưa đọc
          return room.lastMessage && room.lastMessage.receiverId === currentUserId && !room.lastMessage.read;
        });
        if (unreadRoom) {
          handleSelectChat(unreadRoom.id!);
        } else {
          // Nếu không có, chọn phòng chat mới nhất (theo lastMessageTime hoặc createdAt)
          const sortedRooms = [...chatRooms].sort((a, b) => {
            const aTime = a.lastMessageTime || a.createdAt;
            const bTime = b.lastMessageTime || b.createdAt;
            return bTime?.toMillis?.() - aTime?.toMillis?.();
          });
          if (sortedRooms.length > 0) {
            handleSelectChat(sortedRooms[0].id!);
          }
        }
      }
    }
  }, [chatRooms, activeChatRoomIdHook, handleSelectChat, currentUserId]);

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
    // Đảm bảo join vào phòng chat vừa tạo
    joinChat(chatRoomId);
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

  return (
    <div className="h-[calc(100vh-var(--header-height,80px))] flex rounded-2xl overflow-hidden bg-[#F7F8FA] gap-5 p-5">
      {/* Chat List */}
      <ChatList
        chats={chatRooms.map(mapChatRoomToChat)}
        activeChatId={activeChatRoomIdHook}
        onSelectChat={handleSelectChat}
        onCreateChat={() => { }}
      />

      {/* Chat Room */}
      {(!usersLoading && activeChatRoomIdHook && !isChatLoading) ? (
        <ChatRoom
          chat={chatRooms.find(room => room.id === activeChatRoomIdHook) ? mapChatRoomToChat(chatRooms.find(room => room.id === activeChatRoomIdHook)) : null}
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
