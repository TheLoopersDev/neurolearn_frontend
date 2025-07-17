'use client'
import React, { useState, useEffect } from 'react';
import {
  Search, Eye, Trash2, MoreHorizontal,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useGetCoursesQuery } from '@/lib/redux/features/course/courseApi';
import { Course } from '@/types/course';
import Image from 'next/image';

const categories = ['All courses', 'UI/UX', 'Development', 'Data Science', 'Marketing', 'Creative'];

const CourseManagementSystem: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All courses');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'request' | 'courses'>('request');
  const [authorNames, setAuthorNames] = useState<{ [id: string]: string }>({});

  // API call
  const { data, isLoading, isError } = useGetCoursesQuery();
  const courses: Course[] = data?.courses || [];

  // Debug log
  console.log('courses from API:', courses);

  // Filter and map data
  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const categoryName = typeof course.category === 'string' ? course.category : course.category?.title || '';
    const matchesCategory = selectedCategory === 'All courses' || categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Debug log
  console.log('filteredCourses:', filteredCourses);

  const requestItemsPerPage = 10;
  const coursesItemsPerPage = 9;
  const itemsPerPage = activeTab === 'request' ? requestItemsPerPage : coursesItemsPerPage;
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const ids = currentCourses
      .map(course => course.author?._id || (course as any).authorId?._id)
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

  const handleDeleteCourse = (courseId: string) => {
  // TODO: Implement delete logic with API
    console.log(`Deleting course with ID: ${courseId}`);
  };

  const handleViewProgress = (courseId: string) => {
  // TODO: Implement view progress logic
    console.log(`Viewing progress for course ID: ${courseId}`);
  };

  const handleTabChange = (tab: 'request' | 'courses') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pageNumbers = new Set<number>();
      pageNumbers.add(1);
      pageNumbers.add(totalPages);
      if (currentPage > 1) pageNumbers.add(currentPage - 1);
      pageNumbers.add(currentPage);
      if (currentPage < totalPages) pageNumbers.add(currentPage + 1);

      const sortedPages = Array.from(pageNumbers)
        .filter(p => p > 0 && p <= totalPages)
        .sort((a, b) => a - b);
      const finalPages: (number | string)[] = [];
      let lastPage = 0;

      for (const page of sortedPages) {
        if (lastPage !== 0 && page > lastPage + 1) {
          finalPages.push('...');
        }
        finalPages.push(page);
        lastPage = page;
      }
      return finalPages;
    };

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => {
              if (typeof page === 'number') {
                setCurrentPage(page);
              }
            }}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              currentPage === page
                ? 'text-blue-600 bg-blue-50 border border-blue-300'
                : page === '...'
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading courses.</div>;

  // Nếu filteredCourses rỗng, hiển thị số lượng courses lấy được để debug
  if (filteredCourses.length === 0) {
    return <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">Không có khóa học nào phù hợp.<br />Tổng số khóa học lấy được từ API: {courses.length}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Search and Filters */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                className="pl-12 pr-4 py-3 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-80"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-gray-50 rounded-full px-6 py-3 pr-10 border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${
                activeTab === 'request' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => handleTabChange('request')}
            >
              Request
            </button>
            <button
              className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${
                activeTab === 'courses' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => handleTabChange('courses')}
            >
              Courses
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse The Course</h1>

        {/* Tab content */}
        {activeTab === 'request' ? (
          <>
            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="col-span-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">Instructor</div>
                <div className="col-span-3 text-sm font-semibold text-gray-600 uppercase tracking-wide ml-4">Course Title</div>
                <div className="col-span-2 text-sm font-semibold text-gray-600 uppercase tracking-wide ml-4">Category</div>
                <div className="col-span-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">Request Date</div>
                <div className="col-span-1 text-sm font-semibold text-gray-600 uppercase tracking-wide">Progress</div>
                <div className="col-span-1 text-sm font-semibold text-gray-600 uppercase tracking-wide"></div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-50">
                {currentCourses.map((course, index) => (
                  <div key={course._id} className={`grid grid-cols-12 gap-4 px-6 py-6 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    {/* Instructor */}
                    <div className="col-span-3 flex items-center gap-3">
                      <Image 
                        src={course.author?.avatar?.url || 'https://via.placeholder.com/56'} 
                        alt="avatar"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" 
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{authorNames[course.author?._id || (course as any).authorId?._id] || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{course.author?.email || 'N/A'}</div>
                      </div>
                    </div>
                    {/* Course Title */}
                    <div className="col-span-3 flex items-center ml-4">
                      <div className="font-medium text-gray-900 line-clamp-2">{course.name}</div>
                    </div>
                    {/* Category */}
                    <div className="col-span-2 flex items-center ml-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {Array.isArray(course.tags)
                          ? course.tags.join(', ')
                          : (typeof course.tags === 'string' ? (course.tags as string).split(',').map(tag => tag.trim()).join(', ') : '')}
                      </span>
                    </div>
                    {/* Request Date */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-gray-700 font-medium">{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    {/* Progress (Eye Icon) */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button 
                        onClick={() => handleViewProgress(course._id)}
                        className="p-2 rounded-full hover:bg-blue-50 transition-colors group"
                        title="View Progress"
                      >
                        <Eye className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                      </button>
                    </div>
                    {/* Actions (Delete Icon) */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button 
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-2 rounded-full hover:bg-orange-50 transition-colors group"
                        title="Delete Course"
                      >
                        <Trash2 className="w-5 h-5 text-orange-400 group-hover:text-orange-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Grid card view for Courses tab
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => {
                const authorId = course.author?._id || (course as any).authorId?._id;
                const authorName = authorId ? authorNames[authorId] || '...' : 'N/A';
                return (
                  <div key={course._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-blue-100 p-0 flex flex-col">
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-4 h-4 flex items-center justify-center">
                          <Image src="/assets/icons/blue-book.svg" alt="icon" width={16} height={16} />
                        </span>
                        <span className="text-xs text-blue-600 font-medium">
                          {Array.isArray(course.tags)
                            ? course.tags.join(', ')
                            : (typeof course.tags === 'string' ? (course.tags as string).split(',').map(tag => tag.trim()).join(', ') : '')}
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
                            : (typeof course.tags === 'string' ? (course.tags as string).split(',').map(tag => tag.trim()).join(', ') : '')}
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
                          <div className="text-xs text-gray-800 font-semibold">{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        {/* Sale */}
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Sale</div>
                          <div className="flex flex-col items-start">
                            <span className="text-xs text-gray-400 line-through">{course.estimatedPrice ? course.estimatedPrice.toLocaleString('vi-VN') + ' VND' : ''}</span>
                            <span className="text-lg text-blue-600 font-bold leading-tight">{course.price ? course.price.toLocaleString('vi-VN') + ' VND' : ''}</span>
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
        )}

        {/* Pagination */}
        <PaginationComponent />
      </div>
    </div>
  );
};

export default CourseManagementSystem;