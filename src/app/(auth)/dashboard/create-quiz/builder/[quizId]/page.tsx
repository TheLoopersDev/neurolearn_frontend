// app/(auth)/dashboard/create-quiz/builder/[quizId]/page.tsx
import QuizBuilderPage from '@/components/dashboard/create-quiz/QuizBuilderPage';
import React from 'react';

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const resolvedParams = await params;
  return <QuizBuilderPage params={resolvedParams} />;
}
