# 📊 Trang Quản Lý Submissions - Admin Dashboard

## 🎯 Tổng Quan
Trang **Submissions** là một tính năng mới dành cho admin để quản lý và theo dõi submission (phí dịch vụ 10%) của toàn bộ instructor trong hệ thống.

## 🚀 Tính Năng Chính

### **1. Thống Kê Tổng Quan**
- **Total Revenue**: Tổng doanh thu từ tất cả instructor
- **Total Submission**: Tổng phí dịch vụ (10% của total revenue)
- **Total Available**: Số tiền instructor có thể rút
- **Total Withdrawn**: Số tiền đã được rút
- **Active Instructors**: Số instructor có hoạt động
- **Average Submission**: Trung bình submission per instructor

### **2. Danh Sách Instructor Submissions**
- Hiển thị thông tin chi tiết của từng instructor
- Sắp xếp theo nhiều tiêu chí khác nhau
- Tìm kiếm theo tên hoặc email instructor
- Phân trang với 10 items/trang

### **3. Sắp Xếp và Lọc**
- **Sort by**: Submission, Total Revenue, Available, Withdrawn
- **Sort Order**: Ascending/Descending
- **Search**: Tìm kiếm theo tên hoặc email

## 🔧 API Endpoints Sử Dụng

### **1. GET `/api/revenue/all-submissions`**
```typescript
// Query Parameters
{
  page: number,        // Trang hiện tại (default: 1)
  limit: number,       // Số item mỗi trang (default: 20)
  sortBy: string,      // Field sắp xếp
  sortOrder: string,   // Thứ tự sắp xếp (asc/desc)
  search?: string      // Tìm kiếm (optional)
}

// Response
{
  success: boolean,
  data: {
    submissions: SubmissionData[],
    pagination: {
      currentPage: number,
      totalPages: number,
      totalItems: number,
      itemsPerPage: number,
      hasNextPage: boolean,
      hasPrevPage: boolean
    }
  }
}
```

### **2. GET `/api/revenue/submission-statistics`**
```typescript
// Response
{
  success: boolean,
  data: {
    totalRevenue: number,
    totalSubmission: number,
    totalWithdrawn: number,
    totalAvailable: number,
    activeInstructors: number,
    totalInstructors: number,
    averageSubmission: number
  }
}
```

## 📱 Giao Diện

### **Header Section**
- Title: "Instructor Submissions"
- Indicator: "📊 Manage all instructor revenue submissions"
- Search bar với tìm kiếm real-time

### **Statistics Cards**
- 6 cards hiển thị thống kê tổng quan
- Mỗi card có icon, màu sắc riêng
- Hiển thị platform fee 10%

### **Sort Controls**
- 4 nút sort: Submission, Total Revenue, Available, Withdrawn
- Hiển thị arrow up/down cho sort order
- Counter tổng số instructor

### **Submission Cards**
- Avatar và thông tin instructor
- Submission amount với percentage
- Available và withdrawn amounts
- Expandable để xem chi tiết

## 🎨 Components

### **1. SubmissionsPage** (`/dashboard/submissions/page.tsx`)
- Component chính của trang
- Quản lý state và API calls
- Xử lý search, sort, pagination

### **2. SubmissionStats** (`_components/SubmissionStats.tsx`)
- Hiển thị 6 statistics cards
- Summary section với platform vs instructor revenue
- Responsive grid layout

### **3. SubmissionCard** (`_components/SubmissionCard.tsx`)
- Card hiển thị thông tin instructor
- Expandable details
- Financial breakdown
- Color coding theo amount

## 🔄 Workflow

### **1. Load Page**
1. Kiểm tra quyền admin
2. Fetch statistics từ `/submission-statistics`
3. Fetch submissions từ `/all-submissions`
4. Render statistics cards và submission list

### **2. Search & Sort**
1. User nhập search term hoặc click sort button
2. Update state (searchTerm, sortBy, sortOrder)
3. Reset page về 1
4. Fetch data mới với parameters

### **3. Pagination**
1. User click page number
2. Update currentPage state
3. Fetch data cho page mới
4. Update submission list

## 📊 Data Structure

### **SubmissionData**
```typescript
interface SubmissionData {
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
```

### **StatisticsData**
```typescript
interface StatisticsData {
  totalRevenue: number;        // Sum of all instructor revenue
  totalSubmission: number;     // Sum of all platform fees
  totalWithdrawn: number;      // Sum of all withdrawn amounts
  totalAvailable: number;      // Sum of all available amounts
  activeInstructors: number;   // Instructors with revenue > 0
  totalInstructors: number;    // Total instructors
  averageSubmission: number;   // Average submission per instructor
}
```

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
- API endpoints có middleware auth

## 🚀 Tương Lai

- **Export to Excel**: Xuất dữ liệu ra file Excel
- **Charts & Graphs**: Biểu đồ thống kê
- **Date Range Filter**: Lọc theo khoảng thời gian
- **Real-time Updates**: WebSocket cho real-time data
- **Email Reports**: Gửi báo cáo định kỳ qua email 