// app/(auth)/dashboard/create-quiz/_components/QuizBuilderPage.tsx
'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import QuestionListSidebar from './QuestionListSidebar';
import InstructorQuestionEditor from './InstructorQuestionEditor';
import QuizBuilderHeader from './QuizBuilderHeader';
import { QuestionData, QuestionSummary, Quiz } from './types'; // Đảm bảo đường dẫn đúng

// --- Mockup hàm lưu trữ và tải quiz ---
const QUIZZES_STORAGE_KEY = 'quizzes_v2_main'; // Đổi key để tránh xung đột với list page nếu cần

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

const fetchQuizByIdFromStorage = (quizId: string): Quiz | undefined => {
  if (typeof window !== 'undefined') {
    const quizzes = fetchQuizzesFromStorage();
    return quizzes.find(q => q.id === quizId);
  }
  return undefined;
};
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
  params: { quizId: string };
}

const QuizBuilderPage: React.FC<QuizBuilderPageProps> = ({ params }) => {
  const router = useRouter();
  const pathParams = useParams();
  const { toast } = useToast();

  const quizIdToLoad = params.quizId || (typeof pathParams?.quizId === 'string' ? pathParams.quizId : undefined);

  const [quizName, setQuizName] = useState('Name Quiz');
  const [questionsList, setQuestionsList] = useState<QuestionData[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentQuizIdInternal, setCurrentQuizIdInternal] = useState<string | null>(null);
  const [currentQuizCreatedAt, setCurrentQuizCreatedAt] = useState<string | undefined>(undefined); // State để lưu ngày tạo của quiz đang sửa
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    if (quizIdToLoad) {
      const existingQuiz = fetchQuizByIdFromStorage(quizIdToLoad);
      if (existingQuiz) {
        setQuizName(existingQuiz.name);
        const questionsToSet =
          existingQuiz.questions && existingQuiz.questions.length > 0
            ? existingQuiz.questions
            : [defaultFirstQuestion()];
        setQuestionsList(questionsToSet);
        setSelectedQuestionId(questionsToSet[0]?.id || null);
        setCurrentQuizIdInternal(existingQuiz.id);
        setCurrentQuizCreatedAt(existingQuiz.createdAt); // Lưu ngày tạo của quiz hiện tại
      } else {
        toast({
          title: 'Error',
          description: 'Quiz not found. Redirecting...',
          variant: 'destructive',
        });
        router.push('/dashboard/create-quiz');
      }
    } else {
      const firstQuestion = defaultFirstQuestion();
      setQuizName('Name Quiz');
      setQuestionsList([firstQuestion]);
      setSelectedQuestionId(firstQuestion.id);
      setCurrentQuizIdInternal(null);
      setCurrentQuizCreatedAt(undefined); // Reset ngày tạo cho quiz mới
    }
    setIsLoading(false);
  }, [quizIdToLoad, router, toast, defaultFirstQuestion]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      // Sử dụng breakpoint lg (1024px)
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const handleSelectQuestion = (id: string) => setSelectedQuestionId(id);

  const handleAddQuestion = useCallback(() => {
    setQuestionsList(prevList => {
      const newQuestionNumber =
        prevList.length > 0 ? Math.max(...prevList.map(q => q.questionNumber)) + 1 : 1;
      const newQuestion: QuestionData = {
        id: `q_${Date.now()}_${newQuestionNumber}`,
        questionNumber: newQuestionNumber,
        title: `New Question ${newQuestionNumber}`,
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
      setSelectedQuestionId(newQuestion.id);
      return [...prevList, newQuestion].sort((a, b) => a.questionNumber - b.questionNumber);
    });
    if (!isSidebarOpen && typeof window !== 'undefined' && window.innerWidth >= 1024)
      setIsSidebarOpen(true);
  }, [isSidebarOpen]);

  const handleQuestionDataUpdateFromEditor = useCallback((updatedData: QuestionData) => {
    setQuestionsList(prevList => prevList.map(q => (q.id === updatedData.id ? updatedData : q)));
  }, []);

  const handleSaveQuiz = () => {
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

    const quizToSave: Quiz = {
      id: currentQuizIdInternal || `quiz_${Date.now()}`,
      name: quizName,
      questions: questionsList,
      // Sử dụng currentQuizCreatedAt nếu đang sửa, ngược lại là ngày mới
      createdAt: currentQuizIdInternal
        ? currentQuizCreatedAt
        : new Date().toLocaleDateString('en-CA'),
      totalQuestions: questionsList.length,
      duration: '30 Min', // Ví dụ, có thể lấy từ state nếu có
      category: 'General', // Ví dụ
      imageUrl: '/assets/images/default_quiz_thumbnail.png', // Hoặc một URL ảnh cụ thể nếu có
    };

    saveQuizToStorage(quizToSave);
    toast({
      title: 'Success!',
      description: `Quiz "${quizName}" has been ${currentQuizIdInternal ? 'updated' : 'created'} successfully.`,
      variant: 'success',
    });
    router.push('/dashboard/create-quiz'); // Chuyển về trang danh sách
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
    <div className="h-screen flex flex-col bg-gray-100">
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
