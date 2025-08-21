'use client';

import React from 'react';
import { useParams } from 'next/navigation';
// import ReviewCourseHeader from './_components/ReviewCourseHeader';
import CourseInformationSection from './_components/CourseInformationSection';
import CourseCurriculumSection from './_components/CourseCurriculumSection';
import { useGetCourseByDetailQuery } from '@/lib/redux/features/course/courseApi';
import { useLessonsBySections } from '@/lib/redux/hooks';

interface Lesson {
    id: string;
    type: 'video' | 'document' | 'quiz';
    title: string;
    url?: string;
    thumbnail?: string;
}

interface Section {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface Course {
    title: string;
    category: string;
    skillLevel: string;
    tags: string[];
    originalPrice: number;
    salePrice?: number;
    description: string;
    thumbnail: string;
    curriculum: Section[];
}

const ReviewCoursePage: React.FC = () => {
    const { id: courseId } = useParams();

    // Fetch course info
    const {
        data: courseData,
        isLoading: loadingCourse,
        isError: errorCourse,
    } = useGetCourseByDetailQuery(courseId as string);

    // Fetch curriculum via custom hook
    const {
        curriculum,
        isLoading: loadingCurriculum,
        isError: errorCurriculum,
    } = useLessonsBySections(courseId as string);

    if (loadingCourse || loadingCurriculum) {
        return <div className="p-10 text-center">Đang tải khóa học...</div>;
    }

    if (errorCourse || errorCurriculum || !courseData?.courses) {
        return (
            <div className="p-10 text-center text-red-500">
                Không thể tải dữ liệu khóa học.
            </div>
        );
    }

    const courseInfo: Course = {
        title: courseData.courses.name,
        category: typeof courseData.courses.category === 'object' && courseData.courses.category !== null
            ? courseData.courses.category.title
            : courseData.courses.category || 'N/A',
        skillLevel: typeof courseData.courses.level === 'object' && courseData.courses.level !== null
            ? courseData.courses.level.name
            : courseData.courses.level || 'N/A',
        tags: Array.isArray(courseData.courses.tags)
            ? courseData.courses.tags
            : (typeof courseData.courses.tags === 'string'
                ? (courseData.courses.tags as string).split(',')
                : []),
        originalPrice: courseData.courses.estimatedPrice ?? 0,
        salePrice: courseData.courses.price,
        description: courseData.courses.description ?? '',
        thumbnail: courseData.courses.thumbnail?.url || '',
        curriculum,
    };

    return (
        <div className="min-h-screen bg-secondary p-8 font-sans">
            <div className="mx-auto max-w-6xl rounded-lg bg-background shadow-lg">
                {/* <ReviewCourseHeader /> */}

                <div className="p-8">
                    <CourseInformationSection course={courseInfo} />
                    <div className="my-8 h-px bg-gray-200" />
                    <CourseCurriculumSection curriculum={curriculum} />
                </div>
            </div>
        </div>
    );
};

export default ReviewCoursePage;
