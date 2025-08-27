'use client'
import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Search } from 'lucide-react';
import { CommonPagination } from '@/components/common/ui';
import { useGetPublishedCoursesForAdminQuery } from '@/lib/redux/features/course/courseApi';
import { Course } from '@/types/course';
import Image from 'next/image';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const CourseManagementPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const { user } = useSelector((state: any) => state.auth);
    const role = user?.role;
    const [ready, setReady] = useState(false);

    // Mark as client-ready to avoid hydration flicker
    useEffect(() => setReady(true), []);

    // Redirect when not admin
    useEffect(() => {
        if (!ready) return;
        if (role === undefined) return;
        if (role !== 'admin') {
            router.replace('/'); // send non-admin to home
        }
    }, [ready, role, router]);

    // API call with filters
    const { data, isLoading, isError } = useGetPublishedCoursesForAdminQuery({
        search: searchTerm || undefined,
    });

    const courses: Course[] = data?.data || [];
    const totalCourses = data?.totalCourses || 0;

    const coursesItemsPerPage = 6;
    const totalPages = Math.ceil(totalCourses / coursesItemsPerPage);
    const startIndex = (currentPage - 1) * coursesItemsPerPage;

    // Get current items
    const currentCourses = courses.slice(startIndex, startIndex + coursesItemsPerPage);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (!ready || role !== 'admin') return <Loading message="Redirecting..." className="min-h-screen" />;
    if (isLoading) return <Loading message="Loading published courses..." className="min-h-screen" />;
    if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading courses.</div>;

    // If no courses found
    if (courses.length === 0) {
        return (
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Management</h1>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
                        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Published Courses Found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Try adjusting your search criteria.' : 'There are no published courses to display.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Courses Management</h1>
                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCourses.map((course) => {
                        const authorName = (course as any).authorId?.name || course.publisher?.name || 'N/A';
                        const categoryName = typeof course.category === 'object' && course.category ? course.category.title : 'N/A';
                        const subCategoryName = typeof course.subCategory === 'object' && course.subCategory ? course.subCategory.title : 'N/A';
                        const levelName = typeof course.level === 'object' && course.level ? course.level.name : 'N/A';

                        return (
                            <div key={course._id} className="bg-white rounded-2xl min-h-[300px] shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-blue-100 flex flex-col">
                                {/* Banner Image */}
                                <div className="relative">
                                    <Image
                                        src={course.thumbnail?.url || '/assets/business/book.svg'}
                                        alt="Course Banner"
                                        width={1280}
                                        height={320}
                                        className="w-full h-32 object-cover rounded-t-2xl border-b-2 border-blue-100"
                                    />
                                    {/* More button */}
                                    <button className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-gray-100">
                                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                                {/* Card Content */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    {/* Category */}
                                    <div className="flex items-center">
                                        <span className="w-4 h-4 flex items-center justify-center">
                                            <Image src="/assets/icons/blue-book.svg" alt="icon" width={16} height={16} />
                                        </span>
                                        <span className="text-xs text-blue-600 font-medium">
                                            {categoryName} {subCategoryName !== 'N/A' && subCategoryName !== categoryName ? `> ${subCategoryName}` : ''}
                                        </span>
                                    </div>
                                    {/* Title */}
                                    <div className="font-bold text-base text-gray-900 leading-tight line-clamp-2 min-h-[36px]">{course.name}</div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                                        {/* Author */}
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">Author</div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-800 font-semibold">
                                                    {authorName}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Level */}
                                        <div className="items-end text-right flex flex-col justify-end">
                                            <div className="text-xs text-gray-500 mb-0.5">Level</div>
                                            <div className="text-xs text-gray-800 font-semibold">{levelName}</div>
                                        </div>
                                        {/* Price */}
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">Price</div>
                                            <div className="flex flex-col items-start">
                                                {course.estimatedPrice && course.price && course.estimatedPrice > course.price && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {course.estimatedPrice.toLocaleString('vi-VN')} VND
                                                    </span>
                                                )}
                                                <span className="text-lg text-blue-600 font-bold leading-tight">
                                                    {course.isFree ? 'Free' : `${(course.price || 0).toLocaleString('vi-VN')} VND`}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Stats */}
                                        <div className="flex flex-col items-end justify-end text-right">
                                            <div className="text-xs text-gray-500 mb-0.5">Stats</div>
                                            <div className="text-xs text-gray-800 font-semibold">
                                                ⭐ {course.rating?.toFixed(1) || '0.0'} ({course.reviews?.length || 0})
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                📚 {course.purchased || 0} students
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer: Created date and Published status aligned */}
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            Created: {course.createdAt ? new Date(course.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                        </div>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                                            Published
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination - Always reserve space for consistent layout */}
                <div className="flex items-center justify-center mt-8">
                    {totalCourses > coursesItemsPerPage && (
                        <CommonPagination
                            page={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseManagementPage;
