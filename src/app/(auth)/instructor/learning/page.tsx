'use client';

import React from 'react';
import { useGetAllPurchasedCoursesQuery } from '@/lib/redux/features/course/courseApi';
import LearningCard from './_components/LearningCard';

export default function LearningPage() {
    const { data: courseData, isLoading: loadingCourses, isError } = useGetAllPurchasedCoursesQuery();
    console.log(courseData, 'LearningPage');

    if (loadingCourses) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (isError || !courseData?.data) {
        return <div className="min-h-screen flex items-center justify-center">Failed to load courses</div>;
    }

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {courseData?.data?.map((course: any) => (
                    <LearningCard key={course._id} course={course} />
                ))}
            </div>
        </div>
    );
}
