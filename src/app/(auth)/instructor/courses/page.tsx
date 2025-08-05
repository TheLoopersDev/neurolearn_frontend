'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CourseCardGrid from '@/components/dashboard/instructor-course/CourseCardGrid';
import Button from '@/components/dashboard/Button';

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleOpenCreateCourse = () => {
        router.push('/dashboard/instructor/courses/create-course');
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4 w-full">
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4">
                    <div className="relative w-full sm:flex-1 lg:min-w-[300px] xl:min-w-[400px]">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
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
                    <Button onClick={handleOpenCreateCourse} label="New Course" />
                </div>
            </div>

            <CourseCardGrid />
        </>
    );
}
