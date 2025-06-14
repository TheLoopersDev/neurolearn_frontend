// src/app/(auth)/dashboard/teacher/_components/InstructorListPage.tsx
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import { User } from '@/types/user'; // Đảm bảo đường dẫn đúng
import InstructorCard from './InstructorCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/common/ui/pagination'; // Đảm bảo đường dẫn đúng

// --- Mockup hàm lấy danh sách giảng viên ---
const fetchInstructors = (): User[] => {
  return Array.from({ length: 25 }, (_, i) => ({
    _id: `instructor${i + 1}`,
    name: `Dao Tuan Kiet ${i + 1}`,
    email: `instructor${i + 1}@example.com`,
    role: 'instructor',
    profession: 'UX/UI DESIGNER',
    avatar: { url: '/assets/images/memoji-avatar-placeholder.png' },
    rating: 4.2 + (i % 8) / 10,
    student: 500 + i * 17,
  }));
};
// --------------------------------------------------

const ITEMS_PER_PAGE = 6; // Hiển thị 6 card trên mỗi trang (vừa với lưới 3x2)

const InstructorListPage: React.FC = () => {
  const [allInstructors, setAllInstructors] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setAllInstructors(fetchInstructors());
  }, []);

  const filteredInstructors = useMemo(
    () =>
      allInstructors.filter(instructor =>
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [allInstructors, searchTerm]
  );

  const totalPages = Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE);
  const instructorsForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredInstructors.slice(startIndex, endIndex);
  }, [filteredInstructors, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Tùy chọn: cuộn lên đầu khi chuyển trang
      // window.scrollTo(0, 0);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = new Set<number>();
    pageNumbers.add(1);
    pageNumbers.add(totalPages);
    if (currentPage > 1) pageNumbers.add(currentPage - 1);
    pageNumbers.add(currentPage);
    if (currentPage < totalPages) pageNumbers.add(currentPage + 1);

    const sortedPages = Array.from(pageNumbers)
      .filter(p => p > 0 && p <= totalPages)
      .sort((a, b) => a - b);
    const finalPages: (number | string)[] = [];
    let lastPage = 0;

    for (const page of sortedPages) {
      if (lastPage !== 0 && page > lastPage + 1) {
        finalPages.push('...');
      }
      finalPages.push(page);
      lastPage = page;
    }
    return finalPages;
  };

  return (
    // Bỏ các class nền và padding lớn, vì layout cha đã có
    <div className="w-full">
      {/* Header của trang List */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:w-auto lg:min-w-[300px] xl:min-w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block text-black w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 h-[42px]"
            />
          </div>
          <button className="flex items-center text-sm text-gray-700 bg-white border border-gray-200 px-4 py-2.5 rounded-full hover:bg-gray-50 h-[42px] transition-colors w-full sm:w-auto justify-center">
            <SlidersHorizontal size={16} className="mr-2 text-gray-500 flex-shrink-0" />
            <span className="whitespace-nowrap">All categories</span>
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
            href="#"
            className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md h-[42px] whitespace-nowrap flex-shrink-0"
          >
            <PlusCircle size={18} className="mr-1.5 flex-shrink-0" />
            Add Instructor
          </Link>
        </div>
      </div>

      {/* Lưới hiển thị các Instructor Cards */}
      {instructorsForCurrentPage.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorsForCurrentPage.map(instructor => (
              <InstructorCard key={instructor._id} instructor={instructor} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8 sm:mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === '...' ? (
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
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
          <h3 className="mt-2 text-lg font-semibold text-gray-800">No Instructors Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search.' : 'There are no instructors to display.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default InstructorListPage;
