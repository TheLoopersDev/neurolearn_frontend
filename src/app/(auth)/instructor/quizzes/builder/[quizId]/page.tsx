import QuizBuilderPage from '@/components/dashboard/create-quiz/QuizBuilderPage';

export default async function EditQuizBuilderRoutePage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const resolvedParams = await params;
  return <QuizBuilderPage params={resolvedParams} />;
}
