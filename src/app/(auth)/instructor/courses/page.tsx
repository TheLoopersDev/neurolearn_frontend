'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CourseCardGrid from '@/app/(auth)/instructor/courses/create-course/_components/CourseCardGrid';
import Button from '@/components/dashboard/Button';
import SearchCourse from '@/components/dashboard/SearchCourse';

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleOpenCreateCourse = () => {
        router.push('/dashboard/instructor/courses/create-course');
    };

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleFilterClick = () => {
        console.log('Filter clicked');
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <SearchCourse
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onFilterClick={handleFilterClick}
                />
                <div className="flex w-full sm:w-auto justify-center sm:justify-end mt-4 sm:mt-0">
                    <Button onClick={handleOpenCreateCourse} label="New Course" />
                </div>
            </div>
            <CourseCardGrid searchTerm={searchTerm} />
        </>
    );
}
