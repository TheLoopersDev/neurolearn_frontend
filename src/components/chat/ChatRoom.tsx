import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Chat, ChatMessage } from '@/types/chat';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useSendMessageMutation } from '@/lib/redux/features/chat/chatApi';
import { getChatDisplayName, getChatAvatar } from '@/utils/chatUtils';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface ChatRoomProps {
    chat: Chat | null;
    currentUserId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chat, currentUserId }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { sendMessage, sendTyping } = useChatSocket();
    const [sendMessageApi] = useSendMessageMutation();
    const { typingUsers } = useSelector((state: RootState) => state.chat);

    // Dùng trực tiếp chat.members
    const members = chat ? chat.members : [];

    // Lấy user còn lại (không phải mình) nếu là chat cá nhân
    const otherMember = !chat?.isGroup
        ? members.find((m: import('@/types/chat').ChatMember) => m._id !== currentUserId)
        : undefined;
    const role = !chat?.isGroup && otherMember ? otherMember.role : undefined;

    // Get typing users for this chat
    const chatTypingUsers = chat ? typingUsers[chat._id] || [] : [];

    // Update messages when chat changes
    useEffect(() => {
        if (chat) {
            setMessages(chat.messages || []);
        } else {
            setMessages([]);
        }
    }, [chat]);

    const handleSendMessage = async (content: string) => {
        if (!chat || !content.trim()) return;

        try {
            // Optimistic update
            const tempMessage: ChatMessage = {
                _id: `temp-${Date.now()}`,
                sender: currentUserId,
                content: content.trim(),
                timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, tempMessage]);

            // Send via socket for real-time
            sendMessage(chat._id, content.trim());

            // Also send via API for persistence
            await sendMessageApi({
                chatId: chat._id,
                messageData: {
                    sender: currentUserId,
                    content: content.trim(),
                },
            }).unwrap();

            // Remove temp message and let the real one come through socket
            setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));

        } catch (error) {
            console.error('Failed to send message:', error);
            // Remove temp message on error
            setMessages(prev => prev.filter(msg => !msg._id.startsWith('temp-')));
        }
    };

    const handleTyping = (isTyping: boolean) => {
        if (!chat) return;

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing indicator
        if (isTyping) {
            typingTimeoutRef.current = setTimeout(() => {
                sendTyping(chat._id, false);
            }, 3000);
        }
    };

    // Cleanup typing timeout
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

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
                    messages={messages}
                    currentUserId={currentUserId}
                    chatMembers={members}
                />

                {/* Typing Indicator */}
                {chatTypingUsers.length > 0 && (
                    <TypingIndicator
                        typingUsers={chatTypingUsers}
                        chatMembers={members}
                        currentUserId={currentUserId}
                    />
                )}
            </div>

            {/* Input */}
            <MessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                disabled={false}
            />
        </div>
    );
};

export default ChatRoom;
