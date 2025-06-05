// app/(auth)/dashboard/create-quiz/_components/QuizListPage.tsx
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import { Quiz } from './types'; // Đảm bảo đường dẫn đúng
import QuizCard from './QuizCard';
// Import component Pagination của bạn
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/common/ui/pagination'; // <<-- ĐIỀU CHỈNH ĐƯỜNG DẪN NẾU CẦN

// --- Mockup hàm lấy danh sách quiz (giữ nguyên) ---
const fetchQuizzesFromStorage = (): Quiz[] => {
  if (typeof window !== 'undefined') {
    const storedQuizzes = localStorage.getItem('quizzes_v2');
    if (!storedQuizzes || JSON.parse(storedQuizzes).length === 0) {
      const demoQuizzes: Quiz[] = Array.from({ length: 25 }, (_, i) => ({
        // Tạo 25 quiz mẫu để test pagination
        id: `demo${i + 1}`,
        name: `Sample Quiz Title ${i + 1} - Advanced Web Topics`,
        questions: [],
        createdAt: `${String(i + 1).padStart(2, '0')} Jan, 2025`,
        examTitle: `QUIZ ${(i % 3) + 1}`,
        totalQuestions: 10 + (i % 5),
        duration: `${15 + (i % 4) * 15} Min`,
        progress: 20 + ((i * 3) % 80),
        imageUrl: `/assets/create-quiz/thumbnail.png`, // Sử dụng cùng một ảnh cho demo
        category: ['Grapic Design', 'Web Development', 'Data Science', 'UX Design', 'Marketing'][
          i % 5
        ],
      }));
      localStorage.setItem('quizzes_v2', JSON.stringify(demoQuizzes));
      return demoQuizzes;
    }
    return storedQuizzes ? JSON.parse(storedQuizzes) : [];
  }
  return [];
};
// -------------------------------------------------------------------

const ITEMS_PER_PAGE = 8; // <<-- Đặt số lượng quiz trên mỗi trang (ví dụ: 8 để vừa 2 cột x 4 hàng)

const QuizListPage: React.FC = () => {
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]); // Tất cả quiz từ storage
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại

  useEffect(() => {
    setAllQuizzes(fetchQuizzesFromStorage());
  }, []);

  // Lọc quiz dựa trên searchTerm
  const searchedQuizzes = useMemo(
    () => allQuizzes.filter(quiz => quiz.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [allQuizzes, searchTerm]
  );

  // Tính toán tổng số trang và các quiz cho trang hiện tại
  const totalPages = Math.ceil(searchedQuizzes.length / ITEMS_PER_PAGE);
  const quizzesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return searchedQuizzes.slice(startIndex, endIndex);
  }, [searchedQuizzes, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Tùy chọn: scroll lên đầu trang khi chuyển trang
    // window.scrollTo(0, 0);
  };

  // ---- Logic để render các nút số trang ----
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3; // Số lượng nút số trang tối đa hiển thị (không bao gồm previous/next/ellipsis)
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) {
      // Hiển thị tất cả nếu ít trang
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Luôn hiển thị trang 1
      if (currentPage > 1 + halfPagesToShow + 1) {
        // Kiểm tra xem có cần ellipsis sau trang 1 không
        pageNumbers.push(-1); // -1 đại diện cho ellipsis
      }

      let startPage = Math.max(2, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);

      if (currentPage - halfPagesToShow <= 2) {
        endPage = Math.min(totalPages - 1, 1 + maxPagesToShow - 1);
      }
      if (currentPage + halfPagesToShow >= totalPages - 1) {
        startPage = Math.max(2, totalPages - maxPagesToShow);
      }

      for (let i = startPage; i <= endPage; i++) {
        if (!pageNumbers.includes(i)) {
          // Tránh trùng lặp nếu startPage hoặc endPage gần 1 hoặc totalPages
          pageNumbers.push(i);
        }
      }

      if (currentPage < totalPages - halfPagesToShow - 1) {
        // Kiểm tra xem có cần ellipsis trước trang cuối không
        if (!pageNumbers.includes(totalPages - 1) && endPage < totalPages - 1) {
          // Đảm bảo không có ellipsis thừa
          pageNumbers.push(-1);
        }
      }
      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages); // Luôn hiển thị trang cuối
      }
    }
    return pageNumbers;
  };
  // ----------------------------------------

  return (
    <div className="w-full">
      {/* Header của trang List Quiz (giữ nguyên) */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
        {/* ... (Phần Search và Filter giữ nguyên) ... */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:w-auto lg:min-w-[300px] xl:min-w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
              }}
              className="block text-black w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white rounded-full shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 h-[42px]"
            />
          </div>
          <button
            className="
              flex items-center text-sm text-gray-700 bg-white
              border border-gray-300 
              px-4 py-2.5 rounded-full
              hover:bg-gray-50 shadow-sm 
              h-[42px]
              transition-colors duration-150 ease-in-out
              w-full sm:w-auto justify-center sm:justify-start flex-shrink-0
            "
          >
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
          <Link
            href="/dashboard/create-quiz/builder"
            className=" flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md h-[42px] whitespace-nowrap flex-shrink-0 "
          >
            <PlusCircle size={18} className="mr-1.5 flex-shrink-0" />
            Create Quiz
          </Link>
        </div>
      </div>

      {/* Danh sách các Quiz Cards */}
      {quizzesForCurrentPage.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
          {' '}
          {/* Responsive grid */}
          {quizzesForCurrentPage.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
          {/* ... (Phần "No quizzes found" giữ nguyên) ... */}
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
            {searchTerm
              ? 'Try adjusting your search or create a new quiz.'
              : 'Get started by creating a new quiz.'}
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/create-quiz/builder"
              className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle size={18} className="-ml-1 mr-2" />
              New Quiz
            </Link>
          </div>
        </div>
      )}

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination className="mt-8 sm:mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#" // Sẽ được xử lý bởi onClick
                onClick={e => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                // Tailwind class để vô hiệu hóa nút nếu ở trang đầu
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === -1 ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#" // Sẽ được xử lý bởi onClick
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
                href="#" // Sẽ được xử lý bởi onClick
                onClick={e => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                // Tailwind class để vô hiệu hóa nút nếu ở trang cuối
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default QuizListPage;
