# Test Chat Persistence - Hướng dẫn test

## 🧪 **Test Steps**

### 1. **Mở Message Page**
- Truy cập `/dashboard/message`
- Mở Developer Tools (F12)

### 2. **Test localStorage cơ bản**
- Click button "Test localStorage" màu đỏ ở góc trên bên phải
- Kiểm tra Console logs:
  ```
  Manual localStorage test: {key: "activeChatRoom_...", stored: "...", parsed: "..."}
  Set test value in localStorage: test-room-id
  Retrieved test value: "test-room-id" Parsed: test-room-id
  ```

### 3. **Test Chat Selection**
- Chọn một chat room từ danh sách
- Kiểm tra Console logs:
  ```
  Selecting chat: [chat-room-id]
  Joining chat room: [chat-room-id]
  ```

### 4. **Test Reload**
- Reload trang (F5)
- Kiểm tra Console logs:
  ```
  Page reload: Restoring active chat room from localStorage: [chat-room-id]
  localStorage restoration: Setting selectedChatRoomId from activeChatRoomIdHook: [chat-room-id]
  ```

### 5. **Kiểm tra kết quả**
- Chat room phải được auto-select sau reload
- Messages phải được load lại
- Không bị mất chat

## 🔍 **Debug Commands**

### Kiểm tra localStorage trong Console:
```javascript
// Kiểm tra tất cả localStorage
Object.keys(localStorage).forEach(key => {
  if (key.includes('activeChatRoom')) {
    console.log(key, localStorage.getItem(key));
  }
});

// Kiểm tra user ID hiện tại
console.log('Current user ID:', 'YOUR_USER_ID'); // Thay bằng user ID thực

// Test set/get localStorage
const userId = 'YOUR_USER_ID';
const key = `activeChatRoom_${userId}`;
localStorage.setItem(key, JSON.stringify('test-chat-room'));
console.log('Stored:', localStorage.getItem(key));
console.log('Parsed:', JSON.parse(localStorage.getItem(key)));
```

## 🚨 **Các lỗi thường gặp**

### 1. **"Unexpected token" error**
- **Nguyên nhân**: localStorage không được lưu dưới dạng JSON
- **Fix**: Đã sửa trong code

### 2. **Chat không được khôi phục**
- **Nguyên nhân**: User ID không đúng hoặc localStorage bị clear
- **Check**: Kiểm tra localStorage key có đúng format không

### 3. **Auto-select không hoạt động**
- **Nguyên nhân**: Logic auto-select bị conflict
- **Check**: Kiểm tra console logs để xem flow

## ✅ **Expected Behavior**

### Khi hoạt động đúng:
1. ✅ localStorage được set khi chọn chat
2. ✅ localStorage được restore khi reload
3. ✅ Chat room được auto-select
4. ✅ Messages được load lại
5. ✅ Không bị mất chat

### Console logs cần có:
```
Restoring active chat room from localStorage: [room-id]
Joining chat room: [room-id]
localStorage restoration: Setting selectedChatRoomId from activeChatRoomIdHook: [room-id]
```

## 📝 **Báo cáo kết quả**

Sau khi test, hãy báo cáo:
1. **localStorage test button** có hoạt động không?
2. **Console logs** hiển thị gì?
3. **Chat có được khôi phục** sau reload không?
4. **Có lỗi nào** trong Console không?

## 🛠️ **Next Steps**

Nếu vẫn có vấn đề:
1. Kiểm tra user authentication
2. Kiểm tra Firestore connections
3. Debug timing issues
4. Test với different browsers 