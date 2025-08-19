'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CourseCardGrid from '@/app/(auth)/instructor/courses/create-course/_components/CourseCardGrid';
import Button from '@/components/dashboard/Button';
import SearchCourse from '@/components/dashboard/SearchCourse';
import { useSelector } from 'react-redux';

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const { user } = useSelector((state: any) => state.auth);
    const role = user?.role;
    const [ready, setReady] = useState(false);

    // Mark as client-ready to avoid hydration flicker
    useEffect(() => setReady(true), []);

    // Redirect when not instructor
    useEffect(() => {
        if (!ready) return;
        if (role !== 'instructor') {
            router.replace('/'); // send non-instructor to home
        }
    }, [ready, role, router]);


    const handleOpenCreateCourse = () => {
        router.push('/instructor/courses/create-course');
    };

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    // While checking/redirecting, render nothing (or your <Loading/>)
    if (!ready || role !== 'instructor') return null;

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
                <SearchCourse
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />
                <div className="flex w-full sm:w-auto justify-center sm:justify-end mt-4 sm:mt-0">
                    <div className="flex gap-2">
                        <Button onClick={handleOpenCreateCourse} label="New Course" />
                    </div>
                </div>
            </div>
            <CourseCardGrid searchTerm={searchTerm} />
        </div>
    );
}