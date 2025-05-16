"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types/course';

interface CourseCardProps {
  readonly course: Course;
  readonly isTeacher?: boolean;
  readonly onEdit?: (id: string) => void;
  readonly onDelete?: (id: string) => void;
  readonly onEnroll?: (id: string) => void;
}

export default function CourseCard({
  course,
  isTeacher = false,
  onEdit,
  onDelete,
  onEnroll,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative">
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-sm">
          Hot Sale!
        </div>
        <div className="relative h-40">
          <Image
            src={course.imageUrl || '/placeholder-course.jpg'}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute right-3 -bottom-4">
          <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
            <Image 
              src="/assets/home/Heart.svg" 
              alt="Favorite" 
              width={16} 
              height={16} 
            />
          </div>
        </div>
      </div>
      <div className="p-4 pt-6">
        <div className="flex items-center mb-1">
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-sm">
            {course.level ?? 'All Levels'}
          </span>
        </div>
        <h3 className="text-md font-medium mb-1">{course.title}</h3>
        <p className="text-xs text-gray-500 mb-2">
          By <span className="font-medium">{course.teacherName}</span>
        </p>
        <div className="flex items-center mb-3">
          {course.rating && (
            <div className="flex items-center">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-gray-300 text-xs">★</span>
              <span className="ml-1 text-xs text-gray-600">{course.rating.toFixed(1)}</span>
            </div>
          )}
          {course.totalStudents && (
            <span className="ml-auto text-xs text-gray-500">
              {course.totalStudents} students
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">${course.price.toFixed(2)}</span>
          <Link
            href={`/courses/${course.id}`}
            className="text-blue-600 text-xs"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
