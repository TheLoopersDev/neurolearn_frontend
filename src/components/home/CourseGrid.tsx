"use client";

import { Course } from '@/types/course';
import CourseCard from '@/components/common/CourseCard';

interface CourseGridProps {
  title: string;
  courses: Course[];
}

const CourseGrid = ({ title, courses }: CourseGridProps) => {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-medium mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseGrid;