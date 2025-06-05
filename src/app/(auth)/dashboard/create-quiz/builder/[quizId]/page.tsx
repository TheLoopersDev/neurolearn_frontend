// app/(auth)/dashboard/create-quiz/builder/[quizId]/page.tsx
import QuizBuilderPage from '../../_components/QuizBuilderPage'; // Điều chỉnh đường dẫn
import React from 'react';

interface EditQuizPageProps {
  params: { quizId: string };
}

// Đảm bảo component này là client component nếu QuizBuilderPage dùng client hooks như useParams trực tiếp
// Hoặc truyền params xuống như hiện tại là ổn nếu QuizBuilderPage là client component.
export default function EditQuizPage({ params }: EditQuizPageProps) {
  return <QuizBuilderPage params={params} />;
}
