import { Chat, ChatMember } from '@/types/chat';

export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const formatChatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString();
  }
};

export const getChatDisplayName = (chat: Chat, currentUserId: string): string => {
  if (chat.isGroup) {
    return chat.groupName || 'Group Chat';
  }
  
  const otherMember = chat.members.find((member: ChatMember) => member._id !== currentUserId);
  return otherMember?.name || 'Unknown User';
};

export const getChatAvatar = (chat: Chat, currentUserId: string): string => {
  if (chat.isGroup) {
    // For group chats, you might want to show a group avatar or first member's avatar
    return chat.members[0]?.avatar?.url || '/assets/images/avatar-default.png';
  }
  
  const otherMember = chat.members.find((member: ChatMember) => member._id !== currentUserId);
  return otherMember?.avatar?.url || '/assets/images/avatar-default.png';
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}; 