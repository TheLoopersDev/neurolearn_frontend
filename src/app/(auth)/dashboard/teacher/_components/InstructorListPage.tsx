// src/app/(auth)/dashboard/teacher/_components/InstructorListPage.tsx
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { User } from '@/types/user'; // Đảm bảo đường dẫn đúng
import InstructorCard from './InstructorCard';
import SearchInstructor from './SearchInstructor';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/common/ui/pagination'; // Đảm bảo đường dẫn đúng

const fetchInstructors = async (): Promise<User[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/users/get-instructors`, {
    credentials: 'include', // nếu cần cookie
  });
  const data = await res.json();
  return data.instructors || [];
};

const ITEMS_PER_PAGE = 6; // Hiển thị 6 card trên mỗi trang (vừa với lưới 3x2)

const InstructorListPage: React.FC = () => {
  const [allInstructors, setAllInstructors] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInstructors().then(setAllInstructors);
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
        <SearchInstructor
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          onFilterClick={() => {
            console.log('Filter clicked');
          }}
        />
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
