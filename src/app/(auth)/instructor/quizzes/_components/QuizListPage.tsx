'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useModal } from '@/context/ModalContext';
import { Quiz, ManualCreationDetails, AICreationDetails } from './types';
import QuizCard from './QuizCard';
import SearchQuiz from './SearchQuiz';
import Loading from '@/components/common/Loading';
import { CommonPagination } from '@/components/common/ui';
import {
  useGetAllQuizzesQuery,
  useCreateQuizMutation,
} from '@/lib/redux/features/quiz/quizApi';

const ITEMS_PER_PAGE = 6;

const QuizListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { toast } = useToast();
  const { showModal } = useModal();

  const { data, isFetching, isLoading, refetch } = useGetAllQuizzesQuery(
    {},
    { refetchOnMountOrArgChange: true, refetchOnFocus: true, refetchOnReconnect: true }
  );
  const [createQuiz] = useCreateQuizMutation();

  const allQuizzes: Quiz[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as unknown as Quiz[];
    if (Array.isArray((data as any).quizzes)) return (data as any).quizzes as Quiz[];
    return [];
  }, [data]);

  const searchedQuizzes = useMemo(() => {
    if (!searchTerm) return allQuizzes;
    return allQuizzes.filter(
      (quiz) => typeof quiz.name === 'string' && quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allQuizzes, searchTerm]);

  const serverTotalPages = (data as any)?.pagination?.totalPages && Number((data as any).pagination.totalPages);
  const totalPages = useMemo(() => {
    if (serverTotalPages && !Number.isNaN(serverTotalPages)) return serverTotalPages;
    return Math.max(1, Math.ceil(searchedQuizzes.length / ITEMS_PER_PAGE));
  }, [serverTotalPages, searchedQuizzes.length]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const quizzesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return searchedQuizzes.slice(startIndex, endIndex);
  }, [searchedQuizzes, currentPage]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateTestFromModal = useCallback(
    async (details: ManualCreationDetails | AICreationDetails) => {
      try {
        let generatedQuestions: any[] | undefined;
        if ((details as AICreationDetails).mode === 'ai') {
          const ai = details as AICreationDetails;
          const fd = new FormData();
          fd.append('mode', 'quiz');
          if (ai.examTitle) fd.append('examTitle', ai.examTitle);
          if (ai.difficultyLevel) fd.append('difficultyLevel', ai.difficultyLevel);
          if (ai.topic) fd.append('topic', ai.topic);
          if (ai.questionConfigs) fd.append('questionConfigs', JSON.stringify(ai.questionConfigs));
          if (ai.documentFile) fd.append('file', ai.documentFile);

          const res = await fetch('/api/ai/summarize', { method: 'POST', body: fd });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error || 'AI generation failed');
          }
          const data = await res.json();
          generatedQuestions = Array.isArray(data?.questions) ? data.questions : undefined;
        }

        const response = await createQuiz({
          name: details.examTitle || 'Untitled Quiz',
          duration: '30',
          category: 'Uncategorized',
          questions: generatedQuestions || [],
          passingScore: 50,
          maxAttempts: 3,
        }).unwrap();

        toast({
          title: 'Quiz created!',
          description: `Quiz "${response.quiz!.name}" has been created.`,
          variant: 'success',
        });

        refetch();
        router.push(`/instructor/quizzes/builder/${response.quiz?._id}`);
      } catch {
        toast({
          title: 'Failed to create quiz',
          description: 'An error occurred while creating quiz.',
          variant: 'destructive',
        });
      }
    },
    [createQuiz, router, toast, refetch]
  );

  const handleOpenCreateModal = () => {
    showModal('createQuiz', {
      onSubmit: handleCreateTestFromModal,
    });
  };

  const renderQuizContent = () => {
    if (isLoading || isFetching) {
      return <Loading message="Loading quizzes..." size="md" className="min-h-[calc(100vh-200px)]" />;
    }

    if (quizzesForCurrentPage.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {quizzesForCurrentPage.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
        <SearchQuiz
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 h-[42px]"
        >
          <PlusCircle size={18} className="mr-1.5" />
          Create Quiz
        </button>
      </div>

      {renderQuizContent()}

      {totalPages > 1 && (
        <CommonPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default QuizListPage;
