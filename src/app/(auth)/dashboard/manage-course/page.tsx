'use client'
import React, { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { CommonPagination } from '@/components/common/ui';
import { useGetCoursesQuery } from '@/lib/redux/features/course/courseApi';
import { Course } from '@/types/course';
import Image from 'next/image';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const CourseManagementPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [authorNames, setAuthorNames] = useState<{ [id: string]: string }>({});
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

    // API call
    const { data, isLoading, isError } = useGetCoursesQuery();
    const courses: Course[] = data?.courses || [];

    const coursesItemsPerPage = 6;
    const totalItems = courses.length;
    const totalPages = Math.ceil(totalItems / coursesItemsPerPage);
    const startIndex = (currentPage - 1) * coursesItemsPerPage;

    // Get current items
    const currentCourses = courses.slice(startIndex, startIndex + coursesItemsPerPage);

    useEffect(() => {
        const ids = currentCourses
            .map(course => course.publisher?._id || course.publisher?.name || (course as any).authorId?._id || (course as any).authorId?.name)
            .filter(Boolean);
        const idsToFetch = ids.filter(id => !(id in authorNames));
        if (idsToFetch.length === 0) return;
        Promise.all(
            idsToFetch.map(id =>
                fetch(`/api/users/${id}`)
                    .then(res => res.json())
                    .then(data => ({ id, name: data.name || 'N/A' }))
                    .catch(() => ({ id, name: 'N/A' }))
            )
        ).then(results => {
            setAuthorNames(prev => {
                const updated = { ...prev };
                results.forEach(({ id, name }) => {
                    updated[id] = name;
                });
                return updated;
            });
        });
    }, [currentCourses, authorNames]);


    // While checking/redirecting, render nothing (or your <Loading/>)
    if (!ready || role !== 'admin') return <Loading message="Redirecting..." className="min-h-screen" />;
    if (isLoading) return <Loading message="Loading courses..." className="min-h-screen" />;
    if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading courses.</div>;

    // If no courses found
    if (courses.length === 0) {
        return (
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header*/}
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Management</h1>
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
                        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Courses Found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            There are no courses to display.
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
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Management</h1>
                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-180">
                    {currentCourses.map((course) => {
                        const authorId = course.publisher?._id || (course as any).authorId?._id;
                        const authorName = course.publisher?.name || (course as any).authorId?.name || (authorId ? authorNames[authorId] || '...' : 'N/A');
                        return (
                            <div key={course._id} className="bg-white rounded-2xl h-90 shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-blue-100 flex flex-col">
                                {/* Banner Image */}
                                <div className="relative">
                                    <Image
                                        src={typeof course.thumbnail === 'string' ? course.thumbnail : (course.thumbnail?.url || '/assets/business/book.svg')}
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
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-4 h-4 flex items-center justify-center">
                                            <Image src="/assets/icons/blue-book.svg" alt="icon" width={16} height={16} />
                                        </span>
                                        <span className="text-xs text-blue-600 font-medium">
                                            {Array.isArray(course.tags)
                                                ? course.tags.join(', ')
                                                : (typeof course.tags === 'string' ? course.tags : '')}
                                        </span>
                                    </div>
                                    {/* Title */}
                                    <div className="font-bold text-base text-gray-900 mb-3 leading-tight line-clamp-2 min-h-[36px]">{course.name}</div>
                                    {/* Tag */}
                                    <div className="mb-2">
                                        <span className="text-xs text-gray-500">Tags: </span>
                                        <span className="text-xs text-gray-700">
                                            {Array.isArray(course.tags)
                                                ? course.tags.join(', ')
                                                : (typeof course.tags === 'string' ? course.tags : '')}
                                        </span>
                                    </div>
                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                                        {/* People */}
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">People</div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-800 font-semibold">
                                                    {authorName}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Creation Date */}
                                        <div className="items-end text-right flex flex-col justify-end">
                                            <div className="text-xs text-gray-500 mb-0.5">Creation Date</div>
                                            <div className="text-xs text-gray-800 font-semibold">{course.createdAt ? new Date(course.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</div>
                                        </div>
                                        {/* Sale */}
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">Sale</div>
                                            <div className="flex flex-col items-start">
                                                <span className="text-xs text-gray-400 line-through">{course.estimatedPrice ? course.estimatedPrice.toLocaleString('vi-VN') + ' VND' : 'N/A'}</span>
                                                <span className="text-lg text-blue-600 font-bold leading-tight">{course.price ? course.price.toLocaleString('vi-VN') + ' VND' : 'N/A'}</span>
                                            </div>
                                        </div>
                                        {/* Status */}
                                        <div className="flex flex-col items-end justify-end text-right">
                                            <div className="text-xs text-gray-500 mb-0.5 pr-11">Status</div>
                                            <button className="px-4 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors cursor-default min-w-[80px] text-center ml-0">
                                                {course.isPublished ? 'Published' : 'Pending'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Pagination - Always reserve space for consistent layout */}
                <div className="flex items-center justify-center">
                    {totalItems > coursesItemsPerPage && (
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
