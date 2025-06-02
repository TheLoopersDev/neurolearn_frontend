import React, { useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCoursesQuery, useSearchCoursesQuery } from '@/lib/redux/features/course/courseApi';
import { setCourses, setLoading, setError, setFilters } from '@/lib/redux/features/course/courseSlice';
import type { RootState } from '@/lib/redux/store';
import { Course } from '@/lib/redux/features/course/courseSlice';

const CourseList: React.FC = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.course);
  
  const { data: courses, isLoading, error } = useGetCoursesQuery();
  const { data: searchResults } = useSearchCoursesQuery({
    search: filters.search,
    category: filters.category || undefined,
    level: filters.level || undefined,
  });

  useEffect(() => {
    if (courses) {
      dispatch(setCourses(courses));
    }
  }, [courses, dispatch]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (error) {
      dispatch(setError(error.toString()));
    }
  }, [isLoading, error, dispatch]);

  const handleSearch = (searchTerm: string) => {
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleFilterChange = (category: string | null, level: string | null) => {
    dispatch(setFilters({ category, level }));
  };

  const displayCourses = filters.search ? searchResults : courses;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full p-2 border rounded"
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="mt-4 flex gap-4">
          <select
            className="p-2 border rounded"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange(e.target.value || null, filters.level)}
          >
            <option value="">All Categories</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
          <select
            className="p-2 border rounded"
            value={filters.level || ''}
            onChange={(e) => handleFilterChange(filters.category, e.target.value || null)}
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCourses?.map((course: Course) => (
          <div key={course.id} className="border rounded-lg overflow-hidden shadow-lg">
            <div className="relative w-full h-48">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${course.price}</span>
                <span className="text-sm text-gray-500">
                  {course.totalStudents} students
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {course.totalLessons} lessons
                </span>
                <span className="text-sm text-gray-500">
                  {course.duration} hours
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList; 