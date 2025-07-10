"use client";

import React, { useState } from "react";
import { CourseCard } from "./CourseCard";
import { Course } from "@/types/course";
import { useGetUserCoursesQuery } from "@/lib/redux/features/course/courseApi";
import Loading from "@/components/common/Loading";

const ITEMS_PER_PAGE = 6;

const CourseCardGrid: React.FC = () => {
  const { data, isLoading, isError } = useGetUserCoursesQuery();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;

  if (isError || !data?.data)
    return <p className="text-center text-red-500">There is no course found!</p>;

  const courses: Course[] = data.data;
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = courses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section>
      <div className="flex flex-wrap gap-3 items-center w-full">
        {currentCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* Pagination Controls */}
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
    </section>
  );
};

export default CourseCardGrid;
