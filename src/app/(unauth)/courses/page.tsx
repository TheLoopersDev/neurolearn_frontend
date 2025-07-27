'use client';

import React from 'react';
import FilterSection from './_components/FilterSection';
import CourseGrid from './_components/CourseGrid';
import Loading from '@/components/common/Loading';
import { useGetCoursesQuery } from '@/lib/redux/features/course/courseApi';

const CoursesPage: React.FC = () => {
    const { data, isLoading, isError } = useGetCoursesQuery();

    if (isLoading) return <Loading title="Đang tải danh sách khóa học..." />;
    if (isError) return <div className="text-red-500 text-center mt-10">Không thể tải khóa học. Vui lòng thử lại sau.</div>;

    const courses = data?.courses ?? [];

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Courses</h1>

                <FilterSection />

                <CourseGrid courses={courses} />

                {/* Phân trang - Nếu bạn có dữ liệu `totalPages`, bạn có thể cập nhật thêm ở đây */}
                <div className="flex justify-center items-center mt-8">
                    <button className="px-4 py-2 mx-1 rounded-full text-gray-500 hover:bg-gray-200">&larr;</button>
                    <button className="px-4 py-2 mx-1 rounded-full bg-blue-600 text-white">1</button>
                    <button className="px-4 py-2 mx-1 rounded-full text-gray-500 hover:bg-gray-200">2</button>
                    <span className="mx-2">...</span>
                    <button className="px-4 py-2 mx-1 rounded-full text-gray-500 hover:bg-gray-200">&rarr;</button>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;
