import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseClient';

export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  type?: 'text' | 'image' | 'file';
  read?: boolean;
}

export interface ChatRoom {
  id?: string;
  participants: string[];
  lastMessage?: ChatMessage;
  lastMessageTime?: Timestamp;
  createdAt: Timestamp;
}

// Tạo hoặc lấy chat room giữa 2 user
export const getOrCreateChatRoom = async (userId1: string, userId2: string): Promise<string> => {
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
  // Tạo chat room mới
  const newChatRoom: Omit<ChatRoom, 'id'> & { isGroup: boolean } = {
    participants: [String(userId1).trim(), String(userId2).trim()],
    createdAt: serverTimestamp() as Timestamp,
    lastMessageTime: serverTimestamp() as Timestamp,
    isGroup: false,
  };
  const docRef = await addDoc(chatRoomsRef, newChatRoom);
  return docRef.id;
};

// Gửi tin nhắn
export const sendMessage = async (
  chatRoomId: string,
  senderId: string,
  receiverId: string, // thêm receiverId
  content: string,
  type: 'text' | 'image' | 'file' = 'text'
): Promise<string> => {
  const messagesRef = collection(db, `chatRooms/${chatRoomId}/messages`);

  const message: Omit<ChatMessage, 'id'> = {
    senderId,
    receiverId, // lưu đúng receiverId
    content,
    timestamp: serverTimestamp() as Timestamp,
    type,
    read: false,
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
    console.log('Firestore chatRooms:', chatRooms); // DEBUG LOG
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
