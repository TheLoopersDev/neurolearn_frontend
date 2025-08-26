# 🔍 Debug Guide - API 400 Errors

## 🎯 Vấn Đề Hiện Tại
Các API calls vẫn đang bị lỗi 400 mặc dù đã tạo API routes. Cần debug để tìm nguyên nhân.

## 🔧 Các Bước Debug

### **1. Test API Routes Cơ Bản**
Truy cập các URL sau để kiểm tra API có hoạt động không:

```
http://localhost:3000/api/test
http://localhost:3000/api/debug-auth
```

### **2. Test Revenue API Routes**
Truy cập trực tiếp các API routes:

```
http://localhost:3000/api/revenue/all-submissions?page=1&limit=10
http://localhost:3000/api/revenue/submission-statistics
http://localhost:3000/api/revenue/submissions-summary?top=5
```

### **3. Kiểm Tra Console Logs**
Mở Developer Tools > Console để xem:
- Authentication debug logs
- API error messages
- Network request details

### **4. Kiểm Tra Network Tab**
Trong Developer Tools > Network:
- Xem status code của các requests
- Kiểm tra request headers
- Xem response content

## 🚨 Các Trường Hợp Có Thể

### **Trường hợp 1: API Routes Không Hoạt Động**
- **Triệu chứng**: 404 errors
- **Giải pháp**: Restart development server

### **Trường hợp 2: Authentication Issues**
- **Triệu chứng**: 401/403 errors
- **Giải pháp**: Kiểm tra NextAuth session

### **Trường hợp 3: CORS Issues**
- **Triệu chứng**: CORS errors
- **Giải pháp**: Thêm CORS headers

### **Trường hợp 4: Server Errors**
- **Triệu chứng**: 500 errors
- **Giải pháp**: Kiểm tra server logs

## 🔍 Debug Commands

### **1. Restart Development Server**
```bash
# Kill all Node processes
taskkill /f /im node.exe

# Start development server
npm run dev
```

### **2. Check Environment Variables**
```bash
# Make sure these are set in .env.local
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### **3. Test Authentication**
Truy cập `/api/debug-auth` để xem:
- Session status
- User role
- Cookies
- Headers

## 📝 Debug Checklist

- [ ] Development server đang chạy
- [ ] API routes có thể truy cập trực tiếp
- [ ] Authentication session tồn tại
- [ ] User có role admin
- [ ] No CORS errors
- [ ] No server errors

## 🎯 Kết Quả Mong Đợi

Sau khi debug thành công:
- ✅ API calls trả về status 200
- ✅ Response có format đúng
- ✅ Data hiển thị trên trang
- ✅ Không còn lỗi 400

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề, hãy:
1. Kiểm tra console logs
2. Test API routes trực tiếp
3. Kiểm tra authentication status
4. Restart development server 