import React from 'react';
import Image from 'next/image';
import { ChatMessage, ChatMember } from '@/types/chat';
import { formatMessageTime } from '@/utils/chatUtils';

interface MessageItemProps {
    message: ChatMessage;
    sender?: ChatMember;
    isMe: boolean;
    showAvatar: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    sender,
    isMe,
    showAvatar,
}) => {
    return (
        <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar for other users */}
            {showAvatar && sender && (
                <Image
                    src={sender.avatar?.url || '/assets/images/avatar-default.png'}
                    alt={sender.name}
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                />
            )}

            {/* Message bubble */}
            <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                <div
                    className={`
            rounded-2xl px-4 py-2.5
            ${isMe
                            ? 'bg-blue-500 text-white rounded-br-lg'
                            : 'bg-gray-100 text-gray-800 rounded-bl-lg'
                        }
          `}
                >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {formatMessageTime(message.timestamp)}
                </div>
            </div>

            {/* Spacer for alignment */}
            {!isMe && !showAvatar && <div className="w-8 flex-shrink-0" />}
        </div>
    );
};

export default MessageItem; 