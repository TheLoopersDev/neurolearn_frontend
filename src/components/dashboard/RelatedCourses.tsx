'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/types/course';
import CourseCard from '../common/CourseCard';

interface RelatedCoursesProps {
    title?: string;
    viewAllHref?: string;
    courses: Course[];
}

export default function RelatedCourses({
    title = 'Related Courses',
    viewAllHref = '/courses',
    courses,
}: RelatedCoursesProps) {
    return (
        <div className="w-full bg-white rounded-2xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-black">{title}</h2>
                <Link href={viewAllHref} className="text-blue-600 text-sm font-medium hover:underline">
                    View all
                </Link>
            </div>

            {/* Courses Scroll */}
            <div className="flex gap-4">
                {courses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </div>
        </div>
    );
}
