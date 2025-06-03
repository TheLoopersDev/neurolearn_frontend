// app/your-route/page.tsx (hoặc đường dẫn tương ứng của bạn)
'use client'; // Cần thiết nếu bạn dùng useState và các hooks khác của React

import React, { useState } from 'react';
// Import các kiểu dữ liệu cần thiết. Đường dẫn có thể khác tùy cấu trúc dự án của bạn.
// Giả sử bạn có file types.ts ở cùng cấp với components hoặc trong thư mục types.
import QuizBuilderPage from './QuizBuilderPage';

function EditSingleQuestionPage() {
  return <QuizBuilderPage />;
}

export default EditSingleQuestionPage; // Đổi tên export
