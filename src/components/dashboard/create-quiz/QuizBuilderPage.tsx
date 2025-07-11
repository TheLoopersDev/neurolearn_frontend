// app/(auth)/dashboard/create-quiz/_components/QuizBuilderPage.tsx
'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import QuestionListSidebar from './QuestionListSidebar';
import InstructorQuestionEditor from './InstructorQuestionEditor';
import QuizBuilderHeader from './QuizBuilderHeader';
import { QuestionData, QuestionSummary, Quiz } from './types'; // Đảm bảo đường dẫn đúng
import {
  useGetQuizByIdQuery,
  useUpdateQuizMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '@/lib/redux/features/quiz/quizApi';

// --- Mockup hàm lưu trữ và tải quiz ---
const QUIZZES_STORAGE_KEY = 'quizzes_v3_main'; // Đổi key để tránh xung đột với list page nếu cần

const fetchQuizzesFromStorage = (): Quiz[] => {
  if (typeof window !== 'undefined') {
    const storedQuizzes = localStorage.getItem(QUIZZES_STORAGE_KEY);
    return storedQuizzes ? JSON.parse(storedQuizzes) : [];
  }
  return [];
};

const saveQuizToStorage = (quizData: Quiz) => {
  if (typeof window !== 'undefined') {
    const quizzes = fetchQuizzesFromStorage();
    const existingQuizIndex = quizzes.findIndex(q => q.id === quizData.id);
    if (existingQuizIndex > -1) {
      quizzes[existingQuizIndex] = quizData;
    } else {
      quizzes.push(quizData);
    }
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
  }
};

console.log(saveQuizToStorage);

const fetchQuizByIdFromStorage = (quizId: string): Quiz | undefined => {
  if (typeof window !== 'undefined') {
    const quizzes = fetchQuizzesFromStorage();
    return quizzes.find(q => q.id === quizId);
  }
  return undefined;
};

console.log(fetchQuizByIdFromStorage);

// -------------------------------------

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

  const [quizName, setQuizName] = useState('Name Quiz');
  const [questionsList, setQuestionsList] = useState<QuestionData[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentQuizIdInternal, setCurrentQuizIdInternal] = useState<string | null>(null);
  const [currentQuizCreatedAt, setCurrentQuizCreatedAt] = useState<string | undefined>(undefined); // State để lưu ngày tạo của quiz đang sửa
  const [hasInitialized, setHasInitialized] = useState(false);
  const {
    data: fetchedQuiz,
    isLoading,
    isError,
  } = useGetQuizByIdQuery(quizIdToLoad!, {
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

  useEffect(() => {
    if (fetchedQuiz && fetchedQuiz.quiz) {
      const serverQuiz = fetchedQuiz.quiz;

      setQuizName(serverQuiz.name || '');

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

        // ✅ Lưu vào DB nếu quiz đã có ID
        if (serverQuiz.id) {
          addQuestion({
            id: serverQuiz.id,
            question: defaultQuestion,
          })
            .unwrap()
            .then(res => {
              console.log('✅ Default question saved:', res);
            })
            .catch(err => {
              console.error('❌ Failed to save default question:', err);
            });
        }
      }
      setCurrentQuizIdInternal(serverQuiz.id ?? null);
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
  }, [fetchedQuiz, isError]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      // Sử dụng breakpoint lg (1024px)
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const handleSelectQuestion = (id: string) => setSelectedQuestionId(id);

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
          // Giữ id là localId để match với selectedQuestionId
          const merged = { ...res.question, id: localId };

          setQuestionsList(prev => [...prev, merged]);
          setSelectedQuestionId(localId); // Gán chính xác ID này để editor nhận
        }
      } catch (err) {
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

    // Mở sidebar nếu đang ẩn
    if (!isSidebarOpen && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, [currentQuizIdInternal, isSidebarOpen, questionsList]);

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
          toast({
            title: 'Error',
            description: 'Failed to update question',
            variant: 'destructive',
          });
        }
      }
    },
    [currentQuizIdInternal, hasInitialized]
  );

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

        // Cập nhật UI
        setQuestionsList(remaining);
        setSelectedQuestionId(remaining.length > 0 ? remaining[0].id : null);

        // GỌI UPDATE QUIZ BẰNG DANH SÁCH MỚI NHẤT
        await updateQuiz({
          id: currentQuizIdInternal,
          quiz: {
            name: quizName,
            questions: remaining, // 💡 dùng `remaining` trực tiếp
            duration: '30 Min',
            category: 'General',
            imageUrl: '/assets/images/default_quiz_thumbnail.png',
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
        name: quizName,
        questions: questionsList,
        duration: '30 Min',
        category: 'General',
        imageUrl: '/assets/images/default_quiz_thumbnail.png',
      },
    };

    try {
      await updateQuiz(payload).unwrap();
      toast({
        title: 'Success!',
        description: `Quiz "${quizName}" updated successfully.`,
        variant: 'success',
      });
      router.push('/dashboard/create-quiz');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quiz.',
        variant: 'destructive',
      });
    }
  };

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
      <div className="flex items-center justify-center h-screen w-full">
        {' '}
        {/* Đảm bảo spinner/loading chiếm toàn bộ không gian */}
        <p className="text-lg text-gray-600">Loading quiz data...</p>
        {/* Bạn có thể thêm một spinner component ở đây */}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col ">
      <QuizBuilderHeader
        title={quizName}
        onSaveQuiz={handleSaveQuiz}
        isEditing={!!currentQuizIdInternal}
      />
      <div className="p-4">
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
        {currentQuizCreatedAt && (
          <div className="mt-2 text-xs text-gray-500">
            Created at: {new Date(currentQuizCreatedAt).toLocaleString()}
          </div>
        )}
      </div>
      <div className="flex flex-grow overflow-hidden pt-2 sm:pt-4 px-4 sm:px-6 gap-4 sm:gap-6">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden fixed top-[calc(8rem+0.75rem)] left-3 z-40 p-2 bg-white rounded-full shadow-lg text-blue-600 hover:bg-blue-50"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        <QuestionListSidebar
          questions={questionSummaries}
          selectedQuestionId={selectedQuestionId}
          activeQuestionNumber={activeQuestionData?.questionNumber}
          onSelectQuestion={handleSelectQuestion}
          onAddQuestion={handleAddQuestion}
          // isOpen và onToggle đã được truyền từ phiên bản trước, đảm bảo chúng vẫn có
        />
        <main className={`flex-grow overflow-y-auto transition-all duration-300 ease-in-out`}>
          <div className="h-full">
            {activeQuestionData ? (
              <InstructorQuestionEditor
                key={selectedQuestionId}
                questionToLoad={activeQuestionData}
                onQuestionDataChange={handleQuestionDataUpdateFromEditor}
                onDeleteQuestion={handleDeleteQuestion}
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[calc(100vh-250px)]">
                <p className="text-xl text-gray-500">
                  {questionsList && questionsList.length > 0
                    ? 'Select or add a question.'
                    : "No questions yet. Click '+' in the sidebar to add one!"}
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
