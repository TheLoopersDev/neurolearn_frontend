'use client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
} from '@/components/common/ui/pagination';
import { useGetAllQuizzesQuery, useCreateQuizMutation } from '@/lib/redux/features/quiz/quizApi';


const ITEMS_PER_PAGE = 8;

const QuizListPage: React.FC = () => {
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { data, isLoading, } = useGetAllQuizzesQuery({});
  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();

  useEffect(() => {
    if (data?.quizzes) setAllQuizzes(data.quizzes);
  }, [data]);

  const searchedQuizzes = useMemo(
    () =>
      allQuizzes.filter(
        quiz => typeof quiz.name === 'string' && quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [allQuizzes, searchTerm]
  );

  const totalPages = Math.ceil(searchedQuizzes.length / ITEMS_PER_PAGE);

  const quizzesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return searchedQuizzes.slice(startIndex, endIndex);
  }, [searchedQuizzes, currentPage]);

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
    return pageNumbers.filter((num, index, self) => num === -1 || self.indexOf(num) === index);
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleCreateTestFromModal = useCallback(
    async (details: ManualCreationDetails | AICreationDetails) => {
      try {
        const response = await createQuiz({
          name: details.examTitle || 'Untitled Quiz',
          duration: '30',
          category: 'Uncategorized',
          questions: [],
        }).unwrap();

        toast({
          title: 'Quiz created!',
          description: `Quiz "${response.name}" has been created.`,
          variant: 'success',
        });

        router.push(`/dashboard/create-quiz/builder/${response.id}`);
      } catch (err) {
        toast({
          title: 'Failed to create quiz',
          description: 'An error occurred while creating quiz.',
          variant: 'destructive',
        });
      }
    },
    [createQuiz, router, toast]
  );

  return (
    <div className="w-full">
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
          <button className="flex items-center text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2.5 rounded-full hover:bg-gray-50 shadow-sm h-[42px]">
            <SlidersHorizontal size={16} className="mr-2 text-gray-500" />
            <span>All courses</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 h-[42px]"
        >
          <PlusCircle size={18} className="mr-1.5" />
          Create Quiz
        </button>
      </div>

      {isLoading ? (
        <p className="text-center py-12">Loading quizzes...</p>
      ) : quizzesForCurrentPage.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {quizzesForCurrentPage.map(quiz => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
          <h3 className="mt-2 text-lg font-semibold text-gray-800">No quizzes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search.' : 'Get started by creating a new quiz.'}
          </p>
          <div className="mt-6">
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
