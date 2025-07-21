// app/(auth)/dashboard/create-quiz/_components/QuizListPage.tsx
'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Quiz, QuestionData, ManualCreationDetails, AICreationDetails } from './types';
import QuizCard from './QuizCard';
import CreateQuizModal from './CreateQuizModal';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/common/ui/pagination'; // Đảm bảo đường dẫn đúng

const QUIZZES_STORAGE_KEY = 'quizzes_v2_final';

const fetchQuizzesFromStorage = (): Quiz[] => {
  if (typeof window !== 'undefined') {
    const storedQuizzes = localStorage.getItem(QUIZZES_STORAGE_KEY);
    if (!storedQuizzes || JSON.parse(storedQuizzes).length === 0) {
      const demoQuizzes: Quiz[] = Array.from({ length: 25 }, (_, i) => ({
        id: `demo${i + 1}`,
        name: `Sample Quiz Title ${i + 1} - Advanced Web Topics`,
        questions: [
          {
            id: `q${i}-1`,
            questionNumber: 1,
            title: `Sample question 1 for Quiz ${i + 1}`,
            questionType: 'single-choice',
            choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
            options: [
              { id: `q${i}o1`, text: 'OptA' },
              { id: `q${i}o2`, text: 'OptB' },
            ],
            correctAnswerIds: [],
            points: '01',
            isRequired: true,
          },
        ],
        createdAt: `${String(i + 1).padStart(2, '0')} Jan, 2025`,
        examTitle: `QUIZ ${(i % 3) + 1}`,
        totalQuestions: 10 + (i % 5),
        duration: `${15 + (i % 4) * 15} Min`,
        progress: 20 + ((i * 13) % 80),
        imageUrl: `/assets/create-quiz/thumbnail.png`,
        category: [
          'Grapic Design',
          'Web Development',
          'Data Science',
          'UX Design',
          'Marketing',
          'IT & Software',
        ][i % 6],
      }));
      localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(demoQuizzes));
      return demoQuizzes;
    }
    return storedQuizzes ? JSON.parse(storedQuizzes) : [];
  }
  return [];
};

const saveNewQuizToStorage = (newQuiz: Quiz): Quiz[] => {
  if (typeof window !== 'undefined') {
    const quizzes = fetchQuizzesFromStorage();
    const existingIndex = quizzes.findIndex(q => q.id === newQuiz.id);
    if (existingIndex > -1) {
      quizzes[existingIndex] = newQuiz;
    } else {
      quizzes.push(newQuiz);
    }
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
    return quizzes;
  }
  return [newQuiz];
};

const ITEMS_PER_PAGE = 8;

const QuizListPage: React.FC = () => {
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setAllQuizzes(fetchQuizzesFromStorage());
  }, []);

  // <<< --- DI CHUYỂN KHỐI NÀY LÊN TRÊN --- >>>
  const searchedQuizzes = useMemo(
    () => allQuizzes.filter(quiz => quiz.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [allQuizzes, searchTerm]
  );

  const totalPages = Math.ceil(searchedQuizzes.length / ITEMS_PER_PAGE);

  const quizzesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return searchedQuizzes.slice(startIndex, endIndex);
  }, [searchedQuizzes, currentPage]);
  // <<< --- KẾT THÚC KHỐI DI CHUYỂN --- >>>

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);
    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 1 + halfPagesToShow + 1 && totalPages > maxPagesToShow) {
        // Sửa điều kiện
        if (pageNumbers[pageNumbers.length - 1] !== 1 || currentPage > 2 + halfPagesToShow)
          pageNumbers.push(-1);
      }
      let startPage = Math.max(2, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);
      if (currentPage - halfPagesToShow <= 1) endPage = Math.min(totalPages - 1, maxPagesToShow);
      if (currentPage + halfPagesToShow >= totalPages)
        startPage = Math.max(2, totalPages - maxPagesToShow + 1);

      for (let i = startPage; i <= endPage; i++) if (!pageNumbers.includes(i)) pageNumbers.push(i);

      if (currentPage < totalPages - halfPagesToShow - 1 && totalPages > maxPagesToShow) {
        if (pageNumbers[pageNumbers.length - 1] < totalPages - 1) pageNumbers.push(-1);
      }
      if (!pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
    }
    return pageNumbers.filter((num, index, self) => num === -1 || self.indexOf(num) === index); // Loại bỏ ellipsis trùng lặp
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleCreateTestFromModal = useCallback(
    (details: ManualCreationDetails | AICreationDetails) => {
      const newQuizId = `quiz_${Date.now()}`;
      let quizNameFromDetails = 'Untitled Quiz';
      let initialQuestions: QuestionData[] = [];
      let newQuizCategory = 'General';

      if (details.mode === 'manual') {
        quizNameFromDetails = details.examTitle.trim() || `Manual Quiz ${newQuizId.slice(-4)}`;
        const defaultFirstQuestionId = `q_${Date.now()}_manual_init`;
        initialQuestions = [
          {
            id: defaultFirstQuestionId,
            questionNumber: 1,
            title: 'Sample Question 1 (Manual)',
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
          },
        ];
      } else if (details.mode === 'ai') {
        quizNameFromDetails =
          details.examTitle.trim() || `AI Quiz on ${details.topic || 'General Topic'}`;
        newQuizCategory = details.topic || 'AI Generated';
        const defaultFirstQuestionId = `q_${Date.now()}_ai_init`;
        initialQuestions = [
          {
            id: defaultFirstQuestionId,
            questionNumber: 1,
            title: `AI will generate questions for: "${details.topic || quizNameFromDetails}" (Placeholder)`,
            questionType:
              details.questionConfigs[0]?.type === 'multiple-choice'
                ? 'multiple-choice'
                : 'single-choice',
            questionImage: null,
            choicesConfig: {
              isMultipleAnswer: details.questionConfigs[0]?.type === 'multiple-choice',
              isAnswerWithImageEnabled: false,
            },
            options: [],
            correctAnswerIds: [],
            points: '00',
            isRequired: true,
          },
        ];
        console.log('AI Creation Details:', details);
      }

      const newQuizData: Quiz = {
        id: newQuizId,
        name: quizNameFromDetails,
        examTitle: quizNameFromDetails,
        duration: (details.mode === 'manual' ? details.duration : 'AI Setup') || '30 Min',
        questions: initialQuestions,
        createdAt: new Date().toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        category: newQuizCategory,
        imageUrl: '/assets/create-quiz/thumbnail.png',
        totalQuestions: initialQuestions.length,
        progress: 0,
      };

      const updatedQuizzes = saveNewQuizToStorage(newQuizData);
      setAllQuizzes(updatedQuizzes);

      toast({
        title: 'Quiz Initialized!',
        description: `Quiz "${newQuizData.name}" (mode: ${details.mode}) is ready. Proceed to builder.`,
        variant: 'success',
      });

      const builderPath = `/dashboard/create-quiz/builder/${newQuizId}`;
      const finalPath =
        details.mode === 'ai'
          ? `${builderPath}?mode=ai&topic=${encodeURIComponent(details.topic)}&level=${details.difficultyLevel}&title=${encodeURIComponent(quizNameFromDetails)}&configs=${encodeURIComponent(JSON.stringify(details.questionConfigs))}`
          : builderPath;
      router.push(finalPath);
    },
    [router, toast]
  );

  return (
    <div className="w-full  p-6 sm:p-8 ">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:flex-1 lg:min-w-[300px] xl:min-w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block text-black w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white rounded-full shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 h-[42px]"
            />
          </div>
          <button className="flex items-center text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2.5 rounded-full hover:bg-gray-50 shadow-sm h-[42px] transition-colors duration-150 ease-in-out w-full sm:w-auto justify-center sm:justify-start flex-shrink-0">
            <SlidersHorizontal size={16} className="mr-2 text-gray-500 flex-shrink-0" />
            <span className="whitespace-nowrap">All courses</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1.5 text-gray-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="flex w-full sm:w-auto justify-center sm:justify-end mt-4 sm:mt-0">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md h-[42px] whitespace-nowrap flex-shrink-0"
          >
            <PlusCircle size={18} className="mr-1.5 flex-shrink-0" />
            Create Quiz
          </button>
        </div>
      </div>

      {quizzesForCurrentPage.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2  gap-5 sm:gap-6">
          {quizzesForCurrentPage.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-semibold text-gray-800">No quizzes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search.' : 'Get started by creating a new quiz.'}
          </p>
          <div className="mt-6">
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle size={18} className="-ml-1 mr-2" />
              New Quiz
            </button>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8 sm:mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === -1 ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageChange(page as number);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <CreateQuizModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateTestFromModal}
      />
    </div>
  );
};

export default QuizListPage;
