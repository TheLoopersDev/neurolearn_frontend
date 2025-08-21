import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  where,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebaseClient';

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date; // Thay đổi từ Timestamp sang Date
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  type?: 'text' | 'image' | 'file';
  read?: boolean;
  replyTo?: {
    messageId: string;
    content: string;
    senderId: string;
  };
  reactions?: MessageReaction[];
  senderInfo?: {
    name: string;
    email: string;
    avatar?: any;
  };
}

export interface ChatRoom {
  id?: string;
  participants: string[];
  participantUsers?: any[]; // Thông tin user được lưu trực tiếp
  lastMessage?: ChatMessage;
  lastMessageTime?: Timestamp;
  // Optional per-viewer display names for 1-1 rooms
  displayNameFor?: Record<string, string>;
  // Optional group fields
  isGroup?: boolean;
  groupName?: string;
  createdAt: Timestamp;
}

// Tạo hoặc lấy chat room giữa 2 user
export const getOrCreateChatRoom = async (
  userId1: string,
  userId2: string,
  user1Name?: string,
  user2Name?: string,
): Promise<string> => {
  const chatRoomsRef = collection(db, 'chatRooms');
  // Tìm chat room đã tồn tại giữa đúng 2 user (không phải group)
  const q = query(
    chatRoomsRef,
    where('participants', 'array-contains', userId1),
    where('isGroup', '==', false)
  );
  const querySnapshot = await getDocs(q);
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data() as ChatRoom & { isGroup?: boolean };
    // So sánh participants đúng 2 user, không quan tâm thứ tự, loại bỏ khoảng trắng và ép kiểu string
    const participants = (data.participants || []).map((id: any) => String(id).trim());
    if (
      Array.isArray(participants) &&
      participants.length === 2 &&
      participants.includes(String(userId2).trim()) &&
      participants.includes(String(userId1).trim())
    ) {
      return docSnap.id;
    }
  }
  
  // Tạo chat room mới với thông tin user được lưu trực tiếp
  const newChatRoom: Omit<ChatRoom, 'id'> & { isGroup: boolean; participantUsers: any[] } = {
    participants: [String(userId1).trim(), String(userId2).trim()],
    participantUsers: [
      {
        _id: String(userId1).trim(),
        name: user1Name || `User ${String(userId1).slice(-4)}`,
        email: '',
        avatar: null
      },
      {
        _id: String(userId2).trim(),
        name: user2Name || `User ${String(userId2).slice(-4)}`,
        email: '',
        avatar: null
      }
    ],
    createdAt: serverTimestamp() as Timestamp,
    lastMessageTime: serverTimestamp() as Timestamp,
    isGroup: false,
    displayNameFor: {
      [String(userId1).trim()]: user2Name || `User ${String(userId2).slice(-4)}`,
      [String(userId2).trim()]: user1Name || `User ${String(userId1).slice(-4)}`,
    },
  };
  const docRef = await addDoc(chatRoomsRef, newChatRoom);
  return docRef.id;
};

// Gửi tin nhắn với reply support
export const sendMessage = async (
  chatRoomId: string,
  senderId: string,
  receiverId: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text',
  replyTo?: {
    messageId: string;
    content: string;
    senderId: string;
  },
  senderInfo?: {
    name: string;
    email: string;
    avatar?: any;
  }
): Promise<string> => {
  const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);

  const message: Omit<ChatMessage, 'id'> & { senderInfo?: any } = {
    senderId,
    receiverId,
    content,
    timestamp: serverTimestamp() as Timestamp,
    type,
    read: false,
    replyTo,
    reactions: [],
    senderInfo: senderInfo || undefined, // Lưu thông tin sender
  };

  const docRef = await addDoc(messagesRef, message);

  // Cập nhật last message trong chat room
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  await updateDoc(chatRoomRef, {
    lastMessage: message,
    lastMessageTime: message.timestamp,
  });

  return docRef.id;
};

// Thêm reaction vào tin nhắn
export const addReaction = async (
  chatRoomId: string,
  messageId: string,
  userId: string,
  emoji: string
): Promise<void> => {
  const messageRef = doc(db, `chatRooms/${chatRoomId}/messages`, messageId);
  
  // Lấy tin nhắn hiện tại
  const messageSnap = await getDoc(messageRef);
  const messageData = messageSnap.data() as ChatMessage;
  
  if (messageData) {
    const currentReactions = messageData.reactions || [];
    
    // Kiểm tra xem user đã reaction emoji này chưa
    const existingReactionIndex = currentReactions.findIndex(
      reaction => reaction.userId === userId && reaction.emoji === emoji
    );
    
    if (existingReactionIndex === -1) {
      // Thêm reaction mới - sử dụng new Date() thay vì serverTimestamp() để tránh lỗi
      const newReaction: MessageReaction = {
        userId,
        emoji,
        timestamp: new Date() as any, // Sử dụng client timestamp thay vì serverTimestamp
      };
      
      await updateDoc(messageRef, {
        reactions: [...currentReactions, newReaction],
      });
    }
  }
};

// Xóa reaction khỏi tin nhắn
export const removeReaction = async (
  chatRoomId: string,
  messageId: string,
  userId: string,
  emoji: string
): Promise<void> => {
  const messageRef = doc(db, `chatRooms/${chatRoomId}/messages`, messageId);
  
  // Lấy tin nhắn hiện tại để tìm reaction cần xóa
  const messageSnap = await getDoc(messageRef);
  const messageData = messageSnap.data() as ChatMessage;
  
  if (messageData?.reactions) {
    const updatedReactions = messageData.reactions.filter(
      reaction => !(reaction.userId === userId && reaction.emoji === emoji)
    );
    
    await updateDoc(messageRef, {
      reactions: updatedReactions,
    });
  }
};

// Lấy tin nhắn của một chat room
export const getMessages = async (chatRoomId: string): Promise<ChatMessage[]> => {
  const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[];
};

// Real-time listener cho tin nhắn
export const subscribeToMessages = (
  chatRoomId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, querySnapshot => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];
    callback(messages);
  }, (error) => {
    console.error('subscribeToMessages error for chatRoomId:', chatRoomId, error);
  });
};

// Lấy danh sách chat rooms của user
export const getUserChatRooms = async (userId: string): Promise<ChatRoom[]> => {
  const chatRoomsRef = collection(db, 'chatRooms');
  const q = query(
    chatRoomsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatRoom[];
};

// Real-time listener cho chat rooms
export const subscribeToChatRooms = (userId: string, callback: (chatRooms: ChatRoom[]) => void) => {
  const chatRoomsRef = collection(db, 'chatRooms');
  const q = query(
    chatRoomsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(q, querySnapshot => {
    const chatRooms = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatRoom[];
    callback(chatRooms);
  });
};

// Đánh dấu tin nhắn đã đọc
export const markMessageAsRead = async (chatRoomId: string, messageId: string) => {
  const messageRef = doc(db, `chatRooms/${chatRoomId}/messages`, messageId);
  await updateDoc(messageRef, { read: true });
};

// Xóa tin nhắn
export const deleteMessage = async (chatRoomId: string, messageId: string) => {
  const messageRef = doc(db, `chatRooms/${chatRoomId}/messages`, messageId);
  await deleteDoc(messageRef);
};

// Group management functions

// Cập nhật tên group chat
export const updateGroupName = async (chatRoomId: string, newName: string): Promise<void> => {
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  await updateDoc(chatRoomRef, { 
    groupName: newName, // Sử dụng groupName thay vì name
    updatedAt: serverTimestamp() as Timestamp
  });
};

// Thêm thành viên vào group chat
export const addMembersToGroup = async (chatRoomId: string, memberIds: string[]): Promise<void> => {
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  
  // Lấy thông tin chat room hiện tại
  const chatRoomSnap = await getDoc(chatRoomRef);
  const chatRoomData = chatRoomSnap.data();
  
  if (!chatRoomData) {
    throw new Error('Chat room not found');
  }
  
  // Thêm members mới vào participants
  const currentParticipants = chatRoomData.participants || [];
  const newParticipants = [...new Set([...currentParticipants, ...memberIds])];
  
  await updateDoc(chatRoomRef, {
    participants: newParticipants,
    updatedAt: serverTimestamp() as Timestamp
  });
};

// Xóa thành viên khỏi group chat
export const removeMemberFromGroup = async (chatRoomId: string, memberId: string): Promise<void> => {
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  
  // Lấy thông tin chat room hiện tại
  const chatRoomSnap = await getDoc(chatRoomRef);
  const chatRoomData = chatRoomSnap.data();
  
  if (!chatRoomData) {
    throw new Error('Chat room not found');
  }
  
  // Xóa member khỏi participants
  const currentParticipants = chatRoomData.participants || [];
  const updatedParticipants = currentParticipants.filter((id: string) => id !== memberId);
  
  // Kiểm tra xem có còn đủ 2 người không (minimum cho group)
  if (updatedParticipants.length < 2) {
    throw new Error('Group must have at least 2 members');
  }
  
  await updateDoc(chatRoomRef, {
    participants: updatedParticipants,
    updatedAt: serverTimestamp() as Timestamp
  });
};

// Backfill displayNameFor for existing rooms
export const backfillDisplayNames = async (userId: string, userNames: Record<string, string>) => {
  const chatRoomsRef = collection(db, 'chatRooms');
  const q = query(
    chatRoomsRef,
    where('participants', 'array-contains', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);
  
  querySnapshot.docs.forEach(doc => {
    const roomData = doc.data();
    if (!roomData.displayNameFor) {
      const displayNameFor: Record<string, string> = {};
      
      roomData.participants.forEach((participantId: string) => {
        if (participantId !== userId) {
          displayNameFor[participantId] = userNames[participantId] || `User ${participantId.slice(-4)}`;
        }
      });
      
      batch.update(doc.ref, { displayNameFor });
    }
  });
  
  await batch.commit();
};
