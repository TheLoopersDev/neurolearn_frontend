// app/(auth)/dashboard/create-quiz/page.tsx
import QuizListPage from './_components/QuizListPage'; // Điều chỉnh đường dẫn nếu cần
import React from 'react';

export default function ListQuizzesPage() {
  return (
    <div className="bg-white">
      <QuizListPage />
    </div>
  );
}
