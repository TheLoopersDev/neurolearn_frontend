"use client";

import React, { useState, useMemo } from "react";
import { CourseCard } from "./CourseCard";
import { useGetUserCoursesQuery } from "@/lib/redux/features/course/courseApi";
import { useGetInstructorCourseRequestsQuery } from "@/lib/redux/features/request/requestApi";
import Loading from "@/components/common/Loading";

const ITEMS_PER_PAGE = 6;

interface CourseCardGridProps {
  searchTerm?: string;
}

const CourseCardGrid: React.FC<CourseCardGridProps> = ({ searchTerm = "" }) => {
  const { data: courseData, isLoading: loadingCourses, isError } = useGetUserCoursesQuery();
  const { data: requestData, isLoading: loadingRequests } = useGetInstructorCourseRequestsQuery();
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const mergedCourses = useMemo(() => {
    if (!courseData?.data) return [];
    const requests = requestData?.data || [];

    let courses = courseData.data.map((course) => {
      const req = requests.find((r: any) => r.courseId?._id === course._id);

      let status = "Draft";
      if (course.isPublished) status = "Published";
      if (req?.status === "pending") status = "Pending";
      if (req?.status === "rejected") status = "Rejected";

      return { ...course, status };
    });

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      courses = courses.filter((course) => {
        const courseName = course.name?.toLowerCase() || '';
        return courseName.includes(searchLower);
      });
    }
    return courses;
  }, [courseData, requestData, searchTerm]);

  if (loadingCourses || loadingRequests) return <Loading />;
  if (isError || !courseData?.data)
    return <p className="text-center text-red-500">There is no course found!</p>;

  if (searchTerm.trim() && mergedCourses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Không tìm thấy khóa học nào phù hợp với "{searchTerm}"</p>
        <p className="text-gray-400 text-sm mt-2">Hãy thử từ khóa khác</p>
      </div>
    );
  }

  const totalPages = Math.ceil(mergedCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = mergedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Tạo placeholder nếu ít hơn 6
  const placeholders = Array.from({
    length: Math.max(0, ITEMS_PER_PAGE - currentCourses.length),
  });

  return (
    <section className="w-full">
      <div className="grid grid-cols-3 gap-4 w-full">
        {currentCourses.map((course) => (
          <CourseCard key={course._id} course={course} status={(course as any).status} />
        ))}

        {placeholders.map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="h-[250px] "
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default CourseCardGrid;