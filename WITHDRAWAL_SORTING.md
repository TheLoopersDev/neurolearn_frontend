# 🔄 Logic Sắp Xếp Yêu Cầu Rút Tiền

## 📋 Tổng Quan
Hệ thống đã được cập nhật để ưu tiên hiển thị các yêu cầu rút tiền có trạng thái `pending` lên đầu danh sách.

## 🎯 Logic Sắp Xếp

### **Ưu tiên 1: Trạng thái Pending**
- Các yêu cầu có `status = 'pending'` luôn được hiển thị đầu tiên
- Giúp admin xử lý các yêu cầu chờ duyệt một cách ưu tiên

### **Ưu tiên 2: Thời gian yêu cầu**
- Trong cùng trạng thái, sắp xếp theo thời gian yêu cầu
- Yêu cầu mới nhất hiển thị trước (newest first)

## 🔧 Các File Đã Cập Nhật

### 1. **Admin Dashboard** (`/dashboard/withdrawals`)
```typescript
// Sắp xếp danh sách yêu cầu rút tiền
const sortedWithdraws = filteredWithdraws.sort((a, b) => {
  // First priority: pending status
  if (a.status === 'pending' && b.status !== 'pending') return -1;
  if (a.status !== 'pending' && b.status === 'pending') return 1;
  
  // Second priority: by requested date (newest first)
  const dateA = new Date(a.requestedAt).getTime();
  const dateB = new Date(b.requestedAt).getTime();
  return dateB - dateA;
});
```

### 2. **Instructor Transaction History**
```typescript
// Sắp xếp lịch sử rút tiền của instructor
const sortedWithdraws = data.data.withdraws.sort((a, b) => {
  // First priority: pending status
  if (a.status === 'pending' && b.status !== 'pending') return -1;
  if (a.status !== 'pending' && b.status === 'pending') return 1;
  
  // Second priority: by requested date (newest first)
  const dateA = new Date(a.requestedAt).getTime();
  const dateB = new Date(b.requestedAt).getTime();
  return dateB - dateA;
});
```

## 🎨 Giao Diện Cải Tiến

### **Admin Dashboard**
- ✅ Indicator thông báo: "📋 Pending requests are shown first for priority processing"
- ✅ Highlight đặc biệt cho yêu cầu pending:
  - Border màu cam
  - Background màu cam nhạt
  - Banner "⚡ PRIORITY - PENDING APPROVAL"

### **Instructor History**
- ✅ Badge nhỏ: "⚡ Pending first"
- ✅ Sắp xếp tự động theo ưu tiên

## 📊 Ví Dụ Sắp Xếp

```
1. [PENDING] Yêu cầu A - 2024-01-15 14:30 (Mới nhất)
2. [PENDING] Yêu cầu B - 2024-01-15 10:15
3. [PENDING] Yêu cầu C - 2024-01-14 16:45
4. [APPROVED] Yêu cầu D - 2024-01-15 18:20 (Mới nhất)
5. [APPROVED] Yêu cầu E - 2024-01-15 09:30
6. [REJECTED] Yêu cầu F - 2024-01-13 11:00
```

## 🚀 Lợi Ích

1. **Admin hiệu quả hơn**: Xử lý yêu cầu pending trước
2. **Ưu tiên rõ ràng**: Không bỏ sót yêu cầu chờ duyệt
3. **Trải nghiệm tốt hơn**: Instructor thấy yêu cầu pending của mình đầu tiên
4. **Quản lý thời gian**: Yêu cầu mới được xử lý ưu tiên

## 🔄 Cách Hoạt Động

1. **Khi load trang**: Dữ liệu được sắp xếp theo logic trên
2. **Khi search**: Kết quả tìm kiếm vẫn được sắp xếp theo ưu tiên
3. **Khi filter**: Kết quả lọc vẫn giữ nguyên thứ tự ưu tiên
4. **Real-time**: Mỗi khi có thay đổi, danh sách tự động sắp xếp lại

## 📝 Lưu Ý Kỹ Thuật

- Logic sắp xếp được áp dụng ở cả frontend và backend
- Không ảnh hưởng đến pagination
- Performance tốt với số lượng yêu cầu lớn
- Dễ dàng mở rộng thêm tiêu chí sắp xếp khác 