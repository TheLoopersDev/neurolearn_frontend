import React from 'react';
import { Chat } from '@/types/chat';
import { getChatDisplayName, getChatAvatar } from '@/utils/chatUtils';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatRoomProps {
    chat: Chat | null;
    currentUserId: string;
    messages: any[];
    sendMessage: (receiverId: string, content: string) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chat, currentUserId, messages, sendMessage, loading, error }) => {


    // Lấy messages trực tiếp từ props
    const mappedMessages = messages.map((msg: any) => ({
        _id: msg.id || '',
        sender: msg.senderId,
        content: msg.content,
        timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate().toISOString() : '',
    }));

    // Dùng trực tiếp chat.members
    const members = chat ? chat.members : [];

    // Lấy user còn lại (không phải mình) nếu là chat cá nhân
    const otherMember = !chat?.isGroup
        ? members.find((m: import('@/types/chat').ChatMember) => m._id !== currentUserId)
        : undefined;
    const role = !chat?.isGroup && otherMember ? otherMember.role : undefined;

    const handleSendMessage = async (content: string) => {
        if (!chat || !content.trim() || !otherMember) {
            return;
        }
        try {
            await sendMessage(otherMember._id, content.trim());
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (!chat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a chat from the list to start messaging</p>
                </div>
            </div>
        );
    }

    const displayName = getChatDisplayName(chat, currentUserId);
    const avatar = getChatAvatar(chat, currentUserId);

    return (
        <div className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
            {/* Header */}
            <ChatHeader
                name={displayName}
                avatar={avatar}
                isGroup={chat.isGroup}
                memberCount={chat.isGroup ? members.length : undefined}
                role={role}
            />

            {/* Messages */}
            <div className="flex-1 flex flex-col min-h-0">
                <MessageList
                    messages={mappedMessages}
                    currentUserId={currentUserId}
                    chatMembers={members}
                />
            </div>

            {/* Input */}
            <MessageInput
                onSendMessage={handleSendMessage}
                disabled={loading}
            />

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 border-t border-red-200">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
