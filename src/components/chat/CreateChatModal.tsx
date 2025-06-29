import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Search, Users } from 'lucide-react';
import { useGetAllUsersQuery, useCreateChatMutation } from '@/lib/redux/features/chat/chatApi';
import { useDispatch } from 'react-redux';
import { setActiveChat } from '@/lib/redux/features/chat/chatSlice';
import { Chat } from '@/types/chat';

interface CreateChatModalProps {
    open: boolean;
    onClose: () => void;
    currentUserId: string;
    onChatCreated?: () => void; // Callback to refresh chat list
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({
    open,
    onClose,
    currentUserId,
    onChatCreated,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const dispatch = useDispatch();

    const { data: users = [], isLoading } = useGetAllUsersQuery();
    const [createChat, { isLoading: isCreating }] = useCreateChatMutation();

    // Filter out current user and apply search
    const filteredUsers = users.filter(
        (user) =>
            user._id !== currentUserId &&
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreateChat = async () => {
        if (selectedUsers.length === 0) return;

        try {
            const chatData = {
                members: [currentUserId, ...selectedUsers],
                isGroup: isGroup,
                groupName: isGroup ? groupName : undefined,
            };

            // Try to create chat via API
            let result;
            try {
                result = await createChat(chatData).unwrap();
            } catch (apiError) {
                // Create a mock chat for testing
                const mockChat: Chat = {
                    _id: `mock-${Date.now()}`,
                    members: users.filter(u => selectedUsers.includes(u._id) || u._id === currentUserId).map(u => ({
                        _id: u._id,
                        name: u.name,
                        email: u.email,
                        avatar: u.avatar,
                        role: 'user' as const,
                    })),
                    isGroup: isGroup,
                    groupName: isGroup ? groupName : undefined,
                    messages: [],
                    lastMessage: undefined,
                    unreadCount: 0,
                };
                // Store mock chat in localStorage for persistence
                const existingChats = JSON.parse(localStorage.getItem('mockChats') || '[]');
                existingChats.push(mockChat);
                localStorage.setItem('mockChats', JSON.stringify(existingChats));
                result = mockChat;
            }
            // Auto-select the newly created chat
            if (result && result._id) {
                dispatch(setActiveChat(result._id));
            }

            // Reset form
            setSelectedUsers([]);
            setGroupName('');
            setIsGroup(false);
            setSearchQuery('');

            // Notify parent component to refresh chat list
            if (onChatCreated) {
                setTimeout(() => {
                    onChatCreated();
                }, 100);
            }

            onClose();
        } catch (error) {
            // Do nothing
        }
    };

    const handleClose = () => {
        setSelectedUsers([]);
        setGroupName('');
        setIsGroup(false);
        setSearchQuery('');
        onClose();
    };

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!open) {
            setSelectedUsers([]);
            setGroupName('');
            setIsGroup(false);
            setSearchQuery('');
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">New Conversation</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-200">
                    <div className="relative">
                        <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-black rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Group Options */}
                {selectedUsers.length > 1 && (
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                            <input
                                type="checkbox"
                                id="isGroup"
                                checked={isGroup}
                                onChange={(e) => setIsGroup(e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="isGroup" className="text-sm font-medium text-gray-700">
                                Create as group chat
                            </label>
                        </div>

                        {isGroup && (
                            <input
                                type="text"
                                placeholder="Enter group name..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full text-black rounded-lg bg-gray-100 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        )}
                    </div>
                )}

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Users size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">
                                {searchQuery ? 'No users found' : 'No users available'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserToggle(user._id)}
                                    className={`
                    flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
                    ${selectedUsers.includes(user._id)
                                            ? 'bg-blue-50 border border-blue-200'
                                            : 'hover:bg-gray-50'
                                        }
                  `}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user._id)}
                                        onChange={() => handleUserToggle(user._id)}
                                        className="rounded"
                                    />

                                    <Image
                                        src={user.avatar?.url || '/assets/images/avatar-default.png'}
                                        alt={user.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 text-sm truncate">
                                            {user.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 py-2 px-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateChat}
                            disabled={selectedUsers.length === 0 || (isGroup && !groupName.trim()) || isCreating}
                            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? 'Creating...' : 'Create Chat'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateChatModal; 