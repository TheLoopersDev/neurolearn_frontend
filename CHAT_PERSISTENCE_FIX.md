# Chat Persistence Fix - Giải quyết vấn đề mất chat khi reload

## Vấn đề đã được fix

### 1. **Khi chuyển từ trang teacher sang message**
- **Trước**: Không tự động chọn chat room đã tạo
- **Sau**: Tự động chọn chat room từ URL parameter `?room=`

### 2. **Khi reload trang**
- **Trước**: Mất chat đang hiển thị
- **Sau**: Khôi phục chat đang active từ localStorage

## Cách hoạt động

### Auto-select từ URL Parameter
```typescript
// Ưu tiên cao nhất: Room từ URL
useEffect(() => {
  const roomFromQuery = searchParams?.get('room');
  if (roomFromQuery && !hasProcessedUrlRoom) {
    console.log('Found room in URL:', roomFromQuery);
    setHasProcessedUrlRoom(true);
    handleSelectChat(roomFromQuery);
    setHasAutoSelected(true);
  }
}, [searchParams, handleSelectChat, hasProcessedUrlRoom]);
```

### LocalStorage Persistence
```typescript
// Lưu active chat room vào localStorage
const setStoredActiveChatRoom = (userId: string, chatRoomId: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (chatRoomId) {
      localStorage.setItem(`activeChatRoom_${userId}`, JSON.stringify(chatRoomId));
    } else {
      localStorage.removeItem(`activeChatRoom_${userId}`);
    }
  } catch (error) {
    console.error('Error saving active chat room to localStorage:', error);
  }
};

// Khôi phục từ localStorage khi user thay đổi
useEffect(() => {
  const userId = getUserId();
  if (userId) {
    const storedChatRoom = getStoredActiveChatRoom(userId);
    if (storedChatRoom && !activeChatRoomId) {
      console.log('Restoring active chat room from localStorage:', storedChatRoom);
      setActiveChatRoomId(storedChatRoom);
    }
  }
}, [user, activeChatRoomId]);
```

## Luồng hoạt động

### 1. **Từ Teacher Page → Message Page**
```
Teacher Page (Send Message) 
  ↓ (navigate với ?room=chatRoomId)
Message Page 
  ↓ (detect room từ URL)
Auto-select chat room
  ↓ (lưu vào localStorage)
Chat hiển thị ngay lập tức
```

### 2. **Reload Message Page**
```
Page reload
  ↓ (khôi phục từ localStorage)
Active chat room được restore
  ↓ (subscribe messages)
Chat hiển thị như cũ
```

### 3. **Auto-select Logic (khi không có room trong URL)**
```
Chat rooms loaded
  ↓
Kiểm tra unread messages
  ↓ (nếu có)
Select unread room
  ↓ (nếu không)
Select most recent room
```

## Các file đã được sửa

### 1. `src/app/(auth)/dashboard/message/page.tsx`
- Thêm `hasProcessedUrlRoom` state
- Cải thiện auto-select logic
- Ưu tiên room từ URL

### 2. `src/hooks/useFirestoreChat.ts`
- Thêm localStorage persistence
- Auto-restore active chat room
- Cải thiện error handling

## Testing

### Test Case 1: Teacher → Message
1. Vào trang teacher
2. Bấm "Send Message"
3. Kiểm tra: Chat room được chọn tự động

### Test Case 2: Reload Page
1. Mở một chat room
2. Reload trang
3. Kiểm tra: Chat room vẫn được chọn

### Test Case 3: Direct Access
1. Truy cập trực tiếp `/dashboard/message`
2. Kiểm tra: Auto-select chat mới nhất hoặc unread

## Troubleshooting

### Chat không hiển thị sau reload
- Kiểm tra localStorage: `localStorage.getItem('activeChatRoom_${userId}')`
- Kiểm tra console logs
- Đảm bảo user đã đăng nhập

### Không auto-select từ URL
- Kiểm tra URL có parameter `?room=`
- Kiểm tra `hasProcessedUrlRoom` state
- Đảm bảo room ID hợp lệ

### Performance Issues
- localStorage operations được wrap trong try-catch
- Auto-select chỉ chạy khi cần thiết
- Cleanup subscriptions khi unmount

## Future Improvements

- **Session Storage**: Thay localStorage bằng sessionStorage cho security
- **Encryption**: Mã hóa chat room ID trong localStorage
- **Sync**: Sync active chat room across tabs
- **Analytics**: Track chat room selection patterns 