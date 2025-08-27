# Debug Chat Persistence Issue

## Vấn đề hiện tại
Reload trang vẫn bị mất chat mặc dù đã implement localStorage persistence.

## Các bước debug

### 1. Kiểm tra localStorage
Mở Developer Tools (F12) và chạy trong Console:

```javascript
// Kiểm tra localStorage có hoạt động không
console.log('localStorage available:', typeof localStorage !== 'undefined');

// Kiểm tra user ID hiện tại
// Thay thế YOUR_USER_ID bằng user ID thực tế
const userId = 'YOUR_USER_ID';
const key = `activeChatRoom_${userId}`;

// Kiểm tra giá trị đã lưu
const stored = localStorage.getItem(key);
console.log('Stored chat room:', stored);

// Test set/get
localStorage.setItem(key, 'test-room-id');
const testStored = localStorage.getItem(key);
console.log('Test result:', testStored);
```

### 2. Kiểm tra Console Logs
Trong message page, mở Console và tìm các log sau:

```
Restoring active chat room from localStorage: [room-id]
Joining chat room: [room-id]
Running auto-select logic
Active room still exists, marking as auto-selected
```

### 3. Test localStorage HTML
Mở file `localStorage-test.html` trong browser để test localStorage cơ bản.

### 4. Debug Button
Trong message page, có button "Test localStorage" màu đỏ ở góc trên bên phải.
Click vào để test localStorage functionality.

## Các nguyên nhân có thể

### 1. localStorage bị disable
- Kiểm tra browser settings
- Kiểm tra private/incognito mode
- Kiểm tra browser extensions

### 2. User ID không đúng
- Kiểm tra `currentUserId` trong console
- Đảm bảo user đã đăng nhập

### 3. Timing issue
- localStorage được set sau khi component đã mount
- useEffect dependencies không đúng

### 4. Chat room không tồn tại
- Chat room bị xóa khỏi Firestore
- User không có quyền truy cập

## Cách fix thủ công

### 1. Set localStorage manually
```javascript
// Trong Console, set chat room ID
const userId = 'YOUR_USER_ID';
const chatRoomId = 'YOUR_CHAT_ROOM_ID';
localStorage.setItem(`activeChatRoom_${userId}`, JSON.stringify(chatRoomId));
```

### 2. Reload page
Sau khi set localStorage, reload page để test.

### 3. Kiểm tra kết quả
Chat room sẽ được auto-select nếu localStorage hoạt động đúng.

## Next Steps

1. **Test localStorage cơ bản** với file HTML
2. **Kiểm tra Console logs** trong message page
3. **Test manual localStorage** trong Console
4. **Báo cáo kết quả** để tiếp tục debug

## Expected Behavior

Khi localStorage hoạt động đúng:
1. Chọn một chat room
2. localStorage được set với chat room ID
3. Reload page
4. Chat room được auto-select từ localStorage
5. Messages được load lại

## Troubleshooting Commands

```javascript
// Kiểm tra tất cả localStorage
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key));
});

// Clear localStorage
localStorage.clear();

// Test specific key
const key = 'activeChatRoom_YOUR_USER_ID';
console.log(localStorage.getItem(key));
``` 