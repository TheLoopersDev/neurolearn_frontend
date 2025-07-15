'use client'

import CourseCard, { mockCoursesData } from "@/components/business/CourseCard";


export default function MyCoursesListPage() {
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {mockCoursesData.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

    </div>
  );
}
