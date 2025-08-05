"use client";

import React, { useState, useMemo } from "react";
import { CourseCard } from "./CourseCard";
import { useGetUserCoursesQuery } from "@/lib/redux/features/course/courseApi";
import { useGetInstructorCourseRequestsQuery } from "@/lib/redux/features/request/requestApi";
import Loading from "@/components/common/Loading";
import CoursePagination from "@/app/(unauth)/courses/_components/CoursePagination";

const ITEMS_PER_PAGE = 6;

const CourseCardGrid: React.FC = () => {
  const { data: courseData, isLoading: loadingCourses, isError } = useGetUserCoursesQuery();
  const { data: requestData, isLoading: loadingRequests } = useGetInstructorCourseRequestsQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const mergedCourses = useMemo(() => {
    if (!courseData?.data) return [];
    const requests = requestData?.data || [];
    return courseData.data.map((course) => {
      const req = requests.find((r: any) => r.courseId?._id === course._id);

      let status = "Draft";
      if (course.isPublished) status = "Published";
      if (req?.status === "pending") status = "Pending";
      if (req?.status === "rejected") status = "Rejected";

      return { ...course, status };
    });
  }, [courseData, requestData]);

  if (loadingCourses || loadingRequests) return <Loading />;
  if (isError || !courseData?.data)
    return <p className="text-center text-red-500">There is no course found!</p>;

  const totalPages = Math.ceil(mergedCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = mergedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Tạo placeholder để lấp đầy grid
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
            className="h-[250px]"
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CoursePagination
          page={currentPage}
          totalPages={totalPages}
          isFetching={loadingCourses || loadingRequests}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </section>
  );
};

export default CourseCardGrid;
