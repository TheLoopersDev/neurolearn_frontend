// app/(auth)/dashboard/create-quiz/_components/QuizBuilderPage.tsx
'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import QuestionListSidebar from './QuestionListSidebar';
import InstructorQuestionEditor from './InstructorQuestionEditor';
import QuizBuilderHeader from './QuizBuilderHeader';
import { QuestionData, QuestionSummary } from './types';
import {
  useGetQuizByIdQuery,
  useUpdateQuizMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '@/lib/redux/features/quiz/quizApi';

function getIconForQuestionType(type: QuestionData['questionType']): React.ReactNode {
  if (type === 'multiple-choice' || type === 'single-choice') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return null;
}

interface QuizBuilderPageProps {
  params?: { quizId?: string };
}

const QuizBuilderPage: React.FC<QuizBuilderPageProps> = ({ params }) => {
  const router = useRouter();
  const pathParams = useParams();
  const { toast } = useToast();
  const [updateQuiz] = useUpdateQuizMutation();
  const [addQuestion] = useAddQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const quizIdToLoad =
    params?.quizId || (typeof pathParams?.quizId === 'string' ? pathParams.quizId : undefined);

  // ====== STATE (ép đúng type theo interface Quiz) ======
  const [quizName, setQuizName] = useState<string>('');
  const [quizDuration, setQuizDuration] = useState<string>('30');   // duration?: string
  const [quizCategory, setQuizCategory] = useState<string>('');     // category?: string
  const [passingScore, setPassingScore] = useState<number>(70);     // passingScore?: number

  const [questionsList, setQuestionsList] = useState<QuestionData[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentQuizIdInternal, setCurrentQuizIdInternal] = useState<string | null>(null);
  const [currentQuizCreatedAt, setCurrentQuizCreatedAt] = useState<string | undefined>(undefined);
  const [hasInitialized, setHasInitialized] = useState(false);

  const {
    data: fetchedQuiz,
    isLoading,
    isError,
  } = useGetQuizByIdQuery(quizIdToLoad as string, {
    skip: !quizIdToLoad,
  });

  const defaultFirstQuestion = useCallback((): QuestionData => {
    const newId = `q_${Date.now()}_init`;
    return {
      id: newId,
      questionNumber: 1,
      title: 'New Question 1',
      questionType: 'single-choice',
      questionImage: null,
      choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
      options: [
        { id: `nqo_${Date.now()}_1`, text: 'Option A' },
        { id: `nqo_${Date.now()}_2`, text: 'Option B' },
      ],
      correctAnswerIds: [],
      points: '01',
      isRequired: true,
    };
  }, []);

  // ====== LOAD DATA ======
  useEffect(() => {
    if (fetchedQuiz && fetchedQuiz.quiz) {
      const serverQuiz = fetchedQuiz.quiz;

      setQuizName(serverQuiz.name || '');
      setQuizDuration(String(serverQuiz.duration ?? '30'));         
      setQuizCategory(serverQuiz.category ?? '');
      setPassingScore(Number(serverQuiz.passingScore ?? 70));       

      const transformedQuestions: QuestionData[] = (serverQuiz.questions || []).map((q, index) => ({
        id: `q_${index + 1}`,
        questionNumber: q.questionNumber ?? index + 1,
        title: q.title,
        questionType: q.questionType,
        questionImage: q.questionImage || null,
        choicesConfig: q.choicesConfig || {
          isMultipleAnswer: false,
          isAnswerWithImageEnabled: false,
        },
        options: q.options || [],
        correctAnswerIds: q.correctAnswerIds || [],
        points: q.points || '01',
        isRequired: q.isRequired ?? true,
      }));

      if (transformedQuestions.length > 0) {
        setQuestionsList(transformedQuestions);
        setSelectedQuestionId(transformedQuestions[0]?.id || null);
      } else {
        const defaultQuestion = defaultFirstQuestion();
        setQuestionsList([defaultQuestion]);
        setSelectedQuestionId(defaultQuestion.id);

        if (serverQuiz._id) {
          addQuestion({
            id: serverQuiz._id,
            question: defaultQuestion,
          })
            .unwrap()
            .catch(err => {
              console.error('❌ Failed to save default question:', err);
            });
        }
      }

      setCurrentQuizIdInternal(serverQuiz._id ?? null);
      setCurrentQuizCreatedAt(serverQuiz.createdAt || undefined);
      setHasInitialized(true);
    } else if (isError) {
      toast({
        title: 'Error',
        description: 'Quiz not found. Redirecting...',
        variant: 'destructive',
      });
      router.push('/dashboard/create-quiz');
    }
  }, [fetchedQuiz, isError, defaultFirstQuestion, addQuestion, toast, router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const handleSelectQuestion = (id: string) => setSelectedQuestionId(id);

  // ====== ADD QUESTION ======
  const handleAddQuestion = useCallback(async () => {
    const newQuestionNumber =
      questionsList.length > 0 ? Math.max(...questionsList.map(q => q.questionNumber)) + 1 : 1;

    const timestamp = Date.now();
    const localId = `q_${timestamp}_${newQuestionNumber}`;

    const newQuestion: QuestionData = {
      id: localId,
      questionNumber: newQuestionNumber,
      title: `New Question ${newQuestionNumber}`,
      questionType: 'single-choice',
      questionImage: null,
      choicesConfig: {
        isMultipleAnswer: false,
        isAnswerWithImageEnabled: false,
      },
      options: [
        { id: `opt_${timestamp}_1`, text: 'Option A' },
        { id: `opt_${timestamp}_2`, text: 'Option B' },
      ],
      correctAnswerIds: [],
      points: '01',
      isRequired: true,
    };

    if (currentQuizIdInternal) {
      try {
        const res = await addQuestion({
          id: currentQuizIdInternal,
          question: newQuestion,
        }).unwrap();

        if (res?.question) {
          const merged = { ...res.question, id: localId };
          setQuestionsList(prev => [...prev, merged]);
          setSelectedQuestionId(localId);
        } else {
          // fallback local add
          setQuestionsList(prev => [...prev, newQuestion]);
          setSelectedQuestionId(localId);
        }
      } catch (err) {
        console.error('Failed to add question:', err);
        toast({
          title: 'Error',
          description: 'Failed to add question',
          variant: 'destructive',
        });
      }
    } else {
      setQuestionsList(prev => [...prev, newQuestion]);
      setSelectedQuestionId(localId);
    }

    if (!isSidebarOpen && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, [currentQuizIdInternal, isSidebarOpen, questionsList, addQuestion, toast]);

  // ====== UPDATE QUESTION ======
  const handleQuestionDataUpdateFromEditor = useCallback(
    async (updatedData: QuestionData) => {
      setQuestionsList(prev => prev.map(q => (q.id === updatedData.id ? updatedData : q)));

      if (!hasInitialized || !updatedData.questionNumber) return;

      if (currentQuizIdInternal && updatedData.questionNumber) {
        try {
          await updateQuestion({
            id: currentQuizIdInternal,
            questionNumber: updatedData.questionNumber,
            question: updatedData,
          }).unwrap();
        } catch (err) {
          console.error('Failed to update question:', err);
          toast({
            title: 'Error',
            description: 'Failed to update question',
            variant: 'destructive',
          });
        }
      }
    },
    [currentQuizIdInternal, hasInitialized, updateQuestion, toast]
  );

  // ====== DELETE QUESTION ======
  const handleDeleteQuestion = async (questionId: string) => {
    if (!currentQuizIdInternal || !questionId) return;

    const targetQuestion = questionsList.find(q => q.id === questionId);
    if (!targetQuestion) return;

    try {
      const res = await deleteQuestion({
        id: currentQuizIdInternal,
        questionNumber: targetQuestion.questionNumber,
      }).unwrap();

      if (res.success) {
        const remaining = questionsList.filter(q => q.id !== questionId);
        setQuestionsList(remaining);
        setSelectedQuestionId(remaining.length > 0 ? remaining[0].id : null);

        await updateQuiz({
          id: currentQuizIdInternal,
          quiz: {
            name: quizName.trim(),
            questions: remaining,
            duration: String(quizDuration),          // string
            category: quizCategory.trim() || undefined,
            passingScore: Number(passingScore),      // number
          },
        }).unwrap();

        toast({
          title: 'Question deleted',
          description: 'The question was removed and saved successfully.',
          variant: 'success',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.data?.message || 'Could not delete question.',
        variant: 'destructive',
      });
    }
  };

  // ====== SAVE QUIZ ======
  const handleSaveQuiz = async () => {
    if (!quizName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Quiz name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    if (questionsList.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one question.',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      id: currentQuizIdInternal!,
      quiz: {
        name: quizName.trim(),
        questions: questionsList,
        duration: String(quizDuration),          // string theo interface
        passingScore: Number(passingScore),      // number theo interface
        category: quizCategory.trim() || undefined,
      },
    };

    try {
      await updateQuiz(payload).unwrap();
      toast({
        title: 'Success!',
        description: `Quiz "${quizName}" updated successfully.`,
        variant: 'success',
      });
      router.push('/instructor/quizzes');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quiz.',
        variant: 'destructive',
      });
    }
  };

  // ====== MEMO ======
  const questionSummaries: QuestionSummary[] = useMemo(
    () =>
      questionsList.map(q => ({
        id: q.id,
        number: q.questionNumber,
        textPreview: q.title.substring(0, 40) + (q.title.length > 40 ? '...' : ''),
        type: q.questionType,
        typeIcon: getIconForQuestionType(q.questionType),
      })),
    [questionsList]
  );

  const activeQuestionData = useMemo(
    () => questionsList.find(q => q.id === selectedQuestionId),
    [questionsList, selectedQuestionId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-blue-500 rounded-full mb-4"></div>
          <p className="text-lg text-gray-600">Loading quiz data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col rounded-xl">
      <QuizBuilderHeader
        title={quizName}
        onSaveQuiz={handleSaveQuiz}
        isEditing={!!currentQuizIdInternal}
      />

      {/* Quiz Settings Section */}
      <div className="p-6 space-y-6 max-w-screen w-full">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <label htmlFor="quizNameInput" className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Name
          </label>
          <input
            type="text"
            id="quizNameInput"
            value={quizName}
            onChange={e => setQuizName(e.target.value)}
            placeholder="Enter quiz name"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Duration */}
            <div>
              <label htmlFor="quizDuration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="quizDuration"
                  value={Number.isNaN(Number(quizDuration)) ? '' : quizDuration}
                  onChange={e => setQuizDuration(e.target.value)}
                  min={1}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <div className="absolute right-3 top-3 text-gray-400">min</div>
              </div>
            </div>

            {/* Passing Score */}
            <div>
              <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700 mb-2">
                Passing Score (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="passingScore"
                  value={Number.isFinite(passingScore) ? passingScore : 0}
                  onChange={e => setPassingScore(e.currentTarget.valueAsNumber || 0)}
                  min={0}
                  max={100}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <div className="absolute right-3 top-3 text-gray-400">%</div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="quizCategory" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                id="quizCategory"
                value={quizCategory}
                onChange={e => setQuizCategory(e.target.value)}
                placeholder="e.g. JavaScript, React, SQL…"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
        {currentQuizCreatedAt && (
          <div className="mt-2 text-xs text-gray-500">
            Created at: {new Date(currentQuizCreatedAt).toLocaleString()}
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className="flex flex-grow pt-4 px-6 gap-6">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden fixed top-32 left-4 z-40 p-2 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <QuestionListSidebar
          questions={questionSummaries}
          selectedQuestionId={selectedQuestionId}
          activeQuestionNumber={activeQuestionData?.questionNumber}
          onSelectQuestion={handleSelectQuestion}
          onAddQuestion={handleAddQuestion}
        />

        <main className="flex-grow overflow-y-auto transition-all duration-300 ease-in-out bg-white rounded-xl shadow-sm">
          <div className="h-full p-6">
            {activeQuestionData ? (
              <InstructorQuestionEditor
                key={selectedQuestionId || 'editor'}
                questionToLoad={activeQuestionData}
                onQuestionDataChange={handleQuestionDataUpdateFromEditor}
                onDeleteQuestion={handleDeleteQuestion}
              />
            ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-250px)] text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-500 mb-1">
                    {questionsList && questionsList.length > 0 ? 'Select a question to edit' : 'No questions yet'}
                  </h3>
                  <p className="text-sm text-gray-400">
                  {questionsList && questionsList.length > 0
                      ? 'Or click the "+" button to add a new one'
                      : 'Click the "+" button to add your first question'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizBuilderPage;
