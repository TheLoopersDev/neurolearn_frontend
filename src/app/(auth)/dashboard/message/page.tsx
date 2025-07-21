// src/app/(auth)/dashboard/message/page.tsx
'use client';
import React, { useState, useMemo } from 'react';
import ConversationList from './_components/ConversationList';
import ChatWindow from './_components/ChatWindow';
import { Conversation, Message, User } from './_components/types';

// --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
const CURRENT_USER_ID = 'me';

const mockUsers: Record<string, User> = {
  user1: {
    id: 'user1',
    name: 'Dao Tuan Kiet',
    avatarUrl: '/assets/images/avatar.png',
    role: 'Design Instructor',
  },
  // Thêm các user khác nếu cần
};

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participant: mockUsers['user1'],
    lastMessage: { text: 'OK, you can ask anything', timestamp: '3d ago' },
    unreadCount: 2,
  },
  // Thêm các cuộc trò chuyện khác
];

const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: 'msg1',
      text: "Thanks for joining us on this journey to becoming a top Designer! This course took nearly a year to build, and we believe it can truly help you grow.\n\nJoin us on Discord (see Lesson 2) to ask questions or meet others. Enjoy the course!\n\nP.S. A review would mean a lot if you're enjoying it!",
      senderId: 'user1',
      timestamp: '3d ago',
    },
    {
      id: 'msg2',
      text: 'I want to ask you a question about layout in interface design for applications?',
      senderId: CURRENT_USER_ID,
      timestamp: '3d ago',
    },
    { id: 'msg3', text: 'OK, you can ask anything', senderId: 'user1', timestamp: '3d ago' },
  ],
};
// ------------------------------------

const MessagePage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    mockConversations[0]?.id || null
  );

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    // TODO: Xóa số tin nhắn chưa đọc khi click vào
  };

  const handleSendMessage = (text: string) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      senderId: CURRENT_USER_ID,
      timestamp: 'Just now',
    };

    // Cập nhật state messages
    setMessages(prevMessages => {
      const activeConvoMessages = prevMessages[activeConversationId] || [];
      return {
        ...prevMessages,
        [activeConversationId]: [...activeConvoMessages, newMessage],
      };
    });

    // Cập nhật lastMessage của conversation
    setConversations(prevConvos =>
      prevConvos.map(convo =>
        convo.id === activeConversationId
          ? { ...convo, lastMessage: { text, timestamp: 'Just now' } }
          : convo
      )
    );
  };

  const activeConversation = useMemo(
    () => conversations.find(c => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const activeMessages = useMemo(
    () => messages[activeConversationId || ''] || [],
    [messages, activeConversationId]
  );

  return (
    <div className="h-[calc(100vh-var(--header-height,80px))] flex rounded-2xl overflow-hidden bg-[#F7F8FA] gap-5">
      {' '}
      {/* Điều chỉnh chiều cao */}
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />
      <ChatWindow
        conversation={activeConversation}
        messages={activeMessages}
        currentUserId={CURRENT_USER_ID}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default MessagePage;
