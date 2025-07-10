import React from 'react';
import Image from 'next/image';

interface ChatHeaderProps {
    name: string;
    avatar: string;
    isGroup?: boolean;
    memberCount?: number;
    role?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    name,
    avatar,
    isGroup = false,
    memberCount,
    role,
}) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
                <Image
                    src={avatar}
                    alt={name}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
                    {isGroup && memberCount && (
                        <p className="text-xs text-gray-500">{memberCount} members</p>
                    )}
                    {!isGroup && (
                        <p className="text-xs text-gray-500">{role || ''}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHeader; 