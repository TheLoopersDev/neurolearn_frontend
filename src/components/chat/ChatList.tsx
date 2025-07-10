import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Chat } from '@/types/chat';
import { getChatDisplayName } from '@/utils/chatUtils';
import CreateChatModal from './CreateChatModal';
import ChatListItem from './ChatListItem';

interface ChatListProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onCreateChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
    chats,
    activeChatId,
    onSelectChat,
    onCreateChat,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [mockChats, setMockChats] = useState<Chat[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);
    const { unreadCounts, onlineUsers } = useSelector((state: RootState) => state.chat);

    // Parse current user
    const currentUser = typeof user === 'string' ? JSON.parse(user || '{}') : user;
    const currentUserId = currentUser?._id || currentUser?.id;

    // Load mock chats from localStorage
    useEffect(() => {
        const storedChats = JSON.parse(localStorage.getItem('mockChats') || '[]');
        setMockChats(storedChats);
    }, []);

    // Refresh mock chats when API chats change (in case of conflicts)
    useEffect(() => {
        const storedChats = JSON.parse(localStorage.getItem('mockChats') || '[]');
        setMockChats(storedChats);
    }, [chats]);

    // Combine API chats with mock chats
    const allChats = [...chats, ...mockChats];

    // Filter chats based on search query
    const filteredChats = allChats.filter(chat => {
        const displayName = getChatDisplayName(chat, currentUserId);
        return displayName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleCreateChat = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        // Trigger a refresh of the chat list
        onCreateChat();
    };

    const handleChatCreated = () => {
        // Refresh mock chats from localStorage
        const storedChats = JSON.parse(localStorage.getItem('mockChats') || '[]');
        setMockChats(storedChats);
        // Trigger a refresh of the chat list
        onCreateChat();
    };

    const handleSelectChat = (chatId: string) => {
        onSelectChat(chatId);
        // Scroll to top of chat list (nếu cần)
        const chatListDiv = document.querySelector('.flex-1.overflow-y-auto');
        if (chatListDiv) chatListDiv.scrollTop = 0;
    };

    return (
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-white rounded-2xl flex flex-col h-full border-r border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
                <div className="flex gap-2">
                    {mockChats.length > 0 && (
                        <>
                            <button
                                onClick={() => {
                                    const storedChats = JSON.parse(localStorage.getItem('mockChats') || '[]');
                                    setMockChats(storedChats);
                                }}
                                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors text-xs"
                                title="Refresh mock chats"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('mockChats');
                                    setMockChats([]);
                                }}
                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors text-xs"
                                title="Clear mock chats"
                            >
                                Clear
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleCreateChat}
                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        title="Create new chat"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-black rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="text-center p-6">
                            {searchQuery ? (
                                <>
                                    <p className="text-sm">No conversations found</p>
                                    <p className="text-xs mt-1">Try adjusting your search</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm">No conversations yet</p>
                                    <p className="text-xs mt-1">Start a new chat to begin messaging</p>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1 p-2">
                        {filteredChats.map(chat => (
                            <ChatListItem
                                key={chat._id}
                                chat={chat}
                                currentUserId={currentUserId}
                                active={activeChatId === chat._id}
                                onSelect={handleSelectChat}
                                unreadCount={unreadCounts[chat._id] || 0}
                                onlineUsers={onlineUsers}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Chat Modal */}
            {showCreateModal && (
                <CreateChatModal
                    open={showCreateModal}
                    onClose={handleCloseCreateModal}
                    currentUserId={currentUserId}
                    onChatCreated={handleChatCreated}
                />
            )}
        </div>
    );
};

export default ChatList; 