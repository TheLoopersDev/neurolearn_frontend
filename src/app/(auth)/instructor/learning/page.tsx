'use client';

import React, { useState, useMemo } from 'react';
import { useGetAllPurchasedCoursesQuery } from '@/lib/redux/features/course/courseApi';
import LearningCard from './_components/LearningCard';
import Loading from '@/components/common/Loading';

const ITEMS_PER_PAGE = 6;

export default function LearningPage() {
    const { data: courseData, isLoading: loadingCourses, isError } = useGetAllPurchasedCoursesQuery();
    const [currentPage, setCurrentPage] = useState(1);
    console.log(courseData, 'LearningPage');

    const filteredCourses = useMemo(() => {
        if (!courseData?.data) return [];
        return courseData.data;
    }, [courseData]);

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (loadingCourses) {
        return <Loading message="Loading courses..." />;
    }

    if (isError || !courseData?.data) {
        return <div className="min-h-screen flex items-center justify-center">Failed to load courses</div>;
    }

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {currentCourses.map((course: any) => (
                    <LearningCard key={course._id} course={course} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-3">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-3 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
