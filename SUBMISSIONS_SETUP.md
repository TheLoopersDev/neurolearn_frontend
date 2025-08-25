# 📊 Trang Submissions - Setup Guide

## 🎯 Tổng Quan
Trang **Submissions** đã được tạo thành công với mock data để demo. Trang này cho phép admin xem thống kê submission của toàn bộ instructor.

## ✅ Đã Hoàn Thành

### **1. Frontend Components**
- ✅ **SubmissionsPage**: Trang chính với mock data
- ✅ **SubmissionStats**: Component hiển thị thống kê tổng quan
- ✅ **SubmissionCard**: Component hiển thị thông tin từng instructor
- ✅ **Sidebar Integration**: Menu item đã được thêm vào admin sidebar

### **2. Mock Data**
- ✅ **5 Instructor Examples**: Dữ liệu mẫu với thông tin đầy đủ
- ✅ **Statistics Data**: Thống kê tổng quan platform
- ✅ **Search & Sort**: Chức năng tìm kiếm và sắp xếp hoạt động
- ✅ **Pagination**: Phân trang với 10 items/trang

## 🔧 Cách Sử Dụng Hiện Tại

### **1. Truy Cập Trang**
```
URL: /dashboard/submissions
Role: Admin only
```

### **2. Tính Năng Hoạt Động**
- ✅ **Thống kê tổng quan**: 6 cards với metrics quan trọng
- ✅ **Danh sách instructor**: Hiển thị submission của từng instructor
- ✅ **Tìm kiếm**: Search theo tên hoặc email
- ✅ **Sắp xếp**: Sort by submission, total, available, withdrawn
- ✅ **Phân trang**: Navigation giữa các trang

### **3. Mock Data Structure**
```typescript
// Instructor Data
{
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  total: number;           // Total revenue
  submission: number;      // 10% platform fee
  netIncome: number;       // total - submission
  withdrawn: number;       // Already withdrawn
  available: number;       // Can withdraw
  updatedAt: string;       // Last update time
}

// Statistics Data
{
  totalRevenue: number;        // Sum of all instructor revenue
  totalSubmission: number;     // Sum of all platform fees
  totalWithdrawn: number;      // Sum of all withdrawn amounts
  totalAvailable: number;      // Sum of all available amounts
  activeInstructors: number;   // Instructors with revenue > 0
  totalInstructors: number;    // Total instructors
  averageSubmission: number;   // Average submission per instructor
}
```

## 🚀 Chuyển Sang Real API

### **1. Backend API Requirements**
Khi backend sẵn sàng, cần tạo các API endpoints sau:

```typescript
// GET /api/revenue/all-submissions
// Query params: page, limit, sortBy, sortOrder, search
// Response: { success, data: { submissions[], pagination } }

// GET /api/revenue/submission-statistics  
// Response: { success, data: StatisticsData }
```

### **2. Frontend Changes**
Thay thế mock data bằng real API calls:

```typescript
// Thay thế fetchSubmissions()
const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/revenue/all-submissions?${params}`);

// Thay thế fetchStatistics()
const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/revenue/submission-statistics`);
```

### **3. Remove Mock Indicators**
Xóa indicator "🔧 Using mock data - Backend API pending" khi chuyển sang real API.

## 📱 Giao Diện

### **Header Section**
- Title: "Instructor Submissions"
- Indicators: Platform info + Mock data notice

### **Statistics Cards**
- **Total Revenue**: Tổng doanh thu từ tất cả instructor
- **Total Submission**: Tổng phí dịch vụ (10% của total revenue)
- **Total Available**: Số tiền instructor có thể rút
- **Total Withdrawn**: Số tiền đã được rút
- **Active Instructors**: Số instructor có hoạt động
- **Average Submission**: Trung bình submission per instructor

### **Submission Cards**
- Avatar và thông tin instructor
- Submission amount với percentage
- Available và withdrawn amounts
- Expandable để xem chi tiết

## 🎯 Lợi Ích

1. **Quản lý hiệu quả**: Admin có cái nhìn tổng quan về revenue
2. **Theo dõi platform fee**: Dễ dàng track 10% platform fee
3. **Phân tích instructor**: Xem performance của từng instructor
4. **Financial insights**: Hiểu rõ cash flow của platform
5. **Decision making**: Dữ liệu để đưa ra quyết định kinh doanh

## 🔒 Bảo Mật

- Chỉ admin mới có quyền truy cập
- Kiểm tra role trước khi render
- Redirect nếu không phải admin

## 🚀 Tương Lai

- **Export to Excel**: Xuất dữ liệu ra file Excel
- **Charts & Graphs**: Biểu đồ thống kê
- **Date Range Filter**: Lọc theo khoảng thời gian
- **Real-time Updates**: WebSocket cho real-time data
- **Email Reports**: Gửi báo cáo định kỳ qua email

---

**Trang submissions đã sẵn sàng để sử dụng với mock data. Khi backend API được tạo, chỉ cần thay thế mock data bằng real API calls.** 