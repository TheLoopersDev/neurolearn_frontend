// app/(auth)/dashboard/create-quiz/builder/page.tsx
import QuizBuilderPage from '@/components/dashboard/create-quiz/QuizBuilderPage'; // Điều chỉnh đường dẫn
import React from 'react';

export default function NewQuizPage() {
  // QuizBuilderPage sẽ tự động ở chế độ tạo mới vì không có params.quizId
  return <QuizBuilderPage />;
}
