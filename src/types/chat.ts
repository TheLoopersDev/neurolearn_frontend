export interface ChatMessage {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export interface ChatMember {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url?: string;
  };
  role: 'user' | 'instructor' | 'admin';
}

export interface Chat {
  _id: string;
  members: ChatMember[];
  isGroup: boolean;
  groupName?: string;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

export interface CreateChatRequest {
  members: string[];
  isGroup: boolean;
  groupName?: string;
}

export interface SendMessageRequest {
  sender: string;
  content: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url?: string;
  };
}

export interface ChatListResponse {
  success: boolean;
  chats: Chat[];
}

export interface ChatDetailResponse {
  success: boolean;
  chat: Chat;
}

export interface CreateChatResponse {
  success: boolean;
  chat: Chat;
}

export interface SendMessageResponse {
  success: boolean;
  message: ChatMessage;
}

export interface UsersResponse {
  success: boolean;
  users: UserInfo[];
}

export interface UserInfoResponse {
  success: boolean;
  user: UserInfo;
} 