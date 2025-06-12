// app/(auth)/dashboard/create-quiz/builder/[quizId]/page.tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const QuizBuilderPage = dynamic(() => import('../../_components/QuizBuilderPage'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

export default function Page({
  params,
}: {
  params: { quizId: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizBuilderPage params={params} />
    </Suspense>
  );
}
