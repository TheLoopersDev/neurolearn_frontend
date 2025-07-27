// components/courses/CoursePagination.tsx
import React from "react";

interface CoursePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CoursePagination: React.FC<CoursePaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Number of page buttons to show around the current page

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

            if (endPage - startPage + 1 < maxPagesToShow) {
                if (startPage === 1) {
                    endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                } else if (endPage === totalPages) {
                    startPage = Math.max(1, totalPages - maxPagesToShow + 1);
                }
            }

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push("...");
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push("...");
                }
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-2 mt-10">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                Trước
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((pageNumber, index) => (
                <React.Fragment key={index}>
                    {typeof pageNumber === "number" ? (
                        <button
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors duration-200
                                ${pageNumber === currentPage
                                    ? "bg-black text-white shadow-md" // Active state: black background, white text
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Inactive state
                                }`}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ) : (
                        <span className="w-10 h-10 flex items-center justify-center text-gray-700">
                            {pageNumber}
                        </span>
                    )}
                </React.Fragment>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                Tiếp
            </button>
        </div>
    );
};

export default CoursePagination;